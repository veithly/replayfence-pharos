# GPT Pro Spec Prompt: ReplayFence PRD + UIUX

You are producing the build spec for the selected Pharos Skill-to-Agent Dual Cascade Hackathon Phase 1 project.

Selected concept:
- Project name: ReplayFence
- Hero copy: Fence one agent action in 60 seconds, reject the replay, and export a proof capsule.
- One-line hook: ReplayFence blocks duplicate agent actions on Pharos in 60 seconds.
- Core primitive: PharosOnceLatch plus ReplayFence Capsule.
- Selected idea: IDEA-008 from the idea tournament.
- Strategic merge: Main product is ReplayFence; proof/detail surface borrows PharosProof Surgeon’s proof capsule pattern to make latch state verifiable and Pharos-native.

Contest facts:
- Phase 1 asks for high-quality reusable Skill modules, not broad AI apps.
- Phase 1 runs June 8 to June 22, 2026; Skill submission deadline June 15; judging June 16 to June 22.
- Prize/rubric fit: Skill module quality/usability, originality, technical completion, AI Agent practical use case, reusability/composability, Pharos blockchain integration, UX, documentation.

Sponsor primitives:
- Pharos Atlantic Testnet: chainId 688689, RPC https://atlantic.dplabs-internal.com, explorer https://atlantic.pharosscan.xyz/.
- Pharos `eth_getProof`: custom SHA-256 hexary account/storage proof surface. A verifier must independently derive offsets rather than trust metadata.
- Pharos gas model: EVM/EIP-1559 compatible; gas-limit buffer matters.
- x402 on Pharos is a P1/stretch wrapper, not the critical P0 path, unless you can keep it low-risk.

Judge results:
- Rubric/Sponsor judge: top 3 were ProofPay, PharosProof, ReplayFence. ReplayFence is a very strong reusable Skill but must not feel like generic EVM idempotency.
- Technical judge: ReplayFence ranked #1. Recommended shipping ReplayFence as main Skill and adding a small PharosProof backend for registry state.
- Product/Demo judge: ReplayFence ranked #1 with best stage demo: the judge double-clicks a dangerous action; only the first executes; duplicate is rejected with proof.

Required PRD sections:
1. Project background
2. Problem definition
3. Target users
4. User pain points
5. Core requirements & priority
6. Solution overview
7. User flows
8. User Cases (>= 2)
9. Demo critical path & Hero Moment
10. Pages / modules plan (>= 4 interactive surfaces)
11. Visual direction & UI principles
12. Technical constraints
13. Success metrics
14. Risks & cut list

Required UIUX interaction plan:
- Screen map with routes.
- First-run flow: 0-10s, 10-30s, 30-60s, 2-3min.
- Default/loading/empty/error/success states for P0 screens.
- Demo choreography.
- Mobile behavior.
- Accessibility notes.
- Test selectors.

Implementation constraints:
- Build a public operable app, not a demo shell.
- At least 4 interactive surfaces: landing/hero may not count as a product surface.
- At least 5 wired beats across at least 2 user cases.
- At least 3 real backbones should be planned from: storage/session, chain/contract, proof/verifier, API workflow, multi-step workflow.
- Use guest/demo access before any wallet/login wall.
- P0 must work without private judge credentials.
- Save proof/capsule history for the guest session.
- Contract/action safety must be explicit; do not imply production-grade wallet security.

Preferred stack unless you strongly object:
- Next.js App Router + TypeScript.
- Local JSON/SQLite or file-backed seed history for demo mode.
- Viem or ethers for Pharos Atlantic RPC/contract interactions.
- Solidity/Hardhat for `OnceLatchRegistry`.
- Playwright for runtime proof.

Return:
1. A detailed PRD in the 14-section structure.
2. A detailed UIUX interaction plan.
3. A P0/P1/P2 scope cut list.
4. A traceability matrix with at least 8 requirements mapping to route/component/API/data/state/test/evidence.
5. A concise implementation strategy that avoids overbuilding and keeps the demo award-worthy.
