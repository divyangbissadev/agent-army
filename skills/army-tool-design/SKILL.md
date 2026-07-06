---
name: army-tool-design
description: Tool design standards for anything agents will call. Use when building MCP servers, CLI tools, scripts, or APIs that a model consumes; treats the tool surface as UX for the model.
---

# Tool Design Protocol (agent-facing surfaces)

A tool definition is a product surface whose user is a model. Most agent
failures blamed on the model are actually tool UX failures: vague
descriptions, overlapping tools, outputs that waste context, and errors that
dead-end instead of teach.

## Shape

1. **Few, well-shaped tools beat many overlapping ones.** Every added tool
   taxes tool selection on every call. Merge tools that differ only by a
   parameter; delete tools whose job a composition already does. The test:
   can a new team member say, for any task, exactly which tool applies?
2. **Descriptions are onboarding docs.** Write each as if briefing a new
   hire: what it does, when to use it (and when NOT to), one concrete
   example call. Trigger phrasing ("Use when...") beats capability phrasing
   ("Can do...").
3. **Parameters make illegal calls unrepresentable.** Enums over free
   strings, required over optional-with-footguns, defaults that are safe.
   A parameter the model routinely gets wrong is a design bug, not a model
   bug.

## Output

4. **Token-efficient by default.** Return the 3 or 4 fields callers use,
   not the full record; truncate long output with an explicit size hint and
   a way to get more ("showing 20 of 214, use --full"). Pre-compute
   aggregates the model would otherwise burn round trips deriving.
5. **Explicit emptiness.** "0 results for X" beats empty output; silence
   reads as breakage and triggers retries.
6. **Suggest the next step.** After success, one line pointing at the
   likely next action; after truncation, how to widen.

## Errors

7. **Errors teach.** Every error names what was wrong, shows the expected
   form, and states the next action ("run X first", "did you mean Y").
   An error the model cannot act on will be retried verbatim, wasting a
   full round trip.
8. **Idempotent mutations, no interactive prompts.** Agents retry; design
   for it. Anything that would prompt interactively must take a flag
   instead.

## Prove it

9. **Eval the tool itself.** Before shipping, write 5 to 10 realistic call
   scenarios (including 2 misuse cases) and check the model picks the tool,
   forms the call, and recovers from the error message. A tool is done when
   the misuse cases self-correct in one step.
10. **Measure context cost.** Note tokens per typical response; a tool
    called often earns its output budget scrutiny (compare axi-style TOON
    or tabular output against JSON for high-frequency tools).

## Where it applies in the army

ai-engineer building MCP servers or agent tools, backend-engineer designing
APIs agents will consume, and the army's own repo scripts
(validate-change.mjs, log-dispatch.mjs, score-intake.mjs), which follow
these rules and serve as the reference implementation.
