#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const outDir = path.join(root, "pitch", "recording");
const clipDir = path.join(outDir, "_clips");
const htmlPath = path.join(outDir, "openclaw-terminal-demo.html");
const webmPath = path.join(outDir, "openclaw-skill-demo.webm");
const cuesPath = path.join(outDir, "openclaw-skill-demo-cues.json");

const installTranscript = readText("demo/openclaw-install.out");
const showcaseTranscript = readText("demo/openclaw-skill-showcase.out");
const verifyTranscript = readText("demo/openclaw-skill-verify.out");

const scenes = [
  {
    id: "01-install",
    title: "Install ReplayFence into OpenClaw",
    command: "npx --yes openclaw skills install ./skills/replayfence --as replayfence --force",
    output: installTranscript.split("\n").slice(0, 2).join("\n"),
    lineMs: 580,
    holdMs: 2100
  },
  {
    id: "02-info",
    title: "OpenClaw sees the skill",
    command: "npx --yes openclaw skills info replayfence",
    output: installTranscript.split("\n").slice(2).join("\n"),
    lineMs: 420,
    holdMs: 3000
  },
  {
    id: "03-run",
    title: "Run the installed workspace skill",
    command:
      "node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs demo --reset --format pretty --out demo/replayfence-capsule.json --transcript demo/openclaw-skill-showcase.out --json-out demo/replayfence-demo-output.json --pharos-report demo/pharos-consume-report.json",
    output: showcaseTranscript,
    lineMs: 360,
    holdMs: 5200
  },
  {
    id: "04-verify",
    title: "Verify the exported capsule",
    command:
      "node ~/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs verify --capsule demo/replayfence-capsule.json --format pretty --json-out demo/replayfence-verify-output.json",
    output: verifyTranscript,
    lineMs: 420,
    holdMs: 7200
  }
];

function readText(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) throw new Error(`Missing transcript: ${relativePath}`);
  return readFileSync(absolutePath, "utf8").trimEnd();
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function terminalHtml() {
  const sceneData = JSON.stringify(scenes);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ReplayFence OpenClaw Skill Demo</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0b0d0c;
      --panel: #121613;
      --line: #384139;
      --ink: #f5f7ef;
      --muted: #9da89f;
      --green: #9cff6a;
      --cyan: #55d6e7;
      --amber: #f7c948;
      --red: #ff6b5f;
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
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255,255,255,0.025) 1px, transparent 1px),
        radial-gradient(circle at 78% 16%, rgba(85,214,231,0.16), transparent 34%),
        var(--bg);
      background-size: 36px 36px, 36px 36px, auto, auto;
      color: var(--ink);
      font-family: var(--sans);
    }
    .frame {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 20px;
      width: 100%;
      height: 100%;
      padding: 46px 58px;
    }
    header {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 28px;
    }
    h1 {
      margin: 0;
      font-size: 76px;
      line-height: 0.95;
      letter-spacing: 0;
    }
    .sub {
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 26px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      min-height: 46px;
      border: 1px solid rgba(156,255,106,0.55);
      border-radius: 999px;
      padding: 10px 16px;
      color: var(--green);
      font-family: var(--mono);
      font-size: 17px;
      white-space: nowrap;
    }
    .terminal {
      min-height: 0;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(18,22,19,0.96);
      box-shadow: 0 28px 90px rgba(0,0,0,0.38);
      overflow: hidden;
    }
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 54px;
      border-bottom: 1px solid var(--line);
      padding: 0 18px;
      background: #0f1210;
      font-family: var(--mono);
      color: var(--muted);
      font-size: 15px;
    }
    .dots {
      display: flex;
      gap: 8px;
    }
    .dots span {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: var(--red);
    }
    .dots span:nth-child(2) { background: var(--amber); }
    .dots span:nth-child(3) { background: var(--green); }
    .screen {
      height: 898px;
      padding: 22px 26px 34px;
      overflow: hidden;
      font-family: var(--mono);
      font-size: 19px;
      line-height: 1.52;
    }
    .scene-title {
      margin: 4px 0 8px;
      color: var(--cyan);
      font-size: 17px;
      text-transform: uppercase;
    }
    .cmd {
      margin: 0 0 12px;
      color: var(--ink);
      overflow-wrap: anywhere;
    }
    .cmd::before {
      content: "$ ";
      color: var(--green);
    }
    .line {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      color: #d9e7d9;
    }
    .line.hot { color: var(--green); font-weight: 800; }
    .line.warn { color: var(--amber); }
    .line.danger { color: var(--red); font-weight: 800; }
    footer {
      display: flex;
      justify-content: space-between;
      gap: 22px;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 18px;
    }
    .meter {
      color: var(--green);
    }
  </style>
</head>
<body>
  <div class="frame">
    <header>
      <div>
        <h1>ReplayFence runs as an OpenClaw skill.</h1>
        <p class="sub">Install, consume once, reject the exact replay, export and verify the capsule.</p>
      </div>
      <div class="badge">OpenClaw installed-skill proof</div>
    </header>
    <main class="terminal">
      <div class="bar">
        <div class="dots"><span></span><span></span><span></span></div>
        <div>~/.openclaw/workspace/skills/replayfence</div>
        <div>1920x1200</div>
      </div>
      <div id="screen" class="screen"></div>
    </main>
    <footer>
      <span>Source transcripts: demo/openclaw-install.out + demo/openclaw-skill-showcase.out</span>
      <span class="meter" id="meter">scene 1 / ${scenes.length}</span>
    </footer>
  </div>
  <script>
    const scenes = ${sceneData};
    const screenEl = document.getElementById("screen");
    const meterEl = document.getElementById("meter");
    const cues = [];
    const start = performance.now();
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    function markLine(line) {
      if (/REPLAY_REJECTED|ReplayFenceReplay|reverted|danger/i.test(line)) return "danger";
      if (/CONSUMED|VERIFIED|PASS|Ready|Visible to model: yes|Available as command: yes|Installed replayfence/i.test(line)) return "hot";
      if (/Honesty boundary|local-demo|not Pharos proof/i.test(line)) return "warn";
      return "";
    }
    function append(tag, className, text) {
      const node = document.createElement(tag);
      node.className = className;
      node.innerHTML = ${htmlEscape.toString()}(text);
      screenEl.appendChild(node);
      screenEl.scrollTop = screenEl.scrollHeight;
      node.scrollIntoView({ block: "end" });
      return node;
    }
    async function play() {
      for (let index = 0; index < scenes.length; index += 1) {
        const scene = scenes[index];
        cues.push({ id: scene.id, title: scene.title, at_ms: Math.round(performance.now() - start) });
        meterEl.textContent = "scene " + (index + 1) + " / " + scenes.length;
        append("div", "scene-title", scene.title);
        append("div", "cmd", scene.command);
        await sleep(520);
        const lines = String(scene.output || "").split("\\n");
        for (const line of lines) {
          append("div", "line " + markLine(line), line || " ");
          await sleep(scene.lineMs || 360);
        }
        await sleep(scene.holdMs || 1000);
      }
      await sleep(700);
      window.__cues = cues;
      window.__done = true;
    }
    play();
  </script>
</body>
</html>`;
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
await page.waitForFunction(() => window.__done === true, null, { timeout: 90000 });
const cues = await page.evaluate(() => window.__cues || []);
const video = page.video();
await page.close();
await video.saveAs(webmPath);
await context.close();
await browser.close();
writeFileSync(
  cuesPath,
  `${JSON.stringify(
    {
      schema: "replayfence.openclaw-terminal-cues.v1",
      generatedAt: new Date().toISOString(),
      sourceTranscripts: [
        "demo/openclaw-install.out",
        "demo/openclaw-skill-showcase.out",
        "demo/openclaw-skill-verify.out"
      ],
      output: webmPath,
      cues
    },
    null,
    2
  )}\n`
);

process.stdout.write(
  JSON.stringify(
    {
      ok: true,
      html: htmlPath,
      webm: webmPath,
      cues: cuesPath,
      duration_ms: cues.at(-1)?.at_ms || null
    },
    null,
    2
  ) + "\n"
);
