---
description: Run code-reviewer on the current working diff with the army review bar
---

1. Collect the diff: `git diff` plus `git diff --cached` (and, if both are
   empty, the last commit via `git show`). If there is no diff at all, say so
   and stop.
2. Dispatch the code-reviewer agent on that diff with the army-review-standards
   skill as the bar, plus REPO-MAP.md conventions if present.
3. Relay the verdict and findings exactly (VERDICT, Blockers, Warnings, Nits).
   If FAIL, offer to route each blocker to the owning specialist agent for a
   fix, then re-review.
4. If the diff is high-stakes per the doctrine (security-adjacent,
   data-touching, hard to reverse), escalate to army-cross-review after the
   PASS: a different model vendor reviews the diff blind.
