const { test } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const VALIDATOR = path.join(__dirname, "..", "army", "scripts", "validate-change.mjs");

function runValidator(dir) {
  try {
    return { out: execFileSync("node", [VALIDATOR, dir], { encoding: "utf8" }), code: 0 };
  } catch (e) {
    return { out: (e.stderr || "") + (e.stdout || ""), code: e.status };
  }
}

function makeChange(overrides = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "army-change-"));
  const files = {
    "proposal.md":
      "# Proposal\nWhy: users need CSV export.\nWhat changes: add export button.\nWhat does not change: report queries.\nStatus: approved (user, 2026-07-06)\n",
    "spec.md":
      "## ADDED Requirements\nThe system SHALL export reports as CSV.\n#### Scenario: happy path\nGiven a report, when export is clicked, then a CSV downloads.\n",
    "tasks.md": "- [ ] 1. add export endpoint (owner: backend-engineer, test: returns csv content type)\n",
    ...overrides,
  };
  for (const [name, content] of Object.entries(files)) {
    if (content !== null) fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

test("valid approved change folder passes", () => {
  const r = runValidator(makeChange());
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /valid/);
});

test("missing spec.md fails", () => {
  const dir = makeChange();
  fs.unlinkSync(path.join(dir, "spec.md"));
  const r = runValidator(dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /spec\.md missing/);
});

test("requirement without scenario fails", () => {
  const r = runValidator(
    makeChange({ "spec.md": "## ADDED Requirements\nThe system SHALL export CSV.\n" })
  );
  assert.equal(r.code, 1);
  assert.match(r.out, /no Scenario blocks/);
});

test("checked tasks without approval fails (human gate enforced)", () => {
  const r = runValidator(
    makeChange({
      "proposal.md":
        "# Proposal\nWhy: x.\nWhat changes: y.\nWhat does not change: z.\n",
      "tasks.md": "- [x] 1. did it (owner: backend-engineer, test: passes)\n",
    })
  );
  assert.equal(r.code, 1);
  assert.match(r.out, /human gate skipped/);
});

test("--require-approval fails an unapproved folder even with zero checked tasks", () => {
  const dir = makeChange({
    "proposal.md": "# Proposal\nWhy: x.\nWhat changes: y.\nWhat does not change: z.\n",
  });
  const r1 = runValidator(dir);
  assert.equal(r1.code, 0, "without flag, awaiting approval is valid");
  let failed = false;
  try {
    execFileSync("node", [VALIDATOR, dir, "--require-approval"], { encoding: "utf8" });
  } catch (e) {
    failed = true;
    assert.match(String(e.stderr), /no work before approval/);
  }
  assert.ok(failed, "with flag, unapproved must fail");
});

test("malformed task line fails", () => {
  const r = runValidator(makeChange({ "tasks.md": "- [ ] 1. vague task\n" }));
  assert.equal(r.code, 1);
  assert.match(r.out, /missing \(owner/);
});

test("intake eval scorer gates below 85 percent", () => {
  const SCORER = path.join(__dirname, "..", "scripts", "score-intake.mjs");
  const cases = fs
    .readFileSync(path.join(__dirname, "..", "eval", "intake-cases.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));
  const perfect = path.join(os.tmpdir(), `answers-perfect-${process.pid}.jsonl`);
  fs.writeFileSync(
    perfect,
    cases.map((c) => JSON.stringify({ id: c.id, type: c.expected })).join("\n")
  );
  const ok = execFileSync("node", [SCORER, "score", perfect], { encoding: "utf8" });
  assert.match(ok, /accuracy: 30\/30/);
  const bad = path.join(os.tmpdir(), `answers-bad-${process.pid}.jsonl`);
  fs.writeFileSync(
    bad,
    cases.map((c) => JSON.stringify({ id: c.id, type: "bug" })).join("\n")
  );
  assert.throws(() => execFileSync("node", [SCORER, "score", bad], { encoding: "utf8" }));
});
