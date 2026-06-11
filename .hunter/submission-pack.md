# ReplayFence Submission Pack

## Title

ReplayFence Pharos Skill

## One-line description

ReplayFence blocks duplicate agent actions on Pharos and returns a proof capsule.

## Who it's for

ReplayFence is for agent builders who need to protect high-risk tool calls from duplicate execution. A retry after a timeout, queue redelivery, double click, or model loop should not send the same payout, deploy, order, or admin action twice.

## Problem

Most agent retry protection lives in a private service log. A user cannot prove which action ran, which duplicate failed, or whether another agent can trust the result. ReplayFence turns that retry boundary into a public Pharos latch and a portable capsule.

## Core Features

- User asks OpenClaw to protect a payout -> OpenClaw loads the installed `replayfence` skill -> the transcript records skill read, demo execution, verification, capsule read, and final answer.
- User runs the guest workbench once -> the UI reveals the Pharos consume tx -> the capsule stores the canonical action hash, latch key, tx, and replay status.
- User replays the same action -> the same latch rejects the duplicate -> the UI shows `REPLAY_REJECTED` and the reverted replay tx.
- Reviewer opens verifier/history -> the browser re-derives capsule fields -> the result shows the proof path without asking the builder.

## Sponsor Usage

ReplayFence uses Pharos Atlantic Testnet as the public exactly-once latch layer. The registry at `0xf3cb65898bc692495c64e2fa3981acbab2770a73` consumed one action and rejected the exact replay. Without Pharos, the product loses its public replay proof and becomes a private retry log.

## Demo steps

1. Open `https://replayfence-pharos.pages.dev/`.
2. Click `Try as Guest`.
3. Click `Fence + Execute Once`.
4. Click `Replay Same Action`.
5. Open the saved capsule or go to `/verify`.
6. Open `/openclaw-demo` to watch the OpenClaw prompt run the installed skill.

No credentials are required.

## Demo credentials

No login, wallet connection, or password is required. The hosted demo uses guest mode and seeded Pharos evidence.

## Known limitations

This is testnet-only evidence. The hosted workbench exposes seeded Pharos proof records and local guest history. Fresh public writes need a restricted relayer and allowlist before the private key can be safely connected to a public route.

## Video storybeat

The video starts with a normal OpenClaw prompt, shows the installed skill running, lands on the blocked duplicate result, then switches to the public workbench where a user can run the same once/replay/verify path.

## Deck vertebrae

Hook: duplicate agent action. Mechanism: canonical action hash plus Pharos latch. Proof: first consume tx, reverted replay tx, and capsule verification. User path: OpenClaw prompt plus browser workbench. Limit: testnet and seeded public evidence while the public relayer remains closed.

## FAQ for judges

**Is this an app feature or a Skill?**  
It is packaged as `skills/replayfence/SKILL.md`, installed into OpenClaw, and demonstrated through a normal TUI prompt. Evidence: `.hunter/openclaw-tui-interactive.report.json`.

**What happened on Pharos?**  
`OnceLatchRegistry.consume` accepted the first action and rejected the exact replay. Evidence: `demo/pharos-consume-report.json`, first consume tx `0x7dcfe6f8306168d8c36730ea41b37606e54a294cc4931fcf268dd8aecc74941d`, replay tx `0xf428dbdf2915bad77a6cc2fa8b6d6a554c98d77f8e21407fdc462cdcbbdabe6d`.

**Can I verify without watching the video?**  
Yes. Open `/verify`, inspect the capsule JSON, or read the repo evidence files linked in the README.
