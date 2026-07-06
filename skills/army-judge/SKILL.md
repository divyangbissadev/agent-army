---
name: army-judge
description: LLM-as-judge protocol for fuzzy outcomes. Use when quality cannot be checked by a test: docs, plans, research answers, explanations, UX copy. Rubric first, evidence required, judge blind.
---

# Judge Protocol

Rules-based checks come first, always: anything a test, linter, or validator
can verify never goes to a judge. The judge exists for the remainder, where
"good" is real but not mechanical. An unwritten standard is not a standard,
so the rubric is written before the artifact is scored.

## Step 1: Write the rubric (before judging)

3 to 6 criteria, each with:

- A name and one-sentence definition of what it measures.
- Scale anchors: what a 1, a 3, and a 5 look like, concretely. "Good" is not
  an anchor; "answers the reader's question in the first paragraph" is.
- An evidence requirement: what the judge must quote to justify the score.

Reusable rubrics live next to what they judge (e.g. eval/e2e fixtures carry
RUBRIC.md); one-off rubrics go in the judge's output so the next session can
reuse them.

## Step 2: Judge blind

Dispatch a fresh-context subagent (or a foreign vendor per army-cross-review
for high stakes) with ONLY: the artifact, the rubric, and the original task
statement. Never the conversation, the author's reasoning, or the author's
self-assessment; a judge that reads the author's intent grades the intent,
not the artifact.

## Step 3: Structured verdict

```
JUDGE: <artifact> against <rubric>
  <criterion>: <score>/5, evidence: "<quoted from artifact>"
  ...
TOTAL: <n>/<max>  VERDICT: pass | revise (threshold stated by the rubric)
Top fix: the single change that would raise the score most
```

## Calibration rules

- Every score cites quoted evidence. A score without a quote is invalid;
  re-judge.
- The judge may answer "cannot assess" for a criterion needing information
  it was not given; that is signal to fix the rubric or the inputs, not a 3.
- Comparing two artifacts: judge pairwise ("which is better on criterion X
  and why"), not by comparing two absolute scores; absolute scores drift,
  preferences are stable.
- Two independent judges disagreeing by 2+ points on a criterion means the
  rubric anchor is ambiguous; fix the anchor before trusting either score.
- The author never judges their own artifact against their own fresh rubric;
  write the rubric first or get a fresh context.

## Where it plugs in

- e2e outcome evals: fuzzy tasks (question answering, docs) carry a
  RUBRIC.md; the deterministic checker names it and the judge scores it.
- docs-writer output on user-facing docs, army-chief plans on request,
  research reports from mp-research: judge on request or when stakes are
  high, not by default (a judge run costs a subagent).
- Never for code correctness: that is army-tdd and the verify hook's job.
