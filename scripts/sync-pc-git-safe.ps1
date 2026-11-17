<#
.SYNOPSIS
Safely inventory and fetch BELENTANI Git sources on Windows (PowerShell 5.1+).
.DESCRIPTION
Default mode is read-only: no checkout, pull, clean, reset, deletion or push.
Use -Fetch to update remote refs WITHOUT modifying any working tree.
Use -Fetch -Preview to create a *separate* detached worktree for the reviewed OS.
This file does not sync private Google Drive documents or reveal credentials.
#>
[CmdletBinding()]
param(
  [string]$Root = (Join-Path $env:USERPROFILE 'Documents\00_REPOS'),
  [string]$ReportDirectory = (Join-Path $env:USERPROFILE 'Documents\01_DOCS'),
  [switch]$Fetch,
  [switch]$Preview
)

$ErrorActionPreference = 'Stop'
$needed = Get-Command git -ErrorAction Stop
if (-not (Test-Path -LiteralPath $Root -PathType Container)) {
  throw ('Repo root unavailable: ' + $Root)
}
if ($Preview -and -not $Fetch) {
  throw 'Preview requires -Fetch so that the reviewed remote ref is known.'
}

$repos = @(
  'belentani.es',
  'belentani-artista-unified',
  'belentani-visual-engine',
  'belentani-omega-immersive-portal',
  'belentani-webs-historicas',
  'music-os-pedro-belentani',
  'belentani-judas-experience',
  'judas-experience-unificado',
  'premium-effects-registry',
  'meta-skill',
  'Belentani.cv-ai',
  'secure-t',
  'ManosAbiertas'
)

$rows = New-Object 'System.Collections.Generic.List[object]'
foreach ($name in $repos) {
  $path = Join-Path $Root $name
  if (-not (Test-Path -LiteralPath (Join-Path $path '.git'))) {
    $rows.Add([pscustomobject]@{
      Repo = $name; State = 'NOT_LOCAL'; Branch = ''; Head = '';
      DirtyTracked = 0; Untracked = 0; RemoteFetch = 'NOT_RUN';
      Ahead = $null; Behind = $null
    })
    continue
  }
  $branchLines = @( & git -C $path branch --show-current 2>$null )
  $branch = if ($branchLines.Count -gt 0) { [string]$branchLines[0] } else { '' }
  $headLines = @( & git -C $path rev-parse HEAD 2>$null )
  $head = if ($headLines.Count -gt 0) { [string]$headLines[0] } else { '' }
  $changes = @( & git -C $path status --porcelain=v1 --untracked-files=normal 2>$null | Where-Object { $_ } )
  $untracked = @( $changes | Where-Object { $_ -match '^\?\?' } ).Count
  $dirtyTracked = @( $changes | Where-Object { $_ -notmatch '^\?\?' } ).Count
  $fetchState = 'NOT_REQUESTED'
  if ($Fetch) {
    $fetchOutput = @( & git -C $path fetch --no-tags origin 2>&1 )
    $fetchState = if ($LASTEXITCODE -eq 0) { 'OK' } else { 'FAILED (remote or authorization)' }
    # The command output is intentionally discarded: remote URLs can include credentials.
    $fetchOutput = $null
  }
  $ahead = $null
  $behind = $null
  if ($branch) {
    $remoteBranch = 'refs/remotes/origin/' + $branch
    & git -C $path rev-parse --verify $remoteBranch 1>$null 2>$null
    if ($LASTEXITCODE -eq 0) {
      $numbers = @( & git -C $path rev-list --left-right --count ('HEAD...origin/' + $branch) 2>$null )
      if ($numbers.Count -gt 0) {
        $pieces = ([string]$numbers[0]).Trim() -split '\s+'
        if ($pieces.Count -eq 2) {
          $ahead = [int]$pieces[0]
          $behind = [int]$pieces[1]
        }
      }
    }
  }
  $rows.Add([pscustomobject]@{
    Repo = $name; State = 'LOCAL'; Branch = $branch; Head = $head;
    DirtyTracked = $dirtyTracked; Untracked = $untracked;
    RemoteFetch = $fetchState; Ahead = $ahead; Behind = $behind
  })
}

$previewState = 'NOT_REQUESTED'
if ($Preview) {
  $website = Join-Path $Root 'belentani.es'
  $worktree = Join-Path $Root '_PREVIEW_BELENTANI_OS_20261117'
  $ref = 'origin/feat/artist-os-runtime-unification-20261117'
  if (Test-Path -LiteralPath $worktree) {
    $previewState = 'SKIPPED: path already exists; never overwrite'
  } elseif (-not (Test-Path -LiteralPath (Join-Path $website '.git'))) {
    $previewState = 'SKIPPED: belentani.es missing'
  } else {
    & git -C $website rev-parse --verify $ref 1>$null 2>$null
    if ($LASTEXITCODE -ne 0) {
      $previewState = 'SKIPPED: reviewed branch not in origin'
    } else {
      $created = @( & git -C $website worktree add --detach $worktree $ref 2>&1 )
      $previewState = if ($LASTEXITCODE -eq 0) { 'CREATED: separate detached worktree' } else { 'FAILED: inspect Git' }
      $created = $null
    }
  }
}

if (-not (Test-Path -LiteralPath $ReportDirectory)) {
  [void](New-Item -Path $ReportDirectory -ItemType Directory -Force)
}
$report = [pscustomobject]@{
  TimestampUtc = [DateTime]::UtcNow.ToString('o')
  SourceRoot = $Root
  FetchRequested = [bool]$Fetch
  PreviewRequested = [bool]$Preview
  PreviewStatus = $previewState
  Safety = 'No git pull/reset/clean/force-push, no deletions, no checkout of working branches'
  Repositories = $rows.ToArray()
}
$target = Join-Path $ReportDirectory 'BELENTANI_PC_GIT_SYNC_SAFE.json'
$json = $report | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($target, $json + [Environment]::NewLine, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ('Report: ' + $target)
Write-Output ('Preview: ' + $previewState)
$rows | Format-Table -Property Repo, State, Branch, DirtyTracked, Untracked, RemoteFetch, Ahead, Behind -AutoSize
