# Winner Research

## Search Log

| Query / URL | Why inspected | Result | Used? |
|---|---|---|---|
| https://dorahacks.io/hackathon/pharos-phase1/detail | Current hackathon detail page | Command-line fetch hit AWS WAF CAPTCHA; search/GPT Pro snippets used for facts. | partial |
| https://www.pharos.xyz/agent-carnival | Official Pharos event page | Confirms two-phase cascade, Phase 1 timing, skill focus, and prize pool framing. | yes |
| https://docs.pharos.xyz/introduction/readme.md | Sponsor architecture | Confirms L1-Base, L1-Core, L1-Extension, SPNs, restaking, cross-SPN interoperation. | yes |
| https://docs.pharos.xyz/getting-started/network/atlantic-testnet.md | Demo network details | Confirms Atlantic RPC/WSS, explorer, chain ID 688689, rate limit, max pending txs. | yes |
| https://docs.pharos.xyz/developer-guide/x402.md | Sponsor payment primitive | Confirms x402 on Pharos, ERC-20 support, eip155:688689 examples. | yes |
| https://docs.pharos.xyz/api-and-sdk/eth-getproof.md | Sponsor proof primitive | Confirms customized SHA-256 hexary proof API and independent offset verification requirement. | yes |
| https://docs.pharos.xyz/getting-started/gas-model.md | Transaction reliability | Confirms EVM/EIP-1559 compatibility and gas-limit buffer recommendation. | yes |
| `pitch/gpt-pro/responses/research/01-10x10-deep-research-response.md` | Required GPT Pro 10x10 evidence | Produced 10 completed hackathon patterns, 10 product loops, and Pharos synthesis. | yes |

## Current Hackathon Brief

- Hackathon: Pharos Skill-to-Agent Dual Cascade Hackathon, Phase 1 Skill Hackathon.
- Dates: Phase 1 runs June 8 to June 22, 2026; Skill submission deadline is June 15, 2026; judging runs June 16 to June 22, 2026.
- Prize pool: 50,000 PROS total; GPT Pro research found 20,000 PROS allocated to Phase 1.
- Submission object: a Skill module, not a generic AI app. The skill should be original, practical, reusable, composable, and usable by future AI agents.
- Inferred judging criteria: quality and usability of Skill modules, originality, technical completion, AI Agent practical use case, reusability/composability, Pharos blockchain integration, UX, and documentation.
- Sponsor primitives:
  - Pharos Atlantic Testnet, chainId `688689`, RPC `https://atlantic.dplabs-internal.com`, explorer `https://atlantic.pharosscan.xyz/`.
  - x402 pay-per-use skill/API access on Pharos (`eip155:688689`), with ERC-20 payment support.
  - `eth_getProof` for account/storage proof with Pharos-specific SHA-256 hexary tree proof format.
  - SPN / L1-Extension / restaking story for future routing and agent-service composition.
  - EVM-compatible execution and EIP-1559 gas behavior, with buffer needed for reliability.

## Comparable Events

| Event | Platform | Why comparable | Winners/gallery URL | Portable lesson |
|---|---|---|---|---|
| ETHGlobal Bangkok 2024 | ETHGlobal | Multi-agent modular tools | https://ethglobal.com/showcase/industry-ai-4w3vy | Tool modules should be independent from agent personas. |
| Verifiable AI Hackathon 2025 | cheqd/DoraHacks/partners | Verifiable AI agents and credentials | https://cheqd.io/blog/congratulations-to-the-verifiable-ai-hackathon-winners/ | Verification must appear in the product loop, not only in copy. |
| ETHGlobal New York 2025 | ETHGlobal | x402 micropayments and paid API loops | https://ethglobal.com/showcase/x402-flash-yj9wd | A paid request should return an immediate durable artifact. |
| ETHGlobal Buenos Aires 2025 | ETHGlobal | Agent discovery/payment/MCP pattern | https://ethglobal.com/showcase/all-ai-hub-xze5d | Registry, authenticity, payment, access, and schema form a strong skill path. |
| Hello Future Apex 2026 | Hedera | Agent intelligence streams and attestations | https://hedera.com/blog/these-are-the-winners-of-the-hello-future-apex-hackathon/ | Agent outputs become more valuable when ordered, paid, and queryable. |
| ETHGlobal Cannes 2026 | ETHGlobal | Task agents, x402 paid APIs, audit trails | https://ethglobal.com/showcase/hivera-are13 | The 60-second demo loop should end in a verdict/receipt/audit trail. |

## Winner Autopsies

### Winner Autopsy 1: x402-flash

- Event date: 2025-08-15 to 2025-08-17.
- Recency class: primary.
- Source: https://ethglobal.com/showcase/x402-flash-yj9wd
- Why still relevant: It turns x402 payment latency into a visible product primitive.
- What not to copy: Full protocol redesign.
- Portable pattern: Paid request, guaranteed fulfillment, instant artifact.
- Pharos implication: A Phase 1 Skill should show the 402/payment moment and return a receipt/result bundle in under 60 seconds.

### Winner Autopsy 2: All AI Hub

- Event date: 2025-11-21 to 2025-11-23.
- Recency class: primary.
- Source: https://ethglobal.com/showcase/all-ai-hub-xze5d
- Why still relevant: It models discovery, signature, payment, and access around vertical AI services.
- What not to copy: Full marketplace.
- Portable pattern: AgentCard/manifest, authenticity, x402 settlement, gated tool access.
- Pharos implication: Build one excellent registrable Skill with metadata, price, schema, and proof, not a whole skill marketplace.

### Winner Autopsy 3: Hivera

- Event date: 2026-04-03 to 2026-04-05.
- Recency class: primary.
- Source: https://ethglobal.com/showcase/hivera-are13
- Why still relevant: It demonstrates paid agent work, verdicts, settlement, and audit trail within a short demo.
- What not to copy: Entire requester/worker labor market.
- Portable pattern: Task, paid work, judgement, settlement, ordered audit trail.
- Pharos implication: A Judge Skill or Evidence Skill can win if it produces a verdict receipt and proof history.

### Winner Autopsy 4: Dossier

- Event date: winners announced 2026-05-12.
- Recency class: primary.
- Source: https://hedera.com/blog/these-are-the-winners-of-the-hello-future-apex-hackathon/
- Why still relevant: It shows agent outputs becoming queryable, attested intelligence streams.
- What not to copy: Entire intelligence/news pipeline.
- Portable pattern: Repeated agent pipeline emits attestations to a ledger/registry.
- Pharos implication: A skill history/receipt surface is mandatory; every call should become reusable evidence.

## Novelty Brief

- New constraints or technologies since older examples:
  - x402 is now a recognizable agent-commerce primitive.
  - Pharos provides sponsor-specific proof and chain surfaces beyond a generic EVM RPC.
  - Recent agent hackathons reward composable tools and proof artifacts, not personality wrappers.
- User behavior shifts:
  - Agents increasingly call other tools/APIs; skills need stable schema and receipts.
  - Judges expect public URLs, runnable evidence, and proof in the first minute.
- Sponsor/platform primitives newly possible:
  - Atlantic Testnet public execution.
  - x402 paid calls on `eip155:688689`.
  - Pharos `eth_getProof` verifier bundles.
  - Future SPN-aware skill routing.
- Tired winner shapes to avoid:
  - AI wallet assistant.
  - Multichain dashboard.
  - RAG docs helper.
  - Generic marketplace directory.
  - Long multi-agent theater with no reusable skill.
- Fresh demo surfaces available now:
  - Paid Skill Workbench.
  - Agent-call transcript.
  - Proof receipt drawer.
  - Pharos explorer/proof verifier panel.
  - Skill manifest / registry card.

## Portable Patterns

1. Paid request creates a durable result artifact.
2. Verification is part of the loop, not a background claim.
3. Skills must have stable manifests, schema, pricing, and proof surfaces.
4. A second actor or later agent must be able to read/reuse the result.
5. Chain use should change trust, settlement, authorization, or proof.
6. Short demos win when the first 60 seconds finish a full consequence loop.

## Clone Traps

- AI assistant for wallets or DeFi.
- Portfolio or gas dashboard.
- Upload-and-summarize proof docs.
- Static skill marketplace.
- Protocol essay with no callable API.
- Fake proof display that does not independently verify anything.

## Inputs For GPT Pro Idea Tournament

- Winner patterns to feed:
  - x402-flash: paid call -> instant artifact.
  - All AI Hub: metadata -> authenticity -> payment -> gated access.
  - Hivera: task -> paid work -> verdict -> settlement -> audit trail.
  - Dossier: continuous agent output -> ordered attestation -> reusable intelligence.
- Sponsor/domain primitives to feed:
  - x402.
  - Pharos Atlantic Testnet tx/explorer.
  - Pharos `eth_getProof`.
  - Skill manifest / composability for Agent Arena.
  - SPN/restaking-aware future route.
- Project shapes to forbid:
  - Chat assistant.
  - Dashboard-only app.
  - RAG summary.
  - Wallet skin.
  - Full marketplace without working paid skill call.
- Evidence gaps:
  - DoraHacks page was WAF-protected; use official Pharos event page and GPT Pro source citations.
  - Live x402 SDK/facilitator availability must be verified during build.
