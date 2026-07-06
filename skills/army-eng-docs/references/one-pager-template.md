# One-Pager Template

A lightweight document for pitching ideas, scoping small features, or proposing changes that don't need a full Requirements or Design Doc. Inspired by Amazon's one-pager tradition and Uber's lightweight RFC template for team-scoped changes.

## When to Use

- Early-stage idea exploration
- Small features contained within one team
- Quick proposals needing alignment in days, not weeks
- Spike or proof-of-concept scoping
- When someone asks "should we build this?" and you need a structured answer

## Template

```markdown
# [Feature/Proposal Name]: One-Pager

| Field | Value |
|-------|-------|
| **Author** | |
| **Date** | |
| **Status** | Proposed · Accepted · Rejected · Parked |
| **Audience** | |

## Problem

<!--
  AGENT GUIDANCE:
  - State the problem in 2-3 sentences.
  - Answer: What is broken, missing, or suboptimal? Who is affected? What is the cost of inaction?
  - Use specific data if available: "Support tickets for X increased 40% in Q3" not "Users are unhappy."
-->

## Proposal

<!--
  AGENT GUIDANCE:
  - Describe the proposed solution in 3-5 sentences.
  - Focus on what it does and why this approach was chosen.
  - Include just enough technical detail to evaluate feasibility: this is not a design doc.
-->

## Key Trade-offs

<!--
  AGENT GUIDANCE:
  - List the 2-3 most important trade-offs or risks.
  - For each, explain what you're giving up and why it's acceptable.
  - Be honest about unknowns: "We don't yet know X, but we can learn this during a 1-week spike."
-->

## Effort Estimate

<!--
  AGENT GUIDANCE:
  - Provide a t-shirt size (S/M/L/XL) with a rough time range.
  - Note dependencies on other teams if any.
  - Example: "M: approximately 2-3 sprints for 2 engineers. No cross-team dependencies."
-->

## Success Criteria

<!--
  AGENT GUIDANCE:
  - Define 2-3 measurable outcomes that determine if this was worth doing.
  - Use concrete numbers or dates, not vague outcomes.
-->

## Next Steps

<!--
  AGENT GUIDANCE:
  - Define the immediate action: "If approved, author will draft a Requirements Document by [date]."
  - Or: "Author will conduct a 1-week spike to validate feasibility."
  - Or: "This can proceed directly to implementation: no further documentation needed."
-->
```

## One-Pager Best Practices

**Fit on one page.** If you're going beyond ~500 words of primary content, you need a Requirements Document, not a One-Pager. The constraint forces clarity.

**Lead with the problem.** Amazon's PR/FAQ process starts with the customer problem. Even for internal proposals, the Problem section should be the strongest part of the document. If you can't articulate the problem clearly, the solution isn't ready to propose.

**Include "do nothing" as a baseline.** Google design docs always consider the "do nothing" alternative. A one-pager should make it clear why inaction is unacceptable.

**Name an owner.** Every one-pager should have a clear author who is also the owner of the next step. Documents with ambiguous ownership stall.

**Timebox the decision.** Unlike full Requirements Documents, one-pagers should be reviewed and decided on within one week. If the decision takes longer, the proposal likely needs a fuller document.
