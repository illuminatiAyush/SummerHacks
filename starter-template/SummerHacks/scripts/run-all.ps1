# Start SummerHacks backend
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$root = Resolve-Path (Join-Path $scriptDir '..') | Select-Object -ExpandProperty Path

$backendDir = Join-Path $root 'backend'
$venvActivate = Join-Path $backendDir '.venv\Scripts\Activate.ps1'
$backendCmd = "cd `"$backendDir`"; if (Test-Path `"$venvActivate`") { . `"$venvActivate`" }; uvicorn main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

Write-Host "Started SummerHacks backend in a new PowerShell window"
