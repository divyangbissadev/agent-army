---
name: army-eng-docs
description: Generate and review engineering planning documents: Requirements (PRD+TRD), Design Docs, ADRs, and One-Pagers to the bar of Google, Amazon, Stripe, and Uber. Use when asked to write a spec, design doc, RFC, requirements, or review one.
---

# Engineering Documentation Standards

Produce planning documents that are concise, decision-driven, and structured
for async review. Naming note for this army: TDD always means test-driven
development (skill army-tdd); the document some orgs call a TDD is called a
Design Doc throughout.

## Core philosophy

1. **Writing is thinking.** The document is the design process, not
   bureaucracy; writing resolves ambiguity before code does.
2. **Start with the user.** Amazon works backwards from a press release;
   even internal tools define who benefits before what gets built.
3. **Document decisions, not just designs.** Alternatives Considered and
   the reasoning behind rejections is the most valuable section; it
   preempts every future "why didn't you just...".
4. **Proportional effort.** A one-page change does not need a six-page doc;
   scale to complexity and blast radius (Uber's tiered RFC lesson).
5. **No document, no meeting.** Documents create shared context meetings
   cannot.

## Which document

Full decision framework: `references/document-selection.md`.

| Signal                                      | Document               | Template |
|---------------------------------------------|------------------------|----------|
| New project, feature, or initiative         | Requirements (PRD+TRD) | `references/requirements-template.md` |
| Approved requirements need technical design | Design Doc             | `references/design-doc-template.md` |
| Architectural decision worth preserving     | ADR                    | `references/adr-template.md` |
| Idea pitch or small feature scoping         | One-Pager              | `references/one-pager-template.md` |
| Review or improve an existing doc           | Checklist              | `references/review-checklist.md` |

## How this plugs into the army

- **Upstream of /army:spec.** A Requirements Document owns the WHAT; the
  spec change folder derives its SHALL requirements and scenarios from it
  and references it, never duplicates it. Big efforts flow one-pager or
  requirements first, then spec, then plan.
- **Design Docs precede army-chief plans** on high blast-radius work; the
  plan implements the chosen design, and army-system-design supplies the
  numbers discipline (requirements with figures, capacity math).
- **One-Pagers and the product-manager brief are the same artifact**; use
  the one-pager template when the brief should circulate for async review.
- **ADRs here are the army's canonical format** (Nygard, consistent with
  army-docs-standards): context, decision, consequences, alternatives.
- **docs-writer executes this skill**; mp-grill-with-docs can drive the
  interview that fills a doc; army-judge with
  `references/review-checklist.md` as the rubric scores document quality
  when stakes warrant a blind review.

## Workflow

1. **Pick the type** from the table; ask only if genuinely ambiguous.
2. **Gather context**: audience, blast radius, prior art, approval process.
   Writing a Design Doc from a requirements doc: read the requirements doc
   first; it is the source of truth for scope, glossary, and success
   criteria.
3. **Load the one matching template** (never all of them) and follow its
   inline guidance and pitfall notes.
4. **Draft under the length gates**: Requirements readable in 20 minutes
   (3-8 pages), Design Docs in 10 (1-5 pages), One-Pagers under 2 pages,
   ADRs under 1 page; diagrams and appendices excluded from the limits.
5. **Output** as Markdown, named `{project}-{doc-type}.md`.

## Universal rules

- **No weasel words.** "Fast and scalable" becomes "under 200ms p95,
  10,000 concurrent users at launch, 50,000 within 12 months".
- **Source-of-truth boundaries.** Requirements own WHAT, Design Docs own
  HOW; reference upstream, never restate.
- **Every section earns its place.** Empty sections get filled or deleted;
  a section without decision-relevant information gets removed.
- **Diagrams over prose for architecture.** Mermaid, per
  `references/diagram-standards.md`.
- **Style** per `references/writing-style.md`: prose for rationale, bullets
  for enumerations only, active voice, acronyms defined on first use,
  inclusive language, accessible heading hierarchy, and no em-dashes
  (army-wide rule).

## Reference files (load on demand, never all upfront)

| File | When |
|------|------|
| `references/document-selection.md`    | Choosing the document type |
| `references/requirements-template.md` | Writing Requirements (PRD+TRD) |
| `references/design-doc-template.md`   | Writing a Design Doc |
| `references/adr-template.md`          | Writing an ADR |
| `references/one-pager-template.md`    | Writing a One-Pager or light RFC |
| `references/review-checklist.md`      | Reviewing a doc (also the army-judge rubric) |
| `references/writing-style.md`         | Detailed style guidance |
| `references/diagram-standards.md`     | Adding diagrams |
| `references/industry-practices.md`    | How top companies document |
