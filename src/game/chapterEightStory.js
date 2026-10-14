import { missionBoard, normalizeMissionState } from "./missionSystem.js";
import { hasStoryContactDetails, storyOwn as own, storyTail as tail } from "./contactStoryPresentation.js";
import { normalizeServiceNetState } from "./serviceNetRun.js";
import { verifiedServiceNetCompletion } from "./serviceNetSettlement.js";

export const CHAPTER_EIGHT_BEATS = Object.freeze(["briefing", "queue", "checkin", "receipts", "log"]);
function iso(value) {
  return typeof value === "string" && value.length <= 32 && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
}
export function normalizeChapterEightPresentation(value) {
  const acceptedAt = iso(own(value, "acceptedAt")), beat = own(value, "beat"), qsoId = own(value, "qsoId");
  return Object.freeze({ version: 1, acceptedAt,
    beat: acceptedAt && CHAPTER_EIGHT_BEATS.includes(beat) ? beat : "briefing",
    qsoId: acceptedAt && typeof qsoId === "string" && qsoId.length > 0 && qsoId.length <= 96 ? qsoId : null });
}
export function chapterEightStoryModel(save) {
  const missions = normalizeMissionState(own(save, "missionState"));
  const active = missions.activeMissions.find(({ id }) => id === "story-08");
  const claimed = missions.claimedMissionIds.includes("story-08");
  const stored = normalizeChapterEightPresentation(own(save, "chapterEightPresentation"));
  const acceptedAt = active?.acceptedAt ?? (claimed ? stored.acceptedAt : null);
  const presentation = stored.acceptedAt === acceptedAt ? stored : normalizeChapterEightPresentation(null);
  const baseline = new Set(active?.baselineQsoIds ?? []);
  const settled = new Set(tail(own(own(save, "qsoRecords"), "settledQsoIds"), 10000));
  const chapter = normalizeServiceNetState(own(own(save, "storyContinuationState"), "chapter08"));
  const candidates = tail(own(save, "qsoLogs"), 200).filter(log => {
    const id = own(log, "id"), completedAt = iso(own(log, "completedAt"));
    if (!acceptedAt || !hasStoryContactDetails(log) || baseline.has(id) || !settled.has(id)
      || !completedAt || Date.parse(completedAt) < Date.parse(acceptedAt)
      || own(log, "playerCallsign") !== own(save, "callsign")
      || own(log, "callsign") !== "SIM8PS"
      || own(log, "eventId") !== "chapter-continuation" || own(log, "eventMode") !== "story"
      || !/^[1-5][1-9][1-9]$/.test(own(log, "sent") ?? "") || !/^[1-5][1-9][1-9]$/.test(own(log, "received") ?? "")) return false;
    try { return verifiedServiceNetCompletion(save, active ?? { acceptedAt }, [log]); } catch { return false; }
  }).sort((a,b) => Date.parse(own(a,"completedAt")) - Date.parse(own(b,"completedAt")));
  const candidate = candidates.find(log => own(log,"id") === presentation.qsoId) ?? candidates[0] ?? null;
  const receipts = candidate ? chapter.receipts.filter(item => item.qsoId === candidate.id && item.runId === candidate.eventRunId) : [];
  const status = missionBoard(save).story.find(({ id }) => id === "story-08")?.status ?? "locked";
  const playable = Boolean(active) && ["active","ready"].includes(status);
  const persistedStep = CHAPTER_EIGHT_BEATS.indexOf(presentation.beat);
  const step = candidate && ["ready","claimed"].includes(status) ? Math.max(3,persistedStep) : Math.min(2,persistedStep);
  return { status, playable, acceptedAt, presentation, candidate, receipts, step };
}
export function advanceChapterEightPresentation(save, beat) {
  const model = chapterEightStoryModel(save), step = CHAPTER_EIGHT_BEATS.indexOf(beat);
  if (!model.playable || step < 0 || step < model.step || step > model.step + 1
    || (step >= 3 && !model.candidate) || (step < 3 && model.candidate)) return { save, updated: false };
  const presentation = normalizeChapterEightPresentation({ acceptedAt: model.acceptedAt, beat, qsoId: step >= 3 ? model.candidate.id : null });
  if (JSON.stringify(presentation) === JSON.stringify(model.presentation)) return { save, updated: false };
  return { save: { ...save, chapterEightPresentation: presentation }, updated: true };
}
export function canContinueChapterEight(save, runId) {
  if (typeof runId !== "string" || !runId || runId.length > 128) return false;
  const model = chapterEightStoryModel(save);
  return model.playable && model.candidate?.eventRunId === runId;
}
