# 🚀 Quick Start: Backend-Frontend Integration

## ✅ Setup Complete!

I've created the following files:
1. ✅ `client/lib/api.ts` - Complete API client for frontend-backend communication
2. ✅ `client/.env.local` - Frontend environment variables
3. ✅ `server/.env` - Backend environment variables
4. ✅ `BACKEND_FRONTEND_INTEGRATION.md` - Complete integration guide

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ MongoDB installed and running
- ✅ npm or yarn package manager

---

## 🔧 Step 1: Start MongoDB

### Windows:
```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# If not running, start it:
net start MongoDB

# OR if installed via installer:
# MongoDB should auto-start, check Task Manager -> Services
```

### Mac/Linux:
```bash
# Mac (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod
```

---

## 🖥️ Step 2: Install Backend Dependencies

```powershell
# Open PowerShell in your project root
cd C:\Users\gupta\OneDrive\Desktop\AGORA\server

# Install dependencies
npm install

# Expected output: All packages installed successfully
```

---

## 🌐 Step 3: Install Frontend Dependencies (if not done)

```powershell
cd C:\Users\gupta\OneDrive\Desktop\AGORA\client

# Check if node_modules exists
Test-Path node_modules

# If False, install:
npm install
```

---

## 🚀 Step 4: Start Backend Server

```powershell
# In server directory
cd C:\Users\gupta\OneDrive\Desktop\AGORA\server

# Start in development mode
npm run dev

# Expected output:
# ✓ Server running on port 5000
# ✓ MongoDB connected
# ✓ Environment: development
```

**Backend should now be running at:** `http://localhost:5000`

---

## 🎨 Step 5: Start Frontend (New Terminal)

```powershell
# Open a NEW PowerShell window
cd C:\Users\gupta\OneDrive\Desktop\AGORA\client

# Start development server
npm run dev

# Expected output:
# ✓ Ready on http://localhost:3000
```

**Frontend should now be running at:** `http://localhost:3000`

---

## 🧪 Step 6: Test the Integration

### Test 1: Backend Health Check
```powershell
# In a new PowerShell window
curl http://localhost:5000/health
```

**Expected:** `{"status":"ok","message":"Agora Backend API is running"}`

### Test 2: Frontend Access
Open browser: `http://localhost:3000`
- Should see Agora homepage
- No console errors

### Test 3: API Connection Test
Open browser console (F12) and run:
```javascript
fetch('http://localhost:5000/api/elections')
  .then(r => r.json())
  .then(d => console.log('Elections:', d))
```

**Expected:** Empty array `[]` or list of elections

---

## 🔌 Step 7: Test Registration Flow

1. **Go to Registration:**
   - Navigate to: `http://localhost:3000/auth`
   - Click "Register" or "New User Registration"

2. **Fill Form:**
   - Enter phone number: `9999999999`
   - Enter name, email, address
   - Enter age (18+)
   - Enter Aadhaar number (12 digits)
   - Enter Voter ID
   - Upload Aadhaar card PDF
   - Upload Voter ID card PDF

3. **Submit Registration:**
   - Click "Submit"
   - Check browser console for API response
   - Should show success or error message

4. **Check Backend Logs:**
   - Look at backend terminal
   - Should see POST request to `/api/auth/register`

---

## 🛠️ Troubleshooting

### Issue: Backend won't start

**Error:** "Cannot connect to MongoDB"
```powershell
# Check MongoDB status
Get-Service -Name MongoDB

# If stopped, start it:
net start MongoDB
```

**Error:** "Port 5000 already in use"
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

### Issue: Frontend API calls failing

**Error:** "Network error" or "CORS error"

**Solution:**
1. Make sure backend is running on port 5000
2. Check `.env.local` in client folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Restart frontend dev server after changing .env

**Check backend CORS:**
```typescript
// server/src/server.ts should have:
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

---

### Issue: MongoDB connection error

**Error:** "MongoServerError: connect ECONNREFUSED"

**Solutions:**
1. **Check MongoDB is running:**
   ```powershell
   Get-Service -Name MongoDB
   ```

2. **Check connection string in server/.env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/agora
   ```

3. **Try alternative connection:**
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/agora
   ```

4. **Install MongoDB:**
   If not installed: https://www.mongodb.com/try/download/community

---

## 📊 What to Test Next

Once both servers are running:

### 1. Authentication Flow
- [ ] Register new user
- [ ] Admin verification
- [ ] Login with OTP + MPIN
- [ ] Access protected routes

### 2. Elections
- [ ] View all elections
- [ ] View single election details
- [ ] Vote in active election
- [ ] Check voting results

### 3. Admin Features
- [ ] View pending users
- [ ] Approve/reject users
- [ ] Create new election
- [ ] View statistics

### 4. User Dashboard
- [ ] View profile
- [ ] Update profile
- [ ] View voting history
- [ ] View voter card

---

## 🐛 Debug Mode

To see detailed API calls in frontend:

1. **Add console logging to API client:**
   ```typescript
   // In client/lib/api.ts, add to request method:
   console.log('API Request:', endpoint, config)
   console.log('API Response:', responseData)
   ```

2. **Enable backend request logging:**
   Backend already has Morgan logger installed, it will show:
   ```
   POST /api/auth/register 200 125ms
   GET /api/elections 200 45ms
   ```

---

## 📝 Next Steps After Testing

Once integration is confirmed working:

1. **Connect Existing Components:**
   - Update `RegistrationForm` to use `api.auth.register()`
   - Update `AdminVerificationDashboard` to use `api.admin.getPendingUsers()`
   - Connect voting components to `api.elections.*`

2. **Add Missing Backend Routes:**
   - File upload endpoints
   - MPIN management routes
   - Voter ID generation

3. **Create Missing Frontend Pages:**
   - Elections management dashboard
   - Proposals voting interface
   - User profile page with MPIN change

4. **Test End-to-End:**
   - Complete registration → verification → voting flow
   - Admin workflows
   - Blockchain integration

---

## 🎯 Current Status

✅ **Completed:**
- Backend server setup
- Frontend API client
- Environment configuration
- Integration documentation

🔄 **Next Tasks:**
1. Start both servers
2. Test basic connectivity
3. Connect existing components to API
4. Add missing backend routes
5. Test complete user flows

---

## 🆘 Need Help?

**Backend not starting?**
- Check MongoDB is running
- Check `.env` file exists in server/
- Check port 5000 is available

**Frontend not connecting?**
- Check backend is running on port 5000
- Check `.env.local` exists in client/
- Open browser console for error details

**API calls failing?**
- Check browser Network tab (F12)
- Check backend terminal for request logs
- Verify CORS settings

---

## 📞 Quick Commands Reference

```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# Start backend
cd C:\Users\gupta\OneDrive\Desktop\AGORA\server
npm run dev

# Start frontend (new terminal)
cd C:\Users\gupta\OneDrive\Desktop\AGORA\client
npm run dev

# Test backend health
curl http://localhost:5000/health

# Test API endpoint
curl http://localhost:5000/api/elections
```

---

**🎉 You're all set! Start both servers and test the integration!**
