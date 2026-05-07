#!/usr/bin/env bash
set -euo pipefail

npm run build

PORT="${PORT:-4173}"
BASE_URL="http://127.0.0.1:${PORT}/group-theory-visualizer/"

npx http-server docs -p "${PORT}" -c-1 >/tmp/group-theory-visualizer-smoke.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in $(seq 1 40); do
  if curl -fsS "${BASE_URL}" >/dev/null 2>&1; then
    break
  fi
  sleep 0.25
done

PLAYWRIGHT_BASE_URL="${BASE_URL}" npx playwright test

