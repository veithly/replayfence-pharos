"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleSlash2, Play, RotateCcw } from "lucide-react";
import {
  ActionPreview,
  ExternalProofLink,
  HashValue,
  ProofRail,
  StatusPill
} from "@/components/workbench";

const storageKey = "replayfence.try.phase";
const historyKey = "replayfence.capsule.history.v1";

function saveCapsuleHistory(consume, sessionId) {
  if (!consume?.liveProofId) return;
  const ownerId = sessionId || "guest-unassigned";
  const record = {
    capsuleId: consume.liveProofId,
    schema: consume.schema,
    createdAt: new Date().toISOString(),
    environment: "pharos-atlantic",
    displayLabel: "Guest saved Pharos replay proof",
    ownerId,
    guestSessionId: ownerId,
    walletAddress: consume.actor,
    status: consume.status,
    action: {
      label: "Agent payout intent: invoice-042",
      actionHash: consume.actionHash,
      canonicalHashSha256: consume.actionHash,
      actorScope: consume.actor,
      toolId: "demoTreasury.requestPayout"
    },
    latch: {
      chainId: consume.chainId,
      registryAddress: consume.registryAddress,
      latchKey: consume.latchKey,
      status: consume.status
    },
    attempts: {
      first: consume.firstConsume,
      replay: consume.replayAttempt?.transaction
    },
    proof: {
      source: "pharos-atlantic",
      verifierStatus: consume.replayAttempt?.status || "NEEDS_REVIEW",
      verifierNotes: ["Saved from the guest /try workbench after replay rejection."]
    },
    raw: consume
  };
  const existing = JSON.parse(window.localStorage.getItem(historyKey) || "[]");
  const next = [record, ...existing.filter((item) => item?.capsuleId !== record.capsuleId)].slice(0, 12);
  window.localStorage.setItem(historyKey, JSON.stringify(next));
}

export function TryClient({ action, consume }) {
  const [phase, setPhase] = useState("ready");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const savedPhase = window.localStorage.getItem(storageKey);
    if (savedPhase) setPhase(savedPhase);
    let savedSession = window.localStorage.getItem("replayfence.guest.session");
    if (!savedSession) {
      savedSession = `guest-${crypto.randomUUID().slice(0, 8)}`;
      window.localStorage.setItem("replayfence.guest.session", savedSession);
    }
    setSessionId(savedSession);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, phase);
  }, [phase]);

  const timeline = useMemo(() => {
    const items = [
      {
        label: "Canonicalize action",
        detail: "The demo-safe payout intent is stripped to stable identity fields.",
        tone: phase === "ready" ? "warning" : "success"
      },
      {
        label: "Derive Pharos latch",
        detail: consume?.latchKey || "Latest live latch key is not available.",
        tone: phase === "ready" ? "warning" : "success"
      },
      {
        label: "First consume",
        detail: consume?.firstConsume?.txHash || "No first consume tx in report.",
        tone: phase === "ready" ? "neutral" : "success"
      },
      {
        label: "Replay same action",
        detail: consume?.replayAttempt?.transaction?.txHash || "No replay tx in report.",
        tone: phase === "replayed" ? "danger" : "neutral"
      }
    ];
    return items;
  }, [phase, consume]);

  const consumed = phase === "consumed" || phase === "replayed";
  const replayed = phase === "replayed";

  return (
    <section className="workbench-grid">
      <div>
        <ActionPreview action={action} />
        <div className="phase-banner" aria-live="polite">
          <strong>{sessionId || "guest session"}</strong>
          This visual workbench plays the latest real Pharos report. Run
          <code> npm run contract:consume:pharos </code>
          to generate a fresh live pair.
        </div>
        <div className="try-actions">
          <button
            className="primary-button"
            type="button"
            data-testid="fence-run-button"
            onClick={() => setPhase("consumed")}
          >
            <Play size={17} /> Fence + Execute Once
          </button>
          <button
            className="danger-button"
            type="button"
            data-testid="replay-same-action-button"
            disabled={!consumed}
            onClick={() => {
              saveCapsuleHistory(consume, sessionId);
              setPhase("replayed");
            }}
          >
            <CircleSlash2 size={17} /> Replay Same Action
          </button>
          <button className="secondary-button" type="button" onClick={() => setPhase("ready")}>
            <RotateCcw size={17} /> Reset View
          </button>
        </div>
      </div>

      <section className="panel">
        <div className="panel-title">
          <CheckCircle2 size={18} />
          <span>Live proof timeline</span>
        </div>
        <StatusPill
          status={replayed ? "REPLAY_REJECTED" : consumed ? "CONSUMED" : "READY"}
          tone={replayed ? "danger" : consumed ? "success" : "warning"}
        />
        <ProofRail items={timeline} />
      </section>

      <section className="proof-anatomy">
        <div className="panel-title">
          <ArrowRight size={18} />
          <span>Latest Pharos run</span>
        </div>
        <HashValue label="proofId" value={consume?.liveProofId} />
        <HashValue label="latchKey" value={consume?.latchKey} />
        <HashValue label="actionHash" value={consume?.actionHash} />
        {consumed ? (
          <>
            <HashValue label="first tx" value={consume?.firstConsume?.txHash} />
            <ExternalProofLink href={consume?.firstConsume?.explorer}>Open first consume on PharosScan</ExternalProofLink>
          </>
        ) : null}
        {replayed ? (
          <>
            <HashValue label="replay tx" value={consume?.replayAttempt?.transaction?.txHash} />
            <ExternalProofLink href={consume?.replayAttempt?.transaction?.explorer}>
              Open reverted replay on PharosScan
            </ExternalProofLink>
            <div className="shock-band" data-testid="latch-status-badge">
              <CircleSlash2 size={18} />
              <span>ReplayFenceReplay decoded from eth_call and confirmed by reverted tx receipt.</span>
            </div>
            <a className="text-button" href="/capsules" data-next-step-cta>
              Inspect saved capsule <ArrowRight size={16} />
            </a>
          </>
        ) : null}
      </section>
    </section>
  );
}
