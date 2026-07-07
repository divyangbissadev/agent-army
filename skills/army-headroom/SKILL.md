---
name: army-headroom
description: Context compression and session-learning via headroom (headroom-ai). Use when setting up token-efficient agent runs, when bulky tool output burns context, or when mining session learnings for the second brain.
---

# Headroom Protocol

Headroom (github.com/headroomlabs-ai/headroom, `headroom-ai` on PyPI) is the
mechanical complement to army-frugal-context: frugal-context governs how
agents behave, headroom compresses what actually reaches the model. It cuts
tool output, JSON, logs, and history by 50-90% while preserving answer
accuracy, and its `learn` command mines finished sessions for corrections.

## Where it sits in the army

| Layer | Concern | Owner |
|-------|---------|-------|
| Behavior | Read, search, and delegate frugally | army-frugal-context |
| Transport | Compress messages before the API | headroom (this skill) |
| Memory | Persist what sessions taught us | army-second-brain, army-compound |

Headroom's `learn` output is raw material for the second brain, not a
replacement for it: promote durable corrections into solutions notes or
ADRs; leave machine-local noise in CLAUDE.local.md.

## Setup (once per machine)

1. Install: `pip install "headroom-ai[all]"` (or `pipx install` to keep it
   out of project environments). Verify with `headroom --version`.
2. Pick one integration mode, lowest-friction first:
   - **learn only** (safest start): no wrapping; run `headroom learn` after
     sessions to mine corrections into `CLAUDE.local.md` (gitignored by
     default).
   - **wrap**: `headroom wrap claude` runs Claude Code through the
     compressor per invocation; opt-in per shell, easy to abandon.
   - **proxy**: `headroom proxy --port 8787` as a zero-code gateway for
     every client on the machine; most leverage, most blast radius.
3. Confirm `CLAUDE.local.md` is gitignored in any repo where learn runs.

## Operating rules

- Compression is lossy by intent. On high-stakes work (security review,
  production migration, numeric reconciliation) run unwrapped or verify
  key facts against the originals; reversible mode (CCR) can retrieve
  originals via `headroom_retrieve` when connected as an MCP server.
- `headroom learn` runs after a session, never during: review its proposed
  corrections before they land in a shared file (CLAUDE.md, AGENTS.md);
  auto-append only to the machine-local CLAUDE.local.md.
- Weekly, or at retro time, sweep CLAUDE.local.md: promote anything still
  true and repo-relevant into the second brain (solutions note or ADR via
  army-compound), then prune the local file. Unswept local memory rots.
- If wrapped output looks garbled or a model starts misreading tool
  results, unwrap first and re-run before debugging anything else; the
  compressor is a suspect like any other middleware.
