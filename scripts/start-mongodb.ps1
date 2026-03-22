# MongoDB port 27017 — Docker se container, ya Windows service.
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

$compose = Join-Path $root 'docker-compose.yml'

if (Get-Command docker -ErrorAction SilentlyContinue) {
    Set-Location $root
    docker compose -f $compose up -d
    Write-Host 'MongoDB Docker: port 27017 open. URI: mongodb://127.0.0.1:27017/vibetalk' -ForegroundColor Green
    exit 0
}

$svc = Get-Service -Name 'MongoDB' -ErrorAction SilentlyContinue
if ($svc) {
    if ($svc.Status -ne 'Running') {
        try {
            Start-Service -Name 'MongoDB'
            Write-Host 'MongoDB Windows service started (27017).' -ForegroundColor Green
        } catch {
            Write-Host 'Start MongoDB service manually as Admin: Start-Service MongoDB' -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host 'MongoDB service already Running (27017).' -ForegroundColor Green
    }
    exit 0
}

Write-Host 'Neither Docker nor MongoDB Windows service found.' -ForegroundColor Yellow
Write-Host 'Option A — Install Docker Desktop, then: npm run mongo'
Write-Host 'Option B — Install MongoDB Community: https://www.mongodb.com/try/download/community'
Write-Host 'Option C — winget (Admin): winget install MongoDB.Server'
exit 1
