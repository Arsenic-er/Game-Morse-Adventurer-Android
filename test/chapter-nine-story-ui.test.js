import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {createServer} from "vite";
import {claimMission} from "../src/game/missionSystem.js";
import {advanceChapterNinePresentation} from "../src/game/chapterNineStory.js";
import {CHAPTER_NINE_LANGUAGES,chapterNineStoryText} from "../src/screens/chapterNineStoryText.js";
import {accepted,unlocked,completed,newRun,withRun} from "./helpers/chapterNineFixtures.js";
import {beginCoordinateRelayRun,receiveCoordinatePacket} from "../src/game/coordinateRelayRun.js";
import {createSave} from "../src/game/saveStore.js";
test("chapter nine has seven complete locales, five beats and evidence-driven packet fields",()=>{
 const en=chapterNineStoryText("en");assert.equal(CHAPTER_NINE_LANGUAGES.length,7);
 for(const language of CHAPTER_NINE_LANGUAGES){
  const t=chapterNineStoryText(language);assert.deepEqual(Object.keys(t).sort(),Object.keys(en).sort());
  assert.deepEqual(t.beats.map(beat=>beat.id),["sheet","fields","readback","confirmed","log"]);
  assert(t.beats.every(beat=>beat.paragraphs.length===2&&beat.paragraphs.every(Boolean)));
  assert(t.reward.includes("950")&&t.reward.includes("4"));assert(t.simulationWarning);
  for(const field of ["{source}","{peer}","{grid}","{packetId}","{check}"])assert(t.beats[3].paragraphs[0].includes(field));
  assert(!t.beats.flatMap(beat=>beat.paragraphs).some(line=>/599|21\.06/.test(line)));
  if(language!=="en")assert.notEqual(t.beats[0].paragraphs[0],en.beats[0].paragraphs[0]);
 }
 assert.deepEqual(chapterNineStoryText("unknown"),en);
});
test("chapter nine entries, real packet log, legacy fallback and activity render without fabricated fields",async()=>{
 const vite=await createServer({appType:"custom",logLevel:"silent",optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,watch:null}});
 try{
  const {ChapterNineStoryScreen:Story}=await vite.ssrLoadModule("/src/screens/ChapterNineStoryScreen.jsx");
  const {HomeScreen}=await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
  const {MissionCenterModal}=await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
  const {CoordinateRelayScreen}=await vite.ssrLoadModule("/src/screens/CoordinateRelayScreen.jsx");
  const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
  const notes=props=>renderToStaticMarkup(React.createElement(React.Fragment,null,Story(props).props.children));
  const callbacks={onAdvance(){},onEnterActivity(){},onClaim(){},onBack(){},onSettings(){},onEnterChapterNine(){}};
  assert.doesNotMatch(render(HomeScreen,{language:"zh-CN",save:createSave({callsign:"BH1TEST"}),...callbacks}),/enter-chapter-nine-home/);
  assert.match(render(HomeScreen,{language:"zh-CN",save:unlocked(),...callbacks}),/enter-chapter-nine-home/);
  assert.match(render(MissionCenterModal,{language:"zh-CN",save:accepted(),onLaunchChapterNine(){},onClose(){}}),/launch-chapter-nine/);
  let save=accepted();assert.doesNotMatch(render(Story,{language:"zh-CN",save,...callbacks}),/chapter-nine-real-log|09\/portrait.png/);
  save=advanceChapterNinePresentation(advanceChapterNinePresentation(save,"fields").save,"readback").save;
  const actions=[],props={language:"zh-CN",save,...callbacks,onEnterActivity:()=>actions.push("relay")};
  assert.match(notes(props),/重新核对/);
  Story({...props,inputBlocked:true}).props.onPrimary();assert.deepEqual(actions,[]);
  Story(props).props.onPrimary();assert.deepEqual(actions,["relay"]);
  save=completed();
  for(const language of CHAPTER_NINE_LANGUAGES){
   const ending=Story({language,save,...callbacks}).props.beat,record=save.storyContinuationState.chapter09.packets.at(-1),packet=record.packet;
   assert(ending.paragraphs[0].includes(packet.grid)&&ending.paragraphs[0].includes(packet.packetId));
   assert(ending.paragraphs[0].includes("SIM9CR")&&ending.paragraphs[0].includes("SIM9RL"));
   assert(ending.paragraphs[0].includes(String(packet.check).padStart(2,"0")));assert(!ending.paragraphs.join("").includes("{"));
   const logSave=advanceChapterNinePresentation(save,"log").save,body=notes({language,save:logSave,...callbacks});
   for(const fact of ["SIM9CR","SIM9RL",packet.grid,packet.utc,packet.packetId,record.id])assert(body.includes(fact));
   const activity=withRun(accepted(),receiveCoordinatePacket(beginCoordinateRelayRun(newRun(accepted()))));
   const ui=render(CoordinateRelayScreen,{language,save:activity,onActivityRisk(){},onRunChange(){},onSettle(){},onBack(){},onSettings(){}});
   assert.match(ui,/coordinate-settings/);assert(ui.includes(chapterNineStoryText(language).returnToStory));
   assert.match(ui,/fictional-pixel-grid/);assert.match(ui,/coordinate-submit/);assert.doesNotMatch(ui,/<input\b/);
  }
  save=advanceChapterNinePresentation(save,"log").save;
  const legacy={...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}};
  assert.equal(Story({language:"zh-CN",save:legacy,...callbacks}).props.primaryLabel,chapterNineStoryText("zh-CN").back);
  const claimed=claimMission(save,"story-09").save,home=render(HomeScreen,{language:"zh-CN",save:claimed,...callbacks});
  assert.doesNotMatch(home,/enter-chapter-nine-home/);assert.match(home,/enter-coordinate-relay-home/);assert.match(home,/open-structured-messages/);
 }finally{await vite.close();}
});
