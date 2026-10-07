import assert from "node:assert/strict";
import { acceptMission, claimMission } from "../../src/game/missionSystem.js";
import { completed as completedEight } from "./chapterEightFixtures.js";
import { createCoordinateRelayRun, beginCoordinateRelayRun, receiveCoordinatePacket, receiveRelayConfirmation, coordinatePacketText, submitCoordinateRelayText } from "../../src/game/coordinateRelayRun.js";
import { settleCoordinateRelayRun } from "../../src/game/coordinateRelaySettlement.js";
import { normalizeStoryContinuationState } from "../../src/game/storyContinuationState.js";
import { interpretCwTraffic } from "../../src/qso/semanticInterpreter.js";
export const ACCEPTED="2026-10-04T17:00:00.000Z";
export function unlocked(){return claimMission(completedEight(),"story-08","2026-10-04T16:05:00.000Z").save;}
export function accepted(){const result=acceptMission(unlocked(),"story-09",ACCEPTED);assert(result.accepted);return result.save;}
export function newRun(save,at="2026-10-04T17:01:00.000Z"){
 return createCoordinateRelayRun({playerCallsign:save.callsign,seed:save.id+":relay",startedAt:at});
}
export function withRun(save,run){
 return {...save,storyContinuationState:normalizeStoryContinuationState({...save.storyContinuationState,
  chapter09:{...save.storyContinuationState.chapter09,activeRun:run}})};
}
export function submit(run,message=coordinatePacketText(run.packet),at="2026-10-04T17:02:00.000Z"){
 return submitCoordinateRelayText(run,message,interpretCwTraffic({message,phase:"EXCHANGE",selfCallsign:run.playerCallsign}),at);
}
export function finishedRun(save,{at="2026-10-04T17:02:00.000Z"}={}){
 let run=receiveCoordinatePacket(beginCoordinateRelayRun(newRun(save,at)));
 run=submit(run,coordinatePacketText(run.packet),at);run=submit(run,coordinatePacketText(run.packet),at);
 run=receiveRelayConfirmation(run,"QSL MSG "+run.packet.packetId+" CHECK "+String(run.packet.check).padStart(2,"0")+" K",at);
 assert.equal(run.phase,"COMPLETED");return run;
}
export function completed(save=accepted(),options={}){
 const run=finishedRun(save,options),result=settleCoordinateRelayRun(withRun(save,run),run,run.completedAt);
 assert(result.settled);return result.save;
}
