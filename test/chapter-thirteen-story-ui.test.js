import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {createServer} from "vite";
import {claimMission} from "../src/game/missionSystem.js";
import {advanceChapterThirteenPresentation} from "../src/game/chapterThirteenStory.js";
import {CHAPTER_THIRTEEN_LANGUAGES,chapterThirteenStoryText} from "../src/screens/chapterThirteenStoryText.js";
import {accepted,unlocked,completed,newRun,withRun} from "./helpers/chapterThirteenFixtures.js";
import {createSave} from "../src/game/saveStore.js";
test("chapter thirteen seven locales use five beats with actual saved callsigns and bands",()=>{
 const en=chapterThirteenStoryText("en");assert.equal(CHAPTER_THIRTEEN_LANGUAGES.length,7);
 for(const language of CHAPTER_THIRTEEN_LANGUAGES){
  const t=chapterThirteenStoryText(language);assert.deepEqual(Object.keys(t).sort(),Object.keys(en).sort());
  assert.deepEqual(t.beats.map(beat=>beat.id),["late","schedule","watch","contacts","log"]);
  assert(t.beats.every(beat=>beat.paragraphs.length===2&&beat.paragraphs.every(Boolean)));
  assert(t.reward.includes("1500")&&t.reward.includes("6"));assert(t.simulationWarning);
  assert(t.beats[3].paragraphs[0].includes("{contacts}"));
  assert(!t.beats.flatMap(b=>b.paragraphs).some(p=>/SIM11LS\s*[:：]/.test(p)));
  if(language!=="en")assert.notEqual(t.beats[0].paragraphs[0],en.beats[0].paragraphs[0]);
 }assert.deepEqual(chapterThirteenStoryText("unknown"),en);
});
test("chapter thirteen routes, saved contact facts and keyer controls render in seven languages",async()=>{
 const vite=await createServer({appType:"custom",logLevel:"silent",optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,watch:null}});
 try{
  const {ChapterThirteenStoryScreen:Story}=await vite.ssrLoadModule("/src/screens/ChapterThirteenStoryScreen.jsx");
  const {HomeScreen}=await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
  const {MissionCenterModal}=await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
  const {NightOperationsScreen}=await vite.ssrLoadModule("/src/screens/NightOperationsScreen.jsx");
  const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
  const notes=props=>renderToStaticMarkup(React.createElement(React.Fragment,null,Story(props).props.children));
  const callbacks={onAdvance(){},onEnterActivity(){},onClaim(){},onBack(){},onSettings(){},onEnterChapterThirteen(){}};
  assert.doesNotMatch(render(HomeScreen,{language:"zh-CN",save:createSave({callsign:"BH1TEST"}),...callbacks}),/enter-chapter-thirteen-home/);
  assert.match(render(HomeScreen,{language:"zh-CN",save:await unlocked(),...callbacks}),/enter-chapter-thirteen-home/);
  const base=await accepted();
  assert.match(render(MissionCenterModal,{language:"zh-CN",save:base,onLaunchChapterThirteen(){},onClose(){}}),/launch-chapter-thirteen/);
  let save=base;assert.doesNotMatch(render(Story,{language:"zh-CN",save,...callbacks}),/chapter-thirteen-real-log|11\/portrait.png/);
  save=advanceChapterThirteenPresentation(advanceChapterThirteenPresentation(save,"schedule").save,"watch").save;
  const actions=[],props={language:"zh-CN",save,...callbacks,onEnterActivity:()=>actions.push("night-operations")};
  Story({...props,inputBlocked:true}).props.onPrimary();assert.deepEqual(actions,[]);Story(props).props.onPrimary();assert.deepEqual(actions,["night-operations"]);
  save=await completed(base);const record=save.storyContinuationState.chapter13.archive.at(-1);
  for(const language of CHAPTER_THIRTEEN_LANGUAGES){
   const beat=Story({language,save,...callbacks}).props.beat;assert(!beat.paragraphs.join("").includes("{"));for(const contact of record.contacts)assert(beat.paragraphs[0].includes(contact.callsign+" / "+contact.band));
   const body=notes({language,save:advanceChapterThirteenPresentation(save,"log").save,...callbacks});
   for(const fact of [record.id,...record.contacts.flatMap(c=>[c.callsign,c.band])])assert(body.includes(fact));
   const activity=withRun(base,newRun(base));
   const screen=render(NightOperationsScreen,{language,save:activity,onActivityRisk(){},onRunChange(){},onSettle(){},onBack(){},onSettings(){}});
   assert.match(screen,/night-settings/);assert.match(screen,/data-night-phase="BOARD"/);assert.doesNotMatch(screen,/<input\b/);assert.doesNotMatch(screen,/night-submit/);
  }
  const claimed=claimMission(save,"story-13").save,home=render(HomeScreen,{language:"zh-CN",save:claimed,...callbacks});
  assert.doesNotMatch(home,/enter-chapter-thirteen-home/);assert.match(home,/enter-night-operations-home/);
 }finally{await vite.close();}
});
