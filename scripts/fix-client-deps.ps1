# Fix broken client/node_modules (core-js-pure ENOENT, etc.)
# Run from repo root in PowerShell: .\scripts\fix-client-deps.ps1

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\..\client"

Write-Host "Stopping any node on port 8080..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

Write-Host "Removing client/node_modules and cache..." -ForegroundColor Yellow
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path .cache) { Remove-Item -Recurse -Force .cache }
if (Test-Path build) { Remove-Item -Recurse -Force build }

Write-Host "npm ci..." -ForegroundColor Cyan
npm ci --no-audit --no-fund
if (-not (Test-Path "node_modules\core-js-pure\full\global-this.js")) {
  throw "core-js-pure still missing — run: npm install"
}
Write-Host "OK. Start client: npm start" -ForegroundColor Green
