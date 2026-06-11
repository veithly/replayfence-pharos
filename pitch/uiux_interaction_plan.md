# UIUX Interaction Plan

## Source

- GPT Pro spec response: `pitch/gpt-pro/responses/spec/01-best-prd-uiux-response.md`
- Selected idea: ReplayFence
- PRD: `pitch/project_prd.md`

## Screen Map

| Route | Screen | Primary user action | System response | State changed | Proof shown |
|---|---|---|---|---|---|
| `/` | Landing / hero | Click `Try as Guest` | Creates guest session and routes to `/try` | guest session starts | no login wall, network badge |
| `/try` | Action Sandbox | Click `Fence + Execute Once` | Canonicalizes action, derives latch, sends Pharos consume | run status becomes `CONSUMED` | latch key, tx hash, explorer link |
| `/try` | Replay state | Click `Replay Same Action` | Reuses same action fingerprint and returns typed rejection | run status becomes `REPLAY_REJECTED` | original tx, replay reason, capsule CTA |
| `/runs/[runId]` | Run / Latch Timeline | Open run detail | Displays event timeline and state transitions | none unless refreshed from API | canonicalization, latch, chain, replay events |
| `/capsules` | Capsule History | Filter/open/export capsule | Loads guest-owned capsule list | history surface persists across refresh | capsule status, tx, proof status |
| `/capsules/[capsuleId]` | Capsule Detail / Proof Surgeon | Fetch proof or verify | Derives slot/path, attempts Pharos proof, reports status | proof status updates | action hash, latch key, storage slot, proof result |
| `/verify` | Capsule Verifier | Paste or select capsule and click verify | Recomputes action/latch and checks proof fields | verifier report is created | pass/fail checklist |
| `/docs/skill` | Skill Integration Guide | Copy install/snippet/API example | Copies wrapper and shows deployed metadata | docs interaction only | SDK API, ABI/address, curl example |

## First-Run Flow

- 0-10s: user sees hero copy, Pharos Atlantic badge, safety note, and a single `Try as Guest` button.
- 10-30s: `/try` shows the seeded safe action; user clicks `Fence + Execute Once`; timeline enters canonicalizing, latch derivation, and Pharos submission states.
- 30-60s: first result shows `CONSUMED`, then replay button produces `REPLAY_REJECTED` with the same latch key and original tx.
- 2-3min: capsule detail opens, verifier re-derives action hash/latch key/storage target, and user exports JSON or copies SDK snippet.

## Interaction Details

### `/try` Action Sandbox

- Default state: demo action card, risk note, Pharos network badge, inactive timeline, primary run button.
- Loading state: button disabled, timeline rows animate with text labels: canonicalizing action, deriving latch key, estimating gas, submitting to Pharos.
- Empty state: "No demo action loaded" with `Load safe demo action` CTA.
- Error state: typed error for RPC unavailable, relayer unavailable, gas estimate failed, contract revert, or proof unavailable; retry and open history actions remain visible.
- Success state: `CONSUMED` badge, tx hash, latch key, explorer link, replay button, capsule draft.
- Keyboard/touch behavior: Enter on focused primary button runs current action; all touch targets are at least 44px; replay also has explicit button for mobile.
- Accessibility note: status changes use `aria-live`; color is paired with status text and icons.

### `/runs/[runId]` Run / Latch Timeline

- Default state: chronological event rail with run ID, actor scope, action hash, latch key, contract status.
- Loading state: skeleton event rows with textual labels.
- Empty state: "No run selected. Start from Action Sandbox." CTA to `/try`.
- Error state: "Run not found or expired" plus capsule/history fallback.
- Success state: full timeline: canonicalized, latch derived, consumed, replay attempted, replay rejected, capsule created.
- Keyboard/touch behavior: event rows are expandable with Enter/Space and tap.
- Accessibility note: timeline is a semantic ordered list.

### `/capsules` Capsule History

- Default state: newest capsules sorted first with status filters.
- Loading state: skeleton cards/table rows.
- Empty state: "No capsules yet. Fence your first action." CTA to `/try`.
- Error state: "Could not load guest history" with retry and reset local mirror.
- Success state: cards show action label, status, tx hash, created time, proof status, open/export actions.
- Keyboard/touch behavior: filter chips and export buttons are reachable; mobile cards stack vertically.
- Accessibility note: status filters include visible selected state and `aria-pressed`.

### `/capsules/[capsuleId]` Capsule Detail / Proof Surgeon

- Default state: capsule summary, canonical JSON panel, latch details, tx panel, proof panel.
- Loading state: proof panel skeleton while `eth_getProof` is requested.
- Empty state: "Capsule not found" CTA to `/capsules`.
- Error state: exact failed stage: schema, hash mismatch, latch mismatch, slot derivation, proof fetch, proof verification.
- Success state: verifier report rows; `PROOF_VERIFIED`, `PROOF_FETCHED`, `PROOF_UNAVAILABLE`, or `FAILED` is honest and explicit.
- Keyboard/touch behavior: copy buttons announce copied field type; long hex wraps/truncates safely.
- Accessibility note: proof report is a semantic checklist.

### `/verify` Capsule Verifier

- Default state: paste textarea, upload input, and select-from-history menu.
- Loading state: verification checklist runs step by step.
- Empty state: "Paste a ReplayFence Capsule or select one from history."
- Error state: JSON parse, schema, chain mismatch, action hash mismatch, proof mismatch, RPC unavailable.
- Success state: pass/fail report with exportable verification JSON.
- Keyboard/touch behavior: textarea supports paste, upload input has visible label, verify button follows content order.
- Accessibility note: errors point to the exact invalid field.

### `/docs/skill` Skill Integration Guide

- Default state: install command, wrapper example, contract address, API examples, safety boundaries.
- Loading state: deployed address/health metadata skeleton.
- Empty state: not applicable; static docs always render.
- Error state: if live metadata is unavailable, docs still render static instructions with warning.
- Success state: copyable snippets and `Run in demo` link.
- Keyboard/touch behavior: tabs are arrow-key navigable; copy buttons have success feedback.
- Accessibility note: code blocks use descriptive labels.

## Demo Choreography

- Judge input: click `Try as Guest`, click `Fence + Execute Once`, click `Replay Same Action`, then inspect/export capsule.
- Live consequence: first action consumes a Pharos latch; duplicate is rejected with same latch key; capsule becomes available.
- Proof artifact: `replayfence-capsule.json` plus tx hash, explorer link, verifier report, and Skill docs.
- Fallback: if Pharos RPC/proof fails, show degraded state and seeded examples only as labeled history; do not show fake success.

## Implementation Notes

- Components: `ActionFencePanel`, `LatchTimeline`, `CapsulePreview`, `ProofCapsuleInspector`, `CapsuleVerifier`, `SkillInstallWizard`, `NetworkBadge`, `HexCopy`, `SafetyNotice`.
- Data/API dependencies: `POST /api/demo/session`, `POST /api/actions/fence`, `POST /api/actions/replay`, `GET /api/runs/[runId]`, `GET /api/capsules`, `GET /api/capsules/[capsuleId]`, `POST /api/proof/fetch`, `POST /api/verify`.
- Test selectors: `guest-start-button`, `demo-action-card`, `fence-run-button`, `replay-same-action-button`, `latch-status-badge`, `tx-hash-value`, `inspect-capsule-button`, `capsule-history-list`, `verify-capsule-button`, `verification-report`, `sdk-snippet`.
- Mobile QR behavior: QR opens live `/try`; first screen shows action card and sticky CTA; proof tree collapses into accordions.
