# Demo Interaction Plan

## Selected Concept

- Idea ID: `IDEA-008`
- Name: ReplayFence
- Core primitive: PharosOnceLatch plus ReplayFence Capsule.

## 0-10s Hook

The screen says: “Please double-click this dangerous agent action.”

Visible UI:
- Action card: `release_demo_payment`
- Amount: `25 demo units`
- Target: seeded recipient
- Buttons: `Run once`, `Run duplicate`, `Mutate payload`

Judge action:
- Click `Run once`.

## 10-30s Interaction

System response:
- Canonicalizes the payload.
- Displays `intent_hash`.
- Writes or simulates writing a latch on Pharos Atlantic.
- Shows tx/status as `accepted`.

Judge action:
- Click `Run duplicate` or double-click the same action.

## 30-60s Visible Consequence

System response:
- Duplicate request maps to same `intent_hash`.
- ReplayFence rejects the duplicate.
- A ReplayFence Capsule appears.

Visible proof fields:
- `chain_id: 688689`
- `intent_hash`
- `first_tx_hash`
- `duplicate_attempt_id`
- `latch_status: consumed`
- `duplicate_result: rejected`
- `verifier_result: pass`

## 60-90s Proof Close

Judge clicks `Verify capsule`.

System response:
- Recomputes canonical action hash.
- Checks capsule fields against stored/chain state.
- Shows pass/fail transcript.

## Judge Participation

- Double-click the same action.
- Mutate one payload byte and observe a new hash.
- Tamper capsule JSON and see verifier fail.

## Visual Staging

- Left: action payload and canonical hash.
- Center: Pharos latch lifecycle: none -> latched -> consumed.
- Right: proof capsule and verifier transcript.

## Fallback If Live Chain Fails

- Use seeded `replayfence-capsule.seed.json`.
- UI labels fallback clearly: `Seeded proof fallback because live RPC is unavailable`.
- The local verifier still recomputes payload hash and rejects tampered duplicate fields.
- Submission docs state the live RPC limitation plainly.

## Implementation Handoff

- P0 route: `/app`
- P0 API: `POST /api/skills/replayfence/run`, `GET /api/capsules/:id`, `POST /api/capsules/:id/verify`
- P0 contract: `OnceLatchRegistry`
- P0 storage: saved capsule history per guest session.
- P0 tests: duplicate rejection, mutation creates new hash, capsule tamper fails.
