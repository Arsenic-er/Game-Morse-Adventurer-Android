import { completed as completedThree } from "./chapterThreeFixtures.js";
import { acceptMission, claimMission } from "../../src/game/missionSystem.js";
import { recordCompletedQso } from "../../src/qso/qsoLog.js";
export const ACCEPTED = "2026-10-04T12:00:00.000Z";
export function unlocked() {
  const result = claimMission(completedThree(), "story-03", "2026-10-04T11:10:00.000Z");
  if (!result.claimed) throw new Error("Chapter three fixture was not completed");
  return result.save;
}
export function accepted() { return acceptMission(unlocked(), "story-04", ACCEPTED).save; }
export function log(overrides = {}) {
  return { id: "fourth-weather-qso", playerCallsign: "BH1TEST", callsign: "SIM2DX",
    startedAt: "2026-10-04T12:01:00.000Z", completedAt: "2026-10-04T12:05:00.000Z",
    sent: "579", received: "559", frequencyMhz: 21.06, mode: "CW", location: "AF-S",
    distanceKm: 14700, finalPropagationLevel: 2, equipmentId: "squid-01", antennaId: "dipole",
    operatorProfileId: "weak-signal-listener", copyOutcome: "copied", transmitAccuracy: 95, keyingScore: 90, wpm: 18,
    optionalExchangeQuestion: "weather", optionalExchangeOutcome: "answered", repeatRequests: 1,
    attemptHistory: [
      { stage: "PLAYER_OPTIONAL_ANSWER", message: "QRS K", result: "repeat" },
      { stage: "PLAYER_OPTIONAL_ANSWER", message: "OPTIONAL RESPONSE REDACTED", result: "accepted" },
    ], ...overrides };
}
export function completed(save = accepted(), overrides = {}) { return recordCompletedQso(save, log(overrides)).save; }
