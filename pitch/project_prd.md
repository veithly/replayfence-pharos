# ReplayFence PRD

> English-first source-of-truth PRD. This document precedes implementation and is the source for UI, stack decision, demo, documentation, and submission copy.

## 1. Project background

- Hackathon: Pharos Skill-to-Agent Dual Cascade Hackathon, Phase 1.
- Track / bounty: Phase 1 Skill module for agent workflows on Pharos.
- Submission deadline: Phase 1 Skill submission window ends around June 15, 2026 per DoraHacks public listing; final project docs will quote the form's exact visible deadline during G7.
- Why this idea now: autonomous agents and tool runners increasingly retry side-effecting actions after timeouts, double-clicks, queue redelivery, or model loops. A private idempotency key is useful but hard for another agent, judge, or auditor to verify.
- Cross-track bonus eligibility: AI agent practical use case plus Pharos-native chain/proof integration.
- GPT Pro spec source: `pitch/gpt-pro/responses/spec/01-best-prd-uiux-response.md`
- UIUX interaction plan: `pitch/uiux_interaction_plan.md`

## 2. Problem definition

- Core problem: AI agents need an exactly-once guard for high-stakes actions, with public proof that a replay was rejected.
- Quantified pain: one duplicate payment, deploy, order, governance action, or keeper call can create loss; builders currently solve this in private logs that judges and downstream agents cannot inspect.
- Current alternative 1: backend idempotency headers stored in a private database.
- Current alternative 2: manual queue monitoring plus retry limits.
- Why current alternatives are not enough: they do not create a reusable Skill primitive, do not expose public chain state, and do not let a verifier re-derive the latch target.
- Personal/customer scar: agent retries after a network blink can make the operator unable to tell whether the first action executed, the second action duplicated it, or both failed.
- What a judge should believe after the first screen action: the first attempt consumed a Pharos latch and the replay was blocked because the same deterministic action had already been consumed.

## 3. Target users

### Primary user

- Persona: Maya, 29, agent framework developer, globally remote, comfortable with TypeScript and testnets.
- Situation: Maya wraps tools that can move funds, submit deploys, open tickets, or call contracts; retries are part of the runtime.
- Goal: add one reusable exactly-once guard without building a custom protocol.
- Constraints: she will not accept a black-box dashboard, a wallet wall for every test, or a proof artifact that only the app can understand.

### Secondary user

- Persona: hackathon judge or protocol reviewer inspecting a saved capsule.
- Situation: they need to see proof in under three minutes and verify the result without trusting a demo narrator.
- Goal: confirm that the replay rejection comes from Pharos-backed state and deterministic action identity.
- Constraints: no private credentials, no local-only state, no fake explorer links.

### Anti-user (who this is NOT for)

- Teams looking for production wallet drain protection, phishing detection, transaction simulation, custody security, arbitrary policy enforcement, or multi-chain analytics.

## 4. User pain points (ranked)

1. **P1: duplicate side effects after retries.** Tool loops, timeouts, double-clicks, and queue redelivery can fire the same action twice.
2. **P2: private logs are hard to trust.** A backend can say "already processed", but another agent or reviewer cannot verify the latch.
3. **P3: reusable agent safety is still too bespoke.** Each project rebuilds canonicalization, retry handling, and proof export differently.
4. Pain we explicitly ignore: general wallet security and malicious contract analysis; those are larger systems and would dilute the Skill.

## 5. Core requirements & priority

### P0 demo must-haves (exactly 2-3; ship these or it is not a project)

1. Guest can run one safe agent action, consume `PharosOnceLatch`, then replay the same action and see `REPLAY_REJECTED`.
2. App saves and exports a ReplayFence Capsule with action hash, latch key, tx hash, replay result, chain metadata, and verifier status.
3. OpenClaw can install `skills/replayfence` as a normal local skill, then run a generic ReplayFence command path that produces a capsule without a custom agent.

### Good-to-have (P1; ship if time)

1. Custom action fingerprint builder that previews latch key before execution.
2. Wallet-connected developer mode on Pharos Atlantic.
3. Rich proof anatomy view for Pharos `eth_getProof`.
4. LangChain-style adapter and cURL examples.

### Delight / wow layer (P2; only if everything else lands)

1. Optional x402 wrapper for paid Skill/API access on Pharos.
2. Batch fencing and shared agent scopes.

### Explicitly out of scope (cut list candidates)

1. Production wallet security claims.
2. Mainnet or real asset movement.
3. Multi-chain support.
4. Team accounts and long-term cloud archives.
5. Generic chatbot interface.

## 6. Solution overview

- One-sentence solution: ReplayFence wraps an agent action in a deterministic Pharos once-latch, rejects exact replays, and exports a portable proof capsule.
- Why this beats the current alternative: the replay guard becomes a public, reusable, verifier-friendly chain artifact instead of a hidden backend flag.
- Why this hits the bounty rubric: it is a composable Skill module, has a concrete agent use case, uses Pharos Atlantic as the mechanism, and can be tested by a fresh judge without a wallet.
- Recent idea pattern:
  - recentIdeaFamily: durable execution, one-shot action latch, proof-carrying verifier, agent tool safety.
  - freshnessDelta: idempotency moves from a private API header into public Pharos state plus proof capsule.
  - mutationOperator: retry logic -> public one-shot action latch with independent verification.
  - 2026 clone trap avoided: wallet dashboard, NFT mint, generic tx sender, AI chatbot.
  - non-chat host surface: Skill workbench and API/SDK wrapper.
  - visible 60-second consequence: exact duplicate returns `REPLAY_REJECTED`.
  - durable proof artifact: `replayfence-capsule.json`.
- Recent Web3 winner pattern:
  - Winner family: trust-proof and ai-web3-action.
  - Chain primitive: on-chain latch state plus explorer-resolvable transaction event.
  - User action improved: agent/tool action is executed at most once for a deterministic fingerprint.
  - Public proof surface: Pharos Atlantic tx hash, `LatchConsumed` event, latch key, proof capsule, verifier report.
  - Second actor / repeated loop: agent developer creates a capsule; reviewer or second browser context verifies/reopens it.
  - Boring dApp clone avoided: no wallet dashboard, no token list, no explorer skin, no fake receipt.
- README opening copy:
  > ReplayFence blocks duplicate agent actions on Pharos in 60 seconds.  
  > Run one safe action, replay it, and watch the duplicate get rejected.  
  > Export a proof capsule that another agent or judge can verify.

## 7. User flows

### Flow A: Primary user, hero path

1. Trigger: judge opens `/` and clicks `Try as Guest`.
2. Onboarding: app creates a guest session and routes to `/try`.
3. Action: judge clicks `Fence + Execute Once` for the seeded safe action.
4. Result: app derives canonical action hash and latch key, submits `consume`, and shows `CONSUMED` with tx link.
5. Follow-up: judge clicks `Replay Same Action`, sees `REPLAY_REJECTED`, then opens the capsule.

### Flow B: Secondary user, OpenClaw reusable Skill path

1. Developer runs `openclaw skills install ./skills/replayfence --as replayfence --force`.
2. Developer checks `openclaw skills info replayfence` and sees the skill is visible to the model.
3. Developer asks a generic OpenClaw agent to use ReplayFence, or runs the bundled demo command directly.
4. Developer gets a ReplayFence Capsule with deterministic latch key and typed `CONSUMED` / `REPLAY_REJECTED` results.

### Flow C: Edge case / failure path

1. Reviewer opens `/verify` and pastes a capsule.
2. Verifier re-canonicalizes action, re-derives latch key, derives storage target, and attempts proof fetch.
3. If Pharos proof is unavailable, UI marks `PROOF_UNAVAILABLE` and still preserves tx/replay evidence without claiming verification.

## 8. User Cases (>= 2)

### User case 1: Judge tests exactly-once action (HERO PATH)

- User: hackathon judge.
- Situation: they have two minutes and want proof this is not a static shell.
- Pain: duplicate agent actions are easy to hand-wave in slides.
- Trigger: click `Try as Guest`, then run the seeded action.
- Desired outcome: see first action succeed, replay fail, and capsule export.
- Product response: run contract consume on Pharos Atlantic, reject same latch, save capsule.
- Demo-visible moment: "First action executed. Replay rejected. Capsule ready."

### User case 2: Agent developer wraps a tool call

- User: TypeScript agent developer.
- Situation: they need a guard before a payout, deploy, order, or privileged API tool.
- Pain: private retry logic is not composable or inspectable.
- Trigger: copy wrapper from `/docs/skill`.
- Desired outcome: call `once(action)` and receive typed replay results.
- Product response: deterministic canonicalization, latch derivation, consume/replay handling, capsule generation.
- Demo-visible moment: docs show a copyable wrapper and generated response schema.

### User case 3: Security reviewer verifies capsule

- User: protocol security reviewer.
- Situation: they receive a ReplayFence Capsule after an agent run.
- Pain: proof metadata inside a JSON file could be misleading.
- Trigger: paste capsule into `/verify`.
- Desired outcome: verifier recomputes action hash/latch key and reports proof status.
- Product response: independent derivation, proof fetch, structured pass/fail report.
- Demo-visible moment: report shows hash match, latch match, derived storage slot, and proof status.

## 9. Demo critical path & Hero Moment

### Primary demo path (<= 90 s of screen time)

1. Open `/`, read hero, click `Try as Guest`.
2. Run `openclaw skills install ./skills/replayfence --as replayfence --force` and show `openclaw skills info replayfence`.
3. Run the bundled ReplayFence demo command to fence the seeded "mock payout intent: invoice-042".
4. Watch the first attempt become `CONSUMED`, then the replay become `REPLAY_REJECTED` with the same latch key.
5. Open the capsule detail/workbench, run verifier, and export JSON.

### Hero Moment (5 s)

```txt
0:00: Judge sees one risky agent action.
0:01: Judge clicks run once.
0:03: The latch is consumed on Pharos.
0:05: The duplicate path is ready to test.
```

### Demo interaction/showcase plan

- Source: `pitch/demo_interaction_plan.md`
- 0-10s hook: "Please double-click this dangerous agent action."
- 10-30s interaction: first click canonicalizes action, derives latch key, submits consume.
- 30-60s visible consequence: same action produces same latch and returns `REPLAY_REJECTED`.
- Judge participation: judge clicks first action and replay button; optionally mutates payload to prove new fingerprint.
- Visual staging: left side action card, center latch timeline, right side proof capsule.
- Live-demo fallback: if Pharos RPC/proof endpoint fails, show typed degraded status and seeded capsules only as labeled examples; do not fake a live success.

### Judge magnet

- Source: `pitch/judge_magnet.md`
- First-pass survival risks avoided: no registration wall, no generic chat, no static dashboard, direct proof surface.
- Attention ladder:
  - 0-10s: hero states one action, 60 seconds, replay rejection, proof capsule.
  - 10-30s: judge sees canonicalization and Pharos latch submission.
  - 30-60s: duplicate is rejected and capsule appears.
  - 2-3min: capsule detail proves tx, latch key, and verifier logic.
  - 5min / Q&A: `/docs/skill`, tests, contract, and SDK show reusable Phase 1 module.
- Weakest rubric line: proof depth if live `eth_getProof` is flaky; mitigation is honest proof statuses plus independently derived latch/slot verification.
- Q&A proof: `skills/replayfence/SKILL.md`, OpenClaw install transcript, `packages/replayfence-skill`, `contracts/OnceLatchRegistry.sol`, Playwright hero test, capsule JSON, Pharos explorer link.
- Retellable aha moment: "I double-clicked the agent payout; Pharos let the first through and blocked the replay."

### Secondary visible beat (for the combined-pitch-demo video)

- Open `/docs/skill`, show the OpenClaw install command, and show the same `latchKey` for repeated canonical actions.

### What the reviewer should remember 10 minutes later

- One plain sentence: ReplayFence turns duplicate agent retries into proof-backed Pharos rejections.

## 10. Pages / modules plan (>= 4 interactive product surfaces)

| Route | Surface name | Responsibility | Data owner / proof role | Components used |
|---|---|---|---|---|
| `/` | Landing | Explain user, action, and result in 5 seconds | Public visitor; CTA to Hero Path | HeroPanel, ChainBadge, ProofCapsuleTeaser |
| `/try` | Action Sandbox | Run first action and replay attempt | Guest session owns run and capsule | ActionFencePanel, LatchTimeline, CapsulePreview |
| `/runs/[runId]` | Run / Latch Timeline | Show canonicalization, latch derivation, tx, replay | Guest session run record | RunTimeline, HashRail, EventLog |
| `/capsules` | Capsule History | Browse, filter, reopen, export capsules | Guest session history | CapsuleHistoryTable, StatusFilter, ExportButton |
| `/capsules/[capsuleId]` | Capsule Detail / Proof Surgeon | Inspect action, latch, tx, proof, verifier | Capsule record plus Pharos proof | ProofCapsuleInspector, ProofChecklist, HexCopy |
| `/verify` | Capsule Verifier | Paste/upload/select capsule and verify | Reviewer session, pasted JSON | CapsuleVerifier, VerificationReport |
| `/docs/skill` | Skill Integration Guide | Make module reusable | Public docs with deployed metadata | SkillInstallWizard, SnippetTabs, ApiExamplePanel |
| `/openclaw-demo` | OpenClaw Install Transcript | Prove the skill installs in a generic OpenClaw runtime | Saved install/demo transcript | CommandTranscript, CapsulePreview, SkillStatusPanel |
| `/health` | System Health | RPC/relayer/proof diagnostics | Runtime health checks | HealthProbeList |

## 11. Visual direction & UI principles

- Mood: precise, testbench-like, tense at the replay moment, calm around proofs.
- Visual style lane: operational-dashboard / cyberpunk-terminal hybrid.
- Why this lane fits the PRD/UIUX: the product is a safety control panel for agent actions; judges need dense proof objects, not a marketing hero.
- Primary UI library: shadcn/ui with Radix primitives.
- Supporting UI library: xterm-monaco for terminal/code proof panels; lucide-react for iconography.
- Official docs checked: shadcn/ui docs, Radix UI docs, lucide-react docs, Monaco Editor npm docs, xterm npm docs, viem docs, Hardhat docs.
- Install commands: `npx create-next-app@latest`, `npm install viem zod lucide-react @radix-ui/react-tabs @radix-ui/react-dialog monaco-editor @xterm/xterm`, `npm install -D hardhat @nomicfoundation/hardhat-toolbox playwright`.
- Tailwind/shadcn rejection note: base Tailwind/shadcn alone would look like another crypto SaaS shell; ReplayFence needs a custom latch timeline, proof capsule anatomy, terminal hash rail, and visual state machine.
- Non-Tailwind visual signature: latch-state cockpit with vertical proof rail, monospace capsule panels, `data-visual-lane="operational-dashboard"`, hex-grid microtexture, and replay rejection shock band.
- Hero composition: full-width control room with action card, latch timeline, and proof capsule preview visible in the first viewport.
- Visual differentiation note: avoid purple-blue gradient cards and generic glassmorphism; use charcoal, acid green, amber, red rejection, and Pharos cyan accents with dense proof UI.
- Forbidden lookalikes: generic Web3 wallet dashboard, token terminal clone, shadcn admin template, "AI copilot chat" app, purple crypto landing page.
- QR mobile access plan: QR opens live `/try` with guest mode; phone user sees action card first and can complete replay using explicit buttons.
- Mobile primary flow: two taps to hero action: Try as Guest -> Fence + Execute Once; sticky bottom CTA changes to Replay and Inspect Capsule.
- Desktop parity plan: 1920x1200 desktop keeps three-column workbench, keyboard copy controls, hover tooltips, and proof rail.
- Palette:
  - Accent: `#38f8b8` (consumed/proof accent)
  - Background: `#101411` (charcoal testbench)
  - Off-white text: `#f4f0e6`
  - Warning: `#f5b84b`
  - Rejection: `#ff5a66`
- Typography:
  - Display: `Space Grotesk` or system fallback.
  - Body: `Inter` or system fallback.
  - Code/proof: `JetBrains Mono` or `SFMono-Regular`.
- Component-system lock:
  - Primary UI library: shadcn/ui with Radix primitives.
  - Supporting UI library: xterm-monaco proof/code panels.
  - Official docs checked: shadcn/ui, Radix, Monaco, xterm, lucide, viem, Hardhat.
  - Install commands: listed above.
  - Tailwind/shadcn rejection note: custom state machine and proof rail are mandatory.
- gpt-taste design_plan source path: `pitch/visual-build-contract.md` will record the full installed `gpt-taste` `<design_plan>` before G4 implementation.
- impeccable audit notes: `pitch/visual-build-contract.md` will record register, color, type, layout, a11y, and anti-slop notes before G4 implementation.
- Logo source: logo-generator skill output; minimum brand pack is wordmark SVG, logomark SVG, mono SVG, favicon, and OG image.
- Avatar source: none for P0; guest identity is a generated session chip, not a person avatar.
- Generated image/cutout assets: no generated character art in app P0; five abstract proof/capsule plates can be generated or programmatically rendered for deck/app texture, with cutout manifest retained if used.

## 12. Technical constraints

- Branch: Web3.
- Framework: Next.js App Router + TypeScript.
- Skill host: OpenClaw 2026.6.5 or newer for generic skill installation demonstration.
- Product backbone:
  - identity/session model: guest cookie plus browser localStorage mirror.
  - database/storage schema: SQLite or D1-compatible tables for sessions, runs, events, capsules; optional JSON fallback only for local tests.
  - ownership fields: `guestSessionId`, `ownerId`, `runId`, `capsuleId`, `walletAddress` when wallet mode exists.
  - multi-user proof: second browser context can verify or reopen exported capsule without sharing private local state.
- Contract: `OnceLatchRegistry.sol` with `consume`, `isConsumed`, `LatchConsumed`, and `ReplayFenceReplay`.
- OpenClaw constraints:
  - `skills/replayfence/SKILL.md` is the first-class P0 deliverable.
  - Bundled scripts must be dependency-light and runnable from the installed skill directory.
  - The install demo must use `openclaw skills install` and `openclaw skills info`, not a custom agent runtime.
  - Local demo mode must label itself `local-demo` and must not claim Pharos tx/proof success.
- Chain config:
  - Pharos Atlantic chainId: `688689`.
  - RPC: `https://atlantic.dplabs-internal.com`.
  - Explorer: `https://atlantic.pharosscan.xyz`.
- Required env vars:
  - `PHAROS_RPC_URL`: official Pharos Atlantic RPC endpoint.
  - `PRIVATE_KEY`: low-value testnet relayer/deployer key, server-side only.
  - `ONCE_LATCH_REGISTRY_ADDRESS`: deployed registry address after contract deploy.
  - `NEXT_PUBLIC_PHAROS_EXPLORER_URL`: public explorer base URL.
- Real data sources:
  - Pharos Atlantic transaction receipt and explorer link.
  - Contract event/state for latch consumed.
  - Guest session/capsule records.
  - Optional Pharos `eth_getProof` response.
- Sponsor/organizer technology: Pharos Atlantic Testnet, PharosScan, Pharos `eth_getProof` proof surface.
- Public operability plan: guest path works without wallet/login; relayer is restricted to `OnceLatchRegistry.consume` and demo-safe action fingerprints.
- Deployment target: Cloudflare Workers via OpenNext unless G5 finds a runtime blocker; public URL remains out of claims until smoke tested.
- Security constraints: no client secrets, no production wallet claims, no real asset movement, no hidden fake success.

## 13. Success metrics

### Product success metrics

- Landing to first action attempt: <= 30 seconds.
- Landing to replay rejection: <= 60 seconds.
- Wallet/login required for hero path: 0.
- Interactive product surfaces: at least 4 beyond landing.
- Wired beats across use cases: at least 5.
- Capsule export success after first run: 100% in tests.
- Guest history refresh persistence: 100% in same browser session.

### Judge success metrics

- Judge can explain outcome in one sentence.
- Pharos chainId, tx hash, explorer link, and proof source are visible.
- The demo shows a public proof artifact, not an LLM paragraph.
- `/docs/skill` makes the reusable Skill obvious.
- Playwright hero path passes before video recording.

### PRD coverage matrix

| Requirement | Priority | User case | Route/component | API/server action | Real data source | Contract/state | Test | Deploy evidence | Status |
|---|---|---|---|---|---|---|---|---|---|
| `REQ-001` | P0 | HERO PATH | `/` + `GuestStartButton` | `POST /api/demo/session` | guest cookie + session record | `guestSession.active` | `tests/e2e/hero-replay.spec.ts` | G5 live URL screenshot | planned |
| `REQ-002` | P0 | HERO PATH | `/try` + `ActionFencePanel` | `POST /api/actions/fence` | Pharos tx receipt | `OnceLatchRegistry.consume` | `tests/e2e/hero-replay.spec.ts` | Pharos explorer tx link | planned |
| `REQ-003` | P0 | HERO PATH | `/try` + `ReplayButton` | `POST /api/actions/replay` | contract revert/precheck | `REPLAY_REJECTED` run event | `tests/e2e/hero-replay.spec.ts` | runtime report screenshot | planned |
| `REQ-004` | P0 | HERO PATH | `/capsules/[capsuleId]` | `GET /api/capsules/[capsuleId]` | capsule storage row | `capsule.status=READY` | `tests/e2e/hero-replay.spec.ts` | exported JSON artifact | planned |
| `REQ-005` | P0 | Reviewer | `/verify` | `POST /api/verify` | pasted or stored capsule | derived action hash/latch key | `tests/unit/latch.spec.ts` + E2E verify | verifier report | planned |
| `REQ-006` | P0 | Developer | `/docs/skill` | static docs + package exports | SDK source | TypeScript types | `tests/unit/canonicalize.spec.ts` | README and docs route | planned |
| `REQ-007` | P0 | Reviewer | `/capsules/[capsuleId]` | `POST /api/proof/fetch` | Pharos `eth_getProof` or honest unavailable status | derived storage slot | `tests/unit/proof-slot.spec.ts` | proof panel screenshot | planned |
| `REQ-008` | P0 | Product depth | `/runs/[runId]` + `/capsules` | `GET /api/runs/[runId]`, `GET /api/capsules` | persisted run/capsule history | owner-scoped records | `tests/e2e/history.spec.ts` | runtime refresh report | planned |

## 14. Risks & Cut List

### Prototype cut

- Keep: one latch contract, one TypeScript Skill package, one guest workbench, one capsule verifier, one docs route.
- Cut features: x402, wallet mode, arbitrary proof explorer, team accounts, analytics, batch latches, real payments.

### Primary risks

- Pharos proof endpoint behavior is hard to verify quickly; mitigation: keep proof verifier narrow, mark `PROOF_UNAVAILABLE` honestly when necessary, never fake `VERIFIED`.
- Relayer has no gas; mitigation: health check, low-value funded key, clear degraded state, seeded capsules only as examples.
- Replay key includes unstable fields; mitigation: canonicalization tests exclude timestamps, run IDs, and request IDs.
- UI overbuild delays proof; mitigation: build `/try`, `/capsules/[id]`, `/verify`, `/docs/skill` first.
- Sponsor fit looks generic; mitigation: show Pharos Atlantic, chainId 688689, explorer link, `eth_getProof`, and proof capsule throughout.

### Cut list

- Can cut first: `/health`, custom builder, rich proof tree animation, x402 wrapper, logo variant polish.
- Cut last: `/docs/skill`, capsule export, history refresh persistence, proof/verifier detail, Playwright runtime proof.
- Never cut: guest hero path, live or clearly degraded Pharos chain interaction, duplicate rejection, saved capsule, safety boundary.
