# Test Admin & EC Login Script
# This script helps you test the admin and EC login functionality

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     AGORA - Admin & EC Login Test Helper                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "server") -or -not (Test-Path "client")) {
    Write-Host "❌ Error: Please run this script from the AGORA root directory" -ForegroundColor Red
    Write-Host "   Current: $currentDir" -ForegroundColor Yellow
    Write-Host "   Expected: C:\Users\gupta\OneDrive\Desktop\AGORA" -ForegroundColor Yellow
    exit 1
}

Write-Host "📂 Working Directory: $currentDir" -ForegroundColor Green
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Menu
Write-Host "What would you like to do?" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create Demo Admin & EC Users" -ForegroundColor White
Write-Host "2. Check if Backend is Running" -ForegroundColor White
Write-Host "3. Check if Frontend is Running" -ForegroundColor White
Write-Host "4. View Admin & EC Login Credentials" -ForegroundColor White
Write-Host "5. Open Login Page in Browser" -ForegroundColor White
Write-Host "6. Full Setup (Create Users + Start Servers)" -ForegroundColor White
Write-Host "7. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-7)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔧 Creating Demo Users..." -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        cd server
        npm run create-demo-users
        cd ..
        Write-Host ""
        Write-Host "✅ Demo users created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    "2" {
        Write-Host ""
        if (Test-Port 5000) {
            Write-Host "✅ Backend is running on port 5000" -ForegroundColor Green
        } else {
            Write-Host "❌ Backend is NOT running on port 5000" -ForegroundColor Red
            Write-Host ""
            Write-Host "To start backend:" -ForegroundColor Yellow
            Write-Host "  cd server" -ForegroundColor White
            Write-Host "  npm run dev" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    "3" {
        Write-Host ""
        if (Test-Port 3000) {
            Write-Host "✅ Frontend is running on port 3000" -ForegroundColor Green
        } else {
            Write-Host "❌ Frontend is NOT running on port 3000" -ForegroundColor Red
            Write-Host ""
            Write-Host "To start frontend:" -ForegroundColor Yellow
            Write-Host "  cd client" -ForegroundColor White
            Write-Host "  npm run dev" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    "4" {
        Write-Host ""
        Write-Host "╔═══════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "║     📋 ADMIN & EC LOGIN CREDENTIALS          ║" -ForegroundColor Cyan
        Write-Host "╚═══════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "👨‍💼 ADMIN USER:" -ForegroundColor Yellow
        Write-Host "   Unique ID: " -NoNewline -ForegroundColor White
        Write-Host "ADMIN-AGR-001" -ForegroundColor Green
        Write-Host "   Phone:     " -NoNewline -ForegroundColor White
        Write-Host "8888888001" -ForegroundColor Green
        Write-Host "   MPIN:      " -NoNewline -ForegroundColor White
        Write-Host "1234" -ForegroundColor Green
        Write-Host ""
        Write-Host "🏛️  ELECTION COMMISSION:" -ForegroundColor Yellow
        Write-Host "   Unique ID: " -NoNewline -ForegroundColor White
        Write-Host "EC-AGR-001" -ForegroundColor Green
        Write-Host "   Phone:     " -NoNewline -ForegroundColor White
        Write-Host "7777777001" -ForegroundColor Green
        Write-Host "   MPIN:      " -NoNewline -ForegroundColor White
        Write-Host "1234" -ForegroundColor Green
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
        Write-Host "📱 HOW TO LOGIN:" -ForegroundColor Yellow
        Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
        Write-Host ""
        Write-Host "1. Go to: http://localhost:3000/auth" -ForegroundColor White
        Write-Host "2. Enter Unique ID (ADMIN-AGR-001 or EC-AGR-001)" -ForegroundColor White
        Write-Host "3. Click 'Request OTP'" -ForegroundColor White
        Write-Host "4. Check backend console for OTP (6-digit code)" -ForegroundColor White
        Write-Host "5. Enter the OTP" -ForegroundColor White
        Write-Host "6. Enter MPIN: 1234" -ForegroundColor White
        Write-Host "7. Login successful!" -ForegroundColor White
        Write-Host ""
        Write-Host "Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    "5" {
        Write-Host ""
        Write-Host "🌐 Opening login page in browser..." -ForegroundColor Yellow
        Start-Process "http://localhost:3000/auth"
        Write-Host "✅ Browser opened!" -ForegroundColor Green
        Write-Host ""
        Write-Host "If the page doesn't load, make sure:" -ForegroundColor Yellow
        Write-Host "  - Frontend is running (npm run dev in client folder)" -ForegroundColor White
        Write-Host "  - Backend is running (npm run dev in server folder)" -ForegroundColor White
        Write-Host ""
        Write-Host "Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    "6" {
        Write-Host ""
        Write-Host "🚀 Starting Full Setup..." -ForegroundColor Yellow
        Write-Host ""
        
        # Create demo users
        Write-Host "Step 1: Creating demo users..." -ForegroundColor Cyan
        cd server
        npm run create-demo-users
        cd ..
        Write-Host "✅ Demo users created" -ForegroundColor Green
        Write-Host ""
        
        # Check if servers are running
        $backendRunning = Test-Port 5000
        $frontendRunning = Test-Port 3000
        
        if (-not $backendRunning) {
            Write-Host "⚠️  Backend is not running" -ForegroundColor Yellow
            Write-Host "   Please start it manually in a new terminal:" -ForegroundColor White
            Write-Host "   cd server && npm run dev" -ForegroundColor White
            Write-Host ""
        } else {
            Write-Host "✅ Backend is already running" -ForegroundColor Green
            Write-Host ""
        }
        
        if (-not $frontendRunning) {
            Write-Host "⚠️  Frontend is not running" -ForegroundColor Yellow
            Write-Host "   Please start it manually in a new terminal:" -ForegroundColor White
            Write-Host "   cd client && npm run dev" -ForegroundColor White
            Write-Host ""
        } else {
            Write-Host "✅ Frontend is already running" -ForegroundColor Green
            Write-Host ""
        }
        
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "✅ Setup Complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Use credentials from option 4 to login" -ForegroundColor Yellow
        Write-Host "Visit: http://localhost:3000/auth" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    "7" {
        Write-Host ""
        Write-Host "👋 Goodbye!" -ForegroundColor Green
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}
