import { interpretCwTraffic } from "../qso/semanticInterpreter.js";
import { submitServiceNetText } from "./serviceNetRun.js";

// An explicit provider rejection is final; missing desktop transport uses the same rules as other CW traffic.
export async function interpretServiceNetTraffic(run, message, provider) {
  const request = { message, phase: "EXCHANGE", selfCallsign: run.playerCallsign, peerCallsign: run.callsign,
    pendingQuestion: run.phase === "CHECK_IN" ? "CALLSIGN" : "NONE", knownSlots: ["CALLSIGN"],
    catalogs: { LOCATION: run.messages.map(item => item.messageId), REGION: run.messages.map(item => item.item) } };
  if (typeof provider === "function") {
    try { const response = await provider(request); if (response?.ok && response.result) return response.result; }
    catch { /* Browser fallback remains available. */ }
  }
  return interpretCwTraffic(request);
}
// Keep timer progress, and never apply a late response to a timeout, retry or different message.
export function submitServiceNetResponse(current, requested, message, semantic, at) {
  if (current.runId !== requested.runId || current.phase !== requested.phase
    || current.currentPosition !== requested.currentPosition) return current;
  return submitServiceNetText(current, message, semantic, at);
}
