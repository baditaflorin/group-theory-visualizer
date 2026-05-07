# 0012 - Metrics And Observability

## Status

Accepted

## Context

The static app can run without collecting user behavior. The project does not need usage analytics to validate v1.

## Decision

Do not add analytics in v1.

Expose local, user-visible health signals instead: current version, embedded build commit, latest GitHub commit, selected group order, graph node count, and render status.

## Consequences

- No PII is collected.
- No analytics script affects performance or privacy.
- User feedback and GitHub stars are the primary public signals.

## Alternatives Considered

- Plausible analytics. Rejected for v1 to keep privacy posture simple.
- Self-hosted beacon. Rejected because it would require runtime infrastructure.

