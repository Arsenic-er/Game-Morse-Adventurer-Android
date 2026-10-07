import assert from "node:assert/strict";
import test from "node:test";
import { createSave, normalizeSave } from "../src/game/saveStore.js";
import { acceptMission, abandonMission, claimMission, missionBoard } from "../src/game/missionSystem.js";
import { chapterSixStoryModel, advanceChapterSixPresentation, normalizeChapterSixPresentation, canContinueChapterSix } from "../src/game/chapterSixStory.js";
import { submitExpeditionExchange, requestExpeditionRecovery } from "../src/game/expeditionRun.js";
import { settleExpeditionRun } from "../src/game/expeditionSettlement.js";
import { chapterForScreen } from "../src/media/chapterMediaCatalog.js";
import { isWorldCalendarGameplayActive } from "../src/game/worldCalendarHeartbeat.js";
import { ACCEPTED, accepted, unlocked, completed, fieldRun, withRun } from "./helpers/chapterSixFixtures.js";

test("chapter six migrates without changing the active expedition, balances or records", () => {
  const old = withRun(accepted(), fieldRun(accepted()));
  delete old.chapterSixPresentation;
  const loaded = normalizeSave(old);
  assert.deepEqual(loaded.chapterSixPresentation, normalizeChapterSixPresentation(null));
  for (const key of ["money", "technologyPoints", "expeditionState", "missionState", "qsoLogs"]) assert.deepEqual(loaded[key], old[key]);
  assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))), loaded);
});
test("chapter six bookmarks are ordered, guarded, and survive reload", () => {
  assert.equal(chapterSixStoryModel(createSave({ callsign: "BH1TEST" })).status, "locked");
  assert.equal(chapterSixStoryModel(unlocked()).status, "available");
  assert(!advanceChapterSixPresentation(unlocked(), "wire").updated);
  let save = accepted();
  for (const beat of ["call", "answer", "log", "bad"]) assert(!advanceChapterSixPresentation(save, beat).updated);
  save = advanceChapterSixPresentation(save, "wire").save;
  save = advanceChapterSixPresentation(save, "call").save;
  assert.equal(chapterSixStoryModel(normalizeSave(save)).step, 2);
  assert.strictEqual(advanceChapterSixPresentation(save, "call").save, save);
  assert(!advanceChapterSixPresentation(save, "wire").updated);
  assert(!advanceChapterSixPresentation(save, "answer").updated);
});
test("chapter six ignores inherited bookmarks, accessors and invalid fields", () => {
  for (const value of [Object.create({ acceptedAt: ACCEPTED, beat: "log" }), { get acceptedAt() { throw new Error("getter"); } }]) {
    assert.deepEqual(normalizeChapterSixPresentation(value), normalizeChapterSixPresentation(null));
  }
  assert.equal(normalizeChapterSixPresentation({ acceptedAt: ACCEPTED, beat: "bad", qsoId: "x".repeat(97) }).qsoId, null);
  assert.equal(normalizeChapterSixPresentation({ acceptedAt: ACCEPTED, beat: "bad" }).beat, "pack");
});
test("chapter six matches settled log, summary and proof, never only a completion flag", () => {
  const save = completed(), model = chapterSixStoryModel(save), log = model.candidate;
  assert(log);
  assert.equal(model.status, "ready");
  assert.equal(model.step, 3);
  assert.equal(model.site.id, "sunward-hill");
  assert(canContinueChapterSix(save, log.expeditionRunId));
  assert(!canContinueChapterSix(save, "other"));
  const change = fields => ({ ...save, qsoLogs: save.qsoLogs.map(item => item.id === log.id ? { ...item, ...fields } : item) });
  for (const bad of [
    { ...save, qsoLogs: [] },
    { ...save, qsoRecords: { ...save.qsoRecords, settledQsoIds: [] } },
    ...["settledQsoProofs","completedRuns","settledRunIds"].map(key => ({ ...save, expeditionState: { ...save.expeditionState, [key]: [] } })),
    change({ expeditionRunId: "other" }), change({ expeditionSiteId: "lakeview-hill" }), change({ playerLocationId: "home" }),
    change({ personId: "person:other" }), change({ stationId: "station:sim2dx" }), change({ callsign: "" }),
    change({ playerCallsign: "OTHER" }), change({ isFictional: false }), change({ sent: "999" }),
    change({ received: "" }), change({ frequencyMhz: 0 }), change({ finalPropagationLevel: 8 }),
    change({ completedAt: "2026-10-04T13:59:00.000Z" }), change({ eventId: "lights-across-air" }),
  ]) {
    assert.equal(chapterSixStoryModel(bad).candidate, null);
    assert(!advanceChapterSixPresentation(bad, "log").updated);
  }
});
test("chapter six supports every fictional site and weak-link recovery without inventing fields", () => {
  for (const siteId of ["sunward-hill","cedar-breeze-hill","lakeview-hill"]) {
    const save = completed(accepted(), { siteId, level: 1 });
    assert.equal(chapterSixStoryModel(save).site.id, siteId);
    assert(chapterSixStoryModel(save).candidate.attemptHistory.some(item => item.message === "QRS K"));
  }
  let save = accepted(), run = fieldRun(save);
  run = submitExpeditionExchange(run, "QTH WRONG PWR 5W ANT WIRE K", null, "2026-10-04T14:02:00.000Z");
  assert.equal(run.status, "recovering");
  save = withRun(save, run);
  assert.equal(chapterSixStoryModel(save).candidate, null);
  assert(!settleExpeditionRun(save, run, "2026-10-04T14:02:00.000Z").settled);
  const resumed = normalizeSave(JSON.parse(JSON.stringify(save)));
  assert.deepEqual(resumed.expeditionState.activeRun, run);
  run = requestExpeditionRecovery(run, "AGN", "2026-10-04T14:03:00.000Z");
  assert.equal(run.status, "exchange");
  run = submitExpeditionExchange(run, "QTH SUNWARD PWR 5W ANT WIRE K", null, "2026-10-04T14:04:00.000Z");
  assert.equal(run.status, "completed");
  const unsaved = normalizeSave(JSON.parse(JSON.stringify(withRun(save, run))));
  assert.equal(chapterSixStoryModel(unsaved).candidate, null, "completed but unsettled runs do not unlock an ending");
  const resumedSettlement = settleExpeditionRun(unsaved, unsaved.expeditionState.activeRun, "2026-10-04T14:05:00.000Z");
  assert(resumedSettlement.settled);
  assert(chapterSixStoryModel(resumedSettlement.save).candidate, "a completed run can be reloaded and then settled");
});
test("chapter six reaccept excludes old runs and resets the bookmark", () => {
  let save = advanceChapterSixPresentation(completed(), "log").save;
  save = abandonMission(save, "story-06").save;
  save = acceptMission(save, "story-06", "2026-10-04T15:00:00.000Z").save;
  assert.equal(chapterSixStoryModel(save).step, 0);
  assert.equal(chapterSixStoryModel(save).candidate, null);
  save = completed(save, { id: "chapter-six-new-run", at: "2026-10-04T15:01:00.000Z", siteId: "lakeview-hill" });
  assert.equal(chapterSixStoryModel(save).candidate.expeditionRunId, "chapter-six-new-run");
});
test("chapter six rewards once, unlocks the expedition tree and leaves QSL choice to the player", () => {
  const save = advanceChapterSixPresentation(completed(), "log").save;
  const claimed = claimMission(save, "story-06", "2026-10-04T14:05:00.000Z");
  assert(claimed.claimed);
  assert.equal(claimed.save.money, save.money + 650);
  assert.equal(claimed.save.technologyPoints, save.technologyPoints + 3);
  assert(claimed.save.expeditionState.expeditionTreeUnlocked);
  assert.deepEqual(claimed.save.qslRecords, save.qslRecords);
  assert.equal(missionBoard(claimed.save).story[6].status, "locked");
  const loaded = normalizeSave(JSON.parse(JSON.stringify(claimed.save)));
  assert.equal(chapterSixStoryModel(loaded).step, 4);
  assert.equal(chapterSixStoryModel(loaded).candidate.id, chapterSixStoryModel(save).candidate.id);
  assert.strictEqual(claimMission(loaded, "story-06").save, loaded);
  assert(!canContinueChapterSix(loaded, chapterSixStoryModel(save).candidate.expeditionRunId));
  const replayed = completed(loaded, { id: "chapter-six-replay", siteId: "cedar-breeze-hill", at: "2026-10-04T16:00:00.000Z" });
  assert.equal(chapterSixStoryModel(replayed).candidate.id, chapterSixStoryModel(loaded).candidate.id, "the ending stays pinned to its original settled contact");
  assert.deepEqual(replayed.missionState.claimedMissionIds, loaded.missionState.claimedMissionIds);
  assert.equal(chapterForScreen("chapter-six", loaded), 6);
  assert(isWorldCalendarGameplayActive({ activeSaveId: loaded.id, screen: "chapter-six" }));
});
test("legacy ready chapter six without presentation ledger can still claim centrally", () => {
  const save = completed(), legacy = { ...save, qsoRecords: { ...save.qsoRecords, settledQsoIds: [] } };
  assert.equal(chapterSixStoryModel(legacy).status, "ready");
  assert.equal(chapterSixStoryModel(legacy).candidate, null);
  assert(claimMission(legacy, "story-06").claimed);
});
