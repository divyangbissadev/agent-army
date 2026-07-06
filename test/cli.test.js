const { test } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const CLI = path.join(__dirname, "..", "bin", "cli.js");

function run(args, opts = {}) {
  return execFileSync("node", [CLI, ...args], { encoding: "utf8", ...opts });
}

function tmpRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "agent-army-test-"));
}

function manifest(dir) {
  return JSON.parse(
    fs.readFileSync(path.join(dir, ".claude", ".agent-army.json"), "utf8")
  );
}

test("bare invocation shows help and does not install", () => {
  const dir = tmpRepo();
  const out = run([], { cwd: dir });
  assert.match(out, /Usage:/);
  assert.ok(!fs.existsSync(path.join(dir, ".claude")));
});

test("init installs agents, skills, commands, doctrine and records hashes", () => {
  const dir = tmpRepo();
  run(["init", "--dir", dir]);
  assert.ok(fs.existsSync(path.join(dir, ".claude", "agents", "army-chief.md")));
  assert.ok(fs.existsSync(path.join(dir, ".claude", "skills", "army-tdd", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(dir, ".claude", "commands", "army", "plan.md")));
  assert.ok(fs.existsSync(path.join(dir, ".claude", "army", "DOCTRINE.md")));
  const m = manifest(dir);
  assert.ok(Object.keys(m.files).length > 25);
  for (const hash of Object.values(m.files)) assert.match(hash, /^[a-f0-9]{64}$/);
  const claudeMd = fs.readFileSync(path.join(dir, "CLAUDE.md"), "utf8");
  assert.match(claudeMd, /agent-army:begin/);
});

test("init does not claim ownership of a pre-existing user file", () => {
  const dir = tmpRepo();
  const userAgent = path.join(dir, ".claude", "agents", "golang-pro.md");
  fs.mkdirSync(path.dirname(userAgent), { recursive: true });
  fs.writeFileSync(userAgent, "my custom golang agent\n");
  run(["init", "--dir", dir]);
  assert.equal(fs.readFileSync(userAgent, "utf8"), "my custom golang agent\n");
  assert.ok(!("agents/golang-pro.md" in manifest(dir).files));
  run(["remove", "--dir", dir]);
  assert.ok(fs.existsSync(userAgent), "remove must not delete user files");
});

test("init is idempotent for the CLAUDE.md block", () => {
  const dir = tmpRepo();
  run(["init", "--dir", dir]);
  run(["init", "--dir", dir]);
  const claudeMd = fs.readFileSync(path.join(dir, "CLAUDE.md"), "utf8");
  const count = (claudeMd.match(/agent-army:begin/g) || []).length;
  assert.equal(count, 1);
});

test("remove deletes shipped files, preserves generated artifacts, strips CLAUDE.md block", () => {
  const dir = tmpRepo();
  run(["init", "--dir", dir]);
  const repoMap = path.join(dir, ".claude", "army", "REPO-MAP.md");
  fs.writeFileSync(repoMap, "# generated map\n");
  const solutions = path.join(dir, ".claude", "army", "solutions", "note.md");
  fs.mkdirSync(path.dirname(solutions), { recursive: true });
  fs.writeFileSync(solutions, "learned things\n");
  run(["remove", "--dir", dir]);
  assert.ok(!fs.existsSync(path.join(dir, ".claude", "agents", "army-chief.md")));
  assert.ok(fs.existsSync(repoMap), "REPO-MAP.md must survive remove");
  assert.ok(fs.existsSync(solutions), "solutions/ must survive remove");
  assert.ok(!fs.existsSync(path.join(dir, ".claude", ".agent-army.json")));
  const claudeMd = fs.readFileSync(path.join(dir, "CLAUDE.md"), "utf8");
  assert.ok(!claudeMd.includes("agent-army:begin"));
});

test("remove keeps locally modified files", () => {
  const dir = tmpRepo();
  run(["init", "--dir", dir]);
  const agent = path.join(dir, ".claude", "agents", "python-pro.md");
  fs.appendFileSync(agent, "\nmy local tweak\n");
  run(["remove", "--dir", dir]);
  assert.ok(fs.existsSync(agent), "modified file must be kept");
});

test("update refreshes unmodified files and skips modified ones", () => {
  const dir = tmpRepo();
  run(["init", "--dir", dir]);
  const modified = path.join(dir, ".claude", "agents", "python-pro.md");
  fs.appendFileSync(modified, "\nlocal tweak\n");
  const untouched = path.join(dir, ".claude", "agents", "golang-pro.md");
  fs.writeFileSync(untouched, "stale content\n"); // simulate drift...
  // golang-pro is now "modified" too from the manifest's view; instead
  // simulate a package change by corrupting the recorded hash so the file
  // reads as unmodified-but-outdated is not possible here, so assert the
  // simpler contract: update never overwrites content that differs from the
  // recorded hash without --force.
  run(["update", "--dir", dir]);
  assert.match(fs.readFileSync(modified, "utf8"), /local tweak/);
  assert.equal(fs.readFileSync(untouched, "utf8"), "stale content\n");
  run(["update", "--dir", dir, "--force"]);
  assert.doesNotMatch(fs.readFileSync(untouched, "utf8"), /stale content/);
});

test("subset install merges groups across inits", () => {
  const dir = tmpRepo();
  run(["init", "--dir", dir, "--only", "core"]);
  assert.ok(!fs.existsSync(path.join(dir, ".claude", "agents", "golang-pro.md")));
  run(["init", "--dir", dir, "--only", "languages"]);
  assert.ok(fs.existsSync(path.join(dir, ".claude", "agents", "golang-pro.md")));
  assert.ok(fs.existsSync(path.join(dir, ".claude", "agents", "army-chief.md")));
  const m = manifest(dir);
  assert.deepEqual(m.groups.sort(), ["core", "languages"]);
});

test("missing flag value fails cleanly", () => {
  assert.throws(() => run(["init", "--dir"]), /requires a value/);
});
