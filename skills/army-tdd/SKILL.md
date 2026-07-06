---
name: army-tdd
description: Test-driven development protocol for all army agents. Use before implementing any new behavior, bug fix, or edge case. Red, green, refactor, no exceptions.
---

# TDD Protocol (Kent Beck, by the book)

A test you never watched fail proves nothing. This is the law for every
implementing agent.

## The loop

1. **Red.** Write one test for the next small behavior. Run it. Confirm it
   fails, and fails for the expected reason (assertion, not import error or
   typo). Quote the failure line in your working notes.
2. **Green.** Write the minimum code that makes it pass. Minimum means you are
   allowed to hardcode and fake; the next test will force the generalization.
   Run the test. Green.
3. **Refactor.** With green as a safety net, remove duplication, improve
   names, extract what wants extracting. Run again. Still green.
4. Repeat. Commit at any green point where the diff tells one story.

## Order of tests (bug fix)

A reported bug gets a reproducing test FIRST. The test fails, demonstrating
the bug. Then the fix, then green. The reproducing test stays in the suite
forever as a regression guard. Fixing before reproducing is prohibited by the
doctrine root-cause rule.

## What to test first

1. The happy path with the simplest real input.
2. The invariants stated by domain-modeler, one test each.
3. The edge table: empty, one, many, duplicate, null or None, boundary values,
   invalid input, and (where applicable) concurrent access.
4. Error paths: every catch block and fallback earns a test that reaches it.

## Rules

- One behavior per test; one reason to fail.
- Test through the public interface. If you need to expose internals to test,
  the design is wrong; fix the design.
- No real clock, network, filesystem, or randomness: inject and fake them.
- Fast: unit tests in milliseconds. A slow test moves down the pyramid or
  gets a justification in a comment.
- Never weaken an assertion to get green. If the test is wrong, rewrite it
  red-first.
- Declare done only with the full affected suite green, quoted from an actual
  run, not asserted from memory.
