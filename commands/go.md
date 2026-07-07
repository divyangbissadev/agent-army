---
description: The army's front door. Triage any problem statement, pick the right flow and agents, and get it done.
argument-hint: <any problem statement, task, question, or incident>
---

Request: $ARGUMENTS

0. Lens first (skill army-prompt-lens): if the request is terse, garbled,
   or uses known shorthand, enhance it using .claude/army/user-patterns.md
   and session context, print the `LENS:` line, and proceed on the enhanced
   prompt. Well-formed requests pass through untouched. Corrections the
   user makes become learned patterns.

Run the army-intake skill on the (possibly enhanced) request:

1. Classify (bug, incident, feature, small change, refactor, question, ops,
   docs, ambiguous), judge stakes, and print the compact INTAKE decision
   block. If the confidence rule triggers, ask the one question and wait.
2. Handle prerequisites: fresh REPO-MAP.md (dispatch repo-analyst if
   missing or stale), grep .claude/army/solutions/ for prior art, check
   ecosystem deference.
3. Execute the matching flow end to end:
   - bug: army-debugging (reproducing test first), fix, /army:review.
   - incident: mitigate immediately, then root-cause, then regression test.
   - feature: /army:spec (which grills requirements out of the user first),
     then /army:plan, then /army:loop. Respect every HUMAN GATE in the
     doctrine; approval at one gate never covers the next.
   - small change: TDD loop, then /army:review.
   - refactor: characterization tests, transform in steps, /army:review.
   - question: investigate (repo-analyst or mp-research) and answer; no code.
   - ops or docs: dispatch the owning specialist directly.
   - ambiguous: mp-grilling, then re-run intake on the clarified statement.
4. Close per the doctrine definition of done, and run /army:compound if the
   effort produced learnings worth keeping.
