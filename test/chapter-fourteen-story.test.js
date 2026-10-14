import assert from "node:assert/strict";
import test from "node:test";
import {createSave,normalizeSave} from "../src/game/saveStore.js";
import {acceptMission,abandonMission,claimMission,missionBoard} from "../src/game/missionSystem.js";
import {chapterFourteenStoryModel as model,advanceChapterFourteenPresentation as advance,normalizeChapterFourteenPresentation as normalize,canContinueChapterFourteen} from "../src/game/chapterFourteenStory.js";
import {tickFinalPromiseRun,reviewFinalPromise,receiveFinalPromiseAccount,retryFinalPromiseRun,requestFinalPromiseRepeat,finalPromiseCallText,finalPromiseMessageText} from "../src/game/finalPromiseRun.js";
import {interpretFinalPromiseTraffic,submitFinalPromiseResponse,finalPromiseRecordedMessage} from "../src/game/finalPromiseTraffic.js";
import {settleFinalPromiseRun,verifiedFinalPromiseCompletion} from "../src/game/finalPromiseSettlement.js";
import {chapterForScreen} from "../src/media/chapterMediaCatalog.js";
import {isWorldCalendarGameplayActive} from "../src/game/worldCalendarHeartbeat.js";
import {ACCEPTED,accepted,unlocked,newRun,withRun,finishedRun,completed,submit} from "./helpers/chapterFourteenFixtures.js";
test("chapter fourteen migrates bounded acceptance-scoped bookmarks",async()=>{
 const old=await accepted();delete old.chapterFourteenPresentation;const loaded=normalizeSave(old);
 assert.deepEqual(loaded.chapterFourteenPresentation,normalize(null));
 for(const key of ["money","technologyPoints","storyContinuationState","qsoLogs","missionState"])assert.deepEqual(loaded[key],old[key]);
 assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))),loaded);
 for(const value of [Object.create({acceptedAt:ACCEPTED,beat:"log"}),{get acceptedAt(){throw Error("getter");}}])assert.deepEqual(normalize(value),normalize(null));
 assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad",recordId:"x".repeat(97)}).recordId,null);
});
test("chapter fourteen gates thirteen, opening beats and unsettled completion",async()=>{
 assert.equal(model(createSave({callsign:"BH1TEST"})).status,"locked");assert.equal(model(await unlocked()).status,"available");
 let save=await accepted();for(const beat of ["call","reply","log","bad"])assert(!advance(save,beat).updated);
 save=advance(advance(save,"review").save,"call").save;assert.equal(model(normalizeSave(save)).step,2);
 assert(!advance(save,"review").updated);assert(!advance(save,"reply").updated);
 const run=await finishedRun(save),loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));
 assert.equal(loaded.storyContinuationState.chapter14.activeRun.phase,"COMPLETED");assert.equal(model(loaded).record,null);assert(!advance(loaded,"log").updated);
});
test("chapter fourteen requires matching player, archive, summary, proof, QSO and relationship",async()=>{
 const save=await completed(),m=model(save),chapter=save.storyContinuationState.chapter14;
 assert(m.record);assert.equal(m.step,3);assert(canContinueChapterFourteen(save,m.record.runId));assert(!canContinueChapterFourteen(save,"other"));
 const mutate=fields=>({...save,storyContinuationState:{...save.storyContinuationState,chapter14:{...chapter,...fields}}});
 const bads=[{...save,callsign:"OTHER"},mutate({archive:[]}),mutate({completedRuns:[]}),mutate({settlementProofs:[]}),mutate({settledRunIds:[]}),
 {...save,qsoLogs:save.qsoLogs.filter(l=>l.id!==m.record.qsoId)},
 {...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}},
 {...save,operatorRelationships:save.operatorRelationships.filter(r=>r.personId!==m.record.personId)},
 mutate({archive:[{...m.record,tone:"warm",messageKey:"chapter14.message.warm"}]}),
 mutate({archive:[{...m.record,accountKey:m.record.accountKey==="chapter14.account.unfinished-log"?"chapter14.account.forward-promise":"chapter14.account.unfinished-log"}]})];
 for(const bad of bads){assert.equal(model(bad).record,null);assert(!advance(bad,"log").updated);}
 const crossPlayer=mutate({archive:chapter.archive.map(r=>({...r,playerCallsign:"OTHER"})),completedRuns:chapter.completedRuns.map(r=>({...r,playerCallsign:"OTHER"}))});
 assert(!verifiedFinalPromiseCompletion(crossPlayer,save.missionState.activeMissions.find(m=>m.id==="story-14")));
});
test("all three tones retain their exact sent message and zero QSO payout",async()=>{
 for(const tone of ["brief","steady","warm"]){
  const base=await accepted(),run=await finishedRun(base,{tone}),result=settleFinalPromiseRun(withRun(base,run),run,run.completedAt);assert(result.settled);
  const saved=normalizeSave(JSON.parse(JSON.stringify(result.save))),record=model(saved).record;
  assert.equal(record.tone,tone);assert.equal(finalPromiseRecordedMessage(record),finalPromiseMessageText(run));
  for(const key of ["money","technologyPoints"])assert.equal(saved[key],base[key]);
  assert.equal(saved.qsoRecords.total,base.qsoRecords.total+1);
  assert.equal(settleFinalPromiseRun(saved,run,run.completedAt).reason,"ALREADY_SETTLED");
 }
});
test("chapter fourteen excludes stale acceptance and pins first ending across two different replay tones",async()=>{
 let save=advance(await completed(),"log").save;
 save=acceptMission(abandonMission(save,"story-14").save,"story-14","2026-10-04T23:00:00.000Z").save;
 assert.equal(model(save).step,0);assert.equal(model(save).record,null);
 save=advance(await completed(save,{at:"2026-10-04T23:01:00.000Z",tone:"warm"}),"log").save;
 const expected=model(save).record.id,result=claimMission(save,"story-14","2026-10-04T23:05:00.000Z");assert(result.claimed);
 assert.equal(result.save.money,save.money+1700);assert.equal(result.save.technologyPoints,save.technologyPoints+7);
 assert(result.save.storyContinuationState.chapter14.taskTreeUnlocked);assert.equal(missionBoard(result.save).story[14].status,"available");
 assert.strictEqual(claimMission(result.save,"story-14").save,result.save);assert(!canContinueChapterFourteen(result.save,model(save).record.runId));
 let replay=await completed(result.save,{at:"2026-10-05T00:00:00.000Z",tone:"brief"});
 replay=await completed(replay,{at:"2026-10-05T01:00:00.000Z",tone:"steady"});
 const loaded=normalizeSave(JSON.parse(JSON.stringify(replay)));
 assert.equal(loaded.storyContinuationState.chapter14.archive.length,4);assert.equal(model(loaded).record.id,expected);assert.equal(model(loaded).record.tone,"warm");assert.equal(model(loaded).step,4);
 for(const key of ["money","technologyPoints"])assert.equal(loaded[key],result.save[key]);
 assert.equal(loaded.qsoRecords.total,result.save.qsoRecords.total+2);
 assert.equal(chapterForScreen("chapter-fourteen",loaded),14);assert(isWorldCalendarGameplayActive({activeSaveId:loaded.id,screen:"chapter-fourteen"}));
});
test("final promise replay requires both claim and task-tree unlock",async()=>{
 const save=claimMission(await completed(),"story-14","2026-10-04T23:00:00.000Z").save,run=await finishedRun(save,{at:"2026-10-05T00:00:00.000Z"}),ready=withRun(save,run);
 assert(settleFinalPromiseRun(ready,run,run.completedAt).settled);
 for(const bad of [
 {...ready,missionState:{...ready.missionState,claimedMissionIds:ready.missionState.claimedMissionIds.filter(id=>id!=="story-14")}},
 {...ready,storyContinuationState:{...ready.storyContinuationState,chapter14:{...ready.storyContinuationState.chapter14,taskTreeUnlocked:false}}},
 {...ready,callsign:"OTHER"}
 ])assert.equal(settleFinalPromiseRun(bad,run,run.completedAt).reason,"RUN_STATE_MISMATCH");
});
test("final promise browser fallback preserves provider rejection and exact recovery input",async()=>{
 let run=reviewFinalPromise(newRun(await accepted()));const message=finalPromiseCallText(run),at="2026-10-04T22:02:00.000Z";
 for(const provider of [undefined,async()=>{throw Error("offline");},async()=>({ok:false})]){
  const semantic=await interpretFinalPromiseTraffic(run,message,provider);assert.equal(semantic.provider,"rules-v1");assert(semantic.safeToCommit);
  assert.equal(submitFinalPromiseResponse(run,run,message,semantic,at).phase,"ACCOUNT");
 }
 const rejected=await interpretFinalPromiseTraffic(run,message,async()=>({ok:true,result:{safeToCommit:false}}));
 assert.strictEqual(submitFinalPromiseResponse(run,run,message,rejected,at),run);
 assert.strictEqual(await submit(run,"BAD K"),run);
 run=receiveFinalPromiseAccount(await submit(run,message),at);
 assert.equal(requestFinalPromiseRepeat(run,"AGN K",{safeToCommit:false}).phase,"ACCOUNT");
 assert.strictEqual(requestFinalPromiseRepeat(run,"AGN JUNK",{safeToCommit:true}),run);
 run=await submit(run,"AGN K");run=receiveFinalPromiseAccount(run,at);run=await submit(run,"QRS K");
 assert.deepEqual(run.recoveryActions,["AGN","QRS"]);assert.equal(run.accountWpm,12);
});
test("late final-promise interpretation retains active time and rejects changed or retried phases",async()=>{
 const run=reviewFinalPromise(newRun(await accepted())),message=finalPromiseCallText(run),semantic=await interpretFinalPromiseTraffic(run,message),at="2026-10-04T22:02:00.000Z";
 const current=tickFinalPromiseRun(run,{milliseconds:9_000},at);assert.equal(submitFinalPromiseResponse(current,run,message,semantic,at).activeMilliseconds,9_000);
 const timeout=tickFinalPromiseRun(run,{milliseconds:600_000},at);assert.strictEqual(submitFinalPromiseResponse(timeout,run,message,semantic,at),timeout);
 const retry=reviewFinalPromise(retryFinalPromiseRun(timeout,"2026-10-04T23:00:00.000Z"));assert.strictEqual(submitFinalPromiseResponse(retry,run,message,semantic,at),retry);
 const received=await submit(run,message);assert.strictEqual(submitFinalPromiseResponse(received,run,message,semantic,at),received);
});
