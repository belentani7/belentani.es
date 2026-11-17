# Safe PC Git reconciliation (Windows)

Belentani OS and Studio have important new GitHub branches. The user's Windows machine may be unavailable through Desktop Commander; a missing connector does not justify altering files or losing uncommitted work.

## Script
scripts/sync-pc-git-safe.ps1, PowerShell 5.1+, requires only Git.
It checks priority repositories under Documents\00_REPOS and writes a report to Documents\01_DOCS\BELENTANI_PC_GIT_SYNC_SAFE.json.

Default: inventory ONLY, no network, no working tree change.
-Fetch: git fetch --no-tags origin; updates refs only and records which repos have unavailable remotes.
-Fetch -Preview: also creates a **separate detached worktree** in Documents\00_REPOS\_PREVIEW_BELENTANI_OS_20261117 at origin/feat/artist-os-runtime-unification-20261117 if the target directory does not exist. Existing worktree, local branch, dirty edits and untracked files are untouched.

## From a terminal on the connected PC
powershell -NoProfile -File scripts\sync-pc-git-safe.ps1
powershell -NoProfile -File scripts\sync-pc-git-safe.ps1 -Fetch
powershell -NoProfile -File scripts\sync-pc-git-safe.ps1 -Fetch -Preview

Do not invoke -Fetch or -Preview unless GitHub remote access is intended. The script NEVER merges, pulls, resets, cleans, deletes or pushes. It does not sync Google Drive files; Drive remains the separate documented source of truth.

## Acceptance criteria
- No remote tokens or raw remote URLs are written to JSON.
- Untracked and tracked-dirty counts surfaced for every repository.
- Missing local repositories are reported as NOT_LOCAL; missing remotes as FAILED, not deleted.
- No operation can overwrite an existing _PREVIEW_BELENTANI_OS_20261117 directory.
- CI contract: node scripts/check-pc-sync-contract.mjs.
- Full operational testing requires connected Windows device; GitHub CI only validates static safety guards.

## Recovery priorities
Main candidate: belentani.es PR #92; Studio source PR #6; Visual Engine PR #22. The remote refs are not a substitute for the bundles and uncommitted patch previously preserved under Documents\04_ARCHIVE\Git-preservacion-20261117.
