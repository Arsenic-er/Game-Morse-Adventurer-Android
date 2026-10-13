# Chapter fifteen story verification

## Scope

Server-only work in /home/ubuntu/cwgame on agent/chapter-15-story, based on cbebd0b. No local project files, dependency installation, downloads, merge, push, release or native package update. The assets repository remains unchanged at 20955ea. This completes the Galgame presentation pass for the existing Chapters 1–15; it does not introduce a new gameplay campaign.

## Implementation

- Five beats: morning → blank → call → choose → log, in zh-CN, zh-TW, en, ja, es, de and ru.
- Ordinary play uses the existing StationScreen and physical keyer. The QSO result offers a Chapter 15 continuation only after a qualifying contact is saved. No scripted respondent, fabricated signal report, portrait identity or automatically completed QSO is introduced.
- Five explicit choices appear in the story overlay, with no default selection. The choice and actual QSO ID are persisted together, scoped to mission acceptance. A later ordinary contact cannot silently replace a selected contact.
- Sealing writes the normal first-page summary, proof and archive, adds no money or technology points, and pins the story's final beat. The final paragraph comes from the sealed goal. The notes show actual callsign, region, exchanged RST, frequency, completion UTC, QSO reward and record ID.
- Mission settlement now rejects a different player callsign and prevents a second valid page for the same accepted mission. Abandon/reaccept no longer becomes permanently blocked by an older archive entry. The claim takes its first goal from a verified record, not an arbitrary last archive item.
- The existing Chapter 15 reward remains 2000 credits and 8 technology points, once. Open Station keeps the original first goal while allowing its current goal to change. Older mission-center claiming and the standalone first-page modal remain as compatibility paths.
- Home/mission-center routes, settings blocking, world-calendar heartbeat, chapter media routing and save migration are connected. A ready story action can be disabled without preventing the player from reading the remaining dialogue.
- Choice layouts scroll in normal flow when translations are long. The Open Station entry reuses the prominent chapter-entry position after the final claim.
- Existing Chapter 15 scene and illustration assets are reused. There are no new asset files, generated voices or sound effects in this change.

## Automated verification

- Targeted Chapter 15 / first-page suite: 17/17 passed, chapter-fifteen-targeted-1.log, 5230.896567 ms.
- Final full suite: 930/930 passed, chapter-fifteen-tests-2.log, 62855.099753 ms, including the legacy sealed-page bookmark regression. The initial pre-compatibility suite passed 929/929.
- Final build: chapter-fifteen-build-2.log. Total output 164004809 bytes; largest owned JS assets/index-kwgrbq-c.js = 474320 bytes, below the unchanged 512000-byte gate. The full-chain attempt below used build 1; the final focused and compatibility checks use build 2.
- Final seeded layout/UI checks: 71/71. These include 70 cross-locale checks (seven languages × two window sizes, 1440×900 and 390×844, × opening/choice/ending/home/dashboard), plus a legacy sealed-page claim that verifies its bookmark, ending and contest-craft first goal. Zero horizontal overflow and zero runtime exceptions.
- Each language/size combination hit-tests and clicks all five choices, checks primary-action reachability and hit-tests/clicks the Open Station entry. 71 screenshots stay on the server.
- Final layout evidence: /home/ubuntu/cwgame-development-20261014/chapter-fifteen-layout-final/evidence.json, recordedAt 2026-10-13T19:14:22.870Z. SHA-256: dbd16b0dcc4c9810f030f826b4bf59411ac13546081a60ee2f29be056d51f001. No first-page layout or focused Chapter 15 temporary browser profile remains.
- These fixtures are seeded and are not evidence of playing the story. They boot at desktop size, then resize the in-game screens to test narrow-window layout; they are not a mobile-device certification. The existing native window minimum is 1280×720 (electron/main.cjs); native package validation is outside this change.

## Live progression

The full empty-save attempt on build 1 completed Chapters 1–14, including the Chapter 11–14 replay checks, and opened Chapter 15. It stopped before the final ordinary contact because the new test unconditionally expected the one-time start-guided-watch briefing button. The save had already seen that briefing in Chapter 1, so the station was correctly ready for CQ without the button. The script now waits for StationScreen and only clicks the briefing button when present.

This attempt is **not** reported as a successful uninterrupted 1–15 run. Its failed evidence is /home/ubuntu/cwgame-development-20261014/chapter-fifteen-live-30/evidence.json. The log contains CHAPTER_FOURTEEN_PASSED with original ending pinned and record final-page:final-promise:fe1728ca, then CHAPTER_FIFTEEN_START. Log SHA-256: a5f2927401df57018508611af843d4865ce81d41cdd90965092667c23275e23a.

After the legacy bookmark compatibility patch, the final build was tested with a dedicated Chapter 15 browser run. Chapters 1–14 are seeded prerequisites in this focused run; Chapter 15 is played through keyboard events at 30 WPM, the normal decoder, ordinary QSO validation, logging, choices, sealing and claiming. No successful Chapter 15 QSO or completion is injected.

Focused evidence: /home/ubuntu/cwgame-development-20261014/chapter-fifteen-focused-30-3/evidence.json, recordedAt 2026-10-13T19:14:00.454Z. SHA-256: dc2d73d3fcd8a94a0973f82b5da4a0e03e71ef09846482ac717c2150ade0dc24. 10 screenshots, zero runtime exceptions. Isolated profile /tmp/cw-chapter-fifteen-live-1791918789493 was verified removed.

- Contact: SIM8CW-1791152133226, counterpart SIM8CW, region OC-AU, RST 559 / 579; ordinary-QSO reward 120 credits.
- First page: first-page:SIM8CW-1791152133226, goal people-network. Sealing paid zero credits and zero technology points.
- Claim: credits 15725 → 17725, technology points 112 → 120. Additional achievement payout at that claim: zero.
- Opening, selected goal and sealed ending survive reload. Unsaved QSO cannot continue the story, and no goal is preselected. Settings block story choice/sealing.
- Open Station starts with people-network. Changing the active goal to world-log and reloading preserves the original people-network first goal, page archive and balance.
- The read-only Chapter 1 review route also preserves the save balance.
- The focused run was repeated after dismissing queued achievement notifications through their real close buttons; see failure history below.

Reproduce on server with CWGAME_QA_WPM=30, CWGAME_QA_UTC=2026-10-04T22:15:00Z, CWGAME_QA_CHROME pointing to server Chromium and a new CWGAME_QA_OUTPUT directory: node scripts/qa-chapter-fifteen-story.mjs. The full-chain script remains scripts/qa-chapter-one-story.mjs with CWGAME_QA_CHAPTER_FIFTEEN=1; its corrected full 1–15 version has not been rerun end-to-end during this turn. The browser sandbox remains enabled.

## Failure history and limitations

The first layout attempt queried the Home entry before Home had rendered; a readiness wait was added. The second and third attempts timed out while clicking from the narrow cold-start menu, before reaching Chapter 15. The successful scoped layout test boots at desktop size and resizes after loading Home. Narrow cold-start navigation is not certified by this test and needs a separate check; no claim is made that the earlier timeout proves an application defect or that it was fixed.


The first two focused Chapter 15 attempts completed the actual QSO and saved a choice but stopped when testing Settings. The first assertion ran immediately; adding render waiting did not resolve it. Inspection then showed queued achievement cards from the seeded prerequisites covering the top-right Settings button. The successful test dismisses those cards using their visible close buttons before opening Settings. Clicks also wait for two animation frames after scrolling. This is not presented as a game Settings fix.

The final legacy compatibility patch pins a verified existing first page before claiming, so an old save without a presentation bookmark does not fall back to the opening after its claim. It is covered by the final unit suite and the additional seeded browser claim check.

All evidence remains under /home/ubuntu/cwgame-development-20261014/. Screenshots are captured but not downloaded or manually inspected. Browser QA uses qaCapture and skips audio, so it cannot establish sound quality, voice performance, native packaging or art approval. Text is supplied in seven languages but has not had native-speaker review.

Chinese source-extracted dialogue and the humanizer-zh author self-review are in docs/reviews/chapter-fifteen-dialogue-script-zh-CN.md. The 44/50 author score is not an independent audit.
