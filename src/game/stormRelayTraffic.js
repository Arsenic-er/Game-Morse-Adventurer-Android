import {interpretCwTraffic} from "../qso/semanticInterpreter.js";
import {STORM_RELAY_PHASES,submitStormCheckIn,requestStormVerification,repeatStormMessage,submitStormRelay} from "./stormRelayRun.js";
export async function interpretStormRelayTraffic(run,message,provider){
 const request={message,phase:"EXCHANGE",selfCallsign:run.playerCallsign,
  peerCallsign:run.phase===STORM_RELAY_PHASES.RELAY?run.relay.callsign:run.control.callsign,pendingQuestion:run.phase,
  knownSlots:["CALLSIGN","MSG","REV","GRID","PEOPLE","ITEM","QTY","CHECK"],
  catalogs:{CALLSIGN:[run.playerCallsign,run.control.callsign,run.relay.callsign],MSG:["214"],REV:["1","2"],GRID:["PX-31"],ITEM:["WATER"]}};
 if(typeof provider==="function"){try{const response=await provider(request);if(response?.ok&&response.result)return response.result;}catch{/* Use local rules when desktop transport is unavailable. */}}
 return interpretCwTraffic(request);
}
export function submitStormRelayResponse(current,requested,message,semantic,at){
 if(current.runId!==requested.runId||current.phase!==requested.phase||current.badRelayCount!==requested.badRelayCount
  ||current.recoveryActions.length!==requested.recoveryActions.length)return current;
 if(current.phase===STORM_RELAY_PHASES.CHECK_IN)return submitStormCheckIn(current,message,semantic,at);
 if([STORM_RELAY_PHASES.CONFLICT,STORM_RELAY_PHASES.RELAY].includes(current.phase)){
  if(/^(AGN|QRS) MSG 214 K$/u.test(message.trim().toUpperCase()))return repeatStormMessage(current,message,semantic);
  return current.phase===STORM_RELAY_PHASES.CONFLICT?requestStormVerification(current,message,semantic,at):submitStormRelay(current,message,semantic,at);
 }
 return current;
}
