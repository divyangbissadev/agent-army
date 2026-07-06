---
name: army-spec
description: Lightweight spec-driven change workflow. Use for feature-scale work: a change folder holds the proposal, requirements, and task ledger; archive merges into living specs. Defers to OpenSpec or spec-kit when installed.
---

# Spec Protocol (OpenSpec-compatible, deliberately light)

Feature-scale work gets a written contract before code. The contract is small
(three files, one folder), survives sessions, and any future session can
resume from the checkbox ledger.

Deference first: if the repo has `openspec/` or `.specify/`, use that tool's
flow instead and stop reading here.

## When to spec

- Yes: multi-file features, behavior changes users will notice, anything
  spanning more than one work session.
- No: bug fixes (army-debugging plus a regression test IS the contract),
  refactors with no behavior change, trivial edits. Specs for small changes
  are ceremony, skip them and say so.

## The change folder

`.claude/army/changes/<slug>/` containing:

1. **proposal.md**: why (2-3 sentences), what changes (bullets), what does
   NOT change (bullets), affected specs.
2. **spec.md**: the requirement deltas only, under headers `## ADDED
   Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements`.
   Each requirement is one SHALL sentence followed by 1-3 concrete
   `Scenario:` blocks (given, when, then). Scenarios become the failing
   tests, so write them testable.
3. **tasks.md**: checkbox ledger of implementation slices in dispatch order,
   each with owner agent and its proving test. Format:
   `- [ ] 1. slice name (owner: backend-engineer, test: rejects expired card)`

Design notes only when a real decision needs recording; prefer an ADR via
docs-writer for high-reversal-cost calls.

## The lifecycle

1. **Propose.** Write the folder. Get user approval on proposal.md before
   implementation; it is one screen, the review is cheap.
2. **Apply.** Work tasks.md top to bottom, one task at a time: failing test
   from the scenario, implement, green, tick the checkbox in the same edit
   as the code lands. Never tick ahead of reality; the ledger is the resume
   point for any future session.
3. **Archive.** All boxes ticked and review passed: move the folder to
   `.claude/army/changes/archive/<YYYY-MM-DD>-<slug>/` and merge the spec
   deltas into `.claude/army/specs/<capability>.md`, the living description
   of current behavior. Living specs never contain deltas, only the current
   truth. Then run army-compound for learnings.

## Rules

- One change folder per feature; parallel features get parallel folders.
- A requirement without a scenario is an opinion; it does not enter spec.md.
- Keep the whole folder under ~150 lines for a typical feature. If it wants
  to be bigger, the feature wants to be two changes.
- Commit change folders and living specs to git; they are shared team state.
