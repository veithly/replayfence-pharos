# OpenClaw Install Evidence

## Interactive TUI Prompt Evidence

This is the primary judge-facing OpenClaw proof. It shows that ReplayFence is usable by a normal OpenClaw CLI/TUI session through prompt interaction. The prompt is typed into the TUI input line; it is not passed with `--message` and is not read from a prompt file. The typed request is short and user-like: "Can you use ReplayFence to protect a payout for me?" The final narrated demo pairs that raw agent proof with browser cases for execute-once, replay rejection, capsule inspection, and later verification.

```bash
set -a; source "$HOME/use_key.txt" >/dev/null 2>&1; set +a
npx --yes openclaw --no-color tui --local --session replayfence-tui-interactive-... --timeout-ms 600000
```

TUI evidence:

- English narrated skill demo: `pitch/recording/replayfence-skill-demo-english-narrated.mp4`
- Browser user-case recording: `pitch/recording/replayfence-user-cases-demo.mp4`
- Raw TUI typescript: `demo/openclaw-tui-interactive.typescript`
- Session tool calls: `demo/openclaw-tui-interactive-session-events.json`
- TUI-created capsule: `demo/openclaw-tui-replayfence-capsule.json`
- TUI-created transcript: `demo/openclaw-tui-skill-showcase.out`
- TUI verify output: `demo/openclaw-tui-verify-output.json`
- TUI report: `.hunter/openclaw-tui-interactive.report.json`
- Raw silent recording: `pitch/recording/openclaw-tui-interactive-demo.mp4`

The recorded session shows the agent `read`ing `/Users/rick/.openclaw/workspace/skills/replayfence/SKILL.md`, then using `exec` to run the demo command and the verify command from the installed skill copy. The final TUI reply reports `CONSUMED`, `REPLAY_REJECTED`, `VERIFIED`, and `ReplayFence check complete`.

Supporting non-TUI agent prompt evidence remains available in `.hunter/openclaw-agent-prompt.report.json`.

## Commands

```bash
npx --yes openclaw skills install ./skills/replayfence --as replayfence --force
npx --yes openclaw skills info replayfence
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs demo --reset --format pretty --out demo/replayfence-capsule.json --transcript demo/openclaw-skill-showcase.out --json-out demo/replayfence-demo-output.json --pharos-report demo/pharos-consume-report.json
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs verify --capsule demo/replayfence-capsule.json --format pretty --json-out demo/replayfence-verify-output.json
```

## Result

- OpenClaw installed `replayfence` into `/Users/rick/.openclaw/workspace/skills/replayfence`.
- `openclaw skills info replayfence` reports `replayfence ✓ Ready`.
- OpenClaw reports `Visible to model: yes`.
- OpenClaw reports `Available as command: yes`.
- Installed-skill showcase transcript: `demo/openclaw-skill-showcase.out`.
- Local demo capsule: `demo/replayfence-capsule.json`.
- Demo JSON output: `demo/replayfence-demo-output.json`.
- Verify output: `demo/replayfence-verify-output.json`.
- Attached live Pharos report: `demo/pharos-consume-report.json`.

## Honesty Note

This OpenClaw demo is `local-demo`. It proves installability, deterministic canonicalization, latch-key stability, and typed replay rejection. It is not a Pharos transaction or `eth_getProof` verification until live mode is configured with `PRIVATE_KEY` and `ONCE_LATCH_REGISTRY_ADDRESS`.
