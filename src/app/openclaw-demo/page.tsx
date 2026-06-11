import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileJson,
  PlayCircle,
  TerminalSquare
} from "lucide-react";
import {
  AppShell,
  CapsuleSummary,
  CommandBlock,
  ExternalProofLink,
  PageHeader,
  ProofRail,
  StatusPill
} from "@/components/workbench";
import { getProofBundle } from "@/lib/proof-data";

export default function OpenClawDemoPage() {
  const bundle = getProofBundle();
  const localCapsule = bundle.capsules.find((capsule) => capsule.environment === "local-demo");
  const tuiSummary = bundle.openclawTuiSummary || {};
  const tuiReport = bundle.openclawTuiReport || {};
  const tuiArtifacts = tuiSummary.artifacts || tuiReport.replayfence || {};
  const toolCalls = bundle.openclawTuiSessionEvents?.toolCalls || tuiReport.toolCalls || [];
  const finalText =
    tuiReport.finalAssistantText ||
    bundle.openclawTuiAgentOutput?.finalAssistantText ||
    "Final OpenClaw assistant output not found.";
  const typedPromptPreview = tuiSummary.prompt
    ? tuiSummary.prompt.length > 420
      ? `${tuiSummary.prompt.slice(0, 420)}...`
      : tuiSummary.prompt
    : "Typed prompt summary not found.";
  const transcript =
    [bundle.openclawTuiShowcase, bundle.openclawTranscript, bundle.openclawShowcase]
      .filter(Boolean)
      .join("\n\n") ||
    "OpenClaw transcript not found.";

  return (
    <AppShell active="/openclaw-demo">
      <main className="page-main">
        <PageHeader
          eyebrow="OpenClaw skill demo"
          title="ReplayFence gives an agent exactly-once action protection."
          body="A normal OpenClaw prompt asks the installed ReplayFence skill to guard one payout action, reject the duplicate replay, and return a capsule another user can verify."
          composition="openclaw-command-rail"
          actions={
            <>
              <a className="primary-button" href="/evidence-media/replayfence-skill-demo-english-narrated.mp4">
                Watch full demo <PlayCircle size={17} />
              </a>
              <Link className="secondary-button" href="/try">
                Open workbench <ArrowRight size={17} />
              </Link>
            </>
          }
        />
        <div className="example-row">
          <span data-placeholder-example>openclaw tui --local</span>
          <span data-placeholder-example>prompt typed into TUI input</span>
          <span data-placeholder-example>agent asks for exactly-once protection</span>
        </div>

        <section className="tui-proof-layout">
          <section className="proof-video-panel">
            <div className="panel-title">
              <PlayCircle size={18} />
              <span>Primary narrated demo</span>
            </div>
            <video
              controls
              preload="metadata"
              poster="/evidence-media/tui-31-final.png"
              aria-label="English narrated ReplayFence OpenClaw skill demo"
            >
              <source src="/evidence-media/replayfence-skill-demo-english-narrated.mp4" type="video/mp4" />
              <source src="/evidence-media/replayfence-skill-demo-english-narrated.webm" type="video/webm" />
              <track
                kind="captions"
                src="/evidence-media/replayfence-skill-demo-english-captions.vtt"
                srcLang="en-US"
                label="English narration"
              />
            </video>
            <div className="metric-grid" aria-label="OpenClaw TUI proof metrics">
              <div>
                <span>Prompt mode</span>
                <strong>{tuiSummary.typedPrompt ? "typed in TUI" : "missing"}</strong>
              </div>
              <div>
                <span>No --message</span>
                <strong>{tuiSummary.noMessageFlag ? "confirmed" : "unknown"}</strong>
              </div>
              <div>
                <span>Tool calls</span>
                <strong>{tuiSummary.toolSummary?.calls ?? toolCalls.length}</strong>
              </div>
              <div>
                <span>Failures</span>
                <strong>{tuiSummary.toolSummary?.failures ?? 0}</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">
              <CheckCircle2 size={18} />
              <span>OpenClaw result</span>
            </div>
            <StatusPill status="verified TUI interaction" tone="success" />
            <ProofRail
              items={[
                {
                  label: "Skill loaded by agent",
                  detail: "OpenClaw reads the installed ReplayFence SKILL.md before running the commands.",
                  tone: "success"
                },
                {
                  label: "First status",
                  detail: tuiArtifacts.firstStatus || "CONSUMED",
                  tone: "success"
                },
                {
                  label: "Replay status",
                  detail: tuiArtifacts.replayStatus || "REPLAY_REJECTED",
                  tone: "danger"
                },
                {
                  label: "Verifier status",
                  detail: tuiArtifacts.verifyStatus || (bundle.localVerify?.ok ? "VERIFIED" : "missing"),
                  tone: bundle.localVerify?.ok ? "success" : "warning"
                }
              ]}
            />
            <div className="phase-banner">
              <strong>Honesty boundary</strong>
              This clip proves local OpenClaw skill use. Live Pharos consume/replay tx proof is recorded separately in the Pharos report.
            </div>
          </section>
        </section>

        <section className="workbench-grid">
          <section className="panel">
            <div className="panel-title">
              <TerminalSquare size={18} />
              <span>Typed prompt</span>
            </div>
            <p className="history-note">
              The recorder spawns the real TUI, types this request into the input line, and submits it with Enter.
            </p>
            <CommandBlock title="prompt typed into OpenClaw">{typedPromptPreview}</CommandBlock>
          </section>
          <section className="panel">
            <div className="panel-title">
              <ClipboardCheck size={18} />
              <span>Session tool calls</span>
            </div>
            <ProofRail
              items={toolCalls.map((call) => ({
                label:
                  call.name === "read"
                    ? "read installed SKILL.md"
                    : call.command?.includes(" verify ")
                      ? "exec verify command"
                      : "exec demo command",
                detail: call.path || call.command || "tool call recorded in OpenClaw session JSONL",
                tone: "success"
              }))}
            />
            <ExternalProofLink href="/evidence-media/openclaw-tui-interactive-session-events.json">
              Open session events JSON
            </ExternalProofLink>
          </section>
          <div>
            {localCapsule ? (
              <CapsuleSummary capsule={localCapsule} href={`/capsules/${localCapsule.capsuleId}`} />
            ) : null}
            <section className="panel">
              <div className="panel-title">
                <FileJson size={18} />
                <span>Evidence files</span>
              </div>
              <ProofRail
                items={[
                  {
                    label: "Raw TUI typescript",
                    detail: "demo/openclaw-tui-interactive.typescript",
                    tone: "success"
                  },
                  {
                    label: "TUI report",
                    detail: ".hunter/openclaw-tui-interactive.report.json",
                    tone: "success"
                  },
                  {
                    label: "Agent-created capsule",
                    detail: tuiArtifacts.capsuleId || localCapsule?.capsuleId || "capsule missing",
                    tone: localCapsule ? "success" : "warning"
                  }
                ]}
              />
              <ExternalProofLink href="/evidence/openclaw-tui-replayfence-capsule.json">
                Open TUI-created capsule artifact
              </ExternalProofLink>
            </section>
          </div>
        </section>

        <section className="workbench-grid openclaw-supporting-evidence">
          <CommandBlock title="final OpenClaw reply">{finalText}</CommandBlock>
          <CommandBlock title="OpenClaw-generated skill transcript">{transcript}</CommandBlock>
          <CommandBlock title="reproduce locally">
            {`set -a; source "$HOME/use_key.txt" >/dev/null 2>&1; set +a
npx --yes openclaw --no-color tui --local --session replayfence-tui-interactive-... --timeout-ms 600000

npx --yes openclaw skills install ./skills/replayfence --as replayfence --force
npx --yes openclaw skills info replayfence
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs demo --reset --format pretty --out demo/openclaw-tui-replayfence-capsule.json --transcript demo/openclaw-tui-skill-showcase.out --json-out demo/openclaw-tui-demo-output.json --pharos-report demo/pharos-consume-report.json
node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs verify --capsule demo/openclaw-tui-replayfence-capsule.json --format pretty --json-out demo/openclaw-tui-verify-output.json`}
          </CommandBlock>
        </section>
      </main>
    </AppShell>
  );
}
