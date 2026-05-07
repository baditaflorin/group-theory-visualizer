# 0006 - WASM Modules Used

## Status

Accepted

## Context

The project pitch calls for a GAP-style finite-group computation subset, GraphViz, and browser-first deployment. GitHub Pages cannot configure custom COOP/COEP headers.

## Decision

Use two WebAssembly paths:

- A small project-owned finite-group kernel compiled from WebAssembly text during build. It provides table-backed product, inverse, identity, and order helpers used by the TypeScript group engine.
- `@hpcc-js/wasm` for GraphViz layout, lazy-loaded when the graph view is active.

Avoid WASM features that require cross-origin isolation. Use plain `WebAssembly.instantiate` and package-hosted WASM assets that work on GitHub Pages.

## Consequences

- The app demonstrates a real WASM math kernel without taking on full GAP complexity.
- Graph layout remains battle-tested rather than hand-rolled.
- Full GAP compatibility is explicitly outside v1.

## Alternatives Considered

- Compile full GAP to WASM. Rejected for v1 due to size and build complexity.
- Use only TypeScript. Rejected because the product pitch specifically calls for a WASM computation subset.

