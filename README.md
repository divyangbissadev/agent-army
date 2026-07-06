# agent-army

An elite, pluggable team of software engineering agents, skills, and commands
for [Claude Code](https://claude.com/claude-code): 19 specialist agents, 24
skills (15 army doctrine skills plus 9 vendored from Matt Pocock's skills
collection), and 7 slash commands. The team operates on TDD,
domain-driven design, spec-driven changes, root-cause debugging, and a
compounding-knowledge loop, with hard token-frugality rules so accuracy stays
ultimate and cost stays low.

Two install paths, same content:

## Install as a Claude Code plugin (recommended)

```
/plugin marketplace add dbissa94/agent-army
/plugin install army
```

Plugin mode adds a SessionStart hook that injects a compact doctrine
bootstrap into every session, so the workflow self-triggers.

## Install into a repo with npx (file copies, shared via git)

```bash
npx @dbissa/agent-army init          # after npm publish
npx /path/to/agent-army init         # from a local clone, works today
```

```bash
npx @dbissa/agent-army init --only core,languages   # subset of groups
npx @dbissa/agent-army init --dir ../other-repo     # install elsewhere
npx @dbissa/agent-army list                          # roster
npx @dbissa/agent-army update                        # refresh; skips files you modified
npx @dbissa/agent-army remove                        # clean uninstall
```

Safety model: a manifest records only files the tool actually wrote, with
content hashes. Pre-existing same-named files are never claimed or deleted.
`update` skips locally modified files unless you pass `--force`. `remove`
deletes only unmodified files it installed, strips its CLAUDE.md block, and
always preserves generated artifacts (REPO-MAP.md, changes/, solutions/).

## Quickstart: your first session

1. Install (either path above), then open Claude Code in your repo.
2. `/army:map` builds `.claude/army/REPO-MAP.md`: the one-time repo analysis
   every agent reads instead of exploring. Takes a few minutes on a large
   repo; commit the map to git so your whole team's sessions share it.
   repo-analyst will also propose a `.claude/army/verify.sh`; accept it to
   arm the done-gate (plugin mode blocks "done" while it fails).
3. Give the army real work through the front door:

   ```
   /army:go users report the export button 500s on large reports
   ```

   Intake classifies it (this one is a bug), prints its dispatch decision,
   and runs the matching flow: reproduce first, failing test, root-cause
   fix, review. A feature request instead triggers the interview, spec,
   plan-approval, and task-loop chain, and you approve at each gate.
4. After a meaty effort, `/army:compound` writes what was learned to
   `.claude/army/solutions/` so the next session starts smarter.

## Which command when

| You have...                          | Reach for                          |
|--------------------------------------|-------------------------------------|
| Anything, and you want it routed      | `/army:go <describe it>`           |
| A new or changed repo                 | `/army:map`                        |
| A feature idea worth a written spec   | `/army:spec <feature>`             |
| An approved change to grind through   | `/army:loop`                       |
| A diff you want gated before merge    | `/army:review`                     |
| A finished effort worth learning from | `/army:compound`                   |

`/army:go` subsumes the rest; the individual commands exist for when you
want to enter the flow at a specific point. You can also address any agent
directly ("use the k8s-architect to fix the OOMKills").

## The workflow

One front door: give `/army:go <anything>` a problem statement and the
army-intake skill classifies it (bug, incident, feature, small change,
refactor, question, ops, docs, ambiguous), picks the ceremony tier, prints
its dispatch decision, and executes the matching flow. Ceremony scales with
the change: trivial edits just happen; one-behavior changes get TDD plus
review; feature-scale work runs the full loop:

```
/army:go X       triage any request and run the right flow end to end
/army:map        repo-analyst analyzes the entire repo once and writes
                 .claude/army/REPO-MAP.md; every agent reads the map instead
                 of exploring (claims tagged verified/inferred)
/army:spec X     change folder: proposal, SHALL requirements with testable
                 scenarios, checkbox task ledger (OpenSpec-compatible-lite;
                 defers to OpenSpec or spec-kit if installed)
/army:plan X     army-chief returns a sliced battle plan (owners, order,
                 parallel groups); you approve; the main session dispatches
/army:loop       work the change folder's task ledger to completion, one
                 disciplined task at a time, until done or blocked
/army:review     code-reviewer gates the diff: concrete failure scenarios
                 or PASS; high-stakes diffs escalate to cross-vendor review
                 (army-cross-review: a different model vendor reviews blind)
/army:compound   retro writes solution notes future planning reads first,
                 so every effort makes the next one cheaper
```

Gates are non-negotiable: failing test first (army-tdd), root cause before
fix (army-debugging), DDD where domain logic lives (army-ddd), and done is
never claimed without quoting a real command run.

The human stays in the loop by doctrine, not by luck: seven mandatory gates
(the intake clarifying question, mp-grilling requirement extraction before
specs, proposal approval, plan approval, the loop's stop-and-ask blocked
exit, escalation of review ties, and approval of any memory writes). Between
gates the army works without asking; approval at one gate never covers the
next. Allied tools are used when detected: no-mistakes for shipping, gnhf
for unattended ledger runs, git worktrees for parallel slices.

Done is also mechanically enforced (plugin mode): create an executable
`.claude/army/verify.sh` in your repo (repo-analyst offers to generate it
from the discovered test and lint commands) and the shipped Stop hook blocks
the agent from finishing while that script fails.

## The roster

| Group        | Agents                                                                     |
|--------------|----------------------------------------------------------------------------|
| core         | army-chief, repo-analyst, code-reviewer, docs-writer                       |
| engineering  | frontend-architect, backend-engineer, domain-modeler, data-engineer, ai-engineer, qa-engineer, security-engineer |
| languages    | golang-pro, python-pro, java-architect, typescript-pro                     |
| platform     | devops-engineer, k8s-architect                                             |
| product      | product-manager, scrum-master                                              |

The ai-engineer deserves a note: it masters LangGraph, LangChain, LangSmith,
and Langfuse for building any LLM solution (agents, RAG, workflows), with
evals as the test suite, tracing from day one, and a standing rule to verify
current framework APIs against live docs before writing code, since that
ecosystem churns monthly.

Skills: army-intake, army-tdd, army-ddd, army-debugging, army-spec,
army-compound, army-cross-review, army-judge (rubric-scored LLM-as-judge
for fuzzy outcomes), army-tool-design (agent-facing tool UX standards),
army-repo-map, army-frugal-context, army-eng-wisdom (the distilled canon:
Kleppmann, Ousterhout, Beck, Evans, Nygard, Fowler, Feathers, Bloch,
Forsgren), army-review-standards, army-system-design, army-docs-standards.

Pocock pack (vendored from [mattpocock/skills](https://github.com/mattpocock/skills),
MIT, namespaced `mp-` to avoid collisions, see THIRD-PARTY-NOTICES.md):
mp-grilling and mp-grill-with-docs (relentless requirement interviews, the
docs variant maintains CONTEXT.md and ADRs inline), mp-domain-modeling
(living glossary), mp-codebase-design (Ousterhout deep-modules vocabulary and
design-it-twice), mp-improve-codebase-architecture (deepening scans),
mp-prototype (throwaway prototypes to answer design questions), mp-research,
mp-handoff (session handoff docs), mp-writing-great-skills (author new
skills). His tdd, diagnosing-bugs, and code-review skills are intentionally
not vendored: the army's own gates cover them, and duplicate triggers cause
conflicts. Division of labor is written into DOCTRINE.md: army skills win for
gates, mp skills win for discovery.

## Harness engineering

The workflow is measured and enforced, not just prompted:

- **Routing evals**: `eval/intake-cases.jsonl` holds 30 labeled problem
  statements. `npm run eval:list` prints them unlabeled; have a fresh
  session classify each with the army-intake rubric, then
  `npm run eval:score answers.jsonl` grades deterministically with an 85%
  gate. Run before shipping any change to the intake skill or routing.
- **Outcome evals**: `npm run e2e` lists fixture tasks (a bug fix, a
  test-first feature, a code question). `run-e2e.mjs prepare` copies the
  fixture, the agent under test works TASK.md, and `run-e2e.mjs check`
  delivers a deterministic verdict: green suites with original assertions
  intact, requirement cases plus TDD evidence, or an untouched tree for
  question tasks. Cheating (weakened tests, missing tests, drive-by edits)
  fails. Fuzzy outcomes hand off to a RUBRIC.md scored via army-judge.
- **LLM-as-judge**: the army-judge skill scores what tests cannot (docs,
  plans, explanations) against written rubrics with anchored scales,
  quoted-evidence requirements, and blind fresh-context judges.
- **Telemetry**: intake decisions, loop exits, verify-hook blocks, and
  discovered misroutes append to `.claude/army/telemetry.jsonl` via
  `log-dispatch.mjs`. Retros read it; repeated misroutes become new eval
  cases.
- **Validators**: `validate-change.mjs` machine-checks every change folder
  (spec deltas present, requirements have scenarios, tasks well-formed, and
  a written `Status: approved` before any work), gating /army:loop.
- **Instruction budget**: the test suite enforces hard caps (doctrine 200
  lines, agents 90, skills 120, descriptions 30 words, session bootstrap 30
  lines). Adding a rule over cap fails CI until something is deleted.
- **Blast-radius guard** (plugin mode): force-push, hard reset, rm -rf,
  destructive SQL, kubectl delete, terraform destroy, and publishes are
  downgraded to an explicit permission ask.
- **Trust boundaries**: doctrine marks all repo-read content as data, never
  command; embedded instructions are reported, not followed; agent-written
  artifacts are re-verified before high-stakes use.
- **Recovery**: /army:loop commits at every task boundary, so a crashed
  session resumes from the ledger plus a known-good tree.

## Design notes

- Agents cannot spawn agents in Claude Code, so all orchestration lives in
  the main session; army-chief returns plans, the session dispatches them.
- Subagent economics are doctrine: 3 to 5 concurrent max, scoped briefs,
  summary returns, and no subagent where a grep would do.
- Ecosystem-aware: if OpenSpec, spec-kit, or superpowers is present, the
  overlapping army flows stand down instead of duplicating.
- Zero runtime dependencies; the CLI is one Node file with a real test suite
  (`npm test`).
- Frugality is bounded by an accuracy override: when correctness is at
  stake, agents spend the tokens.

## Development

```bash
npm test                                # CLI test suite (node --test)
node bin/cli.js init --dir /tmp/x       # manual e2e
```

Agents live in `agents/`, skills in `skills/`, commands in `commands/`,
the constitution in `army/DOCTRINE.md`. Adding an agent: drop a file in
`agents/`, add it to a group in `bin/cli.js`.

## License

MIT
