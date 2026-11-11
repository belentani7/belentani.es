#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(git rev-parse --show-toplevel)"
echo "[BELENTANI] Environment diagnostics"
failed=0
for tool in git node corepack python3 gh; do
  if command -v "$tool" >/dev/null 2>&1; then
    printf '  %-9s %s\n' "$tool" "$(command -v "$tool")"
  else
    echo "  MISSING: $tool"
    failed=1
  fi
done
if [[ -f package.json ]]; then
  expected="$(node -p 'require("./package.json").packageManager.split("@").pop()')" || exit 1
  if command -v corepack >/dev/null 2>&1; then
    actual="$(corepack pnpm --version)" || exit 1
    [[ "$actual" == "$expected" ]] || { echo "  pnpm mismatch: $actual != $expected"; failed=1; }
  fi
fi
[[ -x node_modules/.bin/next ]] || { echo "  Next.js dependencies not installed"; failed=1; }
git status --short --branch
if [[ "$failed" != 0 ]]; then
  echo "[BELENTANI] Run: bash .devcontainer/scripts/bootstrap.sh" >&2
  exit 1
fi
echo "[BELENTANI] Toolchain OK (application tests not run)"
