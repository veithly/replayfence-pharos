import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/workbench";
import { getProofBundle } from "@/lib/proof-data";
import { CapsuleHistoryClient } from "./capsule-history-client";

export default function CapsulesPage() {
  const bundle = getProofBundle();

  return (
    <AppShell active="/capsules">
      <main className="page-main">
        <PageHeader
          eyebrow="History and proof artifacts"
          title="Capsules survive the demo path."
          body="Open the live Pharos proof capsule or the local OpenClaw capsule. Each detail page exposes hashes, receipts, replay status, and raw JSON."
          actions={
            <Link className="primary-button" href="/verify" data-next-step-cta>
              Verify capsule <ArrowRight size={17} />
            </Link>
          }
        />
        <div className="example-row">
          <span data-placeholder-example>pharos live replay proof</span>
          <span data-placeholder-example>local OpenClaw capsule</span>
        </div>
        <CapsuleHistoryClient seededCapsules={bundle.capsules} />
      </main>
    </AppShell>
  );
}
