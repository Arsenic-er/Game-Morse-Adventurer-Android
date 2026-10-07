import { missionBoard, normalizeMissionState, verifiedQslStoryCompletion } from "./missionSystem.js";
import { hasStoryContactDetails, storyOwn as own, storyTail as tail } from "./contactStoryPresentation.js";
import { normalizeQslStoryState } from "./qslStoryRun.js";
import { verifiedExpeditionQslRecords } from "./qslRecords.js";

export const CHAPTER_SEVEN_BEATS = Object.freeze(["card", "compare", "call", "answer", "log"]);
function iso(value) {
  return typeof value === "string" && value.length <= 32 && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
}
export function normalizeChapterSevenPresentation(value) {
  const acceptedAt = iso(own(value, "acceptedAt")), beat = own(value, "beat"), qsoId = own(value, "qsoId");
  return Object.freeze({ version: 1, acceptedAt,
    beat: acceptedAt && CHAPTER_SEVEN_BEATS.includes(beat) ? beat : "card",
    qsoId: acceptedAt && typeof qsoId === "string" && qsoId.length > 0 && qsoId.length <= 96 ? qsoId : null });
}
export function chapterSevenStoryModel(save) {
  const missions = normalizeMissionState(own(save, "missionState"));
  const active = missions.activeMissions.find(({ id }) => id === "story-07");
  const claimed = missions.claimedMissionIds.includes("story-07");
  const stored = normalizeChapterSevenPresentation(own(save, "chapterSevenPresentation"));
  const acceptedAt = active?.acceptedAt ?? (claimed ? stored.acceptedAt : null);
  const presentation = stored.acceptedAt === acceptedAt ? stored : normalizeChapterSevenPresentation(null);
  const baseline = new Set(active?.baselineQsoIds ?? []);
  const settled = new Set(tail(own(own(save, "qsoRecords"), "settledQsoIds"), 10000));
  const chapter = normalizeQslStoryState(own(own(save, "storyContinuationState"), "chapter07"));
  const candidates = tail(own(save, "qsoLogs"), 200).filter(log => {
    const id = own(log, "id"), completedAt = iso(own(log, "completedAt"));
    if (!acceptedAt || !hasStoryContactDetails(log) || baseline.has(id) || !settled.has(id)
      || !completedAt || Date.parse(completedAt) < Date.parse(acceptedAt)
      || own(log, "playerCallsign") !== own(save, "callsign")
      || own(log, "callsign") !== "SIM6JP"
      || own(log, "eventId") !== "chapter-continuation" || own(log, "eventMode") !== "story"
      || !/^[1-5][1-9][1-9]$/.test(own(log, "sent") ?? "") || !/^[1-5][1-9][1-9]$/.test(own(log, "received") ?? "")) return false;
    try { return verifiedQslStoryCompletion(save, active ?? { acceptedAt }, [log]); } catch { return false; }
  }).sort((a,b) => Date.parse(own(a,"completedAt")) - Date.parse(own(b,"completedAt")));
  const candidate = candidates.find(log => own(log,"id") === presentation.qsoId) ?? candidates[0] ?? null;
  const qslCase = candidate ? chapter.cases.find(item => item.qsoId === candidate.id && item.runId === candidate.eventRunId) ?? null : null;
  const sources = verifiedExpeditionQslRecords(save).filter(record => record.choice);
  const source = sources.find(record => record.id === (qslCase?.sourceQslId ?? chapter.activeRun?.sourceQslId)) ?? sources[0] ?? null;
  const status = missionBoard(save).story.find(({ id }) => id === "story-07")?.status ?? "locked";
  const playable = Boolean(active) && ["active","ready"].includes(status);
  const persistedStep = CHAPTER_SEVEN_BEATS.indexOf(presentation.beat);
  const step = candidate && ["ready","claimed"].includes(status) ? Math.max(3,persistedStep) : Math.min(2,persistedStep);
  return { status, playable, acceptedAt, presentation, candidate, qslCase, source, step };
}
export function advanceChapterSevenPresentation(save, beat) {
  const model = chapterSevenStoryModel(save), step = CHAPTER_SEVEN_BEATS.indexOf(beat);
  if (!model.playable || step < 0 || step < model.step || step > model.step + 1
    || (step >= 3 && !model.candidate) || (step < 3 && model.candidate)) return { save, updated: false };
  const presentation = normalizeChapterSevenPresentation({ acceptedAt: model.acceptedAt, beat, qsoId: step >= 3 ? model.candidate.id : null });
  if (JSON.stringify(presentation) === JSON.stringify(model.presentation)) return { save, updated: false };
  return { save: { ...save, chapterSevenPresentation: presentation }, updated: true };
}
export function canContinueChapterSeven(save, runId) {
  if (typeof runId !== "string" || !runId || runId.length > 128) return false;
  const model = chapterSevenStoryModel(save);
  return model.playable && model.candidate?.eventRunId === runId;
}
