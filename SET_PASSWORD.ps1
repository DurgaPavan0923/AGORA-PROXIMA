# MongoDB Password Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AGORA - MongoDB Password Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = "C:\Users\gupta\OneDrive\Desktop\AGORA\server\.env"

Write-Host "Current MongoDB URI:" -ForegroundColor Yellow
$currentUri = Select-String -Path $envFile -Pattern "MONGODB_URI=" | Select-Object -First 1
Write-Host $currentUri -ForegroundColor White
Write-Host ""

Write-Host "What you need to do:" -ForegroundColor Green
Write-Host "1. Go to: https://cloud.mongodb.com/" -ForegroundColor White
Write-Host "2. Login to your account" -ForegroundColor White
Write-Host "3. Click 'Database Access' (left menu)" -ForegroundColor White
Write-Host "4. Find user: ranjugupta1106_db_user" -ForegroundColor White
Write-Host "5. Click 'Edit' button" -ForegroundColor White
Write-Host "6. Click 'Edit Password'" -ForegroundColor White
Write-Host "7. Set a NEW password (e.g., Agora2025!)" -ForegroundColor White
Write-Host "8. Click 'Update User'" -ForegroundColor White
Write-Host ""

Write-Host "Then enter your password below:" -ForegroundColor Green
$password = Read-Host "Enter MongoDB Password"

if ($password -eq "" -or $password -eq "YOUR_PASSWORD_HERE") {
    Write-Host ""
    Write-Host "ERROR: You must enter a real password!" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# Update .env file
Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

$newUri = "MONGODB_URI=mongodb+srv://ranjugupta1106_db_user:$password@cluster0.4m1ko09.mongodb.net/agora?retryWrites=true&w=majority"

$content = Get-Content $envFile -Raw
$content = $content -replace "MONGODB_URI=.*", $newUri
Set-Content $envFile $content

Write-Host "✓ Password updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now restart your server:" -ForegroundColor Cyan
Write-Host "  cd server" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "You should see: ✓ MongoDB connected successfully" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
