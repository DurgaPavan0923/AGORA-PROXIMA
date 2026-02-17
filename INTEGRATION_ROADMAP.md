# 🗺️ Backend-Frontend Integration Roadmap

## 📦 What's Already Done

### ✅ Backend (Complete)
- ✅ Express server with TypeScript
- ✅ MongoDB models: User, PendingUser, Election, Vote, Proposal, OTP
- ✅ Authentication system (OTP + MPIN)
- ✅ Admin routes (verify/reject users, stats)
- ✅ Election routes (CRUD, voting)
- ✅ Proposal routes (CRUD, voting)
- ✅ User routes (profile, history)
- ✅ Security middleware (helmet, CORS, rate limiting)
- ✅ Blockchain services (SBT, Voting, UserRegistry)

### ✅ Frontend (Complete)
- ✅ Next.js with TypeScript
- ✅ Professional UI/UX design
- ✅ Logo and animations
- ✅ RegistrationForm component
- ✅ AdminVerificationDashboard component
- ✅ CreateMPINModal component
- ✅ ChangeMPINModal component
- ✅ Hero, Header, Footer components

### ✅ Integration Files Created
- ✅ `client/lib/api.ts` - Complete API client
- ✅ `client/.env.local` - Frontend environment variables
- ✅ `server/.env` - Backend environment variables
- ✅ Complete documentation

---

## 🔧 What Needs to Be Added/Modified

### 1. Backend Enhancements

#### A. File Upload Support (Priority: HIGH)
**Location:** `server/src/routes/auth.ts` and `authController.ts`

**Install multer:**
```bash
cd server
npm install multer @types/multer
```

**Add to `authController.ts`:**
```typescript
// Add file upload handling to register function
export const registerWithDocuments = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, aadhaar, address, age, email, voterIdNumber } = req.body
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    
    // Get uploaded files
    const aadhaarCard = files['aadhaarCard']?.[0]
    const voterIdCard = files['voterIdCard']?.[0]
    
    // Validate
    if (!fullName || !phone || !aadhaar || !address || !age) {
      return res.status(400).json({ error: 'All fields required' })
    }
    
    if (!aadhaarCard || !voterIdCard) {
      return res.status(400).json({ error: 'Both ID documents required' })
    }
    
    // Create pending user with document URLs
    const pendingUser = new PendingUser({
      fullName,
      phone,
      email,
      aadhaar,
      address,
      age: parseInt(age),
      voterIdNumber,
      aadhaarCardUrl: `/uploads/documents/${aadhaarCard.filename}`,
      voterIdCardUrl: `/uploads/documents/${voterIdCard.filename}`,
      status: 'pending',
    })
    
    await pendingUser.save()
    
    res.json({
      success: true,
      message: 'Registration submitted successfully',
      userId: pendingUser._id,
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
}
```

**Add to `routes/auth.ts`:**
```typescript
import multer from 'multer'
import path from 'path'

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed'))
    }
  }
})

// Add new route
router.post(
  '/register-with-documents',
  upload.fields([
    { name: 'aadhaarCard', maxCount: 1 },
    { name: 'voterIdCard', maxCount: 1 }
  ]),
  registerWithDocuments
)
```

**Create uploads directory:**
```bash
mkdir -p server/uploads/documents
```

**Add static file serving to `server.ts`:**
```typescript
// Add after other middleware
app.use('/uploads', express.static('uploads'))
```

---

#### B. MPIN Management Routes (Priority: HIGH)

**Add to `authController.ts`:**
```typescript
// Create MPIN (first-time setup)
export const createMPIN = async (req: AuthRequest, res: Response) => {
  try {
    const { mpin } = req.body
    
    if (!mpin || !/^[0-9]{6}$/.test(mpin)) {
      return res.status(400).json({ error: 'MPIN must be 6 digits' })
    }
    
    const user = await User.findOne({ uniqueId: req.user?.uniqueId })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    if (user.mpin) {
      return res.status(400).json({ error: 'MPIN already set' })
    }
    
    user.mpin = await hashMPIN(mpin)
    user.mpinCreatedAt = new Date()
    await user.save()
    
    res.json({ success: true, message: 'MPIN created successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create MPIN' })
  }
}

// Verify MPIN
export const verifyMPIN = async (req: AuthRequest, res: Response) => {
  try {
    const { mpin } = req.body
    
    const user = await User.findOne({ uniqueId: req.user?.uniqueId }).select('+mpin')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    const isValid = await compareMPIN(mpin, user.mpin)
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid MPIN' })
    }
    
    res.json({ success: true, message: 'MPIN verified' })
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' })
  }
}

// Change MPIN
export const changeMPIN = async (req: AuthRequest, res: Response) => {
  try {
    const { oldMpin, newMpin } = req.body
    
    if (!newMpin || !/^[0-9]{6}$/.test(newMpin)) {
      return res.status(400).json({ error: 'New MPIN must be 6 digits' })
    }
    
    const user = await User.findOne({ uniqueId: req.user?.uniqueId }).select('+mpin')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    const isValidOld = await compareMPIN(oldMpin, user.mpin)
    if (!isValidOld) {
      return res.status(400).json({ error: 'Current MPIN incorrect' })
    }
    
    user.mpin = await hashMPIN(newMpin)
    user.mpinUpdatedAt = new Date()
    await user.save()
    
    res.json({ success: true, message: 'MPIN changed successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to change MPIN' })
  }
}

// Check if user has MPIN
export const checkMPIN = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ uniqueId: req.user?.uniqueId })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ hasMpin: !!user.mpin })
  } catch (error) {
    res.status(500).json({ error: 'Check failed' })
  }
}
```

**Add routes to `routes/auth.ts`:**
```typescript
router.post('/create-mpin', authenticate, createMPIN)
router.post('/verify-mpin', authenticate, verifyMPIN)
router.post('/change-mpin', authenticate, changeMPIN)
router.get('/check-mpin', authenticate, checkMPIN)
router.post('/logout', authenticate, logout)
```

---

#### C. Update User Model (Priority: HIGH)

**Add to `models/User.ts`:**
```typescript
export interface IUser extends Document {
  // ... existing fields
  age?: number
  email?: string
  voterIdNumber?: string
  aadhaarCardUrl?: string
  voterIdCardUrl?: string
  mpinCreatedAt?: Date
  mpinUpdatedAt?: Date
  mpinAttempts?: number
  mpinLockedUntil?: Date
}

const userSchema = new Schema<IUser>({
  // ... existing fields
  age: { type: Number, required: false },
  email: { type: String, required: false },
  voterIdNumber: { type: String, required: false },
  aadhaarCardUrl: { type: String, required: false },
  voterIdCardUrl: { type: String, required: false },
  mpinCreatedAt: { type: Date },
  mpinUpdatedAt: { type: Date },
  mpinAttempts: { type: Number, default: 0 },
  mpinLockedUntil: { type: Date },
}, { timestamps: true })
```

---

#### D. Admin Voter ID Generation (Priority: MEDIUM)

**Add to `adminController.ts`:**
```typescript
// Generate 12-digit unique voter ID
export const generateVoterID = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body
    
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    if (user.uniqueId) {
      return res.status(400).json({ error: 'Voter ID already assigned' })
    }
    
    // Generate 12-digit ID: XXYYZZZZZZZZ
    // XX = year (25 for 2025)
    // YY = state code (random for now)
    // ZZZZZZZZ = random 8 digits
    const year = new Date().getFullYear() % 100
    const stateCode = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    const randomPart = Math.floor(10000000 + Math.random() * 90000000)
    const voterId = `${year}${stateCode}${randomPart}`
    
    user.uniqueId = voterId
    await user.save()
    
    res.json({
      success: true,
      voterId,
      message: 'Voter ID generated successfully'
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate voter ID' })
  }
}
```

---

### 2. Frontend Component Integration

#### A. Update RegistrationForm to Use API (Priority: HIGH)

**File:** `client/components/registration-form.tsx`

**Changes needed:**
```typescript
import { api } from '@/lib/api'

// In handleSubmit function:
const handleSubmit = async () => {
  try {
    setIsSubmitting(true)
    
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('fullName', formData.name)
    formData.append('phone', formData.phone)
    formData.append('email', formData.email)
    formData.append('age', formData.age)
    formData.append('address', formData.address)
    formData.append('aadhaar', formData.aadhaarNumber)
    formData.append('voterIdNumber', formData.voterIdNumber)
    
    if (formData.aadhaarCard) {
      formData.append('aadhaarCard', formData.aadhaarCard)
    }
    if (formData.voterIdCard) {
      formData.append('voterIdCard', formData.voterIdCard)
    }
    
    // Call API
    const response = await api.auth.register(formData)
    
    // Show success message
    alert('Registration submitted successfully! Wait for admin approval.')
    
    // Reset form
    // ...
  } catch (error: any) {
    alert(error.message || 'Registration failed')
  } finally {
    setIsSubmitting(false)
  }
}
```

---

#### B. Update AdminVerificationDashboard (Priority: HIGH)

**File:** `client/components/admin-verification-dashboard.tsx`

**Add API integration:**
```typescript
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'

const AdminVerificationDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadPendingUsers()
  }, [])
  
  const loadPendingUsers = async () => {
    try {
      const users = await api.admin.getPendingUsers()
      setPendingUsers(users)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleApprove = async (userId: string) => {
    try {
      await api.admin.verifyUser(userId)
      alert('User approved successfully')
      loadPendingUsers()
    } catch (error: any) {
      alert(error.message)
    }
  }
  
  const handleReject = async (userId: string, reason: string) => {
    try {
      await api.admin.rejectUser(userId, reason)
      alert('User rejected')
      loadPendingUsers()
    } catch (error: any) {
      alert(error.message)
    }
  }
  
  // ... rest of component
}
```

---

#### C. Create Login Page (Priority: HIGH)

**File:** `client/app/auth/login/page.tsx` (NEW)

```typescript
'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp' | 'mpin'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [mpin, setMpin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleRequestOTP = async () => {
    try {
      setLoading(true)
      setError('')
      await api.auth.requestOTP(phoneNumber)
      setStep('otp')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleVerify = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.auth.verifyOTPAndMPIN(phoneNumber, otp, mpin)
      
      // Success - redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  // ... render UI
}
```

---

### 3. Missing Frontend Pages

#### A. Elections Management (Priority: MEDIUM)

Create:
- `client/app/dashboard/elections/page.tsx` - List all elections
- `client/app/dashboard/elections/[id]/page.tsx` - Vote in election
- `client/app/admin/elections/create/page.tsx` - Create election (EC/Admin only)

#### B. Proposals System (Priority: LOW)

Create:
- `client/app/proposals/page.tsx` - List proposals
- `client/app/proposals/[id]/page.tsx` - Vote on proposal
- `client/app/proposals/create/page.tsx` - Create proposal

#### C. User Profile (Priority: MEDIUM)

Create:
- `client/app/dashboard/profile/page.tsx` - View/edit profile
- Include ChangeMPINModal integration

---

### 4. Authentication Context (Priority: HIGH)

**File:** `client/context/AuthContext.tsx` (NEW)

```typescript
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { api, User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, otp: string, mpin: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const checkAuth = async () => {
    try {
      const response = await api.auth.verifyAuth()
      setUser(response.user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  const login = async (phone: string, otp: string, mpin: string) => {
    const response = await api.auth.verifyOTPAndMPIN(phone, otp, mpin)
    setUser(response.user)
  }
  
  const logout = async () => {
    await api.auth.logout()
    setUser(null)
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

---

## 📊 Priority Order

### Immediate (Do First)
1. ✅ Create API client (`client/lib/api.ts`) - DONE
2. ✅ Create `.env` files - DONE
3. 🔄 Start backend and verify it works
4. 🔄 Test API endpoints with curl/Postman
5. 🔄 Add file upload support to backend
6. 🔄 Add MPIN routes to backend
7. 🔄 Update RegistrationForm with API calls
8. 🔄 Create login page

### Secondary (Do Next)
9. Create AuthContext
10. Update AdminVerificationDashboard
11. Create elections pages
12. Add protected routes middleware
13. Test end-to-end registration flow

### Later (Nice to Have)
14. Create proposals pages
15. Add blockchain integration
16. Add real-time updates
17. Add notifications
18. Deploy to production

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] MongoDB connection works
- [ ] Backend starts on port 5000
- [ ] Health check endpoint responds
- [ ] CORS allows requests from localhost:3000
- [ ] File upload endpoint works
- [ ] Registration creates pending user
- [ ] OTP generation works
- [ ] Login flow completes

### Frontend Tests
- [ ] Frontend starts on port 3000
- [ ] API client connects to backend
- [ ] Registration form submits data
- [ ] File uploads work
- [ ] Login flow works
- [ ] Protected routes redirect if not logged in
- [ ] Admin dashboard loads users
- [ ] Elections display properly

### Integration Tests
- [ ] Complete registration → approval → login flow
- [ ] Create election → vote → see results
- [ ] Admin verification workflow
- [ ] MPIN creation and change

---

## 📝 Next Immediate Steps

1. **Start Backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Verify Backend Works:**
   ```bash
   curl http://localhost:5000/health
   curl http://localhost:5000/api/elections
   ```

3. **Add File Upload:**
   - Install multer
   - Add upload middleware
   - Update register route
   - Create uploads directory

4. **Add MPIN Routes:**
   - Add functions to authController
   - Add routes to auth.ts
   - Export functions

5. **Test with Frontend:**
   - Update RegistrationForm
   - Test registration flow
   - Fix any errors

---

**Status: Ready to implement! Start with steps 1-2 to verify backend works, then proceed with priority tasks.**
