import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {createServer} from "vite";
import {claimMission} from "../src/game/missionSystem.js";
import {advanceChapterElevenPresentation} from "../src/game/chapterElevenStory.js";
import {CHAPTER_ELEVEN_LANGUAGES,chapterElevenStoryText} from "../src/screens/chapterElevenStoryText.js";
import {accepted,unlocked,completed,observed,withRun} from "./helpers/chapterElevenFixtures.js";
import {createSave} from "../src/game/saveStore.js";
test("chapter eleven seven locales use five beats without inventing a reply",()=>{
 const en=chapterElevenStoryText("en");assert.equal(CHAPTER_ELEVEN_LANGUAGES.length,7);
 for(const language of CHAPTER_ELEVEN_LANGUAGES){
  const t=chapterElevenStoryText(language);assert.deepEqual(Object.keys(t).sort(),Object.keys(en).sort());
  assert.deepEqual(t.beats.map(beat=>beat.id),["quiet","windows","call","silence","log"]);
  assert(t.beats.every(beat=>beat.paragraphs.length===2&&beat.paragraphs.every(Boolean)));
  assert(t.reward.includes("1200")&&t.reward.includes("5"));assert(t.simulationWarning);
  for(const field of ["{calls}","{seconds}"])assert(t.beats[3].paragraphs[0].includes(field));
  assert(!t.beats.flatMap(b=>b.paragraphs).some(p=>/SIM11LS\s*[:：]/.test(p)));
  if(language!=="en")assert.notEqual(t.beats[0].paragraphs[0],en.beats[0].paragraphs[0]);
 }assert.deepEqual(chapterElevenStoryText("unknown"),en);
});
test("chapter eleven routes, saved monitoring facts and keyer controls render in seven languages",async()=>{
 const vite=await createServer({appType:"custom",logLevel:"silent",optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,watch:null}});
 try{
  const {ChapterElevenStoryScreen:Story}=await vite.ssrLoadModule("/src/screens/ChapterElevenStoryScreen.jsx");
  const {HomeScreen}=await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
  const {MissionCenterModal}=await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
  const {ListeningScreen}=await vite.ssrLoadModule("/src/screens/ListeningScreen.jsx");
  const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
  const notes=props=>renderToStaticMarkup(React.createElement(React.Fragment,null,Story(props).props.children));
  const callbacks={onAdvance(){},onEnterActivity(){},onClaim(){},onBack(){},onSettings(){},onEnterChapterEleven(){}};
  assert.doesNotMatch(render(HomeScreen,{language:"zh-CN",save:createSave({callsign:"BH1TEST"}),...callbacks}),/enter-chapter-eleven-home/);
  assert.match(render(HomeScreen,{language:"zh-CN",save:await unlocked(),...callbacks}),/enter-chapter-eleven-home/);
  const base=await accepted();
  assert.match(render(MissionCenterModal,{language:"zh-CN",save:base,onLaunchChapterEleven(){},onClose(){}}),/launch-chapter-eleven/);
  let save=base;assert.doesNotMatch(render(Story,{language:"zh-CN",save,...callbacks}),/chapter-eleven-real-log|11\/portrait.png/);
  save=advanceChapterElevenPresentation(advanceChapterElevenPresentation(save,"windows").save,"call").save;
  const actions=[],props={language:"zh-CN",save,...callbacks,onEnterActivity:()=>actions.push("listening")};
  Story({...props,inputBlocked:true}).props.onPrimary();assert.deepEqual(actions,[]);Story(props).props.onPrimary();assert.deepEqual(actions,["listening"]);
  save=await completed(base,{calls:2});const record=save.storyContinuationState.chapter11.archive.at(-1);
  for(const language of CHAPTER_ELEVEN_LANGUAGES){
   const beat=Story({language,save,...callbacks}).props.beat;assert(!beat.paragraphs.join("").includes("{"));assert(beat.paragraphs[0].includes(String(record.callCount)));
   const body=notes({language,save:advanceChapterElevenPresentation(save,"log").save,...callbacks});
   for(const fact of [record.id,record.targetCallsign,chapterElevenStoryText(language).conclusion])assert(body.includes(fact));
   assert.doesNotMatch(body,/data-story-qso-id|RST 599/);
   const activity=withRun(base,observed(base));
   const screen=render(ListeningScreen,{language,save:activity,onActivityRisk(){},onRunChange(){},onSettle(){},onBack(){},onSettings(){}});
   assert.match(screen,/listening-settings/);assert.match(screen,/listening-submit/);assert.doesNotMatch(screen,/<input\b/);
  }
  const claimed=claimMission(save,"story-11").save,home=render(HomeScreen,{language:"zh-CN",save:claimed,...callbacks});
  assert.doesNotMatch(home,/enter-chapter-eleven-home/);assert.match(home,/enter-listening-home/);
 }finally{await vite.close();}
});
