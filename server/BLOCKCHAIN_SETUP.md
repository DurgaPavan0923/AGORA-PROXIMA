# Blockchain Integration Setup Guide

Complete guide to setting up the Web3/Blockchain features for Agora.

## Overview

Agora uses **Soulbound Tokens (SBTs)** and **Smart Contracts** for:
- ✅ Non-transferable citizen identity (SBTs)
- ✅ Decentralized ID (DID) system
- ✅ Transparent, tamper-proof on-chain voting
- ✅ Immutable vote records
- ✅ Privacy-preserving verification

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Agora Backend                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  MongoDB Database (Off-chain data)              │   │
│  │  - User profiles                                 │   │
│  │  - MPIN authentication                          │   │
│  │  - Cached blockchain references                 │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                               │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Blockchain Services (ethers.js)                │   │
│  │  - SBT Service                                   │   │
│  │  - Voting Service                                │   │
│  │  - Web3 Configuration                            │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│            Blockchain Network (Ethereum/L2)              │
│  ┌──────────────────┐  ┌───────────────────────────┐   │
│  │ SoulboundToken   │  │      Voting Contract      │   │
│  │  Smart Contract  │  │    Smart Contract         │   │
│  │                  │  │                           │   │
│  │ - Mint SBT       │  │ - Create Elections        │   │
│  │ - Burn SBT       │  │ - Cast Votes              │   │
│  │ - Verify DID     │  │ - Get Results             │   │
│  └──────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Node.js** v18+
2. **Hardhat** (for local blockchain development)
3. **MetaMask** or similar wallet (optional, for testing)

## Quick Start

### Step 1: Install Hardhat and Dependencies

```bash
cd server

# Install ethers.js (already in package.json)
npm install

# Install Hardhat globally
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### Step 2: Initialize Hardhat

```bash
npx hardhat init
# Select "Create an empty hardhat.config.js"
```

### Step 3: Configure Hardhat

Create `hardhat.config.js` in the server directory:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
```

### Step 4: Start Local Blockchain

```bash
# Terminal 1 - Run Hardhat node (keep this running)
npx hardhat node
```

This will start a local Ethereum blockchain and display 20 test accounts with private keys.

### Step 5: Deploy Smart Contracts

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy SoulboundToken
  const SoulboundToken = await hre.ethers.getContractFactory("SoulboundToken");
  const sbt = await SoulboundToken.deploy();
  await sbt.waitForDeployment();
  const sbtAddress = await sbt.getAddress();
  console.log("✅ SoulboundToken deployed to:", sbtAddress);

  // Deploy Voting contract
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(sbtAddress);
  await voting.waitForDeployment();
  const votingAddress = await voting.getAddress();
  console.log("✅ Voting deployed to:", votingAddress);

  console.log("\n📋 Update your .env file with:");
  console.log(`SBT_CONTRACT_ADDRESS=${sbtAddress}`);
  console.log(`VOTING_CONTRACT_ADDRESS=${votingAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Deploy contracts:

```bash
# Terminal 2 - Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### Step 6: Update Environment Variables

Copy the contract addresses from the deployment output and update your `.env`:

```env
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CHAIN_ID=31337
ADMIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
SBT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VOTING_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### Step 7: Start Backend Server

```bash
npm run dev
```

The server will connect to the blockchain and initialize smart contracts.

## How It Works

### 1. User Registration & Verification

```
User Registers → Admin Verifies → Generate Wallet → Mint SBT
```

**Flow:**
1. User registers (creates pending user in MongoDB)
2. Admin verifies identity via `/api/admin/verify-user`
3. Backend generates a wallet address for the user
4. Backend mints a Soulbound Token (SBT) with user's DID
5. SBT is non-transferable and permanently linked to the user

**Code Example:**
```typescript
// When admin verifies a user
const wallet = generateWallet(); // ethers.js
const sbtResult = await sbtService.mintSBT(
  wallet.address,
  user.aadhaar,
  user.phone
);
// Save wallet.address and sbtResult.did to MongoDB
```

### 2. Election Creation

```
Admin Creates Election → Smart Contract Stores → Immutable Record
```

**Flow:**
1. Election Commission creates election via `/api/elections`
2. Backend creates election in MongoDB (off-chain)
3. Backend also creates election on blockchain (on-chain)
4. Blockchain returns election ID
5. Both IDs are stored for reference

### 3. Voting Process

```
User Votes → Verify SBT → Record On-Chain → Update Off-Chain
```

**Flow:**
1. User casts vote via `/api/elections/:id/vote`
2. Backend verifies user has SBT
3. Backend checks user hasn't voted (on-chain check)
4. Vote is recorded on blockchain (immutable)
5. MongoDB is updated for quick queries
6. Vote is permanently stored on-chain

**Privacy:**
- Vote choice is encrypted/hashed
- Only proof of participation is public
- Individual votes are anonymous

## Production Deployment

### Option 1: Ethereum Mainnet (Expensive)

Not recommended for MVP due to high gas costs.

### Option 2: Layer 2 Solutions (Recommended)

Choose a scalable L2:

**Polygon (Mumbai Testnet / Mainnet)**
```env
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=80001
```

**Arbitrum**
```env
BLOCKCHAIN_RPC_URL=https://arb-goerli.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=421613
```

**Optimism**
```env
BLOCKCHAIN_RPC_URL=https://opt-goerli.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=420
```

### Option 3: Private/Consortium Blockchain

For government use, consider:
- **Hyperledger Besu** (Ethereum-compatible)
- **Quorum** (by ConsenSys)
- **Polygon Supernets** (private Polygon network)

## Testing Smart Contracts

### Unit Tests

Create `test/SoulboundToken.test.js`:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SoulboundToken", function () {
  let sbt, owner, user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    const SBT = await ethers.getContractFactory("SoulboundToken");
    sbt = await SBT.deploy();
    await sbt.waitForDeployment();
  });

  it("Should mint SBT to a user", async function () {
    const did = "did:agora:abc123";
    await sbt.mintSBT(user1.address, did);
    expect(await sbt.hasSBT(user1.address)).to.equal(true);
  });

  it("Should prevent transferring SBT", async function () {
    await expect(sbt.transfer(user1.address, 1)).to.be.revertedWith(
      "Soulbound tokens cannot be transferred"
    );
  });
});
```

Run tests:
```bash
npx hardhat test
```

## Monitoring & Verification

### Check Blockchain Connection

Visit `http://localhost:5000/health` - should show blockchain connection status.

### Verify Transactions

Use Hardhat console:

```bash
npx hardhat console --network localhost

> const SBT = await ethers.getContractFactory("SoulboundToken");
> const sbt = SBT.attach("YOUR_SBT_CONTRACT_ADDRESS");
> await sbt.hasSBT("USER_WALLET_ADDRESS");
```

### View Blockchain Explorer

For testnet/mainnet, use:
- **Etherscan** (Ethereum)
- **PolygonScan** (Polygon)
- **Arbiscan** (Arbitrum)

## Security Considerations

1. **Private Keys**: Never commit private keys to git
2. **Admin Wallet**: Use hardware wallet for production
3. **Contract Upgrades**: Deploy new versions, don't try to upgrade
4. **Gas Limits**: Set appropriate gas limits for transactions
5. **Rate Limiting**: Implement rate limiting on blockchain calls
6. **Backup**: Always backup wallet mnemonics securely

## Troubleshooting

### "Contract not initialized"

**Solution**: Ensure contract addresses are set in `.env` and Hardhat node is running.

### "Insufficient funds"

**Solution**: Use Hardhat's default accounts which have ETH, or fund your wallet.

### "Nonce too high"

**Solution**: Reset Hardhat node or use `--reset` flag.

### Connection refused

**Solution**: Ensure Hardhat node is running on `http://127.0.0.1:8545`.

## Gas Optimization

Tips to reduce gas costs:

1. Batch operations when possible
2. Use `calldata` instead of `memory` for function parameters
3. Pack struct variables efficiently
4. Use events for storing data that doesn't need to be queryable

## Further Reading

- [Soulbound Tokens](https://vitalik.ca/general/2022/01/26/soulbound.html)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## Support

For blockchain-specific issues, check:
1. Hardhat console logs
2. Backend logs (`npm run dev`)
3. Blockchain explorer transactions
4. Smart contract events

---

**Status**: ✅ Blockchain integration ready for development
**Next Steps**: Deploy to testnet for public demo
