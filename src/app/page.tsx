import Link from "next/link";
import { ArrowRight, ShieldCheck, TerminalSquare } from "lucide-react";
import {
  ActionPreview,
  AppShell,
  CapsuleSummary,
  EvidenceGrid,
  PageHeader,
  ProofAnatomy,
  ProofRail,
  RouteSurfaceList,
  StatusPill
} from "@/components/workbench";
import { getProofBundle } from "@/lib/proof-data";

export default function HomePage() {
  const bundle = getProofBundle();
  const liveCapsule = bundle.capsules.find((capsule) => capsule.environment === "pharos-atlantic");

  return (
    <AppShell active="/">
      <main className="page-main">
        <PageHeader
          eyebrow="OpenClaw skill + Pharos once-latch"
          title="Fence one agent action in 60 seconds."
          body="Install the reusable skill, run the safe action once, replay the exact same fingerprint, and inspect the proof capsule."
          actions={
            <>
              <Link className="primary-button" href="/try" data-testid="guest-start-button">
                Try as Guest <ArrowRight size={17} />
              </Link>
              <Link className="secondary-button" href="/openclaw-demo">
                OpenClaw proof <TerminalSquare size={17} />
              </Link>
            </>
          }
        />

        <EvidenceGrid
          deploy={bundle.pharosDeploy}
          consume={bundle.pharosConsume}
          localVerify={bundle.localVerify}
        />

        <section className="workbench-grid">
          <ActionPreview action={bundle.demoAction} />
          <section className="panel">
            <div className="panel-title">
              <ShieldCheck size={18} />
              <span>Latch state cockpit</span>
            </div>
            <StatusPill status={bundle.pharosConsume.status || "PENDING"} tone="success" />
            <ProofRail
              items={[
                {
                  label: "OpenClaw installs ReplayFence",
                  detail: "The skill is visible to the model and available as a command.",
                  tone: "success"
                },
                {
                  label: "Pharos registry deployed",
                  detail: bundle.pharosDeploy.contractAddress || "Registry report missing.",
                  tone: bundle.pharosDeploy.contractAddress ? "success" : "warning"
                },
                {
                  label: "First consume succeeds",
                  detail: bundle.pharosConsume.firstConsume?.txHash || "No live consume report yet.",
                  tone: bundle.pharosConsume.firstConsume?.receiptStatus === "success" ? "success" : "warning"
                },
                {
                  label: "Replay is rejected",
                  detail: bundle.pharosConsume.replayAttempt?.transaction?.txHash || "Replay rejection not recorded.",
                  tone:
                    bundle.pharosConsume.replayAttempt?.transaction?.receiptStatus === "reverted"
                      ? "danger"
                      : "warning"
                }
              ]}
            />
          </section>
          <div>
            {liveCapsule ? (
              <CapsuleSummary capsule={liveCapsule} href={`/capsules/${liveCapsule.capsuleId}`} />
            ) : null}
            <ProofAnatomy consume={bundle.pharosConsume} />
            <RouteSurfaceList />
          </div>
        </section>

        <section className="asset-strip" aria-label="ReplayFence visual evidence assets">
          <img src="/brand/og.png" alt="ReplayFence brand proof plate" />
          <img src="/brand/logomark.svg" alt="ReplayFence logomark" />
          <img src="/brand/wordmark.svg" alt="ReplayFence wordmark" />
          <img src="/brand/logo-mono.svg" alt="ReplayFence mono mark" />
          <img src="/favicon.svg" alt="ReplayFence favicon" />
        </section>
      </main>
    </AppShell>
  );
}

