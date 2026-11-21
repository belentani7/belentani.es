param([switch]$IncludeRepositories)
$ErrorActionPreference = 'Stop'
$project = 'C:\Users\USER\Desktop\belentani.es'
$bucket = 'C:\Users\USER\_bucket_descartes\2026-10-06_belentani_rotation'
$driveRoot = 'G:\Mi unidad\BELENTANI_ARCHIVO_2026-10-06'
if (-not (Test-Path -LiteralPath 'G:\Mi unidad')) { throw 'Google Drive unavailable' }
New-Item -ItemType Directory -Path $driveRoot -Force | Out-Null
$jobs = @(
  @{Source=(Join-Path $project '_private_audio_no_web'); Name='audio-privado'},
  @{Source=(Join-Path $project '.local-archive'); Name='canon-capturas'},
  @{Source=(Join-Path $bucket 'preflight-backup'); Name='respaldo-previo'},
  @{Source=(Join-Path $bucket 'historical'); Name='webs-historicas'}
)
if ($IncludeRepositories) { $jobs += @{Source=(Join-Path $bucket 'repos_rotados'); Name='repositorios'} }
$manifest = Join-Path $bucket '_MANIFEST_G_DRIVE.csv'
foreach ($job in $jobs) {
  $source = [IO.Path]::GetFullPath($job.Source)
  $destination = [IO.Path]::GetFullPath((Join-Path $driveRoot $job.Name))
  if (-not ($source.StartsWith($project + '\') -or $source.StartsWith($bucket + '\'))) { throw 'Source outside authorized roots' }
  if (-not $destination.StartsWith($driveRoot + '\')) { throw 'Destination outside archive' }
  if (-not (Test-Path -LiteralPath $source)) { continue }
  if ((Test-Path -LiteralPath $destination) -and (Get-ChildItem -LiteralPath $destination -File -Recurse -Force | Select-Object -First 1)) { throw ('Nonempty destination already exists: ' + $job.Name) }
  $files = @(Get-ChildItem -LiteralPath $source -File -Recurse -Force | Where-Object { -not ($_.Attributes -band [IO.FileAttributes]::ReparsePoint) })
  $bytes = ($files | Measure-Object Length -Sum).Sum
  Write-Output ($job.Name + ': ' + $files.Count + ' files, ' + $bytes + ' bytes')
  $hashPath = Join-Path $bucket ('_HASHES_' + $job.Name + '.csv')
  $hashes = @($files | ForEach-Object { [pscustomobject]@{path=$_.FullName.Substring($source.Length + 1); sha256=(Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash} })
  $hashes | Export-Csv -LiteralPath $hashPath -NoTypeInformation
  [pscustomobject]@{source=$source;destination=$destination;date=(Get-Date).ToString('o');status='planned';files=$files.Count;bytes=$bytes;reversible='true'} | Export-Csv -LiteralPath $manifest -Append -NoTypeInformation
  New-Item -ItemType Directory -Path $destination -Force | Out-Null
  $moved = 0
  foreach ($file in $hashes) {
    $from = [IO.Path]::GetFullPath((Join-Path $source $file.path))
    $to = [IO.Path]::GetFullPath((Join-Path $destination $file.path))
    if (-not $from.StartsWith($source + '\') -or -not $to.StartsWith($destination + '\')) { throw 'Invalid file path' }
    if (Test-Path -LiteralPath $to) { throw 'Refusing file overwrite' }
    New-Item -ItemType Directory -Path (Split-Path $to) -Force | Out-Null
    Move-Item -LiteralPath $from -Destination $to
    $moved++
    if (($moved % 1000) -eq 0) { Write-Output ($job.Name + ': moved ' + $moved) }
  }
  foreach ($file in $hashes) {
    if ((Get-FileHash -LiteralPath (Join-Path $destination $file.path) -Algorithm SHA256).Hash -ne $file.sha256) { throw ('Hash mismatch: ' + $job.Name) }
  }
  [pscustomobject]@{source=$source;destination=$destination;date=(Get-Date).ToString('o');status='sha256-verified';files=$files.Count;bytes=$bytes;reversible='true'} | Export-Csv -LiteralPath $manifest -Append -NoTypeInformation
  Copy-Item -LiteralPath $hashPath -Destination $driveRoot
  Write-Output ($job.Name + ': SHA256 verified')
}
Copy-Item -LiteralPath (Join-Path $bucket '_MANIFEST_MOVED.csv') -Destination $driveRoot -Force
Copy-Item -LiteralPath $manifest -Destination $driveRoot -Force
Copy-Item -LiteralPath (Join-Path $bucket '_MANIFESTS') -Destination $driveRoot -Recurse -Force
$zip = Join-Path $bucket 'Belentani-galaxias-fuentes.zip'
if (Test-Path -LiteralPath $zip) {
  $zipTarget = Join-Path $driveRoot 'Belentani-galaxias-fuentes.zip'
  if (Test-Path -LiteralPath $zipTarget) { throw 'ZIP destination exists' }
  $hash = (Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash
  Move-Item -LiteralPath $zip -Destination $zipTarget
  if ((Get-FileHash -LiteralPath $zipTarget -Algorithm SHA256).Hash -ne $hash) { throw 'ZIP hash mismatch' }
}
Write-Output ('Archive available on Drive: ' + $driveRoot)
