# ReplayFence

ReplayFence is an OpenClaw-installable Skill that blocks duplicate agent actions on Pharos.

A user can ask a normal OpenClaw prompt such as:

```text
Can you use ReplayFence to protect a payout for me?
```

The agent loads the installed Skill, canonicalizes the action, consumes the Pharos latch once, tries the exact same action again, rejects the replay, and returns a verifiable capsule.

## Demo

- Demo video: [`demo/replayfence-skill-demo-english-narrated.mp4`](./demo/replayfence-skill-demo-english-narrated.mp4)
- Recorded OpenClaw prompt transcript: [`demo/openclaw-tui-interactive.typescript`](./demo/openclaw-tui-interactive.typescript)
- Agent-created capsule: [`demo/openclaw-tui-replayfence-capsule.json`](./demo/openclaw-tui-replayfence-capsule.json)

## Install The Skill In OpenClaw

From this repository:

```bash
npx --yes openclaw skills install ./skills/replayfence --as replayfence --force
npx --yes openclaw skills info replayfence
```

Expected result:

```text
replayfence ✓ Ready
Visible to model: yes
Available as command: yes
```

The Skill source lives at [`skills/replayfence/SKILL.md`](./skills/replayfence/SKILL.md).

## Use It Through A Normal Prompt

Start OpenClaw TUI:

```bash
npx --yes openclaw --no-color tui --local --timeout-ms 600000
```

Type a user-style prompt:

```text
Can you use ReplayFence to protect a payout for me? Run it once, try the exact same payout again, verify the proof capsule, and tell me whether the duplicate was blocked.
```

The recorded demo shows OpenClaw doing four real tool steps:

1. Read the installed `replayfence` Skill.
2. Run the ReplayFence demo script.
3. Verify the exported capsule.
4. Read the capsule and summarize the result.

Evidence:

- TUI transcript: [`demo/openclaw-tui-interactive.typescript`](./demo/openclaw-tui-interactive.typescript)
- TUI tool calls: [`demo/openclaw-tui-interactive-session-events.json`](./demo/openclaw-tui-interactive-session-events.json)
- Agent-created capsule: [`demo/openclaw-tui-replayfence-capsule.json`](./demo/openclaw-tui-replayfence-capsule.json)

## Run The Skill Directly

```bash
npm install
npm run replayfence:showcase
npm run replayfence:verify
```

This creates or refreshes:

- `demo/replayfence-capsule.json`
- `demo/replayfence-demo-output.json`
- `demo/replayfence-verify-output.json`

## Pharos Proof

ReplayFence uses Pharos Atlantic Testnet as the public exactly-once latch layer.

- Registry: `0xf3cb65898bc692495c64e2fa3981acbab2770a73`
- Deploy tx: `0xba7cf7df008b812a8ffefecc7688929531496f1a6bb3030fcb331365be5c399d`
- First consume tx: `0x7dcfe6f8306168d8c36730ea41b37606e54a294cc4931fcf268dd8aecc74941d`
- Reverted replay tx: `0xf428dbdf2915bad77a6cc2fa8b6d6a554c98d77f8e21407fdc462cdcbbdabe6d`

Evidence files:

- Deploy report: [`demo/pharos-deploy-report.json`](./demo/pharos-deploy-report.json)
- Consume/replay report: [`demo/pharos-consume-report.json`](./demo/pharos-consume-report.json)
- Contract: [`contracts/OnceLatchRegistry.sol`](./contracts/OnceLatchRegistry.sol)

To generate a fresh testnet proof with your own funded key:

```bash
cp .env.example .env.local
npm run contract:consume:pharos
```

Private keys must stay in `.env.local` or `.dev.vars`; both are ignored by git.

## What Is In This Repo

```text
skills/replayfence/              OpenClaw-installable Skill
packages/replayfence-skill/      hashing, latch, and capsule helpers
contracts/OnceLatchRegistry.sol  Pharos once-latch contract
scripts/                         contract compile/deploy/consume helpers
demo/                            final video, OpenClaw transcript, and proof artifacts
tests/replayfence-skill.test.mjs focused deterministic Skill tests
```

## Safety Boundary

ReplayFence is testnet evidence for deterministic action fingerprints. It is not production wallet security, phishing detection, or general transaction simulation.
