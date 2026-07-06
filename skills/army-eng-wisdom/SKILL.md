---
name: army-eng-wisdom
description: Distilled operating principles from the canonical software engineering books. Use when making design decisions, settling disputes between approaches, or reviewing architecture.
---

# Engineering Canon, Distilled

The load-bearing ideas from the books the industry actually tests against
production. Cite the source when you invoke one; it settles arguments fast.

## Design and complexity

- **A Philosophy of Software Design (Ousterhout).** Deep modules: simple
  interface, powerful implementation. Pull complexity downward into the module
  rather than pushing it onto callers. Shallow pass-through layers are debt.
- **Clean Code / Refactoring (Martin, Fowler).** Functions do one thing; names
  carry meaning so comments can carry intent only. Refactor in tiny
  behavior-preserving steps with green tests between each.
- **Design Patterns (GoF).** Patterns are vocabulary, not targets. Name the
  pattern you naturally arrived at; never contort code to reach one.
- **DDD (Evans, Vernon, Khononov).** See skill army-ddd.

## Systems and data

- **Designing Data-Intensive Applications (Kleppmann).** Every distributed
  guarantee has a cost; name your consistency model instead of assuming one.
  Logs and immutable events are the sturdiest backbone. Partial failure is the
  normal case: timeouts, retries with idempotency, and backpressure are design
  inputs, not patches.
- **Release It! (Nygard).** Bulkheads, circuit breakers, timeouts on
  everything. Integration points are where systems die; treat each as hostile
  until proven boring.
- **Systems Performance (Gregg).** Measure, then optimize. USE method:
  utilization, saturation, errors, per resource. The bottleneck is rarely
  where intuition points.

## Process and delivery

- **TDD by Example (Beck).** See skill army-tdd.
- **Working Effectively with Legacy Code (Feathers).** Legacy code is code
  without tests. Find the seam, pin behavior with characterization tests,
  then change with confidence. Never large-scale rewrite what you can strangle
  incrementally.
- **Continuous Delivery / Accelerate (Humble, Forsgren).** Small batches,
  trunk-based, deploy on demand. The four keys (lead time, frequency, MTTR,
  change-fail rate) beat any process argument.
- **The Pragmatic Programmer (Hunt, Thomas).** DRY is about knowledge, not
  lines. Fix broken windows now. Estimate with ranges.
- **Mythical Man-Month (Brooks).** Adding people to a late effort makes it
  later; communication paths grow quadratically. Applies to agents too: more
  subagents is not more speed unless the work truly partitions.
- **SRE / The Goal (Google, Goldratt).** Error budgets make reliability a
  feature with a price. Throughput is set by the constraint; optimizing
  anywhere else is theater.

## How to use this

In a design dispute, find the principle that applies, cite it, decide, move.
If two principles conflict (they do: DRY versus deep modules, speed versus
rigor), name the tension explicitly and choose for this context; that written
tradeoff is what senior judgment looks like.
