<#
Start backend and frontend in separate PowerShell windows.
This script opens two new PowerShell windows and runs the backend (uvicorn)
and the frontend (`npm run dev`).
#>

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$root = Resolve-Path (Join-Path $scriptDir '..') | Select-Object -ExpandProperty Path

# Start backend
$backendDir = Join-Path $root "backend"
$venvActivate = Join-Path $backendDir ".venv\Scripts\Activate.ps1"
$backendCmd = "cd `"$backendDir`"; if (Test-Path `"$venvActivate`") { . `"$venvActivate`" }; uvicorn main:app --reload --port 8000"
Write-Host "Starting backend in new PowerShell window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Start frontend
$frontendDir = Join-Path $root "my-app"
$frontendCmd = "cd `"$frontendDir`"; npm run dev"
Write-Host "Starting frontend in new PowerShell window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "Both processes started. Check the new windows for logs."
