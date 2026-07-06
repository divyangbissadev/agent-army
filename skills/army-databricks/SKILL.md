---
name: army-databricks
description: Operating protocol for all Databricks work. Use whenever a task touches Databricks: workspaces, Spark, Delta, Unity Catalog, DLT/Lakeflow, jobs, warehouses, or MLflow.
---

# Databricks Protocol

The lakehouse is a shared, metered, governed environment: every action has
a cost line and a blast radius. This protocol binds databricks-engineer,
databricks-platform, data-engineer, and ai-engineer whenever they touch
Databricks.

## Environment detection (before anything)

1. MCP first: if a Databricks MCP server is connected, load its tools via
   ToolSearch and prefer them over shelling out.
2. Else CLI: `databricks auth profiles` reveals workspaces; never assume
   which one, and never target prod by default. State the chosen profile,
   catalog, and warehouse in one line before acting.
3. Repo signals: `databricks.yml` means Asset Bundles own deployment; a
   terraform dir with the databricks provider means IaC owns workspace
   objects. Work through what exists (doctrine: ecosystem deference).

## Cost frugality (tokens have a payroll; DBUs have a bigger one)

- Read before compute: system tables, table properties, DESCRIBE DETAIL,
  and query history answer most questions without starting anything.
- Sample before scanning: LIMIT and TABLESAMPLE for exploration; a full
  table scan on a large table needs a reason stated.
- Never create, resize, or restart compute silently: say what and why, use
  auto-terminating job compute or serverless, and never leave an
  all-purpose cluster running after the task.
- Schedule nothing without stating its per-run cost shape.

## Safety rails (mechanical where possible)

- Human gate, always: DROP TABLE/SCHEMA/CATALOG, VACUUM with reduced
  retention, permanent deletes, prod table overwrites, permission
  mass-changes, deleting jobs or pipelines. The blast-radius guard asks on
  `databricks ... delete/rm` commands; SQL drops are caught by the SQL rule.
- Dev/prod separation: changes land in the dev catalog or bundle target
  first; only validated changes promote. Writing to a prod catalog from an
  interactive session is a finding.
- Time travel is the undo button: before risky table operations, note the
  current version (DESCRIBE HISTORY) so RESTORE is one command.

## Quality gates (army-tdd translated)

- Transform logic: local unit tests with fixture DataFrames (pyspark plus
  chispa or assertDataFrameEqual), red first, no cluster needed.
- Pipelines: DLT/Lakeflow expectations encode invariants and fail loudly;
  a pipeline that quarantines silently must report counts.
- Jobs: a bounded-sample dry run in dev precedes the first full run;
  "the job succeeded" means you quote the run output or run page state.
- Data checks: row counts, uniqueness of declared keys, and freshness
  asserted after any backfill, in the output.

## Routing within the army

Table and pipeline correctness: databricks-engineer. Governance, compute
policy, CI/CD, cost programs: databricks-platform. Cross-platform pipeline
architecture: data-engineer. LLM and agent workloads on Databricks:
ai-engineer with databricks-engineer for the plumbing.
