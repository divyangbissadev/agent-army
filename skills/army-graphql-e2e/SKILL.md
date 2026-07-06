---
name: army-graphql-e2e
description: End-to-end delivery protocol for GraphQL services, from domain model to cloud-agnostic deployment and documentation. Use when architecting or shipping a GraphQL backend, especially dashboard and aggregation systems.
---

# GraphQL End-to-End Protocol

Ship a GraphQL service as a sequence of gated phases. Each phase has an
owner agent and a done-check; the army's normal gates (spec approval, TDD,
review, verify hook) apply throughout. graphql-architect leads; this skill
is the route map.

## Phase 1: Domain and contract (before any server code)

- domain-modeler extracts the ubiquitous language and invariants
  (army-ddd); for dashboards, name the metrics, dimensions, time grains,
  and filters as domain concepts.
- graphql-architect writes the SDL: query shape driven by the actual
  screens (get the real dashboard queries from frontend-architect or the
  user), connections on lists, aggregate and time-series types
  first-class, input validation expressed in the schema where possible.
- Done-check: the SDL reviewed against 3 to 5 written client operations
  that cover the main screens; schema linter (graphql-inspector or
  equivalent) clean; change folder per army-spec approved.

## Phase 2: Walking skeleton (one query, end to end)

- Stand up the thinnest full path: server, one non-trivial query resolved
  from real data, contract test, container image, health and readiness
  endpoints, CI running tests and schema checks. Deploy it to a dev
  environment before widening.
- Done-check: one dashboard panel renders from the deployed skeleton.

## Phase 3: Resolvers and data (the bulk, via /army:loop)

- TDD per resolver path: contract test red, resolver green, dataloader on
  every list-crossing edge, aggregation pushed to the database or
  warehouse (SQL GROUP BY or read models), never computed row-by-row in
  resolvers.
- Read models for heavy dashboards: precomputed or materialized
  aggregates with stated freshness; the resolver reads, it does not crunch.
- Done-check per slice: trace evidence of no N+1, latency budget met on
  realistic data volume (state the volume).

## Phase 4: Security and limits

- Depth and cost limits, persisted queries for production clients,
  introspection policy, field-level authz in the domain layer,
  rate limits per client. security-engineer reviews the graph surface.
- Done-check: a hostile query suite (deep, wide, aliased, batched) is
  rejected with typed errors, in tests.

## Phase 5: Cloud-agnostic DevOps (devops-engineer + k8s-architect)

- Portability rule: the service depends on interfaces, not providers.
  Container images (multi-stage, non-root), configuration via environment
  per twelve-factor, Postgres-compatible storage or the repo's choice,
  OpenTelemetry for traces and metrics, structured logs to stdout.
- One deploy artifact, three targets supported by default: any managed
  container runtime, any Kubernetes (Helm chart or Kustomize in-repo),
  and plain compose for local. IaC per the repo's tool; no console clicks.
- GraphQL-specific ops: gateway or router config versioned in-repo,
  schema registry check in CI (breaking change fails), canary deploy with
  error-rate and p99 rollback triggers, APQ or CDN caching where public.
- Done-check: fresh-environment deploy from README instructions alone
  succeeds; rollback rehearsed once.

## Phase 6: Documentation (docs-writer, army-docs-standards)

- SDL descriptions on every public type and field (the schema IS the
  reference; generated docs from it, never a parallel handwritten copy).
- One quickstart (run locally, execute first query), one how-to per major
  consumer task (add a panel query, subscribe to updates), one
  architecture explanation with the read-model diagram, one runbook
  (common alerts, cache invalidation, schema rollback).
- Done-check: a new developer executes the quickstart cold; docs-writer
  verifies every sample against the running service.

## Dashboard-specific judgment

- Default to polling with short TTL and @defer for slow panels;
  subscriptions only for genuinely push-shaped data (alerts, live ops).
- One BFF graph per product surface beats one mega-graph serving
  everything; split when screens and teams diverge.
- The warehouse does aggregation, the graph does shaping, the client does
  neither.
