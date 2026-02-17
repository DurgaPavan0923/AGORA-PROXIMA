# 🔐 Blockchain Keys & Production Deployment Guide

## 📋 Overview

This guide will help you configure blockchain keys for deploying AGORA to production networks (testnet/mainnet).

---

## 🔑 Required Blockchain Keys

### 1. **Admin Private Key** (Most Important)
- **Purpose**: Deploy smart contracts and manage the platform
- **Used For**:
  - Deploying SBT and Voting contracts
  - Issuing Soulbound Tokens to users
  - Creating and managing elections
  - Admin operations on blockchain

### 2. **RPC Provider URL**
- **Purpose**: Connect to the blockchain network
- **Providers**: Infura, Alchemy, QuickNode, or self-hosted node

### 3. **Contract Addresses** (After Deployment)
- **SBT_CONTRACT_ADDRESS**: Soulbound Token contract
- **VOTING_CONTRACT_ADDRESS**: Voting contract

---

## 🚀 Deployment Options

### Option 1: Test on Ethereum Sepolia Testnet (Recommended for Testing)

**Why Sepolia?**
- ✅ Free to use (just need testnet ETH)
- ✅ Mimics Ethereum mainnet
- ✅ Perfect for testing before mainnet
- ✅ No real money needed

**Step-by-Step Setup:**

#### Step 1: Get Testnet ETH (Free)

1. **Create a new wallet** (NEVER use your mainnet wallet):
   ```bash
   # Using Hardhat console
   cd blockchain
   npx hardhat console --network sepolia
   ```
   
   Or create using MetaMask:
   - Open MetaMask → Create new account
   - Switch network to "Sepolia testnet"
   - Copy your address

2. **Get free Sepolia ETH** from faucets:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - https://faucet.quicknode.com/ethereum/sepolia
   
   You'll need about **0.1 SepoliaETH** for deployment.

#### Step 2: Get Infura/Alchemy API Key

**Option A: Infura (Easy)**

1. Go to https://infura.io/
2. Sign up for free account
3. Create new project → Select "Ethereum"
4. Copy your API Key
5. Your RPC URL: `https://sepolia.infura.io/v3/YOUR_API_KEY`

**Option B: Alchemy (More Features)**

1. Go to https://www.alchemy.com/
2. Sign up for free account
3. Create new app → Select "Ethereum" → "Sepolia"
4. Copy HTTPS URL (it includes the API key)
5. Your RPC URL: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

#### Step 3: Export Private Key from MetaMask

**⚠️ SECURITY WARNING: Never share this key or commit it to Git!**

1. Open MetaMask
2. Click three dots → Account details
3. Click "Export Private Key"
4. Enter password
5. Copy the private key (starts with 0x)

#### Step 4: Update `.env` File

```env
# Blockchain Configuration - Sepolia Testnet
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CHAIN_ID=11155111

# Admin private key (the wallet you just created)
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Contract addresses (will be set after deployment)
SBT_CONTRACT_ADDRESS=
VOTING_CONTRACT_ADDRESS=
PROPOSAL_CONTRACT_ADDRESS=
```

#### Step 5: Update `hardhat.config.js`

Add Sepolia network configuration:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../server/.env" });

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 0
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      ]
    },
    sepolia: {
      url: process.env.BLOCKCHAIN_RPC_URL,
      chainId: 11155111,
      accounts: [process.env.ADMIN_PRIVATE_KEY],
      gasPrice: "auto"
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
```

#### Step 6: Deploy to Sepolia

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**
```
🚀 Starting contract deployment...

📝 Deploying contracts with account: 0xYourAddress
💰 Account balance: 0.05 ETH

📜 Deploying SBT Contract...
✅ SBT deployed to: 0x1234567890abcdef...

📜 Deploying Voting Contract...
✅ Voting Contract deployed to: 0xabcdef1234567890...

✨ DEPLOYMENT SUCCESSFUL ✨
```

#### Step 7: Verify Deployment

Check your contracts on Sepolia Etherscan:
- Go to https://sepolia.etherscan.io/
- Enter your contract address
- View transactions and contract code

---

### Option 2: Polygon Mumbai Testnet (Cheaper Gas)

**Why Polygon Mumbai?**
- ✅ Much lower gas fees
- ✅ Faster transactions
- ✅ Free testnet MATIC
- ✅ Good for high-volume testing

**Setup:**

#### Get Mumbai MATIC (Free)
- https://mumbaifaucet.com/
- https://faucet.polygon.technology/

#### Update `.env`:
```env
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=80001
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

#### Update `hardhat.config.js`:
```javascript
mumbai: {
  url: process.env.BLOCKCHAIN_RPC_URL,
  chainId: 80001,
  accounts: [process.env.ADMIN_PRIVATE_KEY],
  gasPrice: "auto"
}
```

#### Deploy:
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

---

### Option 3: Ethereum Mainnet (Production - Real Money)

**⚠️ USE ONLY FOR PRODUCTION! Real ETH required!**

**Costs:**
- Contract deployment: ~0.05-0.1 ETH ($100-$200)
- Transaction fees: Variable (gas prices)
- Each user operation: ~$1-$5 depending on gas

**Setup:**

#### Prerequisites:
1. **Buy ETH** from exchange (Coinbase, Binance, etc.)
2. Transfer to your deployment wallet
3. **SECURE YOUR PRIVATE KEY** - Use hardware wallet if possible

#### Update `.env`:
```env
BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
CHAIN_ID=1
ADMIN_PRIVATE_KEY=0xYOUR_MAINNET_PRIVATE_KEY
```

#### Update `hardhat.config.js`:
```javascript
mainnet: {
  url: process.env.BLOCKCHAIN_RPC_URL,
  chainId: 1,
  accounts: [process.env.ADMIN_PRIVATE_KEY],
  gasPrice: "auto"
}
```

#### Deploy:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

---

### Option 4: Polygon Mainnet (Lower Cost Production)

**Why Polygon Mainnet?**
- ✅ 100x cheaper than Ethereum
- ✅ Faster transactions (2-3 seconds)
- ✅ Same security model
- ✅ Great for production

**Costs:**
- Contract deployment: ~$1-$5
- Transaction fees: $0.001-$0.01
- Perfect for voting platform!

**Setup:**

#### Get MATIC:
1. Buy on exchange (Coinbase, Binance)
2. Transfer to Polygon network
3. Or bridge from Ethereum: https://wallet.polygon.technology/

#### Update `.env`:
```env
BLOCKCHAIN_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=137
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

#### Update `hardhat.config.js`:
```javascript
polygon: {
  url: process.env.BLOCKCHAIN_RPC_URL,
  chainId: 137,
  accounts: [process.env.ADMIN_PRIVATE_KEY],
  gasPrice: "auto"
}
```

#### Deploy:
```bash
npx hardhat run scripts/deploy.js --network polygon
```

---

## 📝 Complete Hardhat Config with All Networks

Replace your `blockchain/hardhat.config.js` with:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../server/.env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Local development
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 0
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      ]
    },
    
    // Ethereum Sepolia Testnet
    sepolia: {
      url: process.env.BLOCKCHAIN_RPC_URL || "https://sepolia.infura.io/v3/YOUR_KEY",
      chainId: 11155111,
      accounts: process.env.ADMIN_PRIVATE_KEY ? [process.env.ADMIN_PRIVATE_KEY] : [],
      gasPrice: "auto"
    },
    
    // Polygon Mumbai Testnet
    mumbai: {
      url: process.env.BLOCKCHAIN_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: process.env.ADMIN_PRIVATE_KEY ? [process.env.ADMIN_PRIVATE_KEY] : [],
      gasPrice: "auto"
    },
    
    // Ethereum Mainnet (Production)
    mainnet: {
      url: process.env.BLOCKCHAIN_RPC_URL || "https://mainnet.infura.io/v3/YOUR_KEY",
      chainId: 1,
      accounts: process.env.ADMIN_PRIVATE_KEY ? [process.env.ADMIN_PRIVATE_KEY] : [],
      gasPrice: "auto"
    },
    
    // Polygon Mainnet (Production - Recommended)
    polygon: {
      url: process.env.BLOCKCHAIN_RPC_URL || "https://polygon-rpc.com",
      chainId: 137,
      accounts: process.env.ADMIN_PRIVATE_KEY ? [process.env.ADMIN_PRIVATE_KEY] : [],
      gasPrice: "auto"
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    // For contract verification
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || ""
    }
  }
};
```

---

## 🔒 Security Best Practices

### Private Key Management

**✅ DO:**
- Keep private key in `.env` file only
- Ensure `.env` is in `.gitignore`
- Use different keys for testing and production
- Consider hardware wallet for mainnet
- Backup private key securely (encrypted USB, password manager)
- Use environment variables in production servers

**❌ DON'T:**
- Commit private keys to Git
- Share private keys
- Use same key for multiple purposes
- Store in plain text files
- Keep large amounts in deployment wallet

### Key Generation (Secure Method)

```bash
# Generate new secure private key
cd blockchain
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use MetaMask to generate and export key.

### Wallet Management

**Development Wallet:**
- Use for local testing only
- Can use Hardhat default account

**Testnet Wallet:**
- Create dedicated wallet for testnet
- Get free testnet ETH/MATIC
- Safe to experiment

**Production Wallet:**
- Create NEW wallet specifically for deployment
- Keep minimal funds (just enough for deployment)
- Consider multi-sig wallet for team projects
- Enable 2FA on all services

---

## 📊 Cost Comparison

| Network | Deployment Cost | Per Transaction | Speed | Best For |
|---------|----------------|-----------------|-------|----------|
| **Local Hardhat** | Free | Free | Instant | Development |
| **Sepolia** | Free (testnet) | Free | ~15 sec | Testing |
| **Mumbai** | Free (testnet) | Free | ~3 sec | Testing |
| **Ethereum Mainnet** | $100-$200 | $1-$5 | ~15 sec | High-value apps |
| **Polygon Mainnet** | $1-$5 | $0.001-$0.01 | ~2 sec | **Recommended** |

**Recommendation:** Start with **Sepolia** for testing, then deploy to **Polygon Mainnet** for production.

---

## 🧪 Testing Deployment

After deployment, test your contracts:

```bash
# Check contract on blockchain explorer
# Sepolia: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
# Polygon: https://polygonscan.com/address/YOUR_CONTRACT_ADDRESS

# Test backend connection
cd server
npm run dev

# The backend should log:
# ✅ Connected to blockchain
# ✅ SBT Contract initialized
# ✅ Voting Contract initialized
```

---

## 🔧 Troubleshooting

### "Insufficient funds"
- Get more testnet ETH/MATIC from faucets
- For mainnet, buy and transfer crypto

### "Invalid private key"
- Ensure it starts with `0x`
- Check for typos or extra spaces
- Generate new key if needed

### "Network not found"
- Verify RPC URL is correct
- Check API key is valid
- Try alternative RPC provider

### "Gas estimation failed"
- Increase gas limit in config
- Check contract code for errors
- Ensure sufficient balance

### Deployment takes too long
- Check network congestion
- Consider using faster network (Polygon)
- Increase gas price

---

## ✅ Deployment Checklist

**Before Deploying:**
- [ ] Private key generated and secured
- [ ] `.env` file updated with correct values
- [ ] `.env` is in `.gitignore`
- [ ] RPC provider account created (Infura/Alchemy)
- [ ] Sufficient funds in deployment wallet
- [ ] Hardhat config updated with network
- [ ] Contracts compile without errors: `npx hardhat compile`

**After Deploying:**
- [ ] Contract addresses saved
- [ ] `.env` updated with contract addresses
- [ ] Backend server restarted
- [ ] Contracts verified on block explorer
- [ ] Test transactions successful
- [ ] User registration works
- [ ] Voting works
- [ ] Document deployment details

---

## 📞 Quick Reference

### Essential Commands

```bash
# Compile contracts
cd blockchain
npx hardhat compile

# Deploy to localhost
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon

# Check account balance
npx hardhat console --network sepolia
> (await ethers.provider.getBalance("YOUR_ADDRESS")).toString()
```

### Free Resources

**Testnet Faucets:**
- Sepolia ETH: https://sepoliafaucet.com/
- Mumbai MATIC: https://mumbaifaucet.com/

**RPC Providers:**
- Infura: https://infura.io/ (free tier)
- Alchemy: https://www.alchemy.com/ (free tier)
- QuickNode: https://www.quicknode.com/ (free trial)

**Block Explorers:**
- Sepolia: https://sepolia.etherscan.io/
- Mumbai: https://mumbai.polygonscan.com/
- Ethereum: https://etherscan.io/
- Polygon: https://polygonscan.com/

---

## 🎯 Recommended Deployment Path

**For Your AGORA Project:**

1. **Week 1**: Deploy to **Sepolia testnet**
   - Test all features thoroughly
   - Get feedback from users
   - Fix any issues

2. **Week 2**: Deploy to **Polygon Mumbai testnet**
   - Test on faster network
   - Verify performance
   - Stress test with multiple users

3. **Week 3**: Deploy to **Polygon Mainnet** (Production)
   - Much cheaper than Ethereum
   - Fast transactions
   - Production ready

**Total Cost: ~$5-$10 for production deployment on Polygon**

---

**Status:** ✅ Ready for Production Deployment
**Last Updated:** December 15, 2024

**You're all set to deploy AGORA to the blockchain! 🚀⛓️**
