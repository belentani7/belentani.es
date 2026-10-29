#!/usr/bin/env bash
# Idempotent setup for this repository. No API keys or paid services.
set -Eeuo pipefail
cd "$(git rev-parse --show-toplevel)"
echo "[BELENTANI] Preparing pinned Node/pnpm environment"
command -v node >/dev/null || { echo "Node.js is missing" >&2; exit 1; }
node -e 'if (Number(process.versions.node.split(".")[0]) < 22) { console.error("Node.js 22+ required"); process.exit(1); }'
command -v corepack >/dev/null || { echo "Corepack is missing; verify the Node devcontainer feature" >&2; exit 1; }
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable || { command -v sudo >/dev/null && sudo corepack enable; }
  hash -r
fi
command -v pnpm >/dev/null || { echo "Unable to activate pnpm through Corepack" >&2; exit 1; }
actual="$(pnpm --version)"
expected="$(node -p 'require("./package.json").packageManager.split("@").pop()')"
if [[ "$actual" != "$expected" ]]; then
  echo "Expected pnpm $expected but got $actual; verify Corepack configuration" >&2
  exit 1
fi
pnpm install --frozen-lockfile --prefer-offline
echo "[BELENTANI] Dependencies installed; start with: pnpm dev"
