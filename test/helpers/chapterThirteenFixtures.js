import assert from "node:assert/strict";
import {acceptMission,claimMission} from "../../src/game/missionSystem.js";
import {completed as completedTwelve} from "./chapterTwelveFixtures.js";
import {createNightOperationsRun,chooseNightWindow,tickNightOperationsRun} from "../../src/game/nightOperationsRun.js";
import {settleNightOperationsRun} from "../../src/game/nightOperationsSettlement.js";
import {normalizeStoryContinuationState} from "../../src/game/storyContinuationState.js";
import {interpretNightOperationsTraffic,submitNightOperationsResponse} from "../../src/game/nightOperationsTraffic.js";
export const ACCEPTED="2026-10-04T21:00:00.000Z";
export async function unlocked(){return claimMission(await completedTwelve(),"story-12","2026-10-04T20:05:00.000Z").save;}
export async function accepted(){const r=acceptMission(await unlocked(),"story-13",ACCEPTED);assert(r.accepted);return r.save;}
export function newRun(save,at="2026-10-04T21:01:00.000Z"){return createNightOperationsRun({save,seed:save.id+":night",startedAt:at});}
export function withRun(save,run){return {...save,storyContinuationState:normalizeStoryContinuationState({...save.storyContinuationState,chapter13:{...save.storyContinuationState.chapter13,activeRun:run}})};}
export async function submit(run,message,at=new Date(Date.parse(run.startedAt)+run.activeMilliseconds).toISOString()){return submitNightOperationsResponse(run,run,message,await interpretNightOperationsTraffic(run,message),at);}
export async function finishedRun(save,{at="2026-10-04T21:01:00.000Z",pausedMilliseconds=0}={}){
 let r=newRun(save,at);
 for(const window of r.windows.slice(0,3)){
  r=tickNightOperationsRun(r,{milliseconds:window.opensAtMilliseconds-r.activeMilliseconds});
  r=chooseNightWindow(r,window.id);r=await submit(r,window.callsign+" DE "+r.playerCallsign+" K");
  r=await submit(r,window.callsign+" DE "+r.playerCallsign+" 599 "+window.band+" K",new Date(Date.parse(at)+r.activeMilliseconds+pausedMilliseconds).toISOString());
 }assert.equal(r.phase,"COMPLETED");return r;
}
export async function completed(save,options={}){save??=await accepted();const r=await finishedRun(save,options),result=settleNightOperationsRun(withRun(save,r),r,r.completedAt);assert(result.settled,result.reason);return result.save;}
