import assert from "node:assert/strict";
import {acceptMission,claimMission} from "../../src/game/missionSystem.js";
import {completed as completedTen} from "./chapterTenFixtures.js";
import {createListeningRun,observeListeningWindow,submitListeningCall,finishListeningWait,recordListeningSilence,tickListeningRun} from "../../src/game/listeningRun.js";
import {settleListeningRun} from "../../src/game/listeningSettlement.js";
import {normalizeStoryContinuationState} from "../../src/game/storyContinuationState.js";
import {interpretListeningTraffic} from "../../src/game/listeningTraffic.js";
export const ACCEPTED="2026-10-04T19:00:00.000Z";
export async function unlocked(){return claimMission(await completedTen(),"story-10","2026-10-04T18:05:00.000Z").save;}
export async function accepted(){const r=acceptMission(await unlocked(),"story-11",ACCEPTED);assert(r.accepted);return r.save;}
export function newRun(save,at="2026-10-04T19:01:00.000Z"){return createListeningRun({playerCallsign:save.callsign,seed:save.id+":listening",startedAt:at});}
export function withRun(save,run){return {...save,storyContinuationState:normalizeStoryContinuationState({...save.storyContinuationState,chapter11:{...save.storyContinuationState.chapter11,activeRun:run}})};}
export function observed(save,at="2026-10-04T19:01:00.000Z"){let r=newRun(save,at);for(let i=0;i<3;i++)r=observeListeningWindow(r,at);return r;}
export async function submit(run,message="SIM11LS DE "+run.playerCallsign+" K",at="2026-10-04T19:02:00.000Z"){return submitListeningCall(run,message,await interpretListeningTraffic(run,message),at);}
export async function finishedRun(save,{at="2026-10-04T19:02:00.000Z",calls=1}={}){
 let r=observed(save,at);for(let i=0;i<calls;i++){r=await submit(r,undefined,at);r=tickListeningRun(r,{seconds:4},at);r=finishListeningWait(r,at);}
 r=recordListeningSilence(r,at);assert.equal(r.phase,"COMPLETED");return r;
}
export async function completed(save,options={}){save??=await accepted();const r=await finishedRun(save,options),result=settleListeningRun(withRun(save,r),r,r.completedAt);assert(result.settled);return result.save;}
