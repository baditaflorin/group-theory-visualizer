# 0010 - GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The live GitHub Pages URL is a first-class deliverable from day one. GitHub Pages can serve from the `main` branch `/docs` directory.

## Decision

Publish from `main` branch `/docs`.

Vite builds to `docs/` with base path `/group-theory-visualizer/`, hashed assets, a copied `404.html` fallback, `manifest.webmanifest`, and service worker scope under the repository path.

## Consequences

- Built frontend assets are committed because Pages serves them directly.
- Documentation and ADRs also live under `docs/`.
- The build script cleans generated page assets without deleting documentation.
- Rollback is a normal git revert of the publishing commit.

## Alternatives Considered

- `gh-pages` branch. Rejected because it adds branch synchronization overhead.
- Root publishing from `main`. Rejected because source files and published files should remain visually separate.
