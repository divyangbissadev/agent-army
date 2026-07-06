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
4. On approval, make the plan executable: write or refresh the change
   folder's tasks.md so each SLICE becomes one checkbox line with its owner
   and proving test (create the folder via /army:spec first if this is
   feature-scale and none exists). Then execution belongs to /army:loop;
   for plan-only requests, stop here and say so.
