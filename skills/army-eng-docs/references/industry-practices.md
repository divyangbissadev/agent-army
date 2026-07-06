# Engineering Documentation Practices Across Top Organizations

This reference summarizes how leading engineering organizations approach documentation. Use it when the user asks "how does Google/Amazon/Stripe do this?" or when justifying documentation practices.

## Google: Design Docs

Google's engineering culture is built around design docs as the primary planning artifact. Key practices:

**Culture.** When Google engineers encounter an unfamiliar system, their first question is "Where is the design doc?" Design docs are the most accessible entry point for understanding the thinking behind a system's creation, even when they drift out of sync with the implementation over time.

**Purpose.** Design docs serve multiple functions beyond original documentation: early identification of design issues (when changes are still cheap), achieving consensus across teams, ensuring cross-cutting concerns are addressed, scaling senior engineers' knowledge, and establishing clear ownership.

**Structure.** Google design docs typically include: context and scope, goals and non-goals, the actual design (system architecture, data model, API), alternatives considered, cross-cutting concerns (security, privacy, observability), and a timeline. The "alternatives considered" section frequently receives the most scrutiny from senior reviewers.

**Process.** The author circulates the doc informally first, then to a broader audience. Reviews happen asynchronously via comments. Design docs are living artifacts that should be updated as the system evolves: though in practice, changes often get isolated into amendment documents rather than updates to the original.

**Key insight.** "As software engineers our job is not to produce code per se, but rather to solve problems. Unstructured text, like in the form of a design doc, may be the better tool for solving problems early in a project lifecycle."

## Amazon: Writing Culture (PR/FAQ, Six-Pagers)

Amazon's documentation culture is arguably the most rigorous in the industry, built on a foundational belief that writing forces clarity.

**No PowerPoint.** Amazon banned slide presentations in favor of narrative documents. Meetings begin with 10-30 minutes of silent reading. This ensures everyone has the same depth of understanding before discussion begins.

**PR/FAQ (Working Backwards).** For new product proposals, Amazon's Press Release / Frequently Asked Questions format forces teams to articulate customer value before writing any code. The PR is written from the future perspective of launch day. If you can't write a compelling press release, the product isn't ready to build.

**Six-Pager.** For strategic decisions, technical deep dives, and annual planning. Structured as roughly: 2 pages of general background, 2 pages of specific background, 2 pages of action and plan. The constraint forces conciseness and prioritization.

**One-Pager.** Lightweight format for quick proposals, small ideas, or iteration scoping. Must literally fit on one page.

**Precise writing principles.** Amazon explicitly prohibits weasel words. "Matter-of-fact tone, and quantifiable statements, over fluff. Objective data should replace subjective opinions whenever possible." Documents do not include author names to keep focus on the ideas rather than the credentials.

**Key insight.** "If there's no document, it doesn't get done." Documents create the shared context that meetings alone cannot. The discipline of writing reveals gaps in thinking that verbal discussion masks.

## Uber: Tiered RFC Process

Uber's documentation practices evolved through multiple phases as the company scaled from tens to thousands of engineers.

**Evolution.** Uber started with informal "DUCK" documents (Design + Understanding + Constraints + Knowledge), which evolved into structured RFCs as the engineering team grew. As Uber exceeded 2,000 engineers, the RFC process itself was overhauled to address noise, ambiguity, and discoverability problems.

**Tiered approach.** The company introduced lightweight templates for team-scoped changes and heavyweight templates for organization-wide or company-wide changes. This proportional effort principle prevents small changes from requiring disproportionate documentation.

**Approver fields.** Complex proposals have named "approver" fields, ensuring key stakeholders explicitly review and sign off. This was added after learning that important documents were sometimes approved without sufficient scrutiny.

**Specialized templates.** Different engineering groups (Backend, Web, Mobile, Payments) created domain-specific templates. For example, the Payments RFC template included mandatory sections for regional and legal considerations, added after past failures.

**Discoverability.** Uber eventually built a centralized tool for storing and searching all engineering planning documents and PRDs. Before this, documents were scattered across Google Drive folders and wiki pages, making them hard to find.

**Key insight.** Documentation effort should be proportional to complexity and blast radius. A one-team change doesn't need the same rigor as a cross-org infrastructure migration.

## Stripe: Backward Compatibility and API Rigor

Stripe's documentation culture reflects its position as a payments infrastructure company where backward compatibility is existential.

**Breaking changes are always assessed.** Every design document explicitly evaluates backward compatibility. "No breaking changes" is a valid and valuable conclusion: the point is that the assessment happens, not that changes are avoided.

**API documentation as contract.** Stripe's public API documentation sets the industry standard for clarity, completeness, and developer experience. This rigor flows inward: internal API documentation is held to similar standards, with Swagger/OpenAPI specs as the source of truth.

**Readability benchmark.** Internal guidance uses "can be read in under 15 minutes" rather than page counts, which vary by rendering. This more accurately reflects the actual time cost on reviewers.

**Key insight.** The discipline of assessing backward compatibility for every change: even when there are none: prevents the assumption that compatibility is someone else's problem.

## Spotify: Architecture Decision Records (ADRs)

Spotify is one of the most prominent adopters of Architecture Decision Records as a complement to design documents.

**Separation of concerns.** Design docs capture the full design. ADRs capture individual decisions that need to survive across document revisions. When a design doc is superseded, the decisions it contained can be lost: ADRs prevent this.

**Immutability.** Once accepted, ADRs are not edited. Changed decisions get new ADRs that supersede the old ones, preserving the historical reasoning.

**Living index.** ADR directories in repositories serve as searchable decision logs. New engineers can trace why a system is built a certain way by reading the ADR log chronologically.

**Key insight.** Decisions decay faster than code. Recording the *why* behind a decision is more valuable than recording the *what*, because the *what* is visible in the code but the *why* is lost when the people who made the decision move on.

## Common Themes Across All Organizations

Despite different names and formats, top engineering organizations converge on these practices:

1. **Writing before coding.** Documentation is not bureaucracy: it is the design process itself.
2. **Proportional effort.** Match documentation rigor to the complexity and blast radius of the change.
3. **Alternatives are mandatory.** Every significant design must evaluate at least two credible alternatives, including "do nothing."
4. **Rationale over description.** The *why* is always more valuable than the *what*.
5. **Traceable approval.** Formal sign-off creates accountability and an audit trail.
6. **Living documents with explicit lifecycle.** Documents are updated, superseded, or deprecated: never silently abandoned.
7. **Inclusive review.** The best documents improve through feedback from diverse perspectives: not just senior engineers.
