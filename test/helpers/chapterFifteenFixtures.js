import assert from "node:assert/strict";
import {acceptMission,claimMission} from "../../src/game/missionSystem.js";
import {completed as completedFourteen} from "./chapterFourteenFixtures.js";
import {recordCompletedQso} from "../../src/qso/qsoLog.js";
import {log} from "./chapterFourFixtures.js";
import {chooseChapterFifteenGoal,sealChapterFifteenPresentation} from "../../src/game/chapterFifteenStory.js";
export const ACCEPTED="2026-10-04T23:00:00.000Z",QSO_AT="2026-10-04T23:04:00.000Z",SEALED="2026-10-04T23:05:00.000Z";
export async function unlocked(){const result=claimMission(await completedFourteen(),"story-14","2026-10-04T22:10:00.000Z");assert(result.claimed);return result.save;}
export async function accepted(){const result=acceptMission(await unlocked(),"story-15",ACCEPTED);assert(result.accepted);return result.save;}
export function withQso(save,overrides={}){
 const result=recordCompletedQso(save,log({id:"fifteenth-ordinary-qso",playerCallsign:save.callsign,callsign:"SIM4US",location:"US",
  startedAt:"2026-10-04T23:02:00.000Z",completedAt:QSO_AT,finalPropagationLevel:3,
  optionalExchangeQuestion:null,optionalExchangeOutcome:null,attemptHistory:[],repeatRequests:0,...overrides}));
 assert(result.added);assert(result.moneyAwarded>0);return result.save;
}
export async function completed(save,goal="people-network"){
 save??=withQso(await accepted());
 const chosen=chooseChapterFifteenGoal(save,goal);assert(chosen.updated);
 const result=sealChapterFifteenPresentation(chosen.save,SEALED);assert(result.settled,result.reason);return result.save;
}
