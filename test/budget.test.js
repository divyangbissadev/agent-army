// Instruction-budget enforcement. Models follow a finite number of
// instructions; this suite is the forcing function that keeps the harness
// inside that budget. Raising a cap requires deleting something first.
const { test } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const lines = (p) => fs.readFileSync(p, "utf8").split("\n").length;

test("doctrine stays under 200 lines", () => {
  const n = lines(path.join(ROOT, "army", "DOCTRINE.md"));
  assert.ok(n <= 200, `DOCTRINE.md is ${n} lines (cap 200): delete before adding`);
});

test("session bootstrap stdout stays under 30 lines", () => {
  const out = execFileSync(path.join(ROOT, "scripts", "session-start.sh"), {
    encoding: "utf8",
  });
  const n = out.trim().split("\n").length;
  assert.ok(n <= 30, `bootstrap emits ${n} lines (cap 30): paid every session`);
});

test("every agent stays under 90 lines", () => {
  for (const f of fs.readdirSync(path.join(ROOT, "agents"))) {
    const n = lines(path.join(ROOT, "agents", f));
    assert.ok(n <= 90, `${f} is ${n} lines (cap 90)`);
  }
});

test("every army skill stays under 120 lines (vendored mp-* exempt)", () => {
  const skillsDir = path.join(ROOT, "skills");
  for (const d of fs.readdirSync(skillsDir)) {
    if (!d.startsWith("army-")) continue;
    const n = lines(path.join(skillsDir, d, "SKILL.md"));
    assert.ok(n <= 120, `${d}/SKILL.md is ${n} lines (cap 120)`);
  }
});

test("agent descriptions stay under 30 words (loaded on every spawn)", () => {
  for (const f of fs.readdirSync(path.join(ROOT, "agents"))) {
    const src = fs.readFileSync(path.join(ROOT, "agents", f), "utf8");
    const m = src.match(/^description:\s*(.+)$/m);
    assert.ok(m, `${f} has no description`);
    const words = m[1].trim().split(/\s+/).length;
    assert.ok(words <= 30, `${f} description is ${words} words (cap 30)`);
  }
});

test("commands stay under 45 lines", () => {
  for (const f of fs.readdirSync(path.join(ROOT, "commands"))) {
    const n = lines(path.join(ROOT, "commands", f));
    assert.ok(n <= 45, `commands/${f} is ${n} lines (cap 45)`);
  }
});
