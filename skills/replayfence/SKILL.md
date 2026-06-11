---
name: replayfence
description: Use ReplayFence to fence duplicate agent actions, derive stable action hashes and latch keys, run an OpenClaw-installable exactly-once demo, create ReplayFence Capsules, and verify whether a replay was rejected. Use when an agent needs a reusable Pharos/OpenClaw action replay guard or proof capsule workflow.
---

# ReplayFence

ReplayFence is an OpenClaw-installable skill for exactly-once agent actions. It helps a generic agent canonicalize an action, derive a stable latch key, run a first attempt, reject the exact replay, and export a ReplayFence Capsule.

## When To Use

Use this skill when the user asks to:

- prevent duplicate/replayed agent tool actions;
- derive a stable action fingerprint or latch key;
- demonstrate ReplayFence inside OpenClaw;
- export or verify a ReplayFence Capsule;
- explain or run the Pharos once-latch flow.

## Core Rule

Never claim a Pharos transaction or proof succeeded unless the command used live Pharos configuration and returned real tx/proof evidence. Local demo mode is useful, but it must be labeled `local-demo`.

## Quick Demo

From this skill directory, run:

```bash
node scripts/replayfence.mjs demo --reset --out replayfence-capsule.json --format pretty
```

Expected result:

- first attempt: `CONSUMED`;
- replay attempt: `REPLAY_REJECTED`;
- output file: `replayfence-capsule.json`;
- environment: `local-demo`.

For a custom action:

```bash
node scripts/replayfence.mjs demo --reset --action path/to/action.json --out replayfence-capsule.json
```

## Normal User Prompt Path

When a user asks a short request such as "protect this payout" or "check whether the duplicate was blocked", use this two-step path. Do not ask the user for commands.

```bash
SKILL_DIR="$HOME/.openclaw/workspace/skills/replayfence"
OUT_DIR="$HOME/openclaw-test"
mkdir -p "$OUT_DIR"
node "$SKILL_DIR/scripts/replayfence.mjs" demo --reset --format pretty --out "$OUT_DIR/replayfence-capsule.json"
node "$SKILL_DIR/scripts/replayfence.mjs" verify --capsule "$OUT_DIR/replayfence-capsule.json" --format pretty
```

After the demo and verify commands succeed, stop running commands and answer the user. Report:

- what action was protected;
- first attempt status;
- replay attempt status;
- verifier result;
- capsule path;
- a plain-language note that local-demo mode is not live Pharos proof.

Do not rerun `node scripts/replayfence.mjs ...` from an unknown working directory after a successful verify.

## OpenClaw Recording Demo

To show that ReplayFence works as a normal OpenClaw-installed skill, install it first and then run the bundled script from OpenClaw's workspace copy:

```bash
npx --yes openclaw skills install ./skills/replayfence --as replayfence --force
npx --yes openclaw skills info replayfence
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs demo --reset --format pretty --out demo/replayfence-capsule.json --transcript demo/openclaw-skill-showcase.out --json-out demo/replayfence-demo-output.json --pharos-report demo/pharos-consume-report.json
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs verify --capsule demo/replayfence-capsule.json --format pretty --json-out demo/replayfence-verify-output.json
```

The pretty demo should show:

- mode: `local-demo`;
- canonical SHA-256 and latch key;
- first attempt: `CONSUMED`;
- replay attempt: `REPLAY_REJECTED`;
- capsule path;
- verifier hint;
- optional recorded Pharos report with first consume tx and reverted replay tx.

If `--pharos-report` is provided, keep the wording clear: the terminal skill run is local-demo evidence, while the report is separately recorded live Pharos evidence.

## Agent Workflow

1. Identify the action's stable identity:
   - `toolId`
   - `actorScope`
   - target system
   - method
   - normalized params
2. Exclude volatile fields:
   - `runId`
   - `requestId`
   - `timestamp`
   - `clickedAt`
   - `nonce`
3. Run the bundled demo or derive command.
4. Return the capsule path and the two key statuses.
5. If live Pharos mode is not configured, say so plainly and offer the local demo capsule.

## Commands

```bash
node scripts/replayfence.mjs derive --action assets/demo-action.json
node scripts/replayfence.mjs derive --action assets/demo-action.json --format pretty
node scripts/replayfence.mjs demo --reset --action assets/demo-action.json --out replayfence-capsule.json
node scripts/replayfence.mjs demo --reset --action assets/demo-action.json --out replayfence-capsule.json --format pretty
node scripts/replayfence.mjs verify --capsule replayfence-capsule.json
node scripts/replayfence.mjs verify --capsule replayfence-capsule.json --format pretty
```

## Output Contract

A ReplayFence Capsule includes:

- `schema`
- `capsuleId`
- `createdAt`
- `environment`
- `action.canonicalJson`
- `action.canonicalHashSha256`
- `latch.latchKey`
- `latch.status`
- `attempts.first.status`
- `attempts.replay.status`
- `proof.verifierStatus`
- `safety.disclaimer`

## Pharos Live Mode

Live Pharos mode requires project configuration outside this skill:

- `PHAROS_RPC_URL`
- `PRIVATE_KEY`
- `ONCE_LATCH_REGISTRY_ADDRESS`

If any are missing, do not fake chain success. Use local demo mode and mark proof as `NOT_REQUESTED` or `UNAVAILABLE`.
