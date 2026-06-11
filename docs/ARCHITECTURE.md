# ReplayFence Architecture

## Core Loop

ReplayFence has three proof layers:

1. OpenClaw skill install proof: `skills/replayfence/SKILL.md` installs as `replayfence` and emits a local deterministic capsule.
2. Pharos once-latch proof: `OnceLatchRegistry.consume` accepts the first latch and rejects the exact replay.
3. Browser verifier proof: `/verify` recomputes local capsule fields or checks the live Pharos report structure.

## Data Model

```text
Action
  actorScope
  toolId
  method
  params

Latch
  chainId
  registryAddress
  actionHash
  latchKey

Capsule
  capsuleId
  ownerId
  guestSessionId
  walletAddress
  attempts.first
  attempts.replay
  proof
```

B6 stores guest history in `localStorage` under `replayfence.capsule.history.v1`. The deployment target remains D1/SQLite with the same ownership fields.

## Chain Boundary

The deployed registry is `0xf3cb65898bc692495c64e2fa3981acbab2770a73` on Pharos Atlantic `chainId=688689`.

The live consume script signs a first consume transaction and then sends a second raw transaction with the same calldata. The second receipt is `reverted`, and `eth_call` decodes `ReplayFenceReplay`.

## Security Boundary

- `PRIVATE_KEY` and `DEPLOYER_PRIVATE_KEY` are local-only secrets.
- `.env.local`, `.dev.vars`, and `.env` are gitignored.
- The current UI displays recorded evidence and does not expose an unrestricted relayer.
- A public relayer must allowlist `OnceLatchRegistry.consume`, cap per-session calls, and refuse arbitrary target contracts.

