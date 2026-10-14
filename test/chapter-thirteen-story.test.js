import assert from "node:assert/strict";
import test from "node:test";
import {createSave,normalizeSave} from "../src/game/saveStore.js";
import {acceptMission,abandonMission,claimMission,missionBoard} from "../src/game/missionSystem.js";
import {chapterThirteenStoryModel as model,advanceChapterThirteenPresentation as advance,normalizeChapterThirteenPresentation as normalize,canContinueChapterThirteen} from "../src/game/chapterThirteenStory.js";
import {tickNightOperationsRun,chooseNightWindow,retryNightOperationsRun,normalizeNightOperationsRun,requestNightOperationsRepeat} from "../src/game/nightOperationsRun.js";
import {interpretNightOperationsTraffic,submitNightOperationsResponse} from "../src/game/nightOperationsTraffic.js";
import {settleNightOperationsRun,verifiedNightOperationsCompletion} from "../src/game/nightOperationsSettlement.js";
import {chapterForScreen} from "../src/media/chapterMediaCatalog.js";
import {isWorldCalendarGameplayActive} from "../src/game/worldCalendarHeartbeat.js";
import {ACCEPTED,accepted,unlocked,newRun,withRun,finishedRun,completed,submit} from "./helpers/chapterThirteenFixtures.js";
test("chapter thirteen migrates and bounds acceptance-scoped bookmarks",async()=>{
 const old=await accepted();delete old.chapterThirteenPresentation;const loaded=normalizeSave(old);
 assert.deepEqual(loaded.chapterThirteenPresentation,normalize(null));
 for(const key of ["money","technologyPoints","storyContinuationState","qsoLogs","missionState"])assert.deepEqual(loaded[key],old[key]);
 assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))),loaded);
 for(const value of [Object.create({acceptedAt:ACCEPTED,beat:"log"}),{get acceptedAt(){throw Error("getter");}}])assert.deepEqual(normalize(value),normalize(null));
 assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad",recordId:"x".repeat(97)}).recordId,null);
});
test("chapter thirteen gates chapter twelve and sequential opening beats",async()=>{
 assert.equal(model(createSave({callsign:"BH1TEST"})).status,"locked");assert.equal(model(await unlocked()).status,"available");
 let save=await accepted();for(const beat of ["watch","contacts","log","bad"])assert(!advance(save,beat).updated);
 save=advance(advance(save,"schedule").save,"watch").save;assert.equal(model(normalizeSave(save)).step,2);
 assert(!advance(save,"schedule").updated);assert(!advance(save,"contacts").updated);
});
test("chapter thirteen ending requires this player's three settled contacts and matching proof",async()=>{
 const save=await completed(),m=model(save),chapter=save.storyContinuationState.chapter13;
 assert(m.record);assert.equal(m.step,3);assert(canContinueChapterThirteen(save,m.record.runId));assert(!canContinueChapterThirteen(save,"other"));
 const mutate=fields=>({...save,storyContinuationState:{...save.storyContinuationState,chapter13:{...chapter,...fields}}});
 const bads=[{...save,callsign:"OTHER"},mutate({archive:[]}),mutate({completedRuns:[]}),mutate({settlementProofs:[]}),mutate({settledRunIds:[]}),
 {...save,qsoLogs:save.qsoLogs.filter(l=>l.id!==m.record.contacts[0].qsoId)},
 {...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}},
 {...save,operatorRelationships:save.operatorRelationships.filter(r=>r.personId!==m.record.contacts[0].personId)},
 mutate({archive:[{...m.record,contacts:m.record.contacts.map((c,i)=>i===0?{...c,band:"80M"}:c)}]})];
 for(const bad of bads){assert.equal(model(bad).record,null);assert(!advance(bad,"log").updated);}
 const crossPlayer=mutate({archive:chapter.archive.map(r=>({...r,playerCallsign:"OTHER"})),completedRuns:chapter.completedRuns.map(r=>({...r,playerCallsign:"OTHER"}))});
 assert(!verifiedNightOperationsCompletion(crossPlayer,save.missionState.activeMissions.find(m=>m.id==="story-13")));
 const wrongPeer={...save,qsoLogs:save.qsoLogs.map(log=>log.id===m.record.contacts[0].qsoId?{...log,callsign:"WRONG"}:log)};
 assert(!verifiedNightOperationsCompletion(wrongPeer,save.missionState.activeMissions.find(m=>m.id==="story-13")));
});
test("paused wall time never invalidates active-window contacts; legacy contacts migrate",async()=>{
 const save=await accepted(),run=await finishedRun(save,{pausedMilliseconds:3_600_000});
 const loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));
 assert.deepEqual(loaded.storyContinuationState.chapter13.activeRun,run);assert.equal(model(loaded).record,null);
 const result=settleNightOperationsRun(loaded,run,run.completedAt);assert(result.settled);assert(model(result.save).record);
 assert.equal(result.save.money,save.money);assert.equal(result.save.technologyPoints,save.technologyPoints);assert.equal(result.save.qsoRecords.total,save.qsoRecords.total+3);
 assert.equal(settleNightOperationsRun(result.save,run,run.completedAt).reason,"ALREADY_SETTLED");
 const legacy=JSON.parse(JSON.stringify(await finishedRun(save)));legacy.contacts.forEach(c=>delete c.activeMilliseconds);
 const migrated=normalizeNightOperationsRun(legacy);assert(migrated);assert(migrated.contacts.every(c=>Number.isSafeInteger(c.activeMilliseconds)));
 assert.deepEqual(normalizeNightOperationsRun(JSON.parse(JSON.stringify(migrated))),migrated);
 for(const offset of [-1,60_000]){const bad=structuredClone(run);bad.contacts[0].activeMilliseconds=bad.windows[0].opensAtMilliseconds+offset;assert.equal(normalizeNightOperationsRun(bad),null);}
 const inconsistent=structuredClone(run);inconsistent.summary.missedWindowIds=[run.windows[3].id];assert.equal(normalizeNightOperationsRun(inconsistent),null);
});
test("chapter thirteen excludes old acceptance, pins its ending and pays only once across replay",async()=>{
 let save=advance(await completed(),"log").save;
 save=acceptMission(abandonMission(save,"story-13").save,"story-13","2026-10-04T22:00:00.000Z").save;
 assert.equal(model(save).step,0);assert.equal(model(save).record,null);
 save=advance(await completed(save,{at:"2026-10-04T22:01:00.000Z"}),"log").save;
 const expected=model(save).record.id,result=claimMission(save,"story-13","2026-10-04T22:05:00.000Z");assert(result.claimed);
 assert.equal(result.save.money,save.money+1500);assert.equal(result.save.technologyPoints,save.technologyPoints+6);
 assert(result.save.storyContinuationState.chapter13.taskTreeUnlocked);assert.equal(missionBoard(result.save).story[13].status,"available");
 assert.strictEqual(claimMission(result.save,"story-13").save,result.save);assert(!canContinueChapterThirteen(result.save,model(save).record.runId));
 const replay=await completed(result.save,{at:"2026-10-04T23:00:00.000Z"}),loaded=normalizeSave(JSON.parse(JSON.stringify(replay)));
 assert.equal(loaded.storyContinuationState.chapter13.archive.length,3);assert.equal(model(loaded).record.id,expected);assert.equal(model(loaded).step,4);
 for(const key of ["money","technologyPoints"])assert.equal(loaded[key],result.save[key]);
 assert.equal(loaded.qsoRecords.total,result.save.qsoRecords.total+3);
 assert.equal(chapterForScreen("chapter-thirteen",loaded),13);assert(isWorldCalendarGameplayActive({activeSaveId:loaded.id,screen:"chapter-thirteen"}));
});
test("night replay requires both chapter claim and task-tree unlock",async()=>{
 const save=claimMission(await completed(),"story-13","2026-10-04T22:00:00.000Z").save,run=await finishedRun(save,{at:"2026-10-04T23:00:00.000Z"}),ready=withRun(save,run);
 assert(settleNightOperationsRun(ready,run,run.completedAt).settled);
 for(const bad of [
 {...ready,missionState:{...ready.missionState,claimedMissionIds:ready.missionState.claimedMissionIds.filter(id=>id!=="story-13")}},
 {...ready,storyContinuationState:{...ready.storyContinuationState,chapter13:{...ready.storyContinuationState.chapter13,taskTreeUnlocked:false}}},
 {...ready,callsign:"OTHER"}
 ])assert.equal(settleNightOperationsRun(bad,run,run.completedAt).reason,"RUN_STATE_MISMATCH");
});
test("night browser fallback preserves safety rejection and validates exact band",async()=>{
 let run=newRun(await accepted());run=chooseNightWindow(tickNightOperationsRun(run,{milliseconds:30_000}),run.windows[0].id);
 const w=run.windows[0],message=w.callsign+" DE "+run.playerCallsign+" K",at="2026-10-04T21:02:00.000Z";
 for(const provider of [undefined,async()=>{throw Error("offline");},async()=>({ok:false})]){
  const semantic=await interpretNightOperationsTraffic(run,message,provider);assert.equal(semantic.provider,"rules-v1");assert(semantic.safeToCommit);
  assert.equal(submitNightOperationsResponse(run,run,message,semantic,at).phase,"EXCHANGE");
 }
 const rejected=await interpretNightOperationsTraffic(run,message,async()=>({ok:true,result:{safeToCommit:false}}));
 assert.strictEqual(submitNightOperationsResponse(run,run,message,rejected,at),run);
 run=await submit(run,"AGN K");run=await submit(run,"QRS K");assert.deepEqual(run.recoveryActions,["AGN","QRS"]);
 assert.strictEqual(requestNightOperationsRepeat(run,"AGN JUNK",{safeToCommit:true}),run);
 run=await submit(run,message);const wrong=await submit(run,w.callsign+" DE "+run.playerCallsign+" 599 80M K",at);assert.strictEqual(wrong,run);
 assert.equal((await submit(run,w.callsign+" DE "+run.playerCallsign+" 599 "+w.band+" K",at)).contacts.length,1);
});
test("late night interpretation retains timer and cannot revive expired, changed or retried windows",async()=>{
 let run=newRun(await accepted());run=chooseNightWindow(tickNightOperationsRun(run,{milliseconds:30_000}),run.windows[0].id);
 const message=run.windows[0].callsign+" DE "+run.playerCallsign+" K",semantic=await interpretNightOperationsTraffic(run,message),at="2026-10-04T21:02:00.000Z";
 const current=tickNightOperationsRun(run,{milliseconds:9_000},at);assert.equal(submitNightOperationsResponse(current,run,message,semantic,at).activeMilliseconds,39_000);
 const expired=tickNightOperationsRun(run,{milliseconds:61_000},at);assert.strictEqual(submitNightOperationsResponse(expired,run,message,semantic,at),expired);
 const next=chooseNightWindow(tickNightOperationsRun(expired,{milliseconds:30_000}),run.windows[1].id);assert.strictEqual(submitNightOperationsResponse(next,run,message,semantic,at),next);
 const timeout=tickNightOperationsRun(run,{milliseconds:390_000},at);assert.strictEqual(submitNightOperationsResponse(timeout,run,message,semantic,at),timeout);
 const retry=retryNightOperationsRun(timeout,"2026-10-04T22:00:00.000Z");assert.strictEqual(submitNightOperationsResponse(retry,run,message,semantic,at),retry);
});
