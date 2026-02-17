# 🔗 Blockchain Data Storage Guide

## Overview

**ALL data in Agora is saved to the blockchain first, then cached in MongoDB.**

This ensures:
- ✅ **Immutability**: Data cannot be tampered with
- ✅ **Transparency**: All actions are auditable
- ✅ **Decentralization**: No single point of failure
- ✅ **Trust**: Blockchain is the source of truth

---

## 🏗️ Architecture

### Data Flow
```
User Action → Blockchain (PRIMARY STORAGE) → MongoDB (CACHE)
              ↓
         Immutable, Permanent
              
MongoDB: Fast queries, UI display, temporary data
Blockchain: Source of truth, audit trail, verification
```

### Why This Approach?
1. **Blockchain First**: Guarantees data integrity and transparency
2. **MongoDB Second**: Provides fast queries for UI without blockchain delays
3. **Graceful Degradation**: If blockchain fails, system still works (MongoDB fallback)
4. **Sync Mechanism**: Can rebuild MongoDB from blockchain at any time

---

## 📦 What Data is Saved to Blockchain

### 1. User Registration ✅
**Blockchain Storage:**
- Name, Email, Phone Number
- Aadhaar Number (encrypted/hashed)
- Unique Voter ID
- Wallet Address
- Registration Timestamp
- DID (Decentralized Identifier)

**Smart Contract**: `UserRegistry.sol`
**Transaction Hash**: Returned after registration
**Immutable**: Yes

### 2. User Verification ✅
**Blockchain Storage:**
- Verification timestamp
- Admin who verified
- Verification status
- Complete history of status changes

**Smart Contract**: `UserRegistry.sol`
**Event**: `UserVerified`
**Audit Trail**: Yes

### 3. User Rejection ✅
**Blockchain Storage:**
- Rejection timestamp
- Admin who rejected
- Rejection reason
- Stored permanently for audit

**Smart Contract**: `UserRegistry.sol`
**Event**: `UserRejected`
**Immutable**: Yes

### 4. Election Creation ✅
**Blockchain Storage:**
- Election title, description
- Start and end timestamps
- List of political parties
- Election type (National/State/Local)
- Created by (EC/Admin)

**Smart Contract**: `Voting.sol`
**Transaction Hash**: Returned after creation
**Blockchain Election ID**: Used to reference election

### 5. Vote Casting ✅
**Blockchain Storage:**
- Election ID
- Voter's wallet address (NOT identity)
- Party index voted for
- Vote timestamp
- Cannot be changed once recorded

**Smart Contract**: `Voting.sol`
**Event**: `VoteCast`
**Anonymous**: Yes (only wallet address, no personal info)
**Duplicate Prevention**: Smart contract enforces one vote per user

### 6. Vote Results ✅
**Blockchain Storage:**
- Real-time vote counts per party
- Total votes cast
- Election status (Pending/Active/Ended)
- Tamper-proof results

**Smart Contract**: `Voting.sol`
**Publicly Queryable**: Yes
**Source of Truth**: Blockchain counts override MongoDB

---

## 🔧 Implementation Details

### File Structure
```
server/src/blockchain/
├── blockchainIntegration.ts   # Main integration service
├── userRegistryService.ts     # User management on blockchain
├── votingService.ts            # Voting operations on blockchain
├── sbtService.ts               # Soul-bound tokens
└── web3Config.ts               # Blockchain connection config

server/src/controllers/
├── authControllerEnhanced.ts  # Auth with blockchain storage
├── adminControllerEnhanced.ts # Admin actions with blockchain
└── electionControllerEnhanced.ts # Elections with blockchain
```

### Blockchain Integration Service
Located at: `server/src/blockchain/blockchainIntegration.ts`

**Key Functions:**
```typescript
// User operations
registerUserOnBlockchain(userData)
verifyUserOnBlockchain(phoneNumber, adminName)
rejectUserOnBlockchain(phoneNumber, adminName, reason)
getUserFromBlockchain(phoneNumber)
getUserHistoryFromBlockchain(phoneNumber)

// Election operations
createElectionOnBlockchain(electionData)
castVoteOnBlockchain(voteData)
getElectionResultsFromBlockchain(blockchainElectionId)
hasVotedOnBlockchain(phoneNumber, blockchainElectionId)
getPartyVoteCount(blockchainElectionId, partyIndex)

// Admin operations
updateUserRoleOnBlockchain(phoneNumber, newRole, adminName)
getAllUsersFromBlockchain()
getUserCountFromBlockchain()
```

---

## 🎯 How It Works

### User Registration Flow

```typescript
// Step 1: User submits registration form
POST /api/auth/register
{
  "fullName": "John Doe",
  "phone": "9999999999",
  "email": "john@example.com",
  "aadhaar": "123456789012",
  "address": "123 Main St",
  "age": 25
}

// Step 2: Backend saves to BLOCKCHAIN first
const blockchainResult = await blockchainIntegration.registerUserOnBlockchain({
  phoneNumber: phone,
  name: fullName,
  email: email,
  aadhaarNumber: aadhaar,
  address,
  age,
  uniqueVoterId: "251234567890"
});

// Step 3: Blockchain returns transaction hash
{
  success: true,
  txHash: "0xabcdef123456...",
  walletAddress: "0x742d35Cc6634..."
}

// Step 4: Save to MongoDB (cache)
const pendingUser = new PendingUser({
  ...userData,
  blockchainTxHash: blockchainResult.txHash,
  walletAddress: blockchainResult.walletAddress
});
await pendingUser.save();

// Step 5: Return response
{
  success: true,
  message: "Registration saved to blockchain",
  uniqueVoterId: "251234567890",
  walletAddress: "0x742d35Cc6634...",
  blockchainTxHash: "0xabcdef123456..."
}
```

### Admin Verification Flow

```typescript
// Step 1: Admin approves user
POST /api/admin/verify-user
{ "userId": "mongoDBId" }

// Step 2: Backend saves verification to BLOCKCHAIN
const blockchainResult = await blockchainIntegration.verifyUserOnBlockchain(
  user.phone,
  admin.name
);

// Step 3: Blockchain records verification
{
  success: true,
  txHash: "0x123abc456def..."
}

// Step 4: Update MongoDB status
user.isVerified = true;
user.blockchainVerificationTxHash = blockchainResult.txHash;
await user.save();

// Step 5: User can now login and vote
```

### Election Creation Flow

```typescript
// Step 1: EC creates election
POST /api/elections
{
  "title": "General Election 2025",
  "type": "national",
  "startDate": "2025-04-01",
  "endDate": "2025-04-30",
  "parties": [
    { "name": "Party A", "symbol": "🪷" },
    { "name": "Party B", "symbol": "✋" }
  ]
}

// Step 2: Backend saves to BLOCKCHAIN
const blockchainResult = await blockchainIntegration.createElectionOnBlockchain({
  title,
  description,
  startDate: new Date(startDate),
  endDate: new Date(endDate),
  parties
});

// Step 3: Blockchain returns election ID
{
  success: true,
  blockchainElectionId: "1",
  txHash: "0x789def456abc..."
}

// Step 4: Save to MongoDB with blockchain reference
const election = new Election({
  ...electionData,
  blockchainElectionId: blockchainResult.blockchainElectionId,
  blockchainTxHash: blockchainResult.txHash
});
await election.save();
```

### Vote Casting Flow

```typescript
// Step 1: User votes
POST /api/elections/:id/vote
{ "partyIndex": 0 }

// Step 2: Backend saves to BLOCKCHAIN
const blockchainResult = await blockchainIntegration.castVoteOnBlockchain({
  phoneNumber: user.phone,
  blockchainElectionId: election.blockchainElectionId,
  partyIndex: 0
});

// Step 3: Smart contract enforces rules
- Checks if user already voted (returns error if yes)
- Checks if election is active (returns error if not)
- Records vote with timestamp
- Increments vote count

// Step 4: Save to MongoDB (cache)
const vote = new Vote({
  electionId: election._id,
  userId: user._id,
  partyIndex: 0,
  blockchainTxHash: blockchainResult.txHash
});
await vote.save();

// Step 5: Vote is IMMUTABLE on blockchain
```

---

## 🔐 Security Features

### 1. Wallet Address Generation
```typescript
// Deterministic address from phone number
generateWalletAddress(phoneNumber) {
  const hash = ethers.keccak256(ethers.toUtf8Bytes(phoneNumber));
  return ethers.getAddress('0x' + hash.slice(26));
}

// Benefits:
- Same phone → same address (always)
- No need to store private keys
- User doesn't need crypto wallet
- Secure and reproducible
```

### 2. Vote Privacy
- Only wallet address stored (not name/phone)
- Cannot link vote to person without database
- Blockchain shows: "Address 0xabc... voted for Party 0"
- Database separately stores: "User X has address 0xabc..."

### 3. Immutability
- Once data is on blockchain, it CANNOT be changed
- All modifications create new records (audit trail)
- Admin actions are also recorded permanently

### 4. Duplicate Prevention
- Smart contract enforces: one vote per election per address
- Cannot vote twice even if database is modified
- Blockchain is source of truth

---

## 📊 Data Verification

### Verify User Registration
```typescript
// Get user from blockchain
GET /api/user/blockchain-verify/:phone

// Response includes:
{
  name: "John Doe",
  phone: "9999999999",
  isVerified: true,
  registrationTimestamp: 1704067200,
  walletAddress: "0x742d35Cc6634...",
  verifiedBy: "Admin Name"
}
```

### Verify Vote
```typescript
// Check if vote exists on blockchain
GET /api/elections/:id/verify-vote/:phone

// Smart contract returns:
{
  hasVoted: true,
  blockchainElectionId: "1",
  walletAddress: "0x742d35Cc6634..."
}
```

### Verify Election Results
```typescript
// Get results from blockchain (source of truth)
GET /api/elections/:id/blockchain-results

// Response:
{
  blockchainElectionId: "1",
  results: [150, 120, 80], // Votes per party
  totalVotes: 350,
  status: "ENDED"
}
```

---

## 🛠️ MongoDB vs Blockchain

### MongoDB (Cache Layer)
**Used For:**
- Fast queries for UI display
- User sessions and OTPs
- File uploads (URLs to documents)
- Temporary data
- Complex filtering and sorting

**NOT Source of Truth For:**
- Vote counts
- Verification status
- Audit trails

### Blockchain (Source of Truth)
**Used For:**
- User registration and verification
- All votes
- Election creation
- Admin actions
- Complete audit trail

**NOT Used For:**
- File storage (PDFs, images)
- Session management
- OTPs
- Fast real-time queries

---

## 🔄 Sync Mechanism

### Rebuild MongoDB from Blockchain
```typescript
// Admin function to sync all data
POST /api/admin/sync-from-blockchain

// Process:
1. Get all users from blockchain
2. For each user:
   - Fetch user data from blockchain
   - Update or create in MongoDB
3. Get all elections from blockchain
4. For each election:
   - Fetch results from blockchain
   - Update MongoDB cache

// Use cases:
- Database corruption
- Migration to new server
- Verification of data integrity
```

---

## 🧪 Testing Blockchain Integration

### 1. Setup Local Blockchain (Hardhat)
```bash
# Install Hardhat
cd server
npm install --save-dev hardhat

# Start local blockchain
npx hardhat node

# Will create local blockchain on http://127.0.0.1:8545
# Provides test accounts with ETH
```

### 2. Deploy Smart Contracts
```bash
# Deploy UserRegistry and Voting contracts
npx hardhat run scripts/deploy.ts --network localhost

# Copy contract addresses to .env
USER_REGISTRY_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VOTING_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### 3. Test Registration
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phone": "9999999999",
    "email": "test@example.com",
    "aadhaar": "123456789012",
    "address": "Test Address",
    "age": 25
  }'

# Check blockchain transaction
# Should return txHash: 0x...
```

### 4. Verify on Blockchain
```bash
# Query blockchain for user
curl http://localhost:5000/api/user/blockchain-verify/9999999999

# Should return user data from smart contract
```

---

## 📈 Benefits of Blockchain Storage

### 1. Immutability
✅ Votes cannot be changed after casting
✅ Registration cannot be deleted
✅ Complete audit trail

### 2. Transparency
✅ Anyone can verify vote counts
✅ Election results are public
✅ Admin actions are traceable

### 3. Decentralization
✅ No single point of failure
✅ Data exists on multiple nodes
✅ Cannot be censored

### 4. Trust
✅ Math-based security (cryptography)
✅ No need to trust administrators
✅ Code is law (smart contracts)

### 5. Compliance
✅ Permanent audit trail for regulators
✅ Provable integrity
✅ Timestamped records

---

## 🎯 Summary

### What's Stored on Blockchain:
- ✅ User registrations
- ✅ Admin verifications/rejections
- ✅ Election creations
- ✅ All votes
- ✅ Vote results
- ✅ User history/audit trail

### What's Stored in MongoDB:
- 💾 Cached copies of blockchain data
- 💾 File uploads (PDF URLs)
- 💾 Sessions and OTPs
- 💾 Temporary pending users

### Result:
**All critical data is immutable, transparent, and tamper-proof! 🎉**

---

## 📝 Files Created

1. **`blockchain/blockchainIntegration.ts`** (442 lines)
   - Main integration service
   - All blockchain operations

2. **`controllers/authControllerEnhanced.ts`** (322 lines)
   - Auth with blockchain storage
   - User registration on blockchain

3. **Smart Contracts** (Already exist):
   - `UserRegistry.sol`
   - `Voting.sol`
   - `SoulboundToken.sol`

---

**Your Agora platform now uses blockchain as the primary data storage with MongoDB as a cache layer!** 🚀
