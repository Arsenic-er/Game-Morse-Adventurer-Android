import {interpretCwTraffic} from "../qso/semanticInterpreter.js";
import {FINAL_PROMISE_TONES,requestFinalPromiseRepeat,submitFinalPromiseCall,submitFinalPromiseMessage} from "./finalPromiseRun.js";
export async function interpretFinalPromiseTraffic(run,message,provider){
 const request={message,phase:"EXCHANGE",selfCallsign:run.playerCallsign,peerCallsign:run.targetCallsign,
  pendingQuestion:run.phase,knownSlots:["CALLSIGN","ACCOUNT","CHOICE"],
  catalogs:{CALLSIGN:[run.playerCallsign,run.targetCallsign],ACCOUNT:[run.accountKey],CHOICE:FINAL_PROMISE_TONES}};
 if(typeof provider==="function"){try{const response=await provider(request);if(response?.ok&&response.result)return response.result;}catch{/* Desktop transport is optional; use the same local rules. */}}
 return interpretCwTraffic(request);
}
export function submitFinalPromiseResponse(current,requested,message,semantic,at){
 if(current.runId!==requested.runId||current.phase!==requested.phase||current.tone!==requested.tone
  ||current.recoveryActions.length!==requested.recoveryActions.length)return current;
 if(current.phase==="CALL")return submitFinalPromiseCall(current,message,semantic,at);
 if(current.phase==="FINAL_CHOICE")return requestFinalPromiseRepeat(current,message,semantic);
 if(current.phase==="FINAL_MESSAGE")return submitFinalPromiseMessage(current,message,semantic,at);
 return current;
}
export function finalPromiseRecordedMessage(record){
 const content={brief:"TNX",steady:"I WILL CONTINUE",warm:"YOUR LOG CONTINUES"}[record?.tone];
 return content ? record.targetCallsign+" DE "+record.playerCallsign+" "+content+" 73" : "";
}
