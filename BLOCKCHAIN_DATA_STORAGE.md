# 🔗 Blockchain Data Storage Architecture

## Overview

Agora now uses **full blockchain data storage** to ensure:
- ✅ **Immutability** - Data cannot be changed without blockchain consensus
- ✅ **Transparency** - All changes are recorded on-chain with history
- ✅ **Admin-Only Modifications** - Only admin wallet can modify user data after verification
- ✅ **Tamper-Proof Voting** - All votes stored permanently on blockchain
- ✅ **Audit Trail** - Complete history of all user actions

---

## 🏗️ Architecture

### Data Flow

```
User Action → Backend API → Blockchain (Primary) → MongoDB (Cache)
                                ↓
                          Immutable Record
```

### Smart Contracts

#### 1. **UserRegistry.sol** - User Data Storage
- **Purpose**: Store all user information on blockchain
- **Admin Control**: Only admin wallet can verify/reject/modify users
- **Features**:
  - User registration with encrypted Aadhaar
  - Verification workflow
  - Complete user history
  - Role management (user, admin, election_commission)
  - Active/inactive status

#### 2. **VotingEnhanced.sol** - Election & Vote Storage
- **Purpose**: Store all election and vote data on blockchain
- **Admin Control**: Only admin can create/end elections
- **Features**:
  - Election creation with full metadata
  - Vote casting with DID verification
  - One-vote-per-user enforcement
  - Real-time vote counting
  - Election results transparency

#### 3. **SoulboundToken.sol** - Non-Transferable Identity
- **Purpose**: Unique identity tokens that cannot be transferred
- **Admin Control**: Only admin can mint/burn SBTs
- **Features**:
  - Non-transferable tokens
  - DID (Decentralized Identifier) linking
  - Identity verification

---

## 🔐 Admin-Only Modifications

### User Data Modifications

Only the admin wallet address can:
1. ✅ **Verify users** after registration
2. ✅ **Reject users** with reason
3. ✅ **Deactivate users** with reason
4. ✅ **Reactivate users**
5. ✅ **Update user roles** (user → admin → EC)
6. ✅ **View all users** and their history

### What Users CANNOT Do

❌ **Users cannot**:
- Change their own verification status
- Modify their profile data after registration
- Delete their account
- Change their role
- Alter their voting history
- Transfer their SBT token

---

## 📊 Data Stored on Blockchain

### User Data (UserRegistry)

```solidity
struct User {
    string uniqueIdProof;           // Encrypted Aadhaar
    string name;
    string email;
    string phoneNumber;
    address walletAddress;
    string did;                     // Decentralized Identifier
    uint256 sbtTokenId;
    bool isVerified;
    bool isActive;
    uint8 role;                     // 0: user, 1: admin, 2: EC
    uint256 registrationTimestamp;
    uint256 verificationTimestamp;
    string verifiedBy;              // Admin who verified
}
```

### User History (Immutable Audit Trail)

```solidity
struct UserHistory {
    uint256 timestamp;
    string action;                  // "registered", "verified", "rejected", "deactivated"
    string performedBy;
    string reason;
}
```

### Election Data (VotingEnhanced)

```solidity
struct Election {
    string title;
    string description;
    string category;
    uint256 startDate;
    uint256 endDate;
    Party[] parties;                // All parties with vote counts
    bool isActive;
    uint256 totalVotes;
    address createdBy;
    uint256 createdAt;
}
```

### Vote Data (Anonymous but Verifiable)

```solidity
struct Vote {
    address voter;                  // Wallet address (anonymous)
    uint256 electionId;
    uint256 partyIndex;
    uint256 timestamp;
    string voterDid;                // For verification
}
```

---

## 🚀 Implementation

### Backend Integration

#### 1. User Registration Flow

```typescript
// 1. User submits registration
POST /api/auth/register

// 2. Backend creates blockchain transaction
userRegistryService.registerUser(
  walletAddress,
  encryptedAadhaar,
  name,
  email,
  phone,
  did,
  sbtTokenId
)

// 3. Data stored on blockchain (immutable)
// 4. MongoDB caches data for fast queries
```

#### 2. Admin Verification Flow

```typescript
// 1. Admin verifies user
POST /api/admin/verify-user

// 2. Backend calls blockchain
userRegistryService.verifyUser(
  userAddress,
  adminName
)

// 3. Blockchain records:
//    - User status → verified
//    - Verification timestamp
//    - Admin who verified
//    - History entry created

// 4. User can now vote
```

#### 3. Voting Flow

```typescript
// 1. User casts vote
POST /api/elections/:id/vote

// 2. Backend calls blockchain
votingService.castVote(
  electionId,
  partyIndex,
  voterDid
)

// 3. Blockchain:
//    - Records vote (anonymous)
//    - Increments party vote count
//    - Marks user as voted
//    - Stores vote timestamp

// 4. Vote is PERMANENT and IMMUTABLE
```

---

## 🔍 Querying Blockchain Data

### User Data

```typescript
// Get user from blockchain
const user = await userRegistryService.getUser(walletAddress);

// Get user history (all modifications)
const history = await userRegistryService.getUserHistory(walletAddress);

// Check verification status
const isVerified = await userRegistryService.isUserVerified(walletAddress);
```

### Election Data

```typescript
// Get election details
const election = await votingService.getElection(electionId);

// Get real-time results
const results = await votingService.getElectionResults(electionId);

// Check if user voted
const hasVoted = await votingService.hasUserVoted(electionId, userAddress);

// Get user's voting history
const votedElections = await votingService.getUserVotedElections(userAddress);
```

---

## 🛡️ Security Features

### 1. **Immutability**
- Once data is on blockchain, it cannot be altered
- All modifications create new history entries
- Original data remains accessible

### 2. **Access Control**
- Smart contracts use `onlyAdmin` modifier
- Only admin wallet can execute sensitive functions
- Users have read-only access to their data

### 3. **Transparency**
- All transactions are public on blockchain
- Vote counts are verifiable by anyone
- History trail shows who did what and when

### 4. **Privacy**
- User data encrypted before storage
- Votes are anonymous (only wallet address stored)
- DID used for verification without revealing identity

---

## 📈 Benefits

### For Users
✅ **Trust** - Data cannot be manipulated
✅ **Transparency** - Can verify their vote was counted
✅ **Privacy** - Anonymous voting with verifiable identity
✅ **Ownership** - Control over their Soulbound Token

### For Admins
✅ **Audit Trail** - Complete history of all actions
✅ **Control** - Only admin can modify critical data
✅ **Verification** - Can prove election integrity
✅ **Compliance** - Meets regulatory requirements

### For the Platform
✅ **Trust** - Blockchain-verified governance
✅ **Scalability** - MongoDB caching for performance
✅ **Security** - Admin-only modifications
✅ **Innovation** - Cutting-edge Web3 integration

---

## 🔧 Environment Setup

Add these to your `.env` file:

```env
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=80001
ADMIN_PRIVATE_KEY=your_admin_wallet_private_key

# Smart Contract Addresses (after deployment)
USER_REGISTRY_CONTRACT_ADDRESS=0x...
VOTING_CONTRACT_ADDRESS=0x...
SBT_CONTRACT_ADDRESS=0x...
```

---

## 📝 Smart Contract Deployment

### Step 1: Compile Contracts

```bash
cd server
npx hardhat compile
```

### Step 2: Deploy to Testnet

```bash
# Deploy UserRegistry
npx hardhat run scripts/deploy-user-registry.js --network mumbai

# Deploy VotingEnhanced
npx hardhat run scripts/deploy-voting.js --network mumbai

# Deploy SoulboundToken
npx hardhat run scripts/deploy-sbt.js --network mumbai
```

### Step 3: Update .env

Copy deployed contract addresses to `.env` file.

---

## 🎯 Result

Your Agora platform now has:
- ✅ **Immutable user data** stored on blockchain
- ✅ **Admin-only modifications** enforced by smart contracts
- ✅ **Tamper-proof voting** with blockchain verification
- ✅ **Complete audit trail** of all actions
- ✅ **Decentralized identity** via Soulbound Tokens

**Your data is now on the blockchain - permanent, transparent, and trustworthy! 🎉**
