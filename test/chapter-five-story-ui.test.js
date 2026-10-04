import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createSave } from "../src/game/saveStore.js";
import { claimMission } from "../src/game/missionSystem.js";
import { advanceChapterFivePresentation } from "../src/game/chapterFiveStory.js";
import { CHAPTER_FIVE_LANGUAGES, chapterFiveStoryText } from "../src/screens/chapterFiveStoryText.js";
import { accepted, unlocked, completed } from "./helpers/chapterFiveFixtures.js";

test("chapter five localizes five beats, exact completion requirements and non-resumable event warning", () => {
  assert.equal(CHAPTER_FIVE_LANGUAGES.length, 7);
  const en = chapterFiveStoryText("en");
  for (const language of CHAPTER_FIVE_LANGUAGES) {
    const t = chapterFiveStoryText(language);
    assert.deepEqual(Object.keys(t).sort(), Object.keys(en).sort());
    assert.deepEqual(t.beats.map(beat => beat.id), ["notice", "desk", "call", "answer", "log"]);
    assert(t.beats.every(beat => beat.paragraphs.length === 2 && beat.paragraphs.every(Boolean)));
    assert(t.resumeHint && t.reward && t.continueStory);
    assert(t.beats[2].paragraphs.join("").includes("{player}"));
    for (const key of ["{count}", "{regions}", "{grade}"]) assert(t.beats[3].paragraphs.join("").includes(key));
    assert.deepEqual(Object.keys(t.grades), ["base", "silver", "gold"]);
    assert(!t.beats.flatMap(beat => beat.paragraphs).some(line => /599|六个|six directions/.test(line)));
    if (language !== "en") assert.notEqual(t.beats[0].paragraphs[0], en.beats[0].paragraphs[0]);
  }
  assert.deepEqual(chapterFiveStoryText("unknown"), en);
});

test("chapter five UI shows only its actual settled activity records and uses guarded primary actions", async () => {
  const vite = await createServer({ appType: "custom", logLevel: "silent", optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, watch: null } });
  try {
    const { ChapterFiveStoryScreen: Story } = await vite.ssrLoadModule("/src/screens/ChapterFiveStoryScreen.jsx");
    const { HomeScreen } = await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
    const { MissionCenterModal } = await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
    const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
    const notes = props => renderToStaticMarkup(React.createElement(React.Fragment, null, Story(props).props.children));
    const callbacks = { onAdvance() {}, onEnterActivity() {}, onClaim() {}, onBack() {}, onSettings() {}, onEnterChapterFour() {}, onEnterChapterFive() {} };
    assert.doesNotMatch(render(HomeScreen, { language: "zh-CN", save: createSave({ callsign: "BH1TEST" }), ...callbacks }), /enter-chapter-five-home/);
    const home = render(HomeScreen, { language: "zh-CN", save: unlocked(), ...callbacks });
    assert.match(home, /enter-chapter-five-home/); assert.doesNotMatch(home, /enter-chapter-four-home/);
    let save = accepted();
    const missions = render(MissionCenterModal, { language: "zh-CN", save, onLaunchChapterFive() {}, onClose() {} });
    assert.match(missions, /launch-chapter-five/); assert.doesNotMatch(missions, /launch-lights-story/);
    const opening = render(Story, { language: "zh-CN", save, ...callbacks });
    assert.match(opening, /data-story-beat="notice"/);
    assert.doesNotMatch(opening, /chapter-five-real-logs|05\/portrait.png/);
    save = advanceChapterFivePresentation(save, "desk").save;
    save = advanceChapterFivePresentation(save, "call").save;
    const actions = [], props = { language: "zh-CN", save, ...callbacks, onEnterActivity: () => actions.push("event") };
    assert(Story(props).props.beat.paragraphs.join("").includes("BH1TEST"));
    assert.match(notes(props), /未结算/);
    Story({ ...props, inputBlocked: true }).props.onPrimary(); assert.deepEqual(actions, []);
    Story(props).props.onPrimary(); assert.deepEqual(actions, ["event"]);
    save = advanceChapterFivePresentation(completed(accepted(), { count: 3 }), "log").save;
    for (const language of CHAPTER_FIVE_LANGUAGES) {
      const body = notes({ language, save, ...callbacks });
      assert.equal((body.match(/data-qso-id=/g) ?? []).length, 3);
      assert.match(body, /579 \/ 599/);
      assert(body.includes(chapterFiveStoryText(language).grades.base));
      assert.doesNotMatch(body, /fourth-weather-qso|third-qso|MY WX/);
      const answer = Story({ language, save, ...callbacks }).props;
      assert.match(answer.context, /3/); assert(!answer.context.includes("{"));
    }
    const legacy = { ...save, qsoLogs: [] };
    assert.equal(Story({ language: "zh-CN", save: legacy, ...callbacks }).props.primaryLabel, chapterFiveStoryText("zh-CN").back);
    assert.match(notes({ language: "zh-CN", save: legacy, ...callbacks }), /核验记录不完整/);
    assert.doesNotMatch(render(HomeScreen, { language: "zh-CN", save: claimMission(save, "story-05").save, ...callbacks }), /enter-chapter-five-home/);
  } finally { await vite.close(); }
});
