#!/usr/bin/env node
import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const outDir = path.join(root, "pitch", "recording");
const clipDir = path.join(outDir, "_clips");
const htmlPath = path.join(outDir, "openclaw-agent-prompt-demo.html");
const webmPath = path.join(outDir, "openclaw-agent-prompt-demo.webm");
const mp4Path = path.join(outDir, "openclaw-agent-prompt-demo.mp4");
const cuesPath = path.join(outDir, "openclaw-agent-prompt-demo-cues.json");
const promptPath = path.join(root, "demo", "openclaw-agent-prompt.md");
const rawLogPath = path.join(root, "demo", "openclaw-agent-video-output.raw.log");
const jsonPath = path.join(root, "demo", "openclaw-agent-video-output.json");
const summaryPath = path.join(root, "demo", "openclaw-agent-video-summary.json");
const sessionEventsPath = path.join(root, "demo", "openclaw-agent-video-session-events.json");
const sessionKey = `agent:main:replayfence-prompt-video-${Date.now()}`;

if (!existsSync(promptPath)) {
  throw new Error(`Missing prompt file: ${promptPath}`);
}

mkdirSync(outDir, { recursive: true });
mkdirSync(clipDir, { recursive: true });

writeFileSync(htmlPath, terminalHtml());

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
let capturedCues = [];

try {
  await section("01-model", "Hunter model route inside OpenClaw", modelStatusCommand());
  const modelRaw = await runShell(modelStatusCommand());
  const modelJson = parseJsonFromMixedOutput(modelRaw.combined);
  const model = modelJson.models?.[0];
  await lines([
    `default route: ${model?.key || "missing"}`,
    `available: ${model?.available === true ? "yes" : "no"}`,
    `context window: ${model?.contextWindow || "unknown"}`,
    `credential source: env SecretRef OPENAI_API_KEY, value not printed`
  ]);
  await hold(1500);

  await section("02-skill", "ReplayFence skill visible to the agent", "npx --yes openclaw skills info replayfence");
  const skillRaw = await runShell("npx --yes openclaw skills info replayfence");
  await lines(pickLines(skillRaw.combined, [
    /replayfence/i,
    /Ready/i,
    /Path:/i,
    /Visible to model:/i,
    /Available as command:/i
  ]));
  await hold(1700);

  await section("03-prompt", "Prompt sent to OpenClaw", "cat demo/openclaw-agent-prompt.md");
  const promptText = readFileSync(promptPath, "utf8").trimEnd();
  await lines(promptText.split("\n").filter((line) => {
    return /Use the installed|Do not read|Goal:|replayfence|node \/Users|Return a concise|Honesty/i.test(line);
  }).slice(0, 16));
  await hold(1800);

  const agentCommand = openClawAgentCommand();
  await section("04-agent", "Live OpenClaw agent turn", displayAgentCommand());
  await lines([
    "recorder: running the command now; API key is loaded from $HOME/use_key.txt but never printed",
    `recorder: session key ${sessionKey}`,
    "recorder: waiting for model/tool loop..."
  ]);
  const agentRaw = await runShell(agentCommand);
  writeFileSync(rawLogPath, agentRaw.combined);
  const agentJson = parseJsonFromMixedOutput(agentRaw.combined);
  writeFileSync(jsonPath, JSON.stringify(agentJson, null, 2) + "\n");

  const sessionEvents = extractSessionEvents(agentJson.meta?.agentMeta?.sessionFile);
  writeFileSync(sessionEventsPath, JSON.stringify(sessionEvents, null, 2) + "\n");
  const replaySummary = summarizeReplayFenceArtifacts();
  const summary = {
    generatedAt: new Date().toISOString(),
    command: displayAgentCommand(),
    sessionKey,
    provider: agentJson.meta?.agentMeta?.provider,
    model: agentJson.meta?.agentMeta?.model,
    harness: agentJson.meta?.agentMeta?.agentHarnessId,
    runner: agentJson.meta?.executionTrace?.runner,
    fallbackUsed: agentJson.meta?.executionTrace?.fallbackUsed,
    replayfenceVisible: agentJson.meta?.systemPromptReport?.skills?.entries?.some((entry) => entry.name === "replayfence") === true,
    toolSummary: agentJson.meta?.toolSummary,
    sessionFile: agentJson.meta?.agentMeta?.sessionFile,
    sessionEventsFile: sessionEventsPath,
    artifacts: replaySummary,
    finalText: agentJson.payloads?.[0]?.text || ""
  };
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + "\n");

  await lines([
    `provider/model: ${summary.provider}/${summary.model}`,
    `agent harness: ${summary.harness}; runner: ${summary.runner}`,
    `ReplayFence visible in OpenClaw skills prompt: ${summary.replayfenceVisible ? "yes" : "no"}`,
    `tool calls: ${summary.toolSummary?.calls || 0}; tools: ${(summary.toolSummary?.tools || []).join(", ")}`,
    `session file: ${summary.sessionFile}`
  ]);
  await hold(2500);

  await section("05-tools", "OpenClaw session tool calls", "parse OpenClaw session JSONL");
  await lines(sessionEvents.toolCalls.map((call) => `${call.name}: ${call.command || call.path || JSON.stringify(call.arguments)}`));
  await hold(3500);

  await section("06-result", "ReplayFence result produced by the agent", "read generated demo artifacts");
  await lines([
    `capsule: ${replaySummary.capsulePath}`,
    `mode: ${replaySummary.environment}`,
    `first attempt: ${replaySummary.firstStatus}`,
    `replay attempt: ${replaySummary.replayStatus}`,
    `verify: ${replaySummary.verifyStatus}`,
    `Pharos report: ${replaySummary.pharosStatus} on chain ${replaySummary.chainId}`,
    "honesty boundary: terminal run is local-demo; Pharos report is separate live evidence"
  ]);
  await hold(6500);
  await page.evaluate(() => { window.__done = true; });
  await hold(600);
} catch (error) {
  await lines([`ERROR: ${error.message}`]);
  await page.evaluate(() => { window.__done = true; });
  await hold(1200);
  throw error;
} finally {
  const video = page.video();
  capturedCues = await page.evaluate(() => window.__cues || []).catch(() => []);
  await page.close();
  await video.saveAs(webmPath);
  await context.close();
  await browser.close();
}

await convertToMp4(webmPath, mp4Path);

writeFileSync(
  cuesPath,
  JSON.stringify(
    {
      schema: "replayfence.openclaw-agent-video-cues.v1",
      generatedAt: new Date().toISOString(),
      sessionKey,
      prompt: path.relative(root, promptPath),
      rawLog: path.relative(root, rawLogPath),
      json: path.relative(root, jsonPath),
      summary: path.relative(root, summaryPath),
      sessionEvents: path.relative(root, sessionEventsPath),
      webm: path.relative(root, webmPath),
      mp4: path.relative(root, mp4Path),
      cues: capturedCues
    },
    null,
    2
  ) + "\n"
);

process.stdout.write(
  JSON.stringify(
    {
      ok: true,
      html: htmlPath,
      webm: webmPath,
      mp4: mp4Path,
      cues: cuesPath,
      rawLog: rawLogPath,
      json: jsonPath,
      summary: summaryPath,
      sessionEvents: sessionEventsPath
    },
    null,
    2
  ) + "\n"
);

function modelStatusCommand() {
  return [
    'set -a',
    'source "$HOME/use_key.txt" >/dev/null 2>&1',
    'set +a',
    'npx --yes openclaw --no-color models list --provider stepfun --json'
  ].join("; ");
}

function displayAgentCommand() {
  return [
    'set -a; source "$HOME/use_key.txt" >/dev/null 2>&1; set +a',
    'PROMPT="$(cat demo/openclaw-agent-prompt.md)"',
    `npx --yes openclaw --no-color --log-level silent agent --local --agent main --model stepfun/step-3.7-flash --session-key ${sessionKey} --message "$PROMPT" --timeout 600 --verbose on --json`
  ].join("\n");
}

function openClawAgentCommand() {
  return [
    'set -a',
    'source "$HOME/use_key.txt" >/dev/null 2>&1',
    'set +a',
    'PROMPT="$(cat demo/openclaw-agent-prompt.md)"',
    `npx --yes openclaw --no-color --log-level silent agent --local --agent main --model stepfun/step-3.7-flash --session-key ${sessionKey} --message "$PROMPT" --timeout 600 --verbose on --json`
  ].join("; ");
}

function runShell(command) {
  return new Promise((resolve, reject) => {
    const child = spawn("zsh", ["-lc", command], {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      const combined = `${stderr}${stdout}`;
      if (code !== 0) {
        reject(new Error(`Command exited ${code}: ${command}\n${combined.slice(-4000)}`));
        return;
      }
      resolve({ stdout, stderr, combined });
    });
  });
}

function parseJsonFromMixedOutput(raw) {
  const starts = [];
  for (let index = 0; index < raw.length; index += 1) {
    if (raw[index] === "{") starts.push(index);
  }
  for (const start of starts) {
    try {
      return JSON.parse(raw.slice(start));
    } catch {
      // Try the next brace.
    }
  }
  throw new Error(`Could not parse JSON from command output:\n${raw.slice(-2000)}`);
}

function pickLines(raw, patterns) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => patterns.some((pattern) => pattern.test(line)))
    .slice(0, 18);
}

function extractSessionEvents(sessionFile) {
  if (!sessionFile || !existsSync(sessionFile)) {
    return { sessionFile, toolCalls: [], toolResults: [] };
  }
  const records = readFileSync(sessionFile, "utf8")
    .trim()
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const toolCalls = [];
  const toolResults = [];
  for (const record of records) {
    const message = record.message;
    const content = Array.isArray(message?.content) ? message.content : [];
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
      if (message?.role === "toolResult") {
        const text = content
          .map((part) => part.text)
          .filter(Boolean)
          .join("\n")
          .slice(0, 1200);
        toolResults.push({
          id: message.toolCallId,
          name: message.toolName,
          preview: text
        });
      }
    }
  }
  return { sessionFile, recordCount: records.length, toolCalls, toolResults };
}

function summarizeReplayFenceArtifacts() {
  const capsulePath = path.join(root, "demo", "openclaw-agent-replayfence-capsule.json");
  const verifyPath = path.join(root, "demo", "openclaw-agent-verify-output.json");
  const pharosPath = path.join(root, "demo", "pharos-consume-report.json");
  const capsule = JSON.parse(readFileSync(capsulePath, "utf8"));
  const verify = JSON.parse(readFileSync(verifyPath, "utf8"));
  const pharos = JSON.parse(readFileSync(pharosPath, "utf8"));
  return {
    capsulePath,
    verifyPath,
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

async function section(id, title, command) {
  await page.evaluate(({ id: cueId, title: cueTitle, commandText }) => {
    window.__recordCue(cueId, cueTitle);
    window.__section(cueTitle, commandText);
  }, { id, title, commandText: command });
  await hold(350);
}

async function lines(values) {
  for (const value of values.filter(Boolean)) {
    await page.evaluate((line) => window.__line(line), String(value));
    await hold(lineDelay(value));
  }
}

async function hold(ms) {
  await page.waitForTimeout(ms);
}

function lineDelay(value) {
  const length = String(value).length;
  if (length > 160) return 900;
  if (length > 100) return 700;
  return 430;
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

function terminalHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ReplayFence OpenClaw Agent Prompt Demo</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #090b0c;
      --panel: #111514;
      --panel2: #171c1a;
      --line: #31403a;
      --ink: #f3f7ee;
      --muted: #a2aea8;
      --green: #9cff6a;
      --cyan: #55d6e7;
      --amber: #f2c94c;
      --red: #ff6b5f;
      --violet: #d7b7ff;
      --mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
      --sans: "Geist", "Aptos", "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1200px;
      margin: 0;
      overflow: hidden;
      background:
        linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255,255,255,0.024) 1px, transparent 1px),
        radial-gradient(circle at 80% 14%, rgba(85,214,231,0.14), transparent 33%),
        var(--bg);
      background-size: 40px 40px, 40px 40px, auto, auto;
      color: var(--ink);
      font-family: var(--sans);
    }
    .frame {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 18px;
      width: 100%;
      height: 100%;
      padding: 42px 54px;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 32px;
    }
    h1 {
      margin: 0;
      max-width: 1220px;
      font-size: 70px;
      line-height: 0.98;
      letter-spacing: 0;
    }
    .sub {
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 24px;
    }
    .badges {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
      font-family: var(--mono);
      font-size: 16px;
    }
    .badge {
      border: 1px solid rgba(156,255,106,0.48);
      border-radius: 999px;
      padding: 10px 14px;
      color: var(--green);
      white-space: nowrap;
      background: rgba(17,21,20,0.74);
    }
    .badge:nth-child(2) {
      color: var(--cyan);
      border-color: rgba(85,214,231,0.46);
    }
    .terminal {
      min-height: 0;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(17,21,20,0.98);
      box-shadow: 0 30px 95px rgba(0,0,0,0.42);
      overflow: hidden;
    }
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 54px;
      border-bottom: 1px solid var(--line);
      padding: 0 18px;
      background: #0d1110;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 15px;
    }
    .dots { display: flex; gap: 8px; }
    .dots span {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: var(--red);
    }
    .dots span:nth-child(2) { background: var(--amber); }
    .dots span:nth-child(3) { background: var(--green); }
    .screen {
      height: 866px;
      padding: 20px 24px 32px;
      overflow: hidden;
      font-family: var(--mono);
      font-size: 18px;
      line-height: 1.48;
    }
    .scene {
      margin: 0 0 8px;
      color: var(--cyan);
      font-size: 16px;
      text-transform: uppercase;
    }
    .cmd {
      margin: 0 0 13px;
      padding: 12px 14px;
      border: 1px solid rgba(85,214,231,0.2);
      border-radius: 6px;
      color: var(--ink);
      background: rgba(23,28,26,0.72);
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    .cmd::before {
      content: "$ ";
      color: var(--green);
    }
    .line {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      color: #d8e6d8;
    }
    .line.hot { color: var(--green); font-weight: 800; }
    .line.warn { color: var(--amber); }
    .line.danger { color: var(--red); font-weight: 800; }
    .line.meta { color: var(--violet); }
    footer {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 17px;
    }
    #meter { color: var(--green); }
  </style>
</head>
<body>
  <div class="frame">
    <header>
      <div>
        <h1>OpenClaw agent runs ReplayFence from a prompt.</h1>
        <p class="sub">Hunter API key route, installed skill, live tool calls, exactly-once proof.</p>
      </div>
      <div class="badges">
        <div class="badge">provider: stepfun/step-3.7-flash</div>
        <div class="badge">key source: $HOME/use_key.txt env ref</div>
      </div>
    </header>
    <main class="terminal">
      <div class="bar">
        <div class="dots"><span></span><span></span><span></span></div>
        <div>OpenClaw main agent | prompt interaction</div>
        <div>1920x1200</div>
      </div>
      <div id="screen" class="screen"></div>
    </main>
    <footer>
      <span>Recorded by executing a fresh OpenClaw agent turn during capture</span>
      <span id="meter">waiting</span>
    </footer>
  </div>
  <script>
    const screenEl = document.getElementById("screen");
    const meterEl = document.getElementById("meter");
    window.__cues = [];
    window.__done = false;
    const started = performance.now();
    function cls(line) {
      if (/REPLAY_REJECTED|ReplayFenceReplay|FAILED|ERROR/i.test(line)) return "danger";
      if (/CONSUMED|VERIFIED|PASS|Ready|Visible to model: yes|Available as command: yes|provider\\/model|tool calls|ReplayFence visible|available: yes/i.test(line)) return "hot";
      if (/local-demo|honesty boundary|key is loaded|value not printed|SecretRef/i.test(line)) return "warn";
      if (/recorder:|session|agent harness|read |exec |source \\\"\\$HOME/i.test(line)) return "meta";
      return "";
    }
    function add(tag, className, text) {
      const node = document.createElement(tag);
      node.className = className;
      node.textContent = text;
      screenEl.appendChild(node);
      node.scrollIntoView({ block: "end" });
    }
    window.__recordCue = (id, title) => {
      window.__cues.push({ id, title, at_ms: Math.round(performance.now() - started) });
      meterEl.textContent = id + " | " + title;
    };
    window.__section = (title, command) => {
      add("div", "scene", title);
      add("div", "cmd", command);
    };
    window.__line = (line) => add("div", "line " + cls(line), line || " ");
  </script>
</body>
</html>`;
}
