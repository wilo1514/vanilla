$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$composeDir = Join-Path $repoRoot "n8n-local"

Push-Location $composeDir
try {
  docker compose down
} finally {
  Pop-Location
}
