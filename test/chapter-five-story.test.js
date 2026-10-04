import assert from "node:assert/strict";
import test from "node:test";
import { createSave, normalizeSave } from "../src/game/saveStore.js";
import { acceptMission, abandonMission, claimMission, missionBoard } from "../src/game/missionSystem.js";
import { advanceChapterFivePresentation, chapterFiveStoryModel, canContinueChapterFive, normalizeChapterFivePresentation } from "../src/game/chapterFiveStory.js";
import { runSettlementLedgerId, settleLightsRun } from "../src/game/lightsSettlement.js";
import { lightsStoryCompletion } from "../src/game/lightsStoryProgress.js";
import { chapterForScreen } from "../src/media/chapterMediaCatalog.js";
import { isWorldCalendarGameplayActive } from "../src/game/worldCalendarHeartbeat.js";
import { ACCEPTED, accepted, unlocked, eventResult, completed } from "./helpers/chapterFiveFixtures.js";

test("chapter five migration preserves balances, missions and historical best", () => {
  const original = completed();
  delete original.chapterFivePresentation;
  delete original.lightsEventState.storyLatest;
  const loaded = normalizeSave(original);
  assert.deepEqual(loaded.chapterFivePresentation, normalizeChapterFivePresentation(null));
  assert.equal(loaded.lightsEventState.storyLatest, null);
  assert.deepEqual(loaded.lightsEventState.storyBest, original.lightsEventState.storyBest);
  assert.equal(loaded.money, original.money);
  assert.equal(loaded.technologyPoints, original.technologyPoints);
  assert.deepEqual(loaded.missionState, original.missionState);
  assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))), loaded);
  assert(chapterFiveStoryModel(loaded).candidate, "legacy settled logs still verify without the new latest record");
});

test("chapter five only advances accepted story bookmarks in order", () => {
  assert.equal(chapterFiveStoryModel(createSave({ callsign: "BH1TEST" })).status, "locked");
  assert.equal(chapterFiveStoryModel(unlocked()).status, "available");
  assert.equal(advanceChapterFivePresentation(unlocked(), "desk").updated, false);
  let save = accepted();
  for (const beat of ["call", "answer", "log"]) assert.equal(advanceChapterFivePresentation(save, beat).updated, false);
  save = advanceChapterFivePresentation(save, "desk").save;
  save = advanceChapterFivePresentation(save, "call").save;
  assert.equal(chapterFiveStoryModel(normalizeSave(JSON.parse(JSON.stringify(save)))).step, 2);
  assert.equal(advanceChapterFivePresentation(save, "answer").updated, false);
  assert.equal(advanceChapterFivePresentation(save, "desk").updated, false);
  assert.strictEqual(advanceChapterFivePresentation(save, "call").save, save);
});

test("chapter five bookmarks reject getters, inherited values, bad beats and oversized IDs", () => {
  for (const value of [Object.create({ acceptedAt: ACCEPTED, beat: "log" }), { get acceptedAt() { throw new Error("getter"); } }]) {
    assert.deepEqual(normalizeChapterFivePresentation(value), normalizeChapterFivePresentation(null));
  }
  assert.equal(normalizeChapterFivePresentation({ acceptedAt: ACCEPTED, beat: "nope" }).beat, "notice");
  assert.equal(normalizeChapterFivePresentation({ acceptedAt: ACCEPTED, beat: "log", runId: "x".repeat(129) }).runId, null);
  assert.equal(lightsStoryCompletion({ get storyLatest() { throw new Error("getter"); } }, ACCEPTED), null);
});

test("chapter five verifies the complete settled story batch, not a high-score flag alone", () => {
  const save = completed();
  const model = chapterFiveStoryModel(save);
  assert.equal(model.status, "ready");
  assert.equal(model.step, 3);
  assert.equal(model.candidate.runId, save.lightsEventState.storyLatest.runId);
  assert.equal(model.candidate.contacts.length, 7);
  assert(model.candidate.regions.length >= 2);
  assert(canContinueChapterFive(save, "story", model.candidate.runId));
  assert(!canContinueChapterFive(save, "practice", model.candidate.runId));
  assert(!canContinueChapterFive(save, "annual", model.candidate.runId));
  assert(!canContinueChapterFive(save, "story", "other-run"));
  const id = model.candidate.contacts[0].id;
  const changeLog = changes => ({ ...save, qsoLogs: save.qsoLogs.map(log => log.id === id ? { ...log, ...changes } : log) });
  for (const bad of [
    { ...save, qsoLogs: [] },
    { ...save, qsoLogs: save.qsoLogs.filter(log => log.id !== id) },
    { ...save, qsoRecords: { ...save.qsoRecords, settledQsoIds: save.qsoRecords.settledQsoIds.filter(value => value !== id) } },
    { ...save, qsoRecords: { ...save.qsoRecords, settledQsoIds: save.qsoRecords.settledQsoIds.filter(value => value !== runSettlementLedgerId(model.candidate.runId)) } },
    { ...save, lightsEventState: { ...save.lightsEventState, settledRunIds: [] } },
    { ...save, lightsEventState: { ...save.lightsEventState, storyLatest: { ...save.lightsEventState.storyLatest, contactIds: [] } } },
    changeLog({ eventMode: "annual" }), changeLog({ eventMode: "practice" }), changeLog({ eventId: "other" }),
    changeLog({ eventRunId: "other" }), changeLog({ onAirCallsign: "SIM2DX" }), changeLog({ operatorCallsign: "OTHER" }),
    changeLog({ playerCallsign: "OTHER" }), changeLog({ sent: "999" }), changeLog({ received: "" }),
    changeLog({ frequencyMhz: 0 }), changeLog({ eventRegionCode: "XX" }), changeLog({ callsign: "" }),
    changeLog({ completedAt: "2026-10-04T12:59:00.000Z" }), changeLog({ completedAt: "2026-10-04T14:00:00.000Z" }),
  ]) {
    assert.equal(chapterFiveStoryModel(bad).candidate, null);
    assert.equal(advanceChapterFivePresentation(bad, "log").updated, false);
  }
});

test("base grade is sufficient and failed events do not unlock an ending", () => {
  const base = completed(accepted(), { count: 3 });
  assert.equal(base.lightsEventState.storyLatest.grade, "base");
  assert.equal(chapterFiveStoryModel(base).candidate.contacts.length, 3);
  for (const count of [0, 1, 2]) {
    const save = completed(accepted(), { count });
    assert.equal(chapterFiveStoryModel(save).candidate, null);
    assert.equal(chapterFiveStoryModel(save).status, "active");
    assert.equal(claimMission(save, "story-05").claimed, false);
  }
});

test("reaccepting chapter five allows a lower qualifying score without erasing the high score", () => {
  let save = advanceChapterFivePresentation(completed(), "log").save;
  const high = save.lightsEventState.storyBest;
  save = abandonMission(save, "story-05").save;
  save = acceptMission(save, "story-05", "2026-10-04T14:00:00.000Z").save;
  assert.equal(chapterFiveStoryModel(save).step, 0);
  assert.equal(chapterFiveStoryModel(save).candidate, null);
  save = completed(save, { count: 3, startedAt: "2026-10-04T14:01:00.000Z", seed: "chapter-five-retry" });
  assert(save.lightsEventState.storyLatest.score < high.score);
  assert.deepEqual(save.lightsEventState.storyBest, high);
  assert.equal(chapterFiveStoryModel(save).status, "ready");
  assert.equal(chapterFiveStoryModel(save).candidate.runId, save.lightsEventState.storyLatest.runId);
  assert.equal(chapterFiveStoryModel(save).candidate.contacts.length, 3);
  assert.equal(claimMission(save, "story-05").claimed, true);
});

test("old ready saves without batch evidence can still claim centrally, never invent an ending", () => {
  const good = completed();
  const legacy = { ...good, qsoLogs: [] };
  assert.equal(chapterFiveStoryModel(legacy).status, "ready");
  assert.equal(chapterFiveStoryModel(legacy).candidate, null);
  assert.equal(claimMission(legacy, "story-05").claimed, true);
});

test("chapter five event and mission rewards remain separate and only pay once", () => {
  const initial = accepted(), result = eventResult();
  const settled = settleLightsRun(initial, result, { now: result.completedAt });
  assert(settled.settled);
  assert.equal(settled.save.money, initial.money + settled.moneyAwarded);
  assert(settled.save.qsoLogs.filter(log => log.eventRunId === result.runId).every(log => log.credits === 0));
  assert.strictEqual(settleLightsRun(settled.save, result).save, settled.save);
  const save = advanceChapterFivePresentation(settled.save, "log").save;
  assert(!save.knownOperatorNames.includes("SORA"));
  const claimed = claimMission(save, "story-05", "2026-10-04T13:10:00.000Z");
  assert.equal(claimed.moneyAwarded, 500);
  assert.equal(claimed.technologyPointsAwarded, 2);
  assert(claimed.save.knownOperatorNames.includes("SORA"));
  const loaded = normalizeSave(JSON.parse(JSON.stringify(claimed.save)));
  assert.equal(chapterFiveStoryModel(loaded).step, 4);
  assert.equal(chapterFiveStoryModel(loaded).candidate.runId, result.runId);
  assert.equal(missionBoard(loaded).story[5].status, "available");
  assert.strictEqual(claimMission(loaded, "story-05").save, loaded);
  assert.strictEqual(advanceChapterFivePresentation(loaded, "log").save, loaded);
  assert(!canContinueChapterFive(loaded, "story", result.runId));
  assert.equal(chapterForScreen("chapter-five", loaded), 5);
  assert(isWorldCalendarGameplayActive({ activeSaveId: loaded.id, screen: "chapter-five" }));
});

test("practice settlement cannot replace the latest story completion", () => {
  let save = claimMission(completed(), "story-05").save;
  const latest = save.lightsEventState.storyLatest;
  save = completed(save, { mode: "practice", count: 3, startedAt: "2026-10-04T15:00:00.000Z" });
  assert.deepEqual(save.lightsEventState.storyLatest, latest);
  assert.equal(canContinueChapterFive(save, "practice", save.lightsEventState.settledRunIds.at(-1)), false);
});
