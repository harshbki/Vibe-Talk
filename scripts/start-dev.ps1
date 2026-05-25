# Start Vibe Talk locally (Windows PowerShell) — run from repo root
# Usage: .\scripts\start-dev.ps1

$ErrorActionPreference = "Continue"
$Root = Split-Path $PSScriptRoot -Parent

Write-Host "`n=== Vibe Talk — starting dev stack ===" -ForegroundColor Cyan

# Free ports if old processes stuck
foreach ($port in @(8080, 8081)) {
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

Write-Host "`n[1/3] Check MongoDB (port 27017)..." -ForegroundColor Yellow
$mongo = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if (-not $mongo) {
  Write-Host "Mongo not listening. Run in another terminal: cd $Root && npm run mongo" -ForegroundColor Red
  Write-Host "Or start MongoDB Windows service (services.msc)." -ForegroundColor Red
} else {
  Write-Host "Mongo OK" -ForegroundColor Green
}

Write-Host "`n[2/3] Starting API + Socket on :8081..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\server'; npm start"

Start-Sleep -Seconds 4
try {
  $health = Invoke-RestMethod -Uri "http://localhost:8081/api/health" -TimeoutSec 5
  Write-Host "API health: $($health.status), mongo: $($health.mongo)" -ForegroundColor Green
} catch {
  Write-Host "API not ready yet — check the server window for errors." -ForegroundColor Red
}

Write-Host "`n[3/3] Starting React client on :8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\client'; npm start"

Write-Host "`nOpen: http://localhost:8080" -ForegroundColor Green
Write-Host "Health: http://localhost:8081/api/health`n" -ForegroundColor Gray
