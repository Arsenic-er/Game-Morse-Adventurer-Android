import { interpretCwTraffic } from "../qso/semanticInterpreter.js";

// Use the same local interpreter as ordinary QSO traffic if the desktop bridge
// is absent/unavailable. An explicit provider rejection is never overridden.
export async function interpretQslStoryTraffic(run, message, provider) {
  const request = { message, phase: "EXCHANGE", selfCallsign: run.playerCallsign,
    peerCallsign: run.callsign, pendingQuestion: "QSL", knownSlots: ["CALLSIGN"],
    catalogs: { LOCATION: [run.caseId], ANTENNA: [] } };
  if (typeof provider === "function") {
    try {
      const response = await provider(request);
      if (response?.ok && response.result) return response.result;
    } catch { /* The browser's deterministic interpreter remains available. */ }
  }
  return interpretCwTraffic(request);
}
