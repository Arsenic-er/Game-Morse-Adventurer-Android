import assert from "node:assert/strict";
import test from "node:test";
import {createSave,normalizeSave} from "../src/game/saveStore.js";
import {acceptMission,abandonMission,claimMission,missionBoard} from "../src/game/missionSystem.js";
import {chapterNineStoryModel as model,advanceChapterNinePresentation as advance,normalizeChapterNinePresentation as normalize,canContinueChapterNine} from "../src/game/chapterNineStory.js";
import {beginCoordinateRelayRun,receiveCoordinatePacket,receiveRelayConfirmation,coordinatePacketText,retryCoordinateRelayRun,normalizeCoordinateRelayRun,tickCoordinateRelayRun,abandonCoordinateRelayRun} from "../src/game/coordinateRelayRun.js";
import {interpretCoordinateRelayTraffic,submitCoordinateRelayResponse} from "../src/game/coordinateRelayTraffic.js";
import {settleCoordinateRelayRun} from "../src/game/coordinateRelaySettlement.js";
import {chapterForScreen} from "../src/media/chapterMediaCatalog.js";
import {isWorldCalendarGameplayActive} from "../src/game/worldCalendarHeartbeat.js";
import {ACCEPTED,unlocked,accepted,newRun,withRun,finishedRun,completed,submit} from "./helpers/chapterNineFixtures.js";
test("chapter nine migrates its bookmark without altering packets, contacts or funds",()=>{
 const old=withRun(accepted(),newRun(accepted()));delete old.chapterNinePresentation;
 const loaded=normalizeSave(old);assert.deepEqual(loaded.chapterNinePresentation,normalize(null));
 for(const key of ["money","technologyPoints","storyContinuationState","qsoLogs","missionState"])assert.deepEqual(loaded[key],old[key]);
 assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(loaded))),loaded);
});
test("chapter nine requires chapter eight and an ordered acceptance-scoped bookmark",()=>{
 assert.equal(model(createSave({callsign:"BH1TEST"})).status,"locked");
 assert.equal(model(unlocked()).status,"available");assert(!advance(unlocked(),"fields").updated);
 let save=accepted();for(const beat of ["readback","confirmed","log","bad"])assert(!advance(save,beat).updated);
 save=advance(save,"fields").save;save=advance(save,"readback").save;
 assert.equal(model(normalizeSave(save)).step,2);assert.strictEqual(advance(save,"readback").save,save);
 assert(!advance(save,"fields").updated);assert(!advance(save,"confirmed").updated);
});
test("chapter nine ignores malformed bookmark fields and accessors",()=>{
 for(const value of [Object.create({acceptedAt:ACCEPTED,beat:"log"}),{get acceptedAt(){throw Error("getter");}}])assert.deepEqual(normalize(value),normalize(null));
 assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad",qsoId:"x".repeat(97)}).qsoId,null);
 assert.equal(normalize({acceptedAt:ACCEPTED,beat:"bad"}).beat,"sheet");
});
test("chapter nine requires both settled contacts and their packet and relationship proofs",()=>{
 const save=completed(),m=model(save);assert(m.candidate&&m.source&&m.packet);assert.equal(m.status,"ready");assert.equal(m.step,3);
 assert(canContinueChapterNine(save,m.candidate.eventRunId));assert(!canContinueChapterNine(save,"other"));
 const change=(id,fields)=>({...save,qsoLogs:save.qsoLogs.map(log=>log.id===id?{...log,...fields}:log)});
 const chapterChange=fields=>({...save,storyContinuationState:{...save.storyContinuationState,chapter09:{...save.storyContinuationState.chapter09,...fields}}});
 const packetChange=fields=>chapterChange({packets:[{...m.packet,...fields}]});
 const bads=[
 {...save,qsoLogs:[]},{...save,operatorRelationships:[]},{...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}},
 chapterChange({settledRunIds:[]}),chapterChange({packets:[]}),packetChange({sourceQsoId:m.candidate.id}),
 packetChange({relayQsoId:"other"}),packetChange({runId:"other"}),
 packetChange({packet:{...m.packet.packet,check:(m.packet.packet.check+1)%97}}),
 ];
 for(const entry of [m.source,m.candidate]){
  bads.push({...save,qsoLogs:save.qsoLogs.filter(log=>log.id!==entry.id)});
  for(const fields of [{eventRunId:"other"},{eventKind:"other"},{eventId:"other"},{eventMode:"practice"},{personId:"person:other"},
   {stationId:"station:sim2dx"},{callsign:"SIM2DX"},{playerCallsign:"OTHER"},{isFictional:false},{sent:"999"},{received:""},{frequencyMhz:0},{completedAt:"2026-10-04T16:59:00.000Z"}])bads.push(change(entry.id,fields));
 }
 for(const bad of bads){assert.equal(model(bad).candidate,null);assert(!advance(bad,"log").updated);}
});
test("unsettled coordinate completion reloads without exposing its ending or awarding funds",()=>{
 const save=accepted(),run=finishedRun(save),loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));
 assert.equal(model(loaded).candidate,null);assert.deepEqual(loaded.storyContinuationState.chapter09.activeRun,run);
 const result=settleCoordinateRelayRun(loaded,run,run.completedAt);assert(result.settled);assert(model(result.save).candidate);
 assert.equal(result.save.money,save.money);assert.equal(result.qsoIds.length,2);
 assert.equal(settleCoordinateRelayRun(result.save,run,run.completedAt).reason,"ALREADY_SETTLED");
});
test("chapter nine pins its packet, excludes old runs after reacceptance and rewards once",()=>{
 let save=advance(completed(),"log").save;
 save=acceptMission(abandonMission(save,"story-09").save,"story-09","2026-10-04T18:00:00.000Z").save;
 assert.equal(model(save).step,0);assert.equal(model(save).candidate,null);
 save=advance(completed(save,{at:"2026-10-04T18:02:00.000Z"}),"log").save;
 const expected=model(save).packet.id,result=claimMission(save,"story-09","2026-10-04T18:03:00.000Z");assert(result.claimed);
 assert.equal(result.save.money,save.money+950);assert.equal(result.save.technologyPoints,save.technologyPoints+4);
 assert(result.save.storyContinuationState.chapter09.toolUnlocked);assert.equal(missionBoard(result.save).story[9].status,"available");
 assert.strictEqual(claimMission(result.save,"story-09").save,result.save);
 assert(!canContinueChapterNine(result.save,model(save).candidate.eventRunId));
 const loaded=normalizeSave(JSON.parse(JSON.stringify(completed(result.save,{at:"2026-10-04T19:01:00.000Z"}))));
 assert.equal(model(loaded).packet.id,expected);assert.equal(model(loaded).step,4);
 assert.equal(chapterForScreen("chapter-nine",loaded),9);assert(isWorldCalendarGameplayActive({activeSaveId:loaded.id,screen:"chapter-nine"}));
});
test("legacy ready chapter nine can still be claimed centrally without the presentation ledger",()=>{
 const save=completed(),legacy={...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}};
 assert.equal(model(legacy).status,"ready");assert.equal(model(legacy).candidate,null);assert(claimMission(legacy,"story-09").claimed);
});
test("coordinate browser fallback recognizes GRID but never overrides rejection or field validation",async()=>{
 const run=receiveCoordinatePacket(beginCoordinateRelayRun(newRun(accepted()))),text=coordinatePacketText(run.packet),at="2026-10-04T17:02:00.000Z";
 for(const provider of [undefined,async()=>{throw Error("offline");},async()=>({ok:false})]){
  const semantic=await interpretCoordinateRelayTraffic(run,text,provider);assert.equal(semantic.provider,"rules-v1");assert(semantic.safeToCommit);
  assert.equal(submitCoordinateRelayResponse(run,run,text,semantic,at).phase,"RELAY_PACKET");
 }
 const rejected=await interpretCoordinateRelayTraffic(run,text,async()=>({ok:true,result:{safeToCommit:false}}));
 assert.equal(submitCoordinateRelayResponse(run,run,text,rejected,at).lastError,"SEMANTIC_UNSAFE");
 assert.equal((await interpretCoordinateRelayTraffic(run,"NONSENSE K")).safeToCommit,false);
 for(const [message,error] of [
  [text.replace(/MSG [0-9]{3}/,"MSG "+String((Number(run.packet.packetId)+1)%1000).padStart(3,"0")),"MESSAGE_ID_MISMATCH"],
  [text.replace(/GRID PX [0-9]{4}/,"GRID PX 99999"),"GRID_MISMATCH"],
  [text.replace(/TIME [0-9]{4}Z/,"TIME 9999Z"),"TIME_MISMATCH"],
  [text.replace(/PEOPLE [0-9]{2}/,"PEOPLE "+String((run.packet.people+1)%100).padStart(2,"0")),"PEOPLE_MISMATCH"],
  [text.replace(/CHECK [0-9]{2}/,"CHECK "+String((run.packet.check+1)%97).padStart(2,"0")),"CHECK_MISMATCH"],
  [text+" GARBAGE","FORMAT_INVALID"],
 ])assert.equal(submit(run,message).lastError,error);
});
test("relay-stage recovery, wrong field and invalid confirmation return a persistable fresh readback",()=>{
 const save=accepted(),input=receiveCoordinatePacket(beginCoordinateRelayRun(newRun(save))),relaying=submit(input);
 const awaiting=submit(relaying),at="2026-10-04T17:02:00.000Z";
 const wrong=coordinatePacketText(relaying.packet).replace(/CHECK [0-9]{2}/,"CHECK "+String((relaying.packet.check+1)%97).padStart(2,"0"));
 for(const changed of [submit(relaying,"AGN K"),submit(relaying,"QRS K"),submit(relaying,wrong),receiveRelayConfirmation(awaiting,"QSL WRONG K",at)]){
  assert(normalizeCoordinateRelayRun(changed));assert.equal(changed.readbackCompletedAt,null);assert.equal(changed.relaySentAt,null);
  const loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,changed))));assert.deepEqual(loaded.storyContinuationState.chapter09.activeRun,changed);
  assert.equal(model(loaded).candidate,null);
  let resumed=submit(receiveCoordinatePacket(changed));assert.equal(resumed.phase,"RELAY_PACKET");
  resumed=submit(resumed);assert.equal(resumed.phase,"RELAY_CONFIRMATION");
  assert.equal(receiveRelayConfirmation(resumed,"QSL MSG "+resumed.packet.packetId+" CHECK "+String(resumed.packet.check).padStart(2,"0")+" K",at).phase,"COMPLETED");
 }
 assert.equal(submit(relaying,"QRS K").replyWpm,13);
});
test("coordinate failed and abandoned post-readback states survive reload and retry the same packet",()=>{
 const save=accepted(),input=receiveCoordinatePacket(beginCoordinateRelayRun(newRun(save))),relaying=submit(input),awaiting=submit(relaying),at="2026-10-04T17:02:00.000Z";
 for(const stage of [input,relaying,awaiting])for(const run of [tickCoordinateRelayRun(stage,{seconds:600},at),abandonCoordinateRelayRun(stage,at)]){
  assert(normalizeCoordinateRelayRun(run));
  const loaded=normalizeSave(JSON.parse(JSON.stringify(withRun(save,run))));assert.deepEqual(loaded.storyContinuationState.chapter09.activeRun,run);
  const retry=retryCoordinateRelayRun(run,"2026-10-04T17:03:00.000Z");assert.equal(retry.phase,"RECEIVE_PACKET");
  assert.notEqual(retry.runId,run.runId);assert.deepEqual(retry.packet,run.packet);assert.equal(retry.readbackCompletedAt,null);
 }
 let run=input;for(let i=0;i<3;i++)run=submit(receiveCoordinatePacket(run),"GRID WRONG");
 assert.equal(run.phase,"FAILED");assert(normalizeCoordinateRelayRun(run));
});
test("late coordinate semantic replies preserve elapsed time and cannot revive timeout or a new attempt",async()=>{
 const requested=receiveCoordinatePacket(beginCoordinateRelayRun(newRun(accepted()))),message=coordinatePacketText(requested.packet),at="2026-10-04T17:02:00.000Z";
 const semantic=await interpretCoordinateRelayTraffic(requested,message),current=tickCoordinateRelayRun(requested,{seconds:9},at);
 assert.equal(submitCoordinateRelayResponse(current,requested,message,semantic,at).elapsedMilliseconds,9000);
 const timeout=tickCoordinateRelayRun(requested,{seconds:600},at);
 assert.strictEqual(submitCoordinateRelayResponse(timeout,requested,message,semantic,at),timeout);
 const retry=receiveCoordinatePacket(retryCoordinateRelayRun(timeout,"2026-10-04T17:03:00.000Z"));
 assert.strictEqual(submitCoordinateRelayResponse(retry,requested,message,semantic,at),retry);
});
