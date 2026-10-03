import { OPERATOR_PROFILES } from "../qso/operatorProfiles.js";
import { createContactStory, hasStoryContactDetails, storyOwn } from "./contactStoryPresentation.js";

export const CHAPTER_THREE_BEATS = Object.freeze(["listen", "notes", "call", "compare", "log"]);
const story = createContactStory({
  missionId: "story-03", field: "chapterThreePresentation", beats: CHAPTER_THREE_BEATS, required: 3,
  accepts: log => hasStoryContactDetails(log) && typeof storyOwn(log, "operatorProfileId") === "string"
    && Object.hasOwn(OPERATOR_PROFILES, storyOwn(log, "operatorProfileId")),
  distinct: log => storyOwn(log, "operatorProfileId"),
});
export const normalizeChapterThreePresentation = story.normalize;
export const chapterThreeStoryModel = story.model;
export const advanceChapterThreePresentation = story.advance;
