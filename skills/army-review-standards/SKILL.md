---
name: army-review-standards
description: The review bar every army diff must clear. Use when reviewing code, preparing a diff for review, or arbitrating a disputed review finding.
---

# Review Standards

The reviewer's job is to find the failure before the user does. The author's
job is to make that easy.

## Author obligations (before requesting review)

1. Diff tells one story; unrelated changes split out.
2. Failing-test-first evidence in the diff (army-tdd), full affected suite
   green, quoted from a real run. User-visible changes additionally carry
   exercised-in-the-app evidence (screenshot or real request/response);
   reviewers reject "tests pass" as the only proof a feature exists.
3. Self-review done: the author reads their own diff top to bottom and fixes
   what embarrasses them before spending the reviewer's tokens.
4. Commit message states why, not just what. No em-dashes.

## Reviewer obligations

1. Blockers need a concrete failure scenario: input, state, wrong outcome.
   Style opinions are never blockers.
2. Severity honesty: blocker (ships a bug or a hole), warning (should fix),
   nit (max 3 per review, only if genuinely useful).
3. Verify, do not vibe: run tests or type checks when available rather than
   predicting them.
4. Review the tests as hard as the code. Weak assertions, tests that cannot
   fail, and mock theater (asserting the mock was called instead of the
   outcome) are findings.
5. PASS verdicts are cheap when honest: a clean diff gets PASS and two
   sentences, not invented findings to look thorough.

## Automatic FAILs

- Symptom patch without root cause explanation.
- New behavior with no failing-test-first evidence.
- Secrets, credentials, or PII in code, config, or logs.
- Authz missing on a new server-side path.
- Drive-by refactor outside task scope mixed into the diff.
- Public behavior changed with docs untouched.

## Dispute rule

Author disagrees with a finding: one written round each, then the dispute
goes to the user with both positions stated in two lines (doctrine human
gate 6). No infinite threads.
