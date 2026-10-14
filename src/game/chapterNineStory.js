import { missionBoard, normalizeMissionState } from "./missionSystem.js";
import { hasStoryContactDetails, storyOwn as own, storyTail as tail } from "./contactStoryPresentation.js";
import { normalizeCoordinateRelayState } from "./coordinateRelayRun.js";
import { verifiedCoordinateRelayCompletion } from "./coordinateRelaySettlement.js";

export const CHAPTER_NINE_BEATS = Object.freeze(["sheet", "fields", "readback", "confirmed", "log"]);
function iso(value) {
  return typeof value === "string" && value.length <= 32 && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
}
export function normalizeChapterNinePresentation(value) {
  const acceptedAt = iso(own(value, "acceptedAt")), beat = own(value, "beat"), qsoId = own(value, "qsoId");
  return Object.freeze({ version: 1, acceptedAt,
    beat: acceptedAt && CHAPTER_NINE_BEATS.includes(beat) ? beat : "sheet",
    qsoId: acceptedAt && typeof qsoId === "string" && qsoId.length > 0 && qsoId.length <= 96 ? qsoId : null });
}
export function chapterNineStoryModel(save) {
  const missions = normalizeMissionState(own(save, "missionState"));
  const active = missions.activeMissions.find(({ id }) => id === "story-09");
  const claimed = missions.claimedMissionIds.includes("story-09");
  const stored = normalizeChapterNinePresentation(own(save, "chapterNinePresentation"));
  const acceptedAt = active?.acceptedAt ?? (claimed ? stored.acceptedAt : null);
  const presentation = stored.acceptedAt === acceptedAt ? stored : normalizeChapterNinePresentation(null);
  const baseline = new Set(active?.baselineQsoIds ?? []);
  const settled = new Set(tail(own(own(save, "qsoRecords"), "settledQsoIds"), 10000));
  const chapter = normalizeCoordinateRelayState(own(own(save, "storyContinuationState"), "chapter09"));
  const logs = tail(own(save, "qsoLogs"), 200);
  function validContact(log, callsign) {
    const id = own(log,"id"), completedAt = iso(own(log,"completedAt"));
    return Boolean(acceptedAt && hasStoryContactDetails(log) && !baseline.has(id) && settled.has(id)
      && completedAt && Date.parse(completedAt) >= Date.parse(acceptedAt)
      && own(log,"playerCallsign") === own(save,"callsign") && own(log,"callsign") === callsign
      && own(log,"eventId") === "chapter-continuation" && own(log,"eventMode") === "story"
      && /^[1-5][1-9][1-9]$/.test(own(log,"sent") ?? "") && /^[1-5][1-9][1-9]$/.test(own(log,"received") ?? ""));
  }
  const candidates = chapter.packets.flatMap(packet => {
    const source = logs.find(log => own(log,"id") === packet.sourceQsoId);
    const relay = logs.find(log => own(log,"id") === packet.relayQsoId);
    if (!validContact(source,"SIM9CR") || !validContact(relay,"SIM9RL")) return [];
    try { return verifiedCoordinateRelayCompletion(save,active ?? { acceptedAt },[source,relay]) ? [{ packet,source,relay }] : []; } catch { return []; }
  }).sort((a,b) => Date.parse(a.packet.completedAt) - Date.parse(b.packet.completedAt));
  const selected = candidates.find(item => item.relay.id === presentation.qsoId) ?? candidates[0] ?? null;
  const candidate = selected?.relay ?? null, source = selected?.source ?? null, packet = selected?.packet ?? null;
  const status = missionBoard(save).story.find(({ id }) => id === "story-09")?.status ?? "locked";
  const playable = Boolean(active) && ["active","ready"].includes(status);
  const persistedStep = CHAPTER_NINE_BEATS.indexOf(presentation.beat);
  const step = candidate && ["ready","claimed"].includes(status) ? Math.max(3,persistedStep) : Math.min(2,persistedStep);
  return { status, playable, acceptedAt, presentation, candidate, source, packet, step };
}
export function advanceChapterNinePresentation(save, beat) {
  const model = chapterNineStoryModel(save), step = CHAPTER_NINE_BEATS.indexOf(beat);
  if (!model.playable || step < 0 || step < model.step || step > model.step + 1
    || (step >= 3 && !model.candidate) || (step < 3 && model.candidate)) return { save, updated: false };
  const presentation = normalizeChapterNinePresentation({ acceptedAt: model.acceptedAt, beat, qsoId: step >= 3 ? model.candidate.id : null });
  if (JSON.stringify(presentation) === JSON.stringify(model.presentation)) return { save, updated: false };
  return { save: { ...save, chapterNinePresentation: presentation }, updated: true };
}
export function canContinueChapterNine(save, runId) {
  if (typeof runId !== "string" || !runId || runId.length > 128) return false;
  const model = chapterNineStoryModel(save);
  return model.playable && model.candidate?.eventRunId === runId;
}
