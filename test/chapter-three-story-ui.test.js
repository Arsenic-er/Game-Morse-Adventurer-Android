import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createSave } from "../src/game/saveStore.js";
import { claimMission } from "../src/game/missionSystem.js";
import { advanceChapterThreePresentation } from "../src/game/chapterThreeStory.js";
import { CHAPTER_THREE_LANGUAGES, chapterThreeStoryText } from "../src/screens/chapterThreeStoryText.js";
import { OPERATOR_PROFILES } from "../src/qso/operatorProfiles.js";
import { accepted, unlocked, contact, completed } from "./helpers/chapterThreeFixtures.js";

test("chapter three localizes every beat, control and supported operator style", () => {
  assert.equal(CHAPTER_THREE_LANGUAGES.length, 7);
  const en = chapterThreeStoryText("en");
  for (const language of CHAPTER_THREE_LANGUAGES) {
    const t = chapterThreeStoryText(language);
    assert.deepEqual(Object.keys(t).sort(), Object.keys(en).sort());
    assert.deepEqual(Object.keys(t.styles).sort(), Object.keys(OPERATOR_PROFILES).sort());
    assert(Object.values(t.styles).every(value => typeof value === "string" && value.trim()));
    assert.deepEqual(t.beats.map(beat => beat.id), ["listen", "notes", "call", "compare", "log"]);
    assert(t.beats.every(beat => beat.paragraphs.length === 2 && beat.paragraphs.every(Boolean)));
    assert(t.progress.includes("{count}"));
    assert(t.beats[2].paragraphs.join("").includes("{player}"));
    assert(t.beats[3].paragraphs.join("").includes("{callsigns}"));
    if (language !== "en") assert.notEqual(t.beats[0].paragraphs[0], en.beats[0].paragraphs[0]);
    assert(!t.beats.flatMap(beat => beat.paragraphs).some(line => /SIM\d|599|MORSE/.test(line)));
  }
  assert.deepEqual(chapterThreeStoryText("unknown"), en);
});

test("third chapter renders verified partial progress and only three real closing records", async () => {
  const vite = await createServer({ appType: "custom", logLevel: "silent", optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, watch: null } });
  try {
    const { ChapterThreeStoryScreen: Story } = await vite.ssrLoadModule("/src/screens/ChapterThreeStoryScreen.jsx");
    const { HomeScreen } = await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
    const { MissionCenterModal } = await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
    const { QsoResultModal } = await vite.ssrLoadModule("/src/screens/QsoResultModal.jsx");
    const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
    const notes = props => renderToStaticMarkup(React.createElement(React.Fragment, null, Story(props).props.children));
    const callbacks = { onAdvance() {}, onEnterStation() {}, onClaim() {}, onBack() {}, onSettings() {}, onEnterChapterTwo() {}, onEnterChapterThree() {} };
    assert.doesNotMatch(render(HomeScreen, { language: "zh-CN", save: createSave({ callsign: "BH1TEST" }), ...callbacks }), /enter-chapter-three-home/);
    const home = render(HomeScreen, { language: "zh-CN", save: unlocked(), ...callbacks });
    assert.match(home, /enter-chapter-three-home/);
    assert.doesNotMatch(home, /enter-chapter-two-home/);
    let save = accepted();
    assert.match(render(MissionCenterModal, { language: "zh-CN", save, onLaunchChapterThree() {}, onClose() {} }), /launch-chapter-three/);
    const opening = render(Story, { language: "zh-CN", save, ...callbacks });
    assert.match(opening, /data-story-beat="listen"/);
    assert.doesNotMatch(opening, /chapter-three-real-logs|SIM3RA|SIM5TU|SIM6JP/);
    save = advanceChapterThreePresentation(save, "notes").save;
    save = advanceChapterThreePresentation(save, "call").save;
    const entering = Story({ language: "zh-CN", save, ...callbacks });
    assert(entering.props.beat.paragraphs.join("").includes("BH1TEST"));
    save = contact(save, 0);
    for (const language of CHAPTER_THREE_LANGUAGES) {
      const props = { language, save, ...callbacks };
      const partial = render(Story, props);
      assert.match(partial, /data-story-contact-count="1"/);
      assert.match(partial, /data-story-beat="call"/);
      assert.match(notes(props), /data-qso-id="third-qso-0"/);
      assert.match(notes(props), /579 \/ 559/);
      assert.doesNotMatch(notes(props), /SIM5TU|SIM6JP/);
      assert(notes(props).includes(chapterThreeStoryText(language).styles["patient-veteran"]));
    }
    const actions = [];
    const blocked = { language: "zh-CN", save, ...callbacks, onEnterStation: () => actions.push("station") };
    Story({ ...blocked, inputBlocked: true }).props.onPrimary();
    assert.deepEqual(actions, []);
    Story(blocked).props.onPrimary();
    assert.deepEqual(actions, ["station"]);
    save = advanceChapterThreePresentation(completed(), "log").save;
    for (const language of CHAPTER_THREE_LANGUAGES) {
      const body = notes({ language, save, ...callbacks });
      assert.equal((body.match(/data-qso-id=/g) ?? []).length, 3);
      assert.match(body, /SIM3RA/); assert.match(body, /SIM5TU/); assert.match(body, /SIM6JP/);
      assert.match(body, /579 \/ 559/); assert.doesNotMatch(body, /599/);
      assert.match(body, /2026-10-04 11:04/);
      const result = render(QsoResultModal, { language, saved: true, storyChapter: 3, onContinueStory() {} });
      assert.match(result, /continue-chapter-three/);
      assert.doesNotMatch(result, /continue-chapter-one|continue-chapter-two/);
    }
    const unsaved = render(QsoResultModal, { language: "en", saved: false, storyChapter: 3, onContinueStory() {} });
    assert.doesNotMatch(unsaved, /continue-chapter-three/);
    const legacy = { ...save, missionState: { ...save.missionState, events: [] } };
    const fallback = Story({ language: "zh-CN", save: legacy, ...callbacks });
    assert.equal(fallback.props.primaryLabel, chapterThreeStoryText("zh-CN").back);
    assert.match(notes({ language: "zh-CN", save: legacy, ...callbacks }), /核验记录不完整/);
    assert.equal(claimMission(legacy, "story-03").claimed, true);
    assert.doesNotMatch(render(HomeScreen, { language: "zh-CN", save: claimMission(save, "story-03").save, ...callbacks }), /enter-chapter-three-home/);
  } finally { await vite.close(); }
});
