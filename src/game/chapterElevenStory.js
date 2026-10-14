import {missionBoard,normalizeMissionState} from "./missionSystem.js";
import {storyOwn as own} from "./contactStoryPresentation.js";
import {normalizeListeningState} from "./listeningRun.js";
import {verifiedListeningCompletion} from "./listeningCompletion.js";
export const CHAPTER_ELEVEN_BEATS=Object.freeze(["quiet","windows","call","silence","log"]);
function iso(value){return typeof value==="string"&&value.length<=32&&Number.isFinite(Date.parse(value))?new Date(value).toISOString():null;}
export function normalizeChapterElevenPresentation(value){
 const acceptedAt=iso(own(value,"acceptedAt")),beat=own(value,"beat"),recordId=own(value,"recordId");
 return Object.freeze({version:1,acceptedAt,beat:acceptedAt&&CHAPTER_ELEVEN_BEATS.includes(beat)?beat:"quiet",
  recordId:acceptedAt&&typeof recordId==="string"&&recordId.length>0&&recordId.length<=96?recordId:null});
}
export function chapterElevenStoryModel(save){
 const missions=normalizeMissionState(own(save,"missionState")),active=missions.activeMissions.find(m=>m.id==="story-11");
 const claimed=missions.claimedMissionIds.includes("story-11"),stored=normalizeChapterElevenPresentation(own(save,"chapterElevenPresentation"));
 const acceptedAt=active?.acceptedAt??(claimed?stored.acceptedAt:null);
 const presentation=stored.acceptedAt===acceptedAt?stored:normalizeChapterElevenPresentation(null);
 const chapter=normalizeListeningState(own(own(save,"storyContinuationState"),"chapter11"));
 const contract=active??{id:"story-11",acceptedAt,baselineListeningRunIds:[],contract:{missionPhase:"listening-silence",targetCallsign:"SIM11LS"}};
 const candidates=chapter.archive.filter(record=>{
  if(!acceptedAt||record.playerCallsign!==own(save,"callsign")||Date.parse(record.completedAt)<Date.parse(acceptedAt))return false;
  const scoped={...save,storyContinuationState:{...own(save,"storyContinuationState"),chapter11:{...chapter,archive:[record]}}};
  return verifiedListeningCompletion(scoped,contract);
 }).sort((a,b)=>Date.parse(a.completedAt)-Date.parse(b.completedAt));
 const record=candidates.find(r=>r.id===presentation.recordId)??candidates[0]??null;
 const status=missionBoard(save).story.find(m=>m.id==="story-11")?.status??"locked";
 const playable=Boolean(active)&&["active","ready"].includes(status),persistedStep=CHAPTER_ELEVEN_BEATS.indexOf(presentation.beat);
 const step=record&&["ready","claimed"].includes(status)?Math.max(3,persistedStep):Math.min(2,persistedStep);
 return {status,playable,acceptedAt,presentation,record,step};
}
export function advanceChapterElevenPresentation(save,beat){
 const model=chapterElevenStoryModel(save),step=CHAPTER_ELEVEN_BEATS.indexOf(beat);
 if(!model.playable||step<0||step<model.step||step>model.step+1||(step>=3&&!model.record)||(step<3&&model.record))return {save,updated:false};
 const presentation=normalizeChapterElevenPresentation({acceptedAt:model.acceptedAt,beat,recordId:step>=3?model.record.id:null});
 if(JSON.stringify(presentation)===JSON.stringify(model.presentation))return {save,updated:false};
 return {save:{...save,chapterElevenPresentation:presentation},updated:true};
}
export function canContinueChapterEleven(save,runId){
 if(typeof runId!=="string"||!runId||runId.length>64)return false;
 const model=chapterElevenStoryModel(save);return model.playable&&model.record?.runId===runId;
}
