import { missionBoard, normalizeMissionState, verifiedExpeditionCompletion } from "./missionSystem.js";
import { hasStoryContactDetails, storyOwn as own, storyTail as tail } from "./contactStoryPresentation.js";
import { expeditionSiteById } from "./expeditionCatalog.js";

export const CHAPTER_SIX_BEATS = Object.freeze(["pack", "wire", "call", "answer", "log"]);
function iso(value) {
  return typeof value === "string" && value.length <= 32 && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
}
export function normalizeChapterSixPresentation(value) {
  const acceptedAt = iso(own(value, "acceptedAt")), beat = own(value, "beat"), qsoId = own(value, "qsoId");
  return Object.freeze({ version: 1, acceptedAt,
    beat: acceptedAt && CHAPTER_SIX_BEATS.includes(beat) ? beat : "pack",
    qsoId: acceptedAt && typeof qsoId === "string" && qsoId.length > 0 && qsoId.length <= 96 ? qsoId : null });
}
export function chapterSixStoryModel(save) {
  const missions = normalizeMissionState(own(save, "missionState"));
  const active = missions.activeMissions.find(({ id }) => id === "story-06");
  const claimed = missions.claimedMissionIds.includes("story-06");
  const stored = normalizeChapterSixPresentation(own(save, "chapterSixPresentation"));
  const acceptedAt = active?.acceptedAt ?? (claimed ? stored.acceptedAt : null);
  const presentation = stored.acceptedAt === acceptedAt ? stored : normalizeChapterSixPresentation(null);
  const baseline = new Set(active?.baselineQsoIds ?? []);
  const settled = new Set(tail(own(own(save, "qsoRecords"), "settledQsoIds"), 10000));
  const candidates = tail(own(save, "qsoLogs"), 200).filter(log => {
    const id = own(log, "id"), call = own(log, "callsign"), sent = own(log, "sent"), received = own(log, "received");
    const completedAt = iso(own(log, "completedAt"));
    if (!acceptedAt || !hasStoryContactDetails(log) || baseline.has(id) || !settled.has(id)
      || !completedAt || Date.parse(completedAt) < Date.parse(acceptedAt)
      || own(log, "playerCallsign") !== own(save, "callsign")
      || typeof call !== "string" || !/^[A-Z0-9]{1,7}$/.test(call)
      || typeof sent !== "string" || !/^[1-5][1-9][1-9]$/.test(sent)
      || typeof received !== "string" || !/^[1-5][1-9][1-9]$/.test(received)
      || own(log, "eventId") || own(log, "eventRunId")
      || !Number.isInteger(own(log, "finalPropagationLevel")) || own(log, "finalPropagationLevel") < 0 || own(log, "finalPropagationLevel") > 4) return false;
    try { return verifiedExpeditionCompletion(save, active ?? { acceptedAt }, [log]); } catch { return false; }
  }).sort((a, b) => Date.parse(own(a, "completedAt")) - Date.parse(own(b, "completedAt")));
  const candidate = candidates.find(log => own(log, "id") === presentation.qsoId) ?? candidates[0] ?? null;
  const status = missionBoard(save).story.find(({ id }) => id === "story-06")?.status ?? "locked";
  const playable = Boolean(active) && ["active", "ready"].includes(status);
  const persistedStep = CHAPTER_SIX_BEATS.indexOf(presentation.beat);
  const step = candidate && ["ready", "claimed"].includes(status) ? Math.max(3, persistedStep) : Math.min(2, persistedStep);
  return { status, playable, acceptedAt, presentation, candidate, step,
    site: candidate ? expeditionSiteById(own(candidate, "expeditionSiteId")) : null };
}
export function advanceChapterSixPresentation(save, beat) {
  const model = chapterSixStoryModel(save), step = CHAPTER_SIX_BEATS.indexOf(beat);
  if (!model.playable || step < 0 || step < model.step || step > model.step + 1
    || (step >= 3 && !model.candidate) || (step < 3 && model.candidate)) return { save, updated: false };
  const presentation = normalizeChapterSixPresentation({ acceptedAt: model.acceptedAt, beat, qsoId: step >= 3 ? model.candidate.id : null });
  if (JSON.stringify(presentation) === JSON.stringify(model.presentation)) return { save, updated: false };
  return { save: { ...save, chapterSixPresentation: presentation }, updated: true };
}
export function canContinueChapterSix(save, runId) {
  if (typeof runId !== "string" || !runId || runId.length > 128) return false;
  const model = chapterSixStoryModel(save);
  return model.playable && model.candidate?.expeditionRunId === runId;
}
