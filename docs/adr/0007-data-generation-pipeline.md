# 0007 - Data Generation Pipeline

## Status

Accepted

## Context

Mode B is not used. Still, the group catalog JSON should be reproducible for the static site.

## Decision

Do not create a Go or scheduled data-generation pipeline in v1. The build writes deterministic `docs/data/v1/groups.json` from typed frontend source.

## Consequences

- `make data` is unnecessary in v1.
- The static artifact is refreshed by `make build`.
- If the catalog becomes large or externally sourced, this ADR should be replaced with a Mode B pipeline ADR.

## Alternatives Considered

- Dedicated Go generator. Rejected because there are no external inputs.
- Release-hosted artifacts. Rejected because the artifact is small enough to commit.
