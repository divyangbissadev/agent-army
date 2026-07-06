---
description: Start a spec-driven change folder for a feature (army-spec workflow)
---

Feature: $ARGUMENTS

Follow the army-spec skill. First check deference: if the repo has `openspec/`
or `.specify/`, use that tool's flow instead and tell the user why. Otherwise:

1. Pull the real requirements out of the human first. Unless the request is
   already fully pinned (explicit behaviors, edge cases, and non-goals), run
   the mp-grilling interview: one question at a time, recommend an answer
   with each question, stop when new questions stop changing the design. In
   repos that keep CONTEXT.md or ADRs, use mp-grill-with-docs so decisions
   land in the docs as they crystallize. For genuinely fuzzy scope, dispatch
   product-manager for the one-page brief; for business rules, domain-modeler
   for the invariants.
2. Create `.claude/army/changes/<slug>/` with proposal.md, spec.md (ADDED /
   MODIFIED / REMOVED requirement deltas with testable scenarios), and
   tasks.md (checkbox ledger with owner agents and proving tests).
3. HUMAN GATE: show proposal.md to the user and get approval before any
   implementation. Never skip this even when confidence is high. On
   approval, add `Status: approved (user, <date>)` to proposal.md, then run
   `node .claude/army/scripts/validate-change.mjs <folder>` and fix any
   findings before implementation starts.
4. On approval, apply tasks top to bottom (failing test, implement, green,
   tick), gating per the doctrine. When all boxes are ticked and review
   passes, archive the folder and merge deltas into `.claude/army/specs/`.
