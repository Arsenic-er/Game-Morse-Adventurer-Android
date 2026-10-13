import assert from "node:assert/strict";
import test from "node:test";
import {acceptMission,abandonMission,claimMission,missionBoard} from "../src/game/missionSystem.js";
import {normalizeSave} from "../src/game/saveStore.js";
import {OPEN_STATION_GOALS} from "../src/game/openStationState.js";
import {updateOpenStationGoal} from "../src/game/openStationDashboard.js";
import {firstPageCandidate,settleFirstPage,verifiedFirstPageRecord} from "../src/game/firstPageSettlement.js";
import {normalizeChapterFifteenPresentation,chapterFifteenStoryModel,advanceChapterFifteenPresentation,chooseChapterFifteenGoal,sealChapterFifteenPresentation,canContinueChapterFifteen} from "../src/game/chapterFifteenStory.js";
import {accepted,unlocked,withQso,completed,ACCEPTED,QSO_AT,SEALED} from "./helpers/chapterFifteenFixtures.js";
test("chapter fifteen advances only through opening and requires a saved ordinary contact",async()=>{
 let save=await accepted();assert.equal(chapterFifteenStoryModel(await unlocked()).status,"available");
 assert.equal(chapterFifteenStoryModel(save).step,0);
 for(const beat of ["log","choose","call","unknown"])assert.equal(advanceChapterFifteenPresentation(save,beat).updated,false);
 assert.equal(sealChapterFifteenPresentation(save,SEALED).settled,false);
 assert.equal(chooseChapterFifteenGoal(save,"world-log").updated,false);
 save=advanceChapterFifteenPresentation(save,"blank").save;save=advanceChapterFifteenPresentation(save,"call").save;
 assert.equal(chapterFifteenStoryModel(save).step,2);assert.equal(canContinueChapterFifteen(save,"fifteenth-ordinary-qso"),false);
 save=withQso(save);assert.equal(chapterFifteenStoryModel(save).step,3);assert.equal(chapterFifteenStoryModel(save).goal,null);
 assert.equal(canContinueChapterFifteen(save,"fifteenth-ordinary-qso"),true);assert.equal(canContinueChapterFifteen(save,"other"),false);
 assert.equal(sealChapterFifteenPresentation(save,SEALED).settled,false);
 assert.equal(chooseChapterFifteenGoal(save,"bad").updated,false);
});
test("all five first choices survive reload, pay no sealing reward and unlock matching first goal",async()=>{
 const base=withQso(await accepted());
 for(const goal of OPEN_STATION_GOALS){
  const chosen=chooseChapterFifteenGoal(base,goal).save,reloaded=normalizeSave(JSON.parse(JSON.stringify(chosen)));
  assert.equal(chapterFifteenStoryModel(reloaded).goal,goal);
  const result=sealChapterFifteenPresentation(reloaded,SEALED);assert(result.settled,result.reason);
  assert.equal(result.moneyAwarded,0);assert.equal(result.save.money,reloaded.money);
  const model=chapterFifteenStoryModel(result.save);assert.equal(model.step,4);assert.equal(model.record.goal,goal);
  assert.equal(model.entry.id,"fifteenth-ordinary-qso");
  const claim=claimMission(result.save,"story-15","2026-10-04T23:06:00.000Z");
  assert(claim.claimed);assert.equal(claim.moneyAwarded,2000);assert.equal(claim.technologyPointsAwarded,8);
  assert.equal(claim.save.storyContinuationState.openStation.firstGoal,goal);
  assert.equal(claimMission(claim.save,"story-15").claimed,false);assert.equal(canContinueChapterFifteen(claim.save,model.entry.id),false);
  const other=OPEN_STATION_GOALS.find(value=>value!==goal),updated=updateOpenStationGoal(claim.save,other,"2026-10-04T23:07:00.000Z");
  assert(updated.updated);assert.equal(updated.save.storyContinuationState.openStation.activeGoal,other);
  assert.equal(updated.save.storyContinuationState.openStation.firstGoal,goal);assert.equal(chapterFifteenStoryModel(updated.save).goal,goal);
  assert.equal(updated.save.money,claim.save.money);assert.deepEqual(updated.save.storyContinuationState.chapter15,claim.save.storyContinuationState.chapter15);
 }
});
test("choice pins its contact even when a newer ordinary contact arrives",async()=>{
 let save=chooseChapterFifteenGoal(withQso(await accepted()),"field-operations").save;
 save=withQso(save,{id:"newer-ordinary",completedAt:"2026-10-04T23:04:30.000Z"});
 assert.equal(chapterFifteenStoryModel(save).candidate.qsoId,"fifteenth-ordinary-qso");
 assert.equal(chapterFifteenStoryModel(save).goal,"field-operations");
 assert.equal(sealChapterFifteenPresentation(save,SEALED).save.storyContinuationState.chapter15.archive[0].qsoId,"fifteenth-ordinary-qso");
});
test("foreign callsigns and invalid evidence cannot supply a first page",async()=>{
 const base=withQso(await accepted()),id="fifteenth-ordinary-qso";
 for(const modify of [
  log=>({...log,playerCallsign:"BH9OTHER"}),log=>({...log,credits:0,rewardBreakdown:null}),
  log=>({...log,eventId:"chapter-continuation",eventKind:"final-promise",eventMode:"story",eventRunId:"other"}),
  log=>({...log,completedAt:"2026-10-04T22:59:00.000Z"})
 ]){
  const save={...base,qsoLogs:base.qsoLogs.map(log=>log.id===id?modify(log):log)};
  assert.equal(firstPageCandidate(save),null);assert.equal(canContinueChapterFifteen(save,id),false);
  assert.equal(settleFirstPage(save,{qsoId:id,goal:"world-log",completedAt:SEALED}).settled,false);
 }
 for(const save of [{...base,qsoLogs:[]},{...base,qsoRecords:{...base.qsoRecords,settledQsoIds:[]}}])assert.equal(chapterFifteenStoryModel(save).candidate,null);
});
test("one accepted mission cannot be sealed twice through another contact or goal",async()=>{
 let save=withQso(withQso(await accepted()),{id:"second-page-qso",completedAt:"2026-10-04T23:04:30.000Z"});
 save=settleFirstPage(save,{qsoId:"fifteenth-ordinary-qso",goal:"world-log",completedAt:SEALED}).save;
 const duplicate=settleFirstPage(save,{qsoId:"second-page-qso",goal:"contest-craft",completedAt:SEALED});
 assert.equal(duplicate.reason,"ALREADY_SETTLED");assert.strictEqual(duplicate.save,save);
 assert.equal(firstPageCandidate(save),null);assert.equal(chooseChapterFifteenGoal(save,"public-service").updated,false);
});
test("abandon and reaccept resets choices without letting an old page block a new one",async()=>{
 const old=await completed(),abandoned=abandonMission(old,"story-15","2026-10-04T23:06:00.000Z");assert(abandoned.abandoned);
 const renewed=acceptMission(abandoned.save,"story-15","2026-10-04T23:07:00.000Z");assert(renewed.accepted);
 let save=renewed.save;assert.equal(chapterFifteenStoryModel(save).step,0);assert.equal(chapterFifteenStoryModel(save).goal,null);
 assert.equal(firstPageCandidate(save),null);
 save=withQso(save,{id:"new-acceptance-qso",startedAt:"2026-10-04T23:08:00.000Z",completedAt:"2026-10-04T23:09:00.000Z"});
 assert.equal(firstPageCandidate(save).qsoId,"new-acceptance-qso");
 save=chooseChapterFifteenGoal(save,"public-service").save;
 const result=sealChapterFifteenPresentation(save,"2026-10-04T23:10:00.000Z");assert(result.settled);
 assert.equal(chapterFifteenStoryModel(result.save).record.qsoId,"new-acceptance-qso");
});
test("claim takes the goal from verified evidence, never an unrelated archive tail",async()=>{
 const base=await completed(),chapter=base.storyContinuationState.chapter15,record=chapter.archive[0];
 const fake={...record,runId:"first-page:fake",qsoId:"fake",goal:"contest-craft",completedAt:"2026-10-04T23:05:30.000Z"};
 const save={...base,storyContinuationState:{...base.storyContinuationState,chapter15:{...chapter,archive:[...chapter.archive,fake]}}};
 assert.equal(missionBoard(save).story.find(m=>m.id==="story-15").status,"ready");
 const claim=claimMission(save,"story-15","2026-10-04T23:06:00.000Z");assert(claim.claimed);
 assert.equal(claim.save.storyContinuationState.openStation.firstGoal,"people-network");
});
test("presentation migration is bounded, getter safe, idempotent and cannot fabricate an ending",async()=>{
 let reads=0;const raw={};Object.defineProperty(raw,"acceptedAt",{get(){reads++;throw Error("getter");}});
 assert.equal(normalizeChapterFifteenPresentation(raw).acceptedAt,null);assert.equal(reads,0);
 const inherited=Object.create({acceptedAt:ACCEPTED,beat:"log",qsoId:"x",goal:"world-log"});
 assert.equal(normalizeChapterFifteenPresentation(inherited).acceptedAt,null);
 const base=await accepted(),forged={...base,chapterFifteenPresentation:{acceptedAt:ACCEPTED,beat:"log",qsoId:"fake",goal:"world-log"}};
 assert.equal(chapterFifteenStoryModel(forged).step,2);assert.equal(chapterFifteenStoryModel(forged).record,null);
 const save=await completed(),once=normalizeSave(JSON.parse(JSON.stringify(save))),twice=normalizeSave(JSON.parse(JSON.stringify(once)));
 assert.deepEqual(once,twice);assert.equal(twice.money,save.money);
 const broken={...save,qsoLogs:[]};assert.equal(verifiedFirstPageRecord(broken,broken.missionState.activeMissions.find(m=>m.id==="story-15")),null);
 assert.equal(chapterFifteenStoryModel(broken).record,null);
});

test("a legacy sealed page pins its verified ending before claiming",async()=>{
 const base=withQso(await accepted()),legacy=settleFirstPage(base,{qsoId:"fifteenth-ordinary-qso",goal:"contest-craft",completedAt:SEALED}).save;
 assert.equal(legacy.chapterFifteenPresentation.acceptedAt,null);assert.equal(chapterFifteenStoryModel(legacy).step,4);
 const pinned=advanceChapterFifteenPresentation(legacy,"log");assert(pinned.updated);
 assert.equal(pinned.save.chapterFifteenPresentation.qsoId,"fifteenth-ordinary-qso");
 assert.equal(advanceChapterFifteenPresentation(pinned.save,"log").updated,false);
 const claimed=claimMission(pinned.save,"story-15","2026-10-04T23:06:00.000Z").save;
 const model=chapterFifteenStoryModel(normalizeSave(JSON.parse(JSON.stringify(claimed))));
 assert.equal(model.status,"claimed");assert.equal(model.step,4);assert.equal(model.record.goal,"contest-craft");
});
