import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { claimMission } from "../src/game/missionSystem.js";
import { advanceChapterEightPresentation } from "../src/game/chapterEightStory.js";
import { CHAPTER_EIGHT_LANGUAGES, chapterEightStoryText } from "../src/screens/chapterEightStoryText.js";
import { accepted, unlocked, completed, newRun, withRun } from "./helpers/chapterEightFixtures.js";
import { beginServiceNetRun } from "../src/game/serviceNetRun.js";
import { createSave } from "../src/game/saveStore.js";
test("chapter eight has seven complete locales, five beats, simulation warning and correct reward",()=>{
 const en=chapterEightStoryText("en");assert.equal(CHAPTER_EIGHT_LANGUAGES.length,7);
 for(const language of CHAPTER_EIGHT_LANGUAGES){
  const t=chapterEightStoryText(language);
  assert.deepEqual(Object.keys(t).sort(),Object.keys(en).sort());
  assert.deepEqual(t.beats.map(beat=>beat.id),["briefing","queue","checkin","receipts","log"]);
  assert(t.beats.every(beat=>beat.paragraphs.length===2&&beat.paragraphs.every(Boolean)));
  assert(t.reward.includes("850")&&t.reward.includes("4"));assert(t.simulationWarning);
  assert(t.beats[2].paragraphs.join("").includes("{player}"));
  assert(t.beats[3].paragraphs.join("").includes("{messages}"));
  assert(!t.beats.flatMap(beat=>beat.paragraphs).some(line=>/599|21\.06/.test(line)));
  if(language!=="en")assert.notEqual(t.beats[0].paragraphs[0],en.beats[0].paragraphs[0]);
 }
 assert.deepEqual(chapterEightStoryText("unknown"),en);
});
test("chapter eight entry, receipts, legacy fallback, settings and activity render from real state",async()=>{
 const vite=await createServer({appType:"custom",logLevel:"silent",optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,watch:null}});
 try{
  const {ChapterEightStoryScreen:Story}=await vite.ssrLoadModule("/src/screens/ChapterEightStoryScreen.jsx");
  const {HomeScreen}=await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
  const {MissionCenterModal}=await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
  const {ServiceNetScreen}=await vite.ssrLoadModule("/src/screens/ServiceNetScreen.jsx");
  const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
  const notes=props=>renderToStaticMarkup(React.createElement(React.Fragment,null,Story(props).props.children));
  const callbacks={onAdvance(){},onEnterActivity(){},onClaim(){},onBack(){},onSettings(){},onEnterChapterEight(){}};
  assert.doesNotMatch(render(HomeScreen,{language:"zh-CN",save:createSave({callsign:"BH1TEST"}),...callbacks}),/enter-chapter-eight-home/);
  assert.match(render(HomeScreen,{language:"zh-CN",save:unlocked(),...callbacks}),/enter-chapter-eight-home/);
  assert.match(render(MissionCenterModal,{language:"zh-CN",save:accepted(),onLaunchChapterEight(){},onClose(){}}),/launch-chapter-eight/);
  let save=accepted();
  assert.doesNotMatch(render(Story,{language:"zh-CN",save,...callbacks}),/chapter-eight-real-log|08\/portrait.png/);
  save=advanceChapterEightPresentation(advanceChapterEightPresentation(save,"queue").save,"checkin").save;
  const actions=[],props={language:"zh-CN",save,...callbacks,onEnterActivity:()=>actions.push("net")};
  assert.match(notes(props),/离开确认框/);
  Story({...props,inputBlocked:true}).props.onPrimary();assert.deepEqual(actions,[]);
  Story(props).props.onPrimary();assert.deepEqual(actions,["net"]);
  save=completed();
  for(const language of CHAPTER_EIGHT_LANGUAGES){
   const ending=Story({language,save,...callbacks}).props.beat;
   for(const receipt of save.storyContinuationState.chapter08.receipts)assert(ending.paragraphs[0].includes("#"+receipt.messageId+" / PRI "+receipt.priority));
   assert(!ending.paragraphs.join("").includes("{"));
   const logSave=advanceChapterEightPresentation(save,"log").save,body=notes({language,save:logSave,...callbacks});
   assert.match(body,/SIM8PS/);assert.equal((body.match(/data-receipt-id=/g)||[]).length,3);
   const ui=render(ServiceNetScreen,{language,save:withRun(accepted(),beginServiceNetRun(newRun(accepted()))),onActivityRisk(){},onRunChange(){},onSettle(){},onBack(){},onSettings(){}});
   assert.doesNotMatch(ui,/AGN \/ QRS/);assert.match(ui,/service-net-settings/);assert(ui.includes(chapterEightStoryText(language).returnToStory));assert.match(ui,/fictional-public-service/);assert.doesNotMatch(ui,/<input\b/);
  }
  save=advanceChapterEightPresentation(save,"log").save;
  const legacy={...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}};
  assert.equal(Story({language:"zh-CN",save:legacy,...callbacks}).props.primaryLabel,chapterEightStoryText("zh-CN").back);
  const claimed=claimMission(save,"story-08").save,home=render(HomeScreen,{language:"zh-CN",save:claimed,...callbacks});
  assert.doesNotMatch(home,/enter-chapter-eight-home/);assert.match(home,/enter-service-net-home/);
 }finally{await vite.close();}
});
