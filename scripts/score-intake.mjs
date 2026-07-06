#!/usr/bin/env node
// Intake eval harness. Deterministic scorer for the army-intake classifier.
//
// Workflow (run by a human or an agent developing the harness):
//   node scripts/score-intake.mjs list > /tmp/cases.txt
//     Prints "id<TAB>statement" WITHOUT labels. Have the model under test
//     classify each line using ONLY the army-intake skill rubric, writing
//     one JSON line per case to answers.jsonl: {"id":1,"type":"bug"}
//     Mixed requests: answer with the FIRST flow per the rubric's
//     decomposition rule (bugs before features).
//   node scripts/score-intake.mjs score answers.jsonl
//     Prints accuracy, per-type breakdown, and every miss. Exits 1 if
//     accuracy is below the 0.85 gate, so eval regressions fail loudly.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CASES = fs
  .readFileSync(path.join(ROOT, "eval", "intake-cases.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l));

const GATE = 0.85;
const norm = (t) => String(t).toLowerCase().trim().replace(/[\s_]+/g, "-");

const cmd = process.argv[2];

if (cmd === "list") {
  for (const c of CASES) console.log(`${c.id}\t${c.statement}`);
  process.exit(0);
}

if (cmd === "score") {
  const file = process.argv[3];
  if (!file || !fs.existsSync(file)) {
    console.error("usage: score-intake.mjs score <answers.jsonl>");
    process.exit(1);
  }
  const answers = new Map();
  const answerLines = fs.readFileSync(file, "utf8").trim().split("\n").filter(Boolean);
  for (const [i, l] of answerLines.entries()) {
    let a;
    try {
      a = JSON.parse(l);
    } catch {
      console.error(`skipping malformed answer line ${i + 1}: ${l.slice(0, 60)}`);
      continue;
    }
    if (answers.has(a.id))
      console.error(`warning: duplicate answer for id ${a.id}; last one wins`);
    answers.set(a.id, norm(a.type));
  }

  let correct = 0;
  const misses = [];
  const perType = {};
  for (const c of CASES) {
    const expected = norm(c.expected);
    const got = answers.get(c.id) || "(missing)";
    perType[expected] = perType[expected] || { total: 0, correct: 0 };
    perType[expected].total++;
    if (got === expected) {
      correct++;
      perType[expected].correct++;
    } else {
      misses.push(`  #${c.id} expected ${expected}, got ${got}: ${c.statement}`);
    }
  }

  const acc = correct / CASES.length;
  console.log(`accuracy: ${correct}/${CASES.length} (${(acc * 100).toFixed(1)}%), gate ${GATE * 100}%`);
  for (const [t, s] of Object.entries(perType).sort())
    console.log(`  ${t.padEnd(13)} ${s.correct}/${s.total}`);
  if (misses.length) console.log(`misses:\n${misses.join("\n")}`);
  process.exit(acc >= GATE ? 0 : 1);
}

console.error("usage: score-intake.mjs list | score <answers.jsonl>");
process.exit(1);
