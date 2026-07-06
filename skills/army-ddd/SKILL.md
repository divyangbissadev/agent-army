---
name: army-ddd
description: Domain-driven design protocol. Use when implementing or modeling anything with business rules, invariants, or contested vocabulary. Evans and Vernon, applied not recited.
---

# DDD Protocol

Complexity in software is domain complexity mishandled. The model in the
code and the model in the domain expert's head must be the same model.

## Strategic moves (before any code)

1. **Speak the ubiquitous language.** Extract the nouns and verbs the business
   uses (from the task, REPO-MAP.md glossary, existing docs). Code uses these
   words exactly: class, method, event, and test names. A rename that aligns
   code with business language is always in scope.
2. **Find the bounded context.** The same word means different things in
   different contexts (a Product in catalog is not a Product in shipping).
   Never build one model to rule them all; build small models with explicit
   translation at the boundaries. External or legacy systems get an
   anti-corruption layer: translate at the edge, keep their mess out of your
   model.
3. **Classify the subdomain.** Core (differentiating, deserves the best
   design), supporting (build simply), generic (buy or use a library). Spend
   tactical DDD effort on core only.

## Tactical patterns (in the code)

- **Value objects first.** Any concept with rules or equality by value: Money,
  Email, Quantity, DateRange. Immutable, self-validating in the constructor,
  no invalid instance can exist. Primitive obsession is the first smell to fix.
- **Entities** have identity and a lifecycle. Keep behavior on them; anemic
  entities with logic in "manager" services are the failure mode to avoid.
- **Aggregates** are consistency boundaries. One transaction touches one
  aggregate; cross-aggregate rules go eventual via domain events. Reference
  other aggregates by id only. Default small: a single entity is a fine
  aggregate.
- **Domain events** record facts, past tense, business language
  (OrderShipped, PaymentDeclined). They decouple contexts and feed data
  pipelines.
- **Repositories** per aggregate root, interface in the domain, implementation
  at the edge. Domain code imports no framework.

## Guardrails

- CRUD is not a failure. Reference-data screens get a table and a form; using
  aggregates there is cosplay, skip it and say so.
- Every invariant becomes a sentence, then a unit test (army-tdd), then code.
- Layering: domain depends on nothing, application orchestrates, adapters
  translate. IO lives at the edges only.
