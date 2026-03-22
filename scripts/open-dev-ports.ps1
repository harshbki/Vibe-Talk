# Opens Windows Firewall inbound TCP for Vibe-Talk dev (client, API, MongoDB).
# Run PowerShell as Administrator:  .\scripts\open-dev-ports.ps1

$ErrorActionPreference = 'Stop'
$ruleName = 'VibeTalk-Dev-Ports'

if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host 'Run this script as Administrator (right-click PowerShell -> Run as administrator).' -ForegroundColor Red
    exit 1
}

$ports = @(8080, 8081, 27017)
foreach ($p in $ports) {
    $existing = Get-NetFirewallRule -DisplayName "$ruleName-$p" -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "Rule already exists: $ruleName-$p"
        continue
    }
    New-NetFirewallRule -DisplayName "$ruleName-$p" -Direction Inbound -LocalPort $p -Protocol TCP -Action Allow | Out-Null
    Write-Host "Opened TCP port $p"
}

Write-Host 'Done. Ports: 8080 (React), 8081 (API/Socket), 27017 (MongoDB).' -ForegroundColor Green
