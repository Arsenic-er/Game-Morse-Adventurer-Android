import { createContactStory, hasStoryContactDetails, storyOwn, storyTail } from "./contactStoryPresentation.js";

export const CHAPTER_TWO_BEATS = Object.freeze(["paper", "margin", "call", "answer", "log"]);
const story = createContactStory({
  missionId: "story-02", field: "chapterTwoPresentation", beats: CHAPTER_TWO_BEATS,
  accepts: log => hasStoryContactDetails(log) && storyOwn(log, "callsign") === "SIM3RA"
    && storyTail(storyOwn(log, "attemptHistory"), 50).some(attempt => {
      const message = storyOwn(attempt, "message");
      return typeof message === "string" && message.trim().toUpperCase() === "AGN K"
        && storyOwn(attempt, "result") === "repeat";
    }),
});
export const normalizeChapterTwoPresentation = story.normalize;
export const chapterTwoStoryModel = story.model;
export const advanceChapterTwoPresentation = story.advance;
