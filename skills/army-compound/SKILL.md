---
name: army-compound
description: Compounding-knowledge loop. Use after finishing a significant effort, fixing a hard bug, or discovering a repo gotcha; writes a solution note future planning reads first.
---

# Compound Protocol

Every unit of work should make the next one cheaper. The mechanism is a
solutions directory that planning reads before doing anything else.

## Writing (after the effort)

Create or update `.claude/army/solutions/<kebab-topic>.md`:

```
# <Topic>
Problem: what hurt, in one or two sentences
Root cause: the explained cause (from army-debugging where applicable)
Solution: what worked, with the key file paths or commands
Gotchas: the non-obvious traps that cost time
Date: <YYYY-MM-DD>  Confidence: verified | inferred
```

Bar for writing one:

- The effort cost more than an hour of equivalent work, OR the insight is
  repo-specific and non-obvious (a build quirk, a flaky dependency, an API
  landmine, a convention the map does not capture).
- NOT worth a note: things the code or REPO-MAP.md already says, one-off
  trivia, generic best practices (the skills already carry those).

Keep each note under 30 lines. A note nobody reads compounds nothing.

During retros, also read `.claude/army/telemetry.jsonl` when present:
repeated misroutes become proposed intake eval cases, and frequent
verify-blocks or failing loop-exits earn a one-line diagnosis in the retro.

## Reading (before the next effort)

- army-chief and any planning step grep `.claude/army/solutions/` for the
  task's keywords before writing a plan; hits go into the plan's PRIOR ART
  line.
- A specialist hitting a wall greps solutions/ before deep debugging;
  yesterday's three-hour fight might be today's one-line answer.

## Maintenance

- Correct a note the moment you find it wrong; a stale solution is worse
  than none (mark corrections with a new date).
- More than ~25 notes: merge overlapping ones and delete anything the repo
  has since made obsolete. Do this during a retro, not mid-task.
- Durable, universal lessons graduate: propose a one-line addition to the
  repo's CLAUDE.md and delete the note.
- Commit solutions/ to git; the whole team's agents compound together.
