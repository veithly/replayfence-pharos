1. TollReceipt Skill

Name: TollReceipt Skill

5-12 word rumor: Every agent call leaves a paid, verifiable access receipt.

Primary user scar: API owners want agent-payable endpoints, but API keys, Stripe receipts, and chat logs do not prove which agent request was paid for, what resource was released, or whether the payment was valid on the target chain.

Recent idea family: x402 agent commerce, MCP tool schemas, Request Network-style durable invoice objects, Sigstore-style signed receipts.

Freshness delta: Most x402 demos stop at “payment unlocks content.” This Skill turns the whole access loop into a reusable artifact that a later agent, auditor, or judge can verify.

Mutation operator: Convert “paywall middleware” into “receipt-producing agent primitive.”

2026 clone trap avoided: Not a marketplace, not a generic payment dashboard, not a broad monetized-agent app. It is one composable Skill: price, challenge, verify payment, release resource, emit receipt.

Non-chat host surface: API docs “Try paid call” panel, MCP inspector, CLI/cURL demo, browser extension badge for paid API calls.

Product-loop basis: x402 loop: 402 challenge → signed payment → resource access → payment response, combined with Request-style invoice identity and Sigstore-style artifact verification.

Novelty delta: 7.8/10 — The payment loop is mature, but the hackathon novelty is making the paid access receipt itself the Skill output and future-agent input.

Judge surprise reason: The judge clicks an unpaid API call, sees a real 402, signs a tiny Pharos/x402 payment, receives the resource, and immediately downloads a verifiable receipt instead of just seeing “success.”

New primitive: PharosAccessReceipt — a signed JSON artifact binding request hash, invoice terms, x402 payment response, Pharos chain ID, resource hash, timestamp, and optional on-chain anchor.

First click: “Call protected resource without payment.”

Demo interaction model: The judge plays the consuming agent. The Skill returns a 402 challenge, accepts signed payment on eip155:688689, releases a small resource, then emits a receipt verifier link.

0-10s hook: The unpaid call fails visibly with a structured 402 challenge showing chainId: 688689, price, recipient, expiry, and resource hash.

10-30s interaction: The judge signs the payment. The Skill validates the x402 payment response and returns the protected payload.

30-60s visible consequence: A receipt card appears with green checks for “payment valid,” “resource hash matches,” “chain target Pharos Atlantic,” and “receipt artifact saved.”

Judge participation: The judge chooses one of three resources, intentionally calls it unpaid, then pays and verifies the resulting receipt.

Visual staging: Three-column stage: Challenge, Payment, Receipt. Each column lights up as the loop advances. Include a small Pharos explorer link or transaction/status badge in the receipt column.

Durable proof artifact: access-receipt.json plus optional access-receipt.sig. Minimum fields: schema_version, resource_id, request_hash, invoice_terms, x402_payment_response, chain_id, payment_tx_or_proof, response_hash, server_signature, verification_result.

Sponsor/domain necessity: Without Pharos/x402, this collapses into an API-key demo. The visible value depends on an x402 payment response targeted at eip155:688689, with the receipt proving that access was released because of a Pharos-compatible paid call.

One miracle: Payment verification must feel instant enough that the first-minute demo does not become a wallet/RPC waiting room.

2-3 P0 prototype must-haves:

Stable Skill schema: quote_resource, submit_payment, verify_access_receipt.

Working x402 challenge/payment/response path on Pharos Atlantic Testnet.

Receipt verifier that can validate a saved artifact without trusting the original UI.

Cut list: Dynamic pricing, merchant analytics, multi-merchant routing, subscription logic, fiat checkout, marketplace discovery.

Expected risks: Wallet friction, x402 implementation mismatch, Pharos RPC latency, judges mistaking it for normal paywall middleware unless the receipt verifier is foregrounded.

Anti-Wrapper Score: 8.6/10 — real payment loop 2.5/3, stable agent-callable schema 2/2, durable artifact/verifier 2/2, non-chat host surface 1/1, Pharos specificity 1.1/2 because the demo still needs to avoid feeling like generic x402 middleware.

Judge-Magnet Score: 10.5/12 — first-minute artifact 3/3, sponsor fit 3/3, judge participation 2/2, visual clarity 1.5/2, implementation realism 1/2 due to payment/RPC reliability risk.

2. Pharos StateWitness

Name: Pharos StateWitness

5-12 word rumor: A Pharos state proof becomes a portable courtroom exhibit.

Primary user scar: Agents often rely on RPC answers like “this address owns X” or “this contract slot equals Y,” but they cannot later prove that the answer was independently verified rather than merely fetched.

Recent idea family: eth_getProof, light-client verification, Sigstore/Rekor artifact verification, MCP callable evidence tools.

Freshness delta: Instead of being another explorer or RPC wrapper, the Skill packages Pharos’s custom proof-node behavior into a reusable state-evidence envelope with independent verification.

Mutation operator: Turn “read chain state” into “mint a portable state witness.”

2026 clone trap avoided: Not a block explorer clone, not a Merkle proof tutorial, not a dashboard. It is a narrowly scoped evidence Skill for future agents.

Non-chat host surface: VS Code side panel, CLI verifier, browser extension “prove this slot,” MCP inspector tool call.

Product-loop basis: Sigstore/Rekor loop: create signed/verifiable artifact now, verify it later without trusting the original producer. Adapted to Pharos eth_getProof and custom proof-node verification.

Novelty delta: 8.4/10 — The base idea of state proofs is known, but making Pharos proof verification a clean Skill artifact for agents is strongly sponsor-native and reusable.

Judge surprise reason: The judge asks for a proof of a live Pharos account or storage slot and sees both the raw proof path and an independent verifier verdict within the first minute.

New primitive: PharosStateWitness — a portable envelope containing account/storage target, block reference, proof nodes, verifier transcript, proof hash, and signed verification result.

First click: “Prove this account/storage slot on Pharos.”

Demo interaction model: The judge enters or selects an address and optional storage slot. The Skill fetches the Pharos proof, runs independent verifier logic, then emits a witness card and JSON artifact.

0-10s hook: The UI shows a target address, block reference, chainId: 688689, and “RPC answer alone is not enough.”

10-30s interaction: The Skill calls eth_getProof, renders the proof nodes as a compact path, and runs the independent verifier.

30-60s visible consequence: The judge receives a green or red PharosStateWitness card, with downloadable JSON and a one-click “verify again from artifact” button.

Judge participation: The judge can change the address or slot and deliberately test a tampered artifact to see verification fail.

Visual staging: Split view: left side “RPC says,” right side “proof verifies.” Use a node-path visualization where each node turns green only after verifier acceptance.

Durable proof artifact: state-witness.json containing schema_version, chain_id, rpc_url_label, block_number_or_hash, account, storage_keys, account_proof, storage_proof, computed_root, expected_root, verifier_version, verdict, and witness_signature.

Sponsor/domain necessity: Without Pharos proof behavior, this becomes a generic RPC fetcher. The Skill’s core value is adapting Pharos’s custom eth_getProof proof nodes into an independently verified artifact that future agents can trust.

One miracle: The independent verifier must be robust enough to pass real Pharos proof data during a live demo, not just canned fixtures.

2-3 P0 prototype must-haves:

create_state_witness(address, storageKeys?, blockTag?) stable schema.

Independent verifier for Pharos proof nodes with clear pass/fail transcript.

Artifact-only re-verification path that does not call the original RPC.

Cut list: Full light client, every proof edge case, multi-chain support, explorer indexing, historical proof archive.

Expected risks: Misinterpreting Pharos custom proof-node format, verifier bugs, block/root mismatch confusion, demo addresses with uninteresting empty storage.

Anti-Wrapper Score: 9.2/10 — independent verifier 3/3, Pharos-specific proof handling 2.5/3, stable Skill schema 1.5/1.5, durable artifact 2/2, UI wrapper risk only 0.2 deduction.

Judge-Magnet Score: 10.8/12 — sponsor necessity 3/3, technical depth 2.5/3, first-minute artifact 3/3, visual intelligibility 1.3/2, judge participation 1/1.

3. PolicyCap Executor

Name: PolicyCap Executor

5-12 word rumor: Agents get one-use signing powers with visible guardrails.

Primary user scar: Users want agents to execute useful on-chain actions, but giving an agent broad wallet authority is terrifying, and “trust me, I will only do X” is not a real control surface.

Recent idea family: Lit Protocol policy-gated signing, wallet session keys, MCP tool permissions, Chainlink-style evidence-to-action triggers.

Freshness delta: Instead of building a full delegated wallet system, this Skill issues a tiny one-use capability artifact that allows exactly one Pharos action after explicit policy checks.

Mutation operator: Compress policy-gated execution into a one-use, auditable capability token.

2026 clone trap avoided: Not an AI wallet, not an auto-trading bot, not generic wallet-connect UX. It is a policy artifact compiler plus executor.

Non-chat host surface: Wallet modal, command palette, agent permission panel, CLI for CI/CD contract actions.

Product-loop basis: Lit-style policy gate: policy definition → evidence check → controlled signing/execution. Chainlink-style trigger: off-chain evidence becomes on-chain action.

Novelty delta: 8.1/10 — Capability-based execution is established, but binding x402/payment/proof predicates into a Pharos Skill artifact makes it feel like a new agent safety primitive.

Judge surprise reason: The judge watches the agent fail when policy evidence is missing, then succeed after a visible Pharos/x402 or proof condition is satisfied.

New primitive: PolicyCap — a one-use capability artifact with action target, policy predicates, expiry, max spend, verifier transcript, and execution receipt.

First click: “Grant a one-use capability.”

Demo interaction model: The judge creates a policy such as: “Allow this agent to call mintDemoBadge() only if the x402 payment receipt verifies and the recipient account proof is valid.” The Skill then attempts execution.

0-10s hook: The UI shows a scary agent action blocked by default: “Agent wants to submit transaction. Missing PolicyCap.”

10-30s interaction: The judge selects a policy template. The Skill checks the required x402 receipt or Pharos state witness and displays each predicate as pass/fail.

30-60s visible consequence: When checks pass, the Skill submits a limited transaction on Pharos Atlantic and emits a PolicyCapExecutionReceipt.

Judge participation: The judge toggles one predicate off or uploads a tampered receipt to see the execution fail, then restores valid evidence and sees it succeed.

Visual staging: “Red lock → yellow policy checks → green one-use execution.” Include a countdown/expiry chip and a visible chainId: 688689 transaction badge.

Durable proof artifact: policycap-execution.json containing schema_version, capability_id, allowed_action, policy_predicates, evidence_artifacts, verifier_transcript, expiry, execution_tx, used_once, and executor_signature.

Sponsor/domain necessity: Without Pharos/x402/proof, the Skill is only a local allowlist. The demo needs Pharos-visible execution plus either x402 payment evidence or Pharos state proof evidence to show why the agent was allowed to act.

One miracle: The permission model must look powerful but remain narrow enough that judges immediately understand it is safe.

2-3 P0 prototype must-haves:

Stable schema: create_policycap, evaluate_policycap, execute_policycap.

Two working predicates: valid PharosAccessReceipt and valid PharosStateWitness.

Safe demo contract action with one-use enforcement and clear failure states.

Cut list: General natural-language policy compiler, MPC, arbitrary wallet delegation, recurring permissions, complex spending limits.

Expected risks: Security overclaiming, policy complexity, demo failure due to wallet signing friction, judges perceiving it as “just permissions” unless artifacts are emphasized.

Anti-Wrapper Score: 8.8/10 — policy artifact 2/2, real execution gating 2.5/3, Pharos/x402/proof dependence 2/2, stable schema 1.5/1.5, security clarity deduction 0.2/1.5.

Judge-Magnet Score: 11/12 — visceral safety problem 2/2, first-minute visible consequence 3/3, sponsor integration 3/3, judge participation 2/2, implementation risk deduction 1.

4. BondedCall Receipt

Name: BondedCall Receipt

5-12 word rumor: An API response arrives with a slash-ready service promise.

Primary user scar: Agents call off-chain APIs constantly, but a response is usually just text over HTTP. There is no compact artifact saying who served it, what was promised, what was paid, and what evidence could support a challenge.

Recent idea family: EigenLayer/AVS shared-security services, Chainlink off-chain evidence, x402 paid calls, status-page monitoring, signed service receipts.

Freshness delta: It does not try to launch a full AVS or agent network. It creates a single bonded-call receipt primitive that imitates the mature service-assurance loop at hackathon scale.

Mutation operator: Shrink “restaked service network” into “one paid call with a bonded promise.”

2026 clone trap avoided: Not an uptime dashboard, not a generic SLA app, not a broad agent marketplace. It is a receipt Skill for one service call.

Non-chat host surface: GitHub Action status check, API gateway plugin, service status badge, Postman collection, MCP tool for agent service calls.

Product-loop basis: EigenLayer/AVS loop: service makes a commitment under shared-security framing; consumer receives signed evidence; bad service can be challenged. Combined with x402 pay-per-call.

Novelty delta: 8.6/10 — The AVS/slashing metaphor is mature, but converting it into a small Pharos Skill that emits challenge-ready receipts is fresh and demoable.

Judge surprise reason: The judge sees an API call return not only data, but also service identity, x402 payment proof, latency promise, result hash, bond reference, and a simulated challenge path.

New primitive: BondedCallReceipt — a signed service-call artifact binding request, response hash, x402 payment, SLA terms, service bond registry entry, and challenge evidence.

First click: “Call bonded API.”

Demo interaction model: The judge calls a demo service through the Skill. The service requires x402 payment, returns a response, and attaches a bond-backed receipt. The judge can then run verify_bonded_call or challenge_bonded_call.

0-10s hook: The call opens with a 402 challenge and a service promise: “Response under 2 seconds, hash committed, bond registered on Pharos.”

10-30s interaction: The judge pays, the service responds, and the Skill records the receipt hash or bond reference on Pharos Atlantic.

30-60s visible consequence: The receipt verifier shows “paid,” “served,” “within SLA,” and “challenge window open.” A deliberately bad canned response can trigger a visible breach verdict.

Judge participation: The judge chooses “normal call” or “bad service simulation.” In the bad path, they submit the receipt to the challenge verifier and see the failure evidence light up.

Visual staging: Service card with four badges: Paid, Signed, Bonded, Challengeable. Add a mini timeline: request → payment → response → receipt → challenge verdict.

Durable proof artifact: bonded-call-receipt.json containing schema_version, service_id, bond_registry, sla_terms, request_hash, response_hash, x402_payment_response, latency_ms, receipt_signature, pharos_anchor, challenge_window, and verifier_result.

Sponsor/domain necessity: Without Pharos/x402/restaking framing, this is just a signed API response. Pharos makes the paid call and bond registry visible; the L1-Extension/restaking narrative makes the receipt feel like a future SPN/AVS service primitive rather than ordinary monitoring.

One miracle: The “slash-ready” framing must be honest: prototype as bond/challenge-ready, not as a full production slashing system.

2-3 P0 prototype must-haves:

Stable schema: call_bonded_service, verify_bonded_call, challenge_bonded_call.

Minimal Pharos BondRegistry contract or registry artifact with service ID and bond terms.

x402 paid call wrapper that emits signed receipt plus verifier verdict.

Cut list: Real decentralized operator set, automated slashing, marketplace of services, reputation rankings, complex SLA arbitration.

Expected risks: Judges may challenge the slashing claim, the bond registry may look too mocked, x402 plus service bonding may feel like two demos unless the receipt unifies them.

Anti-Wrapper Score: 8.4/10 — bonded receipt primitive 2/2, real x402 loop 2/2, Pharos registry/anchor 2/2, stable agent schema 1.5/1.5, deduction 1.1/2.5 for prototype slashing being simulated.

Judge-Magnet Score: 10.7/12 — strong mature-product analogy 2.5/3, first-minute consequence 3/3, sponsor fit 2.7/3, visual drama 1.5/2, implementation realism 1/1.