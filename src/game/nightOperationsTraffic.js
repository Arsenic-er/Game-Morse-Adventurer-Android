import {interpretCwTraffic} from "../qso/semanticInterpreter.js";
import {requestNightOperationsRepeat,submitNightOperationsCall,submitNightExchange} from "./nightOperationsRun.js";
export async function interpretNightOperationsTraffic(run,message,provider){
 const target=run.windows.find(window=>window.id===run.currentWindowId);
 if(!target)return {safeToCommit:false};
 const request={message,phase:"EXCHANGE",selfCallsign:run.playerCallsign,peerCallsign:target.callsign,
  pendingQuestion:run.phase,knownSlots:["CALLSIGN","RST","BAND"],
  catalogs:{CALLSIGN:[run.playerCallsign,target.callsign],RST:["599"],BAND:["40M","20M","15M"]}};
 if(typeof provider==="function"){try{const response=await provider(request);if(response?.ok&&response.result)return response.result;}catch{/* Desktop transport is optional; use the same local rules. */}}
 return interpretCwTraffic(request);
}
export function submitNightOperationsResponse(current,requested,message,semantic,at){
 if(current.runId!==requested.runId||current.phase!==requested.phase||current.currentWindowId!==requested.currentWindowId
  ||current.contacts.length!==requested.contacts.length||current.recoveryActions.length!==requested.recoveryActions.length)return current;
 if(/^(AGN|QRS)(?: K)?$/u.test(message.trim().toUpperCase()))return requestNightOperationsRepeat(current,message,semantic);
 return current.phase==="CALL"?submitNightOperationsCall(current,message,semantic):submitNightExchange(current,message,semantic,at);
}
