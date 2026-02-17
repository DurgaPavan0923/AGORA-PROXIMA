# Dashboard Loading Issue - Debug Guide

## Problem
The dashboard gets stuck on "Loading your dashboard..." screen after successful login.

## What Was Fixed

### 1. Fixed Login Component
- **File**: `client/components/digilocker-login.tsx`
- **Change**: Removed unnecessary `?role=${data.role}` from redirect URL
- **Why**: The role comes from authentication, not URL parameters

### 2. Improved Dashboard Redirect Logic  
- **File**: `client/app/dashboard/page.tsx`
- **Changes**:
  - Added extensive console logging for debugging
  - Added `credentials: "include"` to fetch call
  - Added role validation before redirecting
  - Added support for 'voter' role mapping

## How to Debug

### Step 1: Check Browser Console
1. Open Chrome/Edge DevTools (F12)
2. Go to **Console** tab
3. Look for messages starting with `[Dashboard]`

You should see:
```
[Dashboard] Starting redirect logic...
[Dashboard] Checking authentication...
[Dashboard] Auth response status: 200
[Dashboard] Auth successful, user data: {...}
[Dashboard] User role: admin
[Dashboard] Redirecting to: /dashboard/admin
```

### Step 2: Check Network Tab
1. In DevTools, go to **Network** tab
2. Look for the `/api/auth/verify` request
3. Check:
   - **Status**: Should be 200
   - **Response**: Should contain user data with role
   - **Cookies**: Should have `auth-token` cookie

### Step 3: Check Backend Logs
Look in your backend console for:
```
OTP for Admin User (8888888001): 123456
```

And after login:
```
✅ Login successful for ADMIN-AGR-001
```

## Common Issues & Solutions

### Issue 1: Auth API Returns 401
**Symptom**: `[Dashboard] Auth response status: 401`

**Solution**: Token not being set properly
```powershell
# Check if backend is setting cookies correctly
# In server/src/controllers/authController.ts line 134-139
```

**Fix**: Make sure cookie is being set with correct name. The backend sets `token` but frontend might be looking for `auth-token`.

### Issue 2: User Data Missing Role
**Symptom**: `[Dashboard] No role found in user data`

**Solution**: Backend not returning role in user object
```powershell
# Check backend response format
# Should return: { success: true, user: { uniqueId, fullName, phone, role } }
```

### Issue 3: Cookie Not Being Sent
**Symptom**: Network tab shows no cookies in request

**Solution**: 
1. Make sure both frontend (port 3000) and backend (port 5000) are on localhost
2. Check cookie settings in `verify-otp-mpin/route.ts`
3. Ensure `credentials: "include"` is in fetch call (✅ already fixed)

### Issue 4: CORS Issues
**Symptom**: CORS error in console

**Solution**: Check backend CORS configuration
```typescript
// server/src/server.ts
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

## Quick Test Steps

### Test 1: Manual API Call
Open browser console and run:
```javascript
fetch('/api/auth/verify', {
  method: 'GET',
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log('Auth data:', data))
.catch(err => console.error('Auth error:', err))
```

### Test 2: Check Cookies
In browser console:
```javascript
console.log('Cookies:', document.cookie)
```

You should see `auth-token=...` or `token=...`

### Test 3: Check localStorage (Dev Mode)
```javascript
console.log('Dev mode:', localStorage.getItem('dev-mode'))
console.log('Dev role:', localStorage.getItem('dev-role'))
```

## Expected Flow

1. **Login** → Sets cookie with JWT token
2. **Redirect to /dashboard** → Dashboard page loads
3. **Dashboard calls /api/auth/verify** → Verifies token and returns user data
4. **Dashboard redirects to role-specific page**:
   - Admin → `/dashboard/admin`
   - EC → `/dashboard/election-commission`
   - User/Voter → `/dashboard/user`

## Cookie Mismatch Issue (LIKELY CULPRIT!)

The backend sets cookie as `token` but the frontend API route looks for `auth-token`:

**Backend** (`authController.ts` line 134):
```typescript
res.cookie('token', token, { ... })
```

**Frontend** (`verify/route.ts` line 9):
```typescript
request.cookies.get("auth-token")?.value
```

### FIX: Update Frontend to Match Backend

We need to change the frontend to look for `token` instead of `auth-token`:

1. Update `client/app/api/auth/verify/route.ts` line 9
2. Update `client/app/api/auth/verify-otp-mpin/route.ts` line 37

## Steps to Fix Right Now

### Option A: Update Frontend Cookie Name (Recommended)
```typescript
// In client/app/api/auth/verify/route.ts
const token = request.headers.get("authorization")?.replace("Bearer ", "") ||
              request.cookies.get("token")?.value  // Changed from "auth-token"
```

### Option B: Update Backend Cookie Name
```typescript
// In server/src/controllers/authController.ts
res.cookie('auth-token', token, { ... })  // Changed from 'token'
```

## After Fix

1. Restart both servers
2. Clear browser cookies (or use Incognito)
3. Login again with ADMIN-AGR-001
4. Should redirect to admin dashboard

## Verification

After successful login, you should see:
- ✅ Console shows successful auth and role detection
- ✅ Redirects to `/dashboard/admin` or `/dashboard/election-commission`
- ✅ Dashboard loads with proper content
- ✅ No infinite loading screen
