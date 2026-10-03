import { missionBoard, normalizeMissionState } from "./missionSystem.js";

export const CHAPTER_TWO_BEATS = Object.freeze(["paper", "margin", "call", "answer", "log"]);

function own(value, key) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  try {
    const property = Object.getOwnPropertyDescriptor(value, key);
    return property && Object.hasOwn(property, "value") ? property.value : undefined;
  } catch { return undefined; }
}

function tail(value, limit) {
  if (!Array.isArray(value)) return [];
  try {
    const length = Object.getOwnPropertyDescriptor(value, "length")?.value;
    if (!Number.isSafeInteger(length) || length < 0) return [];
    const result = [];
    for (let index = Math.max(0, length - limit); index < length; index += 1) {
      const property = Object.getOwnPropertyDescriptor(value, String(index));
      if (!property || !Object.hasOwn(property, "value")) return [];
      result.push(property.value);
    }
    return result;
  } catch { return []; }
}

function iso(value) {
  if (typeof value !== "string" || value.length > 32) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

export function normalizeChapterTwoPresentation(value) {
  const acceptedAt = iso(own(value, "acceptedAt"));
  const beat = own(value, "beat");
  const id = own(value, "qsoId");
  return Object.freeze({
    version: 1,
    acceptedAt,
    beat: acceptedAt && CHAPTER_TWO_BEATS.includes(beat) ? beat : "paper",
    qsoId: acceptedAt && typeof id === "string" && id.length > 0 && id.length <= 96 ? id : null,
  });
}

// Presentation observes the existing settlement ledger; it never creates a QSO,
// changes mission completion, or awards money itself.
export function chapterTwoStoryModel(save) {
  const missions = normalizeMissionState(own(save, "missionState"));
  const active = missions.activeMissions.find(({ id }) => id === "story-02");
  const claimed = missions.claimedMissionIds.includes("story-02");
  const stored = normalizeChapterTwoPresentation(own(save, "chapterTwoPresentation"));
  const acceptedAt = active?.acceptedAt ?? (claimed ? stored.acceptedAt : null);
  const presentation = stored.acceptedAt === acceptedAt ? stored : normalizeChapterTwoPresentation(null);
  const baseline = new Set(active?.baselineQsoIds ?? []);
  const settled = new Set(tail(own(own(save, "qsoRecords"), "settledQsoIds"), 10000));
  const events = missions.events.filter((event) => event.outcome === "progress"
    && event.missionIds.includes("story-02") && Date.parse(event.occurredAt) >= Date.parse(acceptedAt));
  const logs = tail(own(save, "qsoLogs"), 200).filter((log) => {
    const id = own(log, "id");
    const completedAt = iso(own(log, "completedAt"));
    const callsign = own(log, "callsign");
    const sent = own(log, "sent");
    const received = own(log, "received");
    const frequency = own(log, "frequencyMhz");
    const repeated = tail(own(log, "attemptHistory"), 50).some((attempt) => {
      const message = own(attempt, "message");
      return typeof message === "string" && message.trim().toUpperCase() === "AGN K"
        && own(attempt, "result") === "repeat";
    });
    return acceptedAt && typeof id === "string" && id.length > 0 && id.length <= 96
      && callsign === "SIM3RA" && repeated && typeof frequency === "number" && Number.isFinite(frequency) && frequency > 0
      && !baseline.has(id) && settled.has(id)
      && completedAt && Date.parse(completedAt) >= Date.parse(acceptedAt)
      && !own(log, "eventId") && !own(log, "eventRunId")
      && typeof callsign === "string" && /^[A-Z0-9]{1,7}$/.test(callsign)
      && typeof sent === "string" && /^[1-5][1-9][1-9]$/.test(sent)
      && typeof received === "string" && /^[1-5][1-9][1-9]$/.test(received)
      && events.some((event) => event.qsoId === id && event.callsign === callsign && event.occurredAt === completedAt);
  }).sort((a, b) => Date.parse(own(a, "completedAt")) - Date.parse(own(b, "completedAt")));
  const candidate = logs.find((log) => own(log, "id") === presentation.qsoId) ?? logs[0] ?? null;
  const status = missionBoard(save).story.find(({ id }) => id === "story-02")?.status ?? "locked";
  const playable = Boolean(active) && ["active", "ready"].includes(status);
  const persistedStep = CHAPTER_TWO_BEATS.indexOf(presentation.beat);
  const step = candidate && ["ready", "claimed"].includes(status)
    ? Math.max(3, persistedStep) : Math.min(2, persistedStep);
  return { status, playable, acceptedAt, presentation, candidate, step };
}

export function advanceChapterTwoPresentation(save, beat) {
  const model = chapterTwoStoryModel(save);
  const step = CHAPTER_TWO_BEATS.indexOf(beat);
  if (!model.playable || step < 0 || (step !== model.step && step !== model.step + 1)
    || (step >= 3 && !model.candidate) || (step < 3 && model.candidate)) {
    return { save, updated: false };
  }
  const presentation = normalizeChapterTwoPresentation({
    acceptedAt: model.acceptedAt,
    beat,
    qsoId: step >= 3 ? model.candidate.id : null,
  });
  if (JSON.stringify(presentation) === JSON.stringify(model.presentation)) return { save, updated: false };
  return { save: { ...save, chapterTwoPresentation: presentation }, updated: true };
}
