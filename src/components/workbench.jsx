import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Braces,
  CheckCircle2,
  CircleSlash2,
  ClipboardCheck,
  ExternalLink,
  FileJson,
  Fingerprint,
  Hammer,
  Hexagon,
  RadioTower,
  ShieldCheck,
  TerminalSquare,
  Workflow,
  XCircle
} from "lucide-react";
import { CopyButton } from "./copy-button";

export const navItems = [
  ["/", "Workbench"],
  ["/openclaw-demo", "OpenClaw"],
  ["/try", "Try"],
  ["/capsules", "Capsules"],
  ["/verify", "Verify"],
  ["/docs/skill", "Skill Docs"]
];

export function AppShell({ active = "/", children }) {
  return (
    <div className="app-shell" data-visual-lane="operational-dashboard / cyberpunk-terminal hybrid.">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="ReplayFence workbench">
          <img src="/brand/logomark.svg" alt="ReplayFence logomark" />
          <span>ReplayFence</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map(([href, label]) => (
            <Link key={href} className={active === href ? "active" : ""} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  body,
  actions = null,
  composition = "control-room-triptych"
}) {
  return (
    <section className="page-header" data-hero-composition={composition}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {body ? <p className="lead">{body}</p> : null}
      </div>
      {actions ? <div className="header-actions">{actions}</div> : null}
    </section>
  );
}

export function StatusPill({ status, tone = "neutral", icon = null }) {
  return (
    <span className={`status-pill ${tone}`}>
      {icon || null}
      {status}
    </span>
  );
}

export function HashValue({ value, label }) {
  return (
    <div className="hash-row">
      <span>{label}</span>
      <code>{value || "not available"}</code>
      {value ? <CopyButton value={value} label={`Copy ${label}`} /> : null}
    </div>
  );
}

export function ExternalProofLink({ href, children }) {
  if (!href) return null;
  return (
    <a className="proof-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <ExternalLink size={15} />
    </a>
  );
}

export function CommandBlock({ title, children }) {
  return (
    <section className="terminal-panel" aria-label={title}>
      <div className="terminal-title">
        <TerminalSquare size={18} />
        <span>{title}</span>
      </div>
      <pre>{children}</pre>
    </section>
  );
}

export function ProofRail({ items }) {
  return (
    <ol className="proof-rail" aria-label="ReplayFence proof state timeline">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className={item.tone || "neutral"}>
          <span className="rail-index">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CapsuleSummary({ capsule, href = null }) {
  const isLive = capsule.environment === "pharos-atlantic";
  return (
    <article className="capsule-card">
      <div className="capsule-card-head">
        <span className="capsule-icon">{isLive ? <RadioTower size={19} /> : <FileJson size={19} />}</span>
        <div>
          <h2>{capsule.displayLabel || capsule.action?.label || capsule.capsuleId}</h2>
          <p>{capsule.environment}</p>
        </div>
      </div>
      <StatusPill
        status={capsule.status || capsule.latch?.status || "UNKNOWN"}
        tone={isLive ? "success" : "warning"}
        icon={isLive ? <ShieldCheck size={15} /> : <ClipboardCheck size={15} />}
      />
      <HashValue label="latch" value={capsule.latch?.latchKey} />
      <HashValue label="action" value={capsule.action?.actionHash} />
      {href ? (
        <Link className="text-button" href={href}>
          Inspect capsule <ArrowRight size={16} />
        </Link>
      ) : null}
    </article>
  );
}

export function EvidenceGrid({ deploy, consume, localVerify }) {
  const cells = [
    {
      icon: <Boxes size={20} />,
      label: "Registry",
      value: deploy?.contractAddress || consume?.registryAddress || "not deployed",
      tone: deploy?.contractAddress ? "success" : "warning"
    },
    {
      icon: <CheckCircle2 size={20} />,
      label: "First consume",
      value: consume?.firstConsume?.receiptStatus || "pending",
      tone: consume?.firstConsume?.receiptStatus === "success" ? "success" : "warning"
    },
    {
      icon: <XCircle size={20} />,
      label: "Replay tx",
      value: consume?.replayAttempt?.transaction?.receiptStatus || "pending",
      tone: consume?.replayAttempt?.transaction?.receiptStatus === "reverted" ? "danger" : "warning"
    },
    {
      icon: <Fingerprint size={20} />,
      label: "Local verifier",
      value: localVerify?.ok ? "ok" : "not run",
      tone: localVerify?.ok ? "success" : "warning"
    }
  ];

  return (
    <div className="evidence-grid">
      {cells.map((cell) => (
        <div className={`evidence-cell ${cell.tone}`} key={cell.label}>
          {cell.icon}
          <span>{cell.label}</span>
          <strong>{cell.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function ActionPreview({ action }) {
  return (
    <section className="action-preview" data-testid="demo-action-card">
      <div className="panel-title">
        <Hammer size={18} />
        <span>Safe seeded action</span>
      </div>
      <h2>{action?.label || "Agent payout intent: invoice-042"}</h2>
      <dl className="action-facts">
        <div>
          <dt>tool</dt>
          <dd>{action?.toolId || "demoTreasury.requestPayout"}</dd>
        </div>
        <div>
          <dt>risk</dt>
          <dd>{action?.risk || "duplicate payout if replayed"}</dd>
        </div>
        <div>
          <dt>amount</dt>
          <dd>{action?.params?.amount || "100"} {action?.params?.unit || "DEMO"}</dd>
        </div>
      </dl>
    </section>
  );
}

export function ProofAnatomy({ consume }) {
  return (
    <section className="proof-anatomy">
      <div className="panel-title">
        <Braces size={18} />
        <span>Capsule anatomy</span>
      </div>
      <HashValue label="latchKey" value={consume?.latchKey} />
      <HashValue label="actionHash" value={consume?.actionHash} />
      <HashValue label="capsuleHint" value={consume?.capsuleHint} />
      <div className="shock-band">
        <CircleSlash2 size={18} />
        <span>Exact replay uses the same latch and lands as a reverted Pharos tx.</span>
      </div>
    </section>
  );
}

export function EmptyState({ title, body, href, action }) {
  return (
    <section className="empty-state">
      <Hexagon size={24} />
      <h2>{title}</h2>
      <p>{body}</p>
      {href ? (
        <Link className="primary-button" href={href}>
          {action} <ArrowRight size={16} />
        </Link>
      ) : null}
    </section>
  );
}

export function RouteSurfaceList() {
  const routes = [
    ["/openclaw-demo", "Skill install proof", <TerminalSquare size={17} />],
    ["/try", "Replay action workbench", <Workflow size={17} />],
    ["/capsules", "Saved proof history", <FileJson size={17} />],
    ["/verify", "Independent verifier", <ShieldCheck size={17} />]
  ];

  return (
    <div className="surface-list">
      {routes.map(([href, label, icon]) => (
        <Link href={href} key={href}>
          {icon}
          <span>{label}</span>
          <ArrowRight size={15} />
        </Link>
      ))}
    </div>
  );
}
