import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import {
  AppShell,
  CapsuleSummary,
  ExternalProofLink,
  HashValue,
  PageHeader,
  ProofRail,
  StatusPill
} from "@/components/workbench";
import { getCapsuleById, getProofBundle } from "@/lib/proof-data";

export function generateStaticParams() {
  return getProofBundle().capsules.map((capsule) => ({ capsuleId: capsule.capsuleId }));
}

export default async function CapsuleDetailPage({ params }) {
  const { capsuleId } = await params;
  const capsule = getCapsuleById(capsuleId);
  if (!capsule) notFound();
  const isLive = capsule.environment === "pharos-atlantic";
  const firstExplorer = capsule.raw?.firstConsume?.explorer;
  const replayExplorer = capsule.raw?.replayAttempt?.transaction?.explorer;

  return (
    <AppShell active="/capsules">
      <main className="page-main">
        <PageHeader
          eyebrow={capsule.environment}
          title={capsule.displayLabel || capsule.action?.label || capsule.capsuleId}
          body="A capsule detail view should make the claim inspectable without a narrator: action identity, latch identity, first attempt, replay attempt, and raw artifact."
          actions={
            <Link className="secondary-button" href="/capsules">
              <ArrowLeft size={17} /> Back to capsules
            </Link>
          }
        />
        <div className="example-row">
          <span data-placeholder-example>compare action hash</span>
          <span data-placeholder-example>open replay receipt</span>
        </div>
        <section className="detail-layout">
          <div>
            <CapsuleSummary capsule={capsule} />
            <section className="panel">
              <div className="panel-title">
                <ShieldCheck size={18} />
                <span>Verification posture</span>
              </div>
              <StatusPill
                status={capsule.proof?.verifierStatus || capsule.status}
                tone={isLive ? "success" : "warning"}
              />
              <ProofRail
                items={[
                  {
                    label: "Action hash present",
                    detail: capsule.action?.actionHash || "missing",
                    tone: capsule.action?.actionHash ? "success" : "danger"
                  },
                  {
                    label: "Latch key present",
                    detail: capsule.latch?.latchKey || "missing",
                    tone: capsule.latch?.latchKey ? "success" : "danger"
                  },
                  {
                    label: "First attempt",
                    detail: capsule.attempts?.first?.txHash || capsule.attempts?.first?.status || "missing",
                    tone: capsule.attempts?.first ? "success" : "danger"
                  },
                  {
                    label: "Replay attempt",
                    detail:
                      capsule.attempts?.replay?.txHash ||
                      capsule.attempts?.replay?.status ||
                      "missing",
                    tone:
                      capsule.attempts?.replay?.receiptStatus === "reverted" ||
                      capsule.attempts?.replay?.status === "REPLAY_REJECTED"
                        ? "danger"
                        : "warning"
                  }
                ]}
              />
              <ExternalProofLink href={firstExplorer}>First consume receipt</ExternalProofLink>
              <br />
              <ExternalProofLink href={replayExplorer}>Replay rejection receipt</ExternalProofLink>
            </section>
          </div>
          <section className="panel">
            <div className="panel-title">
              <ShieldCheck size={18} />
              <span>Proof fields</span>
            </div>
            <HashValue label="capsule" value={capsule.capsuleId} />
            <HashValue label="registry" value={capsule.latch?.registryAddress} />
            <HashValue label="latch" value={capsule.latch?.latchKey} />
            <HashValue label="action" value={capsule.action?.actionHash} />
            <pre className="json-panel">{JSON.stringify(capsule.raw, null, 2)}</pre>
          </section>
        </section>
      </main>
    </AppShell>
  );
}
