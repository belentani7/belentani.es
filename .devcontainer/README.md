# BELENTANI Codespaces environment

This configuration is for **belentani7/belentani.es** (Next.js/React, TypeScript, pnpm, Vitest, Playwright). It does not create another repository, grant access to other repositories or make automatic Git pushes.

## First use / existing Codespace

1. Reuse the existing `belentani-es-vibe` Codespace; do not create a duplicate.
2. If GitHub says your monthly Codespaces usage or budget is exhausted, the existing Codespace cannot start until your allowance renews or you explicitly adjust billing. These repository files cannot bypass that account-level limit.
3. After access is restored, sync the `main` branch without discarding uncommitted work. From VS Code run **Codespaces: Rebuild Container** to apply this devcontainer to the *existing* Codespace.
4. `postCreateCommand` installs the exact pnpm version from `package.json` and dependencies from the frozen lockfile. `postStartCommand` checks tools and reinstalls dependencies only when missing.
5. Open **Terminal > Run Task** for Dev server, Quality gate, Browser tests, Doctor or Safe Git review. Port 3000 stays private by default.

## Runtime & quality

- Node 22, Python 3.12 and GitHub CLI via pinned-major devcontainer features.
- `pnpm@10.17.1` from `package.json`; use `corepack pnpm` to enforce the version even if the base image contains a different global pnpm.
- `corepack pnpm check:boundaries && corepack pnpm typecheck && corepack pnpm lint && corepack pnpm test && corepack pnpm build` is the quality gate; it stops on the first failure.
- Playwright Chromium installation is **on demand** (not downloaded at every startup to save storage).
- Do not commit credentials, secrets, private audio or generated artifacts. Git push, PR merges and deployments stay manual and require successful checks.
- Never put tokens in `devcontainer.json`, `tasks.json` or shell scripts. Use GitHub Codespaces secrets for authorized external services. GitHub authentication is provided by the platform when available.
- Docker and additional MCP tools are intentionally not automatically launched on the small 2-core machine; they should be enabled per task to avoid burning the quota.

## Budget control

Stop the Codespace when idle. A stopped Codespace can still use billed storage; manage retention from GitHub settings. This setup does **not** alter account budgets, machine size or idle-timeout settings.

## Diagnostics

```bash
bash .devcontainer/scripts/doctor.sh
bash .devcontainer/scripts/bootstrap.sh
corepack pnpm dev
```

An existing Codespace must be rebuilt before these image changes take effect. A repository commit does not itself rebuild or start the remote machine.
