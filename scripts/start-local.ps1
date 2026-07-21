$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$composeDir = Join-Path $repoRoot "n8n-local"
$envPath = Join-Path $composeDir ".env"
$envExamplePath = Join-Path $composeDir ".env.example"

Write-Host "Checking Docker..."
try {
  docker info *> $null
} catch {
  Write-Host "FAIL: Docker is not running or Docker Desktop is not reachable." -ForegroundColor Red
  Write-Host "Start Docker Desktop, then run scripts/start-local.ps1 again."
  exit 1
}

if (-not (Test-Path -LiteralPath $envPath)) {
  Copy-Item -LiteralPath $envExamplePath -Destination $envPath
  Write-Host "Created n8n-local/.env from .env.example." -ForegroundColor Yellow
  Write-Host "Edit n8n-local/.env and replace local passwords/keys before relying on this stack." -ForegroundColor Yellow
}

Push-Location $composeDir
try {
  docker compose up -d
} finally {
  Pop-Location
}

Start-Sleep -Seconds 8

& (Join-Path $PSScriptRoot "healthcheck-local.ps1")

Write-Host ""
Write-Host "Local URLs:"
Write-Host "n8n: http://localhost:5678"
Write-Host "automation-api: http://localhost:3009/health"
