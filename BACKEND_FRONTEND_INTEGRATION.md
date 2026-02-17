# 🔗 Backend-Frontend Integration Guide

## Overview

Complete guide to connect your Agora backend with frontend, ensuring all features work seamlessly.

---

## 📋 Backend Features Available

### Authentication Routes (`/api/auth`)
```typescript
POST   /api/auth/request-otp        // Request OTP for phone login
POST   /api/auth/verify-otp-mpin    // Verify OTP + MPIN
POST   /api/auth/register            // Register new user
GET    /api/auth/verify              // Check auth status
POST   /api/auth/id-proof            // Issue ID proof
```

### Admin Routes (`/api/admin`)
```typescript
GET    /api/admin/pending-users               // Get users awaiting verification
POST   /api/admin/verify-user                 // Approve user
POST   /api/admin/reject-user                 // Reject user
POST   /api/admin/create-election-commission  // Create EC user
GET    /api/admin/stats                       // Get dashboard stats
```

### Election Routes (`/api/elections`)
```typescript
GET    /api/elections              // Get all elections
GET    /api/elections/:id          // Get specific election
POST   /api/elections              // Create election (EC/Admin only)
PUT    /api/elections/:id          // Update election (EC/Admin only)
POST   /api/elections/:id/vote     // Cast vote
GET    /api/elections/:id/check-voted  // Check if user voted
```

### Proposal Routes (`/api/proposals`)
```typescript
GET    /api/proposals              // Get all proposals
GET    /api/proposals/:id          // Get specific proposal
POST   /api/proposals              // Create proposal (Auth required)
POST   /api/proposals/:id/vote     // Vote on proposal
```

### User Routes (`/api/user`)
```typescript
GET    /api/user/profile           // Get user profile
GET    /api/user/elections         // Get user's elections
GET    /api/user/voting-history    // Get voting history
PUT    /api/user/profile           // Update profile
```

---

## 🚀 Quick Setup

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required: MONGODB_URI, JWT_SECRET, CLIENT_URL

# Start MongoDB (if local)
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Run backend in development mode
npm run dev
```

**Server should start on:** `http://localhost:5000`

---

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Restart dev server
npm run dev
```

---

## 📝 Environment Variables

### Backend (`.env`)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/agora

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Client URL
CLIENT_URL=http://localhost:3000

# Blockchain (optional for now)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CHAIN_ID=31337
ADMIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔧 API Client Setup

### Create API Utility (`client/lib/api.ts`)

```typescript
// client/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface RequestOptions extends RequestInit {
  data?: any
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { data, ...customConfig } = options

    const config: RequestInit = {
      method: data ? 'POST' : 'GET',
      ...customConfig,
      headers: {
        'Content-Type': 'application/json',
        ...customConfig.headers,
      },
      credentials: 'include', // Important for cookies
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'API Error')
      }

      return responseData
    } catch (error: any) {
      throw new Error(error.message || 'Network error')
    }
  }

  // Auth endpoints
  auth = {
    requestOTP: (phoneNumber: string) =>
      this.request('/auth/request-otp', {
        data: { phoneNumber },
      }),

    verifyOTPAndMPIN: (phoneNumber: string, otp: string, mpin: string) =>
      this.request('/auth/verify-otp-mpin', {
        data: { phoneNumber, otp, mpin },
      }),

    register: (userData: any) =>
      this.request('/auth/register', {
        data: userData,
      }),

    verifyAuth: () => this.request('/auth/verify'),

    logout: () =>
      this.request('/auth/logout', {
        method: 'POST',
      }),
  }

  // Admin endpoints
  admin = {
    getPendingUsers: () => this.request('/admin/pending-users'),

    verifyUser: (userId: string) =>
      this.request('/admin/verify-user', {
        data: { userId },
      }),

    rejectUser: (userId: string, reason: string) =>
      this.request('/admin/reject-user', {
        data: { userId, reason },
      }),

    getStats: () => this.request('/admin/stats'),

    createElectionCommission: (userData: any) =>
      this.request('/admin/create-election-commission', {
        data: userData,
      }),
  }

  // Election endpoints
  elections = {
    getAll: () => this.request('/elections'),

    getById: (id: string) => this.request(`/elections/${id}`),

    create: (electionData: any) =>
      this.request('/elections', {
        data: electionData,
      }),

    update: (id: string, electionData: any) =>
      this.request(`/elections/${id}`, {
        method: 'PUT',
        data: electionData,
      }),

    vote: (id: string, partyIndex: number) =>
      this.request(`/elections/${id}/vote`, {
        data: { partyIndex },
      }),

    checkVoted: (id: string) => this.request(`/elections/${id}/check-voted`),
  }

  // User endpoints
  user = {
    getProfile: () => this.request('/user/profile'),

    updateProfile: (profileData: any) =>
      this.request('/user/profile', {
        method: 'PUT',
        data: profileData,
      }),

    getElections: () => this.request('/user/elections'),

    getVotingHistory: () => this.request('/user/voting-history'),
  }

  // Proposals endpoints
  proposals = {
    getAll: () => this.request('/proposals'),

    getById: (id: string) => this.request(`/proposals/${id}`),

    create: (proposalData: any) =>
      this.request('/proposals', {
        data: proposalData,
      }),

    vote: (id: string, voteType: 'for' | 'against') =>
      this.request(`/proposals/${id}/vote`, {
        data: { voteType },
      }),
  }
}

export const api = new APIClient(API_URL)
```

---

## 🔐 Authentication Flow

### 1. Login Flow

```typescript
// components/LoginForm.tsx
import { useState } from 'react'
import { api } from '@/lib/api'

export function LoginForm() {
  const [step, setStep] = useState<'phone' | 'otp' | 'mpin'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [mpin, setMpin] = useState('')
  const [error, setError] = useState('')

  const handleRequestOTP = async () => {
    try {
      await api.auth.requestOTP(phoneNumber)
      setStep('otp')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleVerifyOTP = async () => {
    try {
      const response = await api.auth.verifyOTPAndMPIN(phoneNumber, otp, mpin)
      // Store token if needed
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message)
    }
  }

  // ... render form
}
```

### 2. Protected Routes

```typescript
// middleware.ts (Next.js middleware)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing protected route
  if (pathname.startsWith('/dashboard')) {
    try {
      // Verify auth with backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        {
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
        }
      )

      if (!response.ok) {
        return NextResponse.redirect(new URL('/auth', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

---

## 📊 Feature Integration

### 1. Elections Voting

```typescript
// components/VotingInterface.tsx
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function VotingInterface({ electionId }: { electionId: string }) {
  const [election, setElection] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadElection()
  }, [electionId])

  const loadElection = async () => {
    try {
      const [electionData, votedStatus] = await Promise.all([
        api.elections.getById(electionId),
        api.elections.checkVoted(electionId),
      ])
      setElection(electionData)
      setHasVoted(votedStatus.hasVoted)
    } catch (error) {
      console.error('Failed to load election:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (partyIndex: number) => {
    try {
      await api.elections.vote(electionId, partyIndex)
      setHasVoted(true)
      // Reload election data
      loadElection()
    } catch (error: any) {
      alert(error.message)
    }
  }

  // ... render UI
}
```

### 2. Admin Verification

```typescript
// components/AdminVerification.tsx
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function AdminVerification() {
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
      console.error('Failed to load pending users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (userId: string) => {
    try {
      await api.admin.verifyUser(userId)
      // Reload pending users
      loadPendingUsers()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleReject = async (userId: string, reason: string) => {
    try {
      await api.admin.rejectUser(userId, reason)
      // Reload pending users
      loadPendingUsers()
    } catch (error: any) {
      alert(error.message)
    }
  }

  // ... render UI
}
```

### 3. User Dashboard

```typescript
// app/dashboard/user/page.tsx
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export default function UserDashboard() {
  const [profile, setProfile] = useState(null)
  const [elections, setElections] = useState([])
  const [votingHistory, setVotingHistory] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [profileData, electionsData, historyData] = await Promise.all([
        api.user.getProfile(),
        api.user.getElections(),
        api.user.getVotingHistory(),
      ])
      setProfile(profileData)
      setElections(electionsData)
      setVotingHistory(historyData)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    }
  }

  // ... render UI
}
```

---

## 🧪 Testing the Integration

### 1. Test Backend Health

```bash
# Check if backend is running
curl http://localhost:5000/health

# Should return:
# {"status":"ok","message":"Agora Backend API is running"}
```

### 2. Test Auth Flow

```bash
# Request OTP
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9999999999"}'

# Verify OTP + MPIN
curl -X POST http://localhost:5000/api/auth/verify-otp-mpin \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9999999999","otp":"123456","mpin":"123456"}'
```

### 3. Test Protected Routes

```bash
# Get elections (public)
curl http://localhost:5000/api/elections

# Get user profile (requires auth)
curl http://localhost:5000/api/user/profile \
  -H "Cookie: token=your-jwt-token"
```

---

## 🔧 Backend Enhancements Needed

### 1. Add File Upload for Document Verification

```typescript
// Install multer
npm install multer @types/multer

// Add to auth routes
import multer from 'multer'

const upload = multer({
  dest: 'uploads/documents/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed'))
    }
  },
})

router.post(
  '/register-with-documents',
  upload.fields([
    { name: 'aadhaarCard', maxCount: 1 },
    { name: 'voterIdCard', maxCount: 1 },
  ]),
  registerWithDocuments
)
```

### 2. Add MPIN Endpoints

```typescript
// Add to auth routes
router.post('/create-mpin', authenticate, createMPIN)
router.post('/verify-mpin', authenticate, verifyMPIN)
router.post('/change-mpin', authenticate, changeMPIN)
```

### 3. Add 12-Digit Voter ID Generation

```typescript
// Add to admin controller
export const generateVoterId = async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)

    // Generate unique 12-digit ID
    const voterId = generateUniqueVoterId()
    user.uniqueVoterId = voterId
    await user.save()

    res.json({ voterId })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
```

---

## 📦 Missing Backend Features to Add

### Priority 1: Document Upload
- ✅ File upload middleware (multer)
- ✅ Document storage
- ✅ Document retrieval API

### Priority 2: MPIN Management
- ✅ Create MPIN endpoint
- ✅ Verify MPIN endpoint
- ✅ Change MPIN endpoint
- ✅ MPIN hashing with bcrypt

### Priority 3: Voter ID Generation
- ✅ Generate unique 12-digit ID
- ✅ Store in database and blockchain
- ✅ Retrieve voter ID endpoint

---

## 🚀 Deployment Checklist

### Backend
- [ ] Set up production MongoDB
- [ ] Configure environment variables
- [ ] Set up file storage (AWS S3 or similar)
- [ ] Deploy to cloud (Heroku, AWS, DigitalOcean)
- [ ] Set up SSL certificate
- [ ] Configure CORS for production domain
- [ ] Set up logging and monitoring

### Frontend
- [ ] Update API_URL to production backend
- [ ] Build production bundle
- [ ] Deploy to Vercel/Netlify
- [ ] Configure environment variables
- [ ] Test all features in production

---

## 🎯 Next Steps

1. **Start Backend:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env
   npm run dev
   ```

2. **Configure Frontend:**
   ```bash
   cd client
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   npm run dev
   ```

3. **Create API Client:**
   - Copy the API client code above to `client/lib/api.ts`

4. **Update Components:**
   - Replace hardcoded data with API calls
   - Add loading states
   - Add error handling

5. **Test Integration:**
   - Test auth flow
   - Test voting
   - Test admin features

---

**Your backend is ready! Now connect it to the frontend using the API client! 🚀**
