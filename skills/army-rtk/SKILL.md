---
name: army-rtk
description: Command-output token filtering via rtk (Rust CLI proxy). Use when setting up token-efficient agent runs or when noisy dev-command output (git, tests, builds) bloats context.
---

# RTK Protocol

rtk (github.com/rtk-ai/rtk, homebrew-core, Apache 2.0) filters noisy dev
command output at the source before it enters context: deterministic
per-command filters for 100+ tools (git, pytest, docker, cargo, aws),
60-90% savings on those commands, under 10ms overhead, no model involved.

## Where it sits in the army

| Layer | Concern | Owner |
|-------|---------|-------|
| Behavior | Read, search, and delegate frugally | army-frugal-context |
| Source | Filter command output before context | rtk (this skill) |
| Transport | Compress messages before the API | army-headroom |
| Memory | Persist what sessions taught us | army-second-brain, army-compound |

rtk and headroom compose: rtk shrinks tool output deterministically,
headroom compresses whatever still reaches the message stream. Install rtk
first; it is the lower-risk, higher-certainty layer.

## Setup (once per machine)

1. Install: `brew install rtk` (or cargo, or release binaries). Verify with
   `rtk --version`.
2. Two usage modes:
   - **Explicit** (safest start): prefix commands yourself (`rtk git log`,
     `rtk pytest ...`) where output is known to be bulky.
   - **Hook**: `rtk init -g` installs a PreToolUse hook that transparently
     rewrites Bash commands to rtk equivalents across sessions.

## Hook-ordering rule (plugin mode)

The army already ships a PreToolUse Bash hook: the blast-radius guard
(guard-pretool.sh), which anchors dangerous-command rules to the command
position. If the rtk hook is active alongside it:

- Guard decisions must be made on the original command. After enabling the
  rtk hook, verify the guard still asks on a canary (`git push --force` on
  a scratch repo): if rewriting moved the verb past the guard, disable the
  rtk hook and fall back to explicit prefixing.
- Never prefix guard-watched verbs (force-push, hard reset, rm -rf,
  destructive SQL, kubectl delete, terraform destroy, publishes) with rtk;
  filtering is for reading, and destructive output deserves full verbosity.

## Operating rules

- Filtering is for routine reads. When debugging a failure, rerun the raw
  command: filtered output that hides one stack frame costs more than the
  tokens it saved.
- Do not stack rtk on commands already engineered to be terse (targeted
  grep, head-limited reads); double filtering adds risk and saves nothing.
- If a model starts misreading tool results, suspect the filter first: rerun
  raw, compare, then decide.
