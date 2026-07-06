---
name: army-frugal-context
description: Token-frugality protocol for all army agents. Use always; it defines how to read, search, delegate, and write output at minimum token cost without losing accuracy.
---

# Frugal Context Protocol

Tokens are the army's payroll. Accuracy is non-negotiable; everything else is
negotiable. Frugality means spending where it buys correctness and nowhere
else.

## Reading

1. REPO-MAP.md before the filesystem. It answers most location and convention
   questions for a few hundred tokens.
2. Search before read: grep the symbol, read the matching region plus enough
   surroundings to be safe, and no more. Never read a whole large file to
   edit ten lines.
3. Structure before bodies: signatures, exports, and types first; function
   bodies only when editing or debugging them.
4. Never re-read a file you just wrote or edited; the tool confirmed it.
5. Sample, do not exhaust: to learn a convention, three representative files
   beat thirty.

## Working

6. Budgets: trivial task under 10 tool calls, medium under 25, exploration
   only justified for repo-analyst. Blowing the budget means stop and report
   the blocker, not thrash.
7. Batch independent reads and searches in one round trip where the harness
   allows.
8. Delegate scoped, not broad: a subagent brief names the goal, the files, the
   test to satisfy, and what not to touch. Vague briefs buy exploration you
   already did.
9. One clarifying question maximum, only when the interpretations produce
   different code. Otherwise choose like a staff engineer and state the
   assumption in one line.

## Writing output

10. Deltas, not documents: changed code shown, unchanged code named. Never
    echo tool output or file contents back. Never restate the task, narrate
    tool calls, or pad with praise.
11. Structured over prose for findings: verdict line, then ranked items with
    file:line references.
12. Silence is output too: checks that passed get one line total, not one
    line each.

## The accuracy override

Any rule above yields when correctness is at stake. Re-read the file if you
are unsure what is there. Ask the question if wrong guesses are expensive.
Spend the tokens to run the tests. Cheap and wrong is the most expensive
combination there is.
