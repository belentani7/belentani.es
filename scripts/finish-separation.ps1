$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$bucket = 'C:\Users\USER\_bucket_descartes\2026-10-06_belentani_rotation'
$manifest = Join-Path $bucket '_MANIFEST_MOVED.csv'
$moves = @(
  @{ Source='app\(immersive)\duck'; Destination='_satellites\duck\app'; Reason='Separate artist' }
)
foreach ($move in $moves) {
  $source = [IO.Path]::GetFullPath((Join-Path $root $move.Source))
  $destination = [IO.Path]::GetFullPath((Join-Path $root $move.Destination))
  if (-not $source.StartsWith($root + '\') -or -not $destination.StartsWith($root + '\_satellites\')) { throw 'Invalid target' }
  if (-not (Test-Path -LiteralPath $source)) { continue }
  if (Test-Path -LiteralPath $destination) { throw 'Destination exists' }
  New-Item -ItemType Directory -Path (Split-Path $destination) -Force | Out-Null
  Move-Item -LiteralPath $source -Destination $destination
  [pscustomobject]@{ruta_origen=$source; ruta_destino=$destination; fecha=(Get-Date).ToString('o'); motivo=$move.Reason; reversible='true'} | Export-Csv -LiteralPath $manifest -Append -NoTypeInformation
}
Write-Output 'Duck route archived with manifest. Existing API retained.'
