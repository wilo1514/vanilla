$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$siteDir = Join-Path $repoRoot "website/current_site"
$envProductionPath = Join-Path $siteDir ".env.production"

if (-not (Test-Path -LiteralPath $envProductionPath)) {
  Write-Host "WARNING: website/current_site/.env.production was not found." -ForegroundColor Yellow
  Write-Host "Create it from one of the Hostinger examples before building for upload."
}

Push-Location $siteDir
try {
  npm install
  npm run build
  Write-Host "Build complete." -ForegroundColor Green
  Write-Host "Upload the contents of website/current_site/dist to Hostinger public_html."
  Write-Host "Do not upload source files, .env files, node_modules, or this script."
} finally {
  Pop-Location
}
