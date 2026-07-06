---
name: army-cross-review
description: Cross-vendor review for high-stakes diffs. Use when a change is security-adjacent, data-touching, or hard to reverse; a different model vendor reviews the diff blind and the loop runs until zero blockers.
---

# Cross-Vendor Review Protocol

The same model that wrote a diff shares its blind spots when reviewing it.
For high-stakes changes, a reviewer from a different vendor breaks the
correlation. This escalates army-review-standards; it does not replace it.

## When to escalate to cross-review

- Security-adjacent surface (authn, authz, secrets, injection paths).
- Data-touching (migrations, deletes, money, PII).
- Hard to reverse (published APIs, released artifacts, infra topology).
- The user explicitly asks for maximum confidence.

Routine diffs do not get this; the doctrine's normal code-reviewer gate is
the right cost there.

## Protocol

1. **Find a foreign reviewer.** Check availability silently:
   `command -v codex gemini opencode 2>/dev/null`. Prefer the first
   available CLI from a different vendor than the implementer. None
   available: fall back to a fresh-context code-reviewer dispatch with the
   skeptic instruction "assume this diff hides a bug; find it", and say the
   review was same-vendor.
2. **Blind the reviewer.** Input is ONLY: the diff, and the acceptance
   contract (the spec scenarios or the stated requirements). Never the
   conversation, the implementation reasoning, or worktree access. The
   reviewer judges what was built, not what was intended.
   Example: `codex review` on the branch, or pipe the diff with a prompt
   requiring structured output: blocking, non-blocking, suggestions, each
   with file:line and a concrete failure scenario.
3. **Triage findings like army-review-standards demands.** Blocking findings
   need a concrete failure scenario; a foreign reviewer's style opinions are
   nits like anyone else's.
4. **Fix and loop.** Blocking issues go back to the original implementer
   agent (it has the context), then re-run the cross-review on the new diff.
   Loop until zero blocking findings or two rounds, after which unresolved
   disagreements go to the user with both positions stated in two lines.
5. **Record.** One line in the final report: which vendor reviewed, rounds,
   verdict.

## Rules

- The foreign reviewer never edits code; it only reports. Fixes stay with
  the implementer.
- Disagreement between reviewers is signal, not noise: it marks exactly the
  code that needs a test to settle the question. Write that test.
- Budget: cross-review costs real tokens and minutes; two rounds maximum
  before escalating to the human.
