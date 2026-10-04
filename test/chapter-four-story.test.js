import assert from "node:assert/strict";
import test from "node:test";
import { acceptMission, abandonMission, claimMission, missionBoard } from "../src/game/missionSystem.js";
import { advanceChapterFourPresentation, chapterFourStoryModel, chapterFourRecovery, normalizeChapterFourPresentation } from "../src/game/chapterFourStory.js";
import { createSave, normalizeSave } from "../src/game/saveStore.js";
import { chapterForScreen } from "../src/media/chapterMediaCatalog.js";
import { isWorldCalendarGameplayActive } from "../src/game/worldCalendarHeartbeat.js";
import { ACCEPTED, accepted, unlocked, log, completed } from "./helpers/chapterFourFixtures.js";

test("chapter four migration adds a bookmark without changing old balances or missions", () => {
  for (const original of [createSave({ callsign: "BH1TEST" }), unlocked(), claimMission(completed(), "story-04").save]) {
    delete original.chapterFourPresentation;
    const migrated = normalizeSave(original);
    assert.deepEqual(migrated.chapterFourPresentation, normalizeChapterFourPresentation(null));
    assert.equal(migrated.money, original.money);
    assert.equal(migrated.technologyPoints, original.technologyPoints);
    assert.deepEqual(migrated.missionState, original.missionState);
    assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(migrated))), migrated);
  }
});

test("chapter four stays locked until chapter three is claimed, then requires acceptance", () => {
  const fresh = createSave({ callsign: "BH1TEST" });
  assert.equal(chapterFourStoryModel(fresh).status, "locked");
  assert.equal(chapterFourStoryModel(unlocked()).status, "available");
  for (const save of [fresh, unlocked()]) assert.equal(advanceChapterFourPresentation(save, "gap").updated, false);
  let save = accepted();
  assert.equal(chapterFourStoryModel(save).status, "active");
  for (const beat of ["call", "answer", "log"]) assert.equal(advanceChapterFourPresentation(save, beat).updated, false);
  save = advanceChapterFourPresentation(save, "gap").save;
  save = advanceChapterFourPresentation(save, "call").save;
  assert.equal(chapterFourStoryModel(normalizeSave(JSON.parse(JSON.stringify(save)))).step, 2);
  assert.equal(advanceChapterFourPresentation(save, "answer").updated, false);
  assert.equal(advanceChapterFourPresentation(save, "gap").updated, false);
  assert.strictEqual(advanceChapterFourPresentation(save, "call").save, save);
});

test("chapter four normalization ignores accessors, inherited fields and oversized IDs", () => {
  for (const value of [Object.create({ acceptedAt: ACCEPTED, beat: "log" }), { get acceptedAt() { throw new Error("getter"); } }]) {
    assert.deepEqual(normalizeChapterFourPresentation(value), normalizeChapterFourPresentation(null));
  }
  assert.equal(normalizeChapterFourPresentation({ acceptedAt: ACCEPTED, beat: "fake" }).beat, "rain");
  assert.equal(normalizeChapterFourPresentation({ acceptedAt: ACCEPTED, beat: "log", qsoId: "x".repeat(97) }).qsoId, null);
  assert.deepEqual(chapterFourRecovery({ get attemptHistory() { throw new Error("getter"); } }), { commands: [], remoteQuery: false, verified: false });
  const hostile = []; Object.defineProperty(hostile, 0, { get() { throw new Error("array getter"); } });
  assert.equal(chapterFourRecovery({ attemptHistory: hostile }).verified, false);
});

test("chapter four accepts real AGN and all supported QRS forms at P0-P2", () => {
  for (const command of ["AGN K", "QRS K", "QRS PSE K", "PSE QRS K"]) {
    for (const level of [0, 1, 2]) {
      const save = completed(accepted(), { finalPropagationLevel: level, attemptHistory: [{ message: command, result: "repeat" }] });
      assert.equal(chapterFourStoryModel(save).candidate?.id, log().id);
      assert.deepEqual(chapterFourRecovery(chapterFourStoryModel(save).candidate).commands, [command]);
    }
  }
});

test("chapter four recognizes recorded remote copy queries without inventing a command", () => {
  for (const outcome of ["query", "unreadable"]) {
    const save = completed(accepted(), { repeatRequests: 0, copyQueries: 1, attemptHistory: [{ message: "SIM2DX DE BH1TEST RST 579 K", result: "accepted", remoteOutcome: outcome }] });
    const entry = chapterFourStoryModel(save).candidate;
    assert(entry);
    assert.deepEqual(chapterFourRecovery(entry), { commands: [], remoteQuery: true, verified: true });
  }
});

test("wrong station, stronger signal, skipped weather and missing recovery cannot finish chapter four", () => {
  for (const overrides of [
    { callsign: "SIM3RA" }, { finalPropagationLevel: 3 }, { finalPropagationLevel: 4 },
    { optionalExchangeQuestion: "name" }, { optionalExchangeOutcome: "skipped" },
    { repeatRequests: 0, attemptHistory: [] }, { repeatRequests: 0, attemptHistory: [{ message: "QRS K", result: "rejected" }] },
  ]) {
    const save = completed(accepted(), overrides);
    assert.equal(chapterFourStoryModel(save).candidate, null);
    assert.equal(chapterFourStoryModel(save).status, "active");
    assert.equal(advanceChapterFourPresentation(save, "log").updated, false);
    assert.equal(claimMission(save, "story-04").claimed, false);
  }
});

test("legacy recovery counters alone retain central claiming but never fabricate a story recovery", () => {
  const save = completed(accepted(), { repeatRequests: 2, attemptHistory: [] });
  assert.equal(chapterFourStoryModel(save).status, "ready");
  assert.equal(chapterFourStoryModel(save).candidate, null);
  assert.equal(advanceChapterFourPresentation(save, "log").updated, false);
  assert.equal(claimMission(save, "story-04").claimed, true);
});

test("chapter four ending requires matching saved, settled and mission-event facts", () => {
  const good = completed();
  const changeLog = changes => ({ ...good, qsoLogs: good.qsoLogs.map(entry => entry.id === log().id ? { ...entry, ...changes } : entry) });
  const changeEvent = changes => ({ ...good, missionState: { ...good.missionState, events: good.missionState.events.map(event => event.qsoId === log().id ? { ...event, ...changes } : event) } });
  for (const bad of [
    { ...good, qsoLogs: [] }, { ...good, qsoRecords: { ...good.qsoRecords, settledQsoIds: [] } },
    { ...good, missionState: { ...good.missionState, events: [] } },
    changeLog({ eventId: "other-event" }), changeLog({ eventRunId: "other-run" }),
    changeLog({ completedAt: "2026-10-04T11:59:00.000Z" }), changeLog({ callsign: "SIM5TU" }),
    changeLog({ sent: "999" }), changeLog({ received: "" }), changeLog({ frequencyMhz: "21.06" }),
    changeLog({ frequencyMhz: 0 }), changeLog({ finalPropagationLevel: "2" }), changeLog({ finalPropagationLevel: -1 }),
    changeLog({ finalPropagationLevel: 1.5 }), changeLog({ finalPropagationLevel: NaN }), changeLog({ attemptHistory: [] }),
    changeEvent({ callsign: "SIM5TU" }), changeEvent({ occurredAt: "2026-10-04T12:06:00.000Z" }), changeEvent({ outcome: "failure" }),
  ]) {
    assert.equal(chapterFourStoryModel(bad).candidate, null);
    assert.equal(advanceChapterFourPresentation(bad, "log").updated, false);
  }
});

test("abandon and reaccept reset the fourth chapter bookmark and exclude baseline contacts", () => {
  let save = advanceChapterFourPresentation(completed(), "log").save;
  save = abandonMission(save, "story-04").save;
  save = acceptMission(save, "story-04", "2026-10-04T13:00:00.000Z").save;
  assert.equal(chapterFourStoryModel(save).step, 0);
  assert.equal(chapterFourStoryModel(save).candidate, null);
  save.qsoLogs.find(entry => entry.id === log().id).completedAt = "2026-10-04T13:05:00.000Z";
  assert.equal(chapterFourStoryModel(save).candidate, null);
});

test("chapter four keeps the exact log through reload, pays once and unlocks chapter five and NOVA", () => {
  let save = completed();
  assert(!save.knownOperatorNames.includes("NOVA"));
  const money = save.money, points = save.technologyPoints;
  save = advanceChapterFourPresentation(save, "log").save;
  assert.equal(save.money, money);
  const result = claimMission(save, "story-04", "2026-10-04T12:06:00.000Z");
  assert(result.claimed);
  assert.equal(result.moneyAwarded, 420);
  assert.equal(result.technologyPointsAwarded, 2);
  const loaded = normalizeSave(JSON.parse(JSON.stringify(result.save)));
  assert.equal(chapterFourStoryModel(loaded).step, 4);
  assert.equal(chapterFourStoryModel(loaded).candidate?.id, log().id);
  assert.equal(chapterFourStoryModel(loaded).status, "claimed");
  assert.equal(loaded.money, money + 420);
  assert.equal(loaded.technologyPoints, points + 2);
  assert(loaded.knownOperatorNames.includes("NOVA"));
  assert.equal(missionBoard(loaded).story[4].status, "available");
  assert.strictEqual(claimMission(loaded, "story-04").save, loaded);
  assert.strictEqual(advanceChapterFourPresentation(loaded, "log").save, loaded);
  assert.equal(chapterForScreen("chapter-four", loaded), 4);
  assert.equal(isWorldCalendarGameplayActive({ screen: "chapter-four", activeSaveId: loaded.id }), true);
});
