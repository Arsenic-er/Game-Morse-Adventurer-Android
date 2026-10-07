import assert from "node:assert/strict";
import test from "node:test";
import { createSave, normalizeSave } from "../src/game/saveStore.js";
import { acceptMission, abandonMission, claimMission, missionBoard } from "../src/game/missionSystem.js";
import { chapterSevenStoryModel as model, advanceChapterSevenPresentation as advance, normalizeChapterSevenPresentation as normalize, canContinueChapterSeven } from "../src/game/chapterSevenStory.js";
import { qslStoryClarificationText, reviewQslAccounts, submitQslClarification, receiveQslClarification, retryQslStoryRun } from "../src/game/qslStoryRun.js";
import { interpretQslStoryTraffic } from "../src/game/qslStoryTraffic.js";
import { settleQslStoryRun } from "../src/game/qslStorySettlement.js";
import { chapterForScreen } from "../src/media/chapterMediaCatalog.js";
import { isWorldCalendarGameplayActive } from "../src/game/worldCalendarHeartbeat.js";
import { ACCEPTED, locked, unlocked, accepted, newRun, withRun, finishedRun, completed } from "./helpers/chapterSevenFixtures.js";

test("chapter seven migrates its bookmark without changing the case, choices or balances",()=>{
  const old=withRun(accepted(),newRun(accepted()));delete old.chapterSevenPresentation;
  const loaded=normalizeSave(old);
  assert.deepEqual(loaded.chapterSevenPresentation,normalize(null));
  for(const key of ["money","technologyPoints","storyContinuationState","qslRecords","qsoLogs","missionState"])assert.deepEqual(loaded[key],old[key]);
  assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))),loaded);
});
test("chapter seven respects source choice gates and ordered resumable bookmarks",()=>{
  assert.equal(model(createSave({callsign:"BH1TEST"})).status,"locked");
  assert.equal(model(locked()).status,"locked");
  assert.equal(model(unlocked()).status,"available");
  assert(!advance(unlocked(),"compare").updated);
  let save=accepted();
  for(const beat of ["call","answer","log","bad"])assert(!advance(save,beat).updated);
  save=advance(save,"compare").save;save=advance(save,"call").save;
  assert.equal(model(normalizeSave(save)).step,2);
  assert.strictEqual(advance(save,"call").save,save);
  assert(!advance(save,"compare").updated);
  assert(!advance(save,"answer").updated);
});
test("chapter seven ignores getters, inherited and oversized bookmark fields",()=>{
  for(const value of [Object.create({acceptedAt:ACCEPTED,beat:"log"}),{get acceptedAt(){throw Error("getter");}}])assert.deepEqual(normalize(value),normalize(null));
  assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad",qsoId:"x".repeat(97)}).qsoId,null);
  assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad"}).beat,"card");
});
test("chapter seven requires matching source, settled case, contact and relationship",()=>{
  const save=completed(),entry=model(save).candidate;
  assert(entry);assert.equal(model(save).status,"ready");assert.equal(model(save).step,3);
  assert(canContinueChapterSeven(save,entry.eventRunId));assert(!canContinueChapterSeven(save,"other"));
  const change=fields=>({...save,qsoLogs:save.qsoLogs.map(log=>log.id===entry.id?{...log,...fields}:log)});
  const chapterChange=fields=>({...save,storyContinuationState:{...save.storyContinuationState,chapter07:{...save.storyContinuationState.chapter07,...fields}}});
  const recordsChange=fields=>({...save,qslRecords:save.qslRecords.map(item=>({...item,...fields}))});
  for(const bad of [
    {...save,qsoLogs:[]},{...save,qslRecords:[]},{...save,operatorRelationships:[]},
    {...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}},
    chapterChange({settledRunIds:[]}),chapterChange({cases:[]}),
    recordsChange({choice:"believe"}),recordsChange({eventRunId:"other"}),
    ...["settledQsoProofs","settledRunIds"].map(key=>({...save,expeditionState:{...save.expeditionState,[key]:[]}})),
    change({eventRunId:"other"}),change({eventKind:"other"}),change({eventId:"other"}),change({eventMode:"practice"}),
    change({personId:"person:other"}),change({stationId:"station:sim2dx"}),change({callsign:"SIM2DX"}),
    change({playerCallsign:"OTHER"}),change({isFictional:false}),change({sent:"999"}),change({received:""}),
    change({frequencyMhz:0}),change({completedAt:"2026-10-04T14:59:00.000Z"}),
  ]){assert.equal(model(bad).candidate,null);assert(!advance(bad,"log").updated);}
});
test("all initial and final QSL choices are valid and preserved separately",()=>{
  for(const initial of ["believe","request-review","defer"])for(const final of ["believe","request-review","defer"]){
    const save=completed(accepted(initial),{choice:final}),m=model(save);
    assert.equal(m.source.choice,initial);assert.equal(m.qslCase.initialChoice,initial);assert.equal(m.qslCase.finalChoice,final);
    assert.equal(save.qslRecords.at(-1).choice,initial);
  }
});
test("completed but unsettled QSL runs survive reload without unlocking an ending",()=>{
  const save=accepted(),run=finishedRun(save);
  const loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));
  assert.equal(model(loaded).candidate,null);
  assert.deepEqual(loaded.storyContinuationState.chapter07.activeRun,run);
  const result=settleQslStoryRun(loaded,loaded.storyContinuationState.chapter07.activeRun,run.completedAt);
  assert(result.settled);assert(model(result.save).candidate);
  assert.equal(result.save.money,save.money);
});
test("chapter seven excludes old results after reacceptance and pins the ending against replay",()=>{
  let save=advance(completed(),"log").save;
  save=acceptMission(abandonMission(save,"story-07").save,"story-07","2026-10-04T16:00:00.000Z").save;
  assert.equal(model(save).step,0);assert.equal(model(save).candidate,null);
  save=completed(save,{at:"2026-10-04T16:02:00.000Z",choice:"believe"});
  const expected=model(save).candidate.id;
  save=advance(save,"log").save;
  const result=claimMission(save,"story-07","2026-10-04T16:03:00.000Z");assert(result.claimed);
  assert.equal(result.save.money,save.money+750);assert.equal(result.save.technologyPoints,save.technologyPoints+3);
  assert(result.save.storyContinuationState.chapter07.peopleTaskTreeUnlocked);
  assert.deepEqual(result.save.qslRecords,save.qslRecords);
  assert.equal(missionBoard(result.save).story[7].status,"available");
  assert.strictEqual(claimMission(result.save,"story-07").save,result.save);
  assert(!canContinueChapterSeven(result.save,model(save).candidate.eventRunId));
  const replay=completed(result.save,{at:"2026-10-04T17:01:00.000Z",choice:"defer"});
  const loaded=normalizeSave(JSON.parse(JSON.stringify(replay)));
  assert.equal(model(loaded).candidate.id,expected);assert.equal(model(loaded).qslCase.finalChoice,"believe");
  assert.equal(model(loaded).step,4);
  assert.equal(chapterForScreen("chapter-seven",loaded),7);
  assert(isWorldCalendarGameplayActive({activeSaveId:loaded.id,screen:"chapter-seven"}));
});
test("legacy ready chapter seven can still claim centrally without presentation ledger",()=>{
  const save=completed(),legacy={...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}};
  assert.equal(model(legacy).status,"ready");assert.equal(model(legacy).candidate,null);
  assert(claimMission(legacy,"story-07").claimed);
});
test("browser QSL semantics uses the normal interpreter and never bypasses an explicit rejection",async()=>{
  const save=accepted(),run=reviewQslAccounts(newRun(save)),message=qslStoryClarificationText(run),at="2026-10-04T15:02:00.000Z";
  for(const provider of [undefined,async()=>{throw Error("unavailable");},async()=>({ok:false})]){
    const semantic=await interpretQslStoryTraffic(run,message,provider);
    assert.equal(semantic.provider,"rules-v1");assert(semantic.safeToCommit);
    assert.equal(submitQslClarification(run,message,semantic,at).phase,"SORA_CLARIFICATION_REPLY");
  }
  const rejected=await interpretQslStoryTraffic(run,message,async()=>({ok:true,result:{safeToCommit:false}}));
  assert.equal(submitQslClarification(run,message,rejected,at).errors.at(-1),"SEMANTIC_UNSAFE");
  const wrong="QSL WRONG DE "+save.callsign+" PSE K";
  assert.equal(submitQslClarification(run,wrong,await interpretQslStoryTraffic(run,wrong),at).errors.at(-1),"CASE_MISMATCH");
  let failed=run;
  for(let i=0;i<3;i++)failed=submitQslClarification(failed,wrong,await interpretQslStoryTraffic(run,wrong),at);
  assert.equal(failed.phase,"FAILED");
  const retried=retryQslStoryRun(failed,"2026-10-04T15:03:00.000Z");
  assert.equal(retried.phase,"CASE_OPEN");assert.equal(retried.retryCount,1);assert.notEqual(retried.runId,run.runId);
  let reply=receiveQslClarification(submitQslClarification(run,message,await interpretQslStoryTraffic(run,message),at),at);
  reply=submitQslClarification(reply,"QRS K",await interpretQslStoryTraffic(reply,"QRS K"),at);
  assert.equal(reply.phase,"SORA_CLARIFICATION_REPLY");assert.equal(reply.replyWpm,13);assert.deepEqual(reply.recoveryActions,["QRS"]);
});
