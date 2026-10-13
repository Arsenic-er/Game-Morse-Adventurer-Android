import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {createServer} from "vite";
import {readFileSync} from "node:fs";
import {claimMission} from "../src/game/missionSystem.js";
import {OPEN_STATION_GOALS} from "../src/game/openStationState.js";
import {CHAPTER_FIFTEEN_LANGUAGES,chapterFifteenStoryText} from "../src/screens/chapterFifteenStoryText.js";
import {chooseChapterFifteenGoal} from "../src/game/chapterFifteenStory.js";
import {accepted,unlocked,withQso,completed} from "./helpers/chapterFifteenFixtures.js";
test("chapter fifteen has seven localized five-beat stories and five distinct endings",()=>{
 const en=chapterFifteenStoryText("en");assert.equal(CHAPTER_FIFTEEN_LANGUAGES.length,7);
 for(const lang of CHAPTER_FIFTEEN_LANGUAGES){
  const t=chapterFifteenStoryText(lang);assert.deepEqual(Object.keys(t).sort(),Object.keys(en).sort());
  assert.deepEqual(t.beats.map(b=>b.id),["morning","blank","call","choose","log"]);
  assert(t.beats.every(b=>b.paragraphs.length===2&&b.paragraphs.every(Boolean)));
  assert.deepEqual(Object.keys(t.endings),OPEN_STATION_GOALS);assert.equal(new Set(Object.values(t.endings)).size,5);
  assert(t.reward.includes("2000")&&t.reward.includes("8"));assert.equal(t.beats[4].paragraphs[0],"{ending}");
  if(lang!=="en")assert.notEqual(t.beats[0].paragraphs[0],en.beats[0].paragraphs[0]);
 }assert.deepEqual(chapterFifteenStoryText("bad"),en);
});
test("chapter fifteen renders real contact choices and finale in seven languages with legacy fallback",async()=>{
 const vite=await createServer({appType:"custom",logLevel:"silent",optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,watch:null}});
 try{
  const {ChapterFifteenStoryScreen:Story}=await vite.ssrLoadModule("/src/screens/ChapterFifteenStoryScreen.jsx");
  const {HomeScreen}=await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
  const {MissionCenterModal:Mission}=await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
  const {QsoResultModal}=await vite.ssrLoadModule("/src/screens/QsoResultModal.jsx");
  const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
  const callbacks={onAdvance(){},onChooseGoal(){},onSeal(){},onEnterActivity(){},onClaim(){},onBack(){},onSettings(){}};
  const base=await accepted(),candidate=withQso(base);
  assert.match(render(HomeScreen,{language:"zh-CN",save:await unlocked(),onEnterChapterFifteen(){}}),/enter-chapter-fifteen-home/);
  assert.match(render(Mission,{language:"zh-CN",save:base,onLaunchChapterFifteen(){}}),/launch-chapter-fifteen/);
  assert.doesNotMatch(render(Mission,{language:"zh-CN",save:base,onLaunchChapterFifteen(){}}),/launch-first-page-qso/);
  assert.match(render(Mission,{language:"zh-CN",save:base}),/launch-first-page-qso/);
  for(const lang of CHAPTER_FIFTEEN_LANGUAGES){
   const opening=render(Story,{language:lang,save:base,...callbacks});
   assert.doesNotMatch(opening,/choose-first-page-goal|data-story-goal="world-log"/);
   const choice=render(Story,{language:lang,save:candidate,...callbacks});
   assert.equal((choice.match(/data-action="choose-first-page-goal"/g)??[]).length,5);
   assert.doesNotMatch(choice,/<input\b/);assert.match(choice,/SIM4US/);
   for(const goal of OPEN_STATION_GOALS){
    const selected=chooseChapterFifteenGoal(candidate,goal).save;
    assert.match(render(Story,{language:lang,save:selected,...callbacks}),new RegExp('data-story-goal="'+goal+'"'));
    const end=render(Story,{language:lang,save:await completed(candidate,goal),...callbacks});
    assert.match(end,/data-story-beat="log"/);assert.match(end,/data-story-qso-id="fifteenth-ordinary-qso"/);
    assert.doesNotMatch(end,/\{ending\}|\{peer\}|\{rst\}/);
   }
  }
  const claimed=claimMission(await completed(candidate),"story-15","2026-10-04T23:06:00.000Z").save;
  const home=render(HomeScreen,{language:"zh-CN",save:claimed,onEnterChapterFifteen(){}});
  assert.doesNotMatch(home,/enter-chapter-fifteen-home/);assert.match(home,/home-chapter-one-button home-open-station-button/);
 }finally{await vite.close();}
 const app=readFileSync(new URL("../src/App.jsx",import.meta.url),"utf8");
 assert.match(app,/onChooseGoal=\{chooseChapterFifteen\}/);assert.match(app,/chapter === 15 \? enterChapterFifteen/);
});
