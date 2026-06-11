Score table

Equal-weight total out of 60. UX risk score is inverted: 10 = low demo/UX risk.

Rank	Candidate	5-sec clarity	30-sec clickability	60-sec consequence	Judge participation	Memorability / retellability	UX risk	Total	Product/demo read
1	IDEA-008 ReplayFence Idempotency Skill	10	10	10	10	10	9	59	Best stage demo. “I double-clicked a dangerous action and the duplicate was rejected with proof.”
2	IDEA-005 PolicyCap Executor	9	9	9	9	8	9	53	Very clean: toggle policy, action blocks/unblocks, receipt appears. Strong reusable Skill story.
3	IDEA-002 ProofPay Receipt Skill	9	9	9	9	9	7	52	Memorable 402/pay/unlock/tamper/fail sequence. Slightly riskier because payment UX can distract.
4	IDEA-001 PharosProof Surgeon	9	9	9	8	8	9	52	Clear verifier demo with durable proof capsule. Strong but a little more generic than ReplayFence or ProofPay.
5	IDEA-003 SkillCard Forge	8	8	9	7	8	7	47	Best Phase-1-aligned concept, but demo risks feeling like “AI generates schema from repo” unless tightly scripted.
6	IDEA-009 LogPulse Trigger Envelope Skill	7	8	8	7	7	8	45	Useful and reusable, but event-envelope demos can look like JSON plumbing unless tied to a vivid action.
7	IDEA-006 BondedCall Receipt	7	8	8	7	6	8	44	Clickable and plausible, but “bonded call” is less instantly legible than pay/block/replay.
8	IDEA-007 GasGuard Action Capsule	7	7	8	6	7	6	41	Good for crypto-native judges; weaker for general judges. Live transaction/gas framing adds friction.
9	IDEA-004 RouteVoucher SPN Skill	5	6	6	5	5	6	33	Most abstract. “Compute route policy” and “SPN” are hard to retell in under 3 minutes without explanation.
Best 60-second stage demo

Winner: IDEA-008 ReplayFence Idempotency Skill.

Best version:

0–10 seconds: Show one dangerous button: “Send $500,” “Ship order,” “Deploy to production,” or “Release payment.”

10–20 seconds: Judge clicks once. The action succeeds. A receipt/proof capsule appears with action ID, idempotency key, timestamp, and verifier status.

20–35 seconds: Judge double-clicks, refresh-resubmits, or presses “Run again.” The duplicate is rejected immediately.

35–50 seconds: Show the verifier: first action = accepted; replayed action = rejected; same proof capsule links both attempts.

50–60 seconds: Export or display the durable artifact: ReplayFence Capsule — exactly-once proof for agent action X.

Why this is the best: it has the cleanest physical interaction. The judge literally creates the failure mode by double-clicking. The consequence is visible and understandable without knowing Pharos internals. The retell is one sentence: “The judge double-clicked a dangerous action, but only the first execution went through, and the system produced proof that the replay was blocked.”

That is extremely strong for a Phase 1 reusable Skill because idempotency applies to payments, deployments, orders, agent tool calls, webhooks, and blockchain actions.

Most boring or risky demos, and how to mutate them
IDEA-004 RouteVoucher SPN Skill — most boring as written

Problem: “compute route policy,” “route voucher,” and “SPN” are abstract. Judges may understand the words but not feel the consequence.

Mutation: make it concrete and adversarial.

Better demo: “No customer data may leave Japan.” Judge selects that policy, then tries to route a job through a cheaper forbidden region. The route is blocked, and a voucher appears showing allowed provider, region, cost, and policy proof.

Retell: “The agent tried to send data through a cheaper forbidden route, and the Skill produced a route voucher proving it stayed compliant.”

IDEA-007 GasGuard Action Capsule — risky unless judges are crypto-native

Problem: raw versus buffered transaction is not universally clear. Live gas/transaction demos can fail, stall, or become wallet theatre.

Mutation: make the consequence financial and simulated.

Better demo: show two paths side by side: raw approval loses $1,000 under a bad postcondition; guarded approval reverts and emits a capsule. Avoid mainnet. Use a deterministic sandbox.

Retell: “GasGuard let the judge see the transaction that would have gone wrong, then proved the protected version only executed when the postcondition held.”

IDEA-006 BondedCall Receipt — too contractual unless made visceral

Problem: “normal/bad service” and “challenge-ready receipt” are understandable but not exciting. It risks becoming a compliance receipt demo.

Mutation: attach the bond to a visible failure.

Better demo: judge calls a price quote service. Good service returns the right price. Bad service returns a wrong quote. The Skill emits a receipt and marks the bad service challengeable or slashable.

Retell: “The API lied, and the receipt was enough to challenge it.”

IDEA-009 LogPulse Trigger Envelope Skill — useful but risks looking like infrastructure plumbing

Problem: typed trigger envelopes are valuable, but judges may remember it as “a JSON event appeared.”

Mutation: connect the event to a meaningful action.

Better demo: judge emits a GitHub, Slack, or invoice event. A typed trigger envelope authorizes one downstream action. Then the judge tampers with assignee, amount, or deadline, and the verifier rejects it.

Retell: “A task event became a signed action envelope, and tampering with the event killed the action.”

IDEA-003 SkillCard Forge — high upside, but too much magic if not constrained

Problem: “messy repo/schema into paid callable Skill Card” is aligned with Phase 1, but it can feel like a broad generator if the demo is not narrow.

Mutation: use one intentionally ugly repo and one visible before/after.

Better demo: judge sees a repo with unclear README, broken schema, and no monetization. They click Forge Skill Card. Output: callable Skill Card, price, input schema, example invocation, and proof/receipt.

Retell: “It turned a messy repo into a paid reusable Skill in one click.”

This is not the strongest 60-second stage demo, but it may be the strongest strategic product direction after the hackathon.

Top 3 product/demo recommendations
1. Lead with ReplayFence, not the proof system

The first 60 seconds should not explain verifiers, receipts, proofs, SPNs, capsules, or policies. It should show a judge accidentally doing something dangerous twice. The proof artifact should appear after the emotional moment.

Best opening line: “Please double-click this payment button.”

2. Make every artifact nameable and exportable

The durable artifact should not be a blob or a log. It should have a product-shaped name and a compact card.

Minimum artifact fields:

Field	Why it matters
Verdict	Pass/fail is the visible consequence
Action	What was attempted
Policy or invariant	Why it passed or failed
Original request hash	Makes it proof-like
Replay/tamper evidence	Makes the failure legible
Timestamp	Makes it feel durable
“Verify” button	Gives judges one more click

Recommended artifact names: ReplayFence Capsule, PolicyCap Receipt, ProofPay Receipt, PharosProof Capsule.

3. Use dangerous everyday actions, not abstract infrastructure

The best demo actions are:

Strong action	Why it works
Send payment	Everyone understands duplicate payment risk
Ship order	Clear irreversible consequence
Deploy to production	Good developer/operator stakes
Release API key	Clear policy-control stakes
Approve transaction	Good for crypto-native audience

Avoid leading with “route policy,” “trigger envelope,” “service bonding,” or “proof protocol.” Those can be the explanation after the judge has already seen the action and consequence.

Exclusions before PRD

I would exclude IDEA-004 RouteVoucher SPN Skill from PRD in its current form. It is too abstract for Phase 1 judging unless it is reframed around a concrete compliance or data-routing violation.

I would not exclude IDEA-007, IDEA-006, or IDEA-009, but I would require demo mutation before PRD:

Candidate	PRD condition
IDEA-007 GasGuard	Must use deterministic sandbox and show money/risk saved, not gas mechanics alone
IDEA-006 BondedCall	Must show a bad service causing a challenge/slash/refund outcome
IDEA-009 LogPulse	Must connect the envelope to a real downstream action and tamper failure
IDEA-003 SkillCard Forge	Must constrain to one repo-to-card flow; avoid broad marketplace/generator framing
Final recommendation from this judge only

Advance IDEA-008 ReplayFence Idempotency Skill as the primary Phase 1 demo.

Use IDEA-005 PolicyCap Executor as the closest backup or companion demo, because it demonstrates the same product principle from a different angle: safe agent action through visible constraints and durable receipts.

Use IDEA-002 ProofPay Receipt Skill only if the team can make the 402/payment flow frictionless in a sandbox. It is highly memorable, but payment mechanics can steal attention from the Skill.

My recommended Phase 1 positioning:

“Pharos Skills make agent actions safe, verifiable, and reusable. In 60 seconds, the judge double-clicks a dangerous action; ReplayFence blocks the duplicate and emits a durable proof capsule.”