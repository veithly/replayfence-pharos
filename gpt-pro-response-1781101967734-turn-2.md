1. ReplayFence Idempotency Skill

5-12 word rumor: Agents can retry dangerous calls without double-spending.

Primary user scar: Agent runtimes retry after timeouts, partial failures, or ambiguous API responses. For side-effecting calls, that can mean duplicate payments, duplicate contract writes, duplicate order placement, or duplicate job dispatch.

Recent idea family: Durable execution, idempotency keys, agent tool safety, transaction replay guards, side-effect orchestration.

Freshness delta: Moves idempotency from private server headers into a shared Pharos latch that both the agent and tool provider can independently verify.

Mutation operator: Replace soft client-side retry logic with a public one-shot action latch.

2026 clone trap avoided: Not a wallet assistant, not a retry bot, not a generic workflow engine. The Skill’s value is the Pharos-enforced “this exact action hash may execute once” artifact.

Non-chat host surface: Agent runtime middleware, OpenAPI gateway plugin, CLI wrapper, CI deployment step.

Sponsor primitive basis: Pharos Atlantic chainId: 688689; EIP-1559 transaction submission; gas-limit buffer policy for reliable latch creation; eth_getProof over the latch contract’s consumed-state mapping. Optional demo target can be an x402-gated endpoint, but the primitive is not an x402 receipt.

Novelty delta: 8.7/10 — Idempotency is familiar, but a reusable agent-callable, on-chain, proof-checkable action latch is meaningfully different from ordinary API retry keys.

Judge surprise reason: The judge double-clicks the same dangerous action. The first click executes; the second is rejected as a duplicate using the same Pharos intent hash.

New primitive: PharosOnceLatch

JSON
{
  "skill": "pharos.action.once_latch",
  "input": {
    "skill_id": "string",
    "schema_version": "string",
    "action_payload_hash": "0x...",
    "caller": "0x...",
    "expiry_block": "number",
    "duplicate_policy": "reject|return_previous",
    "postcondition": {
      "contract": "0x...",
      "storage_key": "0x...",
      "expected_value": "0x..."
    }
  },
  "output": {
    "chain_id": 688689,
    "intent_hash": "0x...",
    "latch_tx_hash": "0x...",
    "execution_status": "latched|consumed|duplicate_rejected",
    "proof": {},
    "postcondition_verified": true,
    "artifact_uri": "string"
  }
}

First click: “Fence this action before running.”

0-10s hook: The demo shows a risky agent action: “Retry-safe paid API call / contract write.” The judge is invited to click twice.

10-30s interaction: The Skill canonicalizes the action payload, derives an intent_hash, submits lock(intent_hash) to Pharos Atlantic, and displays the tx hash with chainId: 688689.

30-60s visible consequence: The same action is retried. The latch contract rejects the duplicate, and the Skill emits a green PharosOnceLatch.json showing the original latch tx, duplicate rejection, and proof of consumed state.

Judge participation: The judge double-clicks, then changes one byte of the payload. Same payload fails as duplicate; changed payload becomes a new intent hash.

Durable proof artifact: pharos-once-latch.json plus a QR/SVG card containing intent hash, payload hash, latch tx hash, consumed-state proof, expiry block, and verifier result.

Sponsor/domain necessity: Without Pharos, the latch becomes a private server-side idempotency key that another agent or provider cannot trust. Without eth_getProof, the duplicate rejection is just an API log. Without the Pharos gas-buffer lesson, the latch itself can fail during the exact retry storm it is supposed to prevent.

One miracle: The Skill makes retries safe without requiring the downstream tool provider to redesign its whole API; it only needs to honor the Pharos latch check.

2-3 P0 prototype must-haves:

Minimal OnceLatchRegistry contract with lock, consume, and duplicate rejection.

Canonical action-hash derivation library with stable schema.

Proof generator/verifier for latch state using Pharos eth_getProof.

Cut list: No wallet UI, no general workflow builder, no cross-chain support, no complex key management, no full x402 billing layer.

Expected risks: Payload canonicalization must be extremely precise; retry demos can look trivial unless the duplicate side effect is obvious; proof verification must be documented enough for judges to trust it.

Anti-Wrapper Score: 9/10 — On-chain enforcement 3/3; Pharos proof artifact 2/2; reusable agent schema 2/2; non-chat host fit 1/1; minor generic-idempotency resemblance penalty -1.

Judge-Magnet Score: 10.5/12 — Double-click demo clarity 2/2; visible Pharos primitive 3/3; concrete artifact 2/2; practical agent scar 2/2; implementation risk 1.5/3.

2. LogPulse Trigger Envelope Skill

5-12 word rumor: On-chain events become typed agent triggers, not webhooks.

Primary user scar: Agents need to react to blockchain events, but ordinary webhook triggers are brittle: they lose schema context, can be spoofed, and rarely produce a durable proof that the trigger actually came from the target chain event.

Recent idea family: On-chain automation, event indexing, agent triggers, typed webhooks, verifiable workflow starts.

Freshness delta: Converts a Pharos event into a stable Skill invocation envelope with chain ID, ABI fragment, log index, event hash, and proof-backed trigger registry state.

Mutation operator: Turn an EVM log into an agent-callable signed trigger object.

2026 clone trap avoided: Not a dashboard, not an indexer, not a chain notification bot. The module emits a portable trigger envelope future agents can consume as input.

Non-chat host surface: Webhook gateway, serverless trigger, Zapier-like node, agent runtime listener, GitHub Action.

Sponsor primitive basis: Pharos Atlantic chainId: 688689; event-emitting contract; trigger registry contract that stores event_hash => trigger_state; eth_getProof verifying the registry entry; gas-buffered transaction for reliable event emission.

Novelty delta: 8.4/10 — Chain event listeners are common, but proof-backed conversion into a stable Skill-to-Agent trigger primitive is unusually aligned with the hackathon theme.

Judge surprise reason: A Pharos contract event appears on one side of the screen, and a typed future-agent invocation appears on the other side with the same event hash and a proof-backed registry entry.

New primitive: PharosTriggerEnvelope

JSON
{
  "skill": "pharos.event.trigger_envelope",
  "input": {
    "contract": "0x...",
    "event_signature": "TaskPosted(bytes32,string,uint256)",
    "abi_fragment": {},
    "from_block": "number",
    "target_skill_schema": "string"
  },
  "output": {
    "chain_id": 688689,
    "tx_hash": "0x...",
    "log_index": "number",
    "event_hash": "0x...",
    "decoded_args": {},
    "target_skill_input": {},
    "trigger_registry_slot": "0x...",
    "proof": {},
    "verified": true
  }
}

First click: “Emit task event.”

0-10s hook: The judge clicks “Post task to Pharos.” A small contract emits TaskPosted(jobHash, skillId, bounty) and records the event hash in a trigger registry.

10-30s interaction: The Skill detects the event, decodes it against the ABI fragment, maps it into a stable target Skill input, and displays the derived event_hash.

30-60s visible consequence: A PharosTriggerEnvelope.json appears. It contains the tx hash, log index, decoded event args, target Skill input, registry storage slot, and proof that the trigger was registered on Pharos.

Judge participation: The judge edits the skillId, jobHash, or logIndex in the envelope. The verifier rejects the altered trigger.

Durable proof artifact: pharos-trigger-envelope.json plus a visual event card showing contract address, event signature, log index, target Skill schema, Pharos tx hash, and verification status.

Sponsor/domain necessity: Without Pharos, this collapses into an ordinary webhook. Without chainId: 688689, the trigger is replayable across chains. Without the registry proof, the agent must trust the listener service. Without the gas-buffered event transaction, the demo risks showing a trigger that never becomes a reliable chain artifact.

One miracle: The Skill gives future agents a clean typed input object while preserving the hard provenance of the original Pharos event.

2-3 P0 prototype must-haves:

Demo TaskEmitter plus TriggerRegistry contract.

ABI event decoder and event-hash canonicalizer.

Envelope generator with storage proof verification.

Cut list: No full indexer, no generalized automation platform, no marketplace, no multi-chain listener, no chat UI.

Expected risks: Event proof requires a registry write because eth_getProof proves state rather than logs directly; ABI decoding must be deterministic; RPC lag could delay the first-minute reveal.

Anti-Wrapper Score: 8.8/10 — Event-to-Skill primitive 2/2; Pharos registry/proof dependency 3/3; stable reusable schema 2/2; non-chat host fit 1/1; webhook resemblance penalty -0.2.

Judge-Magnet Score: 10.8/12 — Clear visual cascade 2/2; strong Skill-to-Agent alignment 3/3; concrete Pharos artifact 2/2; tamper interaction 2/2; implementation complexity risk 1.8/3.