# Architecture Decision Record (ADR) Template

ADRs record significant architectural decisions alongside their context, reasoning, and consequences. They are lightweight, immutable (once accepted), and accumulate over time as a decision log for the system.

## Format

Each ADR is a short document (under 1 page). Use the naming convention `ADR-NNNN-short-title.md` (for example, `ADR-0001-use-postgresql-for-user-data.md`).

## Template

```markdown
# ADR-[NUMBER]: [Decision Title]

| Field | Value |
|-------|-------|
| **Status** | Proposed · Accepted · Deprecated · Superseded by ADR-NNNN |
| **Date** | YYYY-MM-DD |
| **Author(s)** | |
| **Deciders** | Names of people who participated in the decision |

## Context

<!--
  AGENT GUIDANCE:
  - Describe the forces at play: technical constraints, business requirements, team capabilities, time pressure.
  - State the problem or question that required a decision.
  - Include enough context that a new engineer joining 6 months from now can understand why this decision was needed.
  - Keep it to 2-4 sentences. If you need more, the context belongs in a TDD, not an ADR.
-->

## Decision

<!--
  AGENT GUIDANCE:
  - State the decision in active voice: "We will use X" or "We will adopt Y pattern."
  - Be specific. "We will use PostgreSQL 15 on AWS RDS" not "We will use a relational database."
  - One decision per ADR. If you're recording multiple decisions, write multiple ADRs.
-->

## Rationale

<!--
  AGENT GUIDANCE:
  - Explain WHY this option was chosen over alternatives.
  - Reference specific trade-offs: performance, cost, team familiarity, maintenance burden, ecosystem maturity.
  - If this decision was made during a TDD review, reference the TDD's "Alternatives Considered" section.
  - Keep this to 3-5 sentences. The goal is reasoning, not exhaustive analysis.
-->

## Alternatives Considered

<!--
  AGENT GUIDANCE:
  - List 1-3 alternatives that were seriously evaluated.
  - For each, provide a one-sentence summary and one-sentence rejection reason.
  - If an alternative could become viable later, note the conditions (for example, "Revisit if write volume exceeds 50K TPS").
-->

| Alternative | Why Rejected |
|-------------|-------------|
| | |

## Consequences

<!--
  AGENT GUIDANCE:
  - Describe what changes as a result of this decision: both positive and negative.
  - Include any trade-offs accepted, technical debt incurred, or constraints imposed on future decisions.
  - Note any follow-up work required (for example, "Requires team training on X" or "Must migrate existing data from Y").
-->

### Positive
-

### Negative
-

### Neutral
-
```

## ADR Best Practices

These practices are drawn from organizations that maintain successful ADR logs (Spotify, Wise, Comcast, and the broader ADR community initiated by Michael Nygard):

**Immutability.** Once an ADR is accepted, don't edit it. If a decision changes, write a new ADR that supersedes the old one and update the old ADR's status to "Superseded by ADR-NNNN." This preserves the historical reasoning.

**Numbering.** Use sequential numbers (ADR-0001, ADR-0002). Don't reuse numbers.

**Scope.** One decision per ADR. If a design requires five decisions, write five ADRs. This makes it easy to supersede individual decisions without rewriting the entire log.

**Living index.** Maintain an `ADR-INDEX.md` file that lists all ADRs with their title, status, and date. This makes the log discoverable.

**Lifecycle integration.** ADRs can live as standalone files in a `docs/adr/` directory in the repository, or as entries in a TDD's Decision Log section (Section 11). The standalone approach works better for decisions that outlive any single design document.

## Example ADR Index

```markdown
# Architecture Decision Records

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-0001](ADR-0001-use-postgresql.md) | Use PostgreSQL for user data store | Accepted | 2025-03-15 |
| [ADR-0002](ADR-0002-event-driven-pipeline.md) | Adopt event-driven architecture for order processing | Accepted | 2025-03-20 |
| [ADR-0003](ADR-0003-api-versioning.md) | Use URL-path versioning for public APIs | Superseded by ADR-0007 | 2025-04-01 |
```
