import assert from "node:assert/strict";
import { acceptMission, claimMission } from "../../src/game/missionSystem.js";
import { completed as completedSeven } from "./chapterSevenFixtures.js";
import { createServiceNetRun, beginServiceNetRun, receiveServiceNetMessage, submitServiceNetText } from "../../src/game/serviceNetRun.js";
import { settleServiceNetRun } from "../../src/game/serviceNetSettlement.js";
import { normalizeStoryContinuationState } from "../../src/game/storyContinuationState.js";
import { interpretCwTraffic } from "../../src/qso/semanticInterpreter.js";
export const ACCEPTED = "2026-10-04T16:00:00.000Z";
export function unlocked() { return claimMission(completedSeven(),"story-07","2026-10-04T15:05:00.000Z").save; }
export function accepted() { const result=acceptMission(unlocked(),"story-08",ACCEPTED);assert(result.accepted);return result.save; }
export function newRun(save, at = "2026-10-04T16:01:00.000Z") {
  return createServiceNetRun({playerCallsign:save.callsign,seed:save.id+":net",startedAt:at});
}
export function withRun(save,run) {
  return { ...save, storyContinuationState: normalizeStoryContinuationState({ ...save.storyContinuationState,
    chapter08: { ...save.storyContinuationState.chapter08, activeRun: run } }) };
}
export function submit(run,message,at = "2026-10-04T16:02:00.000Z") {
  return submitServiceNetText(run,message,interpretCwTraffic({message,phase:"EXCHANGE",selfCallsign:run.playerCallsign,pendingQuestion:run.phase==="CHECK_IN"?"CALLSIGN":"NONE"}),at);
}
export function finishedRun(save,{at = "2026-10-04T16:02:00.000Z"} = {}) {
  let run=beginServiceNetRun(newRun(save,at));
  run=submit(run,run.playerCallsign+" CHECK IN K",at);
  for(let index=0;index<3;index++){
    run=receiveServiceNetMessage(run);
    const item=run.messages[run.priorityOrder[run.currentPosition]];
    run=submit(run,"ACK "+item.messageId+" PRI "+item.priority+" K",at);
  }
  assert.equal(run.phase,"COMPLETED");
  return run;
}
export function completed(save = accepted(),options = {}) {
  const run=finishedRun(save,options),result=settleServiceNetRun(withRun(save,run),run,run.completedAt);
  assert(result.settled);
  return result.save;
}
