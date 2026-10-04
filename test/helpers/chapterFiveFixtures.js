import { completed as completedFour } from "./chapterFourFixtures.js";
import { acceptMission, claimMission } from "../../src/game/missionSystem.js";
import { settleLightsRun } from "../../src/game/lightsSettlement.js";
import { advanceLightsPlayback, createLightsRun, currentLightsPileup, lightsRunResult, submitLightsTransmission, tickLightsRun } from "../../src/game/lightsRun.js";
export const ACCEPTED = "2026-10-04T13:00:00.000Z";
export function unlocked() {
  const result = claimMission(completedFour(), "story-04", "2026-10-04T12:10:00.000Z");
  if (!result.claimed) throw new Error("Fourth chapter fixture failed");
  return result.save;
}
export function accepted() { return acceptMission(unlocked(), "story-05", ACCEPTED).save; }
export function eventResult({ count = 7, mode = "story", startedAt = "2026-10-04T13:01:00.000Z", seed = "chapter-five-fixture" } = {}) {
  let run = createLightsRun({ mode, playerCallsign: "BH1TEST", playerRegion: "JP", seed, startedAt });
  if (mode === "story") {
    run = advanceLightsPlayback(run);
    run = submitLightsTransmission(run, "SIM5LT DE BH1TEST K");
    run = advanceLightsPlayback(run);
    run = submitLightsTransmission(run, "SIM5LT DE BH1TEST RST 579 JP K");
    run = advanceLightsPlayback(run);
  }
  const regions = new Set();
  for (let index = 0; index < count; index++) {
    run = submitLightsTransmission(run, "CQ LGT DE SIM5LT K");
    const callers = currentLightsPileup(run).callers;
    const caller = callers.find(value => !regions.has(value.regionCode)) ?? callers[0];
    run = advanceLightsPlayback(run);
    run = submitLightsTransmission(run, caller.callsign + " K");
    run = advanceLightsPlayback(run);
    run = submitLightsTransmission(run, caller.callsign + " DE SIM5LT RST 579 JP K");
    run = advanceLightsPlayback(run, new Date(Date.parse(startedAt) + (index + 1) * 30000));
    regions.add(caller.regionCode);
  }
  if (count < 7) run = tickLightsRun(run, 8 * 60000, new Date(Date.parse(startedAt) + 8 * 60000));
  return lightsRunResult(run);
}
export function completed(save = accepted(), options = {}) {
  const result = eventResult(options);
  const transaction = settleLightsRun(save, result, { now: result.completedAt });
  if (!transaction.settled) throw new Error("Lights fixture failed: " + transaction.reason);
  return transaction.save;
}
