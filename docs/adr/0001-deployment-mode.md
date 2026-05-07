# 0001 - Deployment Mode

## Status

Accepted

## Context

The application visualizes finite groups, Cayley graphs, multiplication tables, symmetry scenes, and local explanatory assistance. The default project constraint is GitHub Pages first, and a runtime backend must be justified before it is introduced.

## Decision

Use Mode A: Pure GitHub Pages.

All v1 runtime behavior runs in the browser. Finite-group computations run in TypeScript plus a small WebAssembly kernel. Graph layout uses GraphViz WASM. 3D scenes use Three.js. The optional local LLM panel talks only to a user-controlled local endpoint, with no hosted backend and no embedded secrets.

## Consequences

- The public surface is static HTML, CSS, JS, WASM, and JSON assets.
- GitHub Pages is enough for production hosting.
- There is no server, auth layer, runtime database, Docker image, nginx, or Prometheus in v1.
- Browser performance and bundle size need active attention because computation is client-side.

## Alternatives Considered

- Mode B: GitHub Pages plus pre-built data. Rejected for v1 because the seed group catalog is small and deterministic.
- Mode C: Pages frontend plus Docker backend. Rejected because v1 has no secrets, shared writes, cross-device sync, or runtime-only data.
