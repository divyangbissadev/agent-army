// The e2e harness itself must be trustworthy: each checker must fail the
// unfixed fixture and pass a known-good solution.
const { test } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const RUNNER = path.join(__dirname, "..", "scripts", "run-e2e.mjs");

function run(args) {
  try {
    return { code: 0, out: execFileSync("node", [RUNNER, ...args], { encoding: "utf8" }) };
  } catch (e) {
    return { code: e.status, out: String(e.stdout || "") + String(e.stderr || "") };
  }
}

function prepare(id) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `army-e2e-${id}-`));
  const r = run(["prepare", id, dir]);
  assert.equal(r.code, 0, r.out);
  return dir;
}

test("bugfix-range: fails unfixed, fails weakened tests, passes real fix", () => {
  const dir = prepare("bugfix-range");
  assert.equal(run(["check", "bugfix-range", dir]).code, 1, "unfixed must fail");

  // Cheating by weakening the test must be caught even though tests go green.
  const testPath = path.join(dir, "test", "range.test.js");
  const original = fs.readFileSync(testPath, "utf8");
  fs.writeFileSync(testPath, 'const { test } = require("node:test");\ntest("nothing", () => {});\n');
  const cheated = run(["check", "bugfix-range", dir]);
  assert.equal(cheated.code, 1, "weakened tests must fail");
  assert.match(cheated.out, /weakened/);
  fs.writeFileSync(testPath, original);

  const src = path.join(dir, "src", "range.js");
  fs.writeFileSync(src, fs.readFileSync(src, "utf8").replace("i < end", "i <= end"));
  const fixed = run(["check", "bugfix-range", dir]);
  assert.equal(fixed.code, 0, fixed.out);
});

test("feature-slugify: fails empty module, fails missing tests, passes full solution", () => {
  const dir = prepare("feature-slugify");
  assert.equal(run(["check", "feature-slugify", dir]).code, 1, "unimplemented must fail");

  const impl = `function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/\\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
module.exports = { slugify };
`;
  fs.writeFileSync(path.join(dir, "src", "index.js"), impl);
  const noTests = run(["check", "feature-slugify", dir]);
  assert.equal(noTests.code, 1, "implementation without tests must fail");
  assert.match(noTests.out, /TDD evidence/);

  fs.mkdirSync(path.join(dir, "test"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "test", "slugify.test.js"),
    `const { test } = require("node:test");
const assert = require("node:assert");
const { slugify } = require("../src/index");
test("slugify collapses and strips", () => {
  assert.equal(slugify("  Rock & Roll!  "), "rock-roll");
});
`
  );
  const full = run(["check", "feature-slugify", dir]);
  assert.equal(full.code, 0, full.out);
});

test("question-cache: passes untouched tree and names the rubric, fails on modification", () => {
  const dir = prepare("question-cache");
  const clean = run(["check", "question-cache", dir]);
  assert.equal(clean.code, 0, clean.out);
  assert.match(clean.out, /RUBRIC\.md/, "fuzzy task must hand off to the judge");

  fs.appendFileSync(path.join(dir, "src", "lru.js"), "\n// drive-by edit\n");
  const dirty = run(["check", "question-cache", dir]);
  assert.equal(dirty.code, 1, "modified code must fail a question task");
  assert.match(dirty.out, /modified/);
});

test("runner teaches on misuse", () => {
  const unknown = run(["check", "no-such-task", "/tmp"]);
  assert.equal(unknown.code, 1);
  assert.match(unknown.out, /list.*for valid ids/s);
});
