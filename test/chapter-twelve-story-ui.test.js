import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {createServer} from "vite";
import {claimMission} from "../src/game/missionSystem.js";
import {advanceChapterTwelvePresentation} from "../src/game/chapterTwelveStory.js";
import {CHAPTER_TWELVE_LANGUAGES,chapterTwelveStoryText} from "../src/screens/chapterTwelveStoryText.js";
import {accepted,unlocked,completed,newRun,withRun} from "./helpers/chapterTwelveFixtures.js";
import {createSave} from "../src/game/saveStore.js";
test("chapter twelve seven locales use five beats without claiming supply delivery",()=>{
 const en=chapterTwelveStoryText("en");assert.equal(CHAPTER_TWELVE_LANGUAGES.length,7);
 for(const language of CHAPTER_TWELVE_LANGUAGES){
  const t=chapterTwelveStoryText(language);assert.deepEqual(Object.keys(t).sort(),Object.keys(en).sort());
  assert.deepEqual(t.beats.map(beat=>beat.id),["rain","copies","verify","relayed","log"]);
  assert(t.beats.every(beat=>beat.paragraphs.length===2&&beat.paragraphs.every(Boolean)));
  assert(t.reward.includes("1350")&&t.reward.includes("6"));assert(t.simulationWarning);
  for(const field of ["{revision}","{people}","{quantity}","{check}"])assert(t.beats[3].paragraphs[0].includes(field));
  assert(!t.beats.flatMap(b=>b.paragraphs).some(p=>/SIM11LS\s*[:：]/.test(p)));
  if(language!=="en")assert.notEqual(t.beats[0].paragraphs[0],en.beats[0].paragraphs[0]);
 }assert.deepEqual(chapterTwelveStoryText("unknown"),en);
});
test("chapter twelve routes, saved packet facts and keyer controls render in seven languages",async()=>{
 const vite=await createServer({appType:"custom",logLevel:"silent",optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,watch:null}});
 try{
  const {ChapterTwelveStoryScreen:Story}=await vite.ssrLoadModule("/src/screens/ChapterTwelveStoryScreen.jsx");
  const {HomeScreen}=await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
  const {MissionCenterModal}=await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
  const {StormRelayScreen}=await vite.ssrLoadModule("/src/screens/StormRelayScreen.jsx");
  const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
  const notes=props=>renderToStaticMarkup(React.createElement(React.Fragment,null,Story(props).props.children));
  const callbacks={onAdvance(){},onEnterActivity(){},onClaim(){},onBack(){},onSettings(){},onEnterChapterTwelve(){}};
  assert.doesNotMatch(render(HomeScreen,{language:"zh-CN",save:createSave({callsign:"BH1TEST"}),...callbacks}),/enter-chapter-twelve-home/);
  assert.match(render(HomeScreen,{language:"zh-CN",save:await unlocked(),...callbacks}),/enter-chapter-twelve-home/);
  const base=await accepted();
  assert.match(render(MissionCenterModal,{language:"zh-CN",save:base,onLaunchChapterTwelve(){},onClose(){}}),/launch-chapter-twelve/);
  let save=base;assert.doesNotMatch(render(Story,{language:"zh-CN",save,...callbacks}),/chapter-twelve-real-log|11\/portrait.png/);
  save=advanceChapterTwelvePresentation(advanceChapterTwelvePresentation(save,"copies").save,"verify").save;
  const actions=[],props={language:"zh-CN",save,...callbacks,onEnterActivity:()=>actions.push("storm-relay")};
  Story({...props,inputBlocked:true}).props.onPrimary();assert.deepEqual(actions,[]);Story(props).props.onPrimary();assert.deepEqual(actions,["storm-relay"]);
  save=await completed(base);const record=save.storyContinuationState.chapter12.archive.at(-1);
  for(const language of CHAPTER_TWELVE_LANGUAGES){
   const beat=Story({language,save,...callbacks}).props.beat;assert(!beat.paragraphs.join("").includes("{"));assert(beat.paragraphs[0].includes(String(record.revision)));
   const body=notes({language,save:advanceChapterTwelvePresentation(save,"log").save,...callbacks});
   for(const fact of [record.id,record.grid,record.item,record.check])assert(body.includes(fact));
   assert(body.includes("SIM12CS")&&body.includes("SIM12RL"));
   const activity=withRun(base,newRun(base));
   const screen=render(StormRelayScreen,{language,save:activity,onActivityRisk(){},onRunChange(){},onSettle(){},onBack(){},onSettings(){}});
   assert.match(screen,/storm-settings/);assert.match(screen,/storm-submit/);assert.doesNotMatch(screen,/<input\b/);assert.doesNotMatch(screen,/data-packet-id=/);
  }
  const claimed=claimMission(save,"story-12").save,home=render(HomeScreen,{language:"zh-CN",save:claimed,...callbacks});
  assert.doesNotMatch(home,/enter-chapter-twelve-home/);assert.match(home,/enter-storm-relay-home/);
 }finally{await vite.close();}
});
