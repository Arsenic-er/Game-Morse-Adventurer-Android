import assert from "node:assert/strict";
import {acceptMission,claimMission} from "../../src/game/missionSystem.js";
import {completed as completedEleven} from "./chapterElevenFixtures.js";
import {createStormRelayRun,receiveStormConflict,stormPacketText} from "../../src/game/stormRelayRun.js";
import {settleStormRelayRun} from "../../src/game/stormRelaySettlement.js";
import {normalizeStoryContinuationState} from "../../src/game/storyContinuationState.js";
import {interpretStormRelayTraffic,submitStormRelayResponse} from "../../src/game/stormRelayTraffic.js";
export const ACCEPTED="2026-10-04T20:00:00.000Z";
export async function unlocked(){return claimMission(await completedEleven(),"story-11","2026-10-04T19:05:00.000Z").save;}
export async function accepted(){const r=acceptMission(await unlocked(),"story-12",ACCEPTED);assert(r.accepted);return r.save;}
export function newRun(save,at="2026-10-04T20:01:00.000Z"){return createStormRelayRun({playerCallsign:save.callsign,seed:save.id+":storm",startedAt:at});}
export function withRun(save,run){return {...save,storyContinuationState:normalizeStoryContinuationState({...save.storyContinuationState,chapter12:{...save.storyContinuationState.chapter12,activeRun:run}})};}
export async function submit(run,message,at="2026-10-04T20:02:00.000Z"){return submitStormRelayResponse(run,run,message,await interpretStormRelayTraffic(run,message),at);}
export async function finishedRun(save,{at="2026-10-04T20:02:00.000Z"}={}){
 let r=newRun(save,at);r=await submit(r,"SIM12CS DE "+r.playerCallsign+" QTC K",at);r=receiveStormConflict(r,at);
 r=await submit(r,"AGN MSG 214 REV K",at);r=await submit(r,stormPacketText(r.packets[2]),at);assert.equal(r.phase,"COMPLETED");return r;
}
export async function completed(save,options={}){save??=await accepted();const r=await finishedRun(save,options),result=settleStormRelayRun(withRun(save,r),r,r.completedAt);assert(result.settled);return result.save;}
