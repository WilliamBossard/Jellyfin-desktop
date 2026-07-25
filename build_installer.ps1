$ISCC_Paths = @(
    "C:\Program Files\Inno Setup 7\ISCC.exe",
    "C:\Program Files (x86)\Inno Setup 7\ISCC.exe",
    "C:\Program Files\Inno Setup 6\ISCC.exe",
    "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
)

$ISCC = $null
foreach ($path in $ISCC_Paths) {
    if (Test-Path $path) {
        $ISCC = $path
        break
    }
}

if (-not $ISCC) {
    Write-Host "Inno Setup Compiler (ISCC.exe) not found. Please install Inno Setup first." -ForegroundColor Red
    exit 1
}

# Write-Host "Using Inno Setup Compiler: $ISCC"
# & $ISCC "installer.iss"
#
# if ($LASTEXITCODE -eq 0) {
#     Write-Host "Installer created successfully in the 'build' directory!" -ForegroundColor Green
# } else {
#     Write-Host "Failed to create installer." -ForegroundColor Red
#     exit $LASTEXITCODE
# }
