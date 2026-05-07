# 0017 - Dependency Policy

## Status

Accepted

## Context

The app depends on visualization, WASM, testing, and frontend libraries. Dependencies should reduce risk rather than expand it.

## Decision

Use production-ready libraries with active maintenance and clear value:

- React for UI.
- Vite for build tooling.
- Three.js for 3D rendering.
- `@hpcc-js/wasm` for GraphViz layout.
- Zod for schema validation.
- TanStack Query for cached async data.
- Comlink for worker-friendly async boundaries.
- Vitest, Testing Library, ESLint, Prettier, and Playwright for quality.

## Consequences

- Avoids custom graph layout and rendering engines.
- Dependency updates should be intentional and checked with `npm audit`.
- Heavy libraries are lazy-loaded to protect the initial bundle.

## Alternatives Considered

- Custom graph layout. Rejected because GraphViz already handles this well.
- Custom 3D renderer. Rejected because Three.js is the proven browser 3D path.

