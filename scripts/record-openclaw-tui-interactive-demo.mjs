#!/usr/bin/env node
import { spawn } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const outDir = path.join(root, "pitch", "recording");
const clipDir = path.join(outDir, "_clips");
const sessionKey = `replayfence-tui-interactive-${Date.now()}`;
const rawLogPath = path.join(root, "demo", "openclaw-tui-interactive.typescript");
const expectPath = path.join(root, "demo", "openclaw-tui-interactive.expect");
const htmlPath = path.join(outDir, "openclaw-tui-interactive-demo.html");
const webmPath = path.join(outDir, "openclaw-tui-interactive-demo.webm");
const mp4Path = path.join(outDir, "openclaw-tui-interactive-demo.mp4");
const cuesPath = path.join(outDir, "openclaw-tui-interactive-demo-cues.json");
const summaryPath = path.join(root, "demo", "openclaw-tui-interactive-summary.json");
const sessionEventsPath = path.join(root, "demo", "openclaw-tui-interactive-session-events.json");
const agentJsonPath = path.join(root, "demo", "openclaw-tui-interactive-agent-output.json");
const reportPath = path.join(root, ".hunter", "openclaw-tui-interactive.report.json");
const publicEvidenceDir = path.join(root, "public", "evidence");
const publicEvidenceMediaDir = path.join(root, "public", "evidence-media");
const timecodes = [
  { id: "01-open-tui", range: "00:00-00:07", proof: "OpenClaw TUI opens and waits for a user prompt." },
  { id: "02-type-prompt", range: "00:07-00:17", proof: "A short user-style prompt is typed into the TUI input line, not passed with --message or read from a file." },
  { id: "03-agent-tools", range: "00:17-00:55", proof: "OpenClaw chooses the installed ReplayFence skill and session files record read/exec tool calls." },
  { id: "04-result", range: "00:55-end", proof: "Agent reports CONSUMED, REPLAY_REJECTED, VERIFIED, and ReplayFence check complete." }
];

const prompt = [
  "Can you use ReplayFence to protect a payout for me?",
  "Run it once, try the exact same payout again, verify the proof capsule, and tell me whether the duplicate was blocked.",
  "Please include the capsule path and finish with: ReplayFence check complete."
].join(" ");

mkdirSync(path.join(root, "demo"), { recursive: true });
mkdirSync(path.join(root, ".hunter"), { recursive: true });
mkdirSync(outDir, { recursive: true });
mkdirSync(clipDir, { recursive: true });
mkdirSync(publicEvidenceDir, { recursive: true });
mkdirSync(publicEvidenceMediaDir, { recursive: true });

writeFileSync(expectPath, expectScript(), { mode: 0o755 });
await runExpect();

const session = findSessionArtifacts(sessionKey);
const events = extractSessionEvents(session.sessionFile);
writeFileSync(sessionEventsPath, JSON.stringify(events, null, 2) + "\n");

const replay = summarizeReplayFenceArtifacts();
const summary = {
  generatedAt: new Date().toISOString(),
  proofMode: "interactive-openclaw-tui",
  sessionKey,
  prompt,
  typedPrompt: true,
  noMessageFlag: true,
  command: `npx --yes openclaw --no-color tui --local --session ${sessionKey} --timeout-ms 600000`,
  keySource: "$HOME/use_key.txt -> OpenClaw stepfun provider config",
  keyPrinted: false,
  provider: session.provider,
  model: session.model,
  sessionFile: session.sessionFile,
  trajectoryFile: session.trajectoryFile,
  rawTuiTypescript: rawLogPath,
  sessionEvents: sessionEventsPath,
  artifacts: replay,
  toolSummary: {
    calls: events.toolCalls.length,
    tools: [...new Set(events.toolCalls.map((call) => call.name))],
    failures: events.toolResults.filter((result) => /Command failed|exit code|Traceback|Error:|FAILED/.test(result.preview)).length
  }
};
writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + "\n");
writeFileSync(agentJsonPath, JSON.stringify({ summary, events }, null, 2) + "\n");

writeFileSync(htmlPath, terminalReplayHtml());
await recordHtml();
await convertToMp4(webmPath, mp4Path);

writeFileSync(
  cuesPath,
  JSON.stringify(
    {
      schema: "replayfence.openclaw-tui-interactive-cues.v1",
      generatedAt: new Date().toISOString(),
      sessionKey,
      promptTypedInline: true,
      rawTuiTypescript: path.relative(root, rawLogPath),
      summary: path.relative(root, summaryPath),
      sessionEvents: path.relative(root, sessionEventsPath),
      mp4: path.relative(root, mp4Path),
      webm: path.relative(root, webmPath),
      timecodes
    },
    null,
    2
  ) + "\n"
);

writeFileSync(reportPath, JSON.stringify(buildReport(summary, events, replay), null, 2) + "\n");
syncPublicEvidence(replay);

process.stdout.write(
  JSON.stringify(
    {
      ok: true,
      sessionKey,
      rawTuiTypescript: rawLogPath,
      summary: summaryPath,
      sessionEvents: sessionEventsPath,
      html: htmlPath,
      webm: webmPath,
      mp4: mp4Path,
      cues: cuesPath
    },
    null,
    2
  ) + "\n"
);

function expectScript() {
  return `#!/usr/bin/expect -f
set timeout 600
set send_slow {1 .012}
log_user 0
log_file -noappend $env(RAW_LOG_PATH)
log_user 1
spawn zsh -lc "cd $env(PROJECT_ROOT); set -a; source \\"$env(HOME)/use_key.txt\\" >/dev/null 2>&1; set +a; npx --yes openclaw --no-color tui --local --session $env(SESSION_KEY) --timeout-ms 600000"
expect {
  -re "stepfun/step-3.7-flash" {}
  timeout { puts "Timed out waiting for OpenClaw TUI model route"; exit 1 }
}
sleep 1
send -s -- $env(TUI_PROMPT)
sleep 0.2
send -- "\\r"
expect {
  -re "(running|streaming|moseying)" {}
  timeout { puts "Timed out waiting for OpenClaw TUI to submit the typed prompt"; exit 2 }
}
expect {
  -re "ReplayFence check complete" {}
  timeout { puts "Timed out waiting for ReplayFence completion"; exit 3 }
}
sleep 3
send -- "\\025/exit\\r"
expect eof
`;
}

function runExpect() {
  return new Promise((resolve, reject) => {
    const child = spawn("expect", [expectPath], {
      cwd: root,
      env: {
        ...process.env,
        PROJECT_ROOT: root,
        RAW_LOG_PATH: rawLogPath,
        SESSION_KEY: sessionKey,
        TUI_PROMPT: prompt
      },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stderr = "";
    let stdout = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (!existsSync(rawLogPath) || statSync(rawLogPath).size === 0) {
        writeFileSync(rawLogPath, stdout + stderr);
      }
      if (code !== 0) {
        reject(new Error(`expect exited ${code}\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`));
        return;
      }
      resolve();
    });
  });
}

function findSessionArtifacts(key) {
  const dir = path.join(os.homedir(), ".openclaw", "agents", "main", "sessions");
  const candidates = readdirSync(dir)
    .filter((name) => name.endsWith(".trajectory.jsonl"))
    .map((name) => path.join(dir, name))
    .filter((file) => readFileSync(file, "utf8").includes(`agent:main:${key}`))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  if (!candidates.length) {
    throw new Error(`No OpenClaw trajectory found for session key ${key}`);
  }
  const trajectoryFile = candidates[0];
  const firstLine = readFileSync(trajectoryFile, "utf8").split(/\n/).find(Boolean);
  const first = JSON.parse(firstLine);
  return {
    trajectoryFile,
    sessionFile: first.data?.sessionFile || trajectoryFile.replace(".trajectory.jsonl", ".jsonl"),
    provider: first.provider,
    model: first.modelId
  };
}

function extractSessionEvents(sessionFile) {
  const records = readFileSync(sessionFile, "utf8")
    .trim()
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const toolCalls = [];
  const toolResults = [];
  let finalAssistantText = "";
  for (const record of records) {
    const message = record.message;
    const content = Array.isArray(message?.content) ? message.content : [];
    if (message?.role === "assistant") {
      finalAssistantText = content
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("\n") || finalAssistantText;
    }
    for (const item of content) {
      if (item.type === "toolCall") {
        toolCalls.push({
          id: item.id,
          name: item.name,
          arguments: item.arguments,
          path: item.arguments?.path,
          command: item.arguments?.command
        });
      }
    }
    if (message?.role === "toolResult") {
      toolResults.push({
        id: message.toolCallId,
        name: message.toolName,
        preview: content.map((part) => part.text || "").join("\n").slice(0, 1600)
      });
    }
  }
  return { sessionFile, recordCount: records.length, toolCalls, toolResults, finalAssistantText };
}

function summarizeReplayFenceArtifacts() {
  const capsulePath = path.join(root, "demo", "openclaw-tui-replayfence-capsule.json");
  const verifyPath = path.join(root, "demo", "openclaw-tui-verify-output.json");
  const demoPath = path.join(root, "demo", "openclaw-tui-demo-output.json");
  const transcriptPath = path.join(root, "demo", "openclaw-tui-skill-showcase.out");
  const pharosPath = path.join(root, "demo", "pharos-consume-report.json");
  const capsule = JSON.parse(readFileSync(capsulePath, "utf8"));
  const verify = JSON.parse(readFileSync(verifyPath, "utf8"));
  const pharos = JSON.parse(readFileSync(pharosPath, "utf8"));
  return {
    capsulePath,
    verifyPath,
    demoPath,
    transcriptPath,
    pharosPath,
    environment: capsule.environment,
    capsuleId: capsule.capsuleId,
    firstStatus: capsule.attempts?.first?.status,
    replayStatus: capsule.attempts?.replay?.status,
    latchKey: capsule.latch?.latchKey,
    verifyStatus: verify.ok && Object.values(verify.checks || {}).every(Boolean) ? "VERIFIED" : "FAILED",
    pharosStatus: pharos.status,
    chainId: pharos.chainId,
    registryAddress: pharos.registryAddress
  };
}

function terminalReplayHtml() {
  const xtermJs = readFileSync(path.join(root, "node_modules", "@xterm", "xterm", "lib", "xterm.js"), "utf8");
  const xtermCss = readFileSync(path.join(root, "node_modules", "@xterm", "xterm", "css", "xterm.css"), "utf8");
  const rawBase64 = readFileSync(rawLogPath).toString("base64");
  const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OpenClaw TUI Interactive ReplayFence Demo</title>
  <style>${xtermCss}</style>
  <style>
    :root { color-scheme: dark; --bg:#080a0b; --line:#2b3835; --ink:#f3f7ef; --muted:#9ca9a4; --green:#9cff6a; --cyan:#55d6e7; --amber:#f2c94c; --mono:"JetBrains Mono","SFMono-Regular",Consolas,monospace; --sans:"Geist","Aptos","Segoe UI",sans-serif; }
    * { box-sizing: border-box; }
    body { width:1920px; height:1200px; margin:0; overflow:hidden; background:linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(180deg,rgba(255,255,255,.024) 1px,transparent 1px),radial-gradient(circle at 82% 12%,rgba(85,214,231,.14),transparent 32%),var(--bg); background-size:40px 40px,40px 40px,auto,auto; color:var(--ink); font-family:var(--sans); }
    .frame { display:grid; grid-template-rows:auto 1fr auto; gap:18px; width:100%; height:100%; padding:42px 54px; }
    header { display:flex; justify-content:space-between; align-items:end; gap:30px; }
    h1 { margin:0; max-width:1180px; font-size:68px; line-height:.98; letter-spacing:0; }
    .sub { margin:12px 0 0; color:var(--muted); font-size:24px; }
    .badges { display:flex; flex-direction:column; align-items:flex-end; gap:10px; font-family:var(--mono); font-size:15px; }
    .badge { border:1px solid rgba(156,255,106,.48); border-radius:999px; padding:10px 14px; color:var(--green); background:rgba(13,17,16,.8); white-space:nowrap; }
    .badge:nth-child(2) { color:var(--cyan); border-color:rgba(85,214,231,.46); }
    .terminal { border:1px solid var(--line); border-radius:8px; overflow:hidden; background:#0b0f0e; box-shadow:0 30px 95px rgba(0,0,0,.42); }
    .bar { display:flex; align-items:center; justify-content:space-between; min-height:52px; border-bottom:1px solid var(--line); padding:0 18px; background:#0d1110; color:var(--muted); font-family:var(--mono); font-size:15px; }
    .dots { display:flex; gap:8px; }
    .dots span { width:13px; height:13px; border-radius:50%; background:#ff6b5f; }
    .dots span:nth-child(2) { background:var(--amber); }
    .dots span:nth-child(3) { background:var(--green); }
    #terminal { width:100%; height:870px; padding:14px 18px; }
    .xterm { height:100%; }
    footer { display:flex; justify-content:space-between; gap:20px; color:var(--muted); font-family:var(--mono); font-size:17px; }
    #meter { color:var(--green); }
  </style>
  <script>${xtermJs}</script>
</head>
<body>
  <div class="frame">
    <header>
      <div>
        <h1>Prompt typed inside OpenClaw TUI.</h1>
        <p class="sub">The agent asks an installed skill to make one payout action safe to retry.</p>
      </div>
      <div class="badges">
        <div class="badge">typed prompt, real tool calls</div>
        <div class="badge">session: ${escapeHtml(summary.sessionKey)}</div>
      </div>
    </header>
    <main class="terminal">
      <div class="bar">
        <div class="dots"><span></span><span></span><span></span></div>
        <div>OpenClaw TUI raw typescript replay</div>
        <div>1920x1200</div>
      </div>
      <div id="terminal"></div>
    </main>
    <footer>
      <span>Source: demo/openclaw-tui-interactive.typescript</span>
      <span id="meter">starting</span>
    </footer>
  </div>
  <script>
    const rawBase64 = ${JSON.stringify(rawBase64)};
    const bytes = Uint8Array.from(atob(rawBase64), c => c.charCodeAt(0));
    const text = new TextDecoder().decode(bytes);
    const term = new Terminal({
      cols: 118,
      rows: 34,
      convertEol: false,
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
      fontSize: 18,
      lineHeight: 1.18,
      theme: { background: '#0b0f0e', foreground: '#f3f7ef', cursor: '#9cff6a', selectionBackground: '#315045' },
      scrollback: 2000
    });
    term.open(document.getElementById('terminal'));
    const meter = document.getElementById('meter');
    const targetMs = 76000;
    const tickMs = 24;
    const chunk = Math.max(24, Math.ceil(text.length / (targetMs / tickMs)));
    let offset = 0;
    const timer = setInterval(() => {
      const next = text.slice(offset, offset + chunk);
      term.write(next);
      offset += chunk;
      meter.textContent = Math.min(100, Math.round((offset / text.length) * 100)) + '%';
      if (offset >= text.length) {
        clearInterval(timer);
        setTimeout(() => { window.__done = true; }, 1800);
      }
    }, tickMs);
  </script>
</body>
</html>`;
}

async function recordHtml() {
  const browser = await chromium.launch({
    args: ["--window-size=1920,1200", "--hide-scrollbars", "--force-device-scale-factor=1"]
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 },
    deviceScaleFactor: 1,
    recordVideo: { dir: clipDir, size: { width: 1920, height: 1200 } }
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(htmlPath).toString());
  await page.waitForFunction(() => window.__done === true, null, { timeout: 120000 });
  const video = page.video();
  await page.close();
  await video.saveAs(webmPath);
  await context.close();
  await browser.close();
}

function convertToMp4(input, output) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", [
      "-y",
      "-i",
      input,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      output
    ], { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) reject(new Error(stderr.slice(-2000)));
      else resolve();
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildReport(summary, events, replay) {
  return {
    schema: "replayfence.openclaw-tui-interactive.report.v1",
    generatedAt: new Date().toISOString(),
    verdict: summary.toolSummary.failures === 0 ? "verified" : "needs-review",
    goal: "Prove a judge-realistic OpenClaw CLI/TUI interaction where a short user-style prompt is typed into OpenClaw, not passed by --message or read from a file.",
    openclaw: {
      version: "2026.6.5",
      entry: "openclaw tui --local",
      sessionKey,
      provider: summary.provider,
      model: summary.model,
      typedPrompt: true,
      noMessageFlag: true,
      keySource: summary.keySource,
      keyPrinted: false,
      sessionFile: summary.sessionFile,
      trajectoryFile: summary.trajectoryFile,
      rawTuiTypescript: path.relative(root, rawLogPath)
    },
    evidence: {
      report: path.relative(root, reportPath),
      summary: path.relative(root, summaryPath),
      agentOutput: path.relative(root, agentJsonPath),
      sessionEvents: path.relative(root, sessionEventsPath),
      rawTuiTypescript: path.relative(root, rawLogPath),
      capsule: path.relative(root, replay.capsulePath),
      demoOutput: path.relative(root, replay.demoPath),
      verifyOutput: path.relative(root, replay.verifyPath),
      transcript: path.relative(root, replay.transcriptPath),
      videoMp4: path.relative(root, mp4Path),
      videoWebm: path.relative(root, webmPath),
      videoCues: path.relative(root, cuesPath),
      publicMirror: [
        "public/evidence-media/openclaw-tui-interactive-demo.mp4",
        "public/evidence-media/openclaw-tui-interactive-demo.webm",
        "public/evidence-media/openclaw-tui-interactive-session-events.json",
        "public/evidence-media/openclaw-tui-interactive-summary.json",
        "public/evidence-media/openclaw-tui-interactive.report.json",
        "public/evidence-media/openclaw-tui-interactive.typescript"
      ]
    },
    toolSummary: summary.toolSummary,
    toolCalls: events.toolCalls.map((call) => ({
      name: call.name,
      path: call.path,
      command: call.command,
      workdir: call.arguments?.workdir
    })),
    finalAssistantText: events.finalAssistantText,
    replayfence: replay,
    videoTimecodes: timecodes
  };
}

function syncPublicEvidence(replay) {
  copyFileSync(mp4Path, path.join(publicEvidenceMediaDir, "openclaw-tui-interactive-demo.mp4"));
  copyFileSync(webmPath, path.join(publicEvidenceMediaDir, "openclaw-tui-interactive-demo.webm"));
  copyFileSync(sessionEventsPath, path.join(publicEvidenceMediaDir, "openclaw-tui-interactive-session-events.json"));
  copyFileSync(summaryPath, path.join(publicEvidenceMediaDir, "openclaw-tui-interactive-summary.json"));
  copyFileSync(reportPath, path.join(publicEvidenceMediaDir, "openclaw-tui-interactive.report.json"));
  copyFileSync(rawLogPath, path.join(publicEvidenceMediaDir, "openclaw-tui-interactive.typescript"));
  copyFileSync(replay.capsulePath, path.join(publicEvidenceDir, "replayfence-capsule.json"));
  copyFileSync(replay.capsulePath, path.join(publicEvidenceDir, "openclaw-tui-replayfence-capsule.json"));
}
