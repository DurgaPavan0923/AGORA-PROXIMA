# Agora - Web3 Governance Platform

## Project Overview

**Agora** is a blockchain-powered digital governance platform that enables secure, transparent, and inclusive citizen participation in local government decisions through **Soulbound Tokens (SBTs)** and **DAO-based voting**.

## Core Technology Stack

### Backend
- **Node.js** + **Express.js** - REST API server
- **TypeScript** - Type-safe development
- **MongoDB** + **Mongoose** - Off-chain data storage
- **JWT** - Authentication tokens
- **bcrypt** - MPIN/password hashing

### Blockchain (Web3)
- **Ethereum/EVM Compatible** - Smart contract platform
- **ethers.js v6** - Web3 library for blockchain interaction
- **Hardhat** - Smart contract development & testing
- **Solidity 0.8.20** - Smart contract language

### Smart Contracts
1. **SoulboundToken.sol** - Non-transferable citizen identity tokens
2. **Voting.sol** - Transparent on-chain voting system

## Key Features (As Per Abstract)

### ✅ Soulbound Tokens (SBTs)
- Non-transferable digital identity for each verified citizen
- One citizen = One SBT = One Vote
- Prevents double voting and fake accounts
- Linked to Decentralized ID (DID)

### ✅ Decentralized ID (DID) System
- Generated from Aadhaar + Phone hash
- Format: `did:agora:xxxxx...`
- Privacy-preserving identity verification
- Permanent and verifiable

### ✅ On-Chain Voting
- All votes recorded on blockchain
- Immutable and tamper-proof
- Transparent and auditable
- Smart contract enforced rules

### ✅ DAO-Based Governance
- Community proposals
- Democratic voting (Yes/No/Abstain)
- Area-based participation
- Real-time results dashboard

### ✅ Security & Transparency
- Cryptographic hashing for data integrity
- Distributed blockchain prevents tampering
- Public verification of vote counts
- Privacy-preserving (anonymous votes)

## Project Structure

```
AGORA/
├── client/                          # Next.js Frontend (existing)
│   ├── app/
│   ├── components/
│   └── ...
│
└── server/                          # Node.js Backend (NEW)
    ├── src/
    │   ├── blockchain/              # Web3 Integration
    │   │   ├── web3Config.ts       # Blockchain connection
    │   │   ├── sbtService.ts       # SBT operations
    │   │   └── votingService.ts    # Voting operations
    │   │
    │   ├── controllers/            # API Controllers
    │   │   ├── authController.ts   # OTP + MPIN auth
    │   │   ├── adminController.ts  # User verification
    │   │   ├── electionController.ts
    │   │   ├── proposalController.ts
    │   │   └── userController.ts
    │   │
    │   ├── models/                 # MongoDB Models
    │   │   ├── User.ts             # + blockchain fields
    │   │   ├── PendingUser.ts
    │   │   ├── Election.ts
    │   │   ├── Vote.ts
    │   │   ├── Proposal.ts
    │   │   ├── ProposalVote.ts
    │   │   └── OTP.ts
    │   │
    │   ├── routes/                 # API Routes
    │   ├── middleware/             # Auth middleware
    │   ├── utils/                  # JWT, crypto utils
    │   ├── config/                 # Database config
    │   └── server.ts               # Main server
    │
    ├── contracts/                  # Smart Contracts
    │   ├── SoulboundToken.sol     # SBT implementation
    │   └── Voting.sol             # Voting contract
    │
    ├── scripts/                    # Deployment scripts
    │   └── deploy.js
    │
    ├── test/                       # Smart contract tests
    │
    ├── package.json
    ├── tsconfig.json
    ├── hardhat.config.js           # Hardhat configuration
    │
    ├── README.md                   # Full documentation
    ├── API_DOCS.md                 # API reference
    ├── BLOCKCHAIN_SETUP.md         # Blockchain setup guide
    ├── QUICK_START.md              # Quick start guide
    └── PROJECT_SUMMARY.md          # This file
```

## Architecture

### Hybrid Architecture (Off-chain + On-chain)

```
┌─────────────────────────────────────────┐
│          Frontend (Next.js)              │
│  - User Interface                        │
│  - MetaMask Integration (optional)       │
└──────────────┬───────────────────────────┘
               │ HTTP/REST API
               ▼
┌─────────────────────────────────────────┐
│       Backend (Node.js/Express)         │
│  ┌─────────────────────────────────┐   │
│  │   Off-Chain (MongoDB)           │   │
│  │  - User profiles & auth         │   │
│  │  - MPIN authentication          │   │
│  │  - Cached blockchain data       │   │
│  │  - Fast queries                 │   │
│  └─────────────────────────────────┘   │
│                 │                        │
│  ┌─────────────────────────────────┐   │
│  │   Blockchain Services           │   │
│  │  - SBT Service (mint, verify)   │   │
│  │  - Voting Service (vote, count) │   │
│  │  - DID Generation               │   │
│  └─────────────────────────────────┘   │
└──────────────┬───────────────────────────┘
               │ Web3/ethers.js
               ▼
┌─────────────────────────────────────────┐
│      Blockchain (Ethereum/Polygon)       │
│  ┌─────────────────────────────────┐   │
│  │   Smart Contracts               │   │
│  │  - SoulboundToken.sol           │   │
│  │  - Voting.sol                   │   │
│  │  - Immutable records            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Why Hybrid?

1. **Performance**: MongoDB for fast queries and user auth
2. **Cost**: Reduce blockchain transactions (gas fees)
3. **UX**: Instant feedback while blockchain confirms
4. **Scalability**: Handle thousands of users efficiently
5. **Flexibility**: Change off-chain logic without redeploying contracts

## User Flows

### 1. Registration & Verification

```
┌──────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐
│  Citizen │───▶│ Register │───▶│Admin Review│───▶│  Verify  │
└──────────┘    └──────────┘    └───────────┘    └──────────┘
                     │                                   │
                     ▼                                   ▼
              PendingUser (MongoDB)               Generate Wallet
                                                    Mint SBT ⛓️
                                                    Create User
```

**Steps:**
1. Citizen fills registration form (name, phone, Aadhaar, address)
2. Creates pending user in MongoDB
3. Admin reviews and verifies identity
4. Backend generates wallet address
5. Backend mints Soulbound Token with DID
6. User account activated

### 2. Login

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Enter   │───▶│ Request  │───▶│  Enter   │───▶│  Login   │
│  Phone   │    │   OTP    │    │OTP+MPIN  │    │ Success  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Security:**
- OTP sent to phone (5 min expiry)
- MPIN (6-digit PIN)
- JWT token issued (24h expiry)
- Session tracked in cookies

### 3. Voting in Election

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Select  │───▶│  Verify  │───▶│  Record  │───▶│  Confirm │
│  Party   │    │   SBT    │    │ On-Chain │    │   Vote   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │                 │               │
                     ▼                 ▼               ▼
                Check wallet      Blockchain tx   MongoDB update
                Has SBT?          Immutable ⛓️    Fast queries
                Not voted yet?
```

**Process:**
1. User selects party from election
2. Backend verifies user has SBT
3. Smart contract checks if already voted
4. Vote recorded on blockchain (permanent)
5. MongoDB updated for dashboard
6. User sees confirmation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/request-otp` - Get OTP for login
- `POST /api/auth/verify-otp-mpin` - Login with OTP+MPIN
- `GET /api/auth/verify` - Check authentication

### Admin
- `GET /api/admin/pending-users` - List pending registrations
- `POST /api/admin/verify-user` - Verify user + mint SBT
- `POST /api/admin/reject-user` - Reject registration
- `GET /api/admin/stats` - Platform statistics

### Elections
- `GET /api/elections` - List all elections
- `GET /api/elections/:id` - Get election details
- `POST /api/elections` - Create election (EC/Admin)
- `POST /api/elections/:id/vote` - Cast vote
- `GET /api/elections/:id/check-voted` - Check if voted

### Proposals
- `GET /api/proposals` - List proposals
- `POST /api/proposals` - Create proposal
- `POST /api/proposals/:id/vote` - Vote (yes/no/abstain)

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-mpin` - Change MPIN
- `GET /api/user/stats` - User statistics
- `GET /api/user/voting-history` - Voting history

## Smart Contract Functions

### SoulboundToken.sol

```solidity
// Mint SBT (Admin only)
function mintSBT(address to, string memory did) returns (uint256)

// Check if address has SBT
function hasSBT(address owner) returns (bool)

// Get DID for address
function getDID(address owner) returns (string memory)

// Burn SBT (fraud cases)
function burnSBT(uint256 tokenId)

// Transfer blocked (Soulbound!)
function transfer() reverts
```

### Voting.sol

```solidity
// Create election (Admin only)
function createElection(
  string memory title,
  uint256 startTime,
  uint256 endTime,
  string[] memory partyNames
) returns (uint256)

// Cast vote
function vote(
  uint256 electionId,
  uint256 partyIndex,
  address voterAddress
)

// Check if voted
function hasVotedInElection(
  uint256 electionId,
  address voter
) returns (bool)

// Get results
function getElectionResults(
  uint256 electionId
) returns (uint256[] memory)
```

## Setup Instructions

### Quick Start (5 minutes)

```bash
# 1. Install dependencies
cd server
npm install

# 2. Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# 3. Start local blockchain
npx hardhat node

# 4. Deploy contracts (new terminal)
npx hardhat run scripts/deploy.js --network localhost

# 5. Configure environment
cp .env.example .env
# Add contract addresses from deployment

# 6. Start backend
npm run dev
```

### Full Setup

See detailed guides:
- **BLOCKCHAIN_SETUP.md** - Complete blockchain setup
- **QUICK_START.md** - 5-minute setup
- **README.md** - Full documentation

## Deployment Options

### Development
- **Hardhat Local Node** - For testing
- **MongoDB Local** - Development database

### Testnet (Recommended for Demo)
- **Polygon Mumbai** - Free testnet with faucet
- **Arbitrum Goerli** - Fast L2 testnet
- **MongoDB Atlas** - Free cloud database

### Production
- **Polygon Mainnet** - Low cost L2
- **Private Blockchain** - For government use
- **MongoDB Atlas** - Production database
- **AWS/Azure** - Backend hosting

## Security Features

### Authentication
- ✅ OTP verification (SMS)
- ✅ 6-digit MPIN
- ✅ JWT tokens with expiration
- ✅ bcrypt password hashing
- ✅ Rate limiting (100 req/15min)

### Blockchain
- ✅ Soulbound Tokens (non-transferable)
- ✅ One vote per user enforcement
- ✅ Immutable vote records
- ✅ Smart contract access control
- ✅ Event logging for audit trail

### API
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Role-based access control
- ✅ Private key encryption

## Testing

### Backend Tests
```bash
npm run lint
npm test
```

### Smart Contract Tests
```bash
npx hardhat test
npx hardhat coverage
```

### Integration Tests
```bash
# Test blockchain connection
curl http://localhost:5000/health

# Test API
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9999999999"}'
```

## Monitoring

- **Backend Logs**: `npm run dev` shows all activity
- **Blockchain Events**: Listen to SBTMinted, VoteCast events
- **MongoDB**: Use MongoDB Compass for data inspection
- **Hardhat Console**: Test smart contracts interactively

## Future Enhancements

1. **Zero-Knowledge Proofs** - Enhanced vote privacy
2. **IPFS Integration** - Decentralized file storage
3. **Multi-signature Admin** - Distributed control
4. **L2 Optimizations** - Reduced gas costs
5. **Mobile App** - React Native or Flutter
6. **Biometric Auth** - Fingerprint/Face ID
7. **AI Moderation** - Content filtering
8. **Analytics Dashboard** - Voting insights

## Documentation

- ✅ **README.md** - Complete setup and usage guide
- ✅ **API_DOCS.md** - Full API reference with examples
- ✅ **BLOCKCHAIN_SETUP.md** - Blockchain setup guide
- ✅ **QUICK_START.md** - 5-minute quickstart
- ✅ **PROJECT_SUMMARY.md** - This file

## Support & Resources

### Documentation
- Ethers.js: https://docs.ethers.org/
- Hardhat: https://hardhat.org/docs
- Solidity: https://docs.soliditylang.org/

### Communities
- Ethereum Stack Exchange
- Hardhat Discord
- OpenZeppelin Forum

---

## Status: ✅ READY FOR HACKATHON

**What's Complete:**
- ✅ Full backend with TypeScript
- ✅ MongoDB models with blockchain fields
- ✅ Smart contracts (SBT + Voting)
- ✅ Web3 integration with ethers.js
- ✅ Authentication system (OTP + MPIN)
- ✅ Admin verification workflow
- ✅ API endpoints (all routes)
- ✅ Comprehensive documentation

**Next Steps:**
1. Run `npm install` in server directory
2. Follow BLOCKCHAIN_SETUP.md
3. Deploy smart contracts
4. Connect frontend to backend API
5. Test complete user flow
6. Deploy to testnet for demo

**For Hackathon Demo:**
Use Polygon Mumbai testnet - it's free, fast, and provides a blockchain explorer for transparency demonstration!

Good luck with the hackathon! 🚀
