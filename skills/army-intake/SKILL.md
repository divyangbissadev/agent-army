---
name: army-intake
description: Problem-statement triage. Use on any incoming request to classify what it actually is, pick the right ceremony tier and flow, and dispatch to the right agents. The army's front door.
---

# Intake Protocol

Most workflow failures happen before any code: the wrong flow gets applied to
the problem. A bug treated as a feature gets speculative rewrites; a feature
treated as a bug gets patched sideways; a question treated as a task gets
unwanted code. Classify first, then commit.

## Step 1: Classify the request

Read the request literally, then infer the underlying need. Pick ONE primary
type:

| Type       | Signals                                                | Flow |
|------------|--------------------------------------------------------|------|
| bug        | "broken", "stopped working", error output, regression  | army-debugging: reproduce first, regression test, fix. No spec. |
| incident   | production down, users blocked, urgency language       | Mitigate first (rollback, flag off), root-cause after. Skip all ceremony until stable. |
| feature    | new behavior users will notice                         | army-spec change folder, then /army:plan, then /army:loop. |
| small change | one behavior, few files, unambiguous                 | TDD loop plus code-reviewer. No spec, no plan doc. |
| refactor   | behavior preserved, structure improved                 | Pin behavior with tests first (Feathers), then transform. code-reviewer checks scope. |
| question   | "how", "why", "what does", "compare", "should we"      | Investigate and answer. Write NO code unless asked. repo-analyst or mp-research. |
| ops        | CI, deploy, infra, cluster, pipeline work              | Route directly to devops-engineer, k8s-architect, or data-engineer. |
| docs       | README, ADR, runbook, onboarding                       | docs-writer directly. |
| ambiguous  | goal unclear, multiple readings, "something like"      | mp-grilling interview or product-manager brief, then re-enter intake. |

Mixed requests get decomposed: "fix the login bug and add SSO" is a bug flow
plus a feature flow, sequenced bug first (never build on broken ground).

## Step 2: Judge the stakes

Beyond type, set the accuracy dial:

- **Reversible and low blast radius**: proceed on best interpretation, state
  the assumption in one line.
- **Hard to reverse, security-adjacent, data-touching, or user-visible**:
  confirm the interpretation before acting. One precise question beats a
  wrong confident run.
- Confidence rule: if two readings of the request produce different code,
  and picking wrong wastes more than it costs to ask, ask exactly one
  question. Otherwise never ask.

## Step 3: Dispatch

State the decision in this compact form before doing anything:

```
INTAKE: <type> | tier: <trivial|small|feature|incident|direct> | difficulty: <routine|hard>
Route: <agents involved, in order>
Assumption: <the one-line interpretation you are committing to, if any>
```

Tier mapping: trivial covers no-behavior edits regardless of type; direct
covers question, ops, and docs (straight to the owning specialist); refactor
takes small or feature by blast radius; everything else maps by name.

Difficulty drives the doctrine's model strategy: hard means novel algorithms,
tricky concurrency, or critical migrations, and earns the strongest model
plus independent double-solves for correctness-critical logic.

Log the decision (doctrine Telemetry): `node
.claude/army/scripts/log-dispatch.mjs intake type=<type> route=<first-agent>
difficulty=<d>`. If the classification later proves wrong, log
`event=misroute` with the corrected type; misroutes become eval cases.

Then execute the flow. Prerequisites are part of dispatch: REPO-MAP.md fresh
(else repo-analyst first), solutions/ grepped for prior art, deference check
(OpenSpec, spec-kit, superpowers) done.

## Anti-patterns

- Defaulting everything to the feature flow because it is the most thorough.
  Ceremony applied to a typo fix is not rigor, it is waste.
- Answering a question with a pull request.
- Starting to code while classification is still ambiguous; ambiguity
  compounds, it never resolves itself downstream.
- Asking a clarifying question whose answer would not change what you build.
