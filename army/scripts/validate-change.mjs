#!/usr/bin/env node
// Validate an army-spec change folder. Deterministic gate: the loop must not
// start on a malformed or unapproved change.
// Usage: node .claude/army/scripts/validate-change.mjs <change-folder> [--require-approval]
// Exit 0 = valid. Exit 1 = findings printed, one per line.
// --require-approval (used by /army:loop): unapproved is a finding even
// with zero tasks checked, so work cannot start before the human gate.

import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
const requireApproval = process.argv.includes("--require-approval");
const findings = [];

if (!dir || !fs.existsSync(dir)) {
  console.error(`usage: validate-change.mjs <change-folder>; not found: ${dir}`);
  process.exit(1);
}

function read(name) {
  const p = path.join(dir, name);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

const proposal = read("proposal.md");
const spec = read("spec.md");
const tasks = read("tasks.md");

if (!proposal) findings.push("proposal.md missing");
if (!spec) findings.push("spec.md missing");
if (!tasks) findings.push("tasks.md missing");

if (proposal) {
  for (const section of ["why", "what changes", "what does not change"]) {
    const anchored = new RegExp(`^\\s*(#{1,3}\\s*)?${section}\\b`, "mi");
    if (!anchored.test(proposal))
      findings.push(`proposal.md missing line-start section: ${section}`);
  }
}

if (spec) {
  const hasDelta = /^##\s+(ADDED|MODIFIED|REMOVED)\s+Requirements/m.test(spec);
  if (!hasDelta)
    findings.push("spec.md has no ADDED/MODIFIED/REMOVED Requirements header");
  const requirements = (spec.match(/\bSHALL\b/g) || []).length;
  const scenarios = (spec.match(/^#{0,4}\s*scenario\s*:/gim) || []).length;
  if (requirements === 0) findings.push("spec.md has no SHALL requirements");
  if (requirements > 0 && scenarios === 0)
    findings.push("spec.md requirements have no Scenario blocks (untestable)");
}

let checked = 0;
if (tasks) {
  const boxes = tasks.match(/^- \[(x| )\]/gm) || [];
  checked = (tasks.match(/^- \[x\]/gm) || []).length;
  if (boxes.length === 0) findings.push("tasks.md has no checkbox tasks");
  const malformed = (tasks.match(/^- \[(x| )\].*$/gm) || []).filter(
    (l) => !/\(owner: [a-z0-9-]+, test: .+\)/.test(l)
  );
  for (const l of malformed.slice(0, 5))
    findings.push(`task missing (owner: ..., test: ...): ${l.slice(0, 60)}`);
}

// Human gate enforcement: work must not start before written approval.
const approved = proposal && /^Status:\s*approved/mi.test(proposal);
if (checked > 0 && !approved)
  findings.push(
    "tasks are checked but proposal.md has no 'Status: approved' line (human gate skipped)"
  );
if (requireApproval && !approved)
  findings.push("proposal.md has no 'Status: approved' line (human gate: no work before approval)");

if (findings.length) {
  for (const f of findings) console.error(`INVALID: ${f}`);
  process.exit(1);
}
console.log(`valid: ${path.basename(dir)}${approved ? " (approved)" : " (awaiting approval)"}`);
