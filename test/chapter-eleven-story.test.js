import assert from "node:assert/strict";
import test from "node:test";
import {createSave,normalizeSave} from "../src/game/saveStore.js";
import {acceptMission,abandonMission,claimMission,missionBoard} from "../src/game/missionSystem.js";
import {chapterElevenStoryModel as model,advanceChapterElevenPresentation as advance,normalizeChapterElevenPresentation as normalize,canContinueChapterEleven} from "../src/game/chapterElevenStory.js";
import {normalizeListeningRun,tickListeningRun,finishListeningWait,recordListeningSilence,retryListeningRun} from "../src/game/listeningRun.js";
import {interpretListeningTraffic,submitListeningResponse} from "../src/game/listeningTraffic.js";
import {settleListeningRun,verifiedListeningCompletion} from "../src/game/listeningSettlement.js";
import {chapterForScreen} from "../src/media/chapterMediaCatalog.js";
import {isWorldCalendarGameplayActive} from "../src/game/worldCalendarHeartbeat.js";
import {ACCEPTED,accepted,unlocked,newRun,withRun,observed,finishedRun,completed,submit} from "./helpers/chapterElevenFixtures.js";
test("chapter eleven migrates bookmarks without changing monitoring records or balances",async()=>{
 const base=await accepted(),old=withRun(base,newRun(base));delete old.chapterElevenPresentation;
 const loaded=normalizeSave(old);assert.deepEqual(loaded.chapterElevenPresentation,normalize(null));
 for(const key of ["money","technologyPoints","storyContinuationState","qsoLogs","missionState"])assert.deepEqual(loaded[key],old[key]);
 assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))),loaded);
});
test("chapter eleven requires chapter ten and sequential acceptance-scoped beats",async()=>{
 assert.equal(model(createSave({callsign:"BH1TEST"})).status,"locked");assert.equal(model(await unlocked()).status,"available");
 let save=await accepted();for(const beat of ["call","silence","log","bad"])assert(!advance(save,beat).updated);
 save=advance(advance(save,"windows").save,"call").save;assert.equal(model(normalizeSave(save)).step,2);
 assert(!advance(save,"windows").updated);assert(!advance(save,"silence").updated);
 for(const value of [Object.create({acceptedAt:ACCEPTED,beat:"log"}),{get acceptedAt(){throw Error("getter");}}])assert.deepEqual(normalize(value),normalize(null));
 assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad",recordId:"x".repeat(97)}).recordId,null);
});
test("chapter eleven ending requires a player-bound settled monitoring proof, not a QSO",async()=>{
 const save=await completed(),m=model(save),chapter=save.storyContinuationState.chapter11;
 assert(m.record);assert.equal(m.step,3);assert(canContinueChapterEleven(save,m.record.runId));assert(!canContinueChapterEleven(save,"other"));
 const mutate=fields=>({...save,storyContinuationState:{...save.storyContinuationState,chapter11:{...chapter,...fields}}});
 const bads=[{...save,callsign:"OTHER"},mutate({archive:[]}),mutate({completedRuns:[]}),mutate({settlementProofs:[]}),mutate({settledRunIds:[]})];
 for(const fields of [{callCount:2},{activeMilliseconds:5},{observationIds:["window-1"]},{targetCallsign:"SIM0XX"},{playerCallsign:"OTHER"},{conclusionKey:"reply-received"},{completedAt:"2026-10-04T18:59:00.000Z"}])bads.push(mutate({archive:[{...m.record,...fields}]}));
 for(const bad of bads){assert.equal(model(bad).record,null);assert(!advance(bad,"log").updated);}
 const crossPlayer=mutate({archive:chapter.archive.map(r=>({...r,playerCallsign:"OTHER"})),completedRuns:chapter.completedRuns.map(r=>({...r,playerCallsign:"OTHER"})),settlementProofs:chapter.settlementProofs.map(r=>({...r,playerCallsign:"OTHER"}))});
 assert(!verifiedListeningCompletion(crossPlayer,save.missionState.activeMissions.find(m=>m.id==="story-11")));
 assert.equal(model({...save,qsoLogs:[],operatorRelationships:[],qsoRecords:{}}).record.id,m.record.id);
});
test("unsettled listening reload cannot expose ending or pay credits",async()=>{
 const save=await accepted(),run=await finishedRun(save),loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));
 assert.deepEqual(loaded.storyContinuationState.chapter11.activeRun,run);assert.equal(model(loaded).record,null);
 const result=settleListeningRun(loaded,run,run.completedAt);assert(result.settled);assert(model(result.save).record);
 for(const key of ["money","technologyPoints","qsoLogs","qsoRecords","operatorRelationships"])assert.deepEqual(result.save[key],save[key]);
 assert.equal(settleListeningRun(result.save,run,run.completedAt).reason,"ALREADY_SETTLED");
});
test("chapter eleven pins the recorded attempt, excludes reaccepted history and pays once",async()=>{
 let save=advance(await completed(),"log").save;
 save=acceptMission(abandonMission(save,"story-11").save,"story-11","2026-10-04T20:00:00.000Z").save;
 assert.equal(model(save).step,0);assert.equal(model(save).record,null);
 save=advance(await completed(save,{at:"2026-10-04T20:02:00.000Z",calls:2}),"log").save;
 const expected=model(save).record.id,result=claimMission(save,"story-11","2026-10-04T20:03:00.000Z");assert(result.claimed);
 assert.equal(result.save.money,save.money+1200);assert.equal(result.save.technologyPoints,save.technologyPoints+5);
 assert(result.save.storyContinuationState.chapter11.taskTreeUnlocked);assert.equal(missionBoard(result.save).story[11].status,"available");
 assert.strictEqual(claimMission(result.save,"story-11").save,result.save);assert(!canContinueChapterEleven(result.save,model(save).record.runId));
 const replay=await completed(result.save,{at:"2026-10-04T21:00:00.000Z"}),loaded=normalizeSave(JSON.parse(JSON.stringify(replay)));
 assert.equal(loaded.storyContinuationState.chapter11.archive.length,3);assert.equal(model(loaded).record.id,expected);assert.equal(model(loaded).step,4);
 for(const key of ["money","technologyPoints","qsoLogs","qsoRecords","operatorRelationships"])assert.deepEqual(loaded[key],result.save[key]);
 assert.equal(chapterForScreen("chapter-eleven",loaded),11);assert(isWorldCalendarGameplayActive({activeSaveId:loaded.id,screen:"chapter-eleven"}));
});
test("listening replay requires both completed mission and task-tree unlock",async()=>{
 const save=claimMission(await completed(),"story-11","2026-10-04T20:00:00.000Z").save,run=await finishedRun(save,{at:"2026-10-04T21:00:00.000Z"});
 const ready=withRun(save,run);
 assert(settleListeningRun(ready,run,run.completedAt).settled);
 for(const bad of [
  {...ready,missionState:{...ready.missionState,claimedMissionIds:ready.missionState.claimedMissionIds.filter(id=>id!=="story-11")}},
  {...ready,storyContinuationState:{...ready.storyContinuationState,chapter11:{...ready.storyContinuationState.chapter11,taskTreeUnlocked:false}}},
  {...ready,callsign:"OTHER"}
 ])assert.equal(settleListeningRun(bad,run,run.completedAt).reason,"RUN_STATE_MISMATCH");
});
test("listening browser fallback uses ordinary rules and preserves provider rejection",async()=>{
 const run=observed(await accepted()),text="SIM11LS DE "+run.playerCallsign+" K",at="2026-10-04T19:02:00.000Z";
 for(const provider of [undefined,async()=>{throw Error("offline");},async()=>({ok:false})]){
  const semantic=await interpretListeningTraffic(run,text,provider);assert.equal(semantic.provider,"rules-v1");assert(semantic.safeToCommit);
  assert.equal(submitListeningResponse(run,run,text,semantic,at).phase,"WAITING");
 }
 const rejected=await interpretListeningTraffic(run,text,async()=>({ok:true,result:{safeToCommit:false}}));
 assert.equal(submitListeningResponse(run,run,text,rejected,at).errors.at(-1),"SEMANTIC_UNSAFE");
 const invalid=await submit(run,text.replace("SIM11LS","SIM12SR"));assert.equal(invalid.callCount,0);assert.equal(invalid.phase,"CALL_READY");
});
test("second listening call reloads with its own waiting timestamp and cannot become a third",async()=>{
 const save=await accepted();let run=observed(save);
 run=await submit(run,undefined,"2026-10-04T19:02:00.000Z");run=finishListeningWait(run,"2026-10-04T19:02:04.000Z");
 run=await submit(run,undefined,"2026-10-04T19:03:00.000Z");
 assert.equal(run.phase,"WAITING");assert.equal(run.callCount,2);assert.equal(run.lastWaitCompletedAt,null);
 const loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));assert.deepEqual(loaded.storyContinuationState.chapter11.activeRun,run);
 run=finishListeningWait(loaded.storyContinuationState.chapter11.activeRun,"2026-10-04T19:03:04.000Z");
 const third=await submit(run,undefined,"2026-10-04T19:04:00.000Z");assert.equal(third.callCount,2);assert.equal(third.phase,"FAILED");assert.equal(third.failureReason,"CALL_LIMIT_EXCEEDED");
 const finished=recordListeningSilence(run,"2026-10-04T19:03:05.000Z");assert(normalizeListeningRun(finished));
 for(const fields of [{callCount:1},{activeMilliseconds:5000}])assert.equal(normalizeListeningRun({...finished,summary:{...finished.summary,...fields}}),null);
 assert.equal(normalizeListeningRun({...finished,completedAt:"2026-10-04T19:02:05.000Z",summary:{...finished.summary,completedAt:"2026-10-04T19:02:05.000Z"}}),null);
 assert.equal(normalizeListeningRun({...run,completedAt:"2026-10-04T19:03:05.000Z"}),null);
});
test("late listening interpretation retains active time and cannot revive timed-out or retried runs",async()=>{
 const requested=observed(await accepted()),message="SIM11LS DE "+requested.playerCallsign+" K",semantic=await interpretListeningTraffic(requested,message),at="2026-10-04T19:02:00.000Z";
 const current=tickListeningRun(requested,{seconds:9},at);assert.equal(submitListeningResponse(current,requested,message,semantic,at).activeMilliseconds,9000);
 const timeout=tickListeningRun(requested,{seconds:600},at);assert.strictEqual(submitListeningResponse(timeout,requested,message,semantic,at),timeout);
 const retry=retryListeningRun(timeout,"2026-10-04T19:12:00.000Z");assert.strictEqual(submitListeningResponse(retry,requested,message,semantic,at),retry);
});
