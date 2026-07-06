// Table-driven tests for the two security-sensitive hook scripts.
const { test } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const GUARD = path.join(__dirname, "..", "scripts", "guard-pretool.sh");
const STOP = path.join(__dirname, "..", "scripts", "verify-stop.sh");

function runGuard(command) {
  const input = JSON.stringify({ tool_name: "Bash", tool_input: { command } });
  const out = execFileSync(GUARD, { input, encoding: "utf8" });
  return out.includes('"permissionDecision":"ask"');
}

test("guard asks on dangerous command variants (bypass attempts)", () => {
  const dangerous = [
    "rm -rf /",
    "rm -fr /",
    "rm -Rf /",
    "rm -r -f /",
    "rm --recursive --force /",
    "rm -rf ~",
    "git push --force origin main",
    "git push -f",
    "GIT PUSH --FORCE",
    "git reset --hard HEAD~3",
    "psql -c 'DROP TABLE users'",
    "psql -c 'Drop Table users'",
    "TRUNCATE TABLE orders",
    "kubectl delete deployment api",
    "kubectl  delete pod x",
    "terraform destroy -auto-approve",
    "npm publish",
    "databricks jobs delete 123",
    "databricks clusters permanent-delete abc",
    "databricks workspace rm /Repos/old --recursive",
  ];
  for (const cmd of dangerous) {
    assert.ok(runGuard(cmd), `should ask: ${cmd}`);
  }
});

test("guard passes benign commands including mentions in strings", () => {
  const benign = [
    "ls -la",
    "npm test",
    "git push origin main",
    "git push --force-with-lease origin feature",
    'grep -r "kubectl delete" ./docs',
    "echo do not run git push --force ever",
    "rm -rf ./node_modules",
    "rm -rf /tmp/build-cache",
    "cat notes.md",
    "databricks jobs list",
    "databricks clusters get abc",
    "echo databricks jobs delete is dangerous",
  ];
  for (const cmd of benign) {
    assert.ok(!runGuard(cmd), `should pass: ${cmd}`);
  }
});

function runStop(cwd, input) {
  try {
    execFileSync(STOP, { input, encoding: "utf8", cwd });
    return { code: 0 };
  } catch (e) {
    return { code: e.status, stderr: String(e.stderr) };
  }
}

test("verify-stop: no script passes, failing blocks, guard flag releases, passing passes", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "army-stop-"));
  assert.equal(runStop(dir, "{}").code, 0, "no verify.sh -> allow stop");

  const verify = path.join(dir, ".claude", "army", "verify.sh");
  fs.mkdirSync(path.dirname(verify), { recursive: true });
  fs.writeFileSync(verify, "#!/bin/sh\necho '2 tests failed'\nexit 1\n", { mode: 0o755 });

  const failing = runStop(dir, "{}");
  assert.equal(failing.code, 2, "failing verify.sh -> block stop");
  assert.match(failing.stderr, /Do not declare done/);
  assert.ok(
    fs.existsSync(path.join(dir, ".claude", "army", "telemetry.jsonl")),
    "block is logged to telemetry"
  );

  assert.equal(
    runStop(dir, '{ "stop_hook_active" :  true }').code,
    0,
    "loop guard releases even with odd spacing"
  );

  fs.writeFileSync(verify, "#!/bin/sh\nexit 0\n", { mode: 0o755 });
  assert.equal(runStop(dir, "{}").code, 0, "passing verify.sh -> allow stop");
});
