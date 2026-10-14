import { interpretCwTraffic } from "../qso/semanticInterpreter.js";
import { submitContestText } from "./contestRun.js";
export async function interpretContestTraffic(run,message,provider) {
  const peer=run.selectedStation ?? run.candidates[0] ?? run.controller;
  const request={message,phase:"EXCHANGE",selfCallsign:run.playerCallsign,peerCallsign:peer.callsign,
    pendingQuestion:run.phase==="EXCHANGE"?"CONTEST":run.phase==="RUN_CQ"?"CQ":"CALLSIGN",
    knownSlots:["CALLSIGN","REGION","POWER"],catalogs:{LOCATION:run.stationPool.map(({callsign})=>callsign),
      REGION:[...new Set(run.stationPool.map(({regionCode})=>regionCode))]}};
  if(typeof provider==="function"){try{const response=await provider(request);if(response?.ok&&response.result)return response.result;}catch{/* Transport unavailable: use ordinary local rules. */}}
  return interpretCwTraffic(request);
}
export function submitContestResponse(current,requested,message,semantic,at) {
  if(current.runId!==requested.runId || current.phase!==requested.phase || current.nextSerial!==requested.nextSerial
    || current.selectedStation?.personId!==requested.selectedStation?.personId)return current;
  return submitContestText(current,message,semantic,at);
}
