import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { claimMission } from "../src/game/missionSystem.js";
import { advanceChapterSevenPresentation } from "../src/game/chapterSevenStory.js";
import { CHAPTER_SEVEN_LANGUAGES, chapterSevenStoryText } from "../src/screens/chapterSevenStoryText.js";
import { QSL_TEXT } from "../src/screens/peopleAndQslText.js";
import { accepted, locked, unlocked, completed, newRun, withRun } from "./helpers/chapterSevenFixtures.js";
import { reviewQslAccounts, receiveQslClarification, submitQslClarification, qslStoryClarificationText } from "../src/game/qslStoryRun.js";
import { interpretQslStoryTraffic } from "../src/game/qslStoryTraffic.js";
test("chapter seven has seven complete locales, five beats and three distinct choice endings",()=>{
  const en=chapterSevenStoryText("en");
  assert.equal(CHAPTER_SEVEN_LANGUAGES.length,7);
  for(const language of CHAPTER_SEVEN_LANGUAGES){
    const t=chapterSevenStoryText(language);
    assert.deepEqual(Object.keys(t).sort(),Object.keys(en).sort());
    assert.deepEqual(t.beats.map(beat=>beat.id),["card","compare","call","answer","log"]);
    assert(t.beats.every(beat=>beat.paragraphs.length===2&&beat.paragraphs.every(Boolean)));
    assert.equal(new Set(Object.values(t.outcomes)).size,3);
    assert.deepEqual(Object.keys(t.outcomes).sort(),["believe","defer","request-review"]);
    assert(t.reward.includes("750")&&t.reward.includes("3"));
    assert(t.beats[0].paragraphs.join("").includes("{initial}"));
    assert(t.beats[3].paragraphs.join("").includes("{outcome}"));
    assert(!t.beats.flatMap(beat=>beat.paragraphs).some(line=>/599|21\.06/.test(line)));
    if(language!=="en")assert.notEqual(t.beats[0].paragraphs[0],en.beats[0].paragraphs[0]);
  }
  assert.deepEqual(chapterSevenStoryText("unknown"),en);
});
test("chapter seven entry, activity, choice endings and legacy fallback render without invented outcomes",async()=>{
  const vite=await createServer({appType:"custom",logLevel:"silent",optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,watch:null}});
  try{
    const {ChapterSevenStoryScreen:Story}=await vite.ssrLoadModule("/src/screens/ChapterSevenStoryScreen.jsx");
    const {HomeScreen}=await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
    const {MissionCenterModal}=await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
    const {QslStoryScreen}=await vite.ssrLoadModule("/src/screens/QslStoryScreen.jsx");
    const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
    const notes=props=>renderToStaticMarkup(React.createElement(React.Fragment,null,Story(props).props.children));
    const callbacks={onAdvance(){},onEnterActivity(){},onClaim(){},onBack(){},onSettings(){},onEnterChapterSix(){},onEnterChapterSeven(){}};
    assert.doesNotMatch(render(HomeScreen,{language:"zh-CN",save:locked(),...callbacks}),/enter-chapter-seven-home/);
    assert.match(render(HomeScreen,{language:"zh-CN",save:unlocked(),...callbacks}),/enter-chapter-seven-home/);
    assert.match(render(MissionCenterModal,{language:"zh-CN",save:accepted(),onLaunchChapterSeven(){},onClose(){}}),/launch-chapter-seven/);
    let save=accepted();
    assert.doesNotMatch(render(Story,{language:"zh-CN",save,...callbacks}),/chapter-seven-real-log|07\/portrait.png/);
    save=advanceChapterSevenPresentation(advanceChapterSevenPresentation(save,"compare").save,"call").save;
    const actions=[],props={language:"zh-CN",save,...callbacks,onEnterActivity:()=>actions.push("case")};
    assert.match(notes(props),/原卡片的最初判断不会被结尾改写/);
    Story({...props,inputBlocked:true}).props.onPrimary();assert.deepEqual(actions,[]);
    Story(props).props.onPrimary();assert.deepEqual(actions,["case"]);
    for(const choice of ["believe","request-review","defer"]){
      save=completed(accepted("request-review"),{choice});
      for(const language of CHAPTER_SEVEN_LANGUAGES){
        const t=chapterSevenStoryText(language),ending=Story({language,save,...callbacks}).props.beat;
        assert(ending.paragraphs[0].includes(t.choices[choice]));
        assert(ending.paragraphs[1].includes(t.choices["request-review"]));
        assert(!ending.paragraphs.join("").includes("{"));
        const logSave=advanceChapterSevenPresentation(save,"log").save;
        const body=notes({language,save:logSave,...callbacks});
        assert.match(body,/SIM6JP/);assert(body.includes(save.qslRecords.at(-1).id));
        assert(body.includes(renderToStaticMarkup(React.createElement("dd",null,t.choices[choice]))));
      }
    }
    save=advanceChapterSevenPresentation(completed(),"log").save;
    const legacy={...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}};
    assert.equal(Story({language:"zh-CN",save:legacy,...callbacks}).props.primaryLabel,chapterSevenStoryText("zh-CN").back);
    const claimed=claimMission(save,"story-07").save;
    const home=render(HomeScreen,{language:"zh-CN",save:claimed,...callbacks});
    assert.doesNotMatch(home,/enter-chapter-seven-home/);assert.match(home,/enter-qsl-story-home/);
    const normal=accepted(),run=reviewQslAccounts(newRun(normal)),at="2026-10-04T15:02:00.000Z";
    const reply=receiveQslClarification(submitQslClarification(run,qslStoryClarificationText(run),await interpretQslStoryTraffic(run,qslStoryClarificationText(run)),at),at);
    const ui=render(QslStoryScreen,{language:"zh-CN",save:withRun(normal,reply),onActivityRisk(){},onRunChange(){},onSettle(){},onBack(){},onSettings(){}});
    assert(ui.includes(QSL_TEXT["zh-CN"]["qsl.player.hill-signal"]));
    assert(ui.includes(QSL_TEXT["zh-CN"]["qsl.operator.sora-hill-reply"]));
    assert.match(ui,/qsl-story-recovery-qrs/);assert.match(ui,/qsl-story-recovery-agn/);assert.match(ui,/qsl-story-settings/);
    assert.match(ui,/data-action="qsl-story-submit"/);assert.doesNotMatch(ui,/<input\b/);
  }finally{await vite.close();}
});
