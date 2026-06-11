import { AppShell, PageHeader } from "@/components/workbench";
import { getProofBundle } from "@/lib/proof-data";
import { VerifyClient } from "./verify-client";

export default function VerifyPage() {
  const bundle = getProofBundle();

  return (
    <AppShell active="/verify">
      <main className="page-main">
        <PageHeader
          eyebrow="Independent artifact check"
          title="Verify the capsule, not the narrator."
          body="The browser verifier recomputes deterministic local capsule fields and checks live Pharos reports for a successful first consume plus a reverted replay transaction."
        />
        <div className="example-row">
          <span data-placeholder-example>paste local capsule JSON</span>
          <span data-placeholder-example>load Pharos report JSON</span>
        </div>
        <VerifyClient localCapsule={bundle.localCapsule} liveReport={bundle.pharosConsume} />
      </main>
    </AppShell>
  );
}
