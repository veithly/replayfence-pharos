#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(HERE, "..");
const DEFAULT_ACTION = path.join(SKILL_ROOT, "assets", "demo-action.json");
const VOLATILE_KEYS = new Set(["runId", "requestId", "timestamp", "clickedAt", "nonce"]);

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const [rawKey, inlineValue] = arg.slice(2).split(/=(.*)/s);
      const key = rawKey;
      if (inlineValue !== undefined) {
        out[key] = inlineValue;
        continue;
      }
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) out[key] = true;
      else {
        out[key] = next;
        i += 1;
      }
    } else out._.push(arg);
  }
  return out;
}

function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stripVolatile(value) {
  if (Array.isArray(value)) return value.map(stripVolatile);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const key of Object.keys(value).sort()) {
    if (VOLATILE_KEYS.has(key)) continue;
    out[key] = stripVolatile(value[key]);
  }
  return out;
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function shortHex(value, head = 10, tail = 8) {
  if (!value || typeof value !== "string") return "not available";
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

function collectVolatileKeys(value, acc = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectVolatileKeys(item, acc);
    return acc;
  }
  if (!value || typeof value !== "object") return acc;
  for (const [key, child] of Object.entries(value)) {
    if (VOLATILE_KEYS.has(key)) acc.add(key);
    collectVolatileKeys(child, acc);
  }
  return acc;
}

function derive(action, opts = {}) {
  const canonicalJson = stripVolatile(action);
  const canonicalString = stableStringify(canonicalJson);
  const canonicalHashSha256 = `0x${sha256Hex(canonicalString)}`;
  const chainId = Number(opts.chainId || 688689);
  const registryAddress =
    opts.registryAddress || "0x000000000000000000000000000000000000f3ce";
  const actorScope = canonicalJson.actorScope || "default-actor";
  const toolId = canonicalJson.toolId || "unknown-tool";
  const latchMaterial = [
    "ReplayFence:v1",
    String(chainId),
    registryAddress.toLowerCase(),
    actorScope,
    toolId,
    canonicalHashSha256
  ].join("|");
  const latchKey = `0x${sha256Hex(latchMaterial)}`;

  return {
    canonicalJson,
    canonicalString,
    canonicalHashSha256,
    actionHash: canonicalHashSha256,
    chainId,
    registryAddress,
    actorScope,
    toolId,
    latchKey
  };
}

function loadState(statePath) {
  if (!existsSync(statePath)) return { latches: {} };
  return readJson(statePath);
}

function saveState(statePath, state) {
  mkdirSync(path.dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function consumeLocal(state, derived) {
  const existing = state.latches[derived.latchKey];
  if (existing) {
    return {
      status: "REPLAY_REJECTED",
      latchKey: derived.latchKey,
      originalAttemptId: existing.attemptId,
      originalConsumedAt: existing.consumedAt,
      reason: "same latch key already consumed"
    };
  }
  const record = {
    attemptId: `attempt_${randomUUID()}`,
    status: "CONSUMED",
    latchKey: derived.latchKey,
    actionHash: derived.actionHash,
    consumedAt: new Date().toISOString(),
    environment: "local-demo"
  };
  state.latches[derived.latchKey] = record;
  return record;
}

function makeCapsule(action, derived, first, replay) {
  return {
    schema: "replayfence.capsule.v1",
    capsuleId: `capsule_${sha256Hex(`${derived.latchKey}:${first.attemptId || "existing"}`).slice(0, 16)}`,
    createdAt: new Date().toISOString(),
    environment: "local-demo",
    action: {
      label: action.label || "Unnamed action",
      toolId: derived.toolId,
      actorScope: derived.actorScope,
      canonicalJson: derived.canonicalJson,
      canonicalHashSha256: derived.canonicalHashSha256,
      actionHash: derived.actionHash
    },
    latch: {
      chainId: derived.chainId,
      registryAddress: derived.registryAddress,
      latchKey: derived.latchKey,
      status: replay.status === "REPLAY_REJECTED" ? "REPLAY_REJECTED" : first.status
    },
    attempts: {
      first,
      replay
    },
    proof: {
      source: "local-demo",
      verifierStatus: "NOT_REQUESTED",
      verifierNotes: [
        "This capsule was produced by local OpenClaw demo mode.",
        "Do not treat it as a Pharos transaction or eth_getProof result."
      ]
    },
    safety: {
      environment: "local-demo",
      actionMode: "demo-safe",
      disclaimer:
        "Local demo proves deterministic replay fencing only. Live Pharos mode is required for tx/proof claims."
    }
  };
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function mode(args) {
  return String(args.format || "json").toLowerCase();
}

function writeTranscript(args, text) {
  if (!args.transcript || !text) return null;
  const transcriptPath = path.resolve(args.transcript);
  mkdirSync(path.dirname(transcriptPath), { recursive: true });
  writeFileSync(transcriptPath, `${text.trimEnd()}\n`);
  return transcriptPath;
}

function writeJsonOutPath(jsonPath, value) {
  mkdirSync(path.dirname(jsonPath), { recursive: true });
  writeFileSync(jsonPath, `${JSON.stringify(value, null, 2)}\n`);
  return jsonPath;
}

function emit(value, args, prettyText) {
  const transcriptPath = writeTranscript(args, prettyText);
  if (transcriptPath && value && typeof value === "object") value.transcript = transcriptPath;
  const jsonPath = args["json-out"] ? path.resolve(args["json-out"]) : null;
  if (jsonPath && value && typeof value === "object") {
    value.jsonOut = jsonPath;
    writeJsonOutPath(jsonPath, value);
  }
  if (mode(args) === "pretty") {
    process.stdout.write(`${prettyText.trimEnd()}\n`);
  } else {
    printJson(value);
  }
}

function pharosSummary(reportFile) {
  if (!reportFile) return null;
  const absolutePath = path.resolve(reportFile);
  const report = readJson(absolutePath);
  return {
    file: absolutePath,
    status: report.status || "unknown",
    chainId: report.chainId,
    registryAddress: report.registryAddress,
    firstConsumeTx: report.firstConsume?.txHash || null,
    replayTx: report.replayAttempt?.transaction?.txHash || null,
    replayStatus:
      report.replayAttempt?.transaction?.status ||
      report.replayAttempt?.status ||
      "unknown",
    decodedReplayError: report.replayAttempt?.simulation?.rpcError?.decoded?.customError || null
  };
}

function formatDerived(action, derived) {
  const stripped = [...collectVolatileKeys(action)].sort();
  return [
    "ReplayFence derive",
    "",
    `Action: ${action.label || "Unnamed action"}`,
    `Tool: ${derived.toolId}`,
    `Actor scope: ${derived.actorScope}`,
    `Volatile fields stripped: ${stripped.length ? stripped.join(", ") : "none found"}`,
    "",
    "Stable identity",
    `  canonical SHA-256: ${derived.canonicalHashSha256}`,
    `  chain id: ${derived.chainId}`,
    `  registry: ${derived.registryAddress}`,
    `  latch key: ${derived.latchKey}`
  ].join("\n");
}

function formatPharos(summary) {
  if (!summary) {
    return [
      "Live Pharos evidence: not attached",
      "  This terminal run is local-demo only. Use --pharos-report <file> to show recorded live tx evidence."
    ].join("\n");
  }
  return [
    "Live Pharos evidence attached",
    `  report: ${summary.file}`,
    `  status: ${summary.status}`,
    `  registry: ${summary.registryAddress}`,
    `  first consume tx: ${shortHex(summary.firstConsumeTx)}`,
    `  replay tx: ${shortHex(summary.replayTx)}`,
    `  replay status: ${summary.replayStatus}`,
    `  decoded error: ${summary.decodedReplayError || "not available"}`
  ].join("\n");
}

function formatDemo(action, derived, first, replay, capsule, output, pharosEvidence) {
  const stripped = [...collectVolatileKeys(action)].sort();
  return [
    "ReplayFence OpenClaw Skill Demo",
    "",
    "Mode: local-demo",
    "Purpose: prove a normal installed skill can canonicalize one agent action, consume it once, reject the exact replay, and export a capsule.",
    "",
    "1. Canonicalize action",
    `  label: ${action.label || "Unnamed action"}`,
    `  tool: ${derived.toolId}`,
    `  actor scope: ${derived.actorScope}`,
    `  volatile fields stripped: ${stripped.length ? stripped.join(", ") : "none found"}`,
    `  canonical SHA-256: ${derived.canonicalHashSha256}`,
    "",
    "2. Derive latch",
    `  chain id: ${derived.chainId}`,
    `  registry: ${derived.registryAddress}`,
    `  latch key: ${derived.latchKey}`,
    "",
    "3. Execute twice",
    `  first attempt: ${first.status}`,
    `  replay attempt: ${replay.status}`,
    `  replay reason: ${replay.reason || "same latch key already consumed"}`,
    "",
    "4. Export capsule",
    `  capsule id: ${capsule.capsuleId}`,
    `  capsule path: ${output}`,
    `  verifier hint: node scripts/replayfence.mjs verify --capsule ${output} --format pretty`,
    "",
    formatPharos(pharosEvidence),
    "",
    "Honesty boundary",
    "  This run is local-demo evidence. Only an attached Pharos report or live Pharos command proves chain state."
  ].join("\n");
}

function formatVerify(capsuleFile, capsule, result) {
  const pass = (value) => (value ? "PASS" : "FAIL");
  return [
    "ReplayFence Capsule Verify",
    "",
    `Capsule: ${capsuleFile}`,
    `Environment: ${capsule.environment || "unknown"}`,
    `Capsule id: ${capsule.capsuleId || "unknown"}`,
    "",
    "Checks",
    `  canonical hash match: ${pass(result.checks.canonicalHashMatch)}`,
    `  latch key match: ${pass(result.checks.latchKeyMatch)}`,
    `  replay rejected: ${pass(result.checks.replayRejected)}`,
    "",
    `Result: ${result.ok ? "VERIFIED" : "FAILED"}`,
    `Note: ${result.note}`
  ].join("\n");
}

function usage() {
  process.stderr.write(`ReplayFence demo

Usage:
  node scripts/replayfence.mjs derive --action assets/demo-action.json
  node scripts/replayfence.mjs derive --action assets/demo-action.json --format pretty
  node scripts/replayfence.mjs demo --reset --action assets/demo-action.json --out replayfence-capsule.json
  node scripts/replayfence.mjs demo --reset --format pretty --transcript demo/openclaw-skill-showcase.out --json-out demo/replayfence-demo-output.json
  node scripts/replayfence.mjs verify --capsule replayfence-capsule.json
  node scripts/replayfence.mjs verify --capsule replayfence-capsule.json --format pretty
`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];

if (!cmd || args.help) {
  usage();
  process.exit(cmd ? 0 : 1);
}

if (cmd === "derive") {
  const action = readJson(path.resolve(args.action || DEFAULT_ACTION));
  const derived = derive(action, args);
  emit(derived, args, formatDerived(action, derived));
  process.exit(0);
}

if (cmd === "demo") {
  const action = readJson(path.resolve(args.action || DEFAULT_ACTION));
  const statePath = path.resolve(args.state || path.join(process.cwd(), ".replayfence", "openclaw-demo-state.json"));
  if (args.reset && existsSync(statePath)) rmSync(statePath);
  const state = loadState(statePath);
  const derived = derive(action, args);
  const first = consumeLocal(state, derived);
  const replay = consumeLocal(state, derived);
  saveState(statePath, state);
  const capsule = makeCapsule(action, derived, first, replay);
  const out = path.resolve(args.out || path.join(process.cwd(), ".replayfence", "replayfence-capsule.json"));
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(capsule, null, 2)}\n`);
  const pharosEvidence = pharosSummary(args["pharos-report"]);
  emit(
    { ok: true, output: out, capsule, pharosEvidence },
    args,
    formatDemo(action, derived, first, replay, capsule, out, pharosEvidence)
  );
  process.exit(0);
}

if (cmd === "verify") {
  const capsuleFile = args.capsule ? path.resolve(args.capsule) : null;
  if (!capsuleFile) {
    process.stderr.write("Missing --capsule <file>\n");
    process.exit(1);
  }
  const capsule = readJson(capsuleFile);
  const derived = derive(capsule.action?.canonicalJson || {}, {
    chainId: capsule.latch?.chainId,
    registryAddress: capsule.latch?.registryAddress
  });
  const result = {
    ok: derived.latchKey === capsule.latch?.latchKey,
    environment: capsule.environment || "unknown",
    checks: {
      canonicalHashMatch: derived.canonicalHashSha256 === capsule.action?.canonicalHashSha256,
      latchKeyMatch: derived.latchKey === capsule.latch?.latchKey,
      replayRejected: capsule.attempts?.replay?.status === "REPLAY_REJECTED"
    },
    note:
      capsule.environment === "local-demo"
        ? "Verified deterministic local capsule fields. This is not Pharos proof verification."
        : "Capsule is not marked local-demo; ensure live proof verification ran before making chain claims."
  };
  emit(result, args, formatVerify(capsuleFile, capsule, result));
  process.exit(result.ok ? 0 : 1);
}

usage();
process.exit(1);
