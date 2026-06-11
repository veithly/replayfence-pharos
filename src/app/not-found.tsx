import Link from "next/link";
import { AppShell, EmptyState } from "@/components/workbench";

export default function NotFound() {
  return (
    <AppShell>
      <main className="page-main">
        <EmptyState
          title="Capsule not found"
          body="The requested proof artifact is not in the local evidence bundle yet."
          href="/capsules"
          action="Open capsule history"
        />
      </main>
    </AppShell>
  );
}

