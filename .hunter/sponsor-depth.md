# Sponsor Depth: ReplayFence

> Sponsor tech must sit on the critical user path when it is relevant. A badge, tag, or hidden sample call is decorative and fails.

sponsor_track: "Pharos Phase 1 Skill-to-Agent hackathon: reusable agent Skill with Pharos integration"
required_tooling: "Pharos Atlantic Testnet RPC, chainId 688689, PharosScan explorer, Solidity OnceLatchRegistry, and Pharos eth_getProof proof surface"
why_core_not_decorative: "ReplayFence is only more credible than a normal idempotency key because the latch is public Pharos state and the capsule can point to chain/proof evidence"
user_visible_dependency: "The user runs a safe action, sees a Pharos tx consume the latch, replays the same action, and receives REPLAY_REJECTED tied to the original latch"
fallback_if_unavailable: "If RPC or eth_getProof is unavailable, show a degraded status and labeled seeded capsules; never mark proof verified or live execution successful without real evidence"
what_breaks_without_it: "Removing Pharos collapses the product into a private database retry flag, which loses public auditability, sponsor fit, and the proof capsule's central reason to exist"
screenshots_or_logs: "G4 runtime report, generated capsule tx link, tests/e2e/hero-replay.spec.ts, /capsules/[capsuleId] proof panel screenshot, and Pharos explorer URL after deploy"
submission_answer_draft: "ReplayFence uses Pharos as the exactly-once latch layer for agent actions: the first action consumes a OnceLatchRegistry record on Atlantic Testnet, the replay is rejected against that state, and the exported capsule carries tx/proof metadata for verification."

## Not Applicable Override

not_applicable_reason:
