# Idea Tournament

## Context

- Hackathon: Pharos Skill-to-Agent Dual Cascade Hackathon, Phase 1 Skill Hackathon.
- Tracks/rubric: Skill module quality/usability, originality, technical completion, AI Agent practical use case, reusability/composability, Pharos blockchain integration, UX, documentation.
- Constraints:
  - Phase 1 Skill submission deadline: June 15, 2026.
  - Phase 1 judging: June 16 to June 22, 2026.
  - Avoid generic dashboards, chatbots, wallet assistants, RAG summaries, and static marketplaces.
  - First 60 seconds must create or verify a durable artifact.
  - At least one Pharos primitive must be visible: x402, Atlantic tx/proof, `eth_getProof`, manifest/agent schema, or SPN-aware future route.

## GPT Pro Deep Research 10x10

| Prompt | Response | Local synthesis | Completed hackathons | Mature products |
|---|---|---|---:|---:|
| `pitch/gpt-pro/prompts/research/01-10x10-deep-research.md` | `pitch/gpt-pro/responses/research/01-10x10-deep-research-response.md` | `pitch/deep_research_10x10.md` | 10 | 10 |

## Raw GPT Pro Ideation Windows

| Window | Prompt | Response | Ideas returned |
|---|---|---|---:|
| 01-hackathon-transfer | `pitch/gpt-pro/prompts/ideation/01-hackathon-transfer.md` | `pitch/gpt-pro/responses/ideation/01-hackathon-transfer-response.md` | 4 |
| 02-product-analogue | `pitch/gpt-pro/prompts/ideation/02-product-analogue.md` | `pitch/gpt-pro/responses/ideation/02-product-analogue-response.md` | 4 |
| 03-sponsor-demo-primitive | `pitch/gpt-pro/prompts/ideation/03-sponsor-demo-primitive.md` | `pitch/gpt-pro/responses/ideation/03-sponsor-demo-primitive-response.md` | 4 |
| 03b-sponsor-mutations | `pitch/gpt-pro/prompts/ideation-followups/03b-sponsor-mutations.md` | `pitch/gpt-pro/responses/ideation-followups/03b-sponsor-mutations-response.md` | 2 |

## Dedupe Notes

- State proof verifier cluster merged: PharosProof Surgeon, Pharos StateWitness, HexProof State Notary Skill.
- x402 paid receipt cluster merged: Clean402 Toll Stamp, TollReceipt Skill, ProofPay Receipt Skill.
- SPN route cluster merged: SPN Route Ticket, RouteVoucher SPN Skill.
- Fewer than 8 distinct candidates remained after first dedupe, so GPT Pro follow-up `03b-sponsor-mutations` produced two non-duplicate candidates in the existing ideation-03 conversation.

## Deduped Candidates

| Idea ID | Name | 5-12 word rumor | Recent idea family | Freshness delta | Mutation operator | 2026 clone trap avoided | Winner pattern basis | Novelty delta | Judge surprise | New primitive | 60s consequence | Proof artifact | Merged from |
|---|---|---|---|---|---|---|---|---:|---|---|---|---|---|
| IDEA-001 | PharosProof Surgeon | It catches fake Pharos proofs before agents trust them. | Proof-carrying verifier / evaluator gate | Pharos-specific SHA-256 hexary proof verifier that independently derives offsets. | RPC read -> portable state witness. | Explorer clone, Merkle tutorial, AI tx explainer. | Dossier, Identone, Verifiable AI winners. | 9.4 | Judge sees a green RPC-looking proof turn red when offset derivation fails. | `verify_pharos_state_proof` / PharosProofCapsule | Tampered proof fails; honest proof emits verified capsule. | `pharos-proof-capsule.json` | PharosProof Surgeon + Pharos StateWitness + HexProof State Notary |
| IDEA-002 | ProofPay Receipt Skill | APIs only answer after agents prove they paid. | x402 agent commerce / paid receipt | Converts 402 payment into self-verifying settlement + response artifact. | Payment header -> durable receipt. | Paywall middleware, API marketplace, Stripe-for-agents. | x402-flash, Reputo, All AI Hub. | 8.8 | Judge sees 402 challenge become a Pharos payment and tamper-failing receipt. | `x402ProofReceipt` / Clean402Receipt | Paid API response appears with request hash, response hash, payment proof, tx. | `x402-proof-receipt.json` | Clean402 Toll Stamp + TollReceipt Skill + ProofPay Receipt |
| IDEA-003 | SkillCard Forge | A README becomes an agent-callable paid skill card. | Agent tool conformance / MCP schema / skill registry | Executes the Skill and proves it is callable, paid, documented, and reusable. | Marketplace discovery -> local compile/conformance step. | Static marketplace, docs linter, AI-generated docs. | All AI Hub, Dossier, DoraHacks Skill criteria. | 8.5 | Messy repo becomes signed Skill Card with live paid self-test in under a minute. | `PharosSkillCard` | Conformance card appears with schema, example output, payment receipt, proof. | `skillcard.json` | SkillCard Forge |
| IDEA-004 | RouteVoucher SPN Skill | Agents buy compute routes, then prove the route existed. | SPN route / paid compute / route proof | Makes future SPN routing concrete with signed manifests, x402 quote, route commitment, proof. | Provider choice -> proof-routed paid compute voucher. | Vague SPN dashboard, compute marketplace, model leaderboard. | Hivera, Industry AI, x402-flash. | 8.8 | Judge changes routing policy; route hash/proof changes and tampering fails. | `ProofRoutedComputeVoucher` | Route commitment is written/proven; voucher shows selected provider and payment. | `proof-routed-compute-voucher.json` | SPN Route Ticket + RouteVoucher SPN Skill |
| IDEA-005 | PolicyCap Executor | Agents get one-use signing powers with visible guardrails. | Policy-gated execution / capability artifact | Shrinks delegated agent execution into a one-use policy artifact. | Wallet delegation -> one-use, proof-backed execution capability. | AI wallet, trading bot, wallet-connect UX. | Lit-style policy, Chainlink evidence-to-action, Reputo authorization. | 8.1 | Agent fails without policy evidence, then succeeds only after checks pass. | `PolicyCap` | Limited Pharos tx executes and emits one-use capability receipt. | `policycap-execution.json` | PolicyCap Executor |
| IDEA-006 | BondedCall Receipt | An API response arrives with a slash-ready service promise. | Bonded service call / AVS-style receipt | Turns paid API call into a signed, bonded, challenge-ready service artifact. | API response -> bonded promise receipt. | Uptime dashboard, generic SLA app, agent marketplace. | EigenLayer/AVS, Chainlink, x402-flash. | 8.6 | Good/bad service simulation produces challengeable receipt/verdict. | `BondedCallReceipt` | Paid service call returns SLA, response hash, bond reference, challenge result. | `bonded-call-receipt.json` | BondedCall Receipt |
| IDEA-007 | GasGuard Action Capsule | Agent transactions stop failing from optimistic gas guesses. | Agent tx reliability / deploy gate | Makes Pharos gas-buffer guidance visible as certified execution + post-state proof. | Tx sender -> reliability-certified action primitive. | Wallet UI, gas dashboard, relayer clone. | Devtool winner patterns, Pharos gas docs. | 7.5 | Raw estimate is flagged unsafe; buffered tx lands and proves postcondition. | `GasGuardActionCapsule` | Tx executes with buffer and postcondition proof. | `gasguard-action-capsule.json` | GasGuard Action Capsule |
| IDEA-008 | ReplayFence Idempotency Skill | Agents can retry dangerous calls without double-spending. | Durable execution / one-shot action latch | Moves idempotency from private header to public Pharos latch with proof. | Retry logic -> public one-shot action latch. | Retry bot, workflow engine, wallet assistant. | Durable execution, side-effect orchestration, agent tool safety. | 8.7 | Judge double-clicks; first executes, second rejects as duplicate with proof. | `PharosOnceLatch` | Duplicate retry is rejected; latch state proof and original result are saved. | `pharos-once-latch.json` | ReplayFence Idempotency Skill |
| IDEA-009 | LogPulse Trigger Envelope Skill | On-chain events become typed agent triggers, not webhooks. | Verifiable workflow trigger / event envelope | Turns Pharos events into typed future-agent inputs with proof-backed registry state. | EVM log -> signed trigger object. | Notification bot, indexer dashboard, webhook clone. | On-chain automation, agent triggers, skill cascade. | 8.4 | Event appears, typed agent invocation appears, tampered logIndex fails verification. | `PharosTriggerEnvelope` | Contract event becomes target Skill input and verified trigger envelope. | `pharos-trigger-envelope.json` | LogPulse Trigger Envelope Skill |

## Demo Interaction Plans

| Idea ID | 0-10s hook | 10-30s interaction | 30-60s consequence | Judge participation | Visual staging | Fallback if live input fails |
|---|---|---|---|---|---|---|
| IDEA-001 | RPC-looking proof marked suspicious. | Verify honest/tampered proof with independent offsets. | PASS/FAIL capsule emitted. | Choose proof, tamper one byte. | Proof-node autopsy path. | Use canned Pharos proof fixtures and local verifier. |
| IDEA-002 | API returns HTTP 402 challenge. | Complete x402/Pharos payment or simulated payment path. | Receipt with tx/payment/request/response hashes. | Edit amount or response hash to fail verifier. | Challenge -> payment -> receipt panes. | Use payment simulation with explicit limitation and seeded tx/proof sample. |
| IDEA-003 | Repo/Skill is “not agent-callable.” | Fix schema/price/sample and run paid self-test. | Skill Card with conformance and receipt. | Break example input or price cap. | Factory press / conformance checklist. | Use local sample endpoint and mock x402 if facilitator unavailable. |
| IDEA-004 | Two compute providers quote a job. | Select route policy and pay/commit route. | Route voucher and storage proof. | Switch cheapest/fastest or tamper provider ID. | Provider race board. | Use signed mock provider manifests and deterministic local executor. |
| IDEA-005 | Agent action blocked by missing capability. | Select policy and validate required evidence. | One-use tx executes; receipt shows used-once. | Toggle predicate to block/unblock. | Red lock -> checks -> green execution. | Use demo contract and canned evidence artifacts. |
| IDEA-006 | API promise includes bond/SLA. | Paid service call returns signed response. | Challenge-ready receipt/verdict appears. | Choose normal or bad service simulation. | Paid/Signed/Bonded/Challengeable badges. | Use local bond registry and deterministic bad response. |
| IDEA-007 | Raw gas estimate marked risky. | Apply Pharos buffer and send tx. | Postcondition proof certifies action. | Reduce buffer or remove postcondition. | Gas gauge -> tx -> proof stamp. | Use demo contract and emphasize postcondition proof. |
| IDEA-008 | Judge is invited to double-click. | First call latches and executes. | Second call rejected as duplicate with proof. | Double-click same action, then change one byte. | Intent hash, latch tx, duplicate rejection. | Use local OnceLatch contract/test fixture if RPC slow. |
| IDEA-009 | Judge posts an event to Pharos. | Event decoded into target Skill schema. | Trigger envelope with proof-backed registry state. | Edit logIndex/jobHash to fail verifier. | Event stream -> typed envelope -> proof. | Use seeded event tx and local ABI decoder. |

## GPT Pro Judges

| Judge | Prompt | Response | Role |
|---|---|---|---|
| Rubric/Sponsor | `pitch/gpt-pro/prompts/judging/01-rubric-sponsor-judge.md` | `pitch/gpt-pro/responses/judging/01-rubric-sponsor-judge-response.md` | Sponsor/rubric fit |
| Technical | `pitch/gpt-pro/prompts/judging/02-technical-execution-judge.md` | `pitch/gpt-pro/responses/judging/02-technical-execution-judge-response.md` | Execution risk |
| Product/Demo | `pitch/gpt-pro/prompts/judging/03-product-demo-judge.md` | `pitch/gpt-pro/responses/judging/03-product-demo-judge-response.md` | User clarity and showmanship |

## Scoreboard

Scores are normalized to a 0-10 average per judge, then summed across the three GPT Pro judges.

| Idea ID | Rubric/Sponsor | Technical | Product/Demo | Aggregate | Fatal concerns |
|---|---:|---:|---:|---:|---|
| IDEA-008 | 8.33 | 8.50 | 9.83 | 26.66 | Canonical action hash must be exact; Pharos proof must make it more than generic EVM idempotency. |
| IDEA-001 | 8.67 | 8.00 | 8.67 | 25.34 | Must implement real Pharos proof verification, not superficial JSON tamper checks. |
| IDEA-002 | 9.00 | 7.50 | 8.67 | 25.17 | x402 settlement/payment UX could fail the demo if not already stable. |
| IDEA-009 | 8.00 | 7.30 | 7.50 | 22.80 | Risk of looking like typed webhook/indexer wrapper. |
| IDEA-005 | 6.33 | 7.50 | 8.83 | 22.66 | Security-sensitive policy semantics could overreach. |
| IDEA-003 | 7.33 | 7.20 | 7.83 | 22.36 | Risks feeling like meta-tool or static linter. |
| IDEA-007 | 7.17 | 7.90 | 6.83 | 21.90 | Gas framing may be less memorable and can overclaim. |
| IDEA-006 | 6.83 | 6.40 | 7.33 | 20.56 | Slash-ready/bonded claim is too broad without real challenge mechanism. |
| IDEA-004 | 7.00 | 5.80 | 5.50 | 18.30 | Too speculative around future SPNs and provider network. |

## Selected Winner

- Idea ID: `IDEA-008`
- Project name: ReplayFence
- Why it wins: It has the cleanest live judge participation: the judge double-clicks or retries a dangerous agent action, the first execution succeeds, the duplicate is rejected, and a durable Pharos proof capsule explains why.
- Novelty delta: 8.7/10 from GPT Pro mutation, strengthened by merging a Pharos proof capsule from `IDEA-001`.
- Recent idea family: durable execution, one-shot action latch, agent tool safety, proof-carrying verifier.
- Freshness delta: idempotency becomes a shared Pharos latch and verifier artifact instead of a private API header.
- Mutation operator: retry logic -> public one-shot action latch with independent proof.
- 2026 clone trap avoided: retry bot, workflow dashboard, wallet assistant, generic transaction sender.
- Judge-magnet reason: a judge can create the failure mode by double-clicking, then inspect a proof artifact that survives refresh.
- Demo interaction/showcase reason: first 60 seconds produce an on-chain latch, a duplicate rejection, and a proof capsule.
- Tie-breaker: higher product/demo score than `IDEA-001` and lower implementation risk than `IDEA-002`.
- Known risk: canonicalization and atomicity must be precise; Pharos proof verification must be real enough to avoid “generic EVM nonce registry” criticism.
- Strategic merge: P0 concept is ReplayFence; P0 proof/detail surface borrows PharosProof Surgeon’s capsule pattern for latch-state verification.
- Next file: `pitch/concept_lock.md`
- Next file: `pitch/demo_interaction_plan.md`
