# Using agent-army effectively

This is the operator's guide: how to set up a repo, how to drive the
harness day to day, what to do at each gate, and the habits that make the
army compound instead of just execute. The README covers what it is; this
covers how to work with it well.

## The mental model (60 seconds)

- Your main Claude Code session is the commander. Agents are stateless
  specialists it dispatches; they cannot talk to each other or spawn more
  agents, so everything routes through the session you are typing into.
- Skills are law, agents are roles, commands are entry points. The doctrine
  (`.claude/army/DOCTRINE.md`) binds all of them.
- The army remembers through files, not vibes: REPO-MAP.md (what the repo
  is), changes/ (what is being built, with a checkbox ledger), solutions/
  (what was learned), user-patterns.md (how you phrase things), and
  optionally a live code graph. Commit these; they are team state.
- Autonomy runs between human gates, never through them. You approve
  proposals and plans; you are asked exactly one question when two readings
  differ and the stakes matter; otherwise the army works without asking.

## One-time setup per repo

1. Install. Plugin mode (`/plugin marketplace add divyangbissadev/agent-army`,
   `/plugin install army`) gives you hooks: the session bootstrap, the
   blast-radius guard, and the done-gate. npx mode
   (`npx @divyangbissadev/agent-army init`) writes files into `.claude/`
   that you commit, so teammates get the army through git with no installs.
   Teams often use both: npx for the shared repo files, plugin for hooks.
2. `/army:map`. Let repo-analyst build REPO-MAP.md, then skim it yourself:
   correct anything wrong now, because every agent will trust it. Commit it.
3. Arm the done-gate. Accept the `verify.sh` repo-analyst proposes (or
   write your own: tests, lint, types, exit non-zero on failure, fast).
   In plugin mode the army is now mechanically unable to declare done while
   it fails.
4. Optional second brain. Install codebase-memory-mcp (MIT, one binary) and
   structural questions stop costing exploration. Worth it from roughly
   "medium codebase" upward.

## Daily driving

Route everything through the front door:

```
/army:go <whatever you have, rough or polished>
```

You will see up to three lines before work starts, and they are your
steering wheel:

- `LENS: ...` is how your prompt was interpreted (only shown when it was
  enhanced). Wrong? Say so immediately; the correction is finished AND
  learned, so the same misreading does not happen twice.
- `INTAKE: <type> | tier | difficulty` plus `Route:` is the dispatch
  decision. A wrong classification caught here costs one message; caught
  after implementation it costs the implementation.
- `Assumption: ...` is the interpretation being committed to. Silence is
  consent; object now, not at review.

What each flow feels like:

- **Bug**: expect a reproducing test before any fix. If you know the
  trigger, say it in the first message; it saves the longest step.
- **Feature**: expect to be interviewed (one question at a time, each with
  a recommended answer; accepting the recommendation is one word). Then
  approve the proposal, approve the plan, and let /army:loop grind the
  ledger. Feature work survives session death: the checkbox ledger plus
  per-task commits mean any new session resumes exactly where the last
  stopped.
- **Question**: you get an answer, never a surprise pull request.
- **Incident**: mitigation first, ceremony after; expect speed.

## What to do at each gate (your part of the contract)

1. **The one question**: answer it; it is only asked when the readings
   genuinely diverge and being wrong is expensive.
2. **Grilling**: the quality ceiling of the whole feature is set here.
   Short honest answers beat long speculative ones; "I do not care, you
   pick" is a legitimate answer and gets recorded as such.
3. **Proposal approval**: read the one screen. Check What Does NOT Change
   hardest; scope creep hides there. Approval is recorded as a
   `Status: approved` line the validator physically checks.
4. **Plan approval**: check the slice order and the NOT DOING line. If a
   slice's proving test looks wrong, the slice is wrong.
5. **Loop blocked-exit**: it stops and tells you exactly what it needs.
   Answer just that; do not restate the task.
6. **Review disputes**: you get both positions in two lines; pick one.
7. **Memory writes**: CLAUDE.md additions are proposed, never applied.
   Between gates, do not expect permission requests; that is what your
   approval bought. If it asks anyway, that is a defect worth noting.

## Habits that make it compound

- **Give outcomes, not implementations.** "Users need CSV export" routes
  and grills better than "add a button that calls /export". The army is
  built to extract the how; feeding it a how skips its best machinery.
- **Correct early and once.** Every lens correction, review dispute, and
  misroute becomes stored pattern, eval case, or solution note. The
  hundredth session should feel noticeably sharper than the first, but
  only if corrections happen out loud.
- **Run /army:compound after anything that hurt.** Thirty seconds of retro
  converts three hours of debugging into a note the next session greps in
  two.
- **Keep the map honest.** After big merges or refactors, `/army:map`
  refreshes incrementally. A stale map quietly degrades every dispatch.
- **Escalate review deliberately.** /army:review for everything
  non-trivial; ask for cross-vendor review (army-cross-review) on
  security, data, or hard-to-reverse diffs. Say "high stakes" and it
  happens.
- **Use allied tools where they fit.** Overnight work: hand the ledger to
  gnhf. Parallel slices: separate git worktrees. Shipping: no-mistakes
  pipeline if the repo is configured.
- **Watch the telemetry occasionally.** `.claude/army/telemetry.jsonl` is
  the harness's honesty log: misroutes, verify-blocks, loop exits. Retros
  read it, but a human glance sometimes spots drift earlier.

## Extending the army

- New agent: drop a file in `agents/`, add it to a group in `bin/cli.js`.
  The budget tests will bounce anything over 90 lines or with a
  description over 30 words; trim, do not raise caps.
- New skill: `skills/<name>/SKILL.md`, under 120 lines, trigger-phrased
  description, reference files loaded on demand.
- Changing intake or doctrine routing: run the eval before shipping.
  `npm run eval:list` in a FRESH session, classify, `npm run eval:score`.
  The recorded baseline is 30/30; below the 85% gate means do not ship.
- Changing the workflow itself: the e2e harness (`npm run e2e`) checks
  outcomes: prepare a fixture, run the flow, `check` verdicts it, with
  anti-cheat for weakened tests and drive-by edits.
- Vendor third-party skills only with a real license check: MIT-style gets
  namespaced and attributed (see THIRD-PARTY-NOTICES.md); proprietary gets
  referenced, never copied.

## Troubleshooting

| Symptom | Likely cause and fix |
|---------|----------------------|
| /army:* commands missing | Plugin: run /reload-plugins. npx: commands live in .claude/commands/army/, check the install ran. |
| Done-gate never fires | Hooks are plugin-mode only, and verify.sh must exist and be executable in .claude/army/. |
| Loop refuses to start | The validator wants a `Status: approved` line in proposal.md; that is the human gate working. |
| Agents exploring instead of using the map | REPO-MAP.md missing or stale; run /army:map. |
| Guard asks about a harmless command | It anchors on command position, so this is rare; note the false positive and continue, or adjust scripts/guard-pretool.sh. |
| Wrong flow chosen | Say so; the misroute is logged and becomes an eval case at the next retro. |
| Same misunderstanding twice | The pattern was not recorded; state it explicitly ("when I say X I mean Y") and the lens stores it. |

## One worked example

```
/army:go build the backend for the ops dashboard, graphql, needs to show
order volume and error rates per region, data lives in databricks
```

What happens: the lens normalizes it; intake classifies feature-scale and
routes graphql-architect plus databricks-engineer; mp-grilling asks you
about time grains, freshness, and consumers one question at a time; a spec
change folder appears for your approval; army-chief slices it (SDL contract
first, walking skeleton, read models in Databricks, resolvers, security
phase, deploy, docs per army-graphql-e2e); you approve the plan;
/army:loop implements task by task with commits at each boundary; reviews
gate the diffs; the done-gate holds until verify.sh passes; compound
records what was learned. Your total hands-on time: the interview and two
approvals.
