# Postmortem

## What Was Built

V1 shipped as a pure GitHub Pages app at:

https://baditaflorin.github.io/group-theory-visualizer/

The app includes a curated finite-group catalog, a GAP-style table-backed WASM kernel, GraphViz WASM
Cayley maps, Three.js symmetry scenes, multiplication tables, element exploration, local LLM opt-in,
repo and PayPal links, and visible version/commit metadata.

## Was Mode A Correct?

Yes. Mode A was the right choice. The core computation fits comfortably in the browser, the catalog
is small, and no v1 feature needs secrets, auth, shared writes, or a runtime database.

Mode B would be useful only if the catalog becomes externally sourced or much larger. Mode C is still
unjustified for v1.

## What Worked

- GitHub Pages from `main` `/docs` kept deployment simple.
- Lazy-loading Three.js and GraphViz kept the first app bundle under the target budget.
- The deterministic catalog generator made tests and static artifacts agree.
- The small WASM kernel gave the app a real compiled math path without dragging in full GAP.

## What Did Not Work

- Importing the broad `@hpcc-js/wasm` entrypoint initially pulled an unused DuckDB chunk. Switching to
  `@hpcc-js/wasm/graphviz` fixed it.
- Vite 8/Rolldown type expectations rejected an older manual chunk object shape, so chunking was left
  to dynamic imports.
- Exact self-referential commit embedding is impossible in a committed static file. The app shows the
  embedded build commit and also fetches the latest public `main` commit from GitHub.

## Tech Debt Accepted

- Full GAP syntax and arbitrary finitely presented groups are not implemented.
- GraphViz layout is lazy but still a large chunk when the Map tab is opened.
- The local LLM integration assumes an Ollama-like JSON response and does not stream yet.
- The Three.js scenes are symbolic symmetry scenes, not mathematically exhaustive action renderers.

## Next Improvements

1. Add a small GAP-like expression parser for products, generated subgroups, and cosets.
2. Add Web Worker isolation for larger Cayley graphs and GraphViz layout cancellation.
3. Add more symmetry-specific scenes, especially cube/octahedral, tetrahedral, and permutation actions.

## Time

Estimated v1 scaffold and implementation time was roughly one focused work session. Actual time stayed
within that shape, with most extra effort going into Pages-safe build output, local hooks, and bundle
size cleanup.
