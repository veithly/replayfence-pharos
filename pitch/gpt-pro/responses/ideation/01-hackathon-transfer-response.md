1. PharosProof Surgeon

Name: PharosProof Surgeon

5-12 word rumor: It catches fake Pharos proofs before agents trust them.

Primary user scar: Agents will soon call state proofs as facts, but most proof demos quietly trust RPC-provided metadata. On Pharos, that is dangerous because the custom SHA-256 hexary proof shape must be checked by independently deriving offsets.

Recent idea family: Dossier × Reputo × Identone, mutated into infrastructure verification rather than identity/profile UX.

Freshness delta: Recent winners turn claims into artifacts; this turns a chain state claim into a falsifiable proof receipt.

Mutation operator: Replace “AI-generated dossier” with “RPC-hostile proof surgery”: the Skill assumes the node may lie and verifies the proof path itself.

2026 clone trap avoided: Not an explorer, not a dashboard, not “ask AI about this transaction,” not a generic Merkle proof toy.

Non-chat host surface: Browser DevTools panel or PharosScan-side bookmarklet: paste eth_getProof, click Verify Without Trusting Metadata.

Winner-pattern basis: One narrow skill, one paid verifier call, one durable proof capsule, one settlement/proof trace.

Novelty delta: 9.4/10 — the novelty is not “proof verification,” but a Pharos-specific verifier that refuses to trust returned offsets and produces a reusable artifact for future agents.

Judge surprise reason: The demo can intentionally feed a proof whose metadata says “valid” while the independent offset derivation turns the screen red.

New primitive: verify_pharos_state_proof({ chainId, rpcUrl, blockRef, account, storageKey?, expectedValue?, proof }) -> { verdict, independentlyDerivedOffsets, rootHash, leafValue, failurePoint, artifactHash, settlementTx }.

First click: Judge clicks a preloaded “suspicious proof” card.

Demo interaction model: Side-by-side proof autopsy: left column shows RPC-returned proof fields; right column shows independently recomputed path, offsets, SHA-256 node hashes, and final verdict.

0-10s hook: A green RPC badge flips to “Invalid: trusted offset mismatch.”

10-30s interaction: Judge toggles one byte in the proof and watches the failing node move to a specific hexary branch.

30-60s visible consequence: Skill emits a downloadable/verifiable proof-surgery.json plus a compact “PASS/FAIL capsule” hash committed on Pharos Atlantic.

Judge participation: Judge chooses one of three sample proofs: honest account proof, tampered storage proof, or metadata-lie proof.

Visual staging: Surgical theater aesthetic: proof nodes as vertebrae, the failing offset highlighted like a scan anomaly, final artifact shown as a stamped specimen bag.

Durable proof artifact: PharosProofCapsule v0.1 containing proof input hash, independent offset trace, verifier version, verdict, Pharos block reference, and settlement transaction.

Sponsor/domain necessity: what breaks if Pharos/x402/proof is removed: Remove Pharos proof semantics and the core trick disappears; it becomes a generic verifier. Remove x402 and the Skill loses the paid-call commerce pattern Pharos documents for Atlantic testnet eip155:688689. Pharos docs explicitly show an x402 Skill for Atlantic chain ID 688689 and registering eip155:688689 in server/client examples. 
docs.pharosnetwork.xyz

One miracle: Make the verifier boringly correct enough that judges trust the failure more than the RPC response.

2-3 P0 prototype must-haves: Independent SHA-256 hexary proof verifier; canned honest/tampered proof fixtures; x402-gated /verify endpoint returning a stable JSON artifact.

Cut list: No natural-language proof explanation as the main output; no generalized explorer; no multi-chain support in Phase 1; no wallet-import flow for judges.

Expected risks: Verifier edge cases; sparse public documentation around the custom proof shape; judges may need a one-screen explanation of why trusting returned metadata is bad.

Anti-Wrapper Score: 9.6/10 — custom verifier 4.0, Pharos-specific proof dependency 2.5, durable artifact 1.5, stable agent schema 1.1, UX 0.5; only risk is implementation correctness.

Judge-Magnet Score: 11.2/12 — instant “RPC lied” hook 3.0, sponsor fit 3.0, technical depth 2.5, reusable Skill shape 1.5, demo drama 1.2.

2. Clean402 Toll Stamp

Name: Clean402 Toll Stamp

5-12 word rumor: Every paid agent call leaves a portable court exhibit.

Primary user scar: Agent-to-agent paid APIs create payment traces, but the buyer later cannot prove exactly what was paid for, what metadata was exposed, and which response hash was delivered.

Recent idea family: x402-flash × Dossier, but shifted from “pay to unlock content” to “pay to create a reusable evidence receipt.”

Freshness delta: Recent x402 demos emphasize access; this emphasizes non-repudiation, metadata hygiene, and downstream agent auditability.

Mutation operator: Turn the 402 payment boundary into a receipt minting boundary.

2026 clone trap avoided: Not a static marketplace, not a generic paywall, not “Stripe for agents,” not a wrapper around an LLM response.

Non-chat host surface: API playground / Swagger plugin / Postman-like panel with a Pay + Stamp button.

Winner-pattern basis: One paid call, one narrow Skill, one durable artifact, one settlement trace.

Novelty delta: 8.8/10 — x402 payment is known, but binding payment metadata, sanitized request fields, response digest, and Pharos settlement into a portable agent receipt is a sharper primitive.

Judge surprise reason: The judge sees an ordinary paid API call become an evidentiary object future agents can verify without replaying the call.

New primitive: stamp_paid_call({ endpoint, method, requestBodyHash, declaredPurpose, maxPrice, metadataPolicy }) -> { cleanPaymentEnvelope, x402Network, responseHash, receiptHash, settlementTx, replayNonce }.

First click: Judge clicks Buy sample risk score on a toy endpoint; no imported wallet, just a pre-funded burner path.

Demo interaction model: Request preview → metadata scrub diff → x402 payment → response body → stamped receipt.

0-10s hook: A fake sensitive field in the payment description is highlighted and removed before settlement.

10-30s interaction: Judge approves the sanitized envelope and sees network: eip155:688689, price, nonce, response hash, and payer alias.

30-60s visible consequence: The UI produces clean402-receipt.json, a QR-sized receipt card, and a Pharos transaction/explorer link.

Judge participation: Judge edits the purpose string; the Skill blocks unsafe metadata, then lets them retry with a clean purpose.

Visual staging: Tollbooth scanner: redacted metadata passes through a gate, then turns into a stamped receipt with hash, nonce, and settlement status.

Durable proof artifact: Clean402Receipt v0.1 with sanitized metadata hash, payment requirement, response digest, replay nonce, policy verdict, and Pharos settlement pointer.

Sponsor/domain necessity: what breaks if Pharos/x402/proof is removed: Remove x402 and this collapses into a signed HTTP log. Remove Pharos and the first-minute micro-payment/settlement trace on eip155:688689 disappears; Pharos’ x402 docs highlight low-cost, instant-finality micro-payments and show protected endpoints priced at $0.01 and $0.005 on eip155:688689. 
docs.pharosnetwork.xyz
 x402’s broader network model also uses CAIP-2 identifiers such as eip155:{chainId} for EVM networks. 
docs.cdp.coinbase.com

One miracle: Make the receipt feel more valuable than the API response.

2-3 P0 prototype must-haves: x402 protected demo endpoint; deterministic metadata sanitizer and diff view; receipt verifier endpoint callable by agents.

Cut list: No generic API marketplace; no dashboards; no private API keys; no broad privacy product; no user wallet import.

Expected risks: Could be dismissed as middleware unless the receipt verifier is crisp; metadata policy must be deterministic; x402 demo plumbing must be flawless.

Anti-Wrapper Score: 8.9/10 — x402 integration 2.5, artifact design 2.0, deterministic policy engine 2.0, reusable schema 1.5, visual UX 0.9.

Judge-Magnet Score: 10.7/12 — strong first-minute artifact 2.7, obvious agent-commerce use case 2.5, Pharos visibility 2.2, judge interaction 1.8, documentation potential 1.5.

3. SkillCard Forge

Name: SkillCard Forge

5-12 word rumor: A README becomes an agent-callable paid skill card.

Primary user scar: Hackathon judges and future agents cannot tell whether a submitted Skill is actually callable, paid-call compatible, documented, reusable, and reproducible.

Recent idea family: All AI Hub × Dossier, but narrowed from “hub of tools” to “one executable Skill-quality artifact.”

Freshness delta: Instead of building another directory, this produces the atomic unit a directory would trust.

Mutation operator: Collapse marketplace discovery into a local compile step: README + schema + endpoint → verified Skill Card.

2026 clone trap avoided: No static marketplace, no leaderboard, no chatbot that recommends tools, no “agent app store.”

Non-chat host surface: GitHub Action badge, VS Code extension, or CLI: pharos-skillcard forge.

Winner-pattern basis: One narrow Skill module, one paid self-test call, one durable artifact, one proof/settlement trace.

Novelty delta: 8.5/10 — the idea is familiar at the edges, but the artifact is unusually judge-aligned: it grades Skill usability by executing the Skill, not by describing it.

Judge surprise reason: A messy repo becomes a signed, agent-callable card with a live paid-call proof in under a minute.

New primitive: forge_skill_card({ repoUrl?, openapi?, jsonSchema, x402Endpoint, exampleInput, priceCap }) -> { skillCard, conformanceReport, paidSelfTestReceipt, artifactHash, settlementTx }.

First click: Judge clicks Forge from sample repo.

Demo interaction model: The Skill lints the schema, calls the endpoint once through x402, captures response shape, and emits a machine-readable card.

0-10s hook: The UI flags “not agent-callable” because a required output field is undocumented.

10-30s interaction: Judge fixes the schema with one toggle: “declare artifactHash as required.”

30-60s visible consequence: A skillcard.json appears with callable schema, example call, price, x402 network, conformance score, and settlement proof.

Judge participation: Judge intentionally breaks the example input or price cap and watches the card fail conformance.

Visual staging: Factory press: source files enter as rough metal; a stamped Skill Card exits with green checks for schema, payment, artifact, docs, and proof.

Durable proof artifact: PharosSkillCard v0.1 containing endpoint schema, canonical example input/output hashes, x402 payment receipt, conformance verdicts, and Pharos transaction pointer.

Sponsor/domain necessity: what breaks if Pharos/x402/proof is removed: Remove x402 and the card cannot prove the Skill is economically callable by a future agent. Remove Pharos and it loses the Atlantic-specific paid self-test path; the official Pharos x402 Skill docs show Express middleware, Fetch client flow, and eip155:688689 registration for paid endpoints. 
docs.pharosnetwork.xyz
 Remove proof/settlement trace and it becomes a README linter.

One miracle: Make judges think, “Every Phase 1 submission should ship one of these.”

2-3 P0 prototype must-haves: JSON Schema/OpenAPI conformance checker; live x402 paid self-test; deterministic skillcard.json emitter with verifier.

Cut list: No public directory; no ranking marketplace; no AI-generated docs as the main feature; no multi-repo crawler.

Expected risks: Could look like developer tooling rather than a Skill unless the callable endpoint is primary; schema standards may be debated; demo repo must be pristine.

Anti-Wrapper Score: 8.6/10 — executable conformance 2.5, paid-call proof 2.0, durable artifact 2.0, agent schema 1.5, originality 0.6.

Judge-Magnet Score: 11.0/12 — directly addresses judging criteria 3.0, reusable across hackathon 2.5, first-minute artifact 2.0, sponsor fit 2.0, practical UX 1.5.

4. SPN Route Ticket

Name: SPN Route Ticket

5-12 word rumor: AI compute jobs ship with slashable route receipts.

Primary user scar: Agents can buy “AI compute,” but cannot prove which compute route was quoted, what was promised, what output hash returned, or what challenge window applies.

Recent idea family: Industry AI × x402-flash × Reputo, mutated from “AI service marketplace” into one compute accountability primitive.

Freshness delta: Instead of selling compute, it standardizes the receipt future agents need before they trust compute.

Mutation operator: Replace “GPU rental listing” with “route ticket”: quote, pay, execute tiny job, stamp output hash, expose challenge terms.

2026 clone trap avoided: Not a GPU marketplace, not a model leaderboard, not a generic AI inference endpoint, not a dashboard of nodes.

Non-chat host surface: Notebook cell, CI job step, or model-evaluation harness: routeTicket.run(sampleJob).

Winner-pattern basis: One narrow skill, one paid compute call, one durable ticket, one settlement/proof trace.

Novelty delta: 8.2/10 — the prototype can be small, but the primitive is forward-looking: a compute route receipt that maps naturally to Pharos SPNs, restaking, and heterogeneous AI/ZKML compute.

Judge surprise reason: A one-line toy inference produces a ticket with price, route, output hash, challenge deadline, and Pharos settlement instead of just a JSON response.

New primitive: issue_compute_route_ticket({ jobType, inputHash, maxLatencyMs, verificationMode, priceCap, challengeWindow }) -> { routeId, quote, x402Receipt, outputHash, verifierHint, challengeUntil, ticketHash, settlementTx }.

First click: Judge runs a sample “classify this public image hash” job.

Demo interaction model: The Skill quotes a tiny compute route, charges through x402, runs a deterministic toy inference or hash transform, and returns a stamped ticket.

0-10s hook: The UI shows two possible routes: “cheap CPU” and “verifiable ZKML-ready,” with the selected route locked into a ticket.

10-30s interaction: Judge changes latency or verification mode; the quote and challenge window update.

30-60s visible consequence: The Skill emits spn-route-ticket.json, output hash, x402 receipt, and Pharos transaction pointer.

Judge participation: Judge selects “challenge this output,” causing the verifier to recompute the toy job and mark the ticket as upheld or disputed.

Visual staging: Boarding-pass metaphor: job input hash as passenger, route as gate, settlement as boarding stamp, challenge window as countdown.

Durable proof artifact: SPNRouteTicket v0.1 containing job hash, route quote, payment receipt, output digest, verification hint, challenge deadline, and Pharos settlement pointer.

Sponsor/domain necessity: what breaks if Pharos/x402/proof is removed: Remove Pharos and this is only a cloud inference invoice. Pharos’ own docs position x402 for compute rental billing and describe low-cost, instant-finality micro-payment access control; they also note modular SPN customization for payment scenarios. 
docs.pharosnetwork.xyz
 The broader Pharos positioning around heterogeneous computation, SPNs, ZKML/AI models, and native restaking is what makes the “route ticket” feel native rather than generic. 
Pharos Docs

One miracle: Make an SPN-shaped future primitive credible even if Phase 1 only has a deterministic local executor and Pharos settlement.

2-3 P0 prototype must-haves: Deterministic sample compute executor; x402 paid quote-and-run endpoint; ticket verifier with challenge/recompute path.

Cut list: No real GPU marketplace; no live node supply; no private model APIs; no dashboard; no vague “AI compute network” pitch.

Expected risks: SPN/restaking pieces may be aspirational; judges may penalize overreach unless the Phase 1 Skill is sharply scoped; verification mode must be honest about what is mocked.

Anti-Wrapper Score: 8.1/10 — primitive design 2.0, x402 settlement 2.0, Pharos/SPN fit 1.8, artifact 1.5, deterministic verifier 0.8; loses points for speculative SPN surface.

Judge-Magnet Score: 10.3/12 — strong sponsor narrative 2.7, artifact-first demo 2.2, future-agent relevance 2.0, visual hook 1.7, technical feasibility 1.7.