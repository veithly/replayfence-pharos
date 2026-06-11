ReplayFence Build Spec — PRD + UIUX

Product stance: ReplayFence is a reusable Pharos Skill module first, and a public demo app second. The app exists to prove the Skill works under judge pressure: one action succeeds, the replay is rejected, and a Pharos-native proof capsule makes the latch state inspectable.

1. Detailed PRD
1. Project background

Project name: ReplayFence
Hero copy: Fence one agent action in 60 seconds, reject the replay, and export a proof capsule.
One-line hook: ReplayFence blocks duplicate agent actions on Pharos in 60 seconds.
Core primitive: PharosOnceLatch plus ReplayFence Capsule.

ReplayFence is the Phase 1 build for the Pharos Skill-to-Agent Dual Cascade Hackathon. Phase 1 rewards high-quality reusable Skill modules, not broad AI apps. The project should therefore ship as a composable agent safety primitive with a clean SDK, a contract, a verifier path, documentation, and a public operable demo harness.

The selected idea is IDEA-008 from the idea tournament. The strategic merge keeps ReplayFence as the main product while borrowing the PharosProof Surgeon proof capsule pattern for the proof/detail surface. The goal is to make latch state verifiable, Pharos-native, and easy to explain in a live judging demo.

The Phase 1 calendar matters. The build should optimize for the June 15, 2026 Skill submission deadline, with judging from June 16 to June 22, 2026. The implementation should avoid speculative surfaces and concentrate on the highest-scoring path: reusable Skill quality, originality, technical completion, agent practicality, composability, Pharos integration, UX, and documentation.

Judge signal is strong:

Judge	Result	Product implication
Rubric / Sponsor judge	ReplayFence top 3	Must feel Pharos-native, not generic EVM idempotency.
Technical judge	ReplayFence ranked #1	Ship ReplayFence as the main Skill; add a small PharosProof backend for registry state.
Product / Demo judge	ReplayFence ranked #1	Stage demo: dangerous action is double-clicked; first executes; duplicate is rejected with proof.
2. Problem definition

AI agents increasingly execute actions through APIs, smart contracts, and tool workflows. Many of these actions are not safe to repeat. A duplicate execution can happen because of retries, latency, UI double-clicks, model/tool loops, browser refreshes, queue redelivery, or multi-agent race conditions.

For conventional apps, idempotency keys are usually backend implementation details. For on-chain or agent-mediated execution, that is not enough. Builders need a reusable primitive that can answer:

Was this action already consumed?

Was the duplicate rejected before execution?

Can a third party verify the latch state without trusting app metadata?

Can an agent developer add this without building a full custom app?

ReplayFence solves this by putting a deterministic once-latch on Pharos and pairing each result with an exportable proof capsule.

The core problem is not “prevent all bad transactions.” The core problem is narrower and more demoable:

Prevent accidental or malicious replay of the same agent action, then produce evidence that the replay was blocked by Pharos-backed latch state.

ReplayFence should explicitly avoid claiming to be production-grade wallet security, authorization, custody protection, phishing protection, or transaction simulation. It is a replay-prevention Skill.

3. Target users
Primary users

Agent framework builders
Developers building autonomous agents that call APIs, contracts, or workflow tools and need a reusable replay guard.

Pharos hackathon judges / evaluators
Users who need to understand the value in less than one minute and verify that it is more than a UI-only demo.

Protocol and dapp developers on Pharos
Teams that want a simple “execute this once” latch for risky operations, keeper actions, payout intents, governance operations, claim flows, or agent-triggered contract calls.

Secondary users

AI operations / automation owners
People responsible for monitoring autonomous workflows and explaining why an action did or did not execute.

Security reviewers and auditors
Users who want exported artifacts showing action fingerprint, latch key, transaction, registry state, and proof verification steps.

Developer advocates / hackathon demo runners
People who need a reliable, memorable, stage-friendly demo.

4. User pain points
Pain point	Current failure mode	ReplayFence response
Duplicate agent actions	Tool retry, double-click, queue redelivery, model loop, or browser refresh causes the same action to fire twice.	Deterministic PharosOnceLatch consumes the action once and rejects duplicate attempts.
Generic idempotency feels off-chain	Backend idempotency logs are hard to verify and easy to dismiss as normal web-app logic.	Latch state is written to Pharos Atlantic Testnet and inspected through a proof capsule.
Hard to explain rejection	“Already processed” errors often lack auditable evidence.	Capsule shows action hash, latch key, first tx, replay attempt, registry state, and verifier result.
Agent devs need a module, not an app	A broad UI demo is not reusable.	Ship SDK, contract, API reference, integration snippet, and test harness.
Judges should not need a wallet	Wallet prompts or private credentials slow down demo evaluation.	Guest/demo access works before login or wallet connection.
Proof metadata may be misleading	A UI can display proof offsets or slot metadata that users must trust.	Verifier independently derives storage slot and Pharos proof offsets.
Chain interaction can be flaky	Gas estimate or RPC failures can kill the demo.	EIP-1559-compatible gas path with buffer, clear error recovery, local persisted history, and seeded fallback for display-only history.
5. Core requirements & priority
P0 requirements
ID	Requirement	Priority	Acceptance standard
R1	Guest user can run ReplayFence without wallet/login.	P0	From landing to first fenced action in under 60 seconds.
R2	First action consumes a latch on Pharos Atlantic Testnet.	P0	Contract tx succeeds on chainId 688689; tx hash and explorer link shown.
R3	Duplicate action is rejected before duplicate execution.	P0	Second attempt returns REPLAY_REJECTED; UI shows original latch and tx.
R4	ReplayFence Capsule is generated and exportable.	P0	JSON capsule includes action fingerprint, latch key, chain info, contract address, tx hash, replay result, and proof status.
R5	Guest capsule history persists for the session.	P0	Refreshing the browser preserves prior capsules for that guest session.
R6	Verifier re-derives latch key and storage proof target.	P0	Verifier does not trust capsule-provided offset metadata.
R7	App has at least four interactive product surfaces.	P0	Landing is not counted; /try, /runs, /capsules, /verify, /capsules/[id] qualify.
R8	Public operable app, not a static shell.	P0	Judge can execute the critical path live without private judge credentials.
R9	Clear contract/action safety boundaries.	P0	UI labels demo actions as testnet/simulated and does not imply production wallet security.
R10	Runtime test proves hero path.	P0	Playwright test double-submits action, confirms first success and second rejection.
P1 requirements
ID	Requirement	Priority	Acceptance standard
R11	Interactive custom action builder.	P1	User can configure a non-demo action fingerprint without executing unsafe external effects.
R12	Wallet-connected developer mode.	P1	User may consume latches using their own wallet on Pharos Atlantic.
R13	x402 wrapper on Pharos.	P1/stretch	Skill can be gated as an optional paid API wrapper without blocking P0.
R14	Framework adapters.	P1	Minimal examples for LangChain-style tool wrapper and generic TypeScript agent tool.
R15	Rich proof anatomy UI.	P1	Proof tree visualization shows account proof, storage proof, derived slot, path, and result.
P2 requirements
ID	Requirement	Priority	Acceptance standard
R16	Multi-action batch fencing.	P2	Multiple latch keys can be planned and consumed as a batch.
R17	Multi-agent shared scopes.	P2	Teams can define shared replay domains across several agents.
R18	Production authorization layer.	P2	Role-based registry permissions and policy controls.
R19	Long-term hosted capsule archive.	P2	Durable account-based history beyond guest session.
R20	Cross-chain variant.	P2	Non-Pharos adapters, only after Pharos-native path is excellent.
6. Solution overview

ReplayFence consists of five real backbones:

Storage/session backbone
Guest session, local/session history, SQLite or JSON-backed persistence, capsule export.

Chain/contract backbone
OnceLatchRegistry Solidity contract deployed to Pharos Atlantic Testnet.

Proof/verifier backbone
eth_getProof fetcher and Pharos-native verifier that independently derives storage targets.

API workflow backbone
Next.js API routes execute the fence, replay, proof fetch, capsule creation, and verification.

Multi-step workflow backbone
First action → latch consumed → action logged → replay attempted → replay rejected → capsule generated → proof verified/exported.

Conceptual architecture
User / Judge
  ↓
Next.js App Router UI
  ↓
ReplayFence API routes
  ↓
replayfence-skill TypeScript package
  ├─ canonicalizeAction()
  ├─ deriveLatchKey()
  ├─ consumeOnce()
  ├─ fetchPharosProof()
  └─ verifyReplayFenceCapsule()
  ↓
OnceLatchRegistry.sol on Pharos Atlantic Testnet
  ↓
ReplayFence Capsule stored in guest session history
Core primitive: PharosOnceLatch

PharosOnceLatch is the reusable Skill primitive. It wraps an agent action with a deterministic latch key.

The latch key should be derived from stable action identity, not from ephemeral click/run data. A replay should produce the same latch key.

Recommended derivation:

TypeScript
latchKey = keccak256(
  abi.encodePacked(
    "ReplayFence:v1",
    chainId,
    registryAddress,
    actorScope,
    toolId,
    sha256(canonicalActionJson)
  )
)

The exact derivation can be implemented in TypeScript and mirrored in tests. The important rule is that timestamps, request IDs, button-click IDs, and UI run IDs must not affect the latch key. Those belong in run metadata, not replay identity.

Contract: OnceLatchRegistry.sol

P0 contract should be intentionally small.

solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OnceLatchRegistry {
    enum LatchState {
        None,
        Consumed
    }

    struct LatchRecord {
        address actor;
        bytes32 actionHash;
        bytes32 capsuleHint;
        uint64 consumedAtBlock;
        uint64 consumedAtTimestamp;
    }

    mapping(bytes32 => LatchRecord) public latches;

    event LatchConsumed(
        bytes32 indexed latchKey,
        address indexed actor,
        bytes32 indexed actionHash,
        bytes32 capsuleHint,
        uint64 consumedAtBlock
    );

    error ReplayFenceReplay(
        bytes32 latchKey,
        address originalActor,
        uint64 originalBlock
    );

    function consume(
        bytes32 latchKey,
        bytes32 actionHash,
        bytes32 capsuleHint
    ) external {
        LatchRecord memory existing = latches[latchKey];

        if (existing.consumedAtBlock != 0) {
            revert ReplayFenceReplay(
                latchKey,
                existing.actor,
                existing.consumedAtBlock
            );
        }

        latches[latchKey] = LatchRecord({
            actor: msg.sender,
            actionHash: actionHash,
            capsuleHint: capsuleHint,
            consumedAtBlock: uint64(block.number),
            consumedAtTimestamp: uint64(block.timestamp)
        });

        emit LatchConsumed(
            latchKey,
            msg.sender,
            actionHash,
            capsuleHint,
            uint64(block.number)
        );
    }

    function isConsumed(bytes32 latchKey) external view returns (bool) {
        return latches[latchKey].consumedAtBlock != 0;
    }
}

The demo action should be safe and explicit: for example, “mock payout intent,” “mock agent transfer,” or “mock treasury action.” P0 should never imply that user funds or production wallets are protected.

ReplayFence Capsule

A capsule is the exported proof artifact.

TypeScript
type ReplayFenceCapsule = {
  schema: "replayfence.capsule.v1";
  capsuleId: string;
  createdAt: string;

  action: {
    label: string;
    toolId: string;
    actorScope: string;
    canonicalJson: unknown;
    canonicalHashSha256: string;
    actionHashKeccak: `0x${string}`;
  };

  latch: {
    chainId: 688689;
    registryAddress: `0x${string}`;
    latchKey: `0x${string}`;
    status: "CONSUMED" | "REPLAY_REJECTED" | "PROOF_PENDING" | "PROOF_VERIFIED";
    firstTxHash?: `0x${string}`;
    replayTxHash?: `0x${string}`;
    consumedAtBlock?: number;
    consumedAtTimestamp?: number;
  };

  proof: {
    source: "pharos.eth_getProof";
    blockNumber?: number;
    accountProof?: unknown;
    storageProof?: unknown;
    derivedStorageSlot?: `0x${string}`;
    derivedPath?: string;
    verifierStatus:
      | "NOT_REQUESTED"
      | "FETCHED"
      | "VERIFIED"
      | "FAILED"
      | "UNAVAILABLE";
    verifierNotes?: string[];
  };

  safety: {
    environment: "Pharos Atlantic Testnet";
    actionMode: "demo-safe" | "developer-configured";
    disclaimer: string;
  };
};
Pharos-native proof handling

The proof/detail surface must not be a generic receipt viewer. It should demonstrate Pharos integration through eth_getProof.

Pharos-specific requirements:

Use Pharos Atlantic Testnet:

chainId: 688689

RPC: https://atlantic.dplabs-internal.com

explorer: https://atlantic.pharosscan.xyz/

Support Pharos custom SHA-256 hexary account/storage proof surface.

The verifier must independently derive offsets and proof paths rather than trusting capsule metadata.

The verifier should derive:

the latch key from canonical action;

the Solidity mapping storage slot for latches[latchKey];

the account/storage proof target;

the expected encoded latch value.

Display proof metadata as evidence, not as trusted input.

If the live RPC proof endpoint is unavailable during judging, the app should clearly show PROOF_UNAVAILABLE while preserving the successful on-chain tx and replay rejection. It should not fake a verified proof.

7. User flows
Flow A — Judge / guest hero flow

Goal: Prove ReplayFence in 60 seconds.

User lands on /.

Clicks Try as Guest.

App creates a guest session and routes to /try.

User sees a preconfigured safe action: “Agent payout intent: invoice-042.”

User clicks Fence + Execute Once.

API derives canonical action hash and latch key.

API sends consume(latchKey, actionHash, capsuleHint) to OnceLatchRegistry on Pharos Atlantic.

First tx succeeds.

UI shows Action executed once and a tx link.

User clicks Replay Same Action or double-clicks the action trigger.

API attempts same latch.

Contract rejects because latch already exists.

UI shows Replay rejected with original tx and latch key.

App creates a ReplayFence Capsule.

User clicks Export Capsule or Inspect Proof.

Flow B — Agent developer integration flow

Goal: Show the Skill is reusable.

Developer opens /docs/skill.

Selects agent environment: “Generic TypeScript tool.”

Copies install command and wrapper code.

Opens /try?mode=custom.

Edits a safe action fingerprint, such as target API, method, and payload.

Runs “derive latch only” to preview latch key.

Runs “fence on Pharos” if they want live testnet execution.

Opens capsule detail and copies verifyReplayFenceCapsule() snippet.

Flow C — Proof reviewer flow

Goal: Verify a capsule without trusting UI metadata.

Reviewer opens /verify.

Pastes capsule JSON or selects one from guest history.

Clicks Verify Capsule.

App re-canonicalizes the action.

App re-derives latch key.

App re-derives storage slot and Pharos proof path.

App fetches or uses attached eth_getProof material.

App reports:

action hash match;

latch key match;

storage slot derived;

account/storage proof result;

registry value matches consumed latch.

8. User Cases
User Case 1 — Judge double-clicks a dangerous agent action

Persona: Hackathon judge
Context: Judge wants immediate proof that ReplayFence is not a static demo.
Precondition: Public app is deployed; no wallet required.
Primary path:

Judge clicks Try as Guest.

Judge sees a safe but dangerous-looking action: “Approve mock payout intent.”

Judge clicks Fence + Execute Once.

The app writes a once-latch to Pharos Atlantic.

Judge clicks Replay Same Action.

The duplicate is rejected.

Judge exports the proof capsule.

Success criteria:

First tx succeeds.

Second attempt is rejected.

UI shows first tx hash, latch key, replay rejection reason, and capsule export.

No private judge credentials are required.

The action is clearly labeled testnet/demo-safe.

User Case 2 — Agent developer wraps a tool call

Persona: AI agent developer
Context: Developer has a tool that sends payout requests. They want to prevent duplicate execution.
Precondition: Developer has access to the ReplayFence Skill package or API.
Primary path:

Developer opens /docs/skill.

Developer copies the TypeScript wrapper.

Developer defines a canonical action object:

toolId

target system

method

normalized params

actor scope

Developer calls fence.once(action) before the dangerous tool.

First execution returns CONSUMED.

Replay returns REPLAY_REJECTED.

Developer stores or exports the capsule.

Success criteria:

Integration requires a small wrapper, not a full app.

The SDK exposes deterministic action canonicalization.

Replay outcome is typed and easy for an agent runtime to interpret.

User Case 3 — Security reviewer verifies a proof capsule

Persona: Protocol security reviewer
Context: Reviewer receives a ReplayFence Capsule from an agent run.
Precondition: Capsule JSON exists.
Primary path:

Reviewer opens /verify.

Reviewer pastes the capsule.

Verifier recomputes action hash and latch key.

Verifier derives storage slot/path independently.

Verifier checks proof/state against Pharos registry.

Reviewer sees a pass/fail report.

Success criteria:

Verifier does not trust capsule offset metadata.

If live proof is unavailable, the result is honest and marked unavailable rather than fabricated.

Reviewer can download the verification report.

9. Demo critical path & Hero Moment
Demo critical path

The demo should be optimized around one unforgettable sequence:

The judge double-clicks a dangerous action. The first action executes. The second is rejected. ReplayFence exports a proof capsule.

60-second script

0–10 seconds
Open landing page. Hero copy is visible. Click Try as Guest.

10–25 seconds
On /try, show the preloaded safe action:

Agent action: Mock payout intent
Amount: 100 demo units
Target: Demo Treasury
Risk: Duplicate payout if replayed

Click Fence + Execute Once.

25–40 seconds
Transaction confirms. UI shows:

CONSUMED

latch key

tx hash

Pharos explorer link

capsule draft created

40–50 seconds
Click Replay Same Action or rapidly double-click. UI shows:

REPLAY_REJECTED

original consumed latch

duplicate blocked before action execution

50–60 seconds
Click Export Capsule or Inspect Proof. Show the capsule detail page with proof status and derived latch metadata.

Hero Moment UI copy

Primary success message:

First action executed. Replay rejected. Capsule ready.

Replay rejection message:

ReplayFence blocked the duplicate because this action’s PharosOnceLatch was already consumed.

Safety footnote:

Demo action is testnet-safe and does not move real funds. ReplayFence prevents duplicate execution; it is not production wallet security.

10. Pages / modules plan

Landing page does not count as a product surface. P0 should ship at least five interactive surfaces.

Surface 1 — Action Sandbox

Route: /try
Purpose: Main demo runner.
Primary component: ActionFencePanel

Capabilities:

Start guest session.

View preconfigured safe dangerous action.

Run first fenced execution.

Replay same action.

Show status timeline.

Link to capsule detail.

Export capsule.

Core controls:

Fence + Execute Once

Replay Same Action

Reset Demo Action

Inspect Capsule

Export Capsule

Surface 2 — Run / Latch Monitor

Route: /runs/[runId] or /runs/latest
Purpose: Show the multi-step workflow in a traceable timeline.
Primary component: LatchTimeline

Capabilities:

Show canonicalization step.

Show latch key derivation.

Show Pharos tx submission.

Show first execution result.

Show replay attempt.

Show rejection reason.

Show capsule creation.

This surface makes the app feel operable, not just a single-button toy.

Surface 3 — Capsule History

Route: /capsules
Purpose: Guest session history.
Primary component: CapsuleHistoryTable

Capabilities:

List capsules generated in guest session.

Filter by status:

CONSUMED

REPLAY_REJECTED

PROOF_VERIFIED

PROOF_FAILED

Open capsule detail.

Export individual capsule.

Clear local guest history.

P0 requirement: history persists across browser refresh for the guest session.

Surface 4 — Capsule Detail / Proof Surgeon

Route: /capsules/[capsuleId]
Purpose: Detail and proof view inspired by PharosProof Surgeon.
Primary component: ProofCapsuleInspector

Capabilities:

Show action fingerprint.

Show canonical JSON.

Show latch key.

Show registry address.

Show first tx and replay attempt.

Show proof status.

Fetch proof.

Run verifier.

Export capsule JSON.

Copy SDK verification snippet.

Proof sections:

Action canonicalization

Latch derivation

Contract state

Pharos eth_getProof

Independent verifier result

Surface 5 — Capsule Verifier

Route: /verify
Purpose: Standalone verification tool.
Primary component: CapsuleVerifier

Capabilities:

Paste capsule JSON.

Upload capsule JSON.

Select from guest history.

Verify action hash.

Verify latch key.

Derive storage target.

Fetch proof if missing.

Show pass/fail report.

Surface 6 — Skill Integration Guide

Route: /docs/skill
Purpose: Reusability surface for Phase 1 scoring.
Primary component: SkillInstallWizard

Capabilities:

Copy install command.

Copy TypeScript wrapper.

Copy contract ABI/address.

See API route examples.

Select “server relayer,” “wallet signer,” or “local testnet” mode.

Run “derive latch key” preview.

11. Visual direction & UI principles
Visual concept

ReplayFence should feel like a security control panel for agent actions, not a generic Web3 landing page.

The visual metaphor is a “fence” or “latch” around an action:

Open latch before execution.

Consumed latch after first execution.

Locked latch on replay.

Capsule as portable proof.

Design principles
1. Make the state machine obvious

The user should always know which state the action is in:

Ready → Fencing → Consumed → Replay Attempted → Replay Rejected → Capsule Ready

Use state badges consistently:

READY

FENCING

CONSUMED

REPLAY_REJECTED

PROOF_PENDING

PROOF_VERIFIED

PROOF_FAILED

2. Show the useful cryptographic objects, but do not overwhelm

The UI should expose:

action hash;

latch key;

registry address;

tx hash;

block number;

storage slot;

proof status.

Long hex values should be truncated by default with copy buttons and expandable details.

3. Make the replay rejection emotionally satisfying

The replay rejection should be visually stronger than the first success. The judge should immediately understand that the duplicate was stopped.

Suggested message hierarchy:

Large badge: Replay rejected

Subtext: Same latch key already consumed

Evidence: original tx hash and block

CTA: Inspect proof capsule

4. Keep Pharos present

Use Pharos-specific labels throughout:

“Pharos Atlantic Testnet”

“chainId 688689”

“PharosOnceLatch”

“Pharos eth_getProof”

“SHA-256 hexary proof”

“PharosScan”

This prevents the project from feeling like generic EVM idempotency.

5. Be honest about safety

Every risky-action demo should include a visible safety note:

This is a testnet-safe mock action. ReplayFence prevents duplicate execution of a defined action fingerprint. It does not replace wallet security, authorization, policy checks, or transaction simulation.

12. Technical constraints
Required stack

Preferred stack should be accepted:

Frontend/app: Next.js App Router + TypeScript

Storage: SQLite, local JSON, or file-backed seed history for demo mode

Chain client: Viem or ethers

Contract tooling: Solidity + Hardhat

Runtime proof test: Playwright

Deployment: Public URL with guest/demo access

Pharos constraints

Use Pharos Atlantic Testnet:

TypeScript
export const pharosAtlantic = {
  id: 688689,
  name: "Pharos Atlantic Testnet",
  rpcUrl: "https://atlantic.dplabs-internal.com",
  explorerUrl: "https://atlantic.pharosscan.xyz",
};

Technical implications:

EVM/EIP-1559 compatible.

Gas-limit buffer matters.

Use gas estimation plus buffer, for example estimatedGas * 120n / 100n.

Avoid fragile gas assumptions in the critical demo path.

Show readable errors if RPC, gas, or proof calls fail.

Proof constraints

Pharos eth_getProof uses a custom SHA-256 hexary account/storage proof surface. The app must not simply display proof metadata and call it verification.

The verifier must:

Re-canonicalize the action JSON.

Recompute action hash.

Recompute latch key.

Derive the Solidity mapping storage slot.

Derive the Pharos proof path or offset independently.

Verify proof material against expected latch state.

Report exact failure stage if verification fails.

P0 can keep the verifier narrow: it only needs to verify OnceLatchRegistry.latches[latchKey]. It does not need to become a general Pharos proof explorer.

Credential constraints

P0 must work without private judge credentials.

Recommended P0 approach:

Public deployed app uses a server-side low-value testnet relayer.

Relayer only calls OnceLatchRegistry.consume.

No judge wallet required.

No production funds.

Local development supports:

.env.example;

Hardhat local deployment;

optional seeded history mode for UI tests;

clear instructions for configuring a Pharos relayer key.

Safety constraints

Do not claim:

wallet drain protection;

general transaction firewalling;

production custody security;

malicious contract protection;

authorization enforcement;

complete replay protection outside the defined action fingerprint.

Do claim:

duplicate prevention for a deterministic action fingerprint;

on-chain once-latch state;

replay rejection before duplicate demo action execution;

exportable capsule evidence;

Pharos-native proof path.

x402 constraint

x402 on Pharos is P1/stretch only. It should not be on the P0 critical path unless it is trivially isolated and cannot break the core demo.

13. Success metrics
Demo success metrics
Metric	Target
Time from landing to first action attempt	≤ 30 seconds
Time from landing to replay rejection	≤ 60 seconds
Wallet/login required for hero path	0
Number of interactive product surfaces	≥ 4
Wired beats across use cases	≥ 5
Critical path Playwright pass rate	100% before submission
Replay rejection clarity	Judge can explain outcome in one sentence
Technical success metrics
Metric	Target
First latch consume succeeds on Pharos Atlantic	≥ 95% during manual runs
Duplicate action rejected	100% when same action fingerprint is replayed
Capsule export success	100% after first run
Guest history survives refresh	100% in same browser session
Verifier derives latch key independently	100% for generated capsules
Verifier reports honest proof status	No false “verified” state
Contract size/complexity	Minimal, auditable in one screen
Hackathon scoring success metrics
Rubric area	ReplayFence evidence
Skill module quality/usability	SDK package, contract, API, docs, copyable integration snippet
Originality	Agent replay fence with Pharos proof capsule
Technical completion	Live contract, live duplicate rejection, proof verification path
AI Agent practical use case	Prevent duplicate risky tool execution
Reusability/composability	Generic action canonicalization and once() wrapper
Pharos integration	Atlantic Testnet, eth_getProof, Pharos-specific verifier
UX	60-second guest hero path
Documentation	/docs/skill, README, test instructions
14. Risks & cut list
Primary risks
Risk	Impact	Mitigation
Pharos proof endpoint behavior is hard to verify quickly	Could weaken proof capsule claim	Keep P0 verifier narrow to OnceLatchRegistry; add fixtures; mark proof unavailable honestly if RPC proof fails.
Demo relayer runs out of gas/funds	Hero path fails	Fund low-value relayer before judging; add health check; show fallback seeded capsules only as history, not as live success.
ReplayFence feels like generic EVM idempotency	Sponsor fit weakens	Keep Pharos labels, proof capsule, custom eth_getProof, chainId, and explorer links central in UX.
Contract overbuilt	Delays and audit risk	Keep OnceLatchRegistry tiny. No roles, no batching, no policy engine in P0.
UI overbuilt	Critical path gets fragile	Build /try, /capsules, /capsules/[id], /verify, /docs/skill; cut dashboards and analytics.
Replay key includes unstable fields	Duplicate not detected	Strict canonicalization tests; exclude timestamps, run IDs, request IDs from latch identity.
User misunderstands safety	Reputation risk	Persistent safety copy: demo-safe, testnet, not wallet security.
x402 distracts from P0	Time risk	P1/stretch only.
Explicit P0 cuts

Cut from P0:

x402 paid access wrapper.

Production wallet security claims.

Multi-chain support.

Full proof explorer for arbitrary contracts.

Account system.

Team workspaces.

Analytics dashboard.

Batch fencing.

Complex role/policy engine.

Real asset movement.

Autonomous agent chat UI.

Keep P0 focused on one excellent thing:

Fence one action, reject the replay, export and verify the capsule.

2. Detailed UIUX interaction plan
Screen map with routes
Route	Screen	Counts as product surface?	P0/P1	Purpose
/	Landing / hero	No	P0	Explain hook and route user to guest demo.
/try	Action Sandbox	Yes	P0	Run first action and replay attempt.
/runs/[runId]	Run / Latch Timeline	Yes	P0	Show workflow steps and execution evidence.
/capsules	Capsule History	Yes	P0	Persist and browse guest capsules.
/capsules/[capsuleId]	Capsule Detail / Proof Surgeon	Yes	P0	Inspect action, latch, tx, proof, export.
/verify	Capsule Verifier	Yes	P0	Paste/upload/select capsule and verify.
/docs/skill	Skill Integration Guide	Yes	P0	Make the reusable module obvious.
/health	System Health	Optional	P1	RPC, relayer, contract, proof endpoint health.
/builder	Custom Action Builder	Optional	P1	Configure custom action fingerprints.
P0 navigation structure

Top nav:

ReplayFence

Try

Capsules

Verify

Skill Docs

Persistent right-side or header status:

Network: Pharos Atlantic

chainId: 688689

Guest session: active

Relayer: healthy / degraded

First-run flow
0–10 seconds: orient and enter guest mode

Screen: /

Visible content:

Hero copy: “Fence one agent action in 60 seconds, reject the replay, and export a proof capsule.”

One-line hook: “ReplayFence blocks duplicate agent actions on Pharos in 60 seconds.”

CTA: Try as Guest

Secondary CTA: View Skill Docs

Safety note: “Testnet-safe demo. No wallet required.”

Interaction:

User clicks Try as Guest.

App creates guest session with local/session ID.

Route to /try.

10–30 seconds: consume first latch

Screen: /try

Default card:

Demo action
Agent payout intent: invoice-042
Tool: demoTreasury.requestPayout
Amount: 100 demo units
Replay risk: duplicate payout
Network: Pharos Atlantic Testnet

Primary CTA:

Fence + Execute Once

On click:

Button enters loading state.

Timeline adds Canonicalizing action.

Timeline adds Deriving latch key.

Timeline adds Submitting PharosOnceLatch.

Chain tx sent.

Success state appears.

Success state:

CONSUMED
First action executed once.
Latch key: 0x...
Tx: 0x...
30–60 seconds: replay and reject

User clicks:

Replay Same Action

Replay path:

Same canonical action is reused.

Same latch key is derived.

Contract call reverts or preflight detects consumed state.

API returns typed rejection.

UI shows a strong rejection state.

Success message:

REPLAY_REJECTED
ReplayFence blocked the duplicate because this action’s latch was already consumed.

CTA appears:

Inspect Proof Capsule

Export Capsule

2–3 minutes: proof and reuse

User opens /capsules/[capsuleId].

They see:

Action fingerprint.

Latch key.

First tx.

Replay attempt.

Derived storage slot.

Proof fetch button.

Verification result.

Export JSON button.

Copy SDK snippet.

Then user opens /docs/skill to see this is a reusable Skill module, not only a demo.

P0 screen states
/try — Action Sandbox
State	UI behavior
Default	Shows demo action card, risk note, network badge, Fence + Execute Once button.
Loading	Button disabled; status timeline animates through canonicalization, latch derivation, tx submission.
Empty	If no demo action is loaded, show Load safe demo action. This should rarely appear.
Error	Show typed error: RPC unavailable, relayer unavailable, gas estimate failed, contract revert, proof pending. Include Retry and Use seeded example capsule only as non-live fallback.
Success	Shows CONSUMED, tx hash, latch key, and enables Replay Same Action.
Replay success	Shows REPLAY_REJECTED, original tx, blocked reason, and capsule CTAs.
/runs/[runId] — Run / Latch Timeline
State	UI behavior
Default	Timeline with current run status and all completed steps.
Loading	Skeleton timeline rows for tx/proof details.
Empty	“No run selected. Start from Action Sandbox.” CTA to /try.
Error	“Run not found or expired.” CTA to capsule history.
Success	Full timeline: canonicalized, latch derived, consumed, replay attempted, replay rejected, capsule created.
/capsules — Capsule History
State	UI behavior
Default	Table/list of guest capsules sorted newest first.
Loading	Skeleton rows with status badges.
Empty	“No capsules yet. Fence your first action.” CTA to /try.
Error	“Could not load guest history.” Offer local reset and retry.
Success	Capsule cards with status, action label, created time, tx hash, proof status, export/open actions.
/capsules/[capsuleId] — Capsule Detail / Proof Surgeon
State	UI behavior
Default	Capsule summary, action hash, latch key, tx details, proof panel.
Loading	Proof panel skeleton while fetching eth_getProof.
Empty	“Capsule not found.” CTA to /capsules.
Error	Show exact failed stage: hash mismatch, slot derivation failed, proof fetch failed, proof verification failed.
Success	Shows PROOF_VERIFIED if verifier passes; otherwise honest partial status such as PROOF_FETCHED or PROOF_UNAVAILABLE.
/verify — Capsule Verifier
State	UI behavior
Default	Paste/upload capsule JSON, or select from guest history.
Loading	Verification checklist runs step by step.
Empty	“Paste a ReplayFence Capsule or select one from history.”
Error	JSON parse error, schema error, chain mismatch, action hash mismatch, proof mismatch, or RPC unavailable.
Success	Verification report with pass/fail rows and exportable report.
/docs/skill — Skill Integration Guide
State	UI behavior
Default	Install command, wrapper example, contract address, API examples.
Loading	Minimal skeleton for deployed addresses or health status.
Empty	Not applicable; docs should always render.
Error	If live contract metadata unavailable, docs still show static instructions with warning.
Success	Copyable snippets and “Run this in demo” link.
Wired beats across user cases

The app must wire at least these beats:

Beat	User case	UI	Backend
1	Judge hero	Guest session starts	POST /api/demo/session
2	Judge hero	First action fenced	POST /api/actions/fence
3	Judge hero	Latch consumed on Pharos	OnceLatchRegistry.consume
4	Judge hero	Duplicate rejected	POST /api/actions/replay
5	Judge hero	Capsule generated and saved	POST /api/capsules or inside action API
6	Reviewer	Capsule verified	POST /api/verify
7	Developer	SDK snippet copied / route opened	/docs/skill client interaction
8	Reviewer	Proof fetched	POST /api/proof/fetch
Demo choreography
3-minute judging script
0:00–0:20 — Frame the problem

Say:

ReplayFence is a reusable Pharos Skill that prevents duplicate agent actions. Watch the same dangerous action get attempted twice.

Click Try as Guest.

0:20–0:50 — First execution

On /try, point to the action card:

This is a testnet-safe mock payout intent. The agent action is canonicalized into a stable fingerprint.

Click Fence + Execute Once.

Wait for CONSUMED.

Say:

The first attempt consumed the PharosOnceLatch on Atlantic Testnet.

0:50–1:15 — Replay rejection

Click Replay Same Action or double-click.

Say:

Same action, same latch key. ReplayFence rejects it before duplicate execution.

Show REPLAY_REJECTED.

1:15–2:15 — Proof capsule

Click Inspect Proof Capsule.

Show:

canonical action;

latch key;

tx hash;

Pharos registry;

proof panel;

verification checklist.

Say:

The capsule is portable. The verifier re-derives the latch key and proof target; it does not trust the UI metadata.

2:15–3:00 — Reusability

Open /docs/skill.

Say:

The app is only the harness. The deliverable is the Skill: TypeScript wrapper, Solidity registry, Pharos proof verifier, and Playwright runtime proof.

End on:

One action executed. Replay rejected. Proof capsule exported.

Mobile behavior

ReplayFence should be fully usable on mobile, even if the primary judge demo is desktop.

Layout

Single-column layout below tablet width.

Action card first, status timeline second, proof details third.

Sticky bottom CTA on /try:

before first run: Fence + Execute Once

after first run: Replay Same Action

after replay: Inspect Capsule

Long hex values wrap or truncate with copy button.

Proof tree becomes accordion sections.

Capsule history becomes stacked cards instead of table rows.

Interaction

Minimum touch target: 44px.

Avoid hover-only affordances.

Copy buttons need visible success feedback.

Double-click demo should also have an explicit Replay Same Action button for mobile.

Performance

Initial route should load fast enough for a conference network.

Do not load proof tree libraries on landing.

Lazy-load proof detail UI on /capsules/[id].

Accessibility notes

All critical status changes use aria-live="polite" or aria-live="assertive" depending on severity.

Replay rejection should not rely on color alone; include icon, text, and status badge.

Buttons must be keyboard reachable and have visible focus states.

Copy buttons should announce copied content type, not the full hash.

Hex strings should have accessible labels:

“Copy latch key”

“Copy transaction hash”

“Open transaction in Pharos explorer”

Proof verification checklist should be a semantic list.

Timeline should be readable by screen readers in chronological order.

Loading states should use text labels, not only spinners.

Respect reduced motion settings.

Error messages should describe recovery actions.

Use plain-language safety disclaimers near risky-action labels.

Test selectors

Use stable data-testid selectors. Do not bind tests to visual text where avoidable.

Global
Element	Selector
App shell	data-testid="app-shell"
Network badge	data-testid="network-badge"
Guest badge	data-testid="guest-session-badge"
Toast region	data-testid="toast-region"
Landing
Element	Selector
Hero headline	data-testid="hero-headline"
Try as Guest CTA	data-testid="guest-start-button"
Skill docs CTA	data-testid="skill-docs-link"
/try
Element	Selector
Demo action card	data-testid="demo-action-card"
Action risk note	data-testid="action-risk-note"
Fence button	data-testid="fence-run-button"
Replay button	data-testid="replay-same-action-button"
Reset demo button	data-testid="reset-demo-button"
Latch status badge	data-testid="latch-status-badge"
Latch key value	data-testid="latch-key-value"
Transaction hash value	data-testid="tx-hash-value"
Explorer link	data-testid="pharos-explorer-link"
Timeline	data-testid="latch-timeline"
Capsule CTA	data-testid="inspect-capsule-button"
Export CTA	data-testid="export-capsule-button"
/runs/[runId]
Element	Selector
Run ID	data-testid="run-id"
Canonicalization step	data-testid="step-canonicalized"
Latch derivation step	data-testid="step-latch-derived"
Chain submission step	data-testid="step-chain-submitted"
Replay step	data-testid="step-replay-attempted"
Rejection step	data-testid="step-replay-rejected"
/capsules
Element	Selector
Capsule list	data-testid="capsule-history-list"
Capsule row/card	data-testid="capsule-history-item"
Empty state	data-testid="capsule-empty-state"
Status filter	data-testid="capsule-status-filter"
Clear history	data-testid="clear-history-button"
/capsules/[capsuleId]
Element	Selector
Capsule ID	data-testid="capsule-id"
Capsule status	data-testid="capsule-status"
Canonical JSON panel	data-testid="canonical-json-panel"
Proof panel	data-testid="proof-panel"
Fetch proof button	data-testid="fetch-proof-button"
Verify proof button	data-testid="verify-proof-button"
Verifier result	data-testid="verifier-result"
Derived storage slot	data-testid="derived-storage-slot"
Export capsule button	data-testid="capsule-export-button"
/verify
Element	Selector
Capsule paste textarea	data-testid="capsule-json-input"
Capsule upload input	data-testid="capsule-upload-input"
Select history capsule	data-testid="select-history-capsule"
Verify button	data-testid="verify-capsule-button"
Verification checklist	data-testid="verification-checklist"
Verification report	data-testid="verification-report"
/docs/skill
Element	Selector
Install command	data-testid="install-command"
Copy install	data-testid="copy-install-button"
SDK snippet	data-testid="sdk-snippet"
API example	data-testid="api-example"
Contract address	data-testid="contract-address"
3. P0 / P1 / P2 scope cut list
P0 — Must ship

P0 is the submission-quality product.

Product

Guest mode before wallet/login.

/try Action Sandbox.

/runs/[runId] timeline.

/capsules guest capsule history.

/capsules/[capsuleId] capsule/proof detail.

/verify standalone capsule verifier.

/docs/skill integration guide.

Exportable ReplayFence Capsule JSON.

Safety copy on all risky-action surfaces.

Skill module

packages/replayfence-skill

canonicalizeAction()

deriveActionHash()

deriveLatchKey()

consumeOnce()

detectReplay()

createCapsule()

verifyReplayFenceCapsule()

TypeScript types for FenceResult, ReplayFenceCapsule, and VerifyResult.

Contract

OnceLatchRegistry.sol

consume()

isConsumed()

LatchConsumed event

custom replay error

Hardhat deploy script

deployed address documented for Pharos Atlantic

API

POST /api/demo/session

POST /api/actions/fence

POST /api/actions/replay

GET /api/runs/[runId]

GET /api/capsules

GET /api/capsules/[capsuleId]

POST /api/proof/fetch

POST /api/verify

Storage

Guest session cookie or local/session ID.

SQLite or JSON-backed server storage.

Browser localStorage mirror for guest capsule resilience.

Seeded example capsules for empty-state exploration only.

Tests

Unit tests for canonicalization and latch-key determinism.

Contract tests for first consume and replay revert.

API tests for fence/replay/capsule creation.

Playwright hero path:

start guest;

run first action;

replay same action;

confirm REPLAY_REJECTED;

export capsule;

verify capsule.

P1 — Should ship if P0 is stable

Wallet-connected developer mode.

Custom action fingerprint builder.

x402 wrapper as optional paid Skill/API access.

Rich proof anatomy visualization.

LangChain-style adapter example.

More robust Pharos proof health diagnostics.

Capsule import from file on /verify.

“Copy as cURL” and “Copy as TypeScript” snippets.

Relayer health page.

Optional deploy-to-local script with one command.

P2 — Later / cut from hackathon submission

Team accounts.

Persistent cloud archives beyond guest session.

Production role-based authorization.

Policy engine.

Multi-chain support.

Batch latches.

Real treasury integrations.

Arbitrary contract proof explorer.

Complex analytics.

Notification integrations.

Agent chat interface.

Marketplace packaging.

4. Traceability matrix
Req ID	Requirement	Priority	Route / component	API / contract / data	State	Test selector / test	Evidence produced
R1	Guest can use app without wallet/login	P0	/, GuestStartButton	POST /api/demo/session, guest cookie/localStorage	guestSession.active	guest-start-button, Playwright guest.spec.ts	Guest session ID visible; no wallet modal.
R2	First action consumes latch on Pharos Atlantic	P0	/try, ActionFencePanel	POST /api/actions/fence, OnceLatchRegistry.consume	latch.status=CONSUMED	fence-run-button, latch-status-badge	Tx hash, block number, Pharos explorer link.
R3	Duplicate action is rejected	P0	/try, ReplayButton	POST /api/actions/replay, contract replay error or consumed precheck	latch.status=REPLAY_REJECTED	replay-same-action-button	UI shows original tx and replay rejection reason.
R4	Capsule is generated and exportable	P0	/try, /capsules/[id], ExportCapsuleButton	createCapsule(), GET /api/capsules/[id]	capsule.status=READY	export-capsule-button, capsule-export-button	Downloaded replayfence-capsule-*.json.
R5	Guest capsule history persists across refresh	P0	/capsules, CapsuleHistoryTable	SQLite/JSON store plus localStorage mirror	history.items.length>0	capsule-history-list	Capsule remains after page reload.
R6	Verifier re-derives latch key	P0	/verify, CapsuleVerifier	POST /api/verify, deriveLatchKey()	verify.latchKeyMatch=true	verify-capsule-button, verification-checklist	Verification report shows independently derived latch key.
R7	Verifier derives storage slot/path independently	P0	/capsules/[id], ProofCapsuleInspector	verifyReplayFenceCapsule(), Pharos proof adapter	verify.storageSlotDerived=true	derived-storage-slot, verifier-result	Report shows derived storage slot and proof path.
R8	At least four interactive product surfaces	P0	/try, /runs/[id], /capsules, /capsules/[id], /verify, /docs/skill	App Router	route availability	Playwright route smoke tests	Screenshots or test report for each route.
R9	Public operable app, not static shell	P0	Full app	Live API + contract + storage	app.health=operable	end-to-end hero test	Judge can execute live first/replay path.
R10	Clear safety boundaries	P0	SafetyNotice, action card, docs	Static copy, capsule safety field	safety.environment=testnet	action-risk-note	Capsule and UI state demo-safe/testnet disclaimer.
R11	Skill docs make module reusable	P0	/docs/skill, SkillInstallWizard	SDK package exports	docs render	sdk-snippet, install-command	Copyable install and wrapper snippet.
R12	API workflow is typed and composable	P0	/docs/skill, API examples	FenceResult, ReplayFenceCapsule, VerifyResult	typed responses	API contract tests	JSON examples and TypeScript types.
R13	Runtime proof through Playwright	P0	/try to /capsules/[id]	Full stack	E2E pass	hero-replay.spec.ts	Test artifact showing first consume and replay rejection.
R14	Pharos specificity is visible	P0	network badge, proof panel, docs	chain config, eth_getProof adapter	network.chainId=688689	network-badge, proof-panel	UI shows Pharos Atlantic, chainId, proof source.
5. Concise implementation strategy
Build the vertical slice first

The winning slice is:

Guest session
→ Safe demo action
→ Deterministic latch key
→ OnceLatchRegistry.consume on Pharos
→ Replay same action
→ Rejection
→ Capsule saved
→ Capsule inspected/exported
→ Verifier re-derives key/proof target

Do not build agent chat, wallets, teams, analytics, arbitrary proof exploration, or x402 until that path is reliable.

Recommended repo structure
replayfence/
  apps/
    web/
      app/
        page.tsx
        try/page.tsx
        runs/[runId]/page.tsx
        capsules/page.tsx
        capsules/[capsuleId]/page.tsx
        verify/page.tsx
        docs/skill/page.tsx
        api/
          demo/session/route.ts
          actions/fence/route.ts
          actions/replay/route.ts
          runs/[runId]/route.ts
          capsules/route.ts
          capsules/[capsuleId]/route.ts
          proof/fetch/route.ts
          verify/route.ts
      components/
      lib/
  packages/
    replayfence-skill/
      src/
        canonicalize.ts
        latch.ts
        capsule.ts
        pharosProof.ts
        verify.ts
        types.ts
  contracts/
    src/OnceLatchRegistry.sol
    test/OnceLatchRegistry.t.sol or hardhat tests
    scripts/deploy.ts
  tests/
    e2e/hero-replay.spec.ts
  README.md
Build order
Step 1 — Contract and deterministic latch

Implement OnceLatchRegistry, deploy to local Hardhat, and write tests:

first consume() succeeds;

second consume() with same latch key reverts;

different latch key succeeds;

event emits expected values.

Then deploy to Pharos Atlantic and record the deployed address.

Step 2 — Skill package

Implement the TypeScript package before the UI gets complex:

TypeScript
const action = canonicalizeAction({
  toolId: "demoTreasury.requestPayout",
  actorScope: "guest-demo",
  target: "demo-treasury",
  params: {
    invoiceId: "invoice-042",
    amount: "100",
    unit: "DEMO",
  },
});

const latchKey = deriveLatchKey({
  chainId: 688689,
  registryAddress,
  actorScope: "guest-demo",
  toolId: action.toolId,
  canonicalAction: action,
});

Add tests proving that semantically identical action objects produce the same latch key, while materially different action objects produce different latch keys.

Step 3 — API and storage

Add the API routes and storage:

POST /api/actions/fence does live chain consume.

POST /api/actions/replay uses the same action fingerprint.

Both routes write run events and capsule records.

Guest history is keyed by guestSessionId.

Use SQLite if time allows. Use file-backed JSON if speed matters more. The important thing is that the app is operable and session history survives refresh.

Step 4 — UI surfaces

Build UI in this order:

/try

/capsules/[capsuleId]

/capsules

/verify

/docs/skill

/runs/[runId]

The /try page should get the most polish because it carries the demo.

Step 5 — Proof adapter

Implement proof verification narrowly:

fetch eth_getProof for the registry and derived storage slot;

attach raw proof to capsule;

independently derive action hash, latch key, and storage target;

produce a structured verification report.

Use honest statuses:

NOT_REQUESTED

FETCHED

VERIFIED

FAILED

UNAVAILABLE

Never show VERIFIED unless the verifier completed all required checks.

Step 6 — Playwright proof

Write one critical E2E test:

visit /
click Try as Guest
click Fence + Execute Once
expect status CONSUMED
click Replay Same Action
expect status REPLAY_REJECTED
click Inspect Capsule
expect capsule detail visible
click Verify
expect verifier report visible
export capsule

This test is part of the submission evidence. It proves ReplayFence is not a static demo.

Submission positioning

The final submission should emphasize:

Reusable Skill module: SDK, contract, verifier, docs.

Agent-native use case: duplicate tool/action prevention.

Pharos-native integration: Atlantic Testnet, chainId 688689, eth_getProof, SHA-256 hexary proof handling.

Award-worthy demo: double-click action; first succeeds; replay rejected; proof capsule exported.

Clear safety boundary: testnet-safe replay guard, not production wallet security.

The north star remains simple:

In 60 seconds, a judge should see an agent action execute once, see the replay blocked, and hold a proof capsule that explains why.