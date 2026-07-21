$ErrorActionPreference = "Continue"

function Test-Url {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Url
  )

  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 8
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
      Write-Host "PASS: $Name responded at $Url" -ForegroundColor Green
      return $true
    }
    Write-Host "FAIL: $Name returned HTTP $($response.StatusCode) at $Url" -ForegroundColor Red
    return $false
  } catch {
    Write-Host "FAIL: $Name did not respond at $Url" -ForegroundColor Red
    Write-Host "      $($_.Exception.Message)"
    return $false
  }
}

$apiOk = Test-Url -Name "automation-api" -Url "http://localhost:3009/health"
$n8nOk = Test-Url -Name "n8n" -Url "http://localhost:5678"

if ($apiOk -and $n8nOk) {
  exit 0
}

exit 1
