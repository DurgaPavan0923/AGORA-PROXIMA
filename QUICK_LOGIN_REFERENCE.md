# 🔐 Quick Login Reference - Admin & EC

## ✅ What Was Fixed

Your system already had a complete authentication system with unique IDs stored in the database. The issue was a **frontend bug** in the login flow that cleared the OTP before sending it with the MPIN.

### Fixed Files
- `client/components/digilocker-login.tsx` - Login flow bug fixed
- `server/package.json` - Added `create-demo-users` script

## 🚀 Quick Start (3 Steps)

### 1. Create Admin & EC Users
```powershell
cd server
npm run create-demo-users
```

### 2. Start Servers (2 terminals)
```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### 3. Login
Visit: **http://localhost:3000/auth**

## 👨‍💼 Admin Credentials

```
Unique ID: ADMIN-AGR-001
Phone:     8888888001
MPIN:      1234
```

## 🏛️ Election Commission Credentials

```
Unique ID: EC-AGR-001
Phone:     7777777001
MPIN:      1234
```

## 📝 Login Steps

1. **Enter Unique ID** → Click "Request OTP"
2. **Check backend console** for OTP (6-digit code)
3. **Enter OTP** → Click "Verify OTP"
4. **Enter MPIN** (1234) → Click "Login to Agora"
5. **Redirected to dashboard** based on your role

## 🛠️ Helper Script

Run the interactive helper:
```powershell
.\test-admin-login.ps1
```

This provides a menu to:
- Create demo users
- Check server status
- View credentials
- Open login page
- Full setup

## 🔍 Troubleshooting

### "User not found"
→ Run: `npm run create-demo-users` in server directory

### "OTP not found"
→ Request a new OTP (they expire in 5 minutes)

### "Invalid MPIN"
→ Use MPIN: `1234`

### Login not working
→ Check both servers are running (ports 3000 and 5000)

## 📊 Database Structure

Admin and EC users are stored in MongoDB with:
- `uniqueId` - Their login identifier
- `phone` - For OTP delivery
- `mpin` - Hashed 4-digit security code
- `role` - 'admin' or 'election_commission'

## 🔐 Security Features

✅ Three-factor authentication (Unique ID + OTP + MPIN)
✅ MPIN hashed with bcrypt
✅ OTP expires in 5 minutes
✅ Maximum 3 OTP attempts
✅ JWT tokens with 24-hour expiry
✅ HTTP-only cookies

## 📖 Full Documentation

For complete details, see: `ADMIN_EC_LOGIN_SYSTEM.md`

---

**Need Help?** Check the backend console for OTP codes during development!
