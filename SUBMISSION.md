# Submission: Pharos Skill-to-Agent Dual Cascade Hackathon Phase 1

## Platform

DoraHacks

## Project Name

ReplayFence

## Tagline

ReplayFence blocks duplicate agent actions on Pharos.

## Short Description

ReplayFence blocks duplicate OpenClaw agent actions on Pharos and returns a proof capsule. The demo uses a normal typed prompt, a live Atlantic registry, one successful consume tx, and one reverted replay tx.

## Vision

Agents retry tool calls when networks blink. For payouts, deploys, orders, and admin actions, a duplicate side effect can cause real damage. ReplayFence gives each high-risk action a deterministic fingerprint and a public Pharos latch, so the first attempt consumes the latch and the exact replay fails with proof.

The project is packaged as an installable OpenClaw skill. In the recorded demo, a user types: "Can you use ReplayFence to protect a payout for me?" OpenClaw reads the installed skill, runs the guarded action, verifies the capsule, and returns `CONSUMED`, `REPLAY_REJECTED`, `VERIFIED`, plus the capsule path. The browser workbench shows the same loop for a fresh guest: run once, replay, inspect history, verify later.

## What It Does

A user asks OpenClaw to protect a payout. OpenClaw loads the installed `replayfence` skill, canonicalizes the action, consumes the Pharos latch once, tries the same action again, and reports that the replay was blocked. The user receives a ReplayFence Capsule with the action hash, latch key, consume tx, reverted replay tx, and verifier output. A judge can open the public workbench, run the same once/replay path, inspect capsule history, and verify the result later.

## How We Built It

ReplayFence uses Pharos Atlantic Testnet as the exactly-once state layer. `OnceLatchRegistry` is deployed at `0xf3cb65898bc692495c64e2fa3981acbab2770a73`. The live evidence includes deploy tx `0xba7cf7df008b812a8ffefecc7688929531496f1a6bb3030fcb331365be5c399d`, first consume tx `0x7dcfe6f8306168d8c36730ea41b37606e54a294cc4931fcf268dd8aecc74941d`, and reverted replay tx `0xf428dbdf2915bad77a6cc2fa8b6d6a554c98d77f8e21407fdc462cdcbbdabe6d`.

The Skill lives in `skills/replayfence/SKILL.md` with scripts for demo and verification. The browser surface mirrors the skill behavior so judges can test the user path without installing anything first.

## Demo Instructions

1. Open `https://replayfence-pharos.pages.dev/`.
2. Click `Try as Guest`.
3. Click `Fence + Execute Once`.
4. Click `Replay Same Action`.
5. Open the saved capsule, or go to `https://replayfence-pharos.pages.dev/verify`.
6. Watch the OpenClaw prompt demo at `https://replayfence-pharos.pages.dev/openclaw-demo`.

No login, wallet connection, or credentials are required.

## Links

- Live app: `https://replayfence-pharos.pages.dev/`
- OpenClaw demo: `https://replayfence-pharos.pages.dev/openclaw-demo`
- Demo video: `https://replayfence-pharos.pages.dev/evidence-media/replayfence-skill-demo-english-narrated.mp4`
- GitHub repo: `https://github.com/veithly/replayfence-pharos`
- Skill docs: `https://replayfence-pharos.pages.dev/docs/skill`
- Verifier: `https://replayfence-pharos.pages.dev/verify`

## Built With

Pharos Atlantic Testnet, Solidity, OpenClaw Skill, Next.js, Playwright.

## Track / Category

Pharos Phase 1 Skill Hackathon.

## Why It Fits The Judging Criteria

- Reusable Skill: OpenClaw installs `replayfence` and uses it from a normal TUI prompt.
- Practical agent safety: the project guards duplicate side effects caused by retries, redelivery, double clicks, and model loops.
- Pharos-native mechanism: the public latch and reverted replay tx are the proof surface.
- Clear UX: a guest can run once, replay, inspect history, and verify a capsule from the hosted app.
- Reproducible evidence: README links the OpenClaw report, Pharos consume report, runtime tests, claim matrix, and narrated demo.

## Challenges we ran into

The hardest part was making the demo honest. A command-line script alone looked too scripted, while a full custom agent would make the Skill feel tied to one runtime. The final demo uses OpenClaw TUI with a short typed user prompt, then shows the same once/replay result in the browser workbench.

## Accomplishments we're proud of

ReplayFence produced a full proof chain: installed skill, normal prompt, first consume tx `0x7dcfe6f8306168d8c36730ea41b37606e54a294cc4931fcf268dd8aecc74941d`, reverted replay tx `0xf428dbdf2915bad77a6cc2fa8b6d6a554c98d77f8e21407fdc462cdcbbdabe6d`, capsule export, verifier pass, public app, and narrated video.

## What We Learned

An agent safety primitive feels stronger when the failure is visible. The best moment is not a long explanation; it is the second click failing for the right reason.

## What's Next

Add a restricted public relayer with target-contract allowlisting and rate limits, then let other Skills wrap their own Pharos actions with ReplayFence capsules.
