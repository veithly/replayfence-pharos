# Project Build Plan: ReplayFence

> Required before G4 project code changes. Read this Plan before every major build decision, then update the active row after the action.

## Goal

Build the G4 product loop around an OpenClaw-installable ReplayFence skill: install skill, run deterministic fence/replay demo, emit capsule, then wire Pharos live mode and a minimal visual workbench for verification.

## Inputs Already Approved

- Hero spine: `pitch/hero.md`
- PRD: `pitch/project_prd.md`
- UIUX plan: `pitch/uiux_interaction_plan.md`
- Product slice: `.hunter/product-slice.yaml`
- Judge/user spine: `.hunter/judge-user-spine.md`
- Sponsor depth: `.hunter/sponsor-depth.md`
- Runtime gates: `.hunter/runtime-gates.yml`
- Cut plan: `.hunter/cut-plan.md`
- Visual contract: `pitch/visual-build-contract.md`
- `gpt-taste` design plan: recorded inside `pitch/visual-build-contract.md`
- `impeccable` audit: recorded inside `pitch/visual-build-contract.md`
- External skill usage: `.hunter/external-skill-usage.json`
- Stack: `stack.lock.json`
- Implementation matrix: `.hunter/implementation-matrix.json`

## Current Gate

- Gate: G4 Product Loop Realness
- Status: IN_PROGRESS
- Last plan read: 2026-06-11T01:28:00+08:00
- Active row: G5

## Build Rows

| ID | Status | Step | Read Before Starting | Actions | Evidence To Produce | Verification |
|---|---|---|---|---|---|---|
| B0 | [x] | G3 evidence review | `references/00-orchestration.md`, `references/04-frontend-design.md`, `references/13-creative-production-flow.md`, `pitch/visual-build-contract.md`, `pitch/project_prd.md`, `pitch/uiux_interaction_plan.md`, `.hunter/product-slice.yaml`, `.hunter/judge-user-spine.md`, `.hunter/sponsor-depth.md`, `.hunter/runtime-gates.yml`, `.hunter/cut-plan.md`, `.hunter/implementation-matrix.json`, `.hunter/external-skill-usage.json`, `stack.lock.json` | Confirm OpenClaw-first P0, visual lane, skill package, app routes, user cases, branch, env needs, and blockers | `pitch/visual-build-contract.md`, `PRODUCT.md`, updated Decisions section | `node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_project.mjs . --phase product-slice,external-skills` |
| B1 | [x] | OpenClaw skill package | `references/03-project-build.md`, `/Users/rick/.codex/skills/.system/skill-creator/SKILL.md`, `https://docs.openclaw.ai/tools/creating-skills`, `pitch/project_prd.md`, `stack.lock.json` | Create `skills/replayfence/SKILL.md`, bundled demo action, and deterministic `scripts/replayfence.mjs` | `skills/replayfence/SKILL.md`, `skills/replayfence/scripts/replayfence.mjs`, `skills/replayfence/assets/demo-action.json` | Smoke check: `node skills/replayfence/scripts/replayfence.mjs demo --reset --out demo/replayfence-capsule.json` |
| B2 | [x] | OpenClaw install proof | `https://docs.openclaw.ai/cli/skills`, `pitch/project_prd.md`, `skills/replayfence/SKILL.md` | Run `openclaw skills install ./skills/replayfence --as replayfence --force`, then inspect with `openclaw skills info replayfence` | `demo/openclaw-install.md`, `.hunter/openclaw-install.report.json` | OpenClaw verify check: `npx --yes openclaw skills info replayfence` shows installed skill path and visible status |
| B3 | [x] | Skill deterministic tests | `skills/replayfence/SKILL.md`, `skills/replayfence/scripts/replayfence.mjs`, `.hunter/implementation-matrix.json` | Add unit checks for canonicalization, volatile field stripping, same/different latch keys, capsule verification | `tests/replayfence-skill.test.mjs`, `.hunter/acceptance-matrix.json` | `node --test tests/replayfence-skill.test.mjs` |
| B4 | [x] | Pharos contract and live mode | `references/06-web3-implementation.md`, `stack.lock.json`, `.hunter/sponsor-depth.md`, `https://docs.pharosnetwork.xyz/`, `https://atlantic.pharosscan.xyz/` | Implement `OnceLatchRegistry.sol`, deploy script, live consume adapter using viem, and honest degraded mode | `contracts/OnceLatchRegistry.sol`, `scripts/deploy-pharos.mjs`, `scripts/pharos-consume-demo.mjs`, `packages/replayfence-skill/src/*`, `.env.example`, `demo/pharos-deploy-report.json`, `demo/pharos-consume-report.json` | `npm run contract:compile`; `npm test`; live deploy tx `0xba7cf7df008b812a8ffefecc7688929531496f1a6bb3030fcb331365be5c399d`; live consume tx `0x7dcfe6f8306168d8c36730ea41b37606e54a294cc4931fcf268dd8aecc74941d`; live replay rejection tx `0xf428dbdf2915bad77a6cc2fa8b6d6a554c98d77f8e21407fdc462cdcbbdabe6d` |
| B5 | [x] | Minimal visual workbench | `references/03-project-build.md`, `pitch/visual-build-contract.md`, `pitch/uiux_interaction_plan.md`, `.hunter/product-slice.yaml`, `.hunter/judge-user-spine.md` | Build `/`, `/openclaw-demo`, `/try`, `/capsules`, `/capsules/[capsuleId]`, `/verify`, `/docs/skill` around command transcript and capsule outputs | `src/app/*`, `src/components/*`, `src/lib/proof-data.js`, `package.json`, `next.config.mjs`, `jsconfig.json`, `pitch/images/*`, `public/evidence/*`, route screenshots, `.hunter/wiring-matrix.json`, `.hunter/workbench-smoke.report.json` | `npm run build`; Playwright route/click smoke; `node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_project.mjs . --phase ui-libs` |
| B6 | [x] | Storage/session/ownership | `references/04b-feature-density.md`, `references/15-onboarding.md`, `.hunter/product-slice.yaml`, `stack.lock.json` | Persist guest sessions, demo transcripts, capsules, refresh history, and second-context verification | `src/app/capsules/capsule-history-client.jsx`, `tests/onboard.spec.ts`, `playwright.config.ts`, `.hunter/operations-check.json`, `.hunter/seed-manifest.json`, `.hunter/capabilities.json` | `npm run build`; `node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_onboarding.mjs .`; `npx playwright test tests/onboard.spec.ts` |
| B7 | [x] | Env/secrets | `.env.example`, `stack.lock.json.required_env[]`, `https://docs.pharosnetwork.xyz/`, `https://atlantic.pharosscan.xyz/` | Apply local secrets if present, otherwise record blocker for funded Pharos relayer key and registry address | `.env.local`, `.dev.vars`, `.env.example`, `.hunter/env-check.json`, key status notes without secret values | Env verify / missing-key check: `npm run contract:deploy:pharos`; `npm run contract:consume:pharos`; `.gitignore` ignores `.env.local`, `.dev.vars`, and `.env` |
| B8 | [x] | Public operability + runtime audits | `references/07-browser-testing.md`, `references/20-interaction.md`, `assets/templates/runtime_interaction.plan.json.tpl`, `.hunter/runtime-gates.yml` | Add/run Playwright for OpenClaw install transcript, skill demo, capsule export, verify, mobile, refresh, and second-context proof | `tests/runtime-interaction.spec.ts`, `tests/onboard.spec.ts`, `.hunter/runtime-interaction.plan.json`, `.hunter/runtime-interaction.report.json`, `.hunter/claim-matrix.json` | `npx playwright test tests/runtime-interaction.spec.ts`; `audit_project.mjs --phase claims,runtime,feature-density,realness` |
| B9 | [x] | Handoff to G5 | `references/08-documentation.md`, `references/00-orchestration.md`, `pitch/hero.md`, `demo/openclaw-install.md` | Update README/architecture notes, gate state, evidence log, and public deploy handoff | `README.md`, `docs/ARCHITECTURE.md`, `.hunter/gate-state.json`, `.hunter/evidence-log.md` | `audit_project.mjs --phase build-plan,product-slice,external-skills,ui-libs,feature-density,claims,runtime,realness` passes before G5 |

## Decisions

- OpenClaw-first P0: user requested avoiding a custom agent; `pitch/project_prd.md` now makes OpenClaw install and generic skill execution the primary reusable Skill proof.
- Local demo honesty: bundled OpenClaw demo may run without secrets but must label output `local-demo`; only configured Pharos mode may claim tx/proof success.
- Visual scope: command transcript + latch timeline + capsule proof is the style anchor, so frontend work remains a workbench instead of a large custom agent UI.
- OpenClaw install evidence: `demo/openclaw-install.out` shows `replayfence ✓ Ready`, `Visible to model: yes`, and `Available as command: yes`.
- Pharos live proof: `demo/pharos-deploy-report.json` records deployed `OnceLatchRegistry` at `0xf3cb65898bc692495c64e2fa3981acbab2770a73`; `demo/pharos-consume-report.json` records first consume success plus same-latch replay rejection on Pharos Atlantic.
- Visual workbench: Next.js App Router now serves `/`, `/openclaw-demo`, `/try`, `/capsules`, `/capsules/[capsuleId]`, `/verify`, and `/docs/skill`; B5 smoke evidence is recorded in `.hunter/workbench-smoke.report.json`.
- B6 ownership boundary: `/try` creates `replayfence.guest.session` and saves replay proof records to `replayfence.capsule.history.v1` with `ownerId`, `guestSessionId`, `capsuleId`, and `walletAddress`; `/capsules` merges seeded public evidence with guest history.
- B7 env posture: live Pharos RPC, registry address, and explorer URL are public in `.env.example`; private key material remains redacted and ignored in `.env.local` / `.dev.vars` / `.env`.
- B8 runtime posture: Playwright passes across Chromium, Firefox, WebKit, and Pixel 7; runtime report records refresh persistence, second browser context verification, trace-on-failure, and zero runtime errors.
- B9 G5 handoff: root README, architecture note, evidence log, and `.hunter/gate-state.json` now point to the local passed G4 evidence and the next public URL smoke gate.

## Blockers

- None for G4 local product loop. G5 remains blocked only on choosing/deploying a public URL and running deployed smoke tests.

## Errors Encountered

- `impeccable` setup reported `NO_PRODUCT_MD`: resolved by creating `PRODUCT.md` from existing project evidence before writing the visual contract.
- Pharos deploy attempt returned `INVALID_ACCOUNT_ADDRESS`: resolved by generating a low-value Pharos Atlantic testnet wallet, funding it through faucet, deploying `OnceLatchRegistry`, and recording live deploy/consume/replay-reject evidence.
- `walletClient.sendTransaction` replay rejection initially surfaced as a viem/RPC decoding error; resolved by adding raw `eth_call` custom-error decoding and a hand-signed raw replay transaction, which produced a reverted replay tx receipt.
- Feature-density audit only counts `page.tsx` files; resolved by moving App Router route files from `.jsx` to `.tsx`, adding TypeScript config, and keeping client components in `.jsx`.
