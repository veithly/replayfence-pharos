<div align="center">

<img src="./demo/readme-openclaw-skill-overview.png" alt="ReplayFence running from an installed OpenClaw skill" width="100%" />

# ReplayFence

### An OpenClaw Skill that blocks duplicate agent actions on Pharos in 60 seconds.

*Run one safe agent action, replay the exact same fingerprint, and inspect the Pharos receipt plus proof capsule without trusting a narrator.*

**Quick links:**
[Live app](https://replayfence-pharos.pages.dev/) ·
[OpenClaw demo page](https://replayfence-pharos.pages.dev/openclaw-demo) ·
[Public narrated video](https://replayfence-pharos.pages.dev/evidence-media/replayfence-skill-demo-english-narrated.mp4) ·
[OpenClaw evidence](./demo/openclaw-install.md) ·
[TUI prompt transcript](./demo/openclaw-tui-interactive.typescript) ·
[Narrated skill demo](./demo/replayfence-skill-demo-english-narrated.mp4) ·
[Skill source](./skills/replayfence/SKILL.md) ·
[Pharos consume report](./demo/pharos-consume-report.json) ·
[Agent capsule](./demo/openclaw-tui-replayfence-capsule.json)

</div>

---

## Why It Matters

Agent runtimes retry tool calls after timeouts, queue redelivery, double clicks, and model loops. For payments, deploys, orders, or privileged API calls, one duplicate side effect is enough to create real loss.

ReplayFence turns the usual private idempotency log into a reusable Skill primitive: a deterministic action hash, a Pharos once-latch, a rejected replay, and a portable capsule another reviewer can verify.

| Question | Private retry log | ReplayFence |
| --- | --- | --- |
| Can another agent inspect it? | Usually no | Yes, via capsule JSON |
| Is the replay result public? | No | Yes, via Pharos tx/revert evidence |
| Does it install as a reusable skill? | No | Yes, OpenClaw reports ready |

## Demo Path

This path starts with a normal user prompt inside OpenClaw, then shows the same replay guard from the user workbench and verifier.

<table>
  <tr>
    <td width="50%"><img src="./demo/readme-openclaw-typed-prompt.png" alt="User prompt typed inside OpenClaw TUI" /></td>
    <td width="50%"><img src="./demo/readme-openclaw-result.png" alt="OpenClaw agent result after using ReplayFence skill" /></td>
  </tr>
  <tr>
    <td><b>1.</b> Type a short user prompt inside OpenClaw TUI.</td>
    <td><b>2.</b> The agent loads the installed Skill and reports the duplicate was blocked.</td>
  </tr>
  <tr>
    <td width="50%"><img src="./demo/readme-workbench-replay.png" alt="ReplayFence workbench showing first consume and replay rejection" /></td>
    <td width="50%"><img src="./demo/readme-capsule-verify.png" alt="ReplayFence capsule verifier" /></td>
  </tr>
  <tr>
    <td><b>3.</b> Inspect first consume and exact replay rejection side by side.</td>
    <td><b>4.</b> Verify the capsule or live Pharos report.</td>
  </tr>
</table>

## Quick Start

Install the Skill into OpenClaw first:

```bash
npx --yes openclaw skills install ./skills/replayfence --as replayfence --force
npx --yes openclaw skills info replayfence
```

Then run the local Skill proof:

```bash
npm install
cp .env.example .env.local
npm run replayfence:showcase
npm run replayfence:verify
```

To try it through a normal prompt, open the TUI:

```bash
npx --yes openclaw --no-color tui --local --timeout-ms 600000
```

Prompt:

```text
Can you use ReplayFence to protect a payout for me? Run it once, try the exact same payout again, verify the proof capsule, and tell me whether the duplicate was blocked.
```

Public judge path:

- Live app: <https://replayfence-pharos.pages.dev/>
- OpenClaw prompt demo: <https://replayfence-pharos.pages.dev/openclaw-demo>
- Browser workbench: <https://replayfence-pharos.pages.dev/try>
- Capsule verifier: <https://replayfence-pharos.pages.dev/verify>
- Public video: <https://replayfence-pharos.pages.dev/evidence-media/replayfence-skill-demo-english-narrated.mp4>

Run the evidence checks:

```bash
npm test
npm run contract:compile
npm run replayfence:demo
npm run replayfence:verify
```

## Live Pharos Proof

- Registry: `0xf3cb65898bc692495c64e2fa3981acbab2770a73`
- Deploy tx: `0xba7cf7df008b812a8ffefecc7688929531496f1a6bb3030fcb331365be5c399d`
- First consume tx: `0x7dcfe6f8306168d8c36730ea41b37606e54a294cc4931fcf268dd8aecc74941d`
- Reverted replay tx: `0xf428dbdf2915bad77a6cc2fa8b6d6a554c98d77f8e21407fdc462cdcbbdabe6d`

The current public workbench displays recorded live Pharos evidence. To generate a fresh local proof pair with a funded testnet key:

```bash
npm run contract:consume:pharos
```

## OpenClaw Skill Proof

ReplayFence is packaged as an installable OpenClaw skill. The primary judge-facing demo combines a real OpenClaw TUI prompt with the browser user flow. The prompt is typed into `openclaw tui --local`, not loaded from a file or passed with `--message`. The typed request is short and user-like: "Can you use ReplayFence to protect a payout for me?" OpenClaw reads the installed `replayfence` skill, runs the bundled demo through `exec`, verifies the capsule, and answers with the blocked duplicate result. The browser half shows the same guarantee from a user's point of view: execute once, reject the exact replay, inspect the saved capsule, and verify it later.

Primary TUI evidence:

- English narrated skill demo: [`demo/replayfence-skill-demo-english-narrated.mp4`](./demo/replayfence-skill-demo-english-narrated.mp4)
- Raw TUI typescript: [`demo/openclaw-tui-interactive.typescript`](./demo/openclaw-tui-interactive.typescript)
- Session tool calls: [`demo/openclaw-tui-interactive-session-events.json`](./demo/openclaw-tui-interactive-session-events.json)
- Agent-created capsule: [`demo/openclaw-tui-replayfence-capsule.json`](./demo/openclaw-tui-replayfence-capsule.json)

The recorded command shape is:

```bash
npx --yes openclaw --no-color tui --local --session replayfence-tui-interactive-... --timeout-ms 600000
# Prompt is typed into the TUI input line, then submitted with Enter.
```

Supporting install/run evidence:

```bash
npx --yes openclaw skills install ./skills/replayfence --as replayfence --force
npx --yes openclaw skills info replayfence
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs demo --reset --format pretty --out demo/replayfence-capsule.json --transcript demo/openclaw-skill-showcase.out --json-out demo/replayfence-demo-output.json --pharos-report demo/pharos-consume-report.json
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs verify --capsule demo/replayfence-capsule.json --format pretty --json-out demo/replayfence-verify-output.json
```

Evidence lives in [`demo/openclaw-install.md`](./demo/openclaw-install.md), [`demo/openclaw-install.out`](./demo/openclaw-install.out), [`demo/openclaw-tui-replayfence-capsule.json`](./demo/openclaw-tui-replayfence-capsule.json), and the raw TUI transcript [`demo/openclaw-tui-interactive.typescript`](./demo/openclaw-tui-interactive.typescript).

## How It Works

```mermaid
flowchart LR
  A["Agent action JSON"] --> B["Canonical action hash"]
  B --> C["Pharos latch key"]
  C --> D["OnceLatchRegistry.consume"]
  D --> E["First tx succeeds"]
  D --> F["Exact replay reverts"]
  E --> G["ReplayFence Capsule"]
  F --> G
  G --> H["Browser verifier"]
```

## Safety Boundary

- Testnet only: this is not production wallet security.
- Private keys stay in `.env.local` / `.dev.vars` and are ignored by git.
- The browser does not expose arbitrary contract writes.
- The workbench labels local-demo evidence separately from live Pharos evidence.
- Public fresh-chain writes should wait for the restricted relayer and D1/SQLite deployment storage.

## Repository Map

```text
skills/replayfence/              OpenClaw-installable Skill
packages/replayfence-skill/      deterministic hashing and capsule helpers
contracts/OnceLatchRegistry.sol  Pharos once-latch contract
scripts/pharos-consume-demo.mjs  live consume + replay rejection script
demo/                            narrated video, TUI transcript, and proof artifacts
tests/                           focused Node tests
```
