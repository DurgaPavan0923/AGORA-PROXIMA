# AGORA Complete Restart Script
# This clears all caches and prepares for a fresh start

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "     AGORA - Complete System Restart Script       " -ForegroundColor Cyan  
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "server") -or -not (Test-Path "client")) {
    Write-Host "❌ Error: Please run from AGORA root directory" -ForegroundColor Red
    exit 1
}

$currentDir = Get-Location
Write-Host "📂 Working Directory: $currentDir" -ForegroundColor Green
Write-Host ""

# Step 1: Clear Frontend Cache
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 1: Clearing Frontend Cache" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

cd client

if (Test-Path ".next") {
    Write-Host "🗑️  Removing .next cache..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "✅ Frontend cache cleared!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No cache to clear" -ForegroundColor Gray
}

cd ..

Write-Host ""

# Step 2: Instructions
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 2: Server Restart Instructions" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "🔴 STOP all running servers (Ctrl+C in each terminal)" -ForegroundColor Red
Write-Host ""
Write-Host "Then open 2 separate PowerShell terminals:" -ForegroundColor Cyan
Write-Host ""

Write-Host "📘 Terminal 1 - Backend:" -ForegroundColor Blue
Write-Host "   cd $currentDir\server" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "📗 Terminal 2 - Frontend:" -ForegroundColor Green
Write-Host "   cd $currentDir\client" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 3: Browser Setup" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "1. Open browser (Chrome/Edge)" -ForegroundColor White
Write-Host "2. Press F12 (open DevTools)" -ForegroundColor White
Write-Host "3. Go to Application tab → Storage → Clear site data" -ForegroundColor White
Write-Host "4. OR press Ctrl+Shift+R for hard refresh" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 4: Test Login" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "Visit: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000/auth" -ForegroundColor Cyan
Write-Host ""

Write-Host "Admin Login:" -ForegroundColor Yellow
Write-Host "  Unique ID: " -NoNewline -ForegroundColor White
Write-Host "ADMIN-AGR-001" -ForegroundColor Green
Write-Host "  MPIN:      " -NoNewline -ForegroundColor White
Write-Host "1234" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Expected Flow:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "1. Login at /auth" -ForegroundColor White
Write-Host "2. Brief loading screen at /dashboard" -ForegroundColor White
Write-Host "3. Redirect to /dashboard/admin" -ForegroundColor White
Write-Host "4. Admin dashboard loads with tabs" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "If Still Not Working:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "1. Open browser console (F12)" -ForegroundColor White
Write-Host "2. Look for [Dashboard] logs" -ForegroundColor White
Write-Host "3. Check Network tab for /api/auth/verify" -ForegroundColor White
Write-Host "4. Run diagnostic tool: http://localhost:3000/check-dashboard.html" -ForegroundColor White
Write-Host ""

Write-Host "✨ Cache cleared! Ready for restart." -ForegroundColor Green
Write-Host ""

# Offer to open VS Code terminals
$openVSCode = Read-Host "Open VS Code to start servers? (y/n)"
if ($openVSCode -eq "y" -or $openVSCode -eq "Y") {
    code .
    Write-Host "✅ VS Code opened! Use the terminal to start servers" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
