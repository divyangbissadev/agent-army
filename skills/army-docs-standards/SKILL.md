---
name: army-docs-standards
description: Documentation standards for all army prose. Use when writing or reviewing READMEs, API docs, ADRs, runbooks, comments, or commit messages.
---

# Documentation Standards

Docs are read fifty times per write. Optimize for the reader in a hurry.

## The four document types (Divio)

Every page does exactly one job:

- **Tutorial**: learning by doing, guaranteed to work end to end.
- **How-to**: solve one real task, assumes basic competence.
- **Reference**: complete, accurate, generated from source where possible.
- **Explanation**: why it is built this way, tradeoffs, history.

A page mixing jobs gets split. A doc set missing a type has a named gap.

## Universal rules

1. First paragraph answers: what is this, what does it do for me, am I in the
   right place.
2. Every code sample is complete (imports included) and verified to run.
   Broken samples are worse than no samples.
3. One name per concept, from the REPO-MAP.md domain glossary. Introducing a
   synonym requires updating the glossary, which is a hint not to.
4. Sentences short, voice active, instructions in second person imperative.
5. No em-dashes anywhere: comma, colon, parentheses, or split the sentence.
6. No unverifiable adjectives. Fast is a number, lightweight is a size,
   simple is a line count.

## Specific formats

- **README**: what it is (3 sentences), quickstart that works, how to develop
  (build, test, lint commands), where to get help. Everything else links out.
- **ADR** (Nygard): title, status, context, decision, consequences,
  alternatives considered. Two-minute read maximum.
- **Runbook**: numbered steps, exact commands with expected output, explicit
  decision points, written for a stressed human at 3am.
- **API reference**: every field typed, every error listed with its trigger,
  one runnable example per endpoint.
- **Commit message**: first line under 72 chars stating the why-shaped what;
  body explains why, links the issue. No attribution trailers.

## Agent-facing prose (prompts, skill bodies, tool descriptions)

Prose a model consumes follows the universal rules plus:

7. Triggers are concrete situations, not judgments. "Search when the query
   names a product you do not recognize" beats "search when appropriate";
   a condition the reader can check cannot be misjudged.
8. Hard limits read as checkable rules, then a self-check. State the limit
   with a number or an observable ("quotes under 15 words, one per source"),
   then close the section with 2-4 questions the agent asks itself before
   declaring the step done.
9. Escalate specificity in order: principle, then rules, then examples,
   then edge cases. Each layer resolves ambiguity the previous one left,
   and a reader stops as soon as their case is covered.
10. Every ambiguous behavior gets a paired good and bad example, each with
    one line on why. A lone good example teaches the happy path; the bad
    one marks the boundary.

## Maintenance

Docs change in the same diff as the behavior they describe, or the diff fails
review (army-review-standards). Stale docs found in passing get fixed in
passing or filed in REPO-MAP.md Gaps.
