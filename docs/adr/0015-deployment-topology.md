# 0015 - Deployment Topology

## Status

Accepted

## Context

Mode A deploys only static files. The project does not need nginx, Docker Compose, TLS management, or a server port.

## Decision

Deploy only through GitHub Pages at https://baditaflorin.github.io/group-theory-visualizer/.

## Consequences

- No `deploy/` directory is required.
- `docs/deploy.md` documents Pages publishing, rollback, and custom domain notes.
- Runtime availability depends on GitHub Pages and browser capabilities.

## Alternatives Considered

- Docker backend on port 25342. Rejected because there is no runtime API in v1.

