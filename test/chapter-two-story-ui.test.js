import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createSave } from "../src/game/saveStore.js";
import { acceptMission, claimMission } from "../src/game/missionSystem.js";
import { advanceChapterTwoPresentation } from "../src/game/chapterTwoStory.js";
import { recordCompletedQso } from "../src/qso/qsoLog.js";
import { CHAPTER_TWO_LANGUAGES, chapterTwoStoryText } from "../src/screens/chapterTwoStoryText.js";

test("chapter two narrative and controls cover all seven languages", () => {
  assert.equal(CHAPTER_TWO_LANGUAGES.length, 7);
  const english = chapterTwoStoryText("en");
  for (const language of CHAPTER_TWO_LANGUAGES) {
    const t = chapterTwoStoryText(language);
    assert.deepEqual(Object.keys(t).sort(), Object.keys(english).sort());
    assert.equal(t.beats.length, 5);
    assert(t.beats.every(beat => beat.title && beat.paragraphs.length === 2 && beat.paragraphs.every(Boolean)));
    assert.deepEqual(t.beats.map(beat => beat.id), ["paper", "margin", "call", "answer", "log"]);
    assert.deepEqual(Object.keys(t.artLabels).sort(), ["illustration", "portrait", "scene"]);
    for (const value of Object.values(t)) if (typeof value === "string") assert(value.trim());
    if (language !== "en") assert.notEqual(t.beats[0].paragraphs[0], english.beats[0].paragraphs[0]);
    assert(t.beats[2].paragraphs.join(" ").includes("AGN K"));
    assert(!t.beats.flatMap(beat => beat.paragraphs).join(" ").includes("MORSE"));
  }
  assert.deepEqual(chapterTwoStoryText("unknown"), english);
});

test("chapter two UI gates entry, renders real facts and preserves legacy claims", async () => {
  const vite = await createServer({ appType: "custom", logLevel: "silent", optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, watch: null } });
  try {
    const { ChapterTwoStoryScreen } = await vite.ssrLoadModule("/src/screens/ChapterTwoStoryScreen.jsx");
    const { HomeScreen } = await vite.ssrLoadModule("/src/screens/HomeScreen.jsx");
    const { MissionCenterModal } = await vite.ssrLoadModule("/src/screens/MissionCenterModal.jsx");
    const { QsoResultModal } = await vite.ssrLoadModule("/src/screens/QsoResultModal.jsx");
    const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
    const notes = props => renderToStaticMarkup(React.createElement(React.Fragment, null, ChapterTwoStoryScreen(props).props.children));
    const callbacks = { onAdvance() {}, onEnterStation() {}, onClaim() {}, onBack() {}, onSettings() {}, onEnterChapterOne() {}, onEnterChapterTwo() {} };
    const qso = { id: "first", playerCallsign: "BH1NEW", callsign: "SIM3RA", startedAt: "2026-10-04T09:01:00.000Z", completedAt: "2026-10-04T09:05:00.000Z", sent: "579", received: "559", frequencyMhz: 21.06, finalPropagationLevel: 3, transmitAccuracy: 95, keyingScore: 90 };
    let save = createSave({ callsign: "BH1NEW" });
    assert.doesNotMatch(render(HomeScreen, { language: "zh-CN", save, ...callbacks }), /data-action="enter-chapter-two-home"/);
    save = acceptMission(save, "story-01", "2026-10-04T09:00:00.000Z").save;
    save = recordCompletedQso(save, qso).save;
    save = claimMission(save, "story-01", "2026-10-04T09:06:00.000Z").save;
    const home = render(HomeScreen, { language: "zh-CN", save, ...callbacks });
    assert.match(home, /data-action="enter-chapter-two-home"/);
    assert.doesNotMatch(home, /data-action="enter-chapter-one-home"/);
    save = acceptMission(save, "story-02", "2026-10-04T10:00:00.000Z").save;
    const opening = render(ChapterTwoStoryScreen, { language: "zh-CN", save, ...callbacks });
    assert.match(opening, /data-story-chapter="2"/);
    assert.match(opening, /data-story-beat="paper"/);
    assert.doesNotMatch(opening, /data-testid="chapter-two-real-log"|MORSE/);
    const mission = render(MissionCenterModal, { language: "zh-CN", save, onLaunchChapterTwo() {}, onClose() {} });
    assert.match(mission, /data-action="launch-chapter-two"/);
    save = advanceChapterTwoPresentation(save, "margin").save;
    save = advanceChapterTwoPresentation(save, "call").save;
    const call = render(ChapterTwoStoryScreen, { language: "zh-CN", save, ...callbacks, inputBlocked: true });
    assert.match(call, /BH1NEW/);
    assert.match(call, /SIM3RA/);
    assert.match(notes({ language: "zh-CN", save, ...callbacks }), /AGN K/);
    assert.match(call, /inert/);
    const actions = [];
    const actionProps = { language: "zh-CN", save, ...callbacks, onEnterStation: () => actions.push("station"), onClaim: () => actions.push("claim"), onAdvance: beat => actions.push(beat) };
    ChapterTwoStoryScreen({ ...actionProps, inputBlocked: true }).props.onPrimary();
    assert.deepEqual(actions, []);
    ChapterTwoStoryScreen(actionProps).props.onPrimary();
    assert.deepEqual(actions, ["station"]);
    save = recordCompletedQso(save, { ...qso, id: "real-second", startedAt: "2026-10-04T10:01:00.000Z", completedAt: "2026-10-04T10:07:00.000Z", repeatRequests: 1, attemptHistory: [{ message: "AGN K", result: "repeat" }] }).save;
    assert.match(render(ChapterTwoStoryScreen, { language: "zh-CN", save, ...callbacks }), /data-story-beat="answer"/);
    save = advanceChapterTwoPresentation(save, "log").save;
    for (const language of CHAPTER_TWO_LANGUAGES) {
      const closing = render(ChapterTwoStoryScreen, { language, save, ...callbacks });
      assert.match(closing, /data-story-qso-id="real-second"/);
      assert.match(notes({ language, save, ...callbacks }), /579 \/ 559/);
      assert.match(closing, /2026-10-04 10:07/);
      assert.match(notes({ language, save, ...callbacks }), /AGN K/);
      assert.doesNotMatch(closing, /599/);
      const result = render(QsoResultModal, { language, saved: true, storyChapter: 2, onContinueStory() {} });
      assert.match(result, /data-action="continue-chapter-two"/);
      assert.doesNotMatch(result, /data-action="continue-chapter-one"/);
    }
    for (const flags of [{ saved: false }, { saved: true, failed: true }]) {
      assert.doesNotMatch(render(QsoResultModal, { language: "en", storyChapter: 2, onContinueStory() {}, ...flags }), /data-action="continue-chapter-two"/);
    }
    const legacy = { ...save, missionState: { ...save.missionState, events: [] } };
    const unavailable = render(ChapterTwoStoryScreen, { language: "zh-CN", save: legacy, ...callbacks });
    assert.doesNotMatch(unavailable, /data-testid="chapter-two-real-log"/);
    assert.doesNotMatch(unavailable, /完成第二章 · 领取任务奖励/);
    assert.match(notes({ language: "zh-CN", save: legacy, ...callbacks }), /旧任务已完成但记录不完整/);
    assert.equal(ChapterTwoStoryScreen({ language: "zh-CN", save: legacy, ...callbacks }).props.primaryLabel, chapterTwoStoryText("zh-CN").back);
    assert.equal(claimMission(legacy, "story-02").claimed, true);
    const blockedLegacy = [];
    ChapterTwoStoryScreen({ language: "zh-CN", save: legacy, ...callbacks, onBack: () => blockedLegacy.push("back"), onClaim: () => blockedLegacy.push("claim") }).props.onPrimary();
    assert.deepEqual(blockedLegacy, ["back"]);
    const claimed = claimMission(save, "story-02").save;
    assert.doesNotMatch(render(HomeScreen, { language: "zh-CN", save: claimed, ...callbacks }), /data-action="enter-chapter-two-home"/);
  } finally { await vite.close(); }
});
