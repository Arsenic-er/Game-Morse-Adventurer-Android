import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { claimMission } from "../src/game/missionSystem.js";
import { advanceChapterSixPresentation } from "../src/game/chapterSixStory.js";
import { CHAPTER_SIX_LANGUAGES, chapterSixStoryText } from "../src/screens/chapterSixStoryText.js";
import { accepted, unlocked, completed } from "./helpers/chapterSixFixtures.js";
test("chapter six has five localized beats and preserves resume and QSL conditions", () => {
  assert.equal(CHAPTER_SIX_LANGUAGES.length, 7);
  const en = chapterSixStoryText("en");
  for (const language of CHAPTER_SIX_LANGUAGES) {
    const t = chapterSixStoryText(language);
    assert.deepEqual(Object.keys(t).sort(), Object.keys(en).sort());
    assert.deepEqual(t.beats.map(beat => beat.id), ["pack","wire","call","answer","log"]);
    assert(t.beats.every(beat => beat.paragraphs.length === 2 && beat.paragraphs.every(Boolean)));
    assert(t.beats[3].paragraphs.join("").includes("{site}"));
    assert(t.beats[3].paragraphs.join("").includes("{peer}"));
    assert(t.complete.includes("QSL") && t.qsl.includes("QSL"));
    assert(t.resumeHint && t.fictional && t.reward.includes("650") && t.reward.includes("3"));
    assert(!t.beats.flatMap(beat => beat.paragraphs).some(line => /599|SUNWARD|510/.test(line)));
    if (language !== "en") assert.notEqual(t.beats[0].paragraphs[0], en.beats[0].paragraphs[0]);
  }
  assert.deepEqual(chapterSixStoryText("unknown"), en);
});
test("chapter six routes and ending use verified location and log instead of a fixed success scene", async () => {
  const vite = await createServer({ appType: "custom", logLevel: "silent", optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, watch: null } });
  try {
    const { ChapterSixStoryScreen: Story } = await vite.ssrLoadModule("/src/screens/ChapterSixStoryScreen.jsx");
    const { HomeScreen } = await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
    const { MissionCenterModal } = await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
    const render = (component,props) => renderToStaticMarkup(React.createElement(component,props));
    const notes = props => renderToStaticMarkup(React.createElement(React.Fragment,null,Story(props).props.children));
    const callbacks = { onAdvance() {}, onEnterActivity() {}, onClaim() {}, onBack() {}, onSettings() {}, onEnterChapterFive() {}, onEnterChapterSix() {} };
    const home = render(HomeScreen, { language: "zh-CN", save: unlocked(), ...callbacks });
    assert.match(home,/enter-chapter-six-home/);assert.doesNotMatch(home,/enter-chapter-five-home/);
    assert.match(render(MissionCenterModal,{ language:"zh-CN",save:accepted(),onLaunchChapterSix() {},onClose() {} }),/launch-chapter-six/);
    let save = accepted();
    assert.doesNotMatch(render(Story,{ language:"zh-CN",save,...callbacks }),/chapter-six-real-log|06\/portrait.png/);
    save = advanceChapterSixPresentation(advanceChapterSixPresentation(save,"wire").save,"call").save;
    const actions=[],props={ language:"zh-CN",save,...callbacks,onEnterActivity:()=>actions.push("field") };
    assert.match(notes(props),/进度都会保存/);
    Story({ ...props,inputBlocked:true }).props.onPrimary();assert.deepEqual(actions,[]);
    Story(props).props.onPrimary();assert.deepEqual(actions,["field"]);
    save = advanceChapterSixPresentation(completed(accepted(),{siteId:"lakeview-hill"}),"log").save;
    for (const language of CHAPTER_SIX_LANGUAGES) {
      const body=notes({language,save,...callbacks}),t=chapterSixStoryText(language);
      assert.match(body,/SIM6JP|579 \/ 559/);assert(body.includes(t.sites.expeditionSiteLakeview));assert.match(body,/LAKEVIEW/);
      assert(body.includes(renderToStaticMarkup(React.createElement("p",null,t.qsl))));assert.doesNotMatch(body,/SUNWARD|500|998/);
      assert(!Story({language,save,...callbacks}).props.beat.paragraphs.join("").includes("{"));
    }
    const legacy={...save,qsoRecords:{...save.qsoRecords,settledQsoIds:[]}};
    assert.equal(Story({language:"zh-CN",save:legacy,...callbacks}).props.primaryLabel,chapterSixStoryText("zh-CN").back);
    const claimed=claimMission(save,"story-06").save;
    assert.doesNotMatch(render(HomeScreen,{language:"zh-CN",save:claimed,...callbacks}),/enter-chapter-six-home/);
    const replay=render(MissionCenterModal,{language:"zh-CN",save:claimed,onLaunchChapterSix() {},onClose() {}});
    assert.match(replay,/launch-expedition-replay/);
  } finally { await vite.close(); }
});
