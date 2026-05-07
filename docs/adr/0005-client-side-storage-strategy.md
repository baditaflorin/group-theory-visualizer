# 0005 - Client-Side Storage Strategy

## Status

Accepted

## Context

The app needs to remember user preferences such as selected group, chosen generator, layout mode, and local LLM endpoint. It does not need cross-device sync.

## Decision

Use `localStorage` for small preference state.

## Consequences

- State survives reloads without asking for permissions.
- There is no privacy-sensitive account state.
- Storage failures can degrade gracefully by keeping in-memory state.

## Alternatives Considered

- IndexedDB. Rejected because the state is small and structured simply.
- OPFS. Rejected because no large user-generated files are stored.
- Server persistence. Rejected because v1 intentionally avoids auth and backend infrastructure.
