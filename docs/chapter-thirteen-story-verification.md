# Chapter thirteen story verification

## Scope

Server-only work in /home/ubuntu/cwgame on agent/chapter-13-story, based on 7efffec. No local checkout, build, evidence download, merge, push or package update. The assets repository remains unchanged at 20955ea.

This change adds the Galgame presentation for the existing Chapter 13 night-operations activity. It does not claim that Chapters 14–15 have received this presentation pass or that art/audio have been manually approved.

## Implementation

- Five beats: late → schedule → watch → contacts → log, in zh-CN, zh-TW, en, ja, es, de and ru.
- Home and mission-center entry, acceptance-scoped bookmark, settings, chapter scene/audio routing and world-calendar integration.
- Only a verified archive record with three distinct contacts, settlement proof, QSO settlement IDs and operator relationships can expose the ending. Current player, mission acceptance time and baseline run IDs are checked. Ending facts use the record's actual callsigns/bands and remain pinned after replay.
- Night operations stores each contact's activeMilliseconds separately from completedAt. Window validity uses active time; UTC timestamps still represent actual completion time. Valid legacy contacts migrate from their wall-time offset; old data that was already discarded cannot be reconstructed.
- Pauses cover settings, leave confirmation and focus loss, including physical key input. Requests apply to the current run/window/phase and preserve elapsed time; stale responses cannot revive expired windows.
- Browser mode falls back to the existing rules interpreter when desktop transport is absent or fails. An explicit provider safety rejection is never replaced with local approval.
- Replay settlement requires both chapter claim and task-tree unlock. A callback-index bug in completedRuns normalization previously rejected the second summary; normalization now passes only the summary value.
- Exactly three zero-credit event QSOs are recorded per successful run. Chapter reward is 1500 credits and 6 technology points once; independent achievement rewards remain separate.
- Replay buttons share a wrapping group. Chapter 13 uses its existing scene and illustration assets; no NPC identity is falsely assigned to a randomly selected contact.
- The UI displays archived band labels, not invented exact frequencies. The pre-existing generic QSO record's unspecified frequency is not treated as a story-completion failure.

## Automated verification

- Targeted engine/story/settlement: 19/19 passed in chapter-thirteen-targeted-4.log.
- Seven-language SSR presentation checks: 2/2 passed in chapter-thirteen-ui.log.
- Full suite: 907/907 passed, 63431.211605 ms, chapter-thirteen-tests-final.log.
- Production build: chapter-thirteen-build-final.log. Total output 163930333 bytes; largest owned JS assets/index-CdWuDvLC.js = 465747 bytes, below the unchanged 512000-byte gate.
- Seeded layout-only browser checks: 42/42, 7 languages × 2 widths (1440×900 and 390×844) × VN/activity/home. No horizontal overflow, no runtime exceptions, 14 real mouse hit-and-click checks for the night replay entry against its adjacent storm entry. 28 screenshots remain on the server.
- Layout evidence: /home/ubuntu/cwgame-development-20261014/chapter-thirteen-layout/evidence.json, recordedAt 2026-10-13T16:41:26.020Z. SHA-256: 2f29179f9419a698673985e377f6a94561f19f177bbcf29795b99b61bff52080.
- Layout fixtures are explicitly seeded and are not counted as gameplay completion.

## Live progression

Passed: empty BH1QA save through Chapters 1–13, plus Chapter 11, 12 and 13 replays. The game clock starts at 2026-10-04T22:15:00Z; it is anchored to real elapsed wall time, not advanced to skip night windows. Automated keyboard events run through the 30 WPM keyer, decoder, ordinary rules and settlement paths. qaCapture skips audio, not protocol validation.

Evidence: /home/ubuntu/cwgame-development-20261014/chapter-thirteen-live-30/evidence.json, recordedAt 2026-10-13T17:12:57.653Z. SHA-256: d3862bc8bbb8b61dc1383d250ae0b98c88b1b52ffc5a934ffc14ccbf3e3f953c. There are 134 screenshots and zero runtime exceptions. This run passed on its first attempt.

Chapter 13 assertions cover opening reload, invalid call rejection, QRS recovery, 65 seconds in settings without clock/key input changes, a paused leave dialog, exchange reload, completion before settlement and reload, factual ending text, ending reload, claim, Chapter 14 unlock, replay settlement and original-record pinning. The first contact finishes after its window's wall-clock closing time but within its saved active-time window, directly exercising the pause fix.

- First record: night-record:night-operations:4a3a1f23.
- Actual first-run contacts: SIM12CS / 40M, SIM9RL / 20M, SIM9CR / 15M.
- QSO IDs: night-qso:4a3a1f23:1, night-qso:4a3a1f23:2, night-qso:4a3a1f23:3.
- Replay record: night-record:night-operations:a3977a25, with three new zero-credit event QSOs.
- Chapter reward: credits 12740 → 14240; technology points 85 → 91. No additional achievement payout in this run.
- Replay changes neither reward balance nor the first ending record.
- The isolated browser profile /tmp/cw-chapter-one-live-1791909857618 was removed after success. The layout profile was also removed.

Reproduce against server preview on port 4176 with CWGAME_QA_CHAPTER_THIRTEEN=1, CWGAME_QA_WPM=30, CWGAME_QA_UTC=2026-10-04T22:15:00Z and CWGAME_QA_RECOVERY='AGN K', running node scripts/qa-chapter-one-story.mjs. Set CWGAME_QA_CHROME to the server's Chromium executable and CWGAME_QA_OUTPUT to a new server evidence directory. Layout-only checks use node scripts/qa-night-operations-layout.mjs.

## Failure history and limitations

Early targeted checks caught an over-restrictive copied positive-frequency check in presentation and an unsupported direct comparison between a generic event region field and a band. Those checks were corrected without inventing a frequency or broadening the generic QSO format. Repeat settlement also exposed the summary callback-index defect described above. The first full test run was 905/907 because two source-contract tests still expected the old route/pause conditions; those expectations were updated, and the final full run passed.

All logs and screenshots stay under /home/ubuntu/cwgame-development-20261014/. Screenshots were captured but not downloaded or manually inspected. Browser QA uses qaCapture and skips audio playback; it is not a hearing test, voice-performance approval, native packaging test or visual art approval. New Galgame copy is supplied in all seven languages; existing activity dictionaries retain their prior fallback strings. External-language copy has not had a native-speaker review.

The source-extracted Chinese dialogue and humanizer-zh author review are in docs/reviews/chapter-thirteen-dialogue-script-zh-CN.md. The self-score is not an independent audit.
