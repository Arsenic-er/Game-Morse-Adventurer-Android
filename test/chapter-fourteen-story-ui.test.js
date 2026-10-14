import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {createServer} from "vite";
import {claimMission} from "../src/game/missionSystem.js";
import {advanceChapterFourteenPresentation} from "../src/game/chapterFourteenStory.js";
import {CHAPTER_FOURTEEN_LANGUAGES,chapterFourteenStoryText} from "../src/screens/chapterFourteenStoryText.js";
import {FINAL_PROMISE_TEXT} from "../src/screens/finalPromiseText.js";
import {finalPromiseRecordedMessage} from "../src/game/finalPromiseTraffic.js";
import {accepted,unlocked,completed,newRun,withRun} from "./helpers/chapterFourteenFixtures.js";
import {createSave} from "../src/game/saveStore.js";
test("chapter fourteen seven locales use five beats and three distinct fact-bound endings",()=>{
 const en=chapterFourteenStoryText("en");assert.equal(CHAPTER_FOURTEEN_LANGUAGES.length,7);
 for(const language of CHAPTER_FOURTEEN_LANGUAGES){
  const t=chapterFourteenStoryText(language);assert.deepEqual(Object.keys(t).sort(),Object.keys(en).sort());
  assert.deepEqual(t.beats.map(beat=>beat.id),["page","review","call","reply","log"]);
  assert(t.beats.every(beat=>beat.paragraphs.length===2&&beat.paragraphs.every(Boolean)));
  assert(t.reward.includes("1700")&&t.reward.includes("7"));assert(t.simulationWarning);
  assert.equal(t.beats[3].paragraphs[0],"{ending}");assert(t.beats[3].paragraphs[1].includes("{message}"));
  assert.deepEqual(Object.keys(t.endings),["brief","steady","warm"]);assert.equal(new Set(Object.values(t.endings)).size,3);
  if(language!=="en"){
   assert.notEqual(t.beats[0].paragraphs[0],en.beats[0].paragraphs[0]);
   for(const [key,value] of Object.entries(FINAL_PROMISE_TEXT[language]))if(key.startsWith("chapter14."))assert.notEqual(value,FINAL_PROMISE_TEXT.en[key],language+" "+key);
  }
 }assert.deepEqual(chapterFourteenStoryText("unknown"),en);
});
test("chapter fourteen routes, three ending messages and physical keyer render in seven languages",async()=>{
 const vite=await createServer({appType:"custom",logLevel:"silent",optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,watch:null}});
 try{
  const {ChapterFourteenStoryScreen:Story}=await vite.ssrLoadModule("/src/screens/ChapterFourteenStoryScreen.jsx");
  const {HomeScreen}=await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
  const {MissionCenterModal}=await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
  const {FinalPromiseScreen}=await vite.ssrLoadModule("/src/screens/FinalPromiseScreen.jsx");
  const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
  const notes=props=>renderToStaticMarkup(React.createElement(React.Fragment,null,Story(props).props.children));
  const callbacks={onAdvance(){},onEnterActivity(){},onClaim(){},onBack(){},onSettings(){},onEnterChapterFourteen(){}};
  assert.doesNotMatch(render(HomeScreen,{language:"zh-CN",save:createSave({callsign:"BH1TEST"}),...callbacks}),/enter-chapter-fourteen-home/);
  assert.match(render(HomeScreen,{language:"zh-CN",save:await unlocked(),...callbacks}),/enter-chapter-fourteen-home/);
  const base=await accepted();assert.match(render(MissionCenterModal,{language:"zh-CN",save:base,onLaunchChapterFourteen(){},onClose(){}}),/launch-chapter-fourteen/);
  let save=base;assert.doesNotMatch(render(Story,{language:"zh-CN",save,...callbacks}),/chapter-fourteen-real-log|14\/portrait.png/);
  save=advanceChapterFourteenPresentation(advanceChapterFourteenPresentation(save,"review").save,"call").save;
  const actions=[],props={language:"zh-CN",save,...callbacks,onEnterActivity:()=>actions.push("final-promise")};
  Story({...props,inputBlocked:true}).props.onPrimary();assert.deepEqual(actions,[]);Story(props).props.onPrimary();assert.deepEqual(actions,["final-promise"]);
  for(const tone of ["brief","steady","warm"]){
   save=await completed(base,{tone});const record=save.storyContinuationState.chapter14.archive.at(-1);
   for(const language of CHAPTER_FOURTEEN_LANGUAGES){
    const beat=Story({language,save,...callbacks}).props.beat;
    assert(!beat.paragraphs.join("").includes("{"));assert.equal(beat.paragraphs[0],chapterFourteenStoryText(language).endings[tone]);assert(beat.paragraphs[1].includes(finalPromiseRecordedMessage(record)));
    const body=notes({language,save:advanceChapterFourteenPresentation(save,"log").save,...callbacks});
    for(const fact of [record.id,record.targetCallsign,finalPromiseRecordedMessage(record)])assert(body.includes(fact));
    const activity=withRun(base,newRun(base));
    const screen=render(FinalPromiseScreen,{language,save:activity,onActivityRisk(){},onRunChange(){},onSettle(){},onBack(){},onSettings(){}});
    assert.match(screen,/final-promise-settings/);assert.match(screen,/data-final-promise-phase="REVIEW"/);assert.doesNotMatch(screen,/<input\b/);assert.doesNotMatch(screen,/final-promise-submit|final-promise-account/);
   }
  }
  const claimed=claimMission(save,"story-14").save,home=render(HomeScreen,{language:"zh-CN",save:claimed,...callbacks});
  assert.doesNotMatch(home,/enter-chapter-fourteen-home/);assert.match(home,/enter-final-promise-home/);
 }finally{await vite.close();}
});
