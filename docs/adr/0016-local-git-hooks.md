# 0016 - Local Git Hooks

## Status

Accepted

## Context

The project explicitly avoids GitHub Actions. Quality gates need to run locally before commits and pushes.

## Decision

Use plain `.githooks/` wired by `make install-hooks`.

Hooks:

- `pre-commit`: npm format check, lint/type check, and `gitleaks protect --staged`.
- `commit-msg`: Conventional Commits validation.
- `pre-push`: `make test`, `make build`, and `make smoke`.
- `post-merge` and `post-checkout`: install dependencies if lockfile changes.

## Consequences

- Contributors do not need an extra hook framework.
- Hooks are transparent shell scripts.
- Local machines need Node, npm, and gitleaks installed.

## Alternatives Considered

- Lefthook. Rejected because plain hooks are enough for this project.
- GitHub Actions. Rejected by project constraint.

