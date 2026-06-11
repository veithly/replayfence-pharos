import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const cli = path.join(root, "skills/replayfence/scripts/replayfence.mjs");
const action = path.join(root, "skills/replayfence/assets/demo-action.json");

function run(args) {
  return JSON.parse(execFileSync(process.execPath, [cli, ...args], { encoding: "utf8" }));
}

function runText(args) {
  return execFileSync(process.execPath, [cli, ...args], { encoding: "utf8" });
}

test("same action with volatile changes derives the same latch key", () => {
  const base = run(["derive", "--action", action]);
  const dir = mkdtempSync(path.join(tmpdir(), "replayfence-"));
  const changed = path.join(dir, "changed.json");
  const actionJson = JSON.parse(readFileSync(action, "utf8"));
  actionJson.timestamp = new Date().toISOString();
  actionJson.requestId = "request-that-must-not-change-latch";
  writeFileSync(changed, JSON.stringify(actionJson, null, 2));
  const next = run(["derive", "--action", changed]);
  assert.equal(next.latchKey, base.latchKey);
  assert.equal(next.canonicalHashSha256, base.canonicalHashSha256);
});

test("materially different action derives a different latch key", () => {
  const base = run(["derive", "--action", action]);
  const dir = mkdtempSync(path.join(tmpdir(), "replayfence-"));
  const changed = path.join(dir, "changed.json");
  const actionJson = JSON.parse(readFileSync(action, "utf8"));
  actionJson.params.amount = "101";
  writeFileSync(changed, JSON.stringify(actionJson, null, 2));
  const next = run(["derive", "--action", changed]);
  assert.notEqual(next.latchKey, base.latchKey);
});

test("demo consumes first attempt and rejects replay", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "replayfence-"));
  const out = path.join(dir, "capsule.json");
  const result = run(["demo", "--reset", "--action", action, "--out", out, "--state", path.join(dir, "state.json")]);
  assert.equal(result.capsule.attempts.first.status, "CONSUMED");
  assert.equal(result.capsule.attempts.replay.status, "REPLAY_REJECTED");
  const verify = run(["verify", "--capsule", out]);
  assert.equal(verify.ok, true);
  assert.equal(verify.checks.latchKeyMatch, true);
  assert.equal(verify.checks.replayRejected, true);
});

test("pretty demo output is suitable for OpenClaw recording", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "replayfence-"));
  const out = path.join(dir, "capsule.json");
  const transcript = path.join(dir, "openclaw-skill-showcase.out");
  const jsonOut = path.join(dir, "demo-output.json");
  const text = runText([
    "demo",
    "--reset",
    "--action",
    action,
    "--out",
    out,
    "--state",
    path.join(dir, "state.json"),
    "--format",
    "pretty",
    "--transcript",
    transcript,
    "--json-out",
    jsonOut
  ]);

  assert.match(text, /ReplayFence OpenClaw Skill Demo/);
  assert.match(text, /Mode: local-demo/);
  assert.match(text, /first attempt: CONSUMED/);
  assert.match(text, /replay attempt: REPLAY_REJECTED/);
  assert.match(text, /capsule path:/);
  assert.match(text, /Honesty boundary/);
  assert.equal(readFileSync(transcript, "utf8"), text);
  const savedJson = JSON.parse(readFileSync(jsonOut, "utf8"));
  assert.equal(savedJson.capsule.attempts.replay.status, "REPLAY_REJECTED");
  assert.equal(savedJson.transcript, transcript);
  assert.equal(savedJson.jsonOut, jsonOut);

  const verifyJson = path.join(dir, "verify-output.json");
  const verifyText = runText(["verify", "--capsule", out, "--format", "pretty", "--json-out", verifyJson]);
  assert.match(verifyText, /ReplayFence Capsule Verify/);
  assert.match(verifyText, /canonical hash match: PASS/);
  assert.match(verifyText, /latch key match: PASS/);
  assert.match(verifyText, /replay rejected: PASS/);
  assert.match(verifyText, /Result: VERIFIED/);
  assert.equal(JSON.parse(readFileSync(verifyJson, "utf8")).ok, true);
});
