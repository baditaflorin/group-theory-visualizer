# 0011 - Logging Strategy

## Status

Accepted

## Context

Mode A has no server-side logs. Browser logs should help local development without polluting production.

## Decision

Use minimal browser console output in development only. Production errors are shown through UI error states and toasts.

## Consequences

- No server log aggregation is needed.
- Production builds should have no routine console noise.
- Smoke tests check for page-level failures.

## Alternatives Considered

- Client log beacon. Rejected because it adds analytics-like tracking and a network dependency.
