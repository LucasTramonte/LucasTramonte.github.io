param(
  [ValidateSet('development', 'production')]
  [string]$Mode = 'production'
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$logDir = Join-Path $root 'logs'

if (-not (Test-Path $logDir)) {
  New-Item -Path $logDir -ItemType Directory | Out-Null
}

$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$logPath = Join-Path $logDir ("build_{0}_{1}.log" -f $Mode, $timestamp)

function Write-AuditLine {
  param([string]$Message)

  $line = "[{0}] {1}" -f (Get-Date -Format o), $Message
  $line | Tee-Object -FilePath $logPath -Append | Out-Null
}

Write-AuditLine "Starting webpack build ($Mode)."

Push-Location $root

try {
  & cmd.exe /c "npx webpack --mode $Mode 2>&1" | Tee-Object -FilePath $logPath -Append

  if ($LASTEXITCODE -ne 0) {
    throw "Webpack exited with code $LASTEXITCODE."
  }

  Write-AuditLine "Build completed successfully."
}
catch {
  Write-AuditLine ("Build failed: {0}" -f $_.Exception.Message)
  throw
}
finally {
  Pop-Location
}

Write-Host ("Audit log written to: {0}" -f $logPath)
