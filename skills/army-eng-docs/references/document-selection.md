# Document Selection Framework

This guide helps determine which document type is appropriate for a given project or change.

## Decision Tree

```
Is this a new project, feature, or significant initiative?
├── YES → Is the blast radius limited to one team?
│   ├── YES → Is it a simple, well-understood change?
│   │   ├── YES → One-Pager (or skip documentation if truly trivial)
│   │   └── NO → Requirements Document (combined PRD+TRD)
│   └── NO → Requirements Document (consider splitting PRD and TRD for multi-team projects)
│       └── Then → Technical Design Document (after requirements approval)
└── NO → Is this a significant architectural decision?
    ├── YES → Architecture Decision Record (ADR)
    └── NO → Is this a bug fix or minor change?
        ├── YES → No document needed (Jira ticket is sufficient)
        └── NO → One-Pager for scoping, then decide if fuller docs are needed
```

## Document Types at a Glance

### Requirements Document (PRD + TRD)
**Purpose:** Define WHAT the system needs to do. Combines product requirements (who, what, why) with technical requirements (what the system must accomplish technically, without prescribing how).

**Audience:** Mixed: product managers, engineers, QA, leadership.

**When to write:**
- New projects or features that require design decisions
- Initiatives spanning more than one sprint
- Work that involves multiple stakeholders or cross-team coordination
- Changes requiring formal acceptance criteria

**When NOT to write:**
- Bug fixes or cosmetic changes
- Changes where the approach is obvious and contained within one team
- Exploratory spikes (use a One-Pager instead)

**Inspired by:** Amazon's PR/FAQ forces teams to articulate customer value before building. Google's PRD tradition emphasizes measurable objectives. The combined PRD+TRD format reduces the overhead of maintaining separate documents for most projects.

### Technical Design Document (TDD)
**Purpose:** Define HOW the system will be built. Proposes a specific technical solution, evaluates alternatives, and documents the implementation approach.

**Audience:** Experienced software developers, architects, senior engineers.

**When to write:**
- After a Requirements Document is approved
- Before implementation begins on non-trivial work
- When the technical approach involves trade-offs worth documenting
- When multiple engineers need to understand and contribute to the implementation

**When NOT to write:**
- Trivial changes that don't involve design decisions
- Direct implementations of well-understood patterns with no trade-offs
- Without an approved Requirements Document (write that first)

**Inspired by:** Google Design Docs (the most scrutinized section is always the architecture and alternatives). Uber's RFC process (evolved from informal "DUCK" docs to structured RFCs with approver fields). Stripe's emphasis on backward compatibility assessment for every change.

### Architecture Decision Record (ADR)
**Purpose:** Record a single significant architectural decision with its context, reasoning, and consequences. ADRs are lightweight and accumulate over time as a decision log.

**Audience:** Current and future engineers working on the system.

**When to write:**
- Technology selection decisions (database, framework, messaging system)
- Pattern decisions (event-driven vs. request-response, monolith vs. microservices)
- Trade-off decisions that future engineers will question
- Decisions that affect multiple teams or have long-term consequences

**When NOT to write:**
- Routine implementation choices within established patterns
- Decisions that are already captured in a TDD's "Alternatives Considered" section (unless the decision needs to outlive the TDD)

**Inspired by:** Michael Nygard's ADR format (adopted by Spotify, Wise, Comcast, and many others). The key insight is that decisions decay faster than code: recording the *why* is more valuable than recording the *what*.

### One-Pager
**Purpose:** A lightweight document for pitching ideas, scoping small features, or proposing changes that don't warrant a full requirements or design doc.

**Audience:** Varies: can target technical or non-technical readers.

**When to write:**
- Early-stage idea exploration before committing to a full document
- Small features or improvements contained within one team
- Proposals that need quick alignment (within days, not weeks)
- Spikes or proof-of-concept scoping

**When NOT to write:**
- Work that requires formal acceptance criteria and traceability
- Cross-org changes (upgrade to a Requirements Document)
- Changes with significant technical trade-offs (upgrade to a TDD)

**Inspired by:** Amazon's one-pager tradition for quick proposals. Uber's lightweight RFC template for team-scoped changes. The principle that documentation effort should be proportional to the change's complexity and blast radius.

## When to Split PRD and TRD

The default is a combined Requirements Document. Split into separate PRD and TRD when:

- The project spans more than one team with separate product and engineering owners
- The project spans more than one quarter
- Product and technical stakeholders operate on different review cadences
- Regulatory or compliance requirements mandate separate sign-off chains

When splitting: the PRD covers Sections 1-5 and 11-15 of the Requirements Template, while the TRD covers Sections 6-10. Both must cross-reference each other.

## The Document Pipeline

Documents follow a defined sequence. Each builds on the previous one:

```
One-Pager (optional)        → Quick alignment on the idea
    ↓
Requirements Document       → WHAT the system needs to do (approved before next step)
    ↓
Technical Design Document   → HOW the system will be built (approved before implementation)
    ↓
ADRs (as needed)           → Significant decisions captured along the way
    ↓
Implementation (Jira)       → Build, test, deploy
```

Every approval must be recorded in the document's Approval Record table: this creates the audit trail that compliance teams and future engineers need.
