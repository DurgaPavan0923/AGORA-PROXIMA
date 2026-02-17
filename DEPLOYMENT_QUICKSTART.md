# 🚀 Quick Deployment Guide - AGORA Blockchain Keys

## ⚡ Fast Track: Deploy in 30 Minutes

### Step 1: Choose Your Network (5 mins)

**For Testing (FREE):**
- ✅ **Sepolia Testnet** - Best for initial testing
- ✅ **Mumbai Testnet** - Faster, lower fees

**For Production:**
- 🔥 **Polygon Mainnet** - RECOMMENDED ($5-$10 total)
- 💰 **Ethereum Mainnet** - Expensive ($100-$200)

---

### Step 2: Get RPC Provider Key (5 mins)

#### Option A: Infura (Recommended)
1. Go to https://infura.io/
2. Sign up (free)
3. Create Project → Select "Ethereum" or "Polygon"
4. Copy your API Key
5. Your URL: `https://sepolia.infura.io/v3/YOUR_API_KEY`

#### Option B: Alchemy
1. Go to https://www.alchemy.com/
2. Sign up (free)
3. Create App → Select network
4. Copy HTTPS URL
5. Your URL: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

---

### Step 3: Create Deployment Wallet (5 mins)

**Using MetaMask:**
1. Install MetaMask browser extension
2. Create new account (or use existing)
3. Export private key:
   - Click 3 dots → Account details
   - "Export Private Key"
   - Enter password
   - **COPY THE KEY** (starts with 0x)

⚠️ **NEVER share or commit this key!**

---

### Step 4: Get Test Funds (5 mins - Only for Testnet)

**For Sepolia:**
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- Need: ~0.1 SepoliaETH

**For Mumbai:**
- https://mumbaifaucet.com/
- https://faucet.polygon.technology/
- Need: ~0.5 MATIC

**For Production (Mainnet):**
- Buy ETH/MATIC from Coinbase, Binance, etc.
- Transfer to your wallet

---

### Step 5: Update Environment Variables (2 mins)

Edit `server/.env`:

**For Sepolia Testnet:**
```env
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CHAIN_ID=11155111
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_FROM_METAMASK

# Contract addresses (leave empty, will be auto-filled)
SBT_CONTRACT_ADDRESS=
VOTING_CONTRACT_ADDRESS=
```

**For Polygon Mumbai:**
```env
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=80001
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

**For Polygon Mainnet (Production):**
```env
BLOCKCHAIN_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=137
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

---

### Step 6: Deploy Contracts (5 mins)

```powershell
# Compile contracts first
cd blockchain
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# OR deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# OR deploy to Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon
```

**Expected Output:**
```
🚀 Starting contract deployment...

📝 Deploying contracts with account: 0xYourAddress
💰 Account balance: 0.05 ETH

📜 Deploying SBT Contract...
✅ SBT deployed to: 0x1234...

📜 Deploying Voting Contract...
✅ Voting Contract deployed to: 0xabcd...

✨ DEPLOYMENT SUCCESSFUL ✨
📝 Updated server/.env with contract addresses
```

---

### Step 7: Restart Backend (2 mins)

```powershell
cd ../server
npm run dev
```

**Check for:**
```
✅ Connected to blockchain
✅ SBT Contract initialized
✅ Voting Contract initialized
```

---

### Step 8: Test Deployment (3 mins)

**Verify on Block Explorer:**

**Sepolia:** https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
**Mumbai:** https://mumbai.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
**Polygon:** https://polygonscan.com/address/YOUR_CONTRACT_ADDRESS

---

## 🔑 Keys You Need Summary

| Key | Where to Get | Purpose |
|-----|-------------|---------|
| **RPC URL** | Infura/Alchemy | Connect to blockchain |
| **Private Key** | MetaMask | Deploy & manage contracts |
| **Testnet Funds** | Faucets (free) | Deploy on testnet |
| **Mainnet Funds** | Buy from exchange | Deploy on mainnet |

---

## 💰 Cost Breakdown

| Network | Setup Cost | Per Transaction | Time |
|---------|-----------|-----------------|------|
| **Sepolia** | FREE | FREE | ~15 sec |
| **Mumbai** | FREE | FREE | ~3 sec |
| **Polygon Mainnet** | $5-10 | $0.001-0.01 | ~2 sec |
| **Ethereum Mainnet** | $100-200 | $1-5 | ~15 sec |

**Recommendation:** Test on Sepolia, then deploy to **Polygon Mainnet** for production.

---

## 🆘 Quick Troubleshooting

### "Insufficient funds"
→ Get more testnet tokens from faucets

### "Invalid private key"
→ Check it starts with `0x` and has no spaces

### "Network not found"
→ Verify RPC URL in `.env` is correct

### "Cannot connect to blockchain"
→ Check BLOCKCHAIN_RPC_URL and CHAIN_ID match

### Contracts not deploying
→ Run `npx hardhat compile` first

---

## 📋 Pre-Deployment Checklist

Before running deployment:
- [ ] RPC provider account created (Infura/Alchemy)
- [ ] API key copied
- [ ] MetaMask wallet created
- [ ] Private key exported and saved securely
- [ ] Testnet funds received (for testnet)
- [ ] `.env` file updated with all keys
- [ ] `.env` is in `.gitignore`
- [ ] Contracts compile: `npx hardhat compile`

---

## 🔒 Security Reminders

**DO:**
✅ Keep `.env` file secure
✅ Add `.env` to `.gitignore`
✅ Use different keys for test/prod
✅ Backup private key securely

**DON'T:**
❌ Commit keys to Git
❌ Share private key with anyone
❌ Use production key for testing
❌ Store large amounts in deployment wallet

---

## 🎯 Recommended Path for AGORA

### Week 1: Testing Phase
```powershell
# Deploy to Sepolia
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia
```
- Test all features
- Get user feedback
- Fix bugs

### Week 2: Pre-Production
```powershell
# Deploy to Mumbai
npx hardhat run scripts/deploy.js --network mumbai
```
- Performance testing
- Load testing
- Final checks

### Week 3: Go Live! 🚀
```powershell
# Deploy to Polygon Mainnet
npx hardhat run scripts/deploy.js --network polygon
```
- Production deployment
- Monitor transactions
- Celebrate! 🎉

---

## 📞 Resources

**Faucets:**
- Sepolia: https://sepoliafaucet.com/
- Mumbai: https://mumbaifaucet.com/

**RPC Providers:**
- Infura: https://infura.io/
- Alchemy: https://www.alchemy.com/

**Block Explorers:**
- Sepolia: https://sepolia.etherscan.io/
- Mumbai: https://mumbai.polygonscan.com/
- Polygon: https://polygonscan.com/

**Need Help?**
- Check `BLOCKCHAIN_DEPLOYMENT_GUIDE.md` for detailed info
- Check `COMPLETE_SETUP_GUIDE.md` for full setup

---

## ✅ What You've Set Up

After completing these steps, you'll have:

✅ Blockchain connection configured
✅ Admin wallet for contract management
✅ SBT and Voting contracts deployed
✅ Backend connected to blockchain
✅ Ready to issue SBTs to users
✅ Ready to create elections
✅ Ready for production voting!

---

**Status:** 🚀 Ready to Deploy
**Time Required:** 30 minutes
**Cost:** FREE (testnet) or $5-10 (Polygon mainnet)

**Let's deploy AGORA to the blockchain! ⛓️🗳️**
