import assert from "node:assert/strict";
import { acceptMission, claimMission } from "../../src/game/missionSystem.js";
import { completed as completedSix } from "./chapterSixFixtures.js";
import { confirmQslChoice } from "../../src/game/qslRecords.js";
import { createQslStoryRun, reviewQslAccounts, submitQslClarification, receiveQslClarification, confirmQslStoryChoice, qslStoryClarificationText } from "../../src/game/qslStoryRun.js";
import { settleQslStoryRun } from "../../src/game/qslStorySettlement.js";
import { normalizeStoryContinuationState } from "../../src/game/storyContinuationState.js";
import { interpretCwTraffic } from "../../src/qso/semanticInterpreter.js";
export const ACCEPTED = "2026-10-04T15:00:00.000Z";
export function locked() { return claimMission(completedSix(),"story-06","2026-10-04T14:05:00.000Z").save; }
export function unlocked(choice = "request-review") {
  const save = locked();
  const result = confirmQslChoice(save.qslRecords,save.qslRecords.at(-1).id,choice,"2026-10-04T14:06:00.000Z");
  assert(result.confirmed);
  return { ...save, qslRecords: result.records };
}
export function accepted(choice) { const result=acceptMission(unlocked(choice),"story-07",ACCEPTED);assert(result.accepted);return result.save; }
export function newRun(save, at = "2026-10-04T15:01:00.000Z") {
  return createQslStoryRun({sourceQsl:save.qslRecords.at(-1),playerCallsign:save.callsign,startedAt:at});
}
export function withRun(save,run) {
  return { ...save, storyContinuationState: normalizeStoryContinuationState({ ...save.storyContinuationState,
    chapter07: { ...save.storyContinuationState.chapter07, activeRun: run } }) };
}
export function finishedRun(save,{ choice = "defer",at = "2026-10-04T15:02:00.000Z" } = {}) {
  let run = reviewQslAccounts(newRun(save,at));
  const message=qslStoryClarificationText(run);
  run=submitQslClarification(run,message,interpretCwTraffic({message,phase:"EXCHANGE",selfCallsign:save.callsign}),at);
  run=receiveQslClarification(run,at);
  return confirmQslStoryChoice(run,choice,at);
}
export function completed(save = accepted(),options = {}) {
  const run=finishedRun(save,options);
  const result=settleQslStoryRun(withRun(save,run),run,run.completedAt);
  assert(result.settled);
  return result.save;
}
