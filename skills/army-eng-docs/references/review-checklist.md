# Engineering Document Review Checklist

Use this checklist when reviewing or improving an existing engineering document. Derived from review practices at Google (design doc review culture), Amazon (six-pager table reads), Stripe (backward compatibility rigor), and Uber (RFC approver process).

## How to Use This Checklist

When reviewing a document, work through each section below. For each item, mark it as Pass, Fail, or N/A. Provide specific feedback for any Fail items: point to the exact section and explain what's missing or unclear.

The review should take no more than 30 minutes for a well-written document. If it takes longer, the document is likely too long or too unclear: that's feedback in itself.

---

## Structure & Completeness

- [ ] **Document type is appropriate.** A one-pager isn't doing the job of a TDD. A TDD isn't restating requirements.
- [ ] **Metadata is complete.** Author, date, version, status, and reviewers are filled in.
- [ ] **No empty sections.** Every section either has content or has been removed.
- [ ] **Optional sections are justified.** If an optional section is included, it adds value. If omitted, it's truly not applicable.
- [ ] **Source-of-truth boundaries are respected.** The Requirements Doc doesn't prescribe implementation. The TDD doesn't restate scope or assumptions.
- [ ] **Cross-references are accurate.** Links to related documents work and point to the correct versions.

## Clarity & Precision

- [ ] **No weasel words.** Every claim about performance, scale, timing, or effort has concrete numbers. Search for: "fast," "scalable," "soon," "simple," "easy," "significant," "many," "few."
- [ ] **Acronyms defined on first use.** The glossary (or inline definitions) covers all domain-specific terms.
- [ ] **Audience-appropriate language.** Requirements Docs are accessible to non-technical readers. TDDs assume engineering competence.
- [ ] **Diagrams have titles, captions, and labeled connections.** No unlabeled boxes-and-arrows.
- [ ] **Alt text provided for all images/diagrams.** Accessibility is not optional.

## Decision Quality

- [ ] **Alternatives are genuinely considered.** At least two credible alternatives are evaluated, not strawmen. Google's review culture specifically probes whether alternatives were seriously explored.
- [ ] **Trade-offs are explicit.** Each decision states what is gained and what is given up.
- [ ] **Rationale is documented.** Future readers can understand WHY, not just WHAT. This is the highest-value content in any design document.
- [ ] **"Do nothing" is considered as a baseline.** If inaction is an option, it should be evaluated and explicitly rejected with reasoning.
- [ ] **Breaking changes are assessed.** The TDD explicitly confirms "no breaking changes" or documents each one with migration path and timeline.

## Risk & Honesty

- [ ] **Known risks have mitigations.** Each risk in the table has a concrete mitigation strategy, not "we'll handle it."
- [ ] **Open questions are tracked with owners.** Every open question has a named owner and a status. Questions should be resolved before approval.
- [ ] **Unknowns are acknowledged.** The document doesn't pretend to know things it doesn't. Honest uncertainty with a plan to resolve it is always better than false confidence.
- [ ] **Risks are in the right document.** Project-level risks in the Requirements Doc. Design-level risks in the TDD. No duplication.

## Testability & Traceability

- [ ] **Requirements are testable.** Each functional requirement can be verified by a specific test. "The system should be user-friendly" fails this test.
- [ ] **Traceability chain is intact.** Functional requirements trace to use cases/stories. Acceptance criteria trace to requirements. Technical requirements trace to functional/non-functional requirements.
- [ ] **Acceptance criteria are specific.** Each criterion has a clear pass/fail condition, not subjective judgment.
- [ ] **Definition of Done is defined.** The document states what "done" means before implementation begins.

## Operational Readiness (TDD-specific)

- [ ] **Deployment strategy is defined.** Blue/green, canary, rolling, feature flags: the approach is specified with a rollback procedure.
- [ ] **Observability is implemented, not just required.** The TDD defines specific log fields, trace integration, metrics, dashboards, SLIs/SLOs: not just "we will add monitoring."
- [ ] **Alerting has thresholds and escalation paths.** Not just "we'll alert on errors."
- [ ] **Failure modes are documented.** Circuit breakers, retries, fallbacks, graceful degradation: what happens when things break?
- [ ] **RTO and RPO are defined.** If the system goes down, how quickly must it recover and how much data loss is acceptable?

## Writing Quality

- [ ] **Concise.** Requirements Docs are readable in under 20 minutes. TDDs in under 10 minutes. Every sentence earns its place.
- [ ] **Prose over bullets for narrative content.** Bullets used only for enumerations, not for explanations.
- [ ] **Professional tone.** No humor, editorializing, or personal opinions.
- [ ] **Inclusive language.** No gendered pronouns for generic users. No ableist terminology. No culturally specific idioms.
- [ ] **Consistent terminology.** Terms from the Preferred Terminology table are used consistently.

## Approval & Versioning

- [ ] **Approval Record is present.** The document has a table recording who approved, when, and with what caveats.
- [ ] **Version number follows convention.** Major bump for scope changes. Minor bump for clarifications.
- [ ] **Revision History is current.** Every change is logged with version, date, author, and description.

---

## Review Anti-Patterns to Avoid

These are common review failure modes observed across engineering organizations:

**Rubber-stamping.** Approving without reading. Amazon's silent table-read forces engagement: consider adopting this practice for reviews.

**Bikeshedding.** Spending review time on formatting while ignoring architectural gaps. Focus review time on Sections 2 (Solution Overview), 3 (Detailed Design), and 10 (Alternatives Considered) of the TDD.

**Requiring perfection.** The document is a living artifact. If it's 80% right and the remaining 20% is tracked as open questions, approve it with caveats rather than blocking progress.

**Reviewing in isolation.** A TDD review without reading the Requirements Doc it references is meaningless. Always read the upstream document first.

**Ignoring the "Alternatives Considered" section.** If this section has only one alternative or only strawmen, push back. This is a sign the author hasn't done sufficient design exploration.
