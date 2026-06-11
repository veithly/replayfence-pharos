# Judge Magnet Brief

## Evidence Used

| Source | Used for | Portable lesson |
|---|---|---|
| `pitch/gpt-pro/responses/research/01-10x10-deep-research-response.md` | Hackathon/product pattern scan | One narrow skill, one paid call, one durable artifact, one proof trace. |
| https://www.pharos.xyz/agent-carnival | Contest framing | Phase 1 rewards reusable Skill modules that can cascade into later agents. |
| https://docs.pharos.xyz/developer-guide/x402.md | Sponsor primitive | x402 can turn a skill into a pay-per-use agent-commerce endpoint. |
| https://docs.pharos.xyz/api-and-sdk/eth-getproof.md | Sponsor proof primitive | Pharos proof verification is distinct enough to be a signature technical mechanism. |
| `references/01e-winning-mindset.md` | Judge behavior | Reduce judge work with direct links, first-minute consequence, and artifact proof. |

## First-Pass Survival

- Required submission fields: project title, short description, team/profile fields, repo URL, demo/live URL, video URL, docs, track/prize fit, and BUIDL details as DoraHacks requires.
- Must-open links: live app, GitHub repo, README, demo video, proof/receipt examples, deployed contract or explorer links when available.
- Fresh-work / version-control requirement: repository must show recent Phase 1 work, not imported old boilerplate.
- AI/spec/tool attribution requirement: record GPT Pro and local skill use in `.hunter/external-skill-usage.json`; public pitch should only name tools if the form asks.
- Partner/sponsor prize requirement: explain primitive used -> user action changed -> proof.
- Disqualification risks: missing public URL, generic assistant, no Pharos transaction/proof, no reusable skill schema, no docs, no runnable path for judges.

## Judge Personas

| Persona | What they care about first | What would make them stop watching | Evidence we show |
|---|---|---|---|
| Pharos ecosystem judge | Does this use Pharos as a mechanism? | Chain appears only as logo or README bullet. | x402 call, Atlantic tx/proof, explorer/verifier panel. |
| Agent platform judge | Can future agents actually call this Skill? | It is an app feature, not a module. | Skill manifest, API docs, typed schema, agent-call transcript. |
| Product judge | Can a fresh visitor understand and complete the loop? | Registration wall, wallet friction, or no consequence. | Guest demo path, 30s first action, receipt history. |
| Technical judge | Is the proof real and reproducible? | Fake data, unverified RPC relay, no tests. | verifier code, test output, proof bundle, storage/history state. |

## Winner Thesis

- Personal or customer scar: builders can write agent demos quickly, but judges cannot tell whether a Skill is reusable, payable, and proof-backed without opening code, explorer, and docs in separate tabs.
- Why this problem is worth attention: Phase 1 is about Skill quality; the winning artifact should make a Skill auditable and agent-callable, not merely impressive in a video.
- What the project proves in one screen action: a judge triggers one Skill call and sees payment/auth, execution/proof, and a reusable receipt.
- Why the sponsor primitive is necessary: x402 makes the call economically agent-native; Pharos proof/tx surfaces make the result publicly inspectable; Skill metadata makes it composable.
- Why this can continue after the hackathon: Phase 2 agents can use the same skill endpoint, manifest, receipt schema, and proof history.

## Prototype Cut

- 2-3 must-have features:
  - Callable Skill workbench with stable input/output schema.
  - x402-style paid or payment-simulated call returning receipt.
  - Pharos proof/tx/verifier artifact with saved history.
- One miracle: a single judge action turns into a proof-carrying paid Skill receipt in under 60 seconds.
- Cut features:
  - Full marketplace.
  - Full multi-agent orchestration.
  - Multi-token billing.
  - Native SPN deployment.
- Why the cut does not weaken the demo: Phase 1 rewards Skill quality and usability; a smaller complete Skill beats a broad incomplete agent suite.

## Attention Ladder

| Time | Judge should think | Screen / artefact evidence |
|---|---|---|
| 0-10s | This is a paid, proof-carrying Pharos Skill, not another chatbot. | Hero copy plus visible call/receipt console. |
| 10-30s | I know exactly where to click and what it will prove. | Pre-filled Skill call form and schema preview. |
| 30-60s | A real artifact changed state and can be inspected. | Receipt drawer with payment/proof/tx fields and history row. |
| 2-3min | This can be reused by a Phase 2 agent. | Manifest, API docs, agent-call transcript, test proof. |
| 5min / Q&A | The chain/proof mechanism is not decorative. | Verifier code, Pharos docs links, claim matrix, explorer/proof sample. |

## Aha Moment

- User action: trigger one Skill call from the workbench.
- Visible consequence: a payment/auth step completes, a Pharos proof/tx is fetched or written, and a receipt appears in history.
- Proof artefact: machine-readable Skill receipt with input digest, payment status, proof/verifier status, timestamp, and reusable API response.
- Why a judge can retell it: “It turns one agent skill call into a paid Pharos proof receipt.”

## Rubric Coverage

| Rubric / prize criterion | Where it appears | Proof |
|---|---|---|
| Originality | Concept, hero, demo | Proof-carrying paid Skill rather than chat/dashboard. |
| Technical completion | Workbench, API, tests | Running endpoint, receipt storage, verifier, Playwright. |
| AI Agent practical use case | Manifest and transcript | Agent-callable schema and reusable response. |
| Reusability/composability | Skill docs, manifest | JSON schema, sample curl, history/detail surfaces. |
| Pharos integration | Payment/proof/tx panel | x402/Atlantic/proof/explorer evidence. |
| UX | First-run and mobile | Guest path, clear states, no install wall. |
| Documentation | README/SUBMISSION/API docs | Direct links and reproducible commands. |

## Q&A Bank

| Likely judge question | 1-sentence answer | Proof link / screen |
|---|---|---|
| Why is this a Skill, not an app? | The endpoint has a stable manifest, typed schema, price, and receipt output that an agent can call without UI. | `/docs`, API sample, manifest panel. |
| What breaks if Pharos is removed? | The paid access and proof/tx receipt collapse into an unverifiable free API response. | x402/proof receipt drawer. |
| Is this real or mocked? | Runtime tests click the same endpoint, persist receipts, and verify proof/status fields. | `.hunter/runtime-interaction.report.json`, tests. |
| How does this help Phase 2? | Agents can discover the manifest, pay/call the skill, and reuse receipt IDs as evidence. | Agent transcript + manifest. |

## Anti-Hype Red Flags

- Ambiguity removed: “Skill” means callable endpoint + manifest + proof receipt.
- Template/starter-kit distance: no generic wallet dashboard, no chat-first UI, no landing-page-only experience.
- Missing-code or thin-repo risk: all claims must map to route, API, test, and proof files.
- Over-indexed criterion: do not optimize only Pharos integration while neglecting first-run UX and docs.
- Reused-project risk: new repo, evidence files, and app implementation created for this Phase 1 submission.

## Judge-Magnet Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| First-pass survival | 2 | Direct app/repo/video/docs/proof links are planned and the hero path has no registration wall. |
| Problem belief | 2 | Agent retries and duplicate side effects are specific, believable, and easy for judges to reproduce. |
| Prototype cut | 2 | One latch contract, one workbench, one API, one proof capsule. |
| Aha/proof | 2 | Judge double-clicks the action and sees duplicate rejection with a proof artifact. |
| Rubric coverage | 2 | Reusable Skill, Pharos integration, UX, docs, technical completion, and agent use case are mapped. |
| After-hack credibility | 1.5 | The Skill can wrap x402 paid calls, deployments, orders, or other Phase 2 agent tools. |

Judge-Magnet Score: 11.5/12.
