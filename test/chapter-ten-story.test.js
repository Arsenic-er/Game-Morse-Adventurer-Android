import assert from "node:assert/strict";
import test from "node:test";
import {createSave,normalizeSave} from "../src/game/saveStore.js";
import {acceptMission,abandonMission,claimMission,missionBoard} from "../src/game/missionSystem.js";
import {chapterTenStoryModel as model,advanceChapterTenPresentation as advance,normalizeChapterTenPresentation as normalize,canContinueChapterTen} from "../src/game/chapterTenStory.js";
import {selectContestMode,contestCqText,contestExchangeText,normalizeContestRun,normalizeContestState,tickContestRun,abandonContestRun,retryContestRun,finishContestRun,scoreContestRun} from "../src/game/contestRun.js";
import {interpretContestTraffic,submitContestResponse} from "../src/game/contestTraffic.js";
import {settleContestRun} from "../src/game/contestSettlement.js";
import {chapterForScreen} from "../src/media/chapterMediaCatalog.js";
import {isWorldCalendarGameplayActive} from "../src/game/worldCalendarHeartbeat.js";
import {ACCEPTED,accepted,unlocked,newRun,withRun,finishedRun,completed,contact,submit} from "./helpers/chapterTenFixtures.js";
test("chapter ten migrates bookmarks without changing contest progress or balances",()=>{
 const old=withRun(accepted(),newRun(accepted()));delete old.chapterTenPresentation;
 const loaded=normalizeSave(old);assert.deepEqual(loaded.chapterTenPresentation,normalize(null));
 for(const key of ["money","technologyPoints","storyContinuationState","qsoLogs","missionState"])assert.deepEqual(loaded[key],old[key]);
 assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))),loaded);
});
test("chapter ten requires chapter nine and sequential acceptance-scoped beats",()=>{
 assert.equal(model(createSave({callsign:"BH1TEST"})).status,"locked");assert.equal(model(unlocked()).status,"available");
 let save=accepted();for(const beat of ["exchange","result","log","bad"])assert(!advance(save,beat).updated);
 save=advance(advance(save,"modes").save,"exchange").save;assert.equal(model(normalizeSave(save)).step,2);
 assert(!advance(save,"modes").updated);assert(!advance(save,"result").updated);
 for(const value of [Object.create({acceptedAt:ACCEPTED,beat:"log"}),{get acceptedAt(){throw Error("getter");}}])assert.deepEqual(normalize(value),normalize(null));
 assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad",qsoId:"x".repeat(97)}).qsoId,null);
});
test("chapter ten ending requires every settled contest contact and matching record",async()=>{
 const save=await completed(),m=model(save);assert(m.record);assert.equal(m.contacts.length,6);assert.equal(m.step,3);
 assert(canContinueChapterTen(save,m.record.runId));assert(!canContinueChapterTen(save,"other"));
 const mutate=fields=>({...save,storyContinuationState:{...save.storyContinuationState,chapter10:{...save.storyContinuationState.chapter10,...fields}}});
 const bads=[{...save,qsoLogs:[]},{...save,operatorRelationships:[]},{...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}},mutate({records:[]}),mutate({settledRunIds:[]})];
 for(const log of m.contacts){
  bads.push({...save,qsoLogs:save.qsoLogs.filter(item=>item.id!==log.id)});
  for(const fields of [{playerCallsign:"OTHER"},{eventKind:"other"},{eventId:"other"},{eventMode:"practice"},{eventRunId:"other"},
   {personId:"person:other"},{stationId:"station:other"},{isFictional:false},{sent:"999"},{received:""},{frequencyMhz:0},{completedAt:"2026-10-04T17:59:00.000Z"}])
   bads.push({...save,qsoLogs:save.qsoLogs.map(item=>item.id===log.id?{...item,...fields}:item)});
 }
 for(const fields of [{runContacts:6},{spContacts:6},{uniqueRegions:3},{grade:"complete"},{score:m.record.score+1},{completedAt:"2026-10-04T17:59:00.000Z"}])
  bads.push(mutate({records:[{...m.record,...fields}]}));
 for(const bad of bads){assert.equal(model(bad).record,null);assert(!advance(bad,"log").updated);}
});
test("unsettled contest reload cannot expose the ending or pay credits",async()=>{
 const save=accepted(),run=await finishedRun(save),loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));
 assert.deepEqual(loaded.storyContinuationState.chapter10.activeRun,run);assert.equal(model(loaded).record,null);
 const result=settleContestRun(loaded,run,run.completedAt);assert(result.settled);assert(model(result.save).record);
 assert.equal(result.qsoIds.length,6);assert.equal(result.save.money,save.money);assert.equal(result.save.technologyPoints,save.technologyPoints);
 assert.equal(settleContestRun(result.save,run,run.completedAt).reason,"ALREADY_SETTLED");
});
test("chapter ten pins this round instead of personal best and excludes reaccepted history",async()=>{
 let save=advance(await completed(),"log").save;
 save=acceptMission(abandonMission(save,"story-10").save,"story-10","2026-10-04T19:00:00.000Z").save;
 assert.equal(model(save).step,0);assert.equal(model(save).record,null);
 save=advance(await completed(save,{at:"2026-10-04T19:02:00.000Z"}),"log").save;
 const expected=model(save).record.id,result=claimMission(save,"story-10","2026-10-04T19:03:00.000Z");assert(result.claimed);
 assert.equal(result.save.money,save.money+1100);assert.equal(result.save.technologyPoints,save.technologyPoints+5);
 assert(result.save.storyContinuationState.chapter10.taskTreeUnlocked);assert.equal(missionBoard(result.save).story[10].status,"available");
 assert.strictEqual(claimMission(result.save,"story-10").save,result.save);assert(!canContinueChapterTen(result.save,model(save).record.runId));
 const replay=await completed(result.save,{at:"2026-10-04T20:00:00.000Z",count:8}),loaded=normalizeSave(JSON.parse(JSON.stringify(replay)));
 assert.notEqual(loaded.storyContinuationState.chapter10.personalBest.id,expected);
 assert.equal(model(loaded).record.id,expected);assert.equal(model(loaded).step,4);
 assert.equal(chapterForScreen("chapter-ten",loaded),10);assert(isWorldCalendarGameplayActive({activeSaveId:loaded.id,screen:"chapter-ten"}));
});
test("legacy ready chapter ten remains centrally claimable without presentation ledger",async()=>{
 const save=await completed(),legacy={...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}};
 assert.equal(model(legacy).status,"ready");assert.equal(model(legacy).record,null);assert(claimMission(legacy,"story-10").claimed);
});
test("contest browser fallback accepts ordinary CQ and exchange without bypassing rejection",async()=>{
 let run=selectContestMode(newRun(accepted()),"RUN");const at="2026-10-04T18:02:00.000Z",cq=contestCqText(run.playerCallsign);
 for(const provider of [undefined,async()=>{throw Error("offline");},async()=>({ok:false})]){
  const semantic=await interpretContestTraffic(run,cq,provider);assert.equal(semantic.provider,"rules-v1");assert(semantic.safeToCommit);
  assert.equal(submitContestResponse(run,run,cq,semantic,at).phase,"RUN_PILEUP");
 }
 const rejected=await interpretContestTraffic(run,cq,async()=>({ok:true,result:{safeToCommit:false}}));
 assert.equal(submitContestResponse(run,run,cq,rejected,at).errors.at(-1),"SEMANTIC_UNSAFE");
 run=await submit(run,cq);run=await submit(run,run.candidates[0].callsign);
 const canonical=contestExchangeText(run.selectedStation,run.playerCallsign,run.nextSerial);
 for(const [message,error] of [[canonical.replace("NR 001","NR 002"),"SERIAL_MISMATCH"],[canonical.replace("RST 599","RST 579"),"RST_MISMATCH"],[canonical.replace(/REGION [A-Z]{2}/,"REGION ZZ"),"REGION_MISMATCH"],[canonical.replace(/PWR [0-9]+/,"PWR 999"),"POWER_MISMATCH"],[canonical+" EXTRA","FORMAT_INVALID"]]){
  const result=await submit(run,message);assert.equal(result.errors.at(-1),error);assert.equal(result.contacts.length,0);
 }
});
test("contest exchange recovery preserves serial and station across reload",async()=>{
 const save=accepted();let run=selectContestMode(newRun(save),"SP");run=await submit(run,run.candidates[0].callsign);
 for(const cmd of ["AGN K","QRS K"]){
  const changed=await submit(run,cmd),loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,changed))));
  assert.deepEqual(loaded.storyContinuationState.chapter10.activeRun,changed);assert.equal(changed.nextSerial,1);
  assert.equal(changed.selectedStation.personId,run.selectedStation.personId);
  const resumed=await submit(changed,contestExchangeText(changed.selectedStation,changed.playerCallsign,changed.nextSerial));
  assert.equal(resumed.contacts.length,1);assert.equal(resumed.cleanExchanges,0);
 }
});
test("ten contacts in one mode fail persistably instead of creating invalid completed state",async()=>{
 const save=accepted();let run=newRun(save);for(let i=0;i<10;i++)run=await contact(run,"RUN");
 assert.equal(run.phase,"FAILED");assert.equal(run.failureReason,"MINIMUM_NOT_MET");assert(normalizeContestRun(run));
 assert.deepEqual(normalizeSave(withRun(save,run)).storyContinuationState.chapter10.activeRun,run);
 const retry=retryContestRun(run,"2026-10-04T18:04:00.000Z");assert.equal(retry.phase,"BRIEFING");assert.deepEqual(retry.stationPool,run.stationPool);assert.notEqual(retry.runId,run.runId);
});
test("contest timeout and abandon reloads retain stations and retry cleanly",async()=>{
 const save=accepted();let run=selectContestMode(newRun(save),"SP");run=await submit(run,run.candidates[0].callsign);
 for(const terminal of [tickContestRun(run,{seconds:300},"2026-10-04T18:06:00.000Z"),abandonContestRun(run,"2026-10-04T18:02:00.000Z")]){
  assert(normalizeContestRun(terminal));assert.deepEqual(normalizeSave(withRun(save,terminal)).storyContinuationState.chapter10.activeRun,terminal);
  assert.equal(retryContestRun(terminal,"2026-10-04T18:07:00.000Z").contacts.length,0);
 }
});
test("late contest interpretation retains elapsed time and cannot revive timeout or another exchange",async()=>{
 let requested=selectContestMode(newRun(accepted()),"SP");requested=await submit(requested,requested.candidates[0].callsign);
 const message=contestExchangeText(requested.selectedStation,requested.playerCallsign,requested.nextSerial),semantic=await interpretContestTraffic(requested,message),at="2026-10-04T18:02:00.000Z";
 const current=tickContestRun(requested,{seconds:9},at);
 assert.equal(submitContestResponse(current,requested,message,semantic,at).elapsedMilliseconds,9000);
 const timeout=tickContestRun(requested,{seconds:300},at);assert.strictEqual(submitContestResponse(timeout,requested,message,semantic,at),timeout);
 let other=selectContestMode(await submit(requested,message),"SP");other=await submit(other,other.candidates[0].callsign);
 assert.strictEqual(submitContestResponse(other,requested,message,semantic,at),other);
 const retry=selectContestMode(retryContestRun(timeout,"2026-10-04T18:03:00.000Z"),"SP");assert.strictEqual(submitContestResponse(retry,requested,message,semantic,at),retry);
});
