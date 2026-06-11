import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { AppShell, HashValue, PageHeader, ProofRail, StatusPill } from "@/components/workbench";
import { getProofBundle } from "@/lib/proof-data";
import { SkillTabs } from "./skill-tabs";

export default function SkillDocsPage() {
  const bundle = getProofBundle();
  const registryAddress =
    bundle.pharosDeploy.contractAddress || bundle.pharosConsume.registryAddress || "registry not deployed";
  const snippets = {
    install: {
      title: "OpenClaw install",
      code: `npx --yes openclaw skills install ./skills/replayfence --as replayfence --force
npx --yes openclaw skills info replayfence
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs demo --reset --format pretty --out demo/replayfence-capsule.json --transcript demo/openclaw-skill-showcase.out --json-out demo/replayfence-demo-output.json --pharos-report demo/pharos-consume-report.json
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs verify --capsule demo/replayfence-capsule.json --format pretty --json-out demo/replayfence-verify-output.json`
    },
    sdk: {
      title: "TypeScript wrapper",
      code: `import { deriveLatchKey, createCapsule } from "./packages/replayfence-skill/src/index.mjs";

const action = {
  actorScope: "agent:demo",
  toolId: "demoTreasury.requestPayout",
  method: "requestPayout",
  params: { invoiceId: "invoice-042", amount: "100", unit: "DEMO" }
};

const latch = deriveLatchKey({
  action,
  chainId: 688689,
  registryAddress: "${registryAddress}"
});

console.log(latch.latchKey, latch.actionHash);`
    },
    contract: {
      title: "Pharos registry call",
      code: `OnceLatchRegistry.consume(
  bytes32 latchKey,
  bytes32 actionHash,
  bytes32 capsuleHint
)

ReplayFenceReplay(bytes32 latchKey, address originalActor, uint64 originalBlock)
registry=${registryAddress}`
    }
  };

  return (
    <AppShell active="/docs/skill">
      <main className="page-main">
        <PageHeader
          eyebrow="Reusable skill surface"
          title="Add ReplayFence to another agent runtime."
          body="The project is packaged as a local OpenClaw skill, a small deterministic SDK, and a Pharos OnceLatchRegistry contract."
          actions={
            <Link className="primary-button" href="/openclaw-demo">
              See install proof <ArrowRight size={17} />
            </Link>
          }
        />
        <div className="example-row">
          <span data-placeholder-example>copy OpenClaw install</span>
          <span data-placeholder-example>copy TypeScript wrapper</span>
        </div>
        <section className="workbench-grid">
          <section className="panel">
            <div className="panel-title">
              <BookOpen size={18} />
              <span>Skill contract</span>
            </div>
            <StatusPill status="OpenClaw Ready" tone="success" />
            <HashValue label="registry" value={registryAddress} />
            <HashValue label="chain" value="688689" />
            <HashValue label="live proof" value={bundle.pharosConsume.liveProofId} />
            <ProofRail
              items={[
                {
                  label: "Canonical action identity",
                  detail: "Stable JSON fields become an action hash.",
                  tone: "success"
                },
                {
                  label: "Once-latch consume",
                  detail: "The first call writes latch state on Pharos Atlantic.",
                  tone: "success"
                },
                {
                  label: "Replay rejection",
                  detail: "The second call reuses the same latch and hits ReplayFenceReplay.",
                  tone: "danger"
                }
              ]}
            />
          </section>
          <div className="span-two">
            <SkillTabs snippets={snippets} />
            <section className="panel">
              <div className="panel-title">
                <ShieldCheck size={18} />
                <span>Safety boundary</span>
              </div>
              <p className="lead">
                ReplayFence is testnet-safe exactly-once evidence for deterministic agent actions. It is not production wallet security, phishing detection, or arbitrary transaction simulation.
              </p>
            </section>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
