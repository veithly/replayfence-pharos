# User Cases

## User case 1: Judge Tests Exactly-Once Agent Action (HERO PATH)

- Primary user: hackathon judge or future Phase 2 agent builder.
- Goal: verify that an agent action cannot execute twice after a retry or double click.
- Preconditions: guest demo action is available; Pharos demo latch contract or seeded fallback data exists.
- Steps:
  1. Open ReplayFence.
  2. Select seeded action: `release_demo_payment`.
  3. Click `Run once`.
  4. Click `Run duplicate`.
  5. Open the ReplayFence Capsule.
  6. Click `Verify capsule`.
- Demo-visible moment: first action succeeds, second action is rejected, and the proof capsule verifies.
- Success criteria: judge can retell “the duplicate got blocked by a public Pharos latch.”

## User case 2: OpenClaw Agent Runtime Installs ReplayFence

- Primary user: agent developer.
- Goal: install ReplayFence into a generic OpenClaw runtime so retries return the original result or a duplicate rejection.
- Preconditions: developer has OpenClaw CLI and this repo's `skills/replayfence` directory.
- Steps:
  1. Run `openclaw skills install ./skills/replayfence --as replayfence --force`.
  2. Run `openclaw skills info replayfence`.
  3. Run the bundled demo command against `assets/demo-action.json`.
  4. Receive a capsule with first attempt `CONSUMED` and replay attempt `REPLAY_REJECTED`.
  5. Open the capsule in `/verify` or inspect the JSON.
- Demo-visible moment: OpenClaw reports the skill is ready, visible to model, and available as command.
- Success criteria: future agent can use ReplayFence without the web UI or a custom agent runtime.

## User case 3: Developer Mutates Payload To Prove Canonicalization

- Primary user: technical judge or developer.
- Goal: understand what counts as “same action.”
- Preconditions: existing accepted action.
- Steps:
  1. Click `Mutate payload`.
  2. Change amount, target, or metadata by one byte.
  3. Run the action again.
  4. Compare original and mutated intent hashes.
- Demo-visible moment: exact duplicate is rejected, mutated action becomes a new intent hash and is blocked until confirmed.
- Success criteria: canonicalization is visible and deterministic, not magic.
