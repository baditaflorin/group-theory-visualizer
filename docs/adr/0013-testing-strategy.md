# 0013 - Testing Strategy

## Status

Accepted

## Context

The app has deterministic math logic plus browser-only rendering. Tests should protect the math and verify the static site works after build.

## Decision

Use:

- Vitest for unit tests colocated with TypeScript logic.
- Playwright for one static-site happy-path smoke test.
- `scripts/smoke.sh` to build, serve `docs/`, and run Playwright.
- `make test`, `make lint`, `make build`, and `make smoke` as the local quality gates.

## Consequences

- Core algebra gets fast deterministic coverage.
- Smoke tests catch base-path, Pages output, and rendering regressions.
- No GitHub Actions are required.

## Alternatives Considered

- Manual-only QA. Rejected because visual apps still need repeatable checks.
- Browser snapshot testing for every state. Rejected for v1 because it would slow iteration.

