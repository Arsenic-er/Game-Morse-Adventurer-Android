import { createContactStory } from "./contactStoryPresentation.js";

export const CHAPTER_ONE_BEATS = Object.freeze(["silence", "operator", "call", "answer", "log"]);
const story = createContactStory({
  missionId: "story-01", field: "chapterOnePresentation", beats: CHAPTER_ONE_BEATS, allowRewind: true,
});
export const normalizeChapterOnePresentation = story.normalize;
export const chapterOneStoryModel = story.model;
export const advanceChapterOnePresentation = story.advance;
