# 0008 - Go Backend Project Layout

## Status

Accepted

## Context

The bootstrap requirements define Go layout for Mode B and Mode C. This project uses Mode A.

## Decision

Skip the Go backend entirely in v1.

## Consequences

- No `cmd/`, `internal/`, `pkg/`, `api/`, `configs/`, or Docker backend files are created.
- No runtime server, `/healthz`, `/readyz`, or `/metrics` endpoints exist.
- Backend layout should be introduced only if a future ADR moves the project to Mode B or Mode C.

## Alternatives Considered

- Add an unused Go skeleton. Rejected because it would create maintenance surface without product value.
