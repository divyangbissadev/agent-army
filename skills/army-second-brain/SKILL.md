---
name: army-second-brain
description: The army's memory architecture. Use when recalling anything about a codebase: structure, past decisions, or lessons. Unifies the live code graph (codebase-memory-mcp), REPO-MAP.md, and solutions notes.
---

# Second Brain Protocol

The army remembers through three layers, each answering a different
question. Consulting memory is always cheaper than re-deriving; re-deriving
is always safer than trusting stale memory on high stakes. Know which layer
answers what.

## The three layers

| Layer | Answers | Freshness |
|-------|---------|-----------|
| Code graph (codebase-memory-mcp, when connected) | What calls what, where symbols live, blast radius of a diff | Live (background watcher resyncs) |
| REPO-MAP.md | What this repo IS: intent, commands, conventions, architecture narrative | As of its commit sha |
| solutions/ + ADRs | What we learned and decided, and why | As dated per note |

## Layer 1: the live code graph

Detection: ToolSearch for `codebase-memory` tools. Connected means
structural questions stop costing file exploration (documented ~99% token
reduction; structural queries run in milliseconds, locally, no API calls).

- Once per repo: `index_repository` with the absolute path (seconds for
  normal repos); leave auto-watch on so the graph tracks edits.
- Finding things: `search_graph` for symbols, `get_code_snippet` for source
  by qualified name, `get_architecture` for the cluster overview,
  `query_graph` (Cypher-like) for arbitrary relationship questions.
- Understanding flow: `trace_path` for caller and callee chains (depth 1-5)
  instead of grep-and-read archaeology.
- Before commit or review: `detect_changes` on the git diff for affected
  symbols and risk; code-reviewer briefs should include its output for
  blast radius.
- Decisions: `manage_adr` persists ADRs into the graph so
  `get_architecture` surfaces them; keep the markdown ADR (docs-writer) as
  the human copy and mirror into the graph where connected.

Reliability line (v0.8.x): trust structural queries (search, trace,
snippets, Cypher); treat semantic search as unverified, and if any query
returns suspiciously uniform results, fall back to grep and note it. The
graph augments the trust-boundaries doctrine; it never overrides a
re-verification on high-stakes work.

Not connected? Everything falls back to REPO-MAP.md plus Grep, as before.
Install (user decision, never silent): the server is a single MIT-licensed
binary from github.com/DeusData/codebase-memory-mcp; its install script
wires `~/.claude/.mcp.json`.

## Layer 2: the narrative map

REPO-MAP.md (skill army-repo-map) stays the source of intent: what the
repo is for, exact commands, conventions, hotspots. The graph knows every
edge but no purpose; the map knows purpose but goes stale. repo-analyst
uses the graph, when connected, to build and refresh the map faster and to
verify its architecture claims against real edges.

## Layer 3: episodic memory

solutions/ notes (skill army-compound) hold lessons; ADRs hold decisions.
Planning greps solutions/ first (doctrine step 4); the graph's ADR store
makes decisions queryable next to the code they govern.

## Recall order (any "how does X work" moment)

1. Graph query if connected (milliseconds, exact).
2. REPO-MAP.md section (narrative context).
3. solutions/ grep (has someone fought this before?).
4. Only then read files, and consider whether what you just derived belongs
   in a layer so nobody derives it again.
