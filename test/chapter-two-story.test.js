import { settleAchievementRewards } from "../src/game/achievements.js";
import assert from "node:assert/strict";
import test from "node:test";
import { acceptMission, abandonMission, claimMission, missionBoard } from "../src/game/missionSystem.js";
import { advanceChapterTwoPresentation, chapterTwoStoryModel, normalizeChapterTwoPresentation } from "../src/game/chapterTwoStory.js";
import { createSave, normalizeSave } from "../src/game/saveStore.js";
import { recordCompletedQso } from "../src/qso/qsoLog.js";
import { chapterForScreen } from "../src/media/chapterMediaCatalog.js";
import { isWorldCalendarGameplayActive } from "../src/game/worldCalendarHeartbeat.js";

const ACCEPTED = "2026-10-04T10:00:00.000Z";
const COMPLETED = "2026-10-04T10:05:00.000Z";
export function log(overrides = {}) {
  return { id: "chapter-two-real-qso", playerCallsign: "BH1TEST", callsign: "SIM3RA",
    startedAt: "2026-10-04T10:02:00.000Z", completedAt: COMPLETED, sent: "579", received: "559",
    location: "CN-E", distanceKm: 1500, frequencyMhz: 21.06, mode: "CW", finalPropagationLevel: 3,
    equipmentId: "squid-01", antennaId: "dipole", accessoryId: "none", wpm: 18,
    operatorProfileId: "patient-mentor", copyOutcome: "copied", transmitAccuracy: 95, keyingScore: 90,
    repeatRequests: 1, attemptHistory: [{ message: "AGN K", result: "repeat", phase: "PLAYER_RST_AND_73" }], ...overrides };
}
export function unlocked() {
  let save = acceptMission(createSave({ callsign: "BH1TEST" }), "story-01", "2026-10-04T09:00:00.000Z").save;
  save = recordCompletedQso(save, log({ id: "chapter-one-qso", startedAt: "2026-10-04T09:01:00.000Z", completedAt: "2026-10-04T09:05:00.000Z", attemptHistory: [], repeatRequests: 0 })).save;
  const result = claimMission(save, "story-01", "2026-10-04T09:06:00.000Z");
  assert.equal(result.claimed, true);
  return result.save;
}
export function accepted() { return acceptMission(unlocked(), "story-02", ACCEPTED).save; }
export function completed(save = accepted(), overrides = {}) { return recordCompletedQso(save, log(overrides)).save; }

test("chapter two migration adds only a bookmark and preserves old progress and balances", () => {
  for (const original of [createSave({ callsign: "BH1TEST" }), unlocked(), claimMission(completed(), "story-02").save]) {
    delete original.chapterTwoPresentation;
    const migrated = normalizeSave(original);
    assert.deepEqual(migrated.chapterTwoPresentation, normalizeChapterTwoPresentation(null));
    assert.equal(migrated.money, original.money);
    assert.equal(migrated.technologyPoints, original.technologyPoints);
    assert.deepEqual(migrated.missionState, original.missionState);
    assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(migrated))), migrated);
  }
});

test("chapter two stays locked before chapter one and opens only after acceptance", () => {
  const fresh = createSave({ callsign: "BH1TEST" });
  assert.equal(chapterTwoStoryModel(fresh).status, "locked");
  assert.equal(advanceChapterTwoPresentation(fresh, "margin").updated, false);
  assert.equal(chapterTwoStoryModel(unlocked()).status, "available");
  assert.equal(advanceChapterTwoPresentation(unlocked(), "margin").updated, false);
  let save = accepted();
  const money = save.money;
  for (const beat of ["call", "answer", "log"]) assert.equal(advanceChapterTwoPresentation(save, beat).updated, false);
  save = advanceChapterTwoPresentation(save, "margin").save;
  save = advanceChapterTwoPresentation(save, "call").save;
  assert.equal(chapterTwoStoryModel(normalizeSave(JSON.parse(JSON.stringify(save)))).step, 2);
  assert.strictEqual(advanceChapterTwoPresentation(save, "call").save, save);
  assert.equal(advanceChapterTwoPresentation(save, "answer").updated, false);
  assert.equal(save.money, money);
});

test("chapter two bookmarks reject accessors, inherited properties and oversized IDs", () => {
  for (const value of [Object.create({ acceptedAt: ACCEPTED, beat: "log", qsoId: "forged" }), { get acceptedAt() { throw new Error("must not execute"); } }]) {
    assert.deepEqual(normalizeChapterTwoPresentation(value), normalizeChapterTwoPresentation(null));
  }
  assert.equal(normalizeChapterTwoPresentation({ acceptedAt: ACCEPTED, beat: "fake" }).beat, "paper");
  assert.equal(normalizeChapterTwoPresentation({ acceptedAt: ACCEPTED, beat: "log", qsoId: "x".repeat(97) }).qsoId, null);
});

test("chapter two requires an actual successful AGN K attempt to SIM3RA", () => {
  const variants = [
    { attemptHistory: [], repeatRequests: 5 },
    { attemptHistory: [{ message: "QRS K", result: "repeat" }] },
    { attemptHistory: [{ message: "AGN K", result: "rejected" }] },
    { attemptHistory: [{ message: "AGN", result: "repeat" }] },
    { callsign: "SIM6JP" },
  ];
  for (const overrides of variants) {
    const save = completed(accepted(), overrides);
    assert.equal(chapterTwoStoryModel(save).status, "active");
    assert.equal(chapterTwoStoryModel(save).candidate, null);
    assert.equal(advanceChapterTwoPresentation(save, "log").updated, false);
    assert.equal(claimMission(save, "story-02").claimed, false);
  }
  assert.equal(chapterTwoStoryModel(completed()).candidate.id, log().id);
});

test("chapter two ending matches saved log, settlement ledger, mission event and exact facts", () => {
  const good = completed();
  assert.equal(chapterTwoStoryModel(good).step, 3);
  const changeLog = changes => ({ ...good, qsoLogs: good.qsoLogs.map(entry => entry.id === log().id ? { ...entry, ...changes } : entry) });
  const changeEvent = changes => ({ ...good, missionState: { ...good.missionState, events: good.missionState.events.map(event => event.qsoId === log().id ? { ...event, ...changes } : event) } });
  const variants = [
    { ...good, qsoLogs: good.qsoLogs.filter(entry => entry.id !== log().id) },
    { ...good, qsoRecords: { ...good.qsoRecords, settledQsoIds: [] } },
    { ...good, missionState: { ...good.missionState, events: [] } },
    changeLog({ eventId: "other-event" }), changeLog({ eventRunId: "other-run" }),
    changeLog({ completedAt: "2026-10-04T09:59:00.000Z" }),
    changeLog({ callsign: "SIM6JP" }), changeLog({ received: "" }),
    changeLog({ sent: "999" }), changeLog({ frequencyMhz: "21.06" }), changeLog({ frequencyMhz: NaN }),
    changeLog({ frequencyMhz: 0 }), changeLog({ attemptHistory: [] }),
    changeEvent({ callsign: "SIM6JP" }), changeEvent({ occurredAt: "2026-10-04T10:06:00.000Z" }),
    changeEvent({ outcome: "failure" }),
  ];
  for (const variant of variants) {
    assert.equal(chapterTwoStoryModel(variant).candidate, null);
    assert.equal(advanceChapterTwoPresentation(variant, "log").updated, false);
  }
});

test("chapter two excludes pre-acceptance and baseline logs and resets an abandoned bookmark", () => {
  let save = advanceChapterTwoPresentation(accepted(), "margin").save;
  save = advanceChapterTwoPresentation(save, "call").save;
  save = completed(save);
  save = advanceChapterTwoPresentation(save, "log").save;
  save = abandonMission(save, "story-02").save;
  save = acceptMission(save, "story-02", "2026-10-04T11:00:00.000Z").save;
  assert.equal(chapterTwoStoryModel(save).step, 0);
  assert.equal(chapterTwoStoryModel(save).candidate, null);
  // Even a later timestamp cannot make a baseline QSO a new contact.
  const baseline = save.qsoLogs.find(entry => entry.id === log().id);
  baseline.completedAt = "2026-10-04T11:05:00.000Z";
  assert.equal(chapterTwoStoryModel(save).candidate, null);
});

test("chapter two selects the qualifying contact, retains it across reload and awards once", () => {
  let save = completed(accepted(), { id: "unrelated", callsign: "SIM6JP" });
  save = completed(save, { completedAt: "2026-10-04T10:06:00.000Z" });
  const qsoMoney = save.money;
  const qsoPoints = save.technologyPoints;
  assert.equal(chapterTwoStoryModel(save).candidate.id, log().id);
  assert(!save.knownOperatorNames.includes("MORSE"));
  save = advanceChapterTwoPresentation(save, "log").save;
  assert.equal(save.money, qsoMoney);
  assert.equal(save.technologyPoints, qsoPoints);
  const claimed = claimMission(save, "story-02", "2026-10-04T10:07:00.000Z");
  assert.equal(claimed.claimed, true);
  assert.equal(claimed.moneyAwarded, 220);
  assert.equal(claimed.technologyPointsAwarded, 1);
  const reloaded = normalizeSave(JSON.parse(JSON.stringify(claimed.save)));
  const model = chapterTwoStoryModel(reloaded);
  assert.equal(model.status, "claimed");
  assert.equal(model.step, 4);
  assert.equal(model.candidate.callsign, "SIM3RA");
  assert.equal(model.candidate.sent, "579");
  assert.equal(model.candidate.received, "559");
  assert.equal(missionBoard(reloaded).story[2].status, "available");
  assert(reloaded.knownOperatorNames.includes("MORSE"));
  assert.strictEqual(claimMission(reloaded, "story-02").save, reloaded);
  assert.strictEqual(advanceChapterTwoPresentation(reloaded, "log").save, reloaded);
  assert.equal(reloaded.money, qsoMoney + 220);
  assert.equal(reloaded.technologyPoints, qsoPoints + 1);
});

test("chapter two presentation uses its own media and save-backed world clock", () => {
  assert.equal(chapterForScreen("chapter-two", accepted()), 2);
  assert.equal(isWorldCalendarGameplayActive({ activeSaveId: "two", screen: "chapter-two" }), true);
  assert.equal(isWorldCalendarGameplayActive({ activeSaveId: null, screen: "chapter-two" }), false);
});

test("chapter two claim keeps the existing first-name achievement as a separate one-time reward", () => {
  const before = settleAchievementRewards(completed()).save;
  const mission = claimMission(before, "story-02");
  const achievements = settleAchievementRewards(mission.save);
  assert.equal(mission.moneyAwarded, 220);
  assert.deepEqual(achievements.newlyAwarded.map(item => item.id), ["first-name"]);
  assert.equal(achievements.moneyAwarded, 100);
  assert.equal(achievements.save.money, before.money + 320);
  assert.equal(achievements.save.technologyPoints, before.technologyPoints + 1);
  const reloaded = normalizeSave(JSON.parse(JSON.stringify(achievements.save)));
  assert.equal(claimMission(reloaded, "story-02").claimed, false);
  assert.equal(settleAchievementRewards(reloaded).moneyAwarded, 0);
  assert.equal(settleAchievementRewards(reloaded).save.money, achievements.save.money);
});
