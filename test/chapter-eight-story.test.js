import assert from "node:assert/strict";
import test from "node:test";
import { createSave, normalizeSave } from "../src/game/saveStore.js";
import { acceptMission, abandonMission, claimMission, missionBoard } from "../src/game/missionSystem.js";
import { chapterEightStoryModel as model, advanceChapterEightPresentation as advance, normalizeChapterEightPresentation as normalize, canContinueChapterEight } from "../src/game/chapterEightStory.js";
import { beginServiceNetRun, receiveServiceNetMessage, retryServiceNetRun, normalizeServiceNetRun, tickServiceNetRun, abandonServiceNetRun } from "../src/game/serviceNetRun.js";
import { interpretServiceNetTraffic, submitServiceNetResponse } from "../src/game/serviceNetTraffic.js";
import { settleServiceNetRun } from "../src/game/serviceNetSettlement.js";
import { chapterForScreen } from "../src/media/chapterMediaCatalog.js";
import { isWorldCalendarGameplayActive } from "../src/game/worldCalendarHeartbeat.js";
import { ACCEPTED, unlocked, accepted, newRun, withRun, finishedRun, completed, submit } from "./helpers/chapterEightFixtures.js";

test("chapter eight migrates bookmarks without changing gameplay records or funds",()=>{
 const old=withRun(accepted(),newRun(accepted()));delete old.chapterEightPresentation;
 const loaded=normalizeSave(old);
 assert.deepEqual(loaded.chapterEightPresentation,normalize(null));
 for(const key of ["money","technologyPoints","storyContinuationState","qsoLogs","missionState"])assert.deepEqual(loaded[key],old[key]);
 assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))),loaded);
});
test("chapter eight requires chapter seven and uses ordered resumable bookmarks",()=>{
 assert.equal(model(createSave({callsign:"BH1TEST"})).status,"locked");
 assert.equal(model(unlocked()).status,"available");assert(!advance(unlocked(),"queue").updated);
 let save=accepted();
 for(const beat of ["checkin","receipts","log","bad"])assert(!advance(save,beat).updated);
 save=advance(save,"queue").save;save=advance(save,"checkin").save;
 assert.equal(model(normalizeSave(save)).step,2);assert.strictEqual(advance(save,"checkin").save,save);
 assert(!advance(save,"queue").updated);assert(!advance(save,"receipts").updated);
});
test("chapter eight bookmark normalization ignores accessors and malformed fields",()=>{
 for(const value of [Object.create({acceptedAt:ACCEPTED,beat:"log"}),{get acceptedAt(){throw Error("getter");}}])assert.deepEqual(normalize(value),normalize(null));
 assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad",qsoId:"x".repeat(97)}).qsoId,null);
 assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad"}).beat,"briefing");
});
test("chapter eight ending needs all three ordered receipts, settled contact and relationship",()=>{
 const save=completed(),entry=model(save).candidate;
 assert(entry);assert.equal(model(save).status,"ready");assert.equal(model(save).step,3);assert.equal(model(save).receipts.length,3);
 assert(canContinueChapterEight(save,entry.eventRunId));assert(!canContinueChapterEight(save,"other"));
 const change=fields=>({...save,qsoLogs:save.qsoLogs.map(log=>log.id===entry.id?{...log,...fields}:log)});
 const chapterChange=fields=>({...save,storyContinuationState:{...save.storyContinuationState,chapter08:{...save.storyContinuationState.chapter08,...fields}}});
 const receipts=model(save).receipts;
 for(const bad of [
 {...save,qsoLogs:[]},{...save,operatorRelationships:[]},{...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}},
 chapterChange({settledRunIds:[]}),chapterChange({receipts:[]}),chapterChange({receipts:receipts.slice(0,2)}),
 chapterChange({receipts:[receipts[0],receipts[0],receipts[2]]}),
 chapterChange({receipts:receipts.map(item=>({...item,qsoId:"other"}))}),
 change({eventRunId:"other"}),change({eventKind:"other"}),change({eventId:"other"}),change({eventMode:"practice"}),
 change({personId:"person:other"}),change({stationId:"station:sim2dx"}),change({callsign:"SIM2DX"}),
 change({playerCallsign:"OTHER"}),change({isFictional:false}),change({sent:"999"}),change({received:""}),
 change({frequencyMhz:0}),change({completedAt:"2026-10-04T15:59:00.000Z"}),
 ]){assert.equal(model(bad).candidate,null);assert(!advance(bad,"log").updated);}
});
test("completed but unsettled service runs reload without an ending or reward",()=>{
 const save=accepted(),run=finishedRun(save),loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));
 assert.equal(model(loaded).candidate,null);assert.deepEqual(loaded.storyContinuationState.chapter08.activeRun,run);
 const result=settleServiceNetRun(loaded,loaded.storyContinuationState.chapter08.activeRun,run.completedAt);
 assert(result.settled);assert(model(result.save).candidate);assert.equal(result.save.money,save.money);
 assert.equal(settleServiceNetRun(result.save,run,run.completedAt).reason,"ALREADY_SETTLED");
});
test("chapter eight excludes pre-acceptance records, pins its ending and rewards once",()=>{
 let save=advance(completed(),"log").save;
 save=acceptMission(abandonMission(save,"story-08").save,"story-08","2026-10-04T17:00:00.000Z").save;
 assert.equal(model(save).step,0);assert.equal(model(save).candidate,null);
 save=completed(save,{at:"2026-10-04T17:02:00.000Z"});
 const expected=model(save).candidate.id;save=advance(save,"log").save;
 const result=claimMission(save,"story-08","2026-10-04T17:03:00.000Z");assert(result.claimed);
 assert.equal(result.save.money,save.money+850);assert.equal(result.save.technologyPoints,save.technologyPoints+4);
 assert(result.save.storyContinuationState.chapter08.taskTreeUnlocked);assert.equal(missionBoard(result.save).story[8].status,"available");
 assert.strictEqual(claimMission(result.save,"story-08").save,result.save);
 assert(!canContinueChapterEight(result.save,model(save).candidate.eventRunId));
 const replay=completed(result.save,{at:"2026-10-04T18:01:00.000Z"}),loaded=normalizeSave(JSON.parse(JSON.stringify(replay)));
 assert.equal(model(loaded).candidate.id,expected);assert.equal(model(loaded).step,4);
 assert.equal(chapterForScreen("chapter-eight",loaded),8);assert(isWorldCalendarGameplayActive({activeSaveId:loaded.id,screen:"chapter-eight"}));
});
test("legacy ready chapter eight still claims centrally when presentation evidence is missing",()=>{
 const save=completed(),legacy={...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}};
 assert.equal(model(legacy).status,"ready");assert.equal(model(legacy).candidate,null);assert(claimMission(legacy,"story-08").claimed);
});
test("service browser semantics supports ACK without bypassing explicit rejection or protocol checks",async()=>{
 let run=beginServiceNetRun(newRun(accepted()));
 const checkin=run.playerCallsign+" CHECK IN K",at="2026-10-04T16:02:00.000Z";
 for(const provider of [undefined,async()=>{throw Error("offline");},async()=>({ok:false})]){
  const semantic=await interpretServiceNetTraffic(run,checkin,provider);assert.equal(semantic.provider,"rules-v1");assert(semantic.safeToCommit);
 }
 run=receiveServiceNetMessage(submit(run,checkin));
 const item=run.messages[run.priorityOrder[0]],ack="ACK "+item.messageId+" PRI "+item.priority+" K";
 const semantic=await interpretServiceNetTraffic(run,ack);assert(semantic.safeToCommit);
 assert.equal(submitServiceNetResponse(run,run,ack,semantic,at).receipts.length,1);
 const rejected=await interpretServiceNetTraffic(run,ack,async()=>({ok:true,result:{safeToCommit:false}}));
 assert.equal(submitServiceNetResponse(run,run,ack,rejected,at).errors.at(-1),"SEMANTIC_UNSAFE");
 assert.equal(submit(run,"ACK "+item.messageId+" PRI "+(item.priority%3+1)+" K").errors.at(-1),"PRIORITY_MISMATCH");
 const next=run.messages[run.priorityOrder[1]];
 assert.equal(submit(run,"ACK "+next.messageId+" PRI "+next.priority+" K").errors.at(-1),"OUT_OF_ORDER");
 const unknown=String(Array.from({length:1000},(_,i)=>i).find(id=>!run.messages.some(m=>Number(m.messageId)===id))).padStart(3,"0");
 assert.equal(submit(run,"ACK "+unknown+" PRI 1 K").errors.at(-1),"MESSAGE_ID_MISMATCH");
 assert.equal(submit(run,"ACK K").errors.at(-1),"FORMAT_INVALID");
 assert.equal((await interpretServiceNetTraffic(run,"NONSENSE K")).safeToCommit,false);
 const recovered=submit(run,"QRS K");assert.equal(recovered.replyWpm,13);assert.equal(recovered.phase,"RECEIVE_MESSAGE");
 assert.deepEqual(recovered.receipts,[]);assert.equal(submit(run,"AGN K").phase,"RECEIVE_MESSAGE");
});
test("late semantic replies keep elapsed time and cannot revive timeout or another attempt",async()=>{
 let requested=beginServiceNetRun(newRun(accepted())),at="2026-10-04T16:02:00.000Z",message=requested.playerCallsign+" CHECK IN K";
 const semantic=await interpretServiceNetTraffic(requested,message);
 const current=tickServiceNetRun(requested,{seconds:7},at);
 assert.equal(submitServiceNetResponse(current,requested,message,semantic,at).elapsedMilliseconds,7000);
 const timeout=tickServiceNetRun(requested,{seconds:600},at);
 assert.strictEqual(submitServiceNetResponse(timeout,requested,message,semantic,at),timeout);
 const retry=retryServiceNetRun(timeout,"2026-10-04T16:03:00.000Z");
 assert.strictEqual(submitServiceNetResponse(retry,requested,message,semantic,at),retry);
});
test("failed and abandoned check-ins survive reload and retry without silently checking in",()=>{
 const initial=beginServiceNetRun(newRun(accepted())),at="2026-10-04T16:02:00.000Z";
 let failed=initial;
 for(let i=0;i<3;i++)failed=submit(failed,"OTHER CHECK IN K",at);
 assert.equal(failed.phase,"FAILED");assert(normalizeServiceNetRun(failed));
 for(const run of [failed,tickServiceNetRun(initial,{seconds:600},at),abandonServiceNetRun(initial,at)]){
  const loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(accepted(),run))));assert.deepEqual(loaded.storyContinuationState.chapter08.activeRun,run);
  const retry=retryServiceNetRun(run,"2026-10-04T16:03:00.000Z");
  assert.equal(retry.phase,"CHECK_IN");assert.equal(retry.checkedInAt,null);assert.deepEqual(retry.messages,initial.messages);
  assert.notEqual(retry.runId,run.runId);
 }
 let checked=submit(initial,initial.playerCallsign+" CHECK IN K");
 checked=tickServiceNetRun(checked,{seconds:600},at);
 assert.equal(retryServiceNetRun(checked,"2026-10-04T16:03:00.000Z").phase,"RECEIVE_MESSAGE");
});
