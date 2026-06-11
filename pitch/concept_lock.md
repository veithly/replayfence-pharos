# Concept Lock

## Selected Concept

- Project name: ReplayFence
- Seven-word rumor: Agents double-click danger; Pharos blocks the replay.
- Hero copy: Fence one agent action in 60 seconds, reject the replay, and export a proof capsule.
- Track/domain: Pharos Phase 1 Skill module, agent safety, proof-carrying chain workflow.
- Sponsor/domain primitive:
  - Pharos Atlantic Testnet action latch contract.
  - Pharos transaction/explorer proof for the first action.
  - Pharos `eth_getProof` or proof-style verifier capsule for latch state.
  - Optional x402 wrapper as a P1 paid-call layer, not the P0 critical path.

## Why This Concept Wins

ReplayFence is a narrow, reusable Skill. It solves a real agent runtime scar: retries and ambiguous network failures can duplicate payments, deployments, orders, or contract writes. The demo is simple enough for a non-technical judge: click once, then click again. The first action executes; the duplicate is rejected; the proof capsule explains what happened.

## Recent Idea Signals

- Recent idea family: durable execution, one-shot action latch, proof-carrying verifier, agent tool safety.
- Freshness delta: idempotency leaves the private API header layer and becomes a public, proof-checkable Pharos artifact.
- Mutation operator: retry logic -> public one-shot action latch with independent proof.
- 2026 clone trap avoided: retry bot, workflow dashboard, wallet assistant, generic transaction sender.
- Non-chat host surface: Skill workbench, API endpoint, CLI/curl, agent runtime middleware.
- Visible 60-second consequence: duplicate attempt is rejected and a ReplayFence Capsule is saved.
- Durable proof artifact: `replayfence-capsule.json`.
- Why a judge who saw 2025 winners still cares: agent commerce and tool calls need exactly-once safety before they can handle money, deployments, or privileged actions.

## Anti-Wrapper Score

| Dimension | Score | Reason |
|---|---:|---|
| Residue | 2 | “Double-click a dangerous agent action; only one executes” is retellable. |
| Workflow scar | 2 | Agent retries after timeouts can duplicate irreversible side effects. |
| New primitive | 2 | Public one-shot action latch plus proof capsule. |
| Live consequence | 2 | First action changes latch state; duplicate returns rejected state. |
| Sponsor/domain necessity | 2 | Public Pharos state/proof makes the latch inspectable by another agent or judge. |

Total: 10/10.

## Judge-Magnet Score

| Dimension | Score | Reason |
|---|---:|---|
| First-pass survival | 2 | Public app, repo, proof capsule, Skill manifest, and docs can be linked directly. |
| Problem belief | 2 | Duplicate side effects are a real failure mode for autonomous agents. |
| Prototype cut | 2 | One latch contract, one workbench, one API, one proof capsule. |
| Aha/proof | 2 | Judge creates duplicate and sees proof-backed rejection. |
| Rubric coverage | 2 | Maps to reusable Skill, Pharos integration, UX, docs, and technical completion. |
| After-hack credibility | 1.5 | Strong extension path into x402 paid calls and Phase 2 agents. |

Total: 11.5/12.

## One-Miracle Budget

One miracle: a duplicate retry turns into a proof-backed rejection that feels immediate and obvious.

Everything else stays boring:
- deterministic canonical action hashing;
- small contract;
- local storage/database;
- readable API docs;
- simple guest demo state;
- Playwright tests.

## Demo Magic Moment

First 15 seconds:
- Judge sees: a dangerous action card and a button labelled `Run once`.
- User action: judge clicks once, then clicks again.

Live input:
- What changes during demo: the canonical action payload and click count.
- Who/what provides the input: judge or seeded demo flow.

Visible consequence:
- State before: no latch for `intent_hash`.
- State after: first call latches/executes; duplicate call is rejected.
- Proof artifact: ReplayFence Capsule with tx hash, intent hash, action hash, latch status, duplicate attempt ID, and verifier result.

Deterministic proof:
- Canonical action hash and latch state cannot be hand-waved as AI text.

Judge participation:
- Judge double-clicks the same action, changes one payload byte, and sees a new intent hash.

Interaction model:
- Primary control: action workbench with `Run once`, `Run duplicate`, `Mutate payload`, and `Verify capsule`.
- Feedback loop: accepted, duplicate rejected, mutated action treated as new.
- State transition: none -> latched -> duplicate rejected.
- Why this is better than slides: the judge creates the failure and watches it get fenced.

Showcase plan:
- 0-10s hook: “Please double-click this dangerous agent action.”
- 10-30s interaction: first action executes and writes a latch.
- 30-60s visible consequence: replay is rejected and proof capsule appears.
- 60-90s proof close: verifier replays capsule and shows latch state.
- Fallback if live chain fails: seeded capsule and local verifier path marked as fallback; app states the live RPC issue plainly.

Judge magnet:
- First-pass survival issue avoided: no registration wall, no generic chat, direct proof surface.
- Rubric line proven: reusable Skill module and Pharos integration.
- Likely judge question answered: “Why not a normal idempotency key?” Answer: the latch/proof is public and reusable by other agents.
- Why the judge remembers this after 20 submissions: they double-clicked and the duplicate failed with proof.
