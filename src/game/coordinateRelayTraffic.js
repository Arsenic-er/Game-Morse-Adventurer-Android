import { interpretCwTraffic } from "../qso/semanticInterpreter.js";
import { submitCoordinateRelayText } from "./coordinateRelayRun.js";
export async function interpretCoordinateRelayTraffic(run, message, provider) {
 const request={message,phase:"EXCHANGE",selfCallsign:run.playerCallsign,
   peerCallsign:run.phase==="RELAY_PACKET"?run.relay.callsign:run.source.callsign,
   pendingQuestion:"NONE",knownSlots:["LOCATION"],catalogs:{LOCATION:[run.packet.grid],REGION:["PX"]}};
 if(typeof provider==="function"){
  try{const response=await provider(request);if(response?.ok&&response.result)return response.result;}
  catch{/* Use ordinary local rules only when the desktop transport is unavailable. */}
 }
 return interpretCwTraffic(request);
}
export function submitCoordinateRelayResponse(current,requested,message,semantic,at){
 if(current.runId!==requested.runId||current.phase!==requested.phase)return current;
 return submitCoordinateRelayText(current,message,semantic,at);
}
