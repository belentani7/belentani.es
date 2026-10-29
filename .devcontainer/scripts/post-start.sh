#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(git rev-parse --show-toplevel)"
if [[ ! -x node_modules/.bin/next ]]; then
  echo "[BELENTANI] Dependencies missing after resume; repairing installation."
  bash .devcontainer/scripts/bootstrap.sh
fi
bash .devcontainer/scripts/doctor.sh
echo "[BELENTANI] Open Terminal > Run Task > BELENTANI: Dev server"
