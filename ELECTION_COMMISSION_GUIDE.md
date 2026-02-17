# 🗳️ Election Commission Feature Guide

## Overview

The Election Commission can organize and manage elections on the Agora platform. This includes creating elections, adding political parties, setting voting dates, and managing election status.

---

## ✅ What's Already Implemented

### Backend (100% Complete)
- ✅ Role-based access control for Election Commission
- ✅ Create elections endpoint
- ✅ Update elections endpoint
- ✅ Delete elections endpoint
- ✅ View all elections endpoint
- ✅ Vote recording with duplicate prevention
- ✅ Real-time vote counting

### Frontend (NEW - Just Created)
- ✅ **Election Commission Dashboard** component
- ✅ Create/Edit election form
- ✅ Add multiple political parties
- ✅ Set election dates
- ✅ Manage election status (upcoming → active → completed)
- ✅ View all elections with statistics
- ✅ Delete elections

---

## 🎯 Election Commission Capabilities

### 1. Create Elections
Election Commission users can create new elections with:
- **Title**: Name of the election (e.g., "General Election 2025")
- **Type**: National, State, or Local
- **Description**: Purpose and scope
- **Start Date**: When voting opens
- **End Date**: When voting closes
- **Political Parties**: Minimum 2 parties required
  - Party name
  - Symbol (emoji)
  - Brief manifesto

### 2. Manage Elections
- **Edit**: Update election details before it becomes active
- **Start**: Change status from "upcoming" to "active"
- **End**: Change status from "active" to "completed"
- **Delete**: Remove elections (with confirmation)

### 3. View Statistics
- Total number of elections
- Number of parties per election
- Total votes received
- Current status (upcoming/active/completed)

---

## 📋 How to Use

### Step 1: Admin Creates Election Commission User

```typescript
// Admin endpoint
POST /api/admin/create-election-commission
Body: {
  "fullName": "Election Commission Officer",
  "phone": "9999999999",
  "email": "ec@agora.gov.in"
}
```

### Step 2: Election Commission Logs In

1. Navigate to login page
2. Request OTP with phone number
3. Verify OTP + MPIN
4. Access Election Commission Dashboard

### Step 3: Create an Election

1. Click **"Create New Election"** button
2. Fill in election details:
   - Title: "Lok Sabha Election 2025"
   - Type: National
   - Description: "General election for Lok Sabha"
   - Start Date: 2025-04-01
   - End Date: 2025-04-30

3. Add political parties (minimum 2):
   - Party 1: Name="Bharatiya Janata Party", Symbol="🪷"
   - Party 2: Name="Indian National Congress", Symbol="✋"
   - Party 3: Name="Aam Aadmi Party", Symbol="🧹"
   - Add more as needed...

4. Click **"Create Election"**

### Step 4: Manage Election Status

**Before voting starts:**
- Status: "Upcoming" (blue badge)
- Can edit all details
- Can delete if needed

**To start voting:**
- Click **"Start"** button
- Status changes to "Active" (green badge)
- Citizens can now vote

**To end voting:**
- Click **"End"** button
- Status changes to "Completed" (gray badge)
- Results are finalized

---

## 🔧 API Endpoints for Election Commission

### Create Election
```bash
POST /api/elections
Headers: Authorization: Bearer <token>
Body: {
  "title": "General Election 2025",
  "description": "National election for parliament",
  "type": "national",
  "startDate": "2025-04-01T00:00:00Z",
  "endDate": "2025-04-30T23:59:59Z",
  "parties": [
    {
      "name": "Party A",
      "symbol": "🪷",
      "manifesto": "Development agenda"
    },
    {
      "name": "Party B",
      "symbol": "✋",
      "manifesto": "Social welfare focus"
    }
  ]
}
```

### Update Election
```bash
PUT /api/elections/:id
Headers: Authorization: Bearer <token>
Body: {
  "status": "active"  // or "completed"
}
```

### Delete Election
```bash
DELETE /api/elections/:id
Headers: Authorization: Bearer <token>
```

### Get All Elections (Public)
```bash
GET /api/elections
```

### Get Election by ID (Public)
```bash
GET /api/elections/:id
```

---

## 📊 Election Status Flow

```
Created (Draft)
    ↓
Upcoming (Scheduled)
    ↓
Active (Voting Open)
    ↓
Completed (Results Final)
```

### Status Details

**Upcoming:**
- Election is scheduled but voting hasn't started
- Citizens can see the election but cannot vote yet
- EC can edit all details
- Shown with blue badge

**Active:**
- Voting is currently open
- Citizens can cast their votes
- EC cannot edit major details (parties, dates)
- Shown with green badge

**Completed:**
- Voting has ended
- Results are visible to everyone
- No more changes allowed
- Shown with gray badge

---

## 🎨 Using the Dashboard Component

### Import the Component
```typescript
import ElectionCommissionDashboard from '@/components/election-commission-dashboard'
```

### Add to a Page
```typescript
// app/election-commission/page.tsx
import ElectionCommissionDashboard from '@/components/election-commission-dashboard'

export default function ElectionCommissionPage() {
  return <ElectionCommissionDashboard />
}
```

### Protected Route (Recommended)
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/election-commission')) {
    // Verify user has election_commission role
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: { Cookie: request.headers.get('cookie') || '' }
    })
    
    const data = await response.json()
    if (data.user?.role !== 'election_commission' && data.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }
  
  return NextResponse.next()
}
```

---

## 🔒 Security & Permissions

### Who Can Create Elections?
Only users with these roles:
- ✅ `election_commission` (primary role)
- ✅ `admin` (can also create elections)

### Who Can Vote?
- ✅ Any verified user with `voter` role
- ✅ Must be authenticated
- ✅ Can only vote once per election
- ✅ Only during active election period

### Validations
1. **Date Validation:**
   - End date must be after start date
   - Cannot vote outside of date range

2. **Party Validation:**
   - Minimum 2 parties required
   - Each party must have name and symbol

3. **Status Validation:**
   - Can only vote in "active" elections
   - Cannot edit "completed" elections

4. **Duplicate Prevention:**
   - One vote per user per election
   - Enforced at database level

---

## 🎯 Example Election Creation Flow

### Example 1: National Election
```typescript
const election = {
  title: "Lok Sabha General Election 2025",
  description: "Election for Members of Parliament",
  type: "national",
  startDate: "2025-04-01T06:00:00Z",
  endDate: "2025-04-30T18:00:00Z",
  parties: [
    { name: "BJP", symbol: "🪷", manifesto: "Development first" },
    { name: "INC", symbol: "✋", manifesto: "Unity in diversity" },
    { name: "AAP", symbol: "🧹", manifesto: "Clean governance" }
  ]
}

await api.elections.create(election)
```

### Example 2: State Election
```typescript
const election = {
  title: "Delhi Legislative Assembly Election",
  description: "State assembly election for Delhi",
  type: "state",
  startDate: "2025-02-01T06:00:00Z",
  endDate: "2025-02-15T18:00:00Z",
  parties: [
    { name: "BJP Delhi", symbol: "🪷", manifesto: "Delhi development" },
    { name: "AAP Delhi", symbol: "🧹", manifesto: "Bijli-Paani" }
  ]
}

await api.elections.create(election)
```

### Example 3: Local Election
```typescript
const election = {
  title: "Municipal Corporation Election - Ward 15",
  description: "Local body election for ward representatives",
  type: "local",
  startDate: "2025-03-01T08:00:00Z",
  endDate: "2025-03-01T17:00:00Z",
  parties: [
    { name: "Independent Candidate A", symbol: "🏠", manifesto: "Local issues" },
    { name: "Independent Candidate B", symbol: "🌳", manifesto: "Green ward" }
  ]
}

await api.elections.create(election)
```

---

## 📱 Dashboard Features

### Header Section
- Title: "Election Commission Dashboard"
- Create button (toggles form)
- Shows total election count

### Create/Edit Form
- **Basic Info**: Title, Type, Description
- **Dates**: Start date, End date (with date picker)
- **Parties Section**: 
  - Add party form (name, symbol, manifesto)
  - List of added parties with remove button
  - Validation: minimum 2 parties
- **Actions**: Create/Update button, Cancel button

### Elections List
- **Card view** for each election
- **Badges**: Type (national/state/local), Status (upcoming/active/completed)
- **Statistics**: Start/end dates, party count, total votes
- **Actions**: Edit, Start, End, Delete buttons
- **Empty state**: Shown when no elections exist

### Status Colors
- 🔵 **Upcoming**: Blue badge
- 🟢 **Active**: Green badge
- ⚫ **Completed**: Gray badge
- 🟣 **National**: Purple badge
- 🔷 **State**: Indigo badge
- 🟦 **Local**: Teal badge

---

## 🧪 Testing the Feature

### Test 1: Create Election Commission User
```bash
# As Admin
POST http://localhost:5000/api/admin/create-election-commission
{
  "fullName": "EC Officer",
  "phone": "9876543210",
  "email": "ec@agora.gov"
}
```

### Test 2: Login as EC
```bash
# Request OTP
POST http://localhost:5000/api/auth/request-otp
{ "phone": "9876543210" }

# Verify OTP + MPIN
POST http://localhost:5000/api/auth/verify-otp-mpin
{ "phone": "9876543210", "otp": "123456", "mpin": "654321" }
```

### Test 3: Create Election
```bash
POST http://localhost:5000/api/elections
Headers: Cookie: token=<jwt-token>
{
  "title": "Test Election 2025",
  "description": "Test election",
  "type": "local",
  "startDate": "2025-06-01",
  "endDate": "2025-06-30",
  "parties": [
    { "name": "Party A", "symbol": "🅰️", "manifesto": "Test A" },
    { "name": "Party B", "symbol": "🅱️", "manifesto": "Test B" }
  ]
}
```

### Test 4: Update Election Status
```bash
PUT http://localhost:5000/api/elections/<election-id>
Headers: Cookie: token=<jwt-token>
{ "status": "active" }
```

---

## 📝 Next Steps

1. **Start Backend & Frontend:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

2. **Create EC User:**
   - Login as admin
   - Use admin dashboard
   - Create election commission user

3. **Test Dashboard:**
   - Login as EC user
   - Navigate to `/election-commission` (or wherever you mount the component)
   - Create a test election
   - Add parties
   - Test status changes

4. **Verify Voting:**
   - Login as regular user
   - View active elections
   - Cast vote
   - Check results

---

## ✅ Feature Complete!

The Election Commission feature is **fully implemented** in both backend and frontend! 🎉

**Backend:** Already had complete role-based access control and election management  
**Frontend:** Just created comprehensive dashboard component

**You can now:**
- Create Election Commission users (as admin)
- Organize elections (as EC)
- Manage election lifecycle (upcoming → active → completed)
- Add unlimited political parties
- Set voting schedules
- View real-time statistics

**File created:** `client/components/election-commission-dashboard.tsx` (498 lines)
