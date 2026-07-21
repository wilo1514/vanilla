$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$composeDir = Join-Path $repoRoot "n8n-local"

Push-Location $composeDir
try {
  docker compose logs -f automation-api n8n
} finally {
  Pop-Location
}
