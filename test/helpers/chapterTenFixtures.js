import assert from "node:assert/strict";
import {acceptMission,claimMission} from "../../src/game/missionSystem.js";
import {completed as completedNine} from "./chapterNineFixtures.js";
import {createContestRun,selectContestMode,contestCqText,contestExchangeText,submitContestText,finishContestRun} from "../../src/game/contestRun.js";
import {settleContestRun} from "../../src/game/contestSettlement.js";
import {normalizeStoryContinuationState} from "../../src/game/storyContinuationState.js";
import {interpretContestTraffic} from "../../src/game/contestTraffic.js";
export const ACCEPTED="2026-10-04T18:00:00.000Z";
export function unlocked(){return claimMission(completedNine(),"story-09","2026-10-04T17:05:00.000Z").save;}
export function accepted(){const result=acceptMission(unlocked(),"story-10",ACCEPTED);assert(result.accepted);return result.save;}
export function newRun(save,at="2026-10-04T18:01:00.000Z"){return createContestRun({playerCallsign:save.callsign,seed:save.id+":contest",startedAt:at});}
export function withRun(save,run){return {...save,storyContinuationState:normalizeStoryContinuationState({...save.storyContinuationState,chapter10:{...save.storyContinuationState.chapter10,activeRun:run}})};}
export async function submit(run,message,at="2026-10-04T18:02:00.000Z"){return submitContestText(run,message,await interpretContestTraffic(run,message),at);}
export async function contact(run,mode,at="2026-10-04T18:02:00.000Z"){
  run=selectContestMode(run,mode);if(mode==="RUN")run=await submit(run,contestCqText(run.playerCallsign),at);
  run=await submit(run,run.candidates[0].callsign,at);assert.equal(run.phase,"EXCHANGE");
  return submit(run,contestExchangeText(run.selectedStation,run.playerCallsign,run.nextSerial),at);
}
export async function finishedRun(save,{at="2026-10-04T18:02:00.000Z",count=6}={}){
 let run=newRun(save,at);for(let i=0;i<count;i++)run=await contact(run,i<2?"RUN":"SP",at);
 run=finishContestRun(run,at);assert.equal(run.phase,"COMPLETED");return run;
}
export async function completed(save=accepted(),options={}){
 const run=await finishedRun(save,options),result=settleContestRun(withRun(save,run),run,run.completedAt);assert(result.settled);return result.save;
}
