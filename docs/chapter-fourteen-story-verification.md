# Chapter fourteen story verification

## Scope

Server-only work in /home/ubuntu/cwgame on agent/chapter-14-story, based on 07e5c52. No local checkout, build, evidence download, merge, push or package update. The assets repository was verified unchanged at 20955ea. This adds Galgame presentation to the existing Chapter 14 final-promise activity; Chapter 15's presentation pass remains next.

## Implementation

- Five beats: page → review → call → reply → log. Seven languages: zh-CN, zh-TW, en, ja, es, de and ru. Three ending paragraphs are selected by the actually settled brief / steady / warm tone, with the exact canonical keyed message reconstructed from that same archive record.
- Home and mission-center entry, automatic mission acceptance, acceptance-scoped bookmark, settings, chapter scene/audio routing and world-calendar integration. Legacy mission-center claiming remains available.
- The ending requires current-player and acceptance/baseline checks, matching archive/summary/proof, actual QSO log, settled QSO ID and operator relationship. Account identity is now also compared between summary and archive. Unsettled completion cannot reveal the ending. The selected record is pinned before claiming; later replays cannot replace it.
- Settings, leave confirmation and focus loss pause time and key input. Semantic requests apply to the current run/phase/tone/recovery count, preserving elapsed time and rejecting stale responses after phase change or retry. Clock persistence no longer runs inside a React state updater.
- Browser mode uses the existing rules interpreter when optional desktop transport is absent or fails. An explicit provider rejection of a call/final message is not replaced. Exact AGN K / QRS K remain locally recognized recovery commands, as required by the pre-existing engine contract, even if the semantic model does not classify them.
- Recipient account is hidden until the ACCOUNT phase. Existing account/recall/message strings and phase names are localized in seven languages. This is still a text-and-confirmation activity, not a new audio-listening engine.
- Replay settlement now requires both claim and task-tree unlock. Completed-run normalization no longer passes the array index into its optional run parameter, fixing rejection of second/subsequent summaries.
- One zero-credit fictional event QSO per successful attempt. Chapter reward remains 1700 credits and 7 technology points once. Independent achievement rewards are accounted for separately.
- Final-promise replay joins the existing replay button stack, with explicit styles and narrow-screen wrapping. Existing Chapter 14 scene and illustration assets are reused; no new art/audio or portrait identity is introduced.

## Automated verification

- Targeted story/engine/UI suite: 26/26 passed in chapter-fourteen-targeted-3.log, 4953.623234 ms.
- Full suite: 918/918 passed in chapter-fourteen-tests-1.log, 63573.065689 ms.
- Build: chapter-fourteen-build-1.log. Total output 163972298 bytes; largest owned JS assets/index-Di7VHFBU.js = 469823 bytes, below the unchanged 512000-byte gate.
- Seeded layout-only checks: 42/42, seven languages × two viewports (1440×900 and 390×844) × VN/activity/home. No horizontal overflow, zero runtime exceptions, 14 actual mouse hit-and-click checks for final-promise replay against adjacent night replay. 28 screenshots stay on the server. These seeded checks are not gameplay completion evidence.
- Layout evidence: /home/ubuntu/cwgame-development-20261014/chapter-fourteen-layout/evidence.json, recordedAt 2026-10-13T17:37:04.169Z. SHA-256: d6e0fea0d654b7f5a52d9a2e6bf9e8ed3466f0dfe1b549850c11a96ee3fbfe78.

## Live progression

Passed on the first full browser attempt: empty BH1QA save through Chapters 1–14, plus Chapter 11, 12 and 13 replays and two Chapter 14 replays. The fixed game-clock anchor is 2026-10-04T22:15:00Z, advancing with real elapsed time, not skipping night windows. Automated keyboard events pass through the 30 WPM keyer, decoder, local rules and normal settlement paths. No completed chapter or QSO is injected into this live run.

Evidence: /home/ubuntu/cwgame-development-20261014/chapter-fourteen-live-30/evidence.json, recordedAt 2026-10-13T18:08:45.107Z. SHA-256: b57bd0e24f017ed87835025cbe03fe1d0a9fbc1a1dfe16c96b424e15f4a5eea4. There are 146 screenshots and 0 runtime exceptions.

Chapter 14 checks opening reload, account reveal by phase, invalid call rejection, QRS recovery, settings and leave-dialog clock/key freeze, chosen-tone reload, rejection of a message for the wrong tone, completed-but-unsettled reload, actual ending paragraph and log facts, ending reload, claim, Chapter 15 unlock and two replay settlements.

- First record: final-page:final-promise:340fab51, tone warm; account chapter14.account.unfinished-log.
- First QSO: final-promise-qso:340fab51; actual message SIM14FP DE BH1QA YOUR LOG CONTINUES 73.
- Replays: final-page:final-promise:76a3071f (brief); final-page:final-promise:0c96502a (steady). Their accounts were chapter14.account.witnessed-work and chapter14.account.forward-promise.
- This run therefore happened to cover all three account texts as well as all three tones.
- Chapter reward: credits 14315 → 16015; technology points 91 → 98. Additional achievement payout: 0 credits, 0 technology points.
- Each replay adds one zero-credit event QSO, leaves both balances unchanged and preserves the original final-page bookmark.
- The original QSL decision was defer; the ending does not overwrite it.
- Isolated live profile /tmp/cw-chapter-one-live-1791913094799 was removed after success; no layout profile remains.

Reproduce against server preview on port 4176 with CWGAME_QA_CHAPTER_FOURTEEN=1, CWGAME_QA_WPM=30, CWGAME_QA_UTC=2026-10-04T22:15:00Z and CWGAME_QA_RECOVERY='AGN K', running node scripts/qa-chapter-one-story.mjs. Set CWGAME_QA_CHROME to server Chromium and CWGAME_QA_OUTPUT to a new server evidence directory. Layout checks use node scripts/qa-final-promise-layout.mjs. The browser sandbox remains enabled.

## Failure history and limitations

The first targeted run passed 23/24: an added semantic safety requirement on AGN/QRS conflicted with the existing explicit recovery-command contract. That unnecessary restriction was removed. The second run caught a missing closing brace in the new text module; the third passed all 26 tests. The full suite and layout pass then succeeded on their first runs.

All evidence stays under /home/ubuntu/cwgame-development-20261014/. Screenshots are captured but not downloaded or manually inspected. Browser QA skips audio with qaCapture and does not establish hearing quality, voice performance, native packaging or art approval. Newly added story/account/recall/message text is supplied in seven languages; some pre-existing generic activity controls retain English fallback in es/de/ru. No native-speaker review has been performed.

Chinese source-extracted copy and the humanizer-zh author self-review are in docs/reviews/chapter-fourteen-dialogue-script-zh-CN.md. That score is not an independent audit.
