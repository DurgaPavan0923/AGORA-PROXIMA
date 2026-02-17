# AGORA Blockchain Smart Contracts

Blockchain-powered voting system using Ethereum smart contracts.

## Contracts

1. **VotingContract.sol** - Manages elections and vote casting
2. **SBT.sol** - Soulbound Token for voter identity (non-transferable)

## Setup & Deployment

### 1. Install Dependencies
```bash
cd blockchain
npm install
```

### 2. Start Hardhat Local Node (Terminal 1)
```bash
npm run node
```
Keep this terminal running. It will show you test accounts with ETH.

### 3. Deploy Contracts (Terminal 2)
```bash
npm run deploy
```

This will:
- Compile the smart contracts
- Deploy to local Hardhat network
- Update `server/.env` with contract addresses
- Save deployment info to `deployments/localhost.json`

### 4. Restart Backend Server
After deployment, restart your Express server to load the new contract addresses.

## Contract Features

### VotingContract
- ✅ Create elections with multiple parties
- ✅ Cast votes securely on blockchain
- ✅ Prevent double voting
- ✅ Get real-time results
- ✅ Time-based election control

### SBT (Soulbound Token)
- ✅ Issue non-transferable identity tokens
- ✅ One token per user (unique identity)
- ✅ Revoke/reactivate tokens
- ✅ Verify voter eligibility

## Network Configuration

- **Network**: Hardhat Local
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Admin Account**: First Hardhat test account

## Commands

```bash
npm run compile  # Compile contracts
npm run node     # Start local blockchain
npm run deploy   # Deploy contracts
npm run test     # Run tests
```

## Integration

The backend services automatically connect to deployed contracts:
- `server/src/blockchain/votingService.ts`
- `server/src/blockchain/sbtService.ts`

Make sure Hardhat node is running before starting the backend!
