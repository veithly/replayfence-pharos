import { createHash } from "node:crypto";

export const VOLATILE_ACTION_KEYS = new Set([
  "runId",
  "requestId",
  "timestamp",
  "clickedAt",
  "nonce"
]);

export function stripVolatile(value) {
  if (Array.isArray(value)) return value.map(stripVolatile);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const key of Object.keys(value).sort()) {
    if (VOLATILE_ACTION_KEYS.has(key)) continue;
    out[key] = stripVolatile(value[key]);
  }
  return out;
}

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

export function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function canonicalizeAction(action) {
  const canonicalJson = stripVolatile(action);
  const canonicalString = stableStringify(canonicalJson);
  const canonicalHashSha256 = `0x${sha256Hex(canonicalString)}`;
  return { canonicalJson, canonicalString, canonicalHashSha256 };
}

export function deriveLatchKey({
  action,
  chainId = 688689,
  registryAddress = "0x000000000000000000000000000000000000f3ce"
}) {
  const canonical = canonicalizeAction(action);
  const actorScope = canonical.canonicalJson.actorScope || "default-actor";
  const toolId = canonical.canonicalJson.toolId || "unknown-tool";
  const latchMaterial = [
    "ReplayFence:v1",
    String(chainId),
    registryAddress.toLowerCase(),
    actorScope,
    toolId,
    canonical.canonicalHashSha256
  ].join("|");
  return {
    ...canonical,
    actorScope,
    toolId,
    chainId,
    registryAddress,
    actionHash: canonical.canonicalHashSha256,
    latchKey: `0x${sha256Hex(latchMaterial)}`
  };
}

export function createCapsule({ action, latch, attempts, proof }) {
  const derived = deriveLatchKey({
    action,
    chainId: latch.chainId,
    registryAddress: latch.registryAddress
  });
  return {
    schema: "replayfence.capsule.v1",
    capsuleId: `capsule_${sha256Hex(`${derived.latchKey}:${attempts?.first?.attemptId || "attempt"}`).slice(0, 16)}`,
    createdAt: new Date().toISOString(),
    environment: latch.environment || "local-demo",
    action: {
      label: action.label || "Unnamed action",
      toolId: derived.toolId,
      actorScope: derived.actorScope,
      canonicalJson: derived.canonicalJson,
      canonicalHashSha256: derived.canonicalHashSha256,
      actionHash: derived.actionHash
    },
    latch: {
      chainId: derived.chainId,
      registryAddress: derived.registryAddress,
      latchKey: derived.latchKey,
      status: latch.status
    },
    attempts,
    proof: proof || {
      source: "local-demo",
      verifierStatus: "NOT_REQUESTED",
      verifierNotes: ["No proof requested."]
    },
    safety: {
      environment: latch.environment || "local-demo",
      actionMode: "demo-safe",
      disclaimer:
        latch.environment === "pharos-atlantic"
          ? "Testnet-safe action fingerprint. ReplayFence is not production wallet security."
          : "Local demo proves deterministic replay fencing only. Live Pharos mode is required for tx/proof claims."
    }
  };
}

export function verifyReplayFenceCapsule(capsule) {
  const derived = deriveLatchKey({
    action: capsule.action?.canonicalJson || {},
    chainId: capsule.latch?.chainId,
    registryAddress: capsule.latch?.registryAddress
  });
  return {
    ok:
      derived.canonicalHashSha256 === capsule.action?.canonicalHashSha256 &&
      derived.latchKey === capsule.latch?.latchKey,
    checks: {
      canonicalHashMatch:
        derived.canonicalHashSha256 === capsule.action?.canonicalHashSha256,
      latchKeyMatch: derived.latchKey === capsule.latch?.latchKey,
      replayRejected: capsule.attempts?.replay?.status === "REPLAY_REJECTED"
    },
    derived
  };
}
