# Group Theory Visualizer

Live site: https://baditaflorin.github.io/group-theory-visualizer/

Repository: https://github.com/baditaflorin/group-theory-visualizer

Group Theory Visualizer is a static, browser-first explorer for finite groups, Cayley graphs, multiplication tables, and symmetry actions.

## Quickstart

```sh
npm install
make dev
make build
make test
make smoke
```

## Architecture

This project targets GitHub Pages as a pure static deployment. Runtime computation happens in the browser with TypeScript, WebAssembly, Three.js, and GraphViz WASM.

See the ADRs in `docs/adr/` and the architecture notes in `docs/architecture.md`.
