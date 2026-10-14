import {missionBoard,normalizeMissionState} from "./missionSystem.js";
import {storyOwn as own,storyTail as tail} from "./contactStoryPresentation.js";
import {normalizeFinalPromiseState} from "./finalPromiseRun.js";
import {verifiedFinalPromiseCompletion} from "./finalPromiseSettlement.js";
export const CHAPTER_FOURTEEN_BEATS=Object.freeze(["page","review","call","reply","log"]);
function iso(value){return typeof value==="string"&&value.length<=32&&Number.isFinite(Date.parse(value))?new Date(value).toISOString():null;}
export function normalizeChapterFourteenPresentation(value){
 const acceptedAt=iso(own(value,"acceptedAt")),beat=own(value,"beat"),recordId=own(value,"recordId");
 return Object.freeze({version:1,acceptedAt,beat:acceptedAt&&CHAPTER_FOURTEEN_BEATS.includes(beat)?beat:"page",
  recordId:acceptedAt&&typeof recordId==="string"&&recordId.length>0&&recordId.length<=96?recordId:null});
}
export function chapterFourteenStoryModel(save){
 const missions=normalizeMissionState(own(save,"missionState")),active=missions.activeMissions.find(m=>m.id==="story-14");
 const claimed=missions.claimedMissionIds.includes("story-14"),stored=normalizeChapterFourteenPresentation(own(save,"chapterFourteenPresentation"));
 const acceptedAt=active?.acceptedAt??(claimed?stored.acceptedAt:null);
 const presentation=stored.acceptedAt===acceptedAt?stored:normalizeChapterFourteenPresentation(null);
 const chapter=normalizeFinalPromiseState(own(own(save,"storyContinuationState"),"chapter14"));
 const contract=active??{id:"story-14",acceptedAt,baselineFinalPromiseRunIds:[],contract:{missionPhase:"final-promise",targetCallsign:"SIM14FP"}};
 const logs=tail(own(save,"qsoLogs"),200),settled=new Set(tail(own(own(save,"qsoRecords"),"settledQsoIds"),10000));
 const candidates=chapter.archive.filter(record=>{
  if([record.qsoId].some(id=>{
   const log=logs.find(entry=>own(entry,"id")===id);
   return !log||!settled.has(id)||own(log,"playerCallsign")!==own(save,"callsign")
    ||own(log,"eventId")!=="chapter-continuation"||own(log,"eventMode")!=="story";
  }))return false;
  if(!acceptedAt||record.playerCallsign!==own(save,"callsign")||Date.parse(record.completedAt)<Date.parse(acceptedAt))return false;
  const scoped={...save,storyContinuationState:{...own(save,"storyContinuationState"),chapter14:{...chapter,archive:[record]}}};
  return verifiedFinalPromiseCompletion(scoped,contract);
 }).sort((a,b)=>Date.parse(a.completedAt)-Date.parse(b.completedAt));
 const record=candidates.find(r=>r.id===presentation.recordId)??candidates[0]??null;
 const status=missionBoard(save).story.find(m=>m.id==="story-14")?.status??"locked";
 const playable=Boolean(active)&&["active","ready"].includes(status),persistedStep=CHAPTER_FOURTEEN_BEATS.indexOf(presentation.beat);
 const step=record&&["ready","claimed"].includes(status)?Math.max(3,persistedStep):Math.min(2,persistedStep);
 return {status,playable,acceptedAt,presentation,record,step};
}
export function advanceChapterFourteenPresentation(save,beat){
 const model=chapterFourteenStoryModel(save),step=CHAPTER_FOURTEEN_BEATS.indexOf(beat);
 if(!model.playable||step<0||step<model.step||step>model.step+1||(step>=3&&!model.record)||(step<3&&model.record))return {save,updated:false};
 const presentation=normalizeChapterFourteenPresentation({acceptedAt:model.acceptedAt,beat,recordId:step>=3?model.record.id:null});
 if(JSON.stringify(presentation)===JSON.stringify(model.presentation))return {save,updated:false};
 return {save:{...save,chapterFourteenPresentation:presentation},updated:true};
}
export function canContinueChapterFourteen(save,runId){
 if(typeof runId!=="string"||!runId||runId.length>64)return false;
 const model=chapterFourteenStoryModel(save);return model.playable&&model.record?.runId===runId;
}
