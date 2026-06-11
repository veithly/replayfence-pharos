1. ProofPay Receipt Skill

5-12 word rumor: APIs only answer after agents prove they paid.

Primary user scar: Agent teams can trigger paid APIs, but later cannot prove which request was paid, whether the amount was correct, or whether the API response corresponded to that payment.

Recent idea family: x402 paid APIs, agent wallets, programmable API procurement, verifiable receipts.

Freshness delta: Turns x402 from “HTTP 402 payment middleware” into a portable proof receipt on Pharos Atlantic, using eip155:688689 payment context plus eth_getProof verification.

Mutation operator: Convert a payment header into a self-verifying settlement artifact.

2026 clone trap avoided: Not an AI API marketplace, not a wrapper around x402, and not a generic payment demo. The Skill’s output is a reusable proof object that another agent can verify without trusting the API server.

Non-chat host surface: Browser DevTools panel, CLI command, or API gateway plugin.

Sponsor primitive basis:
Pharos Atlantic Testnet chainId: 688689; x402 ERC-20 paid API access; eth_getProof over a demo x402 settlement contract; independent SHA-256 hexary storage offset derivation.

Novelty delta: 8.5/10 — The novelty is making payment, API response, and state proof inseparable in one agent-callable receipt primitive.

Judge surprise reason: The judge sees a normal 402 Payment Required become a live Pharos payment, then a green proof receipt that can be tampered with and fail verification instantly.

New primitive: x402ProofReceipt

Stable Skill shape:

JSON
{
  "skill": "pharos.x402.proof_receipt",
  "input": {
    "api_url": "string",
    "method": "GET|POST",
    "request_body_hash": "0x...",
    "payer": "0x...",
    "token": "0x...",
    "max_amount": "string"
  },
  "output": {
    "chain_id": 688689,
    "tx_hash": "0x...",
    "request_hash": "0x...",
    "response_hash": "0x...",
    "storage_slot": "0x...",
    "proof": {},
    "verified": true
  }
}

First click: “Unlock API with Pharos x402.”

Demo interaction model:
Judge calls a locked demo API. The API returns HTTP 402. The Skill constructs the x402 payment, submits it on Pharos Atlantic, calls the API again, receives the result, then verifies settlement using eth_getProof.

0-10s hook:
A stage screen shows: “API says 402: payment required.” The judge clicks once. A Pharos eip155:688689 payment intent appears.

10-30s interaction:
The transaction lands on Atlantic. The API unlocks and returns a response only after the payment proof is detected.

30-60s visible consequence:
A QR-coded x402ProofReceipt.json appears with tx hash, request hash, response hash, storage slot, SHA-256 hexary proof trace, and explorer link.

Judge participation:
The judge edits the amount, request hash, or response hash in the artifact. The verifier flips from green to red.

Visual staging:
Three synchronized panes: HTTP 402 challenge → Pharos payment tx → proof tree verifier.

Durable proof artifact:
x402ProofReceipt.json plus a one-page SVG receipt containing request hash, response hash, Pharos tx hash, storage proof root, and verification status.

Sponsor/domain necessity: exactly what breaks if Pharos/x402/proof is removed:
Without x402, the demo becomes ordinary API-key billing. Without Pharos Atlantic, there is no visible eip155:688689 ERC-20 settlement or sponsor chain artifact. Without eth_getProof, the “receipt” is just server testimony instead of independently verifiable state.

One miracle:
The receipt verifies offline from the proof object, so the judge does not need to trust the demo API after the call.

2-3 P0 prototype must-haves:

Minimal x402-gated API endpoint.

Pharos Atlantic payment transaction and explorer link.

Independent verifier for the settlement contract storage proof.

Cut list:
No marketplace, no account abstraction dashboard, no complex subscription billing, no multi-token pricing.

Expected risks:
x402 implementation friction; proving ERC-20 state directly may be messy, so use a small settlement contract with known storage layout; RPC latency could affect stage timing.

Anti-Wrapper Score: 9/10
Component notes: x402 integration 2/2; Pharos state proof 3/3; reusable Skill schema 2/2; visible non-chat artifact 1/1; minimal generic AI wrapper risk 1/2.

Judge-Magnet Score: 11/12
Component notes: instant hook 2/2; sponsor visibility 3/3; concrete artifact 2/2; judge interaction 2/2; practical agent use case 2/2; visual polish risk 0/1.

2. HexProof State Notary Skill

5-12 word rumor: Explorers are screenshots; this gives agents state receipts.

Primary user scar: Agents, auditors, and hackathon judges often trust RPC responses or explorer pages, but cannot carry a compact, independently checked proof of Pharos state into another workflow.

Recent idea family: On-chain attestations, verifiable credentials, state proof verifiers, agent audit trails.

Freshness delta: Focuses specifically on Pharos’s custom SHA-256 hexary eth_getProof surface, including independent offset derivation, rather than assuming Ethereum Merkle Patricia proof semantics.

Mutation operator: Turn an RPC state read into a portable, replayable proof card.

2026 clone trap avoided: Not a generic notarization app, not “store a hash on-chain,” and not an explorer clone. The Skill verifies the proof surface itself.

Non-chat host surface: GitHub Action, browser extension, or CI badge for agent actions.

Sponsor primitive basis:
Pharos Atlantic Testnet eth_getProof; custom SHA-256 hexary account/storage proof verification; chainId 688689; explorer-backed tx visibility.

Novelty delta: 8/10 — The edge is treating Pharos state proofs as a first-class Skill output future agents can consume, not a debugging detail.

Judge surprise reason: The judge toggles a live on-chain value, and within one minute receives a portable proof card that still verifies after the page is refreshed or the RPC is disconnected.

New primitive: PharosStateCard

Stable Skill shape:

JSON
{
  "skill": "pharos.state.proof_card",
  "input": {
    "contract": "0x...",
    "storage_layout": "mapping(bytes32 => uint256)",
    "key": "0x...",
    "expected_value": "0x...",
    "block_tag": "latest"
  },
  "output": {
    "chain_id": 688689,
    "block_number": "number",
    "storage_slot": "0x...",
    "offset_derivation": {},
    "proof": {},
    "verified": true,
    "artifact_uri": "string"
  }
}

First click: “Toggle fact and notarize state.”

Demo interaction model:
A small Pharos contract stores claimHash => status. The judge toggles a claim. The Skill reads the claim, derives the storage offset independently, requests eth_getProof, verifies the SHA-256 hexary proof, and emits a proof card.

0-10s hook:
The screen shows a claim: “Sponsor demo primitive passed?” The judge clicks “Set true on Pharos.”

10-30s interaction:
The transaction confirms. The Skill computes the storage slot independently instead of trusting the contract UI.

30-60s visible consequence:
A green PharosStateCard appears with block number, storage key, account proof, storage proof, derived offset, and verification trace.

Judge participation:
The judge changes the expected value from true to false or swaps the storage key. Verification fails.

Visual staging:
Left: claim toggle. Center: derived offset formula. Right: animated SHA-256 hexary proof path ending in verified state root.

Durable proof artifact:
pharos-state-card.json plus pharos-state-card.svg suitable for attaching to a submission, CI run, or agent log.

Sponsor/domain necessity: exactly what breaks if Pharos/x402/proof is removed:
Without Pharos’s eth_getProof, the Skill loses its core proof surface. Without independent offset derivation, the verifier can be fooled by a convenient RPC response. Without Atlantic chain context, the card becomes a generic “trust me” state read.

One miracle:
The Skill displays both the claimed storage key and independently derived offset side by side, catching a class of fake-proof demos immediately.

2-3 P0 prototype must-haves:

Tiny demo contract with a known mapping layout.

eth_getProof fetcher against Pharos Atlantic RPC.

Independent SHA-256 hexary proof verifier with visible pass/fail trace.

Cut list:
No generalized Solidity layout parser, no ZK compression, no multi-chain support, no indexer dependency.

Expected risks:
Pharos proof format quirks may require careful parsing; storage layout assumptions must be documented; verifier bugs would be fatal to credibility.

Anti-Wrapper Score: 9.5/10
Component notes: direct proof verification 4/4; Pharos-specific semantics 3/3; reusable schema 1.5/2; UI-only wrapper risk 1/1.5.

Judge-Magnet Score: 10.5/12
Component notes: visible artifact 2/2; sponsor primitive clarity 3/3; judge tamper moment 2/2; practical reuse 2/2; less emotional than payment demos 1.5/3.

3. GasGuard Action Capsule Skill

5-12 word rumor: Agent transactions stop failing from optimistic gas guesses.

Primary user scar: Autonomous agents can compose transactions, but brittle gas estimates, nonce handling, and insufficient gas-limit buffers cause embarrassing failed actions during live demos and production workflows.

Recent idea family: Agent transaction relayers, safe execution wrappers, EIP-1559 helpers, chain operation auditors.

Freshness delta: Makes Pharos’s “EVM/EIP-1559 compatible but gas limit buffer matters” model visible as a before/after execution capsule with proof of resulting state.

Mutation operator: Turn a transaction sender into a reliability-certified action primitive.

2026 clone trap avoided: Not a wallet UI, not a generic gas estimator, and not an automation bot. The Skill produces a durable execution capsule with gas policy, tx evidence, and state proof.

Non-chat host surface: VS Code command palette, CI deployment step, or agent runtime plugin.

Sponsor primitive basis:
Pharos Atlantic RPC; chainId: 688689; EIP-1559-style fee fields; explicit gas-limit buffer policy; eth_getProof proving the post-transaction contract state.

Novelty delta: 7.5/10 — Gas handling itself is familiar, but binding buffered execution to a proof artifact makes it agent-grade and judge-visible.

Judge surprise reason: The Skill shows the raw estimate as unsafe, applies a Pharos-specific buffer, lands the tx, and proves the state mutation in one artifact.

New primitive: GasGuardActionCapsule

Stable Skill shape:

JSON
{
  "skill": "pharos.tx.gasguard_send",
  "input": {
    "to": "0x...",
    "calldata": "0x...",
    "value": "0",
    "gas_buffer_policy": "pharos_safe_default",
    "postcondition": {
      "contract": "0x...",
      "storage_key": "0x...",
      "expected_value": "0x..."
    }
  },
  "output": {
    "chain_id": 688689,
    "raw_estimate": "number",
    "gas_limit_used": "number",
    "buffer_ratio": "number",
    "tx_hash": "0x...",
    "post_state_proof": {},
    "postcondition_verified": true
  }
}

First click: “Send agent action safely.”

Demo interaction model:
The judge selects a contract action, such as incrementing a counter or registering a route hash. The Skill estimates gas, applies a Pharos buffer, sends the transaction, and proves the expected storage mutation.

0-10s hook:
The UI shows two paths: raw estimate and GasGuard buffered send. The raw path is marked “risky for autonomous execution.”

10-30s interaction:
The Skill submits the transaction with EIP-1559 fields and a visible gas-limit buffer. The tx hash appears with chainId 688689.

30-60s visible consequence:
The counter or registry value changes. A GasGuardActionCapsule.json appears with gas estimate, buffer, tx hash, and post-state proof.

Judge participation:
The judge chooses a tighter buffer or removes the postcondition. The Skill warns or refuses to certify the capsule.

Visual staging:
Gauge-style gas estimate → buffered transaction lane → post-state proof stamp.

Durable proof artifact:
gasguard-action-capsule.json containing transaction parameters, gas policy, postcondition, proof object, and verification result.

Sponsor/domain necessity: exactly what breaks if Pharos/x402/proof is removed:
Without Pharos, the gas-buffer lesson becomes generic EVM advice instead of a sponsor-specific reliability primitive. Without eth_getProof, the capsule cannot prove that the action achieved the requested postcondition. Without Atlantic tx visibility, the first-minute demo loses its concrete chain artifact.

One miracle:
The Skill refuses to call a transaction “successful” until the postcondition is proven, not merely until a tx hash exists.

2-3 P0 prototype must-haves:

Gas policy module with documented Pharos buffer defaults.

Transaction sender against Atlantic RPC.

Postcondition verifier using eth_getProof.

Cut list:
No full wallet, no private key manager beyond demo-safe signing, no multi-chain fee optimizer, no account abstraction.

Expected risks:
Gas behavior may not fail reliably onstage, so the demo should emphasize certified postcondition proof rather than forcing a failed transaction; fee volatility and RPC delays need graceful UI states.

Anti-Wrapper Score: 7.5/10
Component notes: Pharos gas specificity 2/3; proof-backed postcondition 3/3; stable agent schema 1.5/2; generic relayer resemblance penalty -1; artifact quality 2/2.

Judge-Magnet Score: 9/12
Component notes: practical pain 2/2; visible chain artifact 2/2; proof consequence 2/2; sponsor alignment 2/3; spectacle lower than x402 demos 1/3.

4. RouteVoucher SPN Skill

5-12 word rumor: Agents buy compute routes, then prove the route existed.

Primary user scar: Future agents will need to choose paid compute/API routes, but today routing decisions are opaque, non-portable, and unverifiable after the provider returns a result.

Recent idea family: Agentic compute routing, paid inference markets, restaked services, x402 API access, verifiable job receipts.

Freshness delta: Makes the SPN / L1-extension / restaking story concrete by producing a route commitment, x402 payment receipt, and Pharos storage proof in the first minute.

Mutation operator: Turn “choose a provider” into a proof-routed paid compute voucher.

2026 clone trap avoided: Not a vague SPN dashboard, not a “marketplace for AI agents,” and not a mock router. The demo emits a concrete route artifact with payment and proof.

Non-chat host surface: Node-based route board, CLI router, or agent runtime middleware.

Sponsor primitive basis:
Pharos Atlantic as the route commitment layer; x402 payment to a selected provider; eip155:688689 settlement context; eth_getProof proving the route registry entry; SPN/restaking narrative represented by signed provider manifests and route commitments.

Novelty delta: 8.8/10 — The idea makes a future cross-SPN routing primitive demoable now, without pretending a full SPN network exists.

Judge surprise reason: The judge sees two providers quote a task, the Skill chooses one, pays it with x402, writes the route hash to Pharos, and produces a proof voucher immediately.

New primitive: ProofRoutedComputeVoucher

Stable Skill shape:

JSON
{
  "skill": "pharos.spn.route_voucher",
  "input": {
    "job_hash": "0x...",
    "providers": [
      {
        "provider_id": "string",
        "spn_id": "string",
        "x402_endpoint": "string",
        "signed_manifest": "string"
      }
    ],
    "routing_policy": "cheapest|fastest|restake_weighted"
  },
  "output": {
    "chain_id": 688689,
    "selected_provider": "string",
    "route_hash": "0x...",
    "x402_receipt": {},
    "registry_tx_hash": "0x...",
    "route_storage_proof": {},
    "verified": true
  }
}

First click: “Route this job through Pharos.”

Demo interaction model:
A judge submits a small job, such as “classify this image hash” or “summarize this document hash.” Two mock providers return signed manifests and x402 prices. The Skill selects one provider, pays it, records the route hash on Pharos, verifies the registry storage proof, and emits a voucher.

0-10s hook:
Two provider cards appear: Fast SPN route and Cheap SPN route. Each shows price, latency claim, and signed manifest hash.

10-30s interaction:
The judge selects a routing policy. The Skill chooses a provider, sends x402 payment, and commits routeHash = hash(job, provider, policy, price, manifest) to a Pharos registry contract.

30-60s visible consequence:
A ProofRoutedComputeVoucher appears with selected route, x402 payment receipt, registry tx hash, and verified route storage proof.

Judge participation:
The judge changes the routing policy from cheapest to fastest, or tampers with the provider ID. The route hash changes, and the previous proof no longer verifies against the altered voucher.

Visual staging:
Provider race board → route commitment transaction → proof voucher minted as a QR card.

Durable proof artifact:
proof-routed-compute-voucher.json containing job hash, provider manifest hash, policy, x402 receipt, registry tx, route proof, and verifier result.

Sponsor/domain necessity: exactly what breaks if Pharos/x402/proof is removed:
Without Pharos, there is no shared route commitment layer for future cross-SPN coordination. Without x402, the route is not an agent-friendly paid compute route. Without eth_getProof, the voucher cannot prove the selected route was actually committed. Without the SPN/restaking frame, the provider manifests become ordinary API metadata.

One miracle:
The Skill avoids needing a real SPN network by making the artifact future-compatible: signed provider manifests now, native restaking / cross-SPN routing later.

2-3 P0 prototype must-haves:

Two mock provider endpoints that expose x402 prices and signed manifests.

Pharos route registry contract.

Voucher generator with route hash, payment receipt, and storage proof verifier.

Cut list:
No real distributed compute marketplace, no live restaking economics, no complex provider reputation system, no general workflow builder.

Expected risks:
Judges may punish “future SPN” vagueness unless the route commitment and proof are concrete; provider manifests must be simple and well documented; payment plus registry tx may need tight staging.

Anti-Wrapper Score: 8.5/10
Component notes: concrete route artifact 2/2; x402 payment 2/2; Pharos proof 2/2; SPN story grounded in manifests 1.5/2; mock-provider risk -1; stable schema 2/2.

Judge-Magnet Score: 11/12
Component notes: stage-visible routing choice 2/2; sponsor primitives stacked 3/3; future-agent relevance 2/2; concrete artifact 2/2; judge tamper interaction 1.5/2; implementation risk 0.5/1.