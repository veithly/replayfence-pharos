Pharos Skill-to-Agent Dual Cascade Hackathon Research
Executive takeaways
The highest-confidence read on Phase 1 is that judges are not looking for a broad “AI app.” They are looking for reusable skill modules that are visibly useful on their own, can later be composed into agents, and show obvious alignment with the Pharos on-chain agent economy. The public Pharos event page describes a two-phase, six-week structure in which Phase 1 runs from June 8 to June 22, 2026, with skill submission by June 15 and judging from June 16 to June 22; it also states a 50,000 PROS total pool, with 20,000 PROS allocated to the Phase 1 Skill Hackathon. DoraHacks snippets for the same event emphasize “quality and usability of Skill modules” and encourage builders to create “original, practical, and reusable components” for future AI agents on Pharos. [1]
The strongest strategic pattern across recent hackathons is not “more agent.” It is “one narrow skill, one paid call, one durable artifact, one proof or settlement trace.” The best recent projects tend to win when a live user or agent action causes a visible consequence in under a minute: a payment clears, a verifier report is issued, a task verdict is posted, a receipt is written on-chain, or a trust signal becomes queryable by another agent. That pattern shows up in recent x402 payment experiments, verifiable AI winners, on-chain registry projects, and ordered-audit-trail systems. [2]
For Pharos specifically, the best-bet Phase 1 concept is a proof-carrying paid action skill: a narrow API-like capability that can be called by an agent, charges via x402, executes or verifies something on Atlantic Testnet, and returns a durable artifact such as a tx hash, verifier report, signed receipt bundle, account/storage proof bundle, or policy decision trace. That aligns directly with Pharos’s positioning as a modular full-stack parallel L1 with L1-Extension, SPNs, native restaking, cross-SPN interoperation, and heterogeneous compute for things like AI and ZKML. [3]
Contest frame and sponsor primitives
Pharos’s official docs describe the network as a modular, full-stack parallel L1 with three layers: L1-Base, L1-Core, and L1-Extension. The L1-Extension layer is where the most contest-relevant sponsor depth appears: Special Processing Networks, native restaking, and cross-SPN interoperation, with explicit mention of non-traditional workloads such as HFT, ZKML, and AI models. In plain product terms, that means the sponsor story is not “another EVM chain.” It is “an EVM-shaped base with room for differentiated compute lanes and composable services above it.” [4]
For a public demo, Atlantic Testnet is the obvious target environment. Pharos documents a public Atlantic RPC and WSS endpoint, a public explorer, ChainID 688689, a rate limit of 500 requests per 5 minutes, and 64 max pending transactions per address. The same docs page presents Atlantic as the active public-facing network, while a separate Testnet Information page exists for additional network resources. In practice, that means your demo should avoid bursty retries and should not rely on a single hot sender spamming many transactions. [5]
Pharos also documents an x402 integration path. In public snippets, the Pharos x402 docs describe x402 as an internet-native payment protocol, note that on Pharos it supports all ERC-20 tokens, and show both Express server and Fetch + x402 SDK style examples using eip155:688689. That is unusually important for Phase 1 because it gives you a sponsor-native way to turn a “skill” into a metered, callable, agent-commerce primitive rather than just a free demo endpoint. [6]
A second sponsor primitive is Pharos’s customized eth_getProof flow. The docs explicitly note that the API is not shaped like Ethereum’s standard eth_getProof, and they describe a SHA-256-based hexary hash tree with MSU Root, Internal, and Leaf proof nodes. The public example verifier in Pharos’s repo computes verification state from the path and hash process rather than blindly trusting arbitrary node placement metadata. The practical implication is strong: if your skill says it “verifies Pharos state,” it should surface a real proof bundle and an independent verifier result, not just relay RPC output. That is one of the cleanest ways to show non-generic sponsor depth in Phase 1. [7]
Finally, Pharos’s gas model matters to product design. The docs say opcode pricing is aligned with the EVM gas table and that Pharos is EIP-1559 compatible, but they also warn that transaction fees are charged by gas_limit at inclusion time and recommend adding a gas buffer above expected execution cost. Cheap-looking “one click” demos that fail unpredictably because gas was set too tightly will look shallow; robust retries, buffered gas, and clean observability will look more mature. [8]
Hackathon pattern scan
ID
Event and date
Winner or project evidence
Winning surface
Portable pattern
What not to copy
One implication for Pharos
HACK-01
ETHGlobal Brussels, July 12–14, 2024. [9]
DeGlobal proposed a decentralized hackathon index where GitHub projects are attested on-chain and winners are attested and rewarded on-chain. [10]
Project showcase page; no prize surface was visible in the retrieved page. [10]
Turn submissions into machine-readable proof objects that can later be rewarded, indexed, or recomposed. [10]
Do not copy the “decentralize the whole platform” ambition. That is too broad for Phase 1.
Build a single proof-producing skill rather than an entire marketplace: for example, “proof this API result / proof this agent action / proof this state condition.” [11]
HACK-02
ETHGlobal Bangkok, November 15–17, 2024. [12]
Industry AI won multiple sponsor prizes and was an ETHGlobal Bangkok finalist. Its core idea was a multi-agent platform where tools are independent modules dynamically assigned to agents. [13]
Coinbase CDP SDK 1st place, Base 1st place, Scroll 1st place, ETHGlobal Bangkok finalist. [13]
Separate tool modules from agent personas. Let tools be reassigned, reused, and orchestrated. [13]
Do not copy the “multi-agent generalist agency” scope. It becomes demo-noisy and generic fast.
A Pharos “Skill” should look like a module with a stable interface and artifact output, not a chat personality. [14]
HACK-03
Verifiable AI Hackathon 2025 by cheqd, DoraHacks, Verida, and SPRITE+; winner post published June 11, 2025; submission deadline May 2 and winner announcement May 19, 2025. [15]
Identone took 1st place in the Agentic Economy & AI Agents track by making voice-based AI interactions verifiable via DIDs and verifiable credentials. [16]
cheqd main track, Agentic Economy & AI Agents, 1st Place. [16]
Add a verifiable identity / authorization layer to an otherwise ordinary interaction. [16]
Do not copy “trust” as a policy essay. The winning move was to make verification visible in the interaction itself.
A Pharos skill that emits a signed verifier report or proof-backed authorization receipt would fit the same winning pattern. [17]
HACK-04
Flare x Google Cloud Verifiable AI Hackathon, March 7–14, 2025 virtual with winner announcement March 31, 2025. [18]
Flare’s winner spotlight highlighted 2DeFi, a Gemini-powered platform that used portfolio analysis and guided DeFi actions in confidential environments. Flare’s recap stressed that all projects used confidential compute with vTPM attestations as proof of isolated execution. [19]
In-person and virtual winner showcase; Flare’s recap emphasizes verifiable AI compute. [19]
Pair AI output with a compute-attestation story rather than asking judges to trust the backend. [20]
Do not copy generic DeFAI advisory UX. The differentiator was verifiable execution.
On Pharos, the analogous move is a skill that returns a result plus proof material or a verifier bundle, not just a JSON answer. [21]
HACK-05
Injective x ElizaOS AI Agent Hackathon, introduced January 21, 2025; hackathon started February 4, 2025 with a $100,000 pool. [22]
DoraHacks’ winner snippet says Jecta’s beta was designed to help users master Injective’s core concepts and DeFi structures. [23]
Winner announcement page was accessible by snippet, though full detail fetch was blocked. [23]
The winning surface appears to have favored narrowly useful agent infrastructure rather than broad consumer AI theater. [24]
Do not copy “teach me everything” positioning. It risks becoming just a chatbot.
If you build an educational or decision skill, bind it to a real paid action or proof artifact, not just explanations. [25]
HACK-06
ETHGlobal New York 2025, August 15–17, 2025. [26]
x402-flash won a Coinbase CDP prize and became an ETHGlobal finalist. It used an escrow contract to remove blocking settlement latency from x402 micropayments. [27]
Coinbase Developer Platform prize; ETHGlobal New York 2025 finalist. [27]
Convert “pay before response” into escrow-backed near-instant paid calls. [27]
Do not copy the full protocol redesign. That is too deep for a Phase 1 skill.
Copy the product loop instead: paid request, guaranteed fulfillment, instant artifact back. That is almost exactly what a Pharos skill should feel like. [28]
HACK-07
ETHGlobal New Delhi, September 26–28, 2025. [29]
Reputo built non-custodial lending with a repay buffer, OCCR credit scoring, unique-human gating, and an x402 fee on Polygon Amoy to authorize automated top-ups without bridging principal. [30]
Project showcase page; no prize surface was visible in the retrieved page. [30]
Use a tiny, paid authorization event as a safety signal for privileged automation. [30]
Do not copy the whole three-chain system.
A great Pharos Phase 1 skill could be “pay a small x402 fee to authorize a conditional on-chain action, then return the action receipt + policy transcript.” [31]
HACK-08
ETHGlobal Buenos Aires, November 21–23, 2025. [32]
All AI Hub presented registry-style infrastructure for personal AIs to discover and pay vertical AIs. It used AgentCards, signatures, x402 settlement, JWT issuance, and MCP transport. [33]
Project showcase page; no prize surface was visible in the retrieved page. [33]
Winning-looking loop: discovery → authenticity → reputation → payment → access. [33]
Do not copy the whole marketplace in Phase 1.
Build one registrable skill with metadata, signature, price, and callable endpoint. Let later agents compose it. [34]
HACK-09
Hello Future Apex Hackathon, winners announced May 12, 2026. [35]
Dossier placed 2nd in AI & Agents. It runs three AI agents continuously, posts attestations on Hedera Consensus Service, registers in a ledger/registry, and exposes verified intelligence to other agents with protocol-level payments. [35]
AI & Agents, 2nd Place. [35]
Turn a useful pipeline into a compounding artifact stream that other agents can query and trust. [35]
Do not copy the whole news product.
The Pharos analogue is a skill that emits ordered, queryable receipts or verifier traces, not one-off outputs. [36]
HACK-10
ETHGlobal Cannes 2026, April 3–5, 2026. [37]
Hivera showed an especially Pharos-relevant loop: requester and worker agents bid for work, pay premium APIs through x402, get judged, and settle on-chain, all in under 60 seconds with an ordered audit trail. [38]
Project showcase page; no prize surface was visible in the retrieved page. [38]
The best loop is task posted → paid work executed → verdict posted → escrow released → audit trail remains. [38]
Do not copy the whole labor market.
A Phase 1 winner can be just one side of that loop: for example, Judge Skill, Evidence Skill, or Paid Worker Skill with receipts. [39]
Production loop scan
The table below mixes primary product docs with a small number of credible implementation pages where the practical loop is more visible than in vendor documentation. I would treat the first eight rows as the highest-confidence product references.
ID
Product or protocol
Core loop
Trust or proof mechanism
Pricing, payment, or access-control mechanism
One implication for Pharos
PROD-01
Pharos x402. Source: official Pharos docs snippets. [40]
Client receives a 402 challenge, signs a payment flow, then accesses a paid endpoint. Pharos shows both server and fetch client examples on Atlantic. [41]
Payment proof is bound to the HTTP transaction flow; the network in examples is eip155:688689. [42]
On Pharos, x402 supports ERC-20 payments. [43]
This is the most sponsor-native way to make a Phase 1 skill feel like agent commerce, not a free demo. [40]
PROD-02
MCP ecosystem as practical agent-tool interop. Source: Anthropic Academy plus All AI Hub implementation. [44]
Tools expose stable capabilities to agents; clients discover and call them through a protocol/server boundary. [45]
Capability schema and server mediation provide the trust boundary; in All AI Hub the server also handles JWT issuance and task-ID deduplication. [33]
All AI Hub demonstrates JWT-gated MCP access layered with x402 payment. [33]
A Phase 1 skill should behave like a protocolized tool, with crisp inputs, outputs, metadata, and auth. [34]
PROD-03
Sigstore / Cosign / Rekor. Source: official Sigstore docs. [46]
Sign an artifact, bind it to an identity, and verify later against a transparency log. [47]
Short-lived certs from Fulcio plus Rekor transparency-log entries; verification can be keyless and identity-bound via OIDC. [48]
Open verification; access control is usually downstream policy. [49]
Pharos skills should return verifiable receipts that feel closer to software attestation than to chat history. [50]
PROD-04
Lit Protocol. Source: official developer docs. [51]
Read data, run JS in a chain-secured TEE, and sign or gate actions with enclave-held keys. [52]
Keys never leave the enclave; code use is governed on-chain and access conditions are checked by Lit’s decentralized ACL logic. [53]
Access control is the product: on-chain conditions decide who can decrypt, sign, or execute. [54]
Skills that combine paid access + governed execution + signed output will look materially stronger than plain APIs. [52]
PROD-05
EigenLayer / EigenCloud AVS model. Source: official Eigen docs. [55]
A service opts into shared security from restaked assets, delivers work, and can reward or slash operators under AVS rules. [56]
AVSs leverage Ethereum shared security; restaking lets stakers secure services and accept AVS-defined slashing conditions. [56]
Rewards and slashing are protocol-defined by AVS providers. [57]
Since Pharos highlights native restaking and SPNs, any Phase 1 skill that is framed as a service ready for future shared-security routing is directionally aligned. [58]
PROD-06
Request Network. Source: official docs. [59]
Create a payment request, reconcile payment, and route value without intermediaries. [60]
Payment requests become durable objects that can be matched to settlement and reconciled with high accuracy. [61]
Request exposes a dashboard, payment pages, and API; click-to-pay and routing are first-class product surfaces. [60]
The lesson is to make the artifact itself valuable. A Pharos skill should create a reusable receipt object, not just a response blob. [60]
PROD-07
Request Finance Invoice API. Source: official docs. [62]
Create an invoice, store the underlying request on-chain, and manipulate it through a higher-level API schema. [62]
The underlying payment request persists on-chain; invoices are a schema-constrained, machine-handled implementation of that request. [62]
Access is API-based; pricing is product-governed. [62]
This is a strong template for a skill manifest + receipt schema on Pharos. [62]
PROD-08
Chainlink oracle platform. Source: Chainlink official site. [63]
Bring external data or events on-chain so contracts or agents can settle based on something beyond local state. [63]
The trust promise is decentralized oracle delivery and industry-standard data transport into on-chain systems. [63]
Pricing varies by network and service; not the key insight here.
Skills that bridge off-chain evidence to on-chain action still outperform purely conversational tools. [64]
PROD-09
Hedera HCS-10 / HOL-style registry patterns. Source: Hedera official winners post describing live implementations. [35]
Register an agent or intelligence stream in a discoverable ledger, then let other agents query it and pay for use. [35]
Consensus ordering, immutable audit trails, and registry-based discovery are the trust primitives. [35]
Hedera winners demonstrated protocol-level payments over discoverable agent outputs. [35]
Pharos Phase 1 should make a skill discoverable and payable, not only runnable. [65]
PROD-10
World ID + Agent Kit as a human-gating and agent-safety stack. Source: ETHGlobal Cannes prizes page plus DIVE implementation. [66]
Verify a human, bind that proof to an app or agent workflow, and use it as an eligibility or uniqueness constraint. [67]
The Cannes prize page requires proof validation and says AgentKit-based experiences should use World ID to improve safety, fairness, or trust; DIVE showed a concrete human-backed-agent architecture. [66]
Access control comes from proof-of-personhood gating rather than payment alone. [67]
For Pharos, this suggests that the best skills may combine payment gating and trust gating, especially for privileged actions. [68]
Contest-specific synthesis
What judges are likely to reward in Phase 1. The public contest framing strongly suggests four things matter most: a skill must be usable by itself, reusable by other builders, obviously compatible with future agent composition, and credibly tied to Pharos primitives rather than to a generic LLM wrapper. The strongest judged surface is a short demo where a skill receives an input, performs a paid or on-chain action, and leaves behind a durable artifact that later agents can read. That interpretation matches the contest’s public emphasis on reusable skill modules and the pattern seen in x402-flash, Reputo, All AI Hub, Dossier, and Hivera. [69]
What “Skill” should mean here. In this contest, a skill should be understood as a priced or gated callable primitive with a stable interface, artifact output, and composable metadata. In other words: closer to a protocol tool or paid API method than to an end-user chatbot feature. A good Phase 1 skill has a job description an agent can understand, a machine-readable input/output contract, a visible payment or authorization path, and an output that can be stored, verified, or reused later. That interpretation is consistent with the contest’s “quality and usability of Skill modules” language, with Industry AI’s dynamic tool model, and with All AI Hub’s discovery-payment-access loop. [70]
Which sponsor primitives should be visible in the first 60 seconds. The best first minute is not “ask the assistant a question.” It is: (1) show an x402-protected skill endpoint or 402 challenge, (2) complete a paid or authorized call on Atlantic, (3) surface a Pharos transaction or state-proof-related artifact, and (4) show a final receipt bundle in JSON that another agent could consume. If the skill writes on-chain, the explorer should be visible. If it verifies state, the verifier report should be visible. If it routes an action, the policy trace should be visible. Because Atlantic is public and x402 examples are presented for eip155:688689, this is the clearest sponsor-native demo lane. [71]
Six idea families that feel fresh in 2026 and fit Pharos.
Proof-carrying paid verifiers. A skill that takes a target contract/account/storage slot, charges via x402, fetches Pharos proof material, and returns a verifier report plus normalized proof bundle. This is unusually sponsor-deep because it uses both x402 and the custom Pharos proof surface. [72]
Conditional action authorizers. A skill that uses a tiny x402 payment as a per-action authorization signal for a privileged follow-up action, similar to Reputo’s use of 402 as an automation trigger. The artifact would be a “policy-approved action receipt” and tx hash. [30]
Judge or referee skills. A narrow skill that evaluates competing worker outputs or off-chain evidence, posts a signed verdict or attestation, and optionally releases escrow. Hivera and Dossier show that “verdict + audit trail” is a strong recent loop. [73]
Agent-discovery skill registries. Not a full marketplace, but a clean Pharos-native registry for callable skills with metadata, signature, price, capability tags, and output schemas. All AI Hub shows the discovery-authenticity-reputation-payment shape. [33]
Human-backed exception handlers. A skill that routes edge cases to a human-backed verifier or human-approved action flow and returns an auditable decision record. Cannes and World-agent patterns make “human-only when it matters” feel current rather than old-fashioned. [74]
SPN-aware routing skills. A skill that looks simple at the surface but visibly chooses a “compute lane” or execution mode based on job type, then returns an execution receipt that says why. Even if the SPN routing is partly simulated in Phase 1, it aligns tightly with Pharos’s L1-Extension story. [4]
Six clone traps to avoid.
A generic “chat with your wallet / portfolio” assistant.
A dashboard-first product where the chain never matters in the first minute.
A generic RAG or document-summary app with no priced tool call and no durable artifact.
A “marketplace” that is really just a landing page plus listings, with no call/settlement/verifier loop.
A monolithic multi-agent demo where it is impossible to tell what the reusable skill actually is.
A proof feature that only displays RPC output without independent verification or reusable receipts. [75]
Winner recipe and open questions
A credible winner recipe for Pharos Phase 1 is:
Build one narrow skill, not a broad app.
Put it behind x402 from day one.
Execute on Atlantic Testnet and show the explorer or verifier output immediately.
Return a durable artifact every time: proof bundle, verifier report, settlement receipt, signed decision record, or agent-call transcript.
Publish a stable schema so a later Phase 2 agent can call it without reinterpretation.
Make the first 60 seconds a complete consequence loop: request, pay or authorize, execute or verify, return artifact, inspect result. [76]
If I had to reduce all the research into a single recommendation, it would be this: ship a proof-carrying paid action skill on Atlantic. The strongest candidate variants are a state verifier skill, a conditional action authorization skill, or a judge skill that releases a verdict receipt. Those variants are non-generic, agent-callable, composable, demoable in under a minute, and visibly native to Pharos’s x402 + modular-compute + proof surface. [77]
Open questions / limitations. Some DoraHacks pages blocked full fetches, so a few contest and winner details were recoverable only from search snippets rather than full page text. The product scan is strongest where I could verify primary docs directly; two entries rely on credible implementation/winner pages to make the loop more concrete. Also, Pharos’s separate non-Atlantic test environment is documented as a distinct page, but the clearest public-demo path in the retrieved docs is still Atlantic Testnet, which is the network directly tied to public endpoints and x402 examples. [78]

[1] [69] [76] https://www.pharos.xyz/agent-carnival
https://www.pharos.xyz/agent-carnival
[2] [27] [28] https://ethglobal.com/showcase/x402-flash-yj9wd
https://ethglobal.com/showcase/x402-flash-yj9wd
[3] [4] [58] [77] https://docs.pharosnetwork.xyz/
https://docs.pharosnetwork.xyz/
[5] [7] [71] https://docs.pharosnetwork.xyz/network-overview/pharos-networks
https://docs.pharosnetwork.xyz/network-overview/pharos-networks
[6] [40] [41] [42] [43] [72] https://docs.pharos.xyz/developer-guide/x402
https://docs.pharos.xyz/developer-guide/x402
[8] https://docs.pharosnetwork.xyz/network-overview/pharos-gas-model
https://docs.pharosnetwork.xyz/network-overview/pharos-gas-model
[9] https://ethglobal.com/events/brussels
https://ethglobal.com/events/brussels
[10] [11] https://ethglobal.com/showcase/deglobal-3oiku
https://ethglobal.com/showcase/deglobal-3oiku
[12] https://ethglobal.com/events/bangkok
https://ethglobal.com/events/bangkok
[13] [14] https://ethglobal.com/showcase/industry-ai-4w3vy
https://ethglobal.com/showcase/industry-ai-4w3vy
[15] [16] [17] https://cheqd.io/blog/congratulations-to-the-verifiable-ai-hackathon-winners/
https://cheqd.io/blog/congratulations-to-the-verifiable-ai-hackathon-winners/
[18] https://hackathon.flare.network/
https://hackathon.flare.network/
[19] https://www.linkedin.com/pulse/verifiable-ai-blockchain-spotlight-virtual-irl-winners-flare-styke
https://www.linkedin.com/pulse/verifiable-ai-blockchain-spotlight-virtual-irl-winners-flare-styke
[20] [21] https://flare.network/news/flare-hackathon-winners
https://flare.network/news/flare-hackathon-winners
[22] https://injective.com/blog/introducing-the-injective-x-elizaos-ai-agent-hackathon
https://injective.com/blog/introducing-the-injective-x-elizaos-ai-agent-hackathon
[23] [24] [25] https://dorahacks.io/hackathon/injective-ai/winner
https://dorahacks.io/hackathon/injective-ai/winner
[26] https://ethglobal.com/events/newyork2025
https://ethglobal.com/events/newyork2025
[29] https://ethglobal.com/events/newdelhi
https://ethglobal.com/events/newdelhi
[30] [31] https://ethglobal.com/showcase/reputo-0seb7
https://ethglobal.com/showcase/reputo-0seb7
[32] https://ethglobal.com/events/buenosaires
https://ethglobal.com/events/buenosaires
[33] [34] [45] https://ethglobal.com/showcase/all-ai-hub-xze5d
https://ethglobal.com/showcase/all-ai-hub-xze5d
[35] [36] [65] https://hedera.com/blog/these-are-the-winners-of-the-hello-future-apex-hackathon/
https://hedera.com/blog/these-are-the-winners-of-the-hello-future-apex-hackathon/
[37] https://ethglobal.com/events/cannes2026
https://ethglobal.com/events/cannes2026
[38] [39] [73] https://ethglobal.com/showcase/hivera-are13
https://ethglobal.com/showcase/hivera-are13
[44] AI Learning Resources & Guides from Anthropic
https://www.anthropic.com/learn?utm_source=chatgpt.com
[46] [47] [48] [50] Overview
https://docs.sigstore.dev/cosign/signing/overview/?utm_source=chatgpt.com
[49] Overview
https://docs.sigstore.dev/about/overview/?utm_source=chatgpt.com
[51] [52] [53] Lit Protocol - Documentation
https://developer.litprotocol.com/?utm_source=chatgpt.com
[54] Introduction | Lit Protocol Developer Docs
https://developer-dev.litprotocol.com/docs/intro/?utm_source=chatgpt.com
[55] [56] EigenLayer Overview | EigenCloud
https://docs.eigencloud.xyz/eigenlayer/concepts/eigenlayer-overview?utm_source=chatgpt.com
[57] Terms of Service | EigenCloud
https://docs.eigencloud.xyz/eigencloud/legal/terms-of-service?utm_source=chatgpt.com
[59] [60] Request Network Docs
https://docs.request.network/use-cases/welcome?utm_source=chatgpt.com
[61] RequestNetwork/docs.request.network
https://github.com/RequestNetwork/docs.request.network?utm_source=chatgpt.com
[62] Invoices - API Documentation - Request Finance
https://docs.request.finance/invoices?utm_source=chatgpt.com
[63] [64] Chainlink: The Industry-Standard Oracle Platform
https://chain.link/?utm_source=chatgpt.com
[66] [67] [68] [74] https://ethglobal.com/events/cannes2026/prizes
https://ethglobal.com/events/cannes2026/prizes
[70] [75] [78] https://dorahacks.io/hackathon/pharos-phase1
https://dorahacks.io/hackathon/pharos-phase1