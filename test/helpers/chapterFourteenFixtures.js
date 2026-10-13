import assert from "node:assert/strict";
import {acceptMission,claimMission} from "../../src/game/missionSystem.js";
import {completed as completedThirteen} from "./chapterThirteenFixtures.js";
import {createFinalPromiseRun,reviewFinalPromise,receiveFinalPromiseAccount,chooseFinalPromiseTone,finalPromiseCallText,finalPromiseMessageText} from "../../src/game/finalPromiseRun.js";
import {settleFinalPromiseRun} from "../../src/game/finalPromiseSettlement.js";
import {normalizeStoryContinuationState} from "../../src/game/storyContinuationState.js";
import {interpretFinalPromiseTraffic,submitFinalPromiseResponse} from "../../src/game/finalPromiseTraffic.js";
export const ACCEPTED="2026-10-04T22:00:00.000Z";
export async function unlocked(){return claimMission(await completedThirteen(),"story-13","2026-10-04T21:05:00.000Z").save;}
export async function accepted(){const r=acceptMission(await unlocked(),"story-14",ACCEPTED);assert(r.accepted);return r.save;}
export function newRun(save,at="2026-10-04T22:01:00.000Z"){return createFinalPromiseRun({save,playerCallsign:save.callsign,seed:save.id+":final-promise",startedAt:at});}
export function withRun(save,run){return {...save,storyContinuationState:normalizeStoryContinuationState({...save.storyContinuationState,chapter14:{...save.storyContinuationState.chapter14,activeRun:run}})};}
export async function submit(run,message,at=new Date(Date.parse(run.startedAt)+60_000).toISOString()){return submitFinalPromiseResponse(run,run,message,await interpretFinalPromiseTraffic(run,message),at);}
export async function finishedRun(save,{at="2026-10-04T22:01:00.000Z",tone="steady"}={}){
 let r=reviewFinalPromise(newRun(save,at));
 r=await submit(r,finalPromiseCallText(r));assert.equal(r.phase,"ACCOUNT");
 r=receiveFinalPromiseAccount(r,new Date(Date.parse(at)+70_000).toISOString());
 r=chooseFinalPromiseTone(r,tone);r=await submit(r,finalPromiseMessageText(r),new Date(Date.parse(at)+90_000).toISOString());
 assert.equal(r.phase,"COMPLETED");return r;
}
export async function completed(save,options={}){save??=await accepted();const r=await finishedRun(save,options),result=settleFinalPromiseRun(withRun(save,r),r,r.completedAt);assert(result.settled,result.reason);return result.save;}
