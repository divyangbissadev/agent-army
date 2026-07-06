---
description: Work the active change folder's task ledger to completion, one disciplined task at a time
argument-hint: [change slug, defaults to the single active change]
---

Target: $ARGUMENTS (if empty, look in .claude/army/changes/ for the single
active change folder; if several are active, list them and ask which one).

Gate first: run `node .claude/army/scripts/validate-change.mjs <folder>`;
fix findings (including missing approval) before any task starts.

Drive the ledger loop until done or genuinely blocked:

1. Read the change folder's tasks.md. Pick the first unchecked task. Ensure
   the working tree is clean (commit or stash) so every task starts from a
   known-good point.
2. Execute it with full discipline: failing test from its scenario first
   (army-tdd), minimum implementation, green with output quoted, tick the
   checkbox and commit in the same step. On unrecoverable mess, reset to the
   last task boundary instead of digging.
3. Every third task or at any risky diff, run /army:review on the accumulated
   diff; fix blockers before continuing.
4. Repeat from step 1. Between tasks, report one line only: task done, boxes
   remaining.
5. Loop exit conditions, in priority order:
   - Blocked: a task needs information or a decision only the user has. Stop,
     state exactly what is needed and what remains.
   - Failing: the same task has failed twice with root cause unclear. Switch
     to army-debugging; if still unclear, stop and report the evidence map.
   - Done: all boxes ticked. Run the full affected test suite, /army:review
     on the whole diff, then archive per army-spec and run /army:compound.
     If the repo ships through no-mistakes, push via its pipeline rather
     than raw git.

For unattended runs (user away or overnight): if gnhf is installed, offer to
hand this same tasks.md ledger to it instead of looping in-session; gnhf
iterates with commit-or-rollback per task and the ledger stays the shared
source of truth. Parallel slices touching overlapping files get separate git
worktrees.

Never tick a box ahead of reality, never weaken a test to keep the loop
moving, and never exit silently: the last message names which exit happened,
and each exit is logged via
`node .claude/army/scripts/log-dispatch.mjs loop-exit result=<done|blocked|failing>`.
