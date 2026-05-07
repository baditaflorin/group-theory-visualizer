# 0003 - Frontend Framework And Build Tooling

## Status

Accepted

## Context

The app needs TypeScript strict mode, lazy loading, static builds for GitHub Pages, and enough component structure for a rich interactive UI.

## Decision

Use React, TypeScript, Vite, Vitest, Playwright, ESLint, Prettier, and Tailwind CSS.

## Consequences

- Vite handles a fast local dev loop and hashed production assets.
- React gives predictable state composition for the explorer UI.
- Heavy Three.js and GraphViz code can be split behind dynamic imports.
- Tailwind keeps the visual system compact while still allowing bespoke layouts.

## Alternatives Considered

- Vanilla TypeScript. Rejected because interaction complexity is high enough to benefit from components.
- Next.js. Rejected because static GitHub Pages hosting does not need a server-oriented framework.
- Svelte. Viable, but React has broader ecosystem support for testing and visualization examples.

