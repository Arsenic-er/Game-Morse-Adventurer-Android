import assert from "node:assert/strict";
import test from "node:test";
import { acceptMission, abandonMission, claimMission, missionBoard } from "../src/game/missionSystem.js";
import { chapterThreeStoryModel as model, advanceChapterThreePresentation as advance, normalizeChapterThreePresentation as normalize } from "../src/game/chapterThreeStory.js";
import { chapterOneStoryModel, advanceChapterOnePresentation } from "../src/game/chapterOneStory.js";
import { createSave, normalizeSave } from "../src/game/saveStore.js";
import { settleAchievementRewards } from "../src/game/achievements.js";
import { chapterForScreen } from "../src/media/chapterMediaCatalog.js";
import { isWorldCalendarGameplayActive } from "../src/game/worldCalendarHeartbeat.js";
import { ACCEPTED, STYLES, log, unlocked, accepted, contact, completed } from "./helpers/chapterThreeFixtures.js";

test("chapter three bookmark migration preserves existing balances, progress and claims", () => {
  for (const save of [createSave({ callsign: "BH1TEST" }), unlocked(), claimMission(completed(), "story-03").save]) {
    delete save.chapterThreePresentation;
    const migrated = normalizeSave(save);
    assert.deepEqual(migrated.chapterThreePresentation, normalize(null));
    assert.equal(migrated.money, save.money);
    assert.equal(migrated.technologyPoints, save.technologyPoints);
    assert.deepEqual(migrated.missionState, save.missionState);
    assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(migrated))), migrated);
  }
});

test("chapter three requires its prerequisite and cannot skip or rewind narrative steps", () => {
  assert.equal(model(createSave({ callsign: "BH1TEST" })).status, "locked");
  assert.equal(model(unlocked()).status, "available");
  assert.equal(advance(unlocked(), "notes").updated, false);
  let save = accepted();
  for (const beat of ["call", "compare", "log"]) assert.equal(advance(save, beat).updated, false);
  save = advance(save, "notes").save;
  save = advance(save, "call").save;
  assert.equal(model(normalizeSave(JSON.parse(JSON.stringify(save)))).step, 2);
  assert.equal(advance(save, "notes").updated, false);
  assert.equal(advance(save, "compare").updated, false);
  // The shared implementation preserves Chapter One's existing rewind policy.
  let first = acceptMission(createSave({ callsign: "BH1TEST" }), "story-01", ACCEPTED).save;
  first = advanceChapterOnePresentation(first, "operator").save;
  assert.equal(chapterOneStoryModel(advanceChapterOnePresentation(first, "silence").save).step, 0);
});

test("different callsigns with the same style count only once", () => {
  let save = accepted();
  for (let index = 0; index < 3; index++) save = contact(save, index, { operatorProfileId: STYLES[0] });
  assert.equal(model(save).contacts.length, 1);
  assert.equal(model(save).matchingQsoIds.length, 3);
  assert.equal(model(save).status, "active");
  assert.equal(model(save).candidate, null);
  assert.equal(advance(save, "compare").updated, false);
  assert.equal(claimMission(save, "story-03").claimed, false);
});

test("each partial contact requires its saved log, ledger and matching event", () => {
  const one = contact(accepted(), 0);
  assert.equal(model(one).contacts.length, 1);
  assert.equal(model(one).candidate, null);
  const two = contact(one, 1);
  assert.equal(model(two).contacts.length, 2);
  assert.equal(model(two).candidate, null);
  assert.equal(model({ ...two, qsoRecords: { ...two.qsoRecords, settledQsoIds: [log(0).id] } }).contacts.length, 1);
  assert.equal(model({ ...two, missionState: { ...two.missionState, events: [] } }).contacts.length, 0);
});

test("three verified distinct styles unlock the closing and pin the exact records", () => {
  let save = completed();
  assert.equal(model(save).status, "ready");
  assert.equal(model(save).step, 3);
  assert.deepEqual(model(save).contacts.map(entry => entry.operatorProfileId), STYLES);
  const money = save.money;
  save = advance(save, "log").save;
  assert.equal(save.money, money);
  assert.deepEqual(save.chapterThreePresentation.qsoIds, [0, 1, 2].map(index => log(index).id));
  save = contact(save, 3, { operatorProfileId: "friendly-ragchewer", callsign: "SIM8CW" });
  const reloaded = normalizeSave(JSON.parse(JSON.stringify(save)));
  assert.equal(model(reloaded).step, 4);
  assert.deepEqual(model(reloaded).contacts.map(entry => entry.id), save.chapterThreePresentation.qsoIds);
  assert.equal(model(reloaded).matchingQsoIds.length, 4);
  assert.equal(model(reloaded).candidate.id, log(2).id);
});

test("chapter three refuses missing, invalid, unmatched or pre-task evidence", () => {
  const good = completed();
  const change = fields => ({ ...good, qsoLogs: good.qsoLogs.map(entry => entry.id === log(2).id ? { ...entry, ...fields } : entry) });
  const variants = [
    change({ received: "" }), change({ sent: "999" }), change({ frequencyMhz: 0 }), change({ frequencyMhz: "21.06" }),
    change({ operatorProfileId: "legacy-standard" }), change({ operatorProfileId: "unknown-style" }),
    change({ operatorProfileId: STYLES[0] }), change({ eventId: "event" }), change({ eventRunId: "run" }),
    change({ completedAt: "2026-10-04T10:59:00.000Z" }), change({ callsign: "SIM9AK" }),
    { ...good, qsoLogs: good.qsoLogs.filter(entry => entry.id !== log(2).id) },
    { ...good, qsoRecords: { ...good.qsoRecords, settledQsoIds: [log(0).id, log(1).id] } },
    { ...good, missionState: { ...good.missionState, events: good.missionState.events.map(event => event.qsoId === log(2).id ? { ...event, occurredAt: "2026-10-04T11:09:00.000Z" } : event) } },
  ];
  for (const variant of variants) {
    assert.equal(model(variant).contacts.length, 2);
    assert.equal(model(variant).candidate, null);
    assert.equal(advance(variant, "log").updated, false);
  }
});

test("the same log ID cannot masquerade as three styles", () => {
  const one = contact(accepted(), 0);
  const entry = one.qsoLogs.find(item => item.id === log(0).id);
  const malformed = { ...one, qsoLogs: STYLES.map(operatorProfileId => ({ ...entry, operatorProfileId })) };
  assert.equal(model(malformed).contacts.length, 1);
  assert.equal(model(malformed).candidate, null);
});

test("abandoning chapter three excludes old contacts even when the first three styles were complete", () => {
  let save = advance(completed(), "log").save;
  save = abandonMission(save, "story-03").save;
  save = acceptMission(save, "story-03", "2026-10-04T12:00:00.000Z").save;
  assert.equal(model(save).step, 0);
  assert.equal(model(save).contacts.length, 0);
  assert.equal(model(save).candidate, null);
});

test("multi-contact bookmarks reject accessors and bound hostile ID lists", () => {
  assert.deepEqual(normalize(Object.create({ acceptedAt: ACCEPTED, beat: "log", qsoIds: ["a", "b", "c"] })), normalize(null));
  assert.deepEqual(normalize({ get acceptedAt() { throw new Error("getter"); } }), normalize(null));
  const ids = [];
  Object.defineProperty(ids, "0", { get() { throw new Error("array getter"); } });
  assert.deepEqual(normalize({ acceptedAt: ACCEPTED, qsoIds: ids }).qsoIds, []);
  assert.deepEqual(normalize({ acceptedAt: ACCEPTED, qsoIds: ["a", "a", "b"] }).qsoIds, ["a", "b"]);
  assert.equal(normalize({ acceptedAt: ACCEPTED, qsoIds: Array(10000).fill("a") }).qsoIds.length, 1);
  const invalidPinned = { ...completed(), chapterThreePresentation: { acceptedAt: ACCEPTED, beat: "log", qsoIds: ["fake", "fake", "fake"] } };
  assert.deepEqual(model(invalidPinned).contacts.map(item => item.id), [0, 1, 2].map(index => log(index).id));
});

test("chapter three rewards once, leaves achievement accounting intact and unlocks chapter four", () => {
  const before = settleAchievementRewards(advance(completed(), "log").save).save;
  const result = claimMission(before, "story-03", "2026-10-04T11:10:00.000Z");
  assert.equal(result.claimed, true);
  assert.equal(result.moneyAwarded, 300);
  assert.equal(result.technologyPointsAwarded, 1);
  const settled = settleAchievementRewards(result.save);
  assert.equal(settled.moneyAwarded, 0);
  const reloaded = normalizeSave(JSON.parse(JSON.stringify(settled.save)));
  assert.equal(model(reloaded).status, "claimed");
  assert.equal(model(reloaded).step, 4);
  assert.equal(model(reloaded).contacts.length, 3);
  assert.equal(missionBoard(reloaded).story[3].status, "available");
  assert.equal(reloaded.money, before.money + 300);
  assert.equal(reloaded.technologyPoints, before.technologyPoints + 1);
  assert.equal(claimMission(reloaded, "story-03").claimed, false);
  assert.equal(advance(reloaded, "log").updated, false);
});

test("chapter three selects chapter media and participates in the save clock", () => {
  assert.equal(chapterForScreen("chapter-three", accepted()), 3);
  assert.equal(isWorldCalendarGameplayActive({ activeSaveId: "three", screen: "chapter-three" }), true);
  assert.equal(isWorldCalendarGameplayActive({ activeSaveId: null, screen: "chapter-three" }), false);
});
