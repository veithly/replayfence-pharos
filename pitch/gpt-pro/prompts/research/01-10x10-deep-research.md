# GPT Pro Deep Research Prompt: Pharos Skill-to-Agent Dual Cascade Hackathon

You are doing source-backed product strategy research for a hackathon submission.

Current contest:
- DoraHacks URL: https://dorahacks.io/hackathon/pharos-phase1/detail
- Public title found in search snippets and page metadata: "Skill-to-Agent Dual Cascade Hackathon"
- Sponsor/domain: Pharos Network / Anvita Flow / AI Agent skill ecosystem
- Prize pool reported in public snippets: 50,000 PROS
- Phase 1 window reported by public snippets: June 8 to June 15, 2026, focused on Skill submission before later agent/arena phases.
- Reported judging criteria from the current contest page/snippets and related public materials: originality, technical completion, AI Agent practical use case, reusability/composability, Pharos blockchain integration, user experience, and documentation.
- Pharos official docs facts to account for:
  - Pharos is a modular full-stack parallel L1 with L1-Base, L1-Core, and L1-Extension.
  - L1-Extension includes Special Processing Networks (SPNs), Native Restaking, Cross-SPN interoperation, and AI/ZKML style heterogeneous computation.
  - Atlantic Testnet: RPC https://atlantic.dplabs-internal.com, WSS wss://atlantic.dplabs-internal.com, explorer https://atlantic.pharosscan.xyz/, ChainID 688689, 500 requests per 5 minutes, 64 max pending txs per address.
  - Testnet also exists with chainId 688688 and RPC https://testnet.dplabs-internal.com.
  - Pharos supports x402 on Atlantic Testnet. x402 is an HTTP 402 payment protocol for pay-per-use APIs and agent commerce. On Pharos it supports all ERC-20 tokens; docs present Express server and fetch client examples using network eip155:688689.
  - Pharos exposes a non-Ethereum-shaped eth_getProof storage/account proof API. It uses SHA-256 and a hexary hash tree with MSU Root, Internal, and Leaf nodes. Sound verification must independently derive offsets rather than trusting response offsets.
  - Pharos gas model is EVM-compatible with EIP-1559 and requires a gas limit buffer because transaction fee model charges by gas_limit at inclusion time.

Research goal:
Build the evidence base for an award-worthy Phase 1 project. The output should make it easier to select a non-generic, demoable Skill that an AI Agent can call, reuse, compose, and prove on Pharos. Avoid ideas that are only dashboards, chatbots, wallet dashboards, generic RAG, or upload-summary apps.

Deliverable format:
1. Research at least 10 completed hackathons from roughly the last 24 months with accessible winner/project evidence. Prefer AI agents, Web3, protocol primitives, pay-per-use APIs, skill/plugin ecosystems, MCP/tooling, or developer tools. Use HACK-01 through HACK-10.
2. Research at least 10 mature production products or protocols with reusable loops relevant to skills, agent tools, API marketplaces, pay-per-use, proof verification, workflow gates, or composable developer tools. Use PROD-01 through PROD-10.
3. For each HACK entry, include: event, date, platform/source URL, winner/project names if available, winning surface, portable pattern, what not to copy, and one implication for this Pharos contest.
4. For each PROD entry, include: product/protocol, source URL, core loop, trust/proof mechanism, pricing/payment or access-control mechanism if relevant, and one implication for this Pharos contest.
5. Include a contest-specific synthesis:
   - What judges are likely to reward in Phase 1.
   - What "Skill" should mean in this contest, given the Skill-to-Agent cascade.
   - Which sponsor primitives should be visible in the first 60 seconds.
   - 6 idea families that are fresh in 2026 and fit Pharos.
   - 6 clone traps to avoid.
   - A "winner recipe" for a Pharos Phase 1 submission.
6. Include cited links for all external facts.

Evaluation criteria:
- Prefer product loops with a live consequence in under 60 seconds.
- Prefer skill/API primitives that create a durable artifact: receipt, proof bundle, signed record, settlement event, API result with payment proof, verifier report, or agent-call transcript.
- Prefer sponsor depth: x402 pay-per-use, Pharos chain transaction/proof, eth_getProof verifier, SPN/restaking-aware routing, or composable agent skill metadata.
- Penalize generic AI assistant or wallet dashboard ideas.

Return a structured report in Markdown. Keep quotes short; summarize sources in your own words.
