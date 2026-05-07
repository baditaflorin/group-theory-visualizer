# 0009 - Configuration And Secrets Management

## Status

Accepted

## Context

The static app must never contain secrets. The optional local LLM integration needs only a user-controlled endpoint URL.

## Decision

Use build-time public Vite configuration only for non-secret defaults. Commit `.env.example` with placeholders and gitignore real `.env` files.

The app never embeds API keys, tokens, passwords, private keys, or internal hostnames.

## Consequences

- Users can point the LLM panel at `http://localhost:11434/api/generate` or another local endpoint.
- Public GitHub Pages deployment contains no secrets.
- Secret scanning in local hooks protects commits.

## Alternatives Considered

- Hosted LLM API key in frontend. Rejected because frontend secrets are not secrets.
- Proxy backend for LLM calls. Rejected because it would force Mode C for a non-core v1 feature.

