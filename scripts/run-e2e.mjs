#!/usr/bin/env node
// End-to-end outcome eval harness. Measures whether the workflow actually
// produced a correct result, not whether it classified the request.
//
// Workflow per task:
//   node scripts/run-e2e.mjs list
//   node scripts/run-e2e.mjs prepare <id> <workdir>   copies the fixture
//   <run the agent under test in <workdir> with the fixture's TASK.md>
//   node scripts/run-e2e.mjs check <id> <workdir>     deterministic verdict
//
// Checks are rules-based wherever possible; fuzzy tasks name a RUBRIC.md to
// score via the army-judge skill after the deterministic part passes.

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const FIXTURES = path.join(ROOT, "eval", "e2e", "fixtures");

const TASKS = {
  "bugfix-range": {
    title: "Fix an off-by-one bug without weakening tests",
    check: checkBugfixRange,
  },
  "feature-slugify": {
    title: "Implement slugify test-first from SHALL requirements",
    check: checkFeatureSlugify,
  },
  "question-cache": {
    title: "Answer an architecture question without touching code",
    check: checkQuestionCache,
  },
};

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function runTests(dir) {
  const testDir = path.join(dir, "test");
  if (!fs.existsSync(testDir)) return { ok: false, out: "no test/ directory" };
  const files = fs
    .readdirSync(testDir)
    .filter((f) => f.endsWith(".js"))
    .map((f) => path.join("test", f));
  if (files.length === 0) return { ok: false, out: "no test files in test/" };
  // Strip test-runner context so a fixture suite spawned from inside another
  // `node --test` run reports its own real exit code.
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  delete env.NODE_OPTIONS;
  try {
    execFileSync("node", ["--test", ...files], { cwd: dir, encoding: "utf8", env });
    return { ok: true };
  } catch (e) {
    return { ok: false, out: String(e.stdout || "") + String(e.stderr || "") };
  }
}

function checkBugfixRange(dir) {
  const t = runTests(dir);
  if (!t.ok) return fail(`test suite still failing:\n${t.out.slice(0, 400)}`);
  const testSrc = fs.readFileSync(path.join(dir, "test", "range.test.js"), "utf8");
  const fixtureTest = fs.readFileSync(
    path.join(FIXTURES, "bugfix-range", "test", "range.test.js"),
    "utf8"
  );
  const kept = ["inclusive of end", "start equals end", "start exceeds end"].every(
    (name) => testSrc.includes(name)
  );
  if (!kept) return fail("original tests were weakened or removed");
  if (testSrc !== fixtureTest)
    console.log("note: tests were extended (allowed); originals verified present");
  pass("suite green with original assertions intact");
}

function checkFeatureSlugify(dir) {
  let mod;
  try {
    mod = require(path.join(dir, "src", "index.js"));
  } catch (e) {
    return fail(`src/index.js does not load: ${e.message}`);
  }
  if (typeof mod.slugify !== "function")
    return fail("slugify is not exported from src/index.js");
  const cases = [
    ["  Rock & Roll!  ", "rock-roll"],
    ["Hello World", "hello-world"],
    ["Multiple   Spaces", "multiple-spaces"],
    ["A--B---C", "a-b-c"],
    ["already-fine", "already-fine"],
  ];
  for (const [input, want] of cases) {
    const got = mod.slugify(input);
    if (got !== want) return fail(`slugify(${JSON.stringify(input)}) = ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  }
  const testDir = path.join(dir, "test");
  const hasTest =
    fs.existsSync(testDir) &&
    fs.readdirSync(testDir).some((f) => fs.readFileSync(path.join(testDir, f), "utf8").includes("slugify"));
  if (!hasTest) return fail("no test file covering slugify (TDD evidence missing)");
  const t = runTests(dir);
  if (!t.ok) return fail(`written tests do not pass:\n${t.out.slice(0, 400)}`);
  pass("slugify correct on all requirement cases, with tests present and green");
}

function hashTree(dir) {
  const out = {};
  for (const rel of fs.readdirSync(dir, { recursive: true })) {
    const p = path.join(dir, String(rel));
    if (fs.statSync(p).isFile())
      out[String(rel)] = crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
  }
  return out;
}

function checkQuestionCache(dir) {
  const before = hashTree(path.join(FIXTURES, "question-cache"));
  const after = hashTree(dir);
  for (const [rel, hash] of Object.entries(before)) {
    if (after[rel] !== hash)
      return fail(`fixture file modified: ${rel} (questions must not change code)`);
  }
  pass(
    "no files modified. Now score the written answer against " +
      path.join(FIXTURES, "question-cache", "RUBRIC.md") +
      " using the army-judge skill (pass: 12/15, no criterion below 3)."
  );
}

const [cmd, id, workdir] = process.argv.slice(2);

if (cmd === "list") {
  for (const [tid, t] of Object.entries(TASKS)) console.log(`${tid}\t${t.title}`);
  process.exit(0);
}

if (!TASKS[id]) {
  console.error(
    `unknown task: ${id ?? "(none)"}. Run 'run-e2e.mjs list' for valid ids, then 'prepare <id> <workdir>'.`
  );
  process.exit(1);
}

if (cmd === "prepare") {
  if (!workdir) {
    console.error("usage: run-e2e.mjs prepare <id> <workdir>");
    process.exit(1);
  }
  copyDir(path.join(FIXTURES, id), workdir);
  console.log(`prepared ${id} in ${workdir}. Task statement: ${path.join(workdir, "TASK.md")}`);
  console.log(`After the agent runs, verify with: run-e2e.mjs check ${id} ${workdir}`);
  process.exit(0);
}

if (cmd === "check") {
  if (!workdir || !fs.existsSync(workdir)) {
    console.error(`workdir not found: ${workdir}. Run 'prepare ${id} <workdir>' first.`);
    process.exit(1);
  }
  TASKS[id].check(path.resolve(workdir));
  process.exit(process.exitCode || 0);
}

console.error("usage: run-e2e.mjs list | prepare <id> <workdir> | check <id> <workdir>");
process.exit(1);
