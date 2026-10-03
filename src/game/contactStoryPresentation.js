import { missionBoard, normalizeMissionState } from "./missionSystem.js";

export function storyOwn(value, key) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  try {
    const property = Object.getOwnPropertyDescriptor(value, key);
    return property && Object.hasOwn(property, "value") ? property.value : undefined;
  } catch { return undefined; }
}

export function storyTail(value, limit) {
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
const validId = id => typeof id === "string" && id.length > 0 && id.length <= 96;

// Observe the existing QSO, settlement and mission ledgers. Presentation never
// creates contacts, changes mission progress or pays rewards.
export function createContactStory({ missionId, field, beats, accepts = () => true, distinct = null, required = 1, allowRewind = false }) {
  function normalize(value) {
    const acceptedAt = iso(storyOwn(value, "acceptedAt"));
    const beat = storyOwn(value, "beat");
    const id = storyOwn(value, "qsoId");
    const qsoIds = acceptedAt ? [...new Set(storyTail(storyOwn(value, "qsoIds"), required).filter(validId))] : [];
    return Object.freeze({
      version: 1, acceptedAt,
      beat: acceptedAt && beats.includes(beat) ? beat : beats[0],
      qsoId: acceptedAt && validId(id) ? id : null,
      ...(required > 1 ? { qsoIds: Object.freeze(qsoIds) } : {}),
    });
  }

  function model(save) {
    const missions = normalizeMissionState(storyOwn(save, "missionState"));
    const active = missions.activeMissions.find(({ id }) => id === missionId);
    const claimed = missions.claimedMissionIds.includes(missionId);
    const stored = normalize(storyOwn(save, field));
    const acceptedAt = active?.acceptedAt ?? (claimed ? stored.acceptedAt : null);
    const presentation = stored.acceptedAt === acceptedAt ? stored : normalize(null);
    const baseline = new Set(active?.baselineQsoIds ?? []);
    const settled = new Set(storyTail(storyOwn(storyOwn(save, "qsoRecords"), "settledQsoIds"), 10000));
    const events = missions.events.filter(event => event.outcome === "progress"
      && event.missionIds.includes(missionId) && Date.parse(event.occurredAt) >= Date.parse(acceptedAt));
    const logs = storyTail(storyOwn(save, "qsoLogs"), 200).filter(log => {
      const id = storyOwn(log, "id");
      const completedAt = iso(storyOwn(log, "completedAt"));
      const callsign = storyOwn(log, "callsign");
      const sent = storyOwn(log, "sent");
      const received = storyOwn(log, "received");
      return acceptedAt && !baseline.has(id) && settled.has(id)
        && completedAt && Date.parse(completedAt) >= Date.parse(acceptedAt)
        && !storyOwn(log, "eventId") && !storyOwn(log, "eventRunId")
        && typeof callsign === "string" && /^[A-Z0-9]{1,7}$/.test(callsign)
        && typeof sent === "string" && /^[1-5][1-9][1-9]$/.test(sent)
        && typeof received === "string" && /^[1-5][1-9][1-9]$/.test(received)
        && accepts(log)
        && events.some(event => event.qsoId === id && event.callsign === callsign && event.occurredAt === completedAt);
    }).sort((a, b) => Date.parse(storyOwn(a, "completedAt")) - Date.parse(storyOwn(b, "completedAt")));
    const unique = entries => {
      const keys = new Set();
      const ids = new Set();
      return entries.filter(log => {
        const key = distinct ? distinct(log) : storyOwn(log, "id");
        const id = storyOwn(log, "id");
        if (keys.has(key) || ids.has(id)) return false;
        keys.add(key); ids.add(id); return true;
      }).slice(0, required);
    };
    const pinnedIds = required > 1 ? presentation.qsoIds : [presentation.qsoId];
    const pinned = unique(pinnedIds.map(id => logs.find(log => storyOwn(log, "id") === id)).filter(Boolean));
    const contacts = pinned.length === required ? pinned : unique(logs);
    const candidate = contacts.length === required ? contacts.at(-1) : null;
    const status = missionBoard(save).story.find(({ id }) => id === missionId)?.status ?? "locked";
    const playable = Boolean(active) && ["active", "ready"].includes(status);
    const persistedStep = beats.indexOf(presentation.beat);
    const step = candidate && ["ready", "claimed"].includes(status)
      ? Math.max(3, persistedStep) : Math.min(2, persistedStep);
    return { status, playable, acceptedAt, presentation, candidate, step, contacts,
      matchingQsoIds: logs.map(log => storyOwn(log, "id")) };
  }

  function advance(save, beat) {
    const current = model(save);
    const step = beats.indexOf(beat);
    if (!current.playable || step < 0 || step > current.step + 1 || (!allowRewind && step < current.step)
      || (step >= 3 && !current.candidate) || (step < 3 && current.candidate)) return { save, updated: false };
    const presentation = normalize({
      acceptedAt: current.acceptedAt, beat,
      qsoId: step >= 3 ? current.candidate.id : null,
      qsoIds: step >= 3 ? current.contacts.map(log => log.id) : [],
    });
    if (JSON.stringify(presentation) === JSON.stringify(current.presentation)) return { save, updated: false };
    return { save: { ...save, [field]: presentation }, updated: true };
  }
  return { normalize, model, advance };
}

// Later chapters display frequency and use IDs as stable multi-contact keys.
export function hasStoryContactDetails(log) {
  const frequency = storyOwn(log, "frequencyMhz");
  return validId(storyOwn(log, "id")) && typeof frequency === "number" && Number.isFinite(frequency) && frequency > 0;
}
