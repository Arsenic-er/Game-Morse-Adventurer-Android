import assert from "node:assert/strict";
import { claimMission, acceptMission } from "../../src/game/missionSystem.js";
import { createExpeditionLoadout } from "../../src/game/expeditionCatalog.js";
import { createExpeditionRun, selectExpeditionSite, advanceExpeditionSetup, beginExpeditionCq, receiveExpeditionContact, requestExpeditionRecovery, submitExpeditionExchange, normalizeExpeditionState } from "../../src/game/expeditionRun.js";
import { settleExpeditionRun } from "../../src/game/expeditionSettlement.js";
import { createExpeditionQslRecord, normalizeQslRecords } from "../../src/game/qslRecords.js";
import { completed as completedFive } from "./chapterFiveFixtures.js";
export const ACCEPTED = "2026-10-04T14:00:00.000Z";
export function unlocked() { return claimMission(completedFive(), "story-05", "2026-10-04T13:10:00.000Z").save; }
export function accepted() { return acceptMission(unlocked(), "story-06", ACCEPTED).save; }
export function fieldRun(save, { id = "chapter-six-fixture", siteId = "sunward-hill", level = 3, at = "2026-10-04T14:01:00.000Z" } = {}) {
  let run = createExpeditionRun({ runId: id, playerCallsign: save.callsign, loadout: createExpeditionLoadout(save, { source: "loan" }), startedAt: at });
  run = selectExpeditionSite(run, siteId, at);
  run = advanceExpeditionSetup(run, "antenna", at);
  run = advanceExpeditionSetup(run, "power", at);
  run = beginExpeditionCq(run, { observedAt: at, propagationSnapshot: { level, noise: 1, capturedAt: at } });
  return receiveExpeditionContact(run, { callsign: "SIM6JP", npcId: "sora", locationId: "fictional-hill-listener", distanceKm: 510, sentRst: "579", receivedRst: "559", remoteWpm: 17, operatorProfileId: "sora-patient" }, at);
}
export function withRun(save, run) { return { ...save, expeditionState: normalizeExpeditionState({ ...save.expeditionState, activeRun: run }) }; }
export function completed(save = accepted(), options = {}) {
  let run = fieldRun(save, options);
  const at = options.at ?? "2026-10-04T14:02:00.000Z";
  const message = "QTH " + run.fieldSite.qthCode + " PWR 5W ANT WIRE K";
  run = submitExpeditionExchange(run, message, null, at);
  if (run.status === "recovering") {
    run = requestExpeditionRecovery(run, "QRS", at);
    run = submitExpeditionExchange(run, message, null, at);
  }
  const result = settleExpeditionRun(withRun(save, run), run, at);
  assert(result.settled);
  const qsl = createExpeditionQslRecord(run, result.qsoId);
  return { ...result.save, qslRecords: normalizeQslRecords([...(result.save.qslRecords ?? []), qsl]) };
}
