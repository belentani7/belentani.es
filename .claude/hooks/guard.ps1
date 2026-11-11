# guard.ps1 - hook PreToolUse para Claude Code en Windows.
# Uso: pwsh -File .claude/hooks/guard.ps1 edit|bash|session
# Recibe el JSON del tool por stdin y sale con codigo 2 para bloquear.
param([string]$Mode = 'edit')

$ErrorActionPreference = 'Stop'
try {
    $raw = [Console]::In.ReadToEnd()
} catch { $raw = '' }

if ($Mode -eq 'session') {
    if (Test-Path '.agents/memory/incidents.md') {
        Write-Host 'Memoria del proyecto: .agents/memory/incidents.md'
    }
    exit 0
}

$payload = $null
if ($raw -and $raw.Trim().Length -gt 0) {
    try { $payload = $raw | ConvertFrom-Json } catch { $payload = $null }
}

$target = ''
if ($payload -and $payload.tool_input) {
    if ($payload.tool_input.file_path) { $target = [string]$payload.tool_input.file_path }
    elseif ($payload.tool_input.command) { $target = [string]$payload.tool_input.command }
}

if (-not $target) { exit 0 }

if ($Mode -eq 'edit') {
    if ($target -match 'package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb') {
        [Console]::Error.WriteLine('BLOQUEADO: no edites lockfiles a mano. Usa el gestor de paquetes.')
        exit 2
    }
    if ($target -match '[\\/]migrations[\\/]') {
        [Console]::Error.WriteLine('BLOQUEADO: no edites migrations a mano. Genera una migracion.')
        exit 2
    }
    if ($target -match '(^|[\\/])\.env($|\.)|[\\/]secrets[\\/]|\.(key|pem)$') {
        [Console]::Error.WriteLine('BLOQUEADO: archivo sensible.')
        exit 2
    }
}

if ($Mode -eq 'bash') {
    if ($target -match 'git\s+push\s+.*(--force|-f)\b') {
        [Console]::Error.WriteLine('BLOQUEADO: force-push prohibido.')
        exit 2
    }
    if ($target -match 'git\s+reset\s+--hard|git\s+clean\s+-[a-z]*f') {
        [Console]::Error.WriteLine('BLOQUEADO: comando destructivo sobre el arbol de trabajo.')
        exit 2
    }
}

exit 0
