#!/bin/sh
# SessionStart hook: inject a compact agent-army bootstrap into context.
# Superpowers pattern: make the doctrine self-triggering without the user
# having to remember it. Keep this output small; it is paid every session.

cat <<'EOF'
Agent Army is active in this session.

Operating rules (full law in the army skills and, if installed in this repo,
.claude/army/DOCTRINE.md):
- Intake first: for any incoming request, classify it per the army-intake
  skill (or /army:go) and commit to the matching flow before acting.
- Scale ceremony to the change: trivial edit -> just do it; one behavior ->
  TDD + review; feature-scale -> /army:spec then /army:plan then /army:loop.
- Before multi-file work, ensure .claude/army/REPO-MAP.md is fresh
  (/army:map); brief agents from the map, never let them explore raw.
- Check .claude/army/solutions/ for prior learnings before planning; run
  /army:compound after significant efforts.
- Non-negotiable: failing test first (army-tdd), root cause before fix
  (army-debugging), never claim done without quoting a real command run.
- Subagents: 3-5 concurrent max, scoped briefs, summary returns.
- Human gates are mandatory: grill requirements (mp-grilling) before specs,
  approval before implementation, approval before slice dispatch, stop and
  ask at blockers. Between gates, work without asking.
- Allied tools when installed: ship via no-mistakes, hand overnight ledgers
  to gnhf, isolate parallel slices in git worktrees.
- If OpenSpec, spec-kit, or superpowers is installed, defer to their
  overlapping flows.
EOF
