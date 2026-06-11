# ReplayFence Submission Copy Board

## One-line rumor

ReplayFence lets an OpenClaw agent execute a risky action once, block the exact replay on Pharos, and hand the user a capsule they can verify.

## Judge Hooks

- OpenClaw proof: a normal user prompt asks for payout protection; the installed skill runs, rejects the duplicate, verifies the capsule, and answers with `ReplayFence check complete`.
- Pharos proof: `OnceLatchRegistry` is deployed on Atlantic Testnet, with one successful consume tx and one reverted replay tx carrying the same latch.
- Product proof: a fresh visitor can open the public workbench, run the guest path, inspect history, and verify the capsule without login.

## Audience Hooks

- For agent builders: wrap payment, deploy, order, or admin calls with one reusable exactly-once guard.
- For judges: click once, click again, and the duplicate fails with a visible proof trail.
- For future Pharos agents: reuse the capsule as a handoff artifact instead of trusting a private retry log.

## Proof Stack

- Live app: `https://replayfence-pharos.pages.dev/`
- OpenClaw demo: `https://replayfence-pharos.pages.dev/openclaw-demo`
- Video: `https://replayfence-pharos.pages.dev/evidence-media/replayfence-skill-demo-english-narrated.mp4`
- Repo: `https://github.com/veithly/replayfence-pharos`
- Registry: `0xf3cb65898bc692495c64e2fa3981acbab2770a73`
- First consume tx: `0x7dcfe6f8306168d8c36730ea41b37606e54a294cc4931fcf268dd8aecc74941d`
- Reverted replay tx: `0xf428dbdf2915bad77a6cc2fa8b6d6a554c98d77f8e21407fdc462cdcbbdabe6d`

## Sponsor / track fit

- Pharos Phase 1 asks for reusable Skill modules; ReplayFence ships as an OpenClaw-installable skill with docs, scripts, and recorded TUI evidence.
- Pharos is the mechanism: the registry consumes one latch and rejects the replay on Atlantic Testnet.
- Phase 2 agents can wrap payouts, deploys, orders, or admin calls and pass the capsule to a reviewer.

## Objection handling

- "Is it a custom agent?" No. The demo uses OpenClaw TUI with a short typed prompt and an installed `replayfence` skill.
- "Is Pharos decorative?" No. Removing Pharos turns the public latch and replay-revert evidence into a private database flag.
- "Can a fresh judge use it?" Yes. Guest mode exposes the run, replay, history, docs, and verifier paths with no wallet or login wall.
