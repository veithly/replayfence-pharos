import { AppShell, PageHeader } from "@/components/workbench";
import { getProofBundle } from "@/lib/proof-data";
import { TryClient } from "./try-client";

export default function TryPage() {
  const bundle = getProofBundle();

  return (
    <AppShell active="/try">
      <main className="page-main">
        <PageHeader
          eyebrow="Two-click hero path"
          title="Run once. Replay the exact same action."
          body="This workbench unfolds the latest live Pharos consume report so judges can inspect the first receipt and the rejected replay side by side."
        />
        <div className="example-row">
          <span data-placeholder-example>invoice-042 payout intent</span>
          <span data-placeholder-example>same action replay</span>
        </div>
        <TryClient action={bundle.demoAction} consume={bundle.pharosConsume} />
      </main>
    </AppShell>
  );
}
