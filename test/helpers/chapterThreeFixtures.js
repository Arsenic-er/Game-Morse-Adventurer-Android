import { createSave } from "../../src/game/saveStore.js";
import { acceptMission, claimMission } from "../../src/game/missionSystem.js";
import { recordCompletedQso } from "../../src/qso/qsoLog.js";

export const ACCEPTED = "2026-10-04T11:00:00.000Z";
export const STYLES = ["patient-veteran", "traditional-fist", "youth-club"];
export const CALLS = ["SIM3RA", "SIM5TU", "SIM6JP"];
export function log(index = 0, overrides = {}) {
  return { id: "third-qso-" + index, playerCallsign: "BH1TEST", callsign: CALLS[index % 3],
    startedAt: "2026-10-04T11:01:00.000Z", completedAt: "2026-10-04T11:" + String(index + 2).padStart(2, "0") + ":00.000Z",
    sent: "579", received: "559", frequencyMhz: 21.06, mode: "CW", location: "CN-E",
    distanceKm: 1500, finalPropagationLevel: 3, equipmentId: "squid-01", antennaId: "dipole",
    operatorProfileId: STYLES[index % 3], copyOutcome: "copied", transmitAccuracy: 95, keyingScore: 90, wpm: 18,
    ...overrides };
}
export function unlocked() {
  let save = createSave({ callsign: "BH1TEST" });
  for (const [index, missionId] of ["story-01", "story-02"].entries()) {
    const hour = String(index + 9).padStart(2, "0");
    save = acceptMission(save, missionId, "2026-10-04T" + hour + ":00:00.000Z").save;
    save = recordCompletedQso(save, log(0, { id: "prior-" + index, startedAt: "2026-10-04T" + hour + ":01:00.000Z",
      completedAt: "2026-10-04T" + hour + ":05:00.000Z", repeatRequests: index,
      attemptHistory: index ? [{ message: "AGN K", result: "repeat" }] : [] })).save;
    const result = claimMission(save, missionId, "2026-10-04T" + hour + ":06:00.000Z");
    if (!result.claimed) throw new Error("Fixture prerequisite not completed: " + missionId);
    save = result.save;
  }
  return save;
}
export function accepted() { return acceptMission(unlocked(), "story-03", ACCEPTED).save; }
export function contact(save, index, overrides = {}) { return recordCompletedQso(save, log(index, overrides)).save; }
export function completed() { return [0, 1, 2].reduce((save, index) => contact(save, index), accepted()); }
