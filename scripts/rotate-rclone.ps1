param([switch]$IncludeRepositories)
$ErrorActionPreference = 'Stop'
$project = 'C:\Users\USER\Desktop\belentani.es'
$bucket = 'C:\Users\USER\_bucket_descartes\2026-10-06_belentani_rotation'
$remote = 'gdrive:BELENTANI_ARCHIVO_2026-10-06'
$manifest = Join-Path $bucket '_MANIFEST_REMOTE.csv'
$jobs = @(
  @{Source=(Join-Path $project '_private_audio_no_web'); Name='audio-privado'},
  @{Source=(Join-Path $project '.local-archive'); Name='canon-capturas'},
  @{Source=(Join-Path $bucket 'preflight-backup'); Name='respaldo-previo'},
  @{Source=(Join-Path $bucket 'historical'); Name='webs-historicas'}
)
if ($IncludeRepositories) { $jobs += @{Source=(Join-Path $bucket 'repos_rotados'); Name='repositorios'} }
foreach ($job in $jobs) {
  $source = [IO.Path]::GetFullPath($job.Source)
  if (-not ($source.StartsWith($project + '\') -or $source.StartsWith($bucket + '\'))) { throw 'Unexpected source' }
  if (-not (Test-Path -LiteralPath $source)) { continue }
  $destination = $remote + '/' + $job.Name
  [pscustomobject]@{source=$source;destination=$destination;date=(Get-Date).ToString('o');status='planned';reversible='true'} | Export-Csv -LiteralPath $manifest -Append -NoTypeInformation
  Write-Output ('Uploading and verifying: ' + $job.Name)
  & rclone move $source $destination --checksum --immutable --transfers 4 --checkers 8 --stats 30s --stats-one-line --log-level NOTICE --retries 2 --low-level-retries 3 --exclude '**/node_modules/**'
  if ($LASTEXITCODE -ne 0) { throw ('Transfer incomplete: ' + $job.Name + '. Completed files remain on Drive; remaining files stay local.') }
  [pscustomobject]@{source=$source;destination=$destination;date=(Get-Date).ToString('o');status='transferred-and-checksum-verified';reversible='true'} | Export-Csv -LiteralPath $manifest -Append -NoTypeInformation
  Write-Output ('Verified: ' + $job.Name)
}
& rclone copy (Join-Path $bucket '_MANIFESTS') ($remote + '/manifiestos') --checksum --immutable --log-level ERROR
if ($LASTEXITCODE -ne 0) { throw 'Inventory upload failed' }
foreach ($name in @('_MANIFEST_MOVED.csv','_MANIFEST_REMOTE.csv','Belentani-galaxias-fuentes.zip')) {
  & rclone copyto (Join-Path $bucket $name) ($remote + '/' + $name) --checksum --log-level ERROR
  if ($LASTEXITCODE -ne 0) { throw ('Upload failed: ' + $name) }
}
Write-Output ('Remote archive complete: ' + $remote)
