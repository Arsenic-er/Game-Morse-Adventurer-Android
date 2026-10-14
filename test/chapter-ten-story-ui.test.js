import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {createServer} from "vite";
import {claimMission} from "../src/game/missionSystem.js";
import {advanceChapterTenPresentation} from "../src/game/chapterTenStory.js";
import {CHAPTER_TEN_LANGUAGES,chapterTenStoryText} from "../src/screens/chapterTenStoryText.js";
import {accepted,unlocked,completed,newRun,withRun} from "./helpers/chapterTenFixtures.js";
import {selectContestMode} from "../src/game/contestRun.js";
import {createSave} from "../src/game/saveStore.js";
test("chapter ten seven locales use five beats and real contest result fields",()=>{
 const en=chapterTenStoryText("en");assert.equal(CHAPTER_TEN_LANGUAGES.length,7);
 for(const language of CHAPTER_TEN_LANGUAGES){
  const t=chapterTenStoryText(language);assert.deepEqual(Object.keys(t).sort(),Object.keys(en).sort());
  assert.deepEqual(t.beats.map(beat=>beat.id),["clock","modes","exchange","result","log"]);
  assert(t.beats.every(beat=>beat.paragraphs.length===2&&beat.paragraphs.every(Boolean)));
  assert(t.reward.includes("1100")&&t.reward.includes("5"));assert(t.simulationWarning);
  for(const field of ["{contacts}","{regions}","{runCount}","{spCount}","{score}"])assert(t.beats[3].paragraphs[0].includes(field));
  if(language!=="en")assert.notEqual(t.beats[0].paragraphs[0],en.beats[0].paragraphs[0]);
 }assert.deepEqual(chapterTenStoryText("unknown"),en);
});
test("chapter ten routes, live result and activity controls render in seven languages",async()=>{
 const vite=await createServer({appType:"custom",logLevel:"silent",optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,watch:null}});
 try{
  const {ChapterTenStoryScreen:Story}=await vite.ssrLoadModule("/src/screens/ChapterTenStoryScreen.jsx");
  const {HomeScreen}=await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
  const {MissionCenterModal}=await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
  const {ContestScreen}=await vite.ssrLoadModule("/src/screens/ContestScreen.jsx");
  const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
  const notes=props=>renderToStaticMarkup(React.createElement(React.Fragment,null,Story(props).props.children));
  const callbacks={onAdvance(){},onEnterActivity(){},onClaim(){},onBack(){},onSettings(){},onEnterChapterTen(){}};
  assert.doesNotMatch(render(HomeScreen,{language:"zh-CN",save:createSave({callsign:"BH1TEST"}),...callbacks}),/enter-chapter-ten-home/);
  assert.match(render(HomeScreen,{language:"zh-CN",save:unlocked(),...callbacks}),/enter-chapter-ten-home/);
  assert.match(render(MissionCenterModal,{language:"zh-CN",save:accepted(),onLaunchChapterTen(){},onClose(){}}),/launch-chapter-ten/);
  let save=accepted();assert.doesNotMatch(render(Story,{language:"zh-CN",save,...callbacks}),/chapter-ten-real-log|10\/portrait.png/);
  save=advanceChapterTenPresentation(advanceChapterTenPresentation(save,"modes").save,"exchange").save;
  const actions=[],props={language:"zh-CN",save,...callbacks,onEnterActivity:()=>actions.push("contest")};
  Story({...props,inputBlocked:true}).props.onPrimary();assert.deepEqual(actions,[]);Story(props).props.onPrimary();assert.deepEqual(actions,["contest"]);
  save=await completed();const record=save.storyContinuationState.chapter10.records.at(-1);
  for(const language of CHAPTER_TEN_LANGUAGES){
   const beat=Story({language,save,...callbacks}).props.beat;assert(!beat.paragraphs.join("").includes("{"));assert(beat.paragraphs[0].includes(String(record.score)));
   const body=notes({language,save:advanceChapterTenPresentation(save,"log").save,...callbacks});
   for(const fact of [record.id,String(record.score),...record.contacts.map(c=>c.callsign)])assert(body.includes(fact));
   const activity=withRun(accepted(),selectContestMode(newRun(accepted()),"SP"));
   const screen=render(ContestScreen,{language,save:activity,onActivityRisk(){},onRunChange(){},onSettle(){},onBack(){},onSettings(){}});
   assert.match(screen,/contest-settings/);assert.match(screen,/contest-submit/);assert.doesNotMatch(screen,/<input\b/);
  }
  const legacy={...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}};
  assert.equal(Story({language:"zh-CN",save:legacy,...callbacks}).props.primaryLabel,chapterTenStoryText("zh-CN").back);
  const claimed=claimMission(save,"story-10").save,home=render(HomeScreen,{language:"zh-CN",save:claimed,...callbacks});
  assert.doesNotMatch(home,/enter-chapter-ten-home/);assert.match(home,/enter-contest-home/);
 }finally{await vite.close();}
});
