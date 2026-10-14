import {missionBoard,normalizeMissionState} from "./missionSystem.js";
import {storyOwn as own,storyTail as tail} from "./contactStoryPresentation.js";
import {normalizeFirstPageGoal} from "./firstPageState.js";
import {firstPageCandidate,settleFirstPage,verifiedFirstPageRecord} from "./firstPageSettlement.js";
export const CHAPTER_FIFTEEN_BEATS=Object.freeze(["morning","blank","call","choose","log"]);
function iso(value){return typeof value==="string"&&value.length<=32&&Number.isFinite(Date.parse(value))?new Date(value).toISOString():null;}
export function normalizeChapterFifteenPresentation(value){
 const acceptedAt=iso(own(value,"acceptedAt")),beat=own(value,"beat"),id=own(value,"qsoId");
 const qsoId=acceptedAt&&typeof id==="string"&&id.length>0&&id.length<=96?id:null;
 return Object.freeze({version:1,acceptedAt,beat:acceptedAt&&CHAPTER_FIFTEEN_BEATS.includes(beat)?beat:"morning",qsoId,goal:qsoId?normalizeFirstPageGoal(own(value,"goal")):null});
}
export function chapterFifteenStoryModel(save){
 const missions=normalizeMissionState(own(save,"missionState")),active=missions.activeMissions.find(m=>m.id==="story-15");
 const stored=normalizeChapterFifteenPresentation(own(save,"chapterFifteenPresentation")),claimed=missions.claimedMissionIds.includes("story-15");
 const acceptedAt=active?.acceptedAt??(claimed?stored.acceptedAt:null);
 const presentation=stored.acceptedAt===acceptedAt?stored:normalizeChapterFifteenPresentation(null);
 const contract=active??{id:"story-15",acceptedAt,baselineQsoIds:[],contract:{missionPhase:"ordinary-first-page"}};
 const record=verifiedFirstPageRecord(save,contract);
 const candidate=record?null:(firstPageCandidate(save,presentation.qsoId)??firstPageCandidate(save));
 const qsoId=record?.qsoId??candidate?.qsoId;
 const entry=tail(own(save,"qsoLogs"),200).find(log=>own(log,"id")===qsoId)??null;
 const goal=record?.goal??(presentation.qsoId===candidate?.qsoId?presentation.goal:null);
 const status=missionBoard(save).story.find(m=>m.id==="story-15")?.status??"locked";
 const playable=Boolean(active)&&["active","ready"].includes(status);
 const step=record?4:candidate?3:Math.min(2,CHAPTER_FIFTEEN_BEATS.indexOf(presentation.beat));
 return {status,playable,acceptedAt,presentation,candidate,record,entry,goal,step};
}
export function advanceChapterFifteenPresentation(save,beat){
 const model=chapterFifteenStoryModel(save),step=CHAPTER_FIFTEEN_BEATS.indexOf(beat);
 if(model.playable&&model.record&&beat==="log"){
  const presentation=normalizeChapterFifteenPresentation({acceptedAt:model.acceptedAt,beat,qsoId:model.record.qsoId,goal:model.record.goal});
  if(JSON.stringify(presentation)===JSON.stringify(model.presentation))return {save,updated:false};
  return {save:{...save,chapterFifteenPresentation:presentation},updated:true};
 }
 if(!model.playable||model.candidate||model.record||step<0||step>2||step<=model.step||step!==model.step+1)return {save,updated:false};
 return {save:{...save,chapterFifteenPresentation:normalizeChapterFifteenPresentation({acceptedAt:model.acceptedAt,beat})},updated:true};
}
export function chooseChapterFifteenGoal(save,goal){
 const model=chapterFifteenStoryModel(save);goal=normalizeFirstPageGoal(goal);
 if(!model.playable||!model.candidate||model.record||!goal)return {save,updated:false};
 const presentation=normalizeChapterFifteenPresentation({acceptedAt:model.acceptedAt,beat:"choose",qsoId:model.candidate.qsoId,goal});
 if(JSON.stringify(presentation)===JSON.stringify(model.presentation))return {save,updated:false};
 return {save:{...save,chapterFifteenPresentation:presentation},updated:true};
}
export function sealChapterFifteenPresentation(save,completedAt){
 const model=chapterFifteenStoryModel(save);
 if(!model.playable||!model.candidate||!model.goal||model.record)return {save,settled:false,reason:"CHOICE_NOT_READY",moneyAwarded:0,technologyPointsAwarded:0};
 const result=settleFirstPage(save,{qsoId:model.candidate.qsoId,goal:model.goal,completedAt});
 if(!result.settled)return result;
 return {...result,save:{...result.save,chapterFifteenPresentation:normalizeChapterFifteenPresentation({acceptedAt:model.acceptedAt,beat:"log",qsoId:model.candidate.qsoId,goal:model.goal})}};
}
export function canContinueChapterFifteen(save,qsoId){
 if(typeof qsoId!=="string"||!qsoId||qsoId.length>96)return false;
 const model=chapterFifteenStoryModel(save);
 return model.playable&&(model.candidate?.qsoId===qsoId||model.record?.qsoId===qsoId);
}
