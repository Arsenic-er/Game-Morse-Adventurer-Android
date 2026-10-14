import {interpretCwTraffic} from "../qso/semanticInterpreter.js";
import {submitListeningCall} from "./listeningRun.js";
export async function interpretListeningTraffic(run,message,provider){
 const request={message,phase:"EXCHANGE",selfCallsign:run.playerCallsign,peerCallsign:run.targetCallsign,pendingQuestion:"DIRECTED_CALL",
  knownSlots:["CALLSIGN"],catalogs:{CALLSIGN:[run.playerCallsign,run.targetCallsign]}};
 if(typeof provider==="function"){try{const response=await provider(request);if(response?.ok&&response.result)return response.result;}catch{/* Unavailable desktop transport: use ordinary local rules. */}}
 return interpretCwTraffic(request);
}
export function submitListeningResponse(current,requested,message,semantic,at){
 if(current.runId!==requested.runId||current.phase!==requested.phase||current.callCount!==requested.callCount)return current;
 return submitListeningCall(current,message,semantic,at);
}
