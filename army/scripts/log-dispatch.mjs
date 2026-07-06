#!/usr/bin/env node
// Append one telemetry event to .claude/army/telemetry.jsonl so routing
// accuracy and gate behavior become measurable instead of anecdotal.
// Usage: node .claude/army/scripts/log-dispatch.mjs <event> [key=value ...]
// Events: intake, dispatch, gate, loop-exit, verify-block, misroute
// Example: log-dispatch.mjs intake type=bug route=army-debugging difficulty=routine

import fs from "node:fs";
import path from "node:path";

const [event, ...pairs] = process.argv.slice(2);
if (!event) {
  console.error("usage: log-dispatch.mjs <event> [key=value ...]");
  process.exit(1);
}

const entry = { ts: new Date().toISOString(), event };
for (const p of pairs) {
  const i = p.indexOf("=");
  if (i > 0) entry[p.slice(0, i)] = p.slice(i + 1);
}

const file = path.join(".claude", "army", "telemetry.jsonl");
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.appendFileSync(file, JSON.stringify(entry) + "\n");
