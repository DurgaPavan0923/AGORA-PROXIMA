# 🔧 Fix: Approve/Reject Functionality

## Problem
The approve and reject buttons weren't working because the API routes were using mock database instead of real backend.

## ✅ What Was Fixed

### 1. Updated API Routes
- `client/app/api/admin/verify-user/route.ts` - Now connects to real backend
- `client/app/api/admin/reject-user/route.ts` - Created new route for reject

### 2. Both routes now:
- Get JWT token from cookies
- Send requests to backend at `http://localhost:5000/api`
- Pass proper authorization headers
- Handle errors correctly

## 🚀 To Apply the Fix

### Step 1: Stop Frontend Server
Press **Ctrl+C** in the terminal running the client

### Step 2: Clear Cache
```powershell
cd C:\Users\gupta\OneDrive\Desktop\AGORA\client
Remove-Item -Path ".next" -Recurse -Force
```

### Step 3: Restart Frontend
```powershell
npm run dev
```

### Step 4: Hard Refresh Browser
- Press **Ctrl + Shift + R**
- Or clear browser cache in DevTools (F12 → Application → Clear site data)

## 🧪 Test the Fix

### 1. Login as Admin
- Go to `http://localhost:3000/auth`
- Unique ID: `ADMIN-AGR-001`
- Get OTP from backend console
- MPIN: `1234`

### 2. Go to Pending Tab
- Should see your 3 pending users (Akansha, NISHANT GUPTA x2)

### 3. Test Approve
1. Click **"View"** on any user → See details
2. Close details dialog
3. Click **"Approve"** → Dialog opens
4. Enter MPIN: `1234`
5. Click **"Approve & Issue Unique ID"**
6. Should see success message: `✅ User approved! Unique ID: AGR-xxxxx-xxxxx`
7. User disappears from pending list

### 4. Test Reject
1. Click **"Reject"** on another user
2. Confirm rejection
3. Should see success message: `✅ User registration rejected`
4. User disappears from pending list

## 🐛 If Still Not Working

### Check Backend Console
Look for errors when you click approve/reject:
```
POST /api/admin/verify-user
POST /api/admin/reject-user
```

### Check Browser Console (F12)
Look for errors when clicking buttons. Should see:
```
Approve clicked → API call → Success/Error
```

### Verify Backend is Running
```powershell
# Should return: {"status":"ok","message":"Agora Backend API is running"}
curl http://localhost:5000/health
```

### Check MongoDB Connection
Backend console should show:
```
✅ Connected to MongoDB
```

## 📊 What Happens Behind the Scenes

### When You Click "Approve":

**Frontend:**
1. Opens dialog asking for MPIN
2. Sends to: `POST /api/admin/verify-user`
3. Passes: `{ userId: "...", mpin: "1234" }`

**Next.js API Route:**
1. Gets JWT token from cookies
2. Forwards to backend: `POST http://localhost:5000/api/admin/verify-user`
3. Includes Authorization header

**Backend:**
1. Verifies JWT token (checks if admin)
2. Finds pending user in database
3. Generates unique ID: `AGR-{timestamp}-{random}`
4. Hashes MPIN with bcrypt
5. Creates blockchain wallet
6. Issues SBT token
7. Moves user from PendingUser → User collection
8. Returns success with unique ID

**Frontend:**
1. Shows success message
2. Refreshes pending users list
3. User is now gone from pending

### When You Click "Reject":

**Frontend:**
1. Shows confirmation dialog
2. Sends to: `POST /api/admin/reject-user`
3. Passes: `{ userId: "..." }`

**Backend:**
1. Verifies admin token
2. Updates PendingUser status to "rejected"
3. Returns success

**Frontend:**
1. Shows success message
2. Refreshes list
3. User is gone

## ✅ Expected Behavior

After the fix:

### Approve Flow:
```
Click Approve → Enter MPIN → Click Submit
  ↓
Backend generates unique ID
  ↓
"✅ User approved! Unique ID: AGR-1234567890-ABC"
  ↓
User removed from pending list
```

### Reject Flow:
```
Click Reject → Confirm
  ↓
Backend marks as rejected
  ↓
"✅ User registration rejected"
  ↓
User removed from pending list
```

## 🎯 Key Files Changed

1. **`client/app/api/admin/verify-user/route.ts`**
   - Changed from mock DB to real backend
   - Added proper token authentication

2. **`client/app/api/admin/reject-user/route.ts`**
   - New file created
   - Connects to backend reject endpoint

3. **Backend** (no changes needed)
   - Already had correct routes
   - Already had admin role checking
   - Already had all logic implemented

## 🔐 Security

- ✅ JWT token required
- ✅ Admin role verified on backend
- ✅ MPIN is hashed (not stored plain text)
- ✅ All requests authenticated

## 💡 Tips

1. **Always check backend console** for OTP codes
2. **Default MPIN** for newly approved users: whatever you enter (suggest: `1234`)
3. **User will receive** Unique ID via email (once email system is implemented)
4. **For now**, admin needs to manually communicate the Unique ID to the user

---

**The approve/reject functionality should now work perfectly! Follow the steps above to test it.** 🚀
