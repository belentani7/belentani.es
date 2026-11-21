$ErrorActionPreference = 'Stop'
$source = [IO.Path]::GetFullPath('C:\Users\USER\Documents\09_ARCHIVO\GITHUB_CONSOLIDACION\github-dump')
$bucket = [IO.Path]::GetFullPath('C:\Users\USER\_bucket_descartes\2026-10-06_belentani_rotation')
$destination = Join-Path $bucket 'repos_rotados\github-dump'
if (-not $source.StartsWith('C:\Users\USER\Documents\09_ARCHIVO\GITHUB_CONSOLIDACION\')) { throw 'Unexpected source' }
if (-not $destination.StartsWith($bucket + '\')) { throw 'Unexpected destination' }
if (-not (Test-Path -LiteralPath $source)) { throw 'Source absent or already rotated' }
if (Test-Path -LiteralPath $destination) { throw 'Destination exists' }
$active = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($source) }
if ($active) { throw 'Archive is referenced by an active process; rotation skipped' }
$inventory = Get-Content -LiteralPath (Join-Path $bucket '_MANIFESTS\local-repos.json') -Raw | ConvertFrom-Json
$repos = @($inventory | Where-Object { $_.path.StartsWith($source + '\') })
if ($repos | Where-Object worktree) { throw 'Linked worktree detected; rotation skipped' }
New-Item -ItemType Directory -Path (Split-Path $destination) -Force | Out-Null
$manifest = Join-Path $bucket '_MANIFEST_MOVED.csv'
[pscustomobject]@{ruta_origen=$source; ruta_destino=$destination; fecha=(Get-Date).ToString('o'); motivo='planned: intact historical repositories including git and uncommitted files'; reversible='true'} | Export-Csv -LiteralPath $manifest -Append -NoTypeInformation
Move-Item -LiteralPath $source -Destination $destination
foreach ($repo in $repos) {
  [pscustomobject]@{ruta_origen=$repo.path; ruta_destino=($destination + $repo.path.Substring($source.Length)); fecha=(Get-Date).ToString('o'); motivo='Historical repository preserved with complete working tree and git state'; reversible='true'} | Export-Csv -LiteralPath $manifest -Append -NoTypeInformation
}
Write-Output ('Repositories rotated intact: ' + $repos.Count)
