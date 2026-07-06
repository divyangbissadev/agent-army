#!/usr/bin/env node
/**
 * agent-army: install an elite team of Claude Code agents, skills, and
 * commands into any repo.
 *
 * Usage:
 *   npx @dbissa/agent-army init [--dir <path>] [--only <groups>] [--force]
 *   npx @dbissa/agent-army list
 *   npx @dbissa/agent-army update [--dir <path>] [--force]
 *   npx @dbissa/agent-army remove [--dir <path>]
 *   npx @dbissa/agent-army help | version
 *
 * Groups: core, engineering, languages, platform, product, all (default: all)
 *
 * Safety model: the manifest (.claude/.agent-army.json) records only files
 * this tool actually wrote, with content hashes. update skips files you have
 * modified; remove deletes only unmodified files it installed and never
 * touches generated artifacts (REPO-MAP.md, PLAN.md, changes/, solutions/).
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const MANIFEST_NAME = ".agent-army.json";
const VERSION = require(path.join(ROOT, "package.json")).version;
const BEGIN_MARK = "<!-- agent-army:begin -->";
const END_MARK = "<!-- agent-army:end -->";

const GROUPS = {
  core: ["army-chief", "repo-analyst", "code-reviewer", "docs-writer"],
  engineering: [
    "frontend-architect",
    "backend-engineer",
    "domain-modeler",
    "data-engineer",
    "ai-engineer",
    "graphql-architect",
    "qa-engineer",
    "security-engineer",
  ],
  languages: ["golang-pro", "python-pro", "java-architect", "typescript-pro"],
  platform: ["devops-engineer", "k8s-architect"],
  databricks: ["databricks-engineer", "databricks-platform"],
  product: ["product-manager", "scrum-master"],
};

function skillNames() {
  return fs
    .readdirSync(path.join(ROOT, "skills"), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function commandNames() {
  return fs
    .readdirSync(path.join(ROOT, "commands"))
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function parseArgs(argv) {
  const args = { _: [], only: null, dir: process.cwd(), force: false };
  const needsValue = ["--only", "--dir"];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (needsValue.includes(a)) {
      const v = argv[i + 1];
      if (v === undefined || v.startsWith("--")) {
        console.error(`${a} requires a value`);
        process.exit(1);
      }
      i++;
      if (a === "--only") args.only = v;
      else args.dir = path.resolve(v);
    } else if (a === "--force") args.force = true;
    else if (a === "--help" || a === "-h") args._.unshift("help");
    else if (a === "--version" || a === "-v") args._.unshift("version");
    else args._.push(a);
  }
  return args;
}

function groupsToAgents(groupList) {
  const agents = [];
  for (const g of groupList) {
    if (g === "all") return Object.values(GROUPS).flat();
    if (!GROUPS[g]) {
      console.error(
        `Unknown group: ${g}. Valid: ${Object.keys(GROUPS).join(", ")}, all`
      );
      process.exit(1);
    }
    agents.push(...GROUPS[g]);
  }
  return [...new Set(agents)];
}

function loadManifest(claudeDir) {
  const p = path.join(claudeDir, MANIFEST_NAME);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    console.error(
      `warning: ${MANIFEST_NAME} is corrupt; treating as fresh install (group scoping and file ownership will be rebuilt)`
    );
    return { corrupt: true, groups: [], files: {} };
  }
}

function saveManifest(claudeDir, manifest) {
  fs.mkdirSync(claudeDir, { recursive: true });
  fs.writeFileSync(
    path.join(claudeDir, MANIFEST_NAME),
    JSON.stringify(manifest, null, 2) + "\n"
  );
}

/**
 * Install one file. Returns "installed" | "updated" | "skipped-exists" |
 * "skipped-modified". Only "installed"/"updated" get recorded by the caller.
 */
function installFile(src, dest, { force, ownedHash }) {
  const content = fs.readFileSync(src);
  if (fs.existsSync(dest)) {
    const current = fs.readFileSync(dest);
    const identical = sha256(current) === sha256(content);
    // A pre-existing file we never wrote stays the user's, even when it is
    // byte-identical to our template; adopting it would let remove delete it.
    if (identical) return ownedHash ? "installed" : "skipped-exists";
    if (ownedHash && sha256(current) === ownedHash) {
      fs.writeFileSync(dest, content);
      return "updated"; // we wrote it last, safe to refresh
    }
    if (!force) return ownedHash ? "skipped-modified" : "skipped-exists";
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
  return "installed";
}

/** Enumerate files under a template dir, relative paths. */
function walk(dir, base = dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, base));
    else out.push(path.relative(base, p));
  }
  return out;
}

/** Build the full source->dest plan for a group selection. */
function buildPlan(agents) {
  const plan = []; // {src, rel} where rel is relative to .claude/
  for (const name of agents) {
    const src = path.join(ROOT, "agents", `${name}.md`);
    if (fs.existsSync(src)) plan.push({ src, rel: path.join("agents", `${name}.md`) });
    else console.error(`  missing template: ${name} (packaging bug, skipping)`);
  }
  for (const skill of skillNames()) {
    const dir = path.join(ROOT, "skills", skill);
    for (const rel of walk(dir)) {
      plan.push({ src: path.join(dir, rel), rel: path.join("skills", skill, rel) });
    }
  }
  for (const cmd of commandNames()) {
    plan.push({
      src: path.join(ROOT, "commands", cmd),
      rel: path.join("commands", "army", cmd),
    });
  }
  const armyDir = path.join(ROOT, "army");
  for (const rel of walk(armyDir)) {
    plan.push({ src: path.join(armyDir, rel), rel: path.join("army", rel) });
  }
  return plan;
}

function ensureClaudeMdBlock(targetDir) {
  const block = [
    BEGIN_MARK,
    "## Agent Army",
    "",
    "This repo has the agent-army installed (.claude/agents, .claude/skills,",
    "/army:* commands). Doctrine and routing table: @.claude/army/DOCTRINE.md",
    "For multi-file tasks: ensure .claude/army/REPO-MAP.md is fresh (repo-analyst",
    "builds it), get a plan from army-chief, dispatch specialists from the main",
    "session, gate diffs through code-reviewer. TDD and root-cause fixes are",
    "non-negotiable; check .claude/army/solutions/ before planning.",
    END_MARK,
  ].join("\n");
  const claudeMd = path.join(targetDir, "CLAUDE.md");
  if (fs.existsSync(claudeMd)) {
    const content = fs.readFileSync(claudeMd, "utf8");
    if (content.includes(BEGIN_MARK)) {
      if (!content.includes(END_MARK)) {
        // Malformed (truncated or stray begin marker): repair by replacing
        // the dangling marker with the full block.
        fs.writeFileSync(claudeMd, content.replace(BEGIN_MARK, block));
        return "repaired";
      }
      const updated = content.replace(
        new RegExp(`${BEGIN_MARK}[\\s\\S]*?${END_MARK}`),
        block
      );
      if (updated !== content) fs.writeFileSync(claudeMd, updated);
      return "refreshed";
    }
    fs.appendFileSync(claudeMd, "\n" + block + "\n");
    return "appended";
  }
  fs.writeFileSync(claudeMd, "# Project instructions\n\n" + block + "\n");
  return "created";
}

function removeClaudeMdBlock(targetDir) {
  const claudeMd = path.join(targetDir, "CLAUDE.md");
  if (!fs.existsSync(claudeMd)) return;
  const content = fs.readFileSync(claudeMd, "utf8");
  if (!content.includes(BEGIN_MARK)) return;
  const updated = (content.includes(END_MARK)
    ? content.replace(new RegExp(`\\n?${BEGIN_MARK}[\\s\\S]*?${END_MARK}\\n?`), "\n")
    : content.replace(BEGIN_MARK, "")
  ).replace(/\n{3,}$/, "\n");
  fs.writeFileSync(claudeMd, updated);
}

function cmdInit(args, { quiet = false } = {}) {
  const targetDir = args.dir;
  const claudeDir = path.join(targetDir, ".claude");
  const prior = loadManifest(claudeDir) || { groups: [], files: {} };
  const groupList = args.only
    ? args.only.split(",").map((g) => g.trim()).filter(Boolean)
    : ["all"];
  const mergedGroups = [...new Set([...(prior.groups || []), ...groupList])];
  const agents = groupsToAgents(mergedGroups.includes("all") ? ["all"] : mergedGroups);
  const plan = buildPlan(agents);
  const files = { ...(prior.files || {}) };
  const counts = { installed: 0, updated: 0, "skipped-exists": 0, "skipped-modified": 0 };

  if (!quiet) console.log(`\nagent-army v${VERSION}\nTarget: ${targetDir}\n`);

  for (const { src, rel } of plan) {
    const dest = path.join(claudeDir, rel);
    const status = installFile(src, dest, {
      force: args.force,
      ownedHash: files[rel],
    });
    counts[status]++;
    if (status === "installed" || status === "updated" || args.force) {
      files[rel] = sha256(fs.readFileSync(dest));
    }
    if (!quiet && status !== "installed") console.log(`  ${status.padEnd(16)} ${rel}`);
  }

  const pointer = ensureClaudeMdBlock(targetDir);
  saveManifest(claudeDir, {
    version: VERSION,
    installedAt: new Date().toISOString(),
    groups: mergedGroups,
    files,
  });

  if (!quiet) {
    console.log(
      `\nDone. ${counts.installed + counts.updated} files written` +
        (counts["skipped-exists"] ? `, ${counts["skipped-exists"]} pre-existing kept` : "") +
        (counts["skipped-modified"] ? `, ${counts["skipped-modified"]} locally modified kept (use --force to overwrite)` : "") +
        `. CLAUDE.md pointer ${pointer}.`
    );
    console.log(`Try: /army:map  then  /army:plan <task>\n`);
  }
  return counts;
}

function cmdList() {
  console.log(`\nagent-army v${VERSION}\n`);
  for (const [group, agents] of Object.entries(GROUPS)) {
    console.log(`${group}:`);
    for (const a of agents) {
      const src = path.join(ROOT, "agents", `${a}.md`);
      let desc = "";
      if (fs.existsSync(src)) {
        const m = fs.readFileSync(src, "utf8").match(/^description:\s*(.+)$/m);
        if (m) desc = m[1].split(".")[0];
      }
      console.log(`  ${a.padEnd(20)} ${desc}`);
    }
  }
  console.log(`\nskills:   ${skillNames().join(", ")}`);
  console.log(`commands: ${commandNames().map((c) => "/army:" + c.replace(/\.md$/, "")).join(", ")}`);
  console.log(`\nAlso installable as a Claude Code plugin: /plugin marketplace add divyangbissadev/agent-army\n`);
}

function cmdUpdate(args) {
  const claudeDir = path.join(args.dir, ".claude");
  const manifest = loadManifest(claudeDir);
  if (!manifest) {
    console.error("No agent-army install found here. Run: npx @dbissa/agent-army init");
    process.exit(1);
  }
  if (manifest.corrupt) {
    console.error("update proceeding as re-init due to corrupt manifest");
    cmdInit({ ...args, only: null });
    return;
  }
  // Prune files we own that no longer ship, only if unmodified.
  const agents = groupsToAgents(
    (manifest.groups || ["all"]).includes("all") ? ["all"] : manifest.groups
  );
  const shipped = new Set(buildPlan(agents).map((p) => p.rel));
  for (const [rel, hash] of Object.entries(manifest.files || {})) {
    if (shipped.has(rel)) continue;
    const p = path.join(claudeDir, rel);
    if (fs.existsSync(p) && sha256(fs.readFileSync(p)) === hash) {
      fs.unlinkSync(p);
      console.log(`  pruned           ${rel}`);
    } else if (fs.existsSync(p)) {
      console.log(`  kept (modified)  ${rel} (no longer shipped)`);
    }
    delete manifest.files[rel];
  }
  saveManifest(claudeDir, manifest);
  cmdInit({ ...args, only: null });
}

function cmdRemove(args) {
  const claudeDir = path.join(args.dir, ".claude");
  const manifest = loadManifest(claudeDir);
  if (!manifest) {
    console.error("No agent-army install found here.");
    process.exit(1);
  }
  let removed = 0,
    kept = 0;
  for (const [rel, hash] of Object.entries(manifest.files || {})) {
    const p = path.join(claudeDir, rel);
    if (!fs.existsSync(p)) continue;
    if (sha256(fs.readFileSync(p)) === hash) {
      fs.unlinkSync(p);
      removed++;
    } else {
      console.log(`  kept (locally modified): ${rel}`);
      kept++;
    }
  }
  // Clean now-empty directories we may have created; generated artifacts
  // (REPO-MAP.md, PLAN.md, changes/, solutions/, domain briefs) survive.
  for (const dir of ["agents", "skills", path.join("commands", "army"), "commands", "army"]) {
    const p = path.join(claudeDir, dir);
    try {
      if (fs.existsSync(p) && fs.readdirSync(p).length === 0) fs.rmdirSync(p);
    } catch {}
  }
  fs.unlinkSync(path.join(claudeDir, MANIFEST_NAME));
  removeClaudeMdBlock(args.dir);
  console.log(
    `agent-army removed: ${removed} files deleted, ${kept} modified files kept. ` +
      `Generated artifacts under .claude/army/ (REPO-MAP.md, changes/, solutions/) were preserved.`
  );
}

function cmdHelp() {
  console.log(`
agent-army v${VERSION}: elite Claude Code engineering agents, skills, and commands.

Usage:
  npx @dbissa/agent-army init   [--dir <path>] [--only <groups>] [--force]
  npx @dbissa/agent-army list
  npx @dbissa/agent-army update [--dir <path>] [--force]
  npx @dbissa/agent-army remove [--dir <path>]
  npx @dbissa/agent-army help | version

Groups: ${Object.keys(GROUPS).join(", ")}, all (default: all)

Or install as a Claude Code plugin instead of file copies:
  /plugin marketplace add divyangbissadev/agent-army
  /plugin install army
`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0] || "help";

switch (cmd) {
  case "init":
    cmdInit(args);
    break;
  case "list":
    cmdList();
    break;
  case "update":
    cmdUpdate(args);
    break;
  case "remove":
    cmdRemove(args);
    break;
  case "version":
    console.log(VERSION);
    break;
  case "help":
    cmdHelp();
    break;
  default:
    console.error(`Unknown command: ${cmd}. Use init | list | update | remove | help`);
    process.exit(1);
}
