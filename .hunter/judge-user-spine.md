# Judge/User Spine: ReplayFence

> The experience must get clearer and more credible with time. Do not widen the story until this spine is true.

## Five seconds

### Judge

- What they see: "Fence one agent action in 60 seconds" with Pharos Atlantic badge, action card, and proof capsule preview above the fold.
- What they do: click `Try as Guest`.
- What proves value: the first screen already shows the exact duplicate-risk object and the capsule that will be exported.
- What can go wrong: the first screen could look like a generic crypto dashboard; the fix is the visible action/latch/proof triptych and no wallet wall.
- What state appears next: `/try` opens with a preloaded safe agent action.

### User

- What they see: a plain promise that duplicate retries will be blocked by a Pharos latch.
- What they do: start guest mode without login or tutorial.
- What proves value: a concrete demo-safe payout intent is ready to run, with risk and network labels.
- What can go wrong: guest session creation fails; recovery shows a retry and local reset without hiding the issue.
- What state appears next: Action Sandbox with `Fence + Execute Once`.

## Thirty seconds

### Judge

- What they see: timeline rows for canonicalization, latch derivation, and Pharos submission.
- What they do: click `Fence + Execute Once`.
- What proves value: a tx hash, latch key, and Pharos explorer link appear when the consume succeeds.
- What can go wrong: RPC or relayer latency; the UI shows in-progress and typed retry state.
- What state appears next: `CONSUMED` with replay button enabled.

### User

- What they see: the action fingerprint and exact fields that define sameness.
- What they do: wait for the live result or retry if the network fails.
- What proves value: the contract-backed latch replaces a private idempotency log.
- What can go wrong: gas estimate or contract submission fails; recovery keeps the action card and explains the failed stage.
- What state appears next: first action receipt and replay-ready state.

## Sixty seconds

### Judge

- What they see: `REPLAY_REJECTED` after the same action is replayed.
- What they do: open `Inspect Proof Capsule`.
- What proves value: original tx, same latch key, duplicate rejection reason, and saved capsule.
- What can go wrong: proof fetch is unavailable; the UI marks proof unavailable without faking verified status.
- What state appears next: capsule detail with proof/verifier panel.

### User

- What they see: a portable capsule that explains the accepted action and rejected replay.
- What they do: export JSON or run verifier.
- What proves value: result is saved and can be reopened after refresh.
- What can go wrong: capsule parse or schema error; verifier shows exact field failure.
- What state appears next: history/detail surface for return use.

## Five minutes

### Judge

- What they see: `/docs/skill`, exported capsule, verifier report, and route/test evidence.
- What they do: reload, open history, verify in second context, or vary one payload byte.
- What proves value: repeated exact action is rejected while a materially changed action derives a new latch key.
- What can go wrong: live chain degradation; limitations are stated and seeded capsules are labeled as examples only.
- What state appears next: continued loop through history, verifier, and Skill docs.

### User

- What they see: a reusable SDK/contract/verifier pattern they can add to an agent runtime.
- What they do: copy wrapper, API example, or capsule verifier snippet.
- What proves value: persistence, ownership, and exported proof survive the single demo flow.
- What can go wrong: abuse or gas exhaustion; rate limits and relayer health protect the public demo.
- What state appears next: ongoing workspace with saved capsule library and docs.
