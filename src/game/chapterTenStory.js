import { missionBoard, normalizeMissionState } from "./missionSystem.js";
import { hasStoryContactDetails, storyOwn as own, storyTail as tail } from "./contactStoryPresentation.js";
import { normalizeContestState } from "./contestRun.js";
import { verifiedContestCompletion } from "./contestCompletion.js";

export const CHAPTER_TEN_BEATS = Object.freeze(["clock", "modes", "exchange", "result", "log"]);
function iso(value) {
  return typeof value === "string" && value.length <= 32 && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
}
export function normalizeChapterTenPresentation(value) {
  const acceptedAt = iso(own(value,"acceptedAt")), beat = own(value,"beat"), qsoId = own(value,"qsoId");
  return Object.freeze({ version:1, acceptedAt, beat:acceptedAt && CHAPTER_TEN_BEATS.includes(beat) ? beat : "clock",
    qsoId:acceptedAt && typeof qsoId === "string" && qsoId.length > 0 && qsoId.length <= 96 ? qsoId : null });
}
export function chapterTenStoryModel(save) {
  const missions = normalizeMissionState(own(save,"missionState"));
  const active = missions.activeMissions.find(({id})=>id === "story-10"), claimed = missions.claimedMissionIds.includes("story-10");
  const stored = normalizeChapterTenPresentation(own(save,"chapterTenPresentation"));
  const acceptedAt = active?.acceptedAt ?? (claimed ? stored.acceptedAt : null);
  const presentation = stored.acceptedAt === acceptedAt ? stored : normalizeChapterTenPresentation(null);
  const baseline = new Set(active?.baselineQsoIds ?? []);
  const settled = new Set(tail(own(own(save,"qsoRecords"),"settledQsoIds"),10000));
  const chapter = normalizeContestState(own(own(save,"storyContinuationState"),"chapter10"));
  const logs = tail(own(save,"qsoLogs"),200);
  const candidates = chapter.records.flatMap(record=>{
    const contacts = record.contactQsoIds.map(id=>logs.find(log=>own(log,"id")===id));
    if (!acceptedAt || contacts.some(log=>!hasStoryContactDetails(log) || baseline.has(own(log,"id")) || !settled.has(own(log,"id"))
      || own(log,"playerCallsign")!==own(save,"callsign") || own(log,"eventId")!=="chapter-continuation"
      || own(log,"eventMode")!=="story" || !iso(own(log,"completedAt")) || Date.parse(own(log,"completedAt"))<Date.parse(acceptedAt)
      || !/^[1-5][1-9][1-9]$/.test(own(log,"sent")??"") || !/^[1-5][1-9][1-9]$/.test(own(log,"received")??""))) return [];
    const scoped = {...save,storyContinuationState:{...own(save,"storyContinuationState"),chapter10:{...chapter,records:[record]}}};
    return verifiedContestCompletion(scoped,active ?? {acceptedAt},contacts) ? [{record,contacts,candidate:contacts.at(-1)}] : [];
  }).sort((a,b)=>Date.parse(a.record.completedAt)-Date.parse(b.record.completedAt));
  const selected = candidates.find(item=>item.candidate.id===presentation.qsoId) ?? candidates[0] ?? null;
  const status = missionBoard(save).story.find(({id})=>id==="story-10")?.status ?? "locked";
  const candidate = selected?.candidate ?? null, record = selected?.record ?? null, contacts = selected?.contacts ?? [];
  const playable = Boolean(active) && ["active","ready"].includes(status), persistedStep = CHAPTER_TEN_BEATS.indexOf(presentation.beat);
  const step = candidate && ["ready","claimed"].includes(status) ? Math.max(3,persistedStep) : Math.min(2,persistedStep);
  return {status,playable,acceptedAt,presentation,candidate,record,contacts,step};
}
export function advanceChapterTenPresentation(save,beat) {
  const model=chapterTenStoryModel(save),step=CHAPTER_TEN_BEATS.indexOf(beat);
  if(!model.playable || step<0 || step<model.step || step>model.step+1 || (step>=3&&!model.candidate) || (step<3&&model.candidate))return {save,updated:false};
  const presentation=normalizeChapterTenPresentation({acceptedAt:model.acceptedAt,beat,qsoId:step>=3?model.candidate.id:null});
  if(JSON.stringify(presentation)===JSON.stringify(model.presentation))return {save,updated:false};
  return {save:{...save,chapterTenPresentation:presentation},updated:true};
}
export function canContinueChapterTen(save,runId) {
  if(typeof runId!=="string"||!runId||runId.length>128)return false;
  const model=chapterTenStoryModel(save);return model.playable && model.record?.runId===runId;
}
