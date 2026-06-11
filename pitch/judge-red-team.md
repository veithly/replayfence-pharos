# Judge Red-Team

Inputs: Live URL `https://replayfence-pharos.pages.dev/`, README, Video `https://replayfence-pharos.pages.dev/evidence-media/replayfence-skill-demo-english-narrated.mp4`, Deck notes in `pitch/recording/video-outline.md`, `SUBMISSION.md`, and `.hunter/claim-matrix.json`.

## Scores

| Category | Score | Notes |
| --- | ---: | --- |
| 5s clarity | 8 | The hero says duplicate agent actions are blocked on Pharos in 60 seconds. |
| 30s click desire | 8 | `Try as Guest` leads to a concrete once/replay action with no login wall. |
| Product realness | 8 | Routes cover workbench, history, verifier, docs, OpenClaw demo, and seeded proof. |
| Sponsor necessity | 9 | Pharos supplies the public latch and reverted replay evidence. |
| Memorability | 8 | "Click once, click again, duplicate fails" is easy to retell. |
| Proof confidence | 9 | Repo includes OpenClaw reports, Pharos tx reports, Playwright runtime reports, and video. |

Total: 50/60. No category below 7.

Decision: PASS

## Likely Doubts

- Objection 1: The hosted workbench uses seeded evidence for safety. Proof: `demo/pharos-consume-report.json` and tx `0x7dcfe6f8306168d8c36730ea41b37606e54a294cc4931fcf268dd8aecc74941d`.
- Objection 2: The project might look like a bespoke agent demo. Proof: `/openclaw-demo`, `.hunter/openclaw-tui-interactive.report.json`, and `demo/openclaw-tui-interactive-session-events.json`.
- Objection 3: The form might bury the Pharos proof. Proof: `SUBMISSION.md` links the live URL, repo, video, registry, first consume tx, and reverted replay tx.

## Fixes Applied

- Public URLs added to README and evidence log.
- Demo copy avoids provider and recording-tool details.
- Submission answers point to direct proof links instead of asking judges to search the repo.
