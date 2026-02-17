# Agora API Documentation

Complete API reference with request/response examples.

## Base URL

**Development**: `http://localhost:5000`  
**Production**: Your production URL

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Or use cookie-based authentication (token is set automatically after login).

---

## Auth Endpoints

### Register User

**POST** `/api/auth/register`

Creates a pending user awaiting admin approval.

**Request Body**:
```json
{
  "fullName": "John Doe",
  "phone": "9876543210",
  "aadhaar": "123456789012",
  "address": "123 Main St, City, State",
  "role": "user"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Registration submitted. Awaiting admin approval.",
  "userId": "64abc123def456..."
}
```

---

### Request OTP

**POST** `/api/auth/request-otp`

Request OTP for login.

**Request Body**:
```json
{
  "phone": "9876543210"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### Verify OTP and Login

**POST** `/api/auth/verify-otp-mpin`

Verify OTP and MPIN to login.

**Request Body**:
```json
{
  "phone": "9876543210",
  "otp": "123456",
  "mpin": "1234"
}
```

**Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uniqueId": "AGR-ABC123",
    "fullName": "John Doe",
    "phone": "9876543210",
    "role": "user"
  }
}
```

---

### Verify Authentication

**GET** `/api/auth/verify`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "user": {
    "uniqueId": "AGR-ABC123",
    "fullName": "John Doe",
    "phone": "9876543210",
    "role": "user"
  }
}
```

---

## Admin Endpoints

All admin endpoints require `admin` role.

### Get Pending Users

**GET** `/api/admin/pending-users`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "pendingUsers": [
    {
      "_id": "64abc123...",
      "fullName": "Jane Smith",
      "phone": "9876543211",
      "aadhaar": "123456789013",
      "address": "456 Oak Ave",
      "role": "user",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Verify User

**POST** `/api/admin/verify-user`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "userId": "64abc123...",
  "mpin": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "User verified successfully",
  "user": {
    "uniqueId": "AGR-XYZ789",
    "fullName": "Jane Smith",
    "phone": "9876543211",
    "role": "user"
  }
}
```

---

### Get Admin Statistics

**GET** `/api/admin/stats`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1250,
    "pendingUsers": 15,
    "totalElections": 8,
    "activeElections": 2,
    "totalVotes": 8420,
    "totalProposals": 34
  }
}
```

---

## Election Endpoints

### Get All Elections

**GET** `/api/elections`

**Response** (200):
```json
{
  "success": true,
  "elections": [
    {
      "_id": "64abc...",
      "title": "General Election 2024",
      "description": "National general election",
      "startDate": "2024-05-01T00:00:00Z",
      "endDate": "2024-05-01T18:00:00Z",
      "status": "active",
      "parties": [
        {
          "id": "party1",
          "name": "Party A",
          "symbol": "lotus"
        }
      ],
      "totalVotes": 1523,
      "createdAt": "2024-04-01T10:00:00Z"
    }
  ]
}
```

---

### Get Election by ID

**GET** `/api/elections/:id`

**Response** (200):
```json
{
  "success": true,
  "election": {
    "_id": "64abc...",
    "title": "General Election 2024",
    "description": "National general election",
    "startDate": "2024-05-01T00:00:00Z",
    "endDate": "2024-05-01T18:00:00Z",
    "status": "active",
    "parties": [...],
    "totalVotes": 1523,
    "voteCounts": {
      "party1": 842,
      "party2": 681
    }
  }
}
```

---

### Create Election

**POST** `/api/elections`

**Headers**: `Authorization: Bearer <token>`  
**Roles**: `election_commission`, `admin`

**Request Body**:
```json
{
  "title": "Local Election 2024",
  "description": "Municipal elections",
  "startDate": "2024-06-15T08:00:00Z",
  "endDate": "2024-06-15T18:00:00Z",
  "parties": [
    {
      "id": "party1",
      "name": "Progressive Party",
      "symbol": "tree",
      "manifesto": "Focus on education and healthcare"
    }
  ]
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Election created successfully",
  "election": { ... }
}
```

---

### Vote in Election

**POST** `/api/elections/:id/vote`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "partyId": "party1"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Vote recorded successfully"
}
```

---

## Proposal Endpoints

### Get All Proposals

**GET** `/api/proposals?status=voting&category=Infrastructure`

Query Parameters:
- `status` (optional): Filter by status (voting, approved, rejected, etc.)
- `category` (optional): Filter by category
- `area` (optional): Filter by area

**Response** (200):
```json
{
  "success": true,
  "proposals": [
    {
      "_id": "64xyz...",
      "title": "Improve Public Transportation",
      "description": "Expand bus routes in North District",
      "area": "North District",
      "category": "Infrastructure",
      "status": "voting",
      "votes": {
        "yes": 782,
        "no": 156,
        "abstain": 45
      },
      "endDate": "2024-02-28T23:59:59Z",
      "createdAt": "2024-02-01T10:00:00Z"
    }
  ]
}
```

---

### Create Proposal

**POST** `/api/proposals`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "Community Garden Initiative",
  "description": "Create green spaces in residential areas",
  "area": "South Ward",
  "category": "Environment",
  "endDate": "2024-03-31T23:59:59Z"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Proposal created successfully",
  "proposal": { ... }
}
```

---

### Vote on Proposal

**POST** `/api/proposals/:id/vote`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "vote": "yes"
}
```

Accepted values: `"yes"`, `"no"`, `"abstain"`

**Response** (200):
```json
{
  "success": true,
  "message": "Vote recorded successfully"
}
```

---

## User Endpoints

### Get User Profile

**GET** `/api/user/profile`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "user": {
    "uniqueId": "AGR-ABC123",
    "fullName": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St",
    "role": "user",
    "isVerified": true,
    "verifiedAt": "2024-01-10T12:00:00Z",
    "createdAt": "2024-01-09T10:30:00Z"
  }
}
```

---

### Update User Profile

**PUT** `/api/user/profile`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "fullName": "John M. Doe",
  "address": "456 New Address, City"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### Change MPIN

**POST** `/api/user/change-mpin`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "currentMPIN": "1234",
  "newMPIN": "5678"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "MPIN changed successfully"
}
```

---

### Get User Statistics

**GET** `/api/user/stats`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "stats": {
    "totalElectionVotes": 12,
    "totalProposalVotes": 28,
    "activeElections": 2,
    "activeProposals": 5
  }
}
```

---

### Get Voting History

**GET** `/api/user/voting-history`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "history": [
    {
      "type": "election",
      "electionId": "64abc...",
      "electionTitle": "General Election 2024",
      "votedAt": "2024-05-01T14:30:00Z"
    },
    {
      "type": "proposal",
      "proposalId": "64xyz...",
      "proposalTitle": "Improve Transportation",
      "vote": "yes",
      "votedAt": "2024-04-28T10:15:00Z"
    }
  ]
}
```

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request**:
```json
{
  "error": "Invalid phone number"
}
```

**401 Unauthorized**:
```json
{
  "error": "Unauthorized - No token provided"
}
```

**403 Forbidden**:
```json
{
  "error": "Forbidden - Insufficient permissions"
}
```

**404 Not Found**:
```json
{
  "error": "User not found"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

All `/api/*` endpoints are rate limited to **100 requests per 15 minutes** per IP address.

If rate limit is exceeded:

**429 Too Many Requests**:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```
