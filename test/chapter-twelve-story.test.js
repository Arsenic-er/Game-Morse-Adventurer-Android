import assert from "node:assert/strict";
import test from "node:test";
import {createSave,normalizeSave} from "../src/game/saveStore.js";
import {acceptMission,abandonMission,claimMission,missionBoard} from "../src/game/missionSystem.js";
import {chapterTwelveStoryModel as model,advanceChapterTwelvePresentation as advance,normalizeChapterTwelvePresentation as normalize,canContinueChapterTwelve} from "../src/game/chapterTwelveStory.js";
import {tickStormRelayRun,retryStormRelayRun,receiveStormConflict,stormPacketText} from "../src/game/stormRelayRun.js";
import {interpretStormRelayTraffic,submitStormRelayResponse} from "../src/game/stormRelayTraffic.js";
import {settleStormRelayRun,verifiedStormRelayCompletion} from "../src/game/stormRelaySettlement.js";
import {chapterForScreen} from "../src/media/chapterMediaCatalog.js";
import {isWorldCalendarGameplayActive} from "../src/game/worldCalendarHeartbeat.js";
import {ACCEPTED,accepted,unlocked,newRun,withRun,finishedRun,completed,submit} from "./helpers/chapterTwelveFixtures.js";
test("chapter twelve migrates and bounds acceptance-scoped bookmarks",async()=>{
 const old=await accepted();delete old.chapterTwelvePresentation;const loaded=normalizeSave(old);
 assert.deepEqual(loaded.chapterTwelvePresentation,normalize(null));
 for(const key of ["money","technologyPoints","storyContinuationState","qsoLogs","missionState"])assert.deepEqual(loaded[key],old[key]);
 assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))),loaded);
 for(const value of [Object.create({acceptedAt:ACCEPTED,beat:"log"}),{get acceptedAt(){throw Error("getter");}}])assert.deepEqual(normalize(value),normalize(null));
 assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad",recordId:"x".repeat(97)}).recordId,null);
});
test("chapter twelve gates chapter eleven and sequential pre-relay beats",async()=>{
 assert.equal(model(createSave({callsign:"BH1TEST"})).status,"locked");assert.equal(model(await unlocked()).status,"available");
 let save=await accepted();for(const beat of ["verify","relayed","log","bad"])assert(!advance(save,beat).updated);
 save=advance(advance(save,"copies").save,"verify").save;assert.equal(model(normalizeSave(save)).step,2);
 assert(!advance(save,"copies").updated);assert(!advance(save,"relayed").updated);
});
test("chapter twelve ending requires this player's two settled contacts and matching proof",async()=>{
 const save=await completed(),m=model(save),chapter=save.storyContinuationState.chapter12;
 assert(m.record);assert.equal(m.step,3);assert(canContinueChapterTwelve(save,m.record.runId));assert(!canContinueChapterTwelve(save,"other"));
 const mutate=fields=>({...save,storyContinuationState:{...save.storyContinuationState,chapter12:{...chapter,...fields}}});
 const bads=[{...save,callsign:"OTHER"},mutate({archive:[]}),mutate({completedRuns:[]}),mutate({settlementProofs:[]}),mutate({settledRunIds:[]}),
 {...save,qsoLogs:save.qsoLogs.filter(l=>l.id!==m.record.qsoIds[0])},
 {...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}},
 {...save,operatorRelationships:save.operatorRelationships.filter(r=>r.personId!==m.record.relayPersonId)}];
 for(const fields of [{revision:1},{quantity:4},{people:6},{check:"99"},{playerCallsign:"OTHER"},{completedAt:"2026-10-04T19:59:00.000Z"}])bads.push(mutate({archive:[{...m.record,...fields}]}));
 for(const bad of bads){assert.equal(model(bad).record,null);assert(!advance(bad,"log").updated);}
 const crossPlayer=mutate({archive:chapter.archive.map(r=>({...r,playerCallsign:"OTHER"})),completedRuns:chapter.completedRuns.map(r=>({...r,playerCallsign:"OTHER"})),settlementProofs:chapter.settlementProofs.map(r=>({...r,playerCallsign:"OTHER"}))});
 assert(!verifiedStormRelayCompletion(crossPlayer,save.missionState.activeMissions.find(m=>m.id==="story-12")));
 const mismatchedLog={...save,qsoLogs:save.qsoLogs.map(log=>log.id===m.record.qsoIds[0]?{...log,playerCallsign:"OTHER"}:log)};
 assert(!verifiedStormRelayCompletion(mismatchedLog,save.missionState.activeMissions.find(m=>m.id==="story-12")));
});
test("storm stages survive reload; completed but unsaved cannot expose ending",async()=>{
 const save=await accepted();let run=newRun(save);
 for(const action of [r=>submit(r,"SIM12CS DE "+r.playerCallsign+" QTC K"),r=>receiveStormConflict(r,"2026-10-04T20:02:00.000Z"),r=>submit(r,"AGN MSG 214 REV K"),r=>submit(r,stormPacketText(r.packets[2]))]){
  run=await action(run);const loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));
  assert.deepEqual(loaded.storyContinuationState.chapter12.activeRun,run);assert.equal(model(loaded).record,null);
 }
 const result=settleStormRelayRun(withRun(save,run),run,run.completedAt);assert(result.settled);assert(model(result.save).record);
 assert.equal(result.save.money,save.money);assert.equal(result.save.technologyPoints,save.technologyPoints);assert.equal(result.save.qsoRecords.total,save.qsoRecords.total+2);
 assert.equal(settleStormRelayRun(result.save,run,run.completedAt).reason,"ALREADY_SETTLED");
});
test("chapter twelve excludes old acceptance, pins its ending and pays only once across replay",async()=>{
 let save=advance(await completed(),"log").save;
 save=acceptMission(abandonMission(save,"story-12").save,"story-12","2026-10-04T21:00:00.000Z").save;
 assert.equal(model(save).step,0);assert.equal(model(save).record,null);
 save=advance(await completed(save,{at:"2026-10-04T21:02:00.000Z"}),"log").save;
 const expected=model(save).record.id,result=claimMission(save,"story-12","2026-10-04T21:03:00.000Z");assert(result.claimed);
 assert.equal(result.save.money,save.money+1350);assert.equal(result.save.technologyPoints,save.technologyPoints+6);
 assert(result.save.storyContinuationState.chapter12.taskTreeUnlocked);assert.equal(missionBoard(result.save).story[12].status,"available");
 assert.strictEqual(claimMission(result.save,"story-12").save,result.save);assert(!canContinueChapterTwelve(result.save,model(save).record.runId));
 const replay=await completed(result.save,{at:"2026-10-04T22:00:00.000Z"}),loaded=normalizeSave(JSON.parse(JSON.stringify(replay)));
 assert.equal(loaded.storyContinuationState.chapter12.archive.length,3);assert.equal(model(loaded).record.id,expected);assert.equal(model(loaded).step,4);
 for(const key of ["money","technologyPoints"])assert.equal(loaded[key],result.save[key]);
 assert.equal(loaded.qsoRecords.total,result.save.qsoRecords.total+2);
 assert.equal(chapterForScreen("chapter-twelve",loaded),12);assert(isWorldCalendarGameplayActive({activeSaveId:loaded.id,screen:"chapter-twelve"}));
});
test("storm replay requires both chapter claim and task-tree unlock",async()=>{
 const save=claimMission(await completed(),"story-12","2026-10-04T21:00:00.000Z").save,run=await finishedRun(save,{at:"2026-10-04T22:00:00.000Z"}),ready=withRun(save,run);
 assert(settleStormRelayRun(ready,run,run.completedAt).settled);
 for(const bad of [
 {...ready,missionState:{...ready.missionState,claimedMissionIds:ready.missionState.claimedMissionIds.filter(id=>id!=="story-12")}},
 {...ready,storyContinuationState:{...ready.storyContinuationState,chapter12:{...ready.storyContinuationState.chapter12,taskTreeUnlocked:false}}},
 {...ready,callsign:"OTHER"}
 ])assert.equal(settleStormRelayRun(bad,run,run.completedAt).reason,"RUN_STATE_MISMATCH");
});
test("storm browser fallback preserves safety rejection and validates every relay field",async()=>{
 let run=newRun(await accepted()),message="SIM12CS DE "+run.playerCallsign+" QTC K",at="2026-10-04T20:02:00.000Z";
 for(const provider of [undefined,async()=>{throw Error("offline");},async()=>({ok:false})]){
  const semantic=await interpretStormRelayTraffic(run,message,provider);assert.equal(semantic.provider,"rules-v1");assert(semantic.safeToCommit);
  assert.equal(submitStormRelayResponse(run,run,message,semantic,at).phase,"RECEIVING");
 }
 const rejected=await interpretStormRelayTraffic(run,message,async()=>({ok:true,result:{safeToCommit:false}}));
 assert.equal(submitStormRelayResponse(run,run,message,rejected,at).errors.at(-1),"SEMANTIC_UNSAFE");
 run=receiveStormConflict(await submit(run,message),at);run=await submit(run,"AGN MSG 214 K");assert.deepEqual(run.recoveryActions,["AGN"]);
 run=await submit(run,"QRS MSG 214 K");assert.deepEqual(run.recoveryActions,["AGN","QRS"]);
 const wrongRepeat=await submit(run,"QRS MSG 215 K");assert.equal(wrongRepeat.recoveryActions.length,2);assert.equal(wrongRepeat.errors.at(-1),"VERIFICATION_FORMAT_INVALID");
 run=await submit(run,"AGN MSG 214 REV K");assert.equal(run.phase,"RELAY");
 const bad=await submit(run,stormPacketText(run.packets[2]).replace("QTY 6","QTY 4"));assert.equal(bad.badRelayCount,1);assert.equal(bad.phase,"RELAY");
 assert.equal((await submit(bad,stormPacketText(run.packets[2]))).phase,"COMPLETED");
});
test("late storm interpretation retains timer and cannot revive expired or retried attempts",async()=>{
 const requested=newRun(await accepted()),message="SIM12CS DE "+requested.playerCallsign+" QTC K",semantic=await interpretStormRelayTraffic(requested,message),at="2026-10-04T20:02:00.000Z";
 const current=tickStormRelayRun(requested,{seconds:9},at);assert.equal(submitStormRelayResponse(current,requested,message,semantic,at).activeMilliseconds,9000);
 const timeout=tickStormRelayRun(requested,{seconds:720},at);assert.strictEqual(submitStormRelayResponse(timeout,requested,message,semantic,at),timeout);
 const retry=retryStormRelayRun(timeout,"2026-10-04T20:14:00.000Z");assert.strictEqual(submitStormRelayResponse(retry,requested,message,semantic,at),retry);
});
