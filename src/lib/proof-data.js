import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataPaths = {
  localCapsule: path.join(root, "demo", "replayfence-capsule.json"),
  localVerify: path.join(root, "demo", "replayfence-verify-output.json"),
  openclawTuiCapsule: path.join(root, "demo", "openclaw-tui-replayfence-capsule.json"),
  openclawTuiVerify: path.join(root, "demo", "openclaw-tui-verify-output.json"),
  openclawTuiSummary: path.join(root, "demo", "openclaw-tui-interactive-summary.json"),
  openclawTuiSessionEvents: path.join(root, "demo", "openclaw-tui-interactive-session-events.json"),
  openclawTuiAgentOutput: path.join(root, "demo", "openclaw-tui-interactive-agent-output.json"),
  openclawTuiReport: path.join(root, ".hunter", "openclaw-tui-interactive.report.json"),
  openclawTuiShowcase: path.join(root, "demo", "openclaw-tui-skill-showcase.out"),
  pharosDeploy: path.join(root, "demo", "pharos-deploy-report.json"),
  pharosConsume: path.join(root, "demo", "pharos-consume-report.json"),
  openclawTranscript: path.join(root, "demo", "openclaw-install.out"),
  openclawShowcase: path.join(root, "demo", "openclaw-skill-showcase.out"),
  openclawNotes: path.join(root, "demo", "openclaw-install.md"),
  demoAction: path.join(root, "skills", "replayfence", "assets", "demo-action.json")
};

function readJsonFile(absolutePath, fallback = null) {
  if (!existsSync(absolutePath)) return fallback;
  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch {
    return fallback;
  }
}

function readTextFile(absolutePath, fallback = "") {
  if (!existsSync(absolutePath)) return fallback;
  return readFileSync(absolutePath, "utf8");
}

function shortHash(value) {
  if (!value || typeof value !== "string") return "not available";
  if (value.length <= 18) return value;
  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

function liveReportToCapsule(report) {
  if (!report?.liveProofId) return null;
  return {
    capsuleId: report.liveProofId,
    schema: report.schema,
    createdAt: report.liveProofId.replace(/^pharos-/, "").slice(0, 24),
    environment: "pharos-atlantic",
    displayLabel: "Pharos live once-latch proof",
    status: report.status,
    action: {
      label: "Agent payout intent: invoice-042",
      actionHash: report.actionHash,
      canonicalHashSha256: report.actionHash,
      actorScope: report.actor,
      toolId: "demoTreasury.requestPayout"
    },
    latch: {
      chainId: report.chainId,
      registryAddress: report.registryAddress,
      latchKey: report.latchKey,
      status: report.status
    },
    attempts: {
      first: report.firstConsume,
      replay: report.replayAttempt?.transaction
    },
    proof: {
      source: "pharos-atlantic",
      verifierStatus:
        report.replayAttempt?.status === "REPLAY_REJECTED"
          ? "REPLAY_REJECTED"
          : "NEEDS_REVIEW",
      verifierNotes: [
        "First consume has a Pharos transaction receipt.",
        "Replay attempt reused the same latch and reverted on-chain.",
        "Raw eth_call decoded ReplayFenceReplay before the replay tx was sent."
      ]
    },
    raw: report
  };
}

export function getProofBundle() {
  const openclawTuiCapsule = readJsonFile(dataPaths.openclawTuiCapsule, {});
  const openclawTuiVerify = readJsonFile(dataPaths.openclawTuiVerify, {});
  const openclawTuiSummary = readJsonFile(dataPaths.openclawTuiSummary, {});
  const openclawTuiSessionEvents = readJsonFile(dataPaths.openclawTuiSessionEvents, {});
  const openclawTuiAgentOutput = readJsonFile(dataPaths.openclawTuiAgentOutput, {});
  const openclawTuiReport = readJsonFile(dataPaths.openclawTuiReport, {});
  const openclawTuiShowcase = readTextFile(dataPaths.openclawTuiShowcase, "");
  const legacyLocalCapsule = readJsonFile(dataPaths.localCapsule, {});
  const legacyLocalVerify = readJsonFile(dataPaths.localVerify, {});
  const localCapsule = openclawTuiCapsule?.capsuleId ? openclawTuiCapsule : legacyLocalCapsule;
  const localVerify = openclawTuiVerify?.ok ? openclawTuiVerify : legacyLocalVerify;
  const pharosDeploy = readJsonFile(dataPaths.pharosDeploy, {});
  const pharosConsume = readJsonFile(dataPaths.pharosConsume, {});
  const openclawTranscript = readTextFile(dataPaths.openclawTranscript, "");
  const openclawShowcase = readTextFile(dataPaths.openclawShowcase, "");
  const openclawNotes = readTextFile(dataPaths.openclawNotes, "");
  const demoAction = readJsonFile(dataPaths.demoAction, {});
  const liveCapsule = liveReportToCapsule(pharosConsume);

  const localSummary = localCapsule?.capsuleId
    ? {
        capsuleId: localCapsule.capsuleId,
        schema: localCapsule.schema,
        createdAt: localCapsule.createdAt,
        environment: localCapsule.environment,
        displayLabel: localCapsule.action?.label || "Local ReplayFence capsule",
        status: localCapsule.latch?.status,
        action: localCapsule.action,
        latch: localCapsule.latch,
        attempts: localCapsule.attempts,
        proof: localCapsule.proof,
        raw: localCapsule
      }
    : null;

  return {
    demoAction,
    localCapsule,
    localVerify,
    pharosDeploy,
    pharosConsume,
    openclawTranscript,
    openclawShowcase,
    openclawNotes,
    openclawTuiCapsule,
    openclawTuiVerify,
    openclawTuiSummary,
    openclawTuiSessionEvents,
    openclawTuiAgentOutput,
    openclawTuiReport,
    openclawTuiShowcase,
    capsules: [liveCapsule, localSummary].filter(Boolean),
    shortHash
  };
}

export function getCapsuleById(capsuleId) {
  return getProofBundle().capsules.find((capsule) => capsule.capsuleId === capsuleId) || null;
}
