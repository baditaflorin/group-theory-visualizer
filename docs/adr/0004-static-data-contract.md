# 0004 - Static Data Contract

## Status

Accepted

## Context

Mode A does not require a data-generation backend. The seed catalog still needs a stable contract so groups, examples, and UI labels remain predictable.

## Decision

Ship the v1 group catalog as typed source data and export a static JSON artifact at `docs/data/v1/groups.json` during build.

The schema version is `group-catalog/v1` and each group contains:

- `id`
- `name`
- `family`
- `order`
- `generators`
- `presentation`
- `description`
- `elements`
- `operationTable`

## Consequences

- The frontend can import typed data at build time and fetch the JSON artifact when validating the Pages output.
- Future breaking schema changes use `/data/v2/`.
- No stale scheduled data or server freshness concerns exist in v1.

## Alternatives Considered

- Fetch data from GitHub Releases. Rejected because the catalog is tiny.
- Compute every group from presentations in the browser. Rejected for v1 because curated groups give a faster, more reliable first experience.

