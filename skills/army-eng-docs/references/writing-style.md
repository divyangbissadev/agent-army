# Writing Style Guide for Engineering Documents

This guide synthesizes writing practices from Google's developer documentation style guide, Amazon's precise writing culture, and industry-standard technical writing principles.

## Preferred Style Reference

For questions not covered by this guide, defer to the [Google developer documentation style guide](https://developers.google.com/style).

## Core Principles

### Write for async understanding

Engineering documents are read by people who were not in the room when decisions were made. They are read months or years later by engineers trying to understand a system. Every sentence should be understandable without chasing down the author for context.

### Favor prose over bullets

Use concise paragraphs for explanations, rationale, and narrative content. Bullets are appropriate for enumerations, lists of items, or short factual points: but not for telling a story or explaining reasoning. Amazon's writing culture explicitly favors narrative over bullet lists because narrative forces the author to make logical connections explicit.

### Be precise

Replace vague language with specific data. Every claim should be verifiable.

| Vague (avoid) | Precise (prefer) |
|----------------|-------------------|
| The system should be fast | API response time under 200ms p95 |
| We expect significant growth | Current: 1,000 DAU. Projected: 10,000 DAU within 12 months |
| The migration should be straightforward | Migration requires 3 steps: export, transform, load. Estimated duration: 4 hours with 30-minute rollback window |
| We will add monitoring | Structured JSON logs to CloudWatch. P95 latency dashboard in Grafana. PagerDuty alert if error rate exceeds 1% over 5 minutes |
| Soon | By 2026-04-15 |

### Document decisions, not just outcomes

The most valuable part of an engineering document is the *why* behind decisions. Future readers don't need to know what you decided: they can read the code for that. They need to know *why you decided it* and *what you considered and rejected*. Google's design doc culture emphasizes that the "Alternatives Considered" section often receives the most scrutiny during review.

## Structure

### Outline first, write second

Create a skeleton of headings before writing prose. It's far easier to reorganize headings than restructured paragraphs. This practice is universal across Google, Amazon, and Uber's documentation cultures.

### Heading hierarchy

Use proper heading levels (H1 → H2 → H3) without skipping levels. This enables screen reader navigation and creates a navigable document outline.

- H1: Document title (one per document)
- H2: Major sections
- H3: Sub-sections within a major section
- H4: Rarely needed: if you're at H4 depth, consider restructuring

### Front-load important information

Google's technical writing guidance emphasizes that readers may only read the first paragraph. Put the most critical information: the summary, the recommendation, the key decision: at the beginning of each section.

## Terminology

Use these conventions for consistency across all documents:

| Preferred | Avoid | Reason |
|-----------|-------|--------|
| for example | e.g. | Avoid non-English abbreviations for clarity |
| that is | i.e. | Avoid non-English abbreviations for clarity |
| such as | like | "Like" implies similarity, not examples |
| endpoint | end-point, end point | Single compound word consistently |
| data store | datastore | Two words, unless it's a proper noun |
| repository | repo | Full word in documents; abbreviation acceptable in code |
| service | microservice | Use "service" unless the micro-architecture distinction matters |
| frontend | front-end, front end | Single compound word |
| backend | back-end, back end | Single compound word |
| codebase | code base, code-base | Single compound word |
| API | api, Api | Always uppercase |
| TDD | tdd, Tdd | Always uppercase for Technical Design Document |

Add project-specific terms to the Glossary section of each document.

## Accessible Writing

Write documentation that is clear and usable for people with varying abilities, input methods, and devices. Accessible writing also benefits non-native English speakers.

- Use clear, simple sentence structures. Avoid long, compound sentences.
- Don't rely on color, formatting, or spatial position to convey meaning (for example, don't write "see the red section above").
- Provide descriptive alt text for all images and diagrams.
- Use meaningful link text: avoid "click here" or bare URLs.
- Structure documents with proper heading hierarchy for screen reader navigation.

## Inclusive and Bias-Free Language

- Avoid gendered pronouns when referring to a generic user; use "they" or rephrase.
- Avoid ableist language: use "placeholder" not "dummy", "primary/replica" not "master/slave", "allowlist/denylist" not "whitelist/blacklist".
- Don't use culturally specific idioms or metaphors that may not translate.
- Refer to people by what they can do, not by limitations.

## Versioning Convention

All documents use a two-part version number: **vMAJOR.MINOR** (for example, v1.0, v1.1, v2.0).

| Change Type | Version Bump | Examples |
|-------------|-------------|----------|
| Scope change, new requirements, removed requirements | Major (v1.0 → v2.0) | Adding a new integration, removing a feature from scope |
| Clarification, typo fix, wording improvement | Minor (v1.0 → v1.1) | Rewording a requirement for clarity, fixing a broken link |

Record every version change in the Revision History table. Material changes (major bumps) require re-review and re-approval.

## Quality Checks

Run documents through a linter before submitting for review:

- **[Vale](https://vale.sh/)**: configurable prose linter that enforces style guide rules
- **[Grammarly](https://www.grammarly.com/)**: general grammar and readability checker
- **[markdownlint](https://github.com/DavidAnson/markdownlint)**: consistent markdown formatting
