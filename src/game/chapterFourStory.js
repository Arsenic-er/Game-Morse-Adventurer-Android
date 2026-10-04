import { createContactStory, hasStoryContactDetails, storyOwn, storyTail } from "./contactStoryPresentation.js";

export const CHAPTER_FOUR_BEATS = Object.freeze(["rain", "gap", "call", "answer", "log"]);

// Optional answers are deliberately redacted by the QSO engine. Observe the
// completed exchange and recovery attempts without reconstructing private text.
export function chapterFourRecovery(log) {
  const attempts = storyTail(storyOwn(log, "attemptHistory"), 50);
  const commands = [...new Set(attempts.filter(attempt => storyOwn(attempt, "result") === "repeat")
    .map(attempt => storyOwn(attempt, "message"))
    .filter(message => typeof message === "string" && /^(?:AGN K|QRS K|QRS PSE K|PSE QRS K)$/.test(message)))];
  const remoteQuery = attempts.some(attempt => ["query", "unreadable"].includes(storyOwn(attempt, "remoteOutcome")));
  return { commands, remoteQuery, verified: commands.length > 0 || remoteQuery };
}
const story = createContactStory({
  missionId: "story-04", field: "chapterFourPresentation", beats: CHAPTER_FOUR_BEATS,
  accepts: log => hasStoryContactDetails(log) && storyOwn(log, "callsign") === "SIM2DX"
    && Number.isInteger(storyOwn(log, "finalPropagationLevel"))
    && storyOwn(log, "finalPropagationLevel") >= 0 && storyOwn(log, "finalPropagationLevel") <= 2
    && storyOwn(log, "optionalExchangeQuestion") === "weather" && storyOwn(log, "optionalExchangeOutcome") === "answered"
    && chapterFourRecovery(log).verified,
});
export const normalizeChapterFourPresentation = story.normalize;
export const chapterFourStoryModel = story.model;
export const advanceChapterFourPresentation = story.advance;
