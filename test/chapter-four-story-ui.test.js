import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createSave } from "../src/game/saveStore.js";
import { claimMission } from "../src/game/missionSystem.js";
import { advanceChapterFourPresentation } from "../src/game/chapterFourStory.js";
import { CHAPTER_FOUR_LANGUAGES, chapterFourStoryText } from "../src/screens/chapterFourStoryText.js";
import { accepted, unlocked, completed } from "./helpers/chapterFourFixtures.js";

test("chapter four localizes five beats, privacy notice and factual labels in seven languages", () => {
  assert.equal(CHAPTER_FOUR_LANGUAGES.length, 7);
  const en = chapterFourStoryText("en");
  for (const language of CHAPTER_FOUR_LANGUAGES) {
    const t = chapterFourStoryText(language);
    assert.deepEqual(Object.keys(t).sort(), Object.keys(en).sort());
    assert.deepEqual(t.beats.map(beat => beat.id), ["rain", "gap", "call", "answer", "log"]);
    assert(t.beats.every(beat => beat.paragraphs.length === 2 && beat.paragraphs.every(Boolean)));
    for (const field of ["signal", "exchange", "answered", "recovery", "remoteQuery", "privacy"]) assert(t[field]);
    assert(t.beats[2].paragraphs.join("").includes("{player}"));
    assert(t.beats[3].paragraphs.join("").includes("{peer}"));
    assert(t.hint.includes("P0–P2") && t.hint.includes("P3–P4") && t.hint.includes("SKIP K"));
    assert(!t.beats.flatMap(beat => beat.paragraphs).some(line => /NOVA|599|MY WX/.test(line)));
    if (language !== "en") assert.notEqual(t.beats[0].paragraphs[0], en.beats[0].paragraphs[0]);
  }
  assert.deepEqual(chapterFourStoryText("unknown"), en);
});

test("fourth chapter UI exposes real evidence without weather text or an early character name", async () => {
  const vite = await createServer({ appType: "custom", logLevel: "silent", optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, watch: null } });
  try {
    const { ChapterFourStoryScreen: Story } = await vite.ssrLoadModule("/src/screens/ChapterFourStoryScreen.jsx");
    const { ChapterSceneEventContext } = await vite.ssrLoadModule("/src/media/chapterSceneEventContext.js");
    const { HomeScreen } = await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
    const { MissionCenterModal } = await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
    const { QsoResultModal } = await vite.ssrLoadModule("/src/screens/QsoResultModal.jsx");
    const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
    const notes = props => renderToStaticMarkup(React.createElement(React.Fragment, null, Story(props).props.children));
    const callbacks = { onAdvance() {}, onEnterStation() {}, onClaim() {}, onBack() {}, onSettings() {}, onEnterChapterThree() {}, onEnterChapterFour() {} };
    assert.doesNotMatch(render(HomeScreen, { language: "zh-CN", save: createSave({ callsign: "BH1TEST" }), ...callbacks }), /enter-chapter-four-home/);
    const home = render(HomeScreen, { language: "zh-CN", save: unlocked(), ...callbacks });
    assert.match(home, /enter-chapter-four-home/);
    assert.doesNotMatch(home, /enter-chapter-three-home/);
    let save = accepted();
    assert.match(render(MissionCenterModal, { language: "zh-CN", save, onLaunchChapterFour() {}, onClose() {} }), /launch-chapter-four/);
    const opening = render(Story, { language: "zh-CN", save, ...callbacks });
    assert.match(opening, /data-story-beat="rain"/);
    assert.doesNotMatch(opening, /chapter-four-real-log|NOVA|04\/portrait.png/);
    assert.match(opening, /data-scene-event-pulse="0"/);
    assert.doesNotMatch(opening, /chapter-scene-lightning is-flashing/);
    const flashing = renderToStaticMarkup(React.createElement(ChapterSceneEventContext.Provider, { value: 3 }, React.createElement(Story, { language: "zh-CN", save, ...callbacks })));
    assert.match(flashing, /data-scene-event-pulse="3" class="chapter-scene-layer chapter-scene-lightning is-flashing"/);
    save = advanceChapterFourPresentation(save, "gap").save;
    save = advanceChapterFourPresentation(save, "call").save;
    const actions = [];
    const props = { language: "zh-CN", save, ...callbacks, onEnterStation: () => actions.push("station") };
    assert(Story(props).props.beat.paragraphs.join("").includes("BH1TEST"));
    Story({ ...props, inputBlocked: true }).props.onPrimary();
    assert.deepEqual(actions, []);
    Story(props).props.onPrimary();
    assert.deepEqual(actions, ["station"]);
    save = advanceChapterFourPresentation(completed(), "log").save;
    for (const language of CHAPTER_FOUR_LANGUAGES) {
      const body = notes({ language, save, ...callbacks });
      assert.match(body, /SIM2DX/); assert.match(body, /579 \/ 559/); assert.match(body, /21.060/);
      assert.match(body, /2026-10-04 12:05/); assert.match(body, /P2/); assert.match(body, /QRS K/);
      assert(body.includes(renderToStaticMarkup(React.createElement(React.Fragment, null, chapterFourStoryText(language).privacy))));
      assert.doesNotMatch(body, /NOVA|599|MY WX|OPTIONAL RESPONSE REDACTED/);
      const result = render(QsoResultModal, { language, saved: true, storyChapter: 4, onContinueStory() {} });
      assert.match(result, /continue-chapter-four/);
      assert.doesNotMatch(result, /continue-chapter-one|continue-chapter-two|continue-chapter-three/);
    }
    for (const extra of [{ saved: false }, { saved: true, failed: true }]) {
      assert.doesNotMatch(render(QsoResultModal, { language: "en", storyChapter: 4, onContinueStory() {}, ...extra }), /continue-chapter-four/);
    }
    const legacy = completed(accepted(), { attemptHistory: [] });
    assert.equal(Story({ language: "zh-CN", save: legacy, ...callbacks }).props.primaryLabel, chapterFourStoryText("zh-CN").back);
    assert.match(notes({ language: "zh-CN", save: legacy, ...callbacks }), /核验记录不完整/);
    assert.equal(claimMission(legacy, "story-04").claimed, true);
    assert.doesNotMatch(render(HomeScreen, { language: "zh-CN", save: claimMission(save, "story-04").save, ...callbacks }), /enter-chapter-four-home/);
    const queried = advanceChapterFourPresentation(completed(accepted(), { copyQueries: 1, attemptHistory: [{ message: "RST 579 K", result: "accepted", remoteOutcome: "query" }] }), "log").save;
    assert.match(notes({ language: "zh-CN", save: queried, ...callbacks }), /对方接收恢复/);
    assert.doesNotMatch(notes({ language: "zh-CN", save: queried, ...callbacks }), /QRS K|AGN K/);
  } finally { await vite.close(); }
});
