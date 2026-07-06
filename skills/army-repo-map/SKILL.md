---
name: army-repo-map
description: Use to generate or refresh .claude/army/REPO-MAP.md, the shared codebase map every army agent reads instead of exploring. Usually executed by repo-analyst.
---

# Repo Map Protocol

One agent explores once; everyone else reads the map. This is the army's
single biggest token saving.

## When to run

- No `.claude/army/REPO-MAP.md` exists.
- The map's recorded commit sha is more than ~50 commits behind HEAD.
- An agent reports the map materially wrong (fix immediately, note the miss).

## Generation steps

1. Manifests and configs first (package.json, go.mod, pyproject.toml, pom.xml,
   Dockerfile, CI files, Makefile). Extract stack, versions, and the exact
   build, test, lint, and run commands.
2. Directory tree to depth 3, vendor and generated dirs excluded. Annotate
   each top-level dir with its one-line job.
3. Entry points and 2 or 3 core execution paths traced by structure and
   signatures, not full-body reads.
4. Tests: framework, command, and an actual run if it finishes fast; record
   pass state and runtime.
5. Git: last 30 commits scanned for active areas; churn identifies hotspots.
6. Write the map in the fixed section order: What this is, Stack, Commands,
   Layout, Architecture, Domain glossary, Conventions, Hotspots, Gaps.

## Quality bars

- Under ~300 lines. Paths over quotes, tables over prose where denser.
- Every non-obvious claim tagged (verified) or (inferred). Readers must be
  able to trust a (verified) command enough to run it blind.
- Header records generation date and commit sha, enabling cheap staleness
  checks and incremental refresh (diff git log since sha, update only touched
  sections).

## Consumption rules (all agents)

- Read the map before any Glob or Grep. Most "where is X" questions end here.
- Found the map wrong? Fix that line while you are there and note it in your
  output. The map is living infrastructure, not a report.
- Commit the map to git so humans and CI agents share it.
