# 0014 - Error Handling Conventions

## Status

Accepted

## Context

Errors can come from invalid group definitions, WASM loading, GraphViz rendering, Three.js initialization, storage access, or local LLM network calls.

## Decision

Use typed `Result`-style helpers for recoverable logic failures and React error boundaries for unexpected UI failures. User-facing errors should be plain language and actionable.

## Consequences

- Math functions avoid throwing for expected validation failures.
- Rendering failures do not blank the entire app.
- Local LLM failures are isolated to the assistant panel.

## Alternatives Considered

- Throw exceptions everywhere. Rejected because expected validation states are part of the UI.
- Silent fallbacks. Rejected because users need to know when a visualization could not load.

