Judging basis

I weighted this as a Phase 1 reusable Skill module, not a full agent platform. I gave extra credit for a demo that can run against Pharos Atlantic, produce a falsifiable artifact, and survive ruthless cuts before the June 15, 2026 deadline. The strongest sponsor-aligned primitives are real state proofs and paid-call evidence: Pharos docs expose eth_getProof/SPV as a state-verification primitive, and EIP-1186’s core value is offline verification of account/storage data against a trusted state root. 
Pharos Docs
+1
 x402 is also directly relevant because it turns HTTP 402 into an onchain payment layer for APIs and agents, with signed offer/receipt extensions that create portable verifiable artifacts. 
docs.x402.org
+1

Score table
Rank	Candidate	Feasibility by deadline	Technical depth	Runtime realness	Proof artifact strength	Integration risk, 10 = low risk	Cutability	Avg.	Judge call
1	IDEA-008 ReplayFence Idempotency Skill	8.5	7.5	9.0	8.5	8.5	9.0	8.5	Best buildable reusable Skill
2	IDEA-001 PharosProof Surgeon	7.0	9.0	8.0	9.0	7.0	8.0	8.0	Best technical proof story
3	IDEA-007 GasGuard Action Capsule	8.0	7.0	8.5	7.5	8.0	8.5	7.9	Strong pragmatic Pharos tx Skill
4	IDEA-002 ProofPay Receipt Skill	7.0	8.0	8.0	8.0	6.0	8.0	7.5	High upside, settlement risk
5	IDEA-005 PolicyCap Executor	7.5	7.0	8.0	7.5	7.0	8.0	7.5	Solid but needs sharper proof scope
6	IDEA-009 LogPulse Trigger Envelope Skill	7.5	6.5	7.5	7.0	7.0	8.0	7.3	Useful, but “future-agent” is soft
7	IDEA-003 SkillCard Forge	9.0	5.0	6.0	5.0	9.0	9.0	7.2	Easy and clean, but shallow
8	IDEA-006 BondedCall Receipt	5.5	8.0	6.5	7.0	5.0	6.5	6.4	Too much dispute/SLA surface
9	IDEA-004 RouteVoucher SPN Skill	5.5	7.0	5.0	6.0	5.0	6.0	5.8	Over-framed around future SPNs
Most likely implementation trap for each candidate
Candidate	Most likely trap
IDEA-001 PharosProof Surgeon	Mishandling eth_getProof edge cases: storage key normalization, account-vs-storage trie separation, RLP/MPT branch/extension/leaf decoding, non-existence proofs, or binding the proof to the wrong block/state root. The demo must fail on tampering, not merely re-query RPC and trust it.
IDEA-002 ProofPay Receipt Skill	Confusing a signed service receipt with settled payment. x402 signed receipts prove service delivery terms, but the strongest artifact also needs either a real settlement tx/hash or an explicitly labeled simulated settlement. x402 docs already support signed offers/receipts, but settlement on Pharos is the risky part. 
docs.x402.org
+1

IDEA-003 SkillCard Forge	Becoming a static linter. Schema/docs checks alone are not enough unless it also performs a runnable self-test: install Skill, execute Skill entrypoint, optionally hit x402 route, and emit machine-verifiable results.
IDEA-004 RouteVoucher SPN Skill	Building a “route registry” that is not connected to real routing, real SPNs, or real payment execution. Pharos SPNs/restaking are credible sponsor framing, but Phase 1 needs a present-tense executable artifact, not architectural theater. 
buildonpharos.com
+1

IDEA-005 PolicyCap Executor	Overbuilding a generic policy engine. The P0 must prove one narrow capability is authorized once, consumed once, and bound to the exact Pharos transaction parameters. Otherwise it becomes a permission wrapper with no meaningful proof.
IDEA-006 BondedCall Receipt	SLA challenge logic is underspecified. Unless the service output has an objective, deterministic acceptance predicate, the “bond/challenge verifier” becomes subjective and brittle.
IDEA-007 GasGuard Action Capsule	Treating gas estimation as proof. The real artifact must bind preflight simulation, EIP-1559 fee parameters, submitted tx, receipt, and postcondition. EIP-1559’s fee model includes base fee plus priority/max fee mechanics, so the Skill must handle volatility without pretending exact prediction. 
Ethereum Improvement Proposals

IDEA-008 ReplayFence Idempotency Skill	Non-atomic idempotency. If the latch is written separately from the side effect, the system can still double-act or reserve without completing. The strongest version either wraps the side effect or produces a clearly scoped “reservation/commit/fail” lifecycle.
IDEA-009 LogPulse Trigger Envelope Skill	Reorg/finality ambiguity and weak consumer semantics. A typed trigger envelope is only meaningful if it states block number/hash, log index, chainId, emitter, ABI/event signature, confirmation depth, and registry commitment.
Minimal P0 build that would still be award-worthy for the top candidates
1. IDEA-008 ReplayFence Idempotency Skill

P0 should be a tiny, reusable Skill with one on-chain OnceLatch registry on Pharos Atlantic and one CLI/API wrapper.

Minimum award-worthy slice:

replayfence.reserveOrExecute(intent)
  input:
    chainId = 688689
    idempotencyKey = keccak256(domain, actor, target, value, calldataHash, policyId, ttl)
    target tx or declared side-effect descriptor
  output:
    accepted | duplicate | expired | failed
    txHash
    event proof capsule

Required proof artifacts:

JSON
{
  "skill": "ReplayFence",
  "chainId": 688689,
  "registry": "0x...",
  "idempotencyKey": "0x...",
  "firstTxHash": "0x...",
  "duplicateTxHash": "0x...",
  "firstResult": "accepted",
  "secondResult": "duplicate",
  "event": {
    "name": "OnceLatched",
    "blockNumber": "...",
    "logIndex": "..."
  }
}

Award-worthy demo:

Run the same agent action twice. First call emits OnceLatched; second call reverts or returns duplicate. Then show a verifier that checks the receipt/log and reconstructs the idempotency key.

Why this is top: it is reusable, deadline-safe, easy to demo live, and directly solves a real agent-runtime failure mode.

2. IDEA-001 PharosProof Surgeon

P0 should verify one account proof and one storage proof against a known block header/state root, plus ship a “proof capsule” format.

Minimum award-worthy slice:

pharos-proof verify \
  --rpc <pharos_rpc> \
  --address <contract> \
  --slot <storage_slot> \
  --block <block_number>

Required verifier behavior:

1. Fetch block header and stateRoot.
2. Fetch eth_getProof for address + storage slot.
3. Locally verify accountProof from stateRoot.
4. Locally verify storageProof from storageHash.
5. Emit a capsule containing block hash, stateRoot, account fields, slot, value, proof nodes.
6. Mutate one byte in accountProof or storageProof and show verifier fails.

Required proof artifacts:

JSON
{
  "skill": "PharosProofSurgeon",
  "chainId": 688689,
  "blockNumber": "...",
  "blockHash": "0x...",
  "stateRoot": "0x...",
  "address": "0x...",
  "slot": "0x...",
  "value": "0x...",
  "accountProofValid": true,
  "storageProofValid": true,
  "tamperTest": "failed_as_expected"
}

Why this is top: it hits Pharos’s custom proof primitive directly and creates the strongest “proof realness” story. The risk is implementation detail, not product ambiguity.

3. IDEA-007 GasGuard Action Capsule

P0 should perform one safe Pharos transaction with preflight, EIP-1559 fee controls, and a postcondition proof.

Minimum award-worthy slice:

gasguard.execute({
  target,
  calldata,
  value,
  maxFeePolicy,
  postcondition: {
    type: "storageEquals" | "eventEmitted" | "balanceDelta",
    expected
  }
})

Required runtime behavior:

1. Read chainId and latest fee data.
2. Simulate the call.
3. Apply a bounded maxFee/maxPriorityFee policy.
4. Submit the tx.
5. Wait for receipt.
6. Verify postcondition from receipt/log or eth_getProof.
7. Emit action capsule.

Required proof artifact:

JSON
{
  "skill": "GasGuard",
  "chainId": 688689,
  "target": "0x...",
  "simulation": "passed",
  "gasPolicy": {
    "maxFeePerGas": "...",
    "maxPriorityFeePerGas": "...",
    "gasLimitBufferBps": 1500
  },
  "txHash": "0x...",
  "receiptStatus": 1,
  "postcondition": {
    "type": "eventEmitted",
    "verified": true
  }
}

Why this is top: it is highly buildable and visibly real. It is less technically distinctive than Proof Surgeon, but it is an excellent Phase 1 Skill.

Top 3 technical recommendations

Primary PRD: build IDEA-008, but add one eth_getProof-backed verification option from IDEA-001. This gives the best combination of feasibility, runtime realness, and proof strength: a OnceLatch registry is easy to deploy and demo, while proof verification makes the artifact feel Pharos-native rather than just another Solidity nonce registry.

Secondary PRD: keep IDEA-001 as the technical-depth contender. If the team has someone comfortable with Ethereum MPT/RLP verification, Proof Surgeon is the highest-signal sponsor primitive. Cut the scope aggressively: one contract, one storage slot, one proof capsule, one tamper-fail test.

Do not make x402 settlement the critical path unless already working on Pharos Atlantic. IDEA-002 is compelling, but deadline risk is higher because the demo can collapse if facilitator/network/token support is finicky. Use x402 signed offers/receipts as an optional module or stretch goal; the x402 docs already provide signed offer/receipt mechanics and verifier utilities, so the prize value comes from binding them cleanly to Pharos evidence. 
docs.x402.org
+1

Exclusions before PRD

Exclude IDEA-004 RouteVoucher SPN Skill from Phase 1 PRD. It is too dependent on future SPN framing and has the weakest runtime-realness path.

Exclude IDEA-006 BondedCall Receipt from Phase 1 PRD unless the team already has a deterministic SLA predicate. Bond/challenge systems are easy to describe and hard to make credible.

Do not lead with IDEA-003 SkillCard Forge. It is safe and cuttable, but it is more of a meta-tool than a sponsor-primitive demonstration. It can be a bonus checker bundled with the final submission.

Defer IDEA-009 LogPulse unless it is merged into ReplayFence or GasGuard as an event/proof envelope format. Alone, it risks looking like a typed webhook.

Final recommendation from this judge only

Greenlight IDEA-008 ReplayFence Idempotency Skill as the primary Phase 1 submission. It is the most buildable award-worthy Skill by June 15, has low integration risk, demonstrates real on-chain runtime behavior, and solves a concrete agent safety problem.

Runner-up: IDEA-001 PharosProof Surgeon. It has the best technical depth and proof artifact strength, but it carries higher implementation risk because the team must get MPT/RLP proof verification correct.

Best combined submission strategy: ship ReplayFence as the main Skill and include a small Proof Surgeon verifier as the proof backend for its registry state. That combination would be stronger than either alone: duplicate prevention plus independent Pharos proof verification.