param(
  [switch]$Force
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$root = Resolve-Path (Join-Path $scriptDir '..') | Select-Object -ExpandProperty Path
Write-Host "Bootstrapping SummerHacks at $root"

# Create backend venv
$backendDir = Join-Path $root 'backend'
$venvPath = Join-Path $backendDir '.venv'
if (-not (Test-Path $venvPath)) {
  Write-Host "Creating Python venv at $venvPath"
  python -m venv $venvPath
} else { Write-Host "Venv exists at $venvPath" }

# Install backend requirements
$pipPath = Join-Path $venvPath 'Scripts\pip.exe'
if (Test-Path $pipPath) {
  Write-Host "Installing backend requirements"
  & $pipPath install -r (Join-Path $backendDir 'requirements.txt')
} else { Write-Warning "pip not found in venv; ensure Python available" }

# Install skills
$installScript = Join-Path $root 'scripts\install-skills.js'
if (Test-Path $installScript) {
  Write-Host "Installing skills for SummerHacks"
  if ($Force.IsPresent) { node $installScript --force } else { node $installScript }
} else { Write-Warning "No scripts/install-skills.js found; skipping" }

Write-Host "SummerHacks bootstrap complete"
