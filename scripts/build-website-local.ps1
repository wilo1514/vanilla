$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$siteDir = Join-Path $repoRoot "website/current_site"

Push-Location $siteDir
try {
  npm install
  npm run build
  Write-Host "Website dist generated at: $siteDir\dist" -ForegroundColor Green
} finally {
  Pop-Location
}
