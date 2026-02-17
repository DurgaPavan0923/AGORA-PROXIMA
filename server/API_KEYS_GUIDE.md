# Required API Keys & Services Guide

Complete guide to obtain all necessary API keys and services for Agora.

---

## 🗂️ Quick Overview

| Service | Purpose | Cost | Priority | Setup Time |
|---------|---------|------|----------|------------|
| MongoDB Atlas | Database | FREE | **REQUIRED** | 5 min |
| Alchemy/Infura | Blockchain RPC | FREE | **REQUIRED** | 3 min |
| Twilio | SMS/OTP | FREE Trial | Optional | 10 min |
| Polygon Mumbai | Testnet Faucet | FREE | Recommended | 2 min |

---

## 1️⃣ MongoDB Atlas (Database) ⭐ REQUIRED

### What it's for:
- User data storage (profiles, authentication)
- Caching blockchain data
- Fast queries for dashboard

### Setup Steps:

#### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Select **FREE M0 Cluster** (512MB)

#### Step 2: Create Cluster
1. Choose **AWS** as cloud provider
2. Select region closest to you (e.g., Mumbai for India)
3. Cluster name: `agora-cluster`
4. Click **Create**

#### Step 3: Configure Database Access
1. Go to **Database Access** tab
2. Click **Add New Database User**
3. Username: `agora_admin`
4. Password: Generate strong password (save it!)
5. User Privileges: **Read and write to any database**
6. Click **Add User**

#### Step 4: Configure Network Access
1. Go to **Network Access** tab
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere** (0.0.0.0/0)
   - For production, restrict to your server IP
4. Click **Confirm**

#### Step 5: Get Connection String
1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy connection string:
```
mongodb+srv://agora_admin:<password>@agora-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your actual password

### Add to .env:
```env
MONGODB_URI=mongodb+srv://agora_admin:YOUR_PASSWORD@agora-cluster.xxxxx.mongodb.net/agora?retryWrites=true&w=majority
```

---

## 2️⃣ Alchemy (Blockchain RPC) ⭐ REQUIRED

### What it's for:
- Connect to Ethereum/Polygon blockchain
- Deploy smart contracts
- Send transactions

### Setup Steps:

#### Step 1: Create Account
1. Go to: https://www.alchemy.com/
2. Click **Sign Up** (free)
3. Sign up with email or Google

#### Step 2: Create App
1. Click **Create App**
2. Fill in details:
   - **Name**: Agora Voting
   - **Chain**: Polygon
   - **Network**: Polygon Mumbai (Testnet)
3. Click **Create App**

#### Step 3: Get API Key
1. Click **View Key** on your app
2. Copy the following:
   - **API KEY**: e.g., `8xxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **HTTPS URL**: e.g., `https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY`

### Add to .env:
```env
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=80001
```

### Alternative: Infura
If you prefer Infura over Alchemy:
1. Go to: https://infura.io/
2. Sign up and create project
3. Select **Polygon Mumbai**
4. Copy endpoint URL

---

## 3️⃣ Get Test Matic (Testnet Tokens) ⭐ REQUIRED

### What it's for:
- Pay for gas fees on Polygon Mumbai testnet
- Deploy smart contracts
- Test transactions

### Setup Steps:

#### Step 1: Create Wallet
If you don't have a wallet yet:
1. Install MetaMask: https://metamask.io/
2. Create new wallet
3. **SAVE YOUR SEED PHRASE SECURELY**
4. Copy your wallet address (e.g., 0x1234...5678)

#### Step 2: Add Polygon Mumbai Network to MetaMask
1. Open MetaMask
2. Click network dropdown → **Add Network**
3. Fill in:
   - **Network Name**: Polygon Mumbai
   - **RPC URL**: `https://rpc-mumbai.maticvigil.com`
   - **Chain ID**: 80001
   - **Currency Symbol**: MATIC
   - **Block Explorer**: https://mumbai.polygonscan.com
4. Click **Save**

#### Step 3: Get Test MATIC from Faucet
1. Go to: https://faucet.polygon.technology/
2. Select **Mumbai**
3. Select **MATIC Token**
4. Paste your wallet address
5. Click **Submit**
6. Wait 1-2 minutes for tokens

Alternative Faucets:
- https://mumbaifaucet.com/
- https://faucet.quicknode.com/polygon/mumbai

#### Step 4: Get Private Key
⚠️ **IMPORTANT**: Only use this wallet for testing!

1. Open MetaMask
2. Click account menu → **Account Details**
3. Click **Export Private Key**
4. Enter password
5. Copy private key (starts with 0x)

### Add to .env:
```env
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

---

## 4️⃣ Twilio (SMS/OTP) - Optional

### What it's for:
- Send OTP via SMS for authentication
- Not required for development (OTP logged to console)

### Setup Steps:

#### Step 1: Create Account
1. Go to: https://www.twilio.com/try-twilio
2. Sign up (requires phone verification)
3. Complete verification

#### Step 2: Get Trial Phone Number
1. Get a Twilio phone number (free trial)
2. Go to **Phone Numbers** → **Manage** → **Active Numbers**
3. Copy your Twilio number

#### Step 3: Get Credentials
1. Go to Dashboard: https://console.twilio.com/
2. Copy:
   - **Account SID**: e.g., ACxxxxxxxxxxxxxxxxxxxxxxxxx
   - **Auth Token**: e.g., xxxxxxxxxxxxxxxxxxxxxxxxx

### Add to .env:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

### Implementation (Optional):
Create `src/utils/sms.ts`:
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTP = async (phone: string, otp: string) => {
  await client.messages.create({
    body: `Your Agora OTP is: ${otp}. Valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
};
```

---

## 5️⃣ JWT Secret (Authentication) ⭐ REQUIRED

### What it's for:
- Secure JWT token generation
- User session management

### Generate Strong Secret:

#### Option 1: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Option 2: Using OpenSSL
```bash
openssl rand -hex 64
```

#### Option 3: Online Generator
- Go to: https://www.grc.com/passwords.htm
- Use the 63 random printable ASCII characters

### Add to .env:
```env
JWT_SECRET=your_very_long_random_secret_key_here_at_least_32_characters
JWT_EXPIRES_IN=24h
```

---

## 📝 Complete .env File Template

Create `.env` file in `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MongoDB Atlas)
MONGODB_URI=mongodb+srv://agora_admin:YOUR_PASSWORD@agora-cluster.xxxxx.mongodb.net/agora?retryWrites=true&w=majority

# JWT Configuration (Generate random string)
JWT_SECRET=your_very_long_random_secret_key_here_at_least_64_characters
JWT_EXPIRES_IN=24h

# Client URL (Frontend)
CLIENT_URL=http://localhost:3000

# Blockchain Configuration (Alchemy)
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
CHAIN_ID=80001

# Admin Wallet (MetaMask Private Key with test MATIC)
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_FROM_METAMASK

# Smart Contract Addresses (Set after deployment)
SBT_CONTRACT_ADDRESS=
VOTING_CONTRACT_ADDRESS=
PROPOSAL_CONTRACT_ADDRESS=

# SMS Service Configuration (Optional - Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🔐 Security Best Practices

### ❌ NEVER:
- Commit `.env` file to git
- Share private keys publicly
- Use mainnet private keys in development
- Use same wallet for production and testing

### ✅ ALWAYS:
- Use `.gitignore` to exclude `.env`
- Use environment variables in production
- Keep backups of seeds/keys offline
- Use different wallets for dev/prod
- Rotate JWT secrets periodically

---

## 🧪 For Development/Testing

### Use Local Services (No API Keys Required):

#### Local MongoDB:
```bash
# Install MongoDB locally
# Windows: https://www.mongodb.com/try/download/community

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/agora
```

#### Local Hardhat Node:
```bash
# No API key needed
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CHAIN_ID=31337

# Use Hardhat's default private key
ADMIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

---

## 📊 Verification Checklist

- [ ] MongoDB Atlas cluster created and connection string working
- [ ] Alchemy account created and API key obtained
- [ ] MetaMask installed and wallet created
- [ ] Polygon Mumbai network added to MetaMask
- [ ] Test MATIC received from faucet (at least 1 MATIC)
- [ ] Private key exported and added to .env
- [ ] JWT secret generated
- [ ] `.env` file created with all values
- [ ] `.env` added to `.gitignore`

---

## 🆘 Troubleshooting

### MongoDB Connection Failed
- Check if IP is whitelisted (0.0.0.0/0)
- Verify password doesn't contain special characters
- Ensure database user has correct permissions

### Blockchain Connection Failed
- Verify Alchemy API key is correct
- Check if RPC URL includes full path with API key
- Ensure Polygon Mumbai is selected (not mainnet)

### Insufficient Funds
- Request more test MATIC from faucet
- Wait 24 hours and try different faucet
- Check if tokens received in MetaMask

### Private Key Error
- Ensure private key starts with `0x`
- Don't include spaces or quotes
- Use a testnet wallet only

---

## 📚 Additional Resources

### Blockchain Explorers:
- **Polygon Mumbai**: https://mumbai.polygonscan.com
- View all transactions, contracts, and addresses

### Testing Tools:
- **Hardhat Console**: Test smart contracts locally
- **MetaMask**: View balances and transactions
- **MongoDB Compass**: GUI for MongoDB

### Documentation:
- **Alchemy**: https://docs.alchemy.com/
- **MongoDB**: https://docs.mongodb.com/
- **Twilio**: https://www.twilio.com/docs/
- **Polygon**: https://docs.polygon.technology/

---

## 🎯 Quick Setup Summary (5 minutes)

For fastest setup:

1. **MongoDB Atlas** (2 min):
   - Sign up → Create free cluster → Get connection string

2. **Alchemy** (2 min):
   - Sign up → Create app (Polygon Mumbai) → Get API key

3. **MetaMask + Faucet** (2 min):
   - Install MetaMask → Add Mumbai network → Get test MATIC

4. **Generate JWT Secret** (10 sec):
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Create .env file** (1 min):
   - Copy template above
   - Fill in your values

Done! 🎉

---

## 💡 Pro Tips

1. **Use Alchemy Dashboard** to monitor API calls and debug
2. **Keep MetaMask open** to approve transactions during testing
3. **Use Mumbai PolygonScan** to verify deployed contracts
4. **Save all keys in password manager** (like 1Password, Bitwarden)
5. **Test locally first** with Hardhat before deploying to testnet

---

**Need Help?**
- Check troubleshooting section above
- Refer to BLOCKCHAIN_SETUP.md
- Review service documentation links

Good luck! 🚀
