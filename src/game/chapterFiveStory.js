import { missionBoard, normalizeMissionState } from "./missionSystem.js";
import { hasStoryContactDetails, storyOwn as own, storyTail as tail } from "./contactStoryPresentation.js";
import { lightsStoryCompletion } from "./lightsStoryProgress.js";
import { runSettlementLedgerId } from "./lightsSettlement.js";

export const CHAPTER_FIVE_BEATS = Object.freeze(["notice", "desk", "call", "answer", "log"]);
const REGIONS = ["JP", "US", "CN", "GE", "CH", "FI"];
const validId = value => typeof value === "string" && value.length > 0 && value.length <= 128;
function iso(value) {
  if (typeof value !== "string" || value.length > 32 || !Number.isFinite(Date.parse(value))) return null;
  return new Date(value).toISOString();
}
export function normalizeChapterFivePresentation(value) {
  const acceptedAt = iso(own(value, "acceptedAt"));
  const beat = own(value, "beat"), runId = own(value, "runId");
  return Object.freeze({ version: 1, acceptedAt,
    beat: acceptedAt && CHAPTER_FIVE_BEATS.includes(beat) ? beat : CHAPTER_FIVE_BEATS[0],
    runId: acceptedAt && validId(runId) ? runId : null });
}

export function chapterFiveStoryModel(save) {
  const missions = normalizeMissionState(own(save, "missionState"));
  const active = missions.activeMissions.find(({ id }) => id === "story-05");
  const claimed = missions.claimedMissionIds.includes("story-05");
  const stored = normalizeChapterFivePresentation(own(save, "chapterFivePresentation"));
  const acceptedAt = active?.acceptedAt ?? (claimed ? stored.acceptedAt : null);
  const presentation = stored.acceptedAt === acceptedAt ? stored : normalizeChapterFivePresentation(null);
  const state = own(save, "lightsEventState");
  const result = lightsStoryCompletion(state, acceptedAt, active?.baselineLightsRunIds);
  const runId = own(result, "runId"), grade = own(result, "grade"), score = own(result, "score");
  const completedAt = iso(own(result, "completedAt"));
  const settled = new Set(tail(own(own(save, "qsoRecords"), "settledQsoIds"), 10000));
  const player = own(save, "callsign");
  const seen = new Set();
  const contacts = result ? tail(own(save, "qsoLogs"), 200).filter(log => {
    const id = own(log, "id"), time = iso(own(log, "completedAt"));
    const call = own(log, "callsign"), sent = own(log, "sent"), received = own(log, "received");
    if (!hasStoryContactDetails(log) || seen.has(id) || !settled.has(id)
      || own(log, "eventId") !== "lights-across-air" || own(log, "eventMode") !== "story"
      || own(log, "eventRunId") !== runId || own(log, "onAirCallsign") !== "SIM5LT"
      || own(log, "operatorCallsign") !== player || own(log, "playerCallsign") !== player
      || typeof call !== "string" || !/^[A-Z0-9]{1,7}$/.test(call)
      || typeof sent !== "string" || !/^[1-5][1-9][1-9]$/.test(sent)
      || typeof received !== "string" || !/^[1-5][1-9][1-9]$/.test(received)
      || !REGIONS.includes(own(log, "eventRegionCode"))
      || !time || Date.parse(time) < Date.parse(acceptedAt) || Date.parse(time) > Date.parse(completedAt)) return false;
    seen.add(id); return true;
  }).sort((a, b) => Date.parse(own(a, "completedAt")) - Date.parse(own(b, "completedAt"))) : [];
  const regions = [...new Set(contacts.map(log => own(log, "eventRegionCode")))];
  const threshold = grade === "gold" ? [7, 5] : grade === "silver" ? [5, 4] : [3, 2];
  const expectedIds = tail(own(result, "contactIds"), 7);
  const completeBatch = result !== own(state, "storyLatest")
    || (expectedIds.length === contacts.length && expectedIds.length > 0
      && new Set(expectedIds).size === expectedIds.length && expectedIds.every(id => seen.has(id)));
  const verified = completeBatch && result && completedAt && Number.isInteger(score) && score >= 0 && score <= 999
    && tail(own(state, "settledRunIds"), 200).includes(runId)
    && settled.has(runSettlementLedgerId(runId))
    && contacts.length >= threshold[0] && contacts.length <= 7 && regions.length >= threshold[1];
  const candidate = verified ? { runId, completedAt, grade, score, contacts, regions } : null;
  const status = missionBoard(save).story.find(({ id }) => id === "story-05")?.status ?? "locked";
  const playable = Boolean(active) && ["active", "ready"].includes(status);
  const persistedStep = CHAPTER_FIVE_BEATS.indexOf(presentation.beat);
  const step = candidate && ["ready", "claimed"].includes(status) ? Math.max(3, persistedStep) : Math.min(2, persistedStep);
  return { status, playable, acceptedAt, presentation, candidate, step };
}
export function advanceChapterFivePresentation(save, beat) {
  const model = chapterFiveStoryModel(save), step = CHAPTER_FIVE_BEATS.indexOf(beat);
  if (!model.playable || step < model.step || step > model.step + 1 || step < 0
    || (step >= 3 && !model.candidate) || (step < 3 && model.candidate)) return { save, updated: false };
  const presentation = normalizeChapterFivePresentation({ acceptedAt: model.acceptedAt, beat, runId: step >= 3 ? model.candidate.runId : null });
  if (JSON.stringify(presentation) === JSON.stringify(model.presentation)) return { save, updated: false };
  return { save: { ...save, chapterFivePresentation: presentation }, updated: true };
}
export function canContinueChapterFive(save, mode, runId) {
  if (mode !== "story" || !validId(runId)) return false;
  const model = chapterFiveStoryModel(save);
  return model.playable && model.candidate?.runId === runId;
}
