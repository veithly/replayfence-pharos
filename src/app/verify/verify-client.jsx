"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FileJson, ShieldCheck, XCircle } from "lucide-react";

const volatileKeys = new Set(["runId", "requestId", "timestamp", "clickedAt", "nonce"]);

function stripVolatile(value) {
  if (Array.isArray(value)) return value.map(stripVolatile);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const key of Object.keys(value).sort()) {
    if (volatileKeys.has(key)) continue;
    out[key] = stripVolatile(value[key]);
  }
  return out;
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function deriveLatch(action, chainId, registryAddress) {
  const canonicalJson = stripVolatile(action);
  const canonicalString = stableStringify(canonicalJson);
  const actionHash = `0x${await sha256Hex(canonicalString)}`;
  const actorScope = canonicalJson.actorScope || "default-actor";
  const toolId = canonicalJson.toolId || "unknown-tool";
  const latchMaterial = [
    "ReplayFence:v1",
    String(chainId),
    String(registryAddress).toLowerCase(),
    actorScope,
    toolId,
    actionHash
  ].join("|");
  return {
    actionHash,
    latchKey: `0x${await sha256Hex(latchMaterial)}`
  };
}

function CheckRow({ ok, label, detail }) {
  return (
    <li className={ok ? "pass" : "fail"}>
      {ok ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      <span>
        <strong>{label}</strong>
        <br />
        {detail}
      </span>
    </li>
  );
}

export function VerifyClient({ localCapsule, liveReport }) {
  const [text, setText] = useState(() => JSON.stringify(localCapsule, null, 2));
  const [result, setResult] = useState(null);

  const liveText = useMemo(() => JSON.stringify(liveReport, null, 2), [liveReport]);
  const localText = useMemo(() => JSON.stringify(localCapsule, null, 2), [localCapsule]);

  async function verify() {
    try {
      const parsed = JSON.parse(text);
      if (parsed.schema === "replayfence.capsule.v1") {
        const derived = await deriveLatch(
          parsed.action?.canonicalJson || {},
          parsed.latch?.chainId,
          parsed.latch?.registryAddress
        );
        const checks = [
          {
            label: "schema",
            ok: true,
            detail: "replayfence.capsule.v1"
          },
          {
            label: "canonical hash",
            ok: derived.actionHash === parsed.action?.canonicalHashSha256,
            detail: derived.actionHash
          },
          {
            label: "latch key",
            ok: derived.latchKey === parsed.latch?.latchKey,
            detail: derived.latchKey
          },
          {
            label: "replay rejected",
            ok: parsed.attempts?.replay?.status === "REPLAY_REJECTED",
            detail: parsed.attempts?.replay?.reason || parsed.attempts?.replay?.status
          }
        ];
        setResult({ title: "Local capsule verification", checks });
        return;
      }

      if (parsed.schema === "replayfence.pharos.consume.v1") {
        const decoded = parsed.replayAttempt?.simulation?.rpcError?.decoded;
        const checks = [
          {
            label: "live schema",
            ok: parsed.status === "CONSUMED_AND_REPLAY_REJECTED",
            detail: parsed.status
          },
          {
            label: "first consume receipt",
            ok: parsed.firstConsume?.receiptStatus === "success",
            detail: parsed.firstConsume?.txHash
          },
          {
            label: "replay tx receipt",
            ok: parsed.replayAttempt?.transaction?.receiptStatus === "reverted",
            detail: parsed.replayAttempt?.transaction?.txHash
          },
          {
            label: "decoded custom error",
            ok:
              decoded?.customError === "ReplayFenceReplay" &&
              decoded?.latchKey === parsed.latchKey,
            detail: decoded?.customError || "missing"
          }
        ];
        setResult({ title: "Pharos consume report verification", checks });
        return;
      }

      setResult({
        title: "Unknown artifact",
        checks: [{ label: "schema", ok: false, detail: parsed.schema || "missing" }]
      });
    } catch (error) {
      setResult({
        title: "Invalid JSON",
        checks: [{ label: "parse", ok: false, detail: error.message }]
      });
    }
  }

  return (
    <section className="verifier-layout">
      <div className="verifier-panel">
        <div className="panel-title">
          <FileJson size={18} />
          <span>Paste artifact</span>
        </div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          aria-label="ReplayFence capsule or Pharos report JSON"
          data-visual-qa-ignore="true"
        />
        <div className="try-actions">
          <button className="primary-button" type="button" data-testid="verify-capsule-button" onClick={verify}>
            <ShieldCheck size={17} /> Verify
          </button>
          <button className="secondary-button" type="button" onClick={() => setText(localText)}>
            Load local capsule
          </button>
          <button className="secondary-button" type="button" onClick={() => setText(liveText)}>
            Load Pharos report
          </button>
        </div>
      </div>
      <div className="verifier-panel" data-testid="verification-report">
        <div className="panel-title">
          <ShieldCheck size={18} />
          <span>Verification report</span>
        </div>
        {result ? (
          <>
            <h2>{result.title}</h2>
            <ul className="check-list">
              {result.checks.map((check) => (
                <CheckRow key={check.label} {...check} />
              ))}
            </ul>
          </>
        ) : (
          <div className="phase-banner">
            <strong>Waiting for artifact</strong>
            Paste a ReplayFence Capsule or load the latest Pharos report, then run verification.
          </div>
        )}
      </div>
    </section>
  );
}
