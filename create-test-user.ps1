Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Creating Test User for AGORA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to server directory
Set-Location -Path "$PSScriptRoot\server"

# Run the script
Write-Host "Running script..." -ForegroundColor Yellow
npx tsx scripts/create-test-user.ts

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
