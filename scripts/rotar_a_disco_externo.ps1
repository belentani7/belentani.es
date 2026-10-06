param([Parameter(Mandatory=$true)][string]$DestinationRoot)
$ErrorActionPreference = 'Stop'
$source = [IO.Path]::GetFullPath('C:\Users\USER\_bucket_descartes\2026-10-06_belentani_rotation\repos_rotados')
$external = [IO.Path]::GetFullPath($DestinationRoot)
$drive = [IO.Path]::GetPathRoot($external)
if ($drive -eq 'C:\' -or $drive -eq 'G:\' -or $drive -notmatch '^[A-Z]:\\$') { throw 'Use a connected physical external disk, not C or Google Drive.' }
$volume = Get-Volume -DriveLetter $drive.Substring(0,1) -ErrorAction Stop
if ($volume.DriveType -notin @('Fixed','Removable')) { throw 'Physical volume required' }
$destination = [IO.Path]::GetFullPath((Join-Path $external 'Belentani-archive-2026-10-06'))
if (-not $destination.StartsWith($external.TrimEnd('\') + '\')) { throw 'Invalid destination' }
if (Test-Path -LiteralPath $destination) { throw 'Destination already exists; no overwrite allowed' }
$files = @(Get-ChildItem -LiteralPath $source -File -Recurse -Force)
$size = ($files | Measure-Object Length -Sum).Sum
if ($volume.SizeRemaining -lt ($size * 1.05)) { throw 'Insufficient external disk space' }
$hashes = $files | ForEach-Object { [pscustomobject]@{path=$_.FullName.Substring($source.Length + 1); sha256=(Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash} }
New-Item -ItemType Directory -Path $external -Force | Out-Null
$hashes | Export-Csv -LiteralPath (Join-Path $external 'Belentani-before-move.csv') -NoTypeInformation
Move-Item -LiteralPath $source -Destination $destination
foreach ($file in $hashes) {
  if ((Get-FileHash -LiteralPath (Join-Path $destination $file.path) -Algorithm SHA256).Hash -ne $file.sha256) { throw ('Verification failed: ' + $file.path) }
}
[pscustomobject]@{ruta_origen=$source; ruta_destino=$destination; fecha=(Get-Date).ToString('o'); motivo='External physical archive, SHA256 verified'; reversible='true'} | Export-Csv -LiteralPath (Join-Path $external '_MANIFEST_MOVED.csv') -NoTypeInformation
Write-Output 'Archive moved and verified. Reverse using the recorded source and destination.'
