#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const outDir = path.join(root, "pitch", "recording");
const clipDir = path.join(outDir, "_clips-user-cases");
const webmPath = path.join(outDir, "replayfence-user-cases-demo.webm");
const mp4Path = path.join(outDir, "replayfence-user-cases-demo.mp4");
const baseUrl = process.env.DEMO_URL || "http://127.0.0.1:4387";

mkdirSync(outDir, { recursive: true });
mkdirSync(clipDir, { recursive: true });

const browser = await chromium.launch({
  args: ["--window-size=1920,1200", "--hide-scrollbars", "--force-device-scale-factor=1"]
});
const context = await browser.newContext({
  viewport: { width: 1920, height: 1200 },
  deviceScaleFactor: 1,
  recordVideo: { dir: clipDir, size: { width: 1920, height: 1200 } }
});
await context.addInitScript(() => {
  window.localStorage.removeItem("replayfence.try.phase");
  window.localStorage.removeItem("replayfence.capsule.history.v1");
});

const page = await context.newPage();

await step(page, "/try", 1600);
await page.getByTestId("fence-run-button").click();
await page.waitForTimeout(1800);
await page.getByTestId("replay-same-action-button").click();
await page.waitForSelector("[data-testid='latch-status-badge']");
await page.waitForTimeout(2600);

await page.getByText("Inspect saved capsule").click();
await page.waitForURL("**/capsules");
await page.waitForSelector("[data-testid='capsule-history-list']");
await page.waitForTimeout(3200);
await page.getByText("Verify capsule").click();
await page.waitForURL("**/verify");
await page.waitForTimeout(1200);

await page.getByRole("button", { name: "Load Pharos report" }).click();
await page.waitForTimeout(600);
await page.getByTestId("verify-capsule-button").click();
await page.getByText("Pharos consume report verification").waitFor();
await page.waitForTimeout(3600);

await page.getByRole("button", { name: "Load local capsule" }).click();
await page.waitForTimeout(600);
await page.getByTestId("verify-capsule-button").click();
await page.getByText("Local capsule verification").waitFor();
await page.waitForTimeout(3000);

await step(page, "/docs/skill", 1800);
await page.getByRole("tab", { name: "SDK" }).click();
await page.waitForTimeout(2200);
await page.getByRole("tab", { name: "Contract" }).click();
await page.waitForTimeout(2600);

const video = page.video();
await page.close();
await video.saveAs(webmPath);
await context.close();
await browser.close();

await convertToMp4(webmPath, mp4Path);

process.stdout.write(
  JSON.stringify(
    {
      ok: true,
      baseUrl,
      webm: webmPath,
      mp4: mp4Path
    },
    null,
    2
  ) + "\n"
);

async function step(page, route, waitMs) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(waitMs);
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
      if (code !== 0) reject(new Error(stderr.slice(-2400)));
      else resolve();
    });
  });
}
