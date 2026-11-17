// Cross-platform contract check for the optional Windows PowerShell sync script.
// Never tries to access the user's computer or network from CI.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('./sync-pc-git-safe.ps1', import.meta.url), 'utf8');

assert.match(source, /\[switch\]\$Fetch/, 'Network fetch must be opt-in');
assert.match(source, /\[switch\]\$Preview/, 'New preview worktree must be opt-in');
assert.match(source, /if \(\$Preview -and -not \$Fetch\)/, 'Preview must depend on a fresh fetch');
assert.match(source, /git -C \$path status --porcelain=v1/, 'Dirty files must be recorded');
assert.match(source, /git -C \$path fetch --no-tags origin/, 'Fetch must not update the working tree');
assert.match(source, /if \(Test-Path -LiteralPath \$worktree\)/, 'Existing preview directory must be protected');
assert.match(source, /git -C \$website worktree add --detach/, 'Preview must use a detached worktree');
assert.doesNotMatch(source, /^\s*& git[^\r\n]*\b(?:pull|reset|clean|push|checkout|switch)\b/m,
  'The script must never mutate existing branches or publish to remotes');
assert.doesNotMatch(source, /^\s*(?:Remove-Item|Clear-Content|Set-Content)\b/m,
  'No deletion or modification of original files');
console.log('PC Git sync contract OK: read-only default, fetch opt-in, isolated preview.');
