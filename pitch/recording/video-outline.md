# Demo Video Outline: ReplayFence

## Source Truth

- Demo spine: `pitch/hero.md`
- User case: `pitch/user_cases.md` OpenClaw skill install path and guest workbench path
- Judge magnet: `pitch/judge_magnet.md`
- Visual contract: `pitch/visual-build-contract.md`
- OpenClaw TUI prompt proof: `.hunter/openclaw-tui-interactive.report.json`
- OpenClaw TUI prompt video: `pitch/recording/openclaw-tui-interactive-demo.mp4`
- Supporting OpenClaw agent prompt proof: `.hunter/openclaw-agent-prompt.report.json`
- OpenClaw proof: `demo/openclaw-install.out`, `demo/openclaw-skill-showcase.out`
- Local capsule proof: `demo/replayfence-capsule.json`, `demo/replayfence-verify-output.json`
- Live Pharos proof: `demo/pharos-consume-report.json`
- Local recording URLs: `http://127.0.0.1:4388` for product captures, terminal for installed-skill captures

## Recording Position

This cut proves that ReplayFence is a reusable OpenClaw skill that a normal OpenClaw CLI/TUI session can use from a typed prompt. The first proof clip is TUI-first: open `openclaw tui --local`, type a short user request into the input line, let OpenClaw choose and run the installed skill, then show `CONSUMED`, `REPLAY_REJECTED`, `VERIFIED`, and `ReplayFence check complete`. The `--message "$PROMPT"` agent clip and direct installed-skill terminal clip remain supporting evidence only.

## Scene Table

| Scene | Budget | User stake | Screen action | Proof/result | Route/source | Selector/focus target | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `01_hook` | 8 s | Agent retries can duplicate risky actions. | Show first frame with terminal and product title plate. | Product claim: "Fence one agent action in 60 seconds." | `/` | `h1` | Use the app hero as the opening visual, but move quickly to terminal proof. |
| `02_tui_open` | 7 s | A judge must see this is the real OpenClaw CLI/TUI. | Start `openclaw tui --local`. | TUI is open and ready for a typed prompt. | terminal | TUI status footer | Do not show key values. |
| `03_tui_type_prompt` | 11 s | The demo must look like a normal user request, not a private runner. | Type: "Can you use ReplayFence to protect a payout for me?" | Prompt text appears inside OpenClaw; no commands or file paths are provided by the user. | terminal | typed prompt area | Primary authenticity proof. |
| `04_tui_running` | 7 s | A normal OpenClaw agent must call the skill. | Submit the prompt and wait for TUI running/streaming. | OpenClaw chooses the installed ReplayFence skill and records tool calls. | terminal | TUI status footer | Raw typescript is saved. |
| `05_tui_result` | 8 s | The skill must produce exactly-once proof. | Let final TUI reply settle. | `CONSUMED`, `REPLAY_REJECTED`, `VERIFIED`, `ReplayFence check complete`. | terminal | final assistant reply | Core proof. |
| `06_session_tools` | 7 s | The proof must show tool use, not narration. | Parse OpenClaw session JSONL. | `read` installed `SKILL.md`; `exec` demo command; `exec` verify command. | evidence file | `demo/openclaw-tui-interactive-session-events.json` | Supporting report after clip. |
| `08_openclaw_page` | 16 s | The app should mirror the terminal proof for reviewers. | Open `/openclaw-demo`. | TUI video, typed prompt, session tool calls, and final OpenClaw reply appear in the workbench. | `/openclaw-demo` | `.proof-video-panel`, `.proof-rail` | Show transcript is not hidden in docs. |
| `09_run_workbench` | 24 s | A fresh judge can replay the evidence visually. | Open `/try`, click `Fence + Execute Once`, then `Replay Same Action`. | UI moves from `CONSUMED` to `REPLAY_REJECTED`. | `/try` | `[data-testid="fence-run-button"]`, `[data-testid="latch-status-badge"]` | Use smooth cursor movement, no dead air. |
| `10_live_pharos_receipts` | 20 s | Sponsor tech is the mechanism. | Show first consume and reverted replay tx links in the workbench. | Recorded Pharos Atlantic tx hashes and decoded `ReplayFenceReplay`. | `/try` | `a.proof-link`, `.shock-band` | Do not claim the local terminal run is a live tx. |
| `11_history_capsule` | 16 s | Proof should survive after the single click. | Click `Inspect saved capsule`, reload history. | Capsule history remains visible. | `/capsules` | `[data-testid="capsule-history-list"]` | Show persistence after refresh if time permits. |
| `12_browser_verify` | 20 s | A second viewer can verify the artifact. | Open `/verify`, load Pharos report, click Verify. | `Pharos consume report verification` and `decoded custom error`. | `/verify` | `[data-testid="verify-capsule-button"]`, `[data-testid="verification-report"]` | Mirrors runtime interaction audit. |
| `13_skill_docs` | 16 s | The project should be reusable after the demo. | Open `/docs/skill`, show OpenClaw command block and SDK/contract tabs. | Skill commands, SDK wrapper, contract call are visible. | `/docs/skill` | `[aria-label="Skill documentation sections"]`, `[data-testid="sdk-snippet"]` | Briefly show integration path. |
| `14_close` | 10 s | Judges need one sentence to remember. | Return to hero or terminal result line. | "Exactly-once proof for agent actions." | `/` or terminal | `h1` and `Result: VERIFIED` | End on proof, not a marketing slide. |

Target duration: 220-240 seconds. If the submission form strongly prefers shorter video, cut scenes `10` and `12` first and keep scenes `02` through `06`.

## First-Sample Anchor

- Sample range: scenes `02_tui_open` through `05_tui_result`, about 33 seconds.
- Expected visible actions:
  - OpenClaw TUI opens and waits for a prompt.
  - A short user prompt is typed directly into the TUI input line.
  - TUI enters running/streaming state.
  - The final TUI reply shows `CONSUMED`, `REPLAY_REJECTED`, `VERIFIED`, and `ReplayFence check complete`.
  - The backing session JSONL shows `read`, `exec`, and capsule-read tool calls.
- Expected judge belief: ReplayFence is an installable skill that a normal OpenClaw CLI/TUI user can invoke from a typed prompt, not a custom demo agent.
- Critique target:
  - Philosophy alignment: operational proof, terminal-first.
  - Hierarchy: `Ready`, `CONSUMED`, `REPLAY_REJECTED`, and `VERIFIED` must be readable within 2 seconds.
  - Craft: no cropped terminal lines, no dev overlay, no hidden scrollbars on proof output.
  - Functionality: every scene shows a command, click, proof reveal, or verifier result.
  - Originality: the video centers on a skill primitive and a Pharos once-latch, not a generic dashboard tour.
- Fixes already applied before full recording:
  - OpenClaw provider alias configured as `stepfun`.
  - Interactive TUI raw typescript saved to `demo/openclaw-tui-interactive.typescript`.
  - TUI session tool calls saved to `demo/openclaw-tui-interactive-session-events.json`.
  - TUI-created transcript saved to `demo/openclaw-tui-skill-showcase.out`.
  - `/openclaw-demo` now displays the TUI video, typed prompt, session tool calls, final reply, and skill-run transcript.
  - Visual QA passed on production server with 0 errors.

## Judge Attention Pass

| Scene | Judge should think | Rubric / Q&A answered | Proof shown |
| --- | --- | --- | --- |
| `02_tui_open` | This is the real OpenClaw TUI. | Agent interaction authenticity. | TUI ready state. |
| `03_tui_type_prompt` | The prompt is typed like a user would type it. | Agent interaction proof. | Short payout-protection prompt appears inside TUI input, no `--message`. |
| `04_tui_running` | A normal agent accepts the prompt. | Runtime fit. | TUI running/streaming state. |
| `05_tui_result` | The skill does the exact once-only job. | Core proof. | `CONSUMED`, `REPLAY_REJECTED`, `VERIFIED`. |
| `06_session_tools` | Tool calls are real and inspectable. | Trust and auditability. | `read` SKILL.md, `exec` demo, `exec` verify, `read` capsule. |
| `10_live_pharos_receipts` | Pharos is not decorative. | Sponsor technology depth. | First consume tx, reverted replay tx, decoded custom error. |
| `12_browser_verify` | Another viewer can verify the report. | Public operability and second-context proof. | Browser verifier result. |

## Focus / Polish Plan

| Scene | Selector or bbox source | Overlay type | QA frame path |
| --- | --- | --- | --- |
| `03_openclaw_info` | Terminal rows with `Ready`, `Visible to model`, `Available as command` | terminal row lift | `pitch/polish/qa/03-openclaw-info.png` |
| `03_tui_type_prompt` | Typed prompt inside TUI | row lift | `pitch/recording/qa-frames-tui/tui-12-typed-prompt.png` |
| `05_tui_result` | Terminal rows with `CONSUMED`, `REPLAY_REJECTED`, `VERIFIED` | component lift | `pitch/recording/qa-frames-tui/tui-31-final.png` |
| `08_openclaw_page` | `.terminal-panel` | panel lift | `pitch/polish/qa/07-openclaw-page.png` |
| `09_run_workbench` | `[data-testid="latch-status-badge"]` | component lift | `pitch/polish/qa/08-replay-rejected.png` |
| `12_browser_verify` | `[data-testid="verification-report"]` | component lift | `pitch/polish/qa/11-browser-verify.png` |

## Recording Commands

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 4388
set -a; source "$HOME/use_key.txt" >/dev/null 2>&1; set +a
npx --yes openclaw --no-color tui --local --session replayfence-tui-interactive-... --timeout-ms 600000
npm run record:openclaw-tui
PROMPT="$(cat demo/openclaw-agent-prompt.md)"
npx --yes openclaw --no-color agent --local --agent main --model stepfun/step-3.7-flash --message "$PROMPT" --timeout 600 --verbose on --json
npm run record:openclaw-agent
npx --yes openclaw skills install ./skills/replayfence --as replayfence --force
npx --yes openclaw skills info replayfence
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs demo --reset --format pretty --out demo/replayfence-capsule.json --transcript demo/openclaw-skill-showcase.out --json-out demo/replayfence-demo-output.json --pharos-report demo/pharos-consume-report.json
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs verify --capsule demo/replayfence-capsule.json --format pretty --json-out demo/replayfence-verify-output.json
```

## Pre-Recording QA

```bash
npm test
npm run build
node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_project.mjs . --phase build-plan,external-skills,product-slice,feature-density,claims,runtime,realness
node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_runtime_interaction.mjs . --url http://127.0.0.1:4387
node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/visual_qa_scan.mjs . --url http://127.0.0.1:4388 --routes /,/openclaw-demo,/try,/capsules,/verify,/docs/skill --fail-on error
```
