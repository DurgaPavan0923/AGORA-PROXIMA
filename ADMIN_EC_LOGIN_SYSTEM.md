# Admin & Election Commission Login System - Complete Guide

## Overview
Your AGORA system already has a robust authentication system that stores unique IDs for Admin and Election Commission (EC) users in the database. The system uses a three-factor authentication approach:
1. **Unique ID** (stored in DB)
2. **OTP** (sent to registered phone)
3. **MPIN** (4-digit security code)

## Database Structure

### User Model (MongoDB)
Location: `server/src/models/User.ts`

```typescript
{
  uniqueId: string,        // Unique identifier (ADMIN-AGR-001, EC-AGR-001, etc.)
  fullName: string,
  phone: string,           // 10-digit phone number
  aadhaar: string,         // 12-digit Aadhaar number
  address: string,
  role: 'user' | 'admin' | 'election_commission' | 'voter',
  mpin: string,            // Hashed 4-digit MPIN
  isVerified: boolean,
  walletAddress: string,   // Blockchain wallet (optional)
  did: string,             // Decentralized ID (optional)
  sbtTokenId: string,      // Soulbound Token ID (optional)
  // ... other fields
}
```

### Unique ID Format
- **Admin**: `ADMIN-AGR-{timestamp}-{random}` (e.g., `ADMIN-AGR-001`)
- **Election Commission**: `EC-AGR-001` (fixed, single EC user)
- **Regular Users**: `AGR-{timestamp}-{random}`

## How It Works

### 1. User Login Flow
```
┌─────────────────┐
│ Enter Unique ID │
│  (ADMIN-AGR-001)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Request OTP    │
│ (sent to phone) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Enter OTP     │
│    (6-digit)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Enter MPIN     │
│   (4-digit)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Access Dashboard│
└─────────────────┘
```

### 2. Backend Authentication Process

**Request OTP** (`POST /api/auth/request-otp`)
```json
{
  "uniqueId": "ADMIN-AGR-001"
}
```
- Backend finds user by `uniqueId`
- Extracts user's phone number
- Generates 6-digit OTP
- Stores OTP in database with 5-minute expiry
- Returns masked phone number

**Verify OTP & MPIN** (`POST /api/auth/verify-otp-mpin`)
```json
{
  "uniqueId": "ADMIN-AGR-001",
  "otp": "123456",
  "mpin": "1234"
}
```
- Verifies user exists
- Validates OTP (checks expiry and attempts)
- Validates MPIN (bcrypt comparison)
- Generates JWT token
- Returns user data and redirects to dashboard

## Creating Admin & EC Users

### Method 1: Using Demo Users Script (Recommended)

Run the pre-configured script:
```powershell
cd C:\Users\gupta\OneDrive\Desktop\AGORA\server
npm run create-demo-users
```

This creates:
- **Admin User**
  - Unique ID: `ADMIN-AGR-001`
  - Phone: `8888888001`
  - MPIN: `1234`
  
- **Election Commission User**
  - Unique ID: `EC-AGR-001`
  - Phone: `7777777001`
  - MPIN: `1234`

### Method 2: Using Admin Controller API

**Create Admin** (`POST /api/admin/create-user`)
```json
{
  "fullName": "Admin Name",
  "phone": "9999999999",
  "aadhaar": "999999999999",
  "address": "Admin Address",
  "role": "admin",
  "mpin": "1234"
}
```

**Create EC** (`POST /api/admin/create-election-commission`)
```json
{
  "fullName": "EC Officer Name",
  "phone": "8888888888",
  "aadhaar": "888888888888",
  "address": "EC Office Address",
  "mpin": "1234"
}
```

### Method 3: Direct Database Insert (MongoDB)

```javascript
use agora;

// Create Admin
db.users.insertOne({
  uniqueId: "ADMIN-AGR-001",
  fullName: "Admin User",
  phone: "9876543210",
  aadhaar: "123456789012",
  address: "Admin Office",
  role: "admin",
  mpin: "$2a$10$...", // Use bcrypt hash
  isVerified: true,
  verifiedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create EC
db.users.insertOne({
  uniqueId: "EC-AGR-001",
  fullName: "Election Commission",
  phone: "9876543211",
  aadhaar: "123456789013",
  address: "EC Office",
  role: "election_commission",
  mpin: "$2a$10$...", // Use bcrypt hash
  isVerified: true,
  verifiedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## Login Process for Admin & EC

### Step 1: Access Login Page
Navigate to: `http://localhost:3000/auth`

### Step 2: Enter Unique ID
- Click on "Sign In" tab
- Enter your unique ID (e.g., `ADMIN-AGR-001` or `EC-AGR-001`)
- Click "Request OTP"

### Step 3: Get OTP
- OTP is sent to the registered phone number
- In development: Check the backend console/logs for the OTP
- In production: Receive OTP via SMS

### Step 4: Enter OTP
- Enter the 6-digit OTP received
- Click "Verify OTP"

### Step 5: Enter MPIN
- Enter your 4-digit MPIN
- Click "Login to Agora"

### Step 6: Dashboard Access
- You'll be redirected to your role-specific dashboard
- Admin: `/dashboard?role=admin`
- EC: `/dashboard?role=election_commission`

## Troubleshooting

### Issue 1: "User not found. Please check your unique ID."
**Solution:**
- Verify the unique ID is correctly stored in the database
- Check MongoDB collection: `db.users.findOne({ uniqueId: "ADMIN-AGR-001" })`
- Ensure the user was created successfully
- Run the demo users script if users don't exist

### Issue 2: "OTP not found or expired"
**Solution:**
- Check if OTP was generated (look in `otps` collection)
- OTPs expire after 5 minutes - request a new one
- Ensure backend server is running
- Check backend logs for OTP generation

### Issue 3: "Invalid MPIN"
**Solution:**
- Verify MPIN is correctly hashed in database
- Default MPIN for demo users is `1234`
- Reset MPIN if needed using the profile settings
- Check if bcrypt is working properly

### Issue 4: Login button not working
**Solution:**
- Open browser console (F12) and check for errors
- Verify API endpoints are reachable
- Check if backend server is running on port 5000
- Ensure MongoDB is connected

### Issue 5: OTP not showing in console
**Solution:**
- Check backend server logs: Look for `OTP for {name} ({phone}): {otp}`
- Verify console.log is not suppressed
- In production, configure SMS service (Twilio/AWS SNS)

## Recent Fix Applied

### Fixed: Login Flow Bug
**Issue:** OTP was being cleared before MPIN verification, causing authentication to fail.

**Solution:** Modified `digilocker-login.tsx` to:
1. Keep OTP value in state throughout the flow
2. Send both OTP and MPIN together in the final verification
3. Changed "Back" button on MPIN step to "Start Over" to prevent confusion

## Database Verification Commands

### Check if Admin/EC users exist
```javascript
// MongoDB Shell
use agora;

// Find admin users
db.users.find({ role: "admin" }).pretty();

// Find EC users
db.users.find({ role: "election_commission" }).pretty();

// Count admin and EC users
db.users.countDocuments({ role: { $in: ["admin", "election_commission"] } });
```

### Check OTP records
```javascript
// View OTP records
db.otps.find().pretty();

// Find OTP for specific phone
db.otps.findOne({ phone: "8888888001" });
```

### Update user MPIN (if needed)
```javascript
// Generate new MPIN hash using backend utils
// Then update in database
db.users.updateOne(
  { uniqueId: "ADMIN-AGR-001" },
  { $set: { mpin: "$2a$10$NEW_HASH_HERE" } }
);
```

## Security Considerations

1. **MPIN Storage**: Always hashed using bcrypt (10 salt rounds)
2. **OTP Expiry**: 5 minutes from generation
3. **OTP Attempts**: Maximum 3 attempts per OTP
4. **JWT Token**: 24-hour expiry
5. **Cookies**: HTTP-only, secure in production, SameSite=strict

## Dashboard Role Routing

After successful login, users are redirected based on their role:

```typescript
// Dashboard routing
switch(user.role) {
  case 'admin':
    redirect('/dashboard?role=admin')
    break;
  case 'election_commission':
    redirect('/dashboard?role=election_commission')
    break;
  case 'voter':
  case 'user':
    redirect('/dashboard?role=user')
    break;
}
```

## Testing Login System

### Test Admin Login
```bash
# 1. Create demo users
cd server
npm run create-demo-users

# 2. Start backend
npm run dev

# 3. Start frontend (in another terminal)
cd ../client
npm run dev

# 4. Visit http://localhost:3000/auth
# 5. Enter: ADMIN-AGR-001
# 6. Check backend console for OTP
# 7. Enter OTP and MPIN: 1234
```

### Test EC Login
Same as above, but use:
- Unique ID: `EC-AGR-001`
- Phone: `7777777001`
- MPIN: `1234`

## API Endpoints Reference

### Authentication
- `POST /api/auth/request-otp` - Request OTP for login
- `POST /api/auth/verify-otp-mpin` - Verify OTP and MPIN
- `GET /api/auth/verify` - Verify authentication status
- `POST /api/auth/register` - Register new voter
- `POST /api/auth/id-proof` - Issue ID proof

### Admin Operations
- `GET /api/admin/pending-users` - Get pending user registrations
- `POST /api/admin/verify-user` - Approve pending user
- `POST /api/admin/reject-user` - Reject pending user
- `POST /api/admin/create-election-commission` - Create EC user
- `GET /api/admin/stats` - Get admin statistics

## Environment Variables

Ensure these are set in your `.env` files:

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_DEV_MODE=true
```

## Summary

✅ **Admin and EC unique IDs are stored in the database**
✅ **Login system uses uniqueId + OTP + MPIN authentication**
✅ **Backend properly handles uniqueId-based login**
✅ **Frontend login flow has been fixed**
✅ **Demo users script creates test admin and EC accounts**

Your system is now fully functional for admin and EC login! The unique IDs are stored in MongoDB and the authentication flow properly validates users through the three-factor system.
