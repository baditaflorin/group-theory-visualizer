# 0002 - Architecture Overview And Module Boundaries

## Status

Accepted

## Context

The visualizer needs math logic, graph rendering, 3D rendering, persistence, and optional local explanation without blending these concerns into one large component.

## Decision

Use a client-only modular architecture:

- `features/groups`: group definitions, operations, Cayley graph generation, multiplication tables, invariants.
- `features/visualization`: GraphViz layout and Three.js symmetry scenes.
- `features/assistant`: optional local LLM request/response flow.
- `lib`: shared storage, errors, version metadata, and utility code.
- `components`: reusable app shell and UI controls.

## Consequences

- Math code can be tested without DOM or rendering.
- Rendering code can lazy-load heavy libraries.
- Local LLM support stays optional and cannot become an implicit backend dependency.

## Alternatives Considered

- Single-file prototype. Rejected because it would make tests and future group additions painful.
- Full domain package split. Rejected for v1 because one static app repo is simpler.

