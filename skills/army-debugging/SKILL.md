---
name: army-debugging
description: Systematic root-cause debugging protocol. Use when a bug is reported, a test goes red unexpectedly, or behavior diverges from expectation. No fix without an explained cause.
---

# Debugging Protocol

The Iron Law: no fix until the failure is reproduced and the cause is
explained in one sentence. A fix without a cause is a bet, and review rejects
bets.

## The loop

1. **Reproduce.** Make the failure happen on demand, ideally as a failing
   test (which then becomes the regression test per army-tdd). If you cannot
   reproduce, you are gathering evidence, not fixing.
2. **Minimize.** Shrink the reproduction: smallest input, fewest components,
   shortest path. Every removed element that keeps the failure is a
   suspect eliminated.
3. **Locate.** Bisect rather than stare: git bisect across commits, binary
   search across the pipeline (does the bad value exist here? here?), toggle
   suspects one at a time. Read error messages fully and literally before
   theorizing; the answer is often printed.
4. **Hypothesize and test.** One falsifiable hypothesis at a time: "X causes
   the failure; if I change only X, the failure stops." Run it. A hypothesis
   you did not test is a guess you are about to ship.
5. **Explain.** Write the one-sentence cause: what happens, under which
   condition, why it produces the observed symptom. If the sentence contains
   "somehow", return to step 3.
6. **Fix at the cause.** Fix where the defect lives, not where it hurts.
   Regression test red first, then the fix, then green (army-tdd bug-fix
   order).
7. **Sweep.** Grep for the same pattern elsewhere; defects travel in packs.
   Note the learning via army-compound if it cost real effort.

## Anti-patterns (each one fails review)

- Retrying flaky failures until green and moving on.
- Adding sleeps, try/except-pass, or null checks that silence the symptom.
- Changing several things at once and keeping whatever combination worked.
- Blaming the framework, cache, or cosmic rays before eliminating your own
  code with evidence.
- Debugging by rewriting: replacing the code you do not understand with new
  code you also will not understand under failure.

## Escalation

Three tested hypotheses dead and no cause: stop, write down what is ruled
out with evidence, and present the map. That writeup is progress; thrashing
is not.
