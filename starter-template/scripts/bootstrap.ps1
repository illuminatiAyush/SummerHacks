<#
Bootstrap script for Windows PowerShell.
Creates Python venv for backend, installs Python dependencies,
installs frontend npm dependencies, and installs skills from skills-lock.json.

Usage:
  .\scripts\bootstrap.ps1
  .\scripts\bootstrap.ps1 -Force
#>
param(
  [switch]$Force
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$root = Resolve-Path (Join-Path $scriptDir '..') | Select-Object -ExpandProperty Path
Write-Host "Bootstrapping project at $root"

# Check Python
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
  Write-Error "Python not found. Install Python 3.10+ and ensure 'python' is on PATH."
  exit 1
}

# Create backend venv
$venvPath = Join-Path $root "backend\.venv"
if (-not (Test-Path $venvPath)) {
  Write-Host "Creating Python venv at $venvPath"
  & python -m venv $venvPath
} else {
  Write-Host "Venv already exists at $venvPath"
}

# Pip path
$pipPath = Join-Path $venvPath "Scripts\pip.exe"
if (-not (Test-Path $pipPath)) {
  Write-Host "pip not found in venv; attempting to ensure pip"
  & python -m pip install --upgrade pip
  $pipPath = Join-Path $venvPath "Scripts\pip.exe"
}

# Install backend requirements
$reqFile = Join-Path $root "backend\requirements.txt"
if (Test-Path $reqFile) {
  Write-Host "Installing backend Python dependencies"
  & $pipPath install -r $reqFile
} else {
  Write-Warning "No backend/requirements.txt found; skipping Python install"
}

# Install frontend dependencies
$myApp = Join-Path $root "my-app"
if (Test-Path $myApp) {
  Write-Host "Installing frontend (my-app) dependencies (npm install)"
  Push-Location $myApp
  npm install
  Pop-Location
} else {
  Write-Warning "No my-app folder found; skipping npm install"
}

# Install skills via Node script
$installScript = Join-Path $root "scripts\install-skills.js"
if (Test-Path $installScript) {
  Write-Host "Installing skills (scripts/install-skills.js)"
  if ($Force.IsPresent) { $forceArg = '--force' } else { $forceArg = '' }
  if ($forceArg -ne '') { node $installScript $forceArg } else { node $installScript }
} else {
  Write-Warning "No scripts/install-skills.js found; skipping skills installation"
}

Write-Host "Bootstrap complete. To run both services, run scripts\run-all.ps1"
