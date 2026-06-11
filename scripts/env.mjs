import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function loadEnv(root = process.cwd()) {
  const files = [".env.local", ".dev.vars", ".env"];
  for (const file of files) {
    const full = path.join(root, file);
    if (!existsSync(full)) continue;
    const text = readFileSync(full, "utf8");
    for (const line of text.split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
      const index = line.indexOf("=");
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  }
}

export function redact(value) {
  if (!value) return "";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}
