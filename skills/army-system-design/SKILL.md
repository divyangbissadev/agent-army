---
name: army-system-design
description: System design protocol for new services, major features, and scalability work. Use before building anything with more than one moving part or any distributed concern.
---

# System Design Protocol

Design is the art of choosing which problems to have. Make the choices
explicit, cheap to reverse where possible, and written down where not.

## The sequence

1. **Requirements with numbers.** Reads versus writes per second, payload
   sizes, latency budget (p99, not average), consistency needs per operation,
   availability target. Estimates within 10x are fine; "a lot" is not a number.
2. **Start with the data.** Model the entities and access patterns first
   (with domain-modeler where rules are rich). The datastore choice falls out
   of the access patterns, not out of fashion. Default to the boring choice
   (usually Postgres) until a number forces otherwise.
3. **One box first.** Design the single-node version, then scale only what the
   numbers say will break, in order: cache, read replicas, partition, async.
   Every distribution step buys a failure mode; name it as you buy it
   (Kleppmann: partial failure, reordering, duplicate delivery).
4. **Failure design.** For each arrow in the diagram: timeout, retry policy
   (idempotent only), fallback behavior, and what the user sees when it is
   down. Backpressure over unbounded queues.
5. **Evolution over prediction.** Prefer designs that are easy to change over
   designs that guess the future. An expand-and-contract migration path beats
   a speculative abstraction.

## Decision hygiene

- Two or three real options per major choice, one-line tradeoff each, a pick,
  and the reversal cost. Record it as an ADR (docs-writer) if the reversal
  cost is high.
- Name your consistency model per operation: strongly consistent, read your
  own writes, eventual. "It should be fine" is not a model.
- Capacity math on one page: storage growth per month, QPS per component,
  connection counts. Numbers kill most bad designs before code does.

## Review triggers

Bring in security-engineer for any new trust boundary, data-engineer for any
new large-scale data flow, k8s-architect for runtime topology, and
code-reviewer on the design doc itself when the blast radius is large.
