---
description: Get a sliced battle plan from army-chief for a feature-scale task
---

Task: $ARGUMENTS

1. Ensure `.claude/army/REPO-MAP.md` exists and is fresh; if not, run /army:map
   first.
2. Dispatch the army-chief agent with the task, pointing it at the map and at
   `.claude/army/solutions/` for prior art.
3. HUMAN GATE: present the returned plan to the user verbatim and ask for
   approval or edits before dispatching any implementation slice. If lavish
   is installed and the plan is large, offer it as a reviewable artifact.
4. On approval, execute the plan: dispatch each slice's owner agent with the
   scoped brief from the plan, respecting dependency order and the doctrine's
   3-to-5 concurrent subagent cap. Gate each slice per the doctrine
   (code-reviewer, docs-writer when public behavior changes).
