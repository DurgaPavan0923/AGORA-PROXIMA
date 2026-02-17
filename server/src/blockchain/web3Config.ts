import { ethers } from 'ethers';

// Blockchain configuration
export const BLOCKCHAIN_CONFIG = {
  // For development - use Hardhat local node or testnet
  RPC_URL: process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545',
  CHAIN_ID: parseInt(process.env.CHAIN_ID || '31337'), // Hardhat default
  
  // Contract addresses (will be set after deployment)
  SBT_CONTRACT_ADDRESS: process.env.SBT_CONTRACT_ADDRESS || '',
  VOTING_CONTRACT_ADDRESS: process.env.VOTING_CONTRACT_ADDRESS || '',
  PROPOSAL_CONTRACT_ADDRESS: process.env.PROPOSAL_CONTRACT_ADDRESS || '',
  
  // Admin wallet (for deploying and managing contracts)
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY || '',
};

// Create provider
export const getProvider = (): ethers.JsonRpcProvider => {
  return new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.RPC_URL);
};

// Get admin signer (for contract deployment and admin operations)
export const getAdminSigner = (): ethers.Wallet => {
  if (!BLOCKCHAIN_CONFIG.ADMIN_PRIVATE_KEY) {
    throw new Error('Admin private key not configured');
  }
  const provider = getProvider();
  return new ethers.Wallet(BLOCKCHAIN_CONFIG.ADMIN_PRIVATE_KEY, provider);
};

// Get signer for a specific user (if they have a wallet)
export const getSigner = (privateKey: string): ethers.Wallet => {
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
};

// Utility function to check blockchain connection
export const checkBlockchainConnection = async (): Promise<boolean> => {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    console.log(`✅ Connected to blockchain network: ${network.name} (Chain ID: ${network.chainId})`);
    return true;
  } catch (error) {
    console.error('❌ Blockchain connection failed:', error);
    return false;
  }
};

// Generate a new wallet for a user
export const generateWallet = (): { address: string; privateKey: string; mnemonic: string } => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || '',
  };
};

// Hash function for creating DIDs
export const createDID = (aadhaar: string, phone: string): string => {
  const data = ethers.toUtf8Bytes(`${aadhaar}:${phone}`);
  const hash = ethers.keccak256(data);
  return `did:agora:${hash.slice(2, 42)}`; // Use first 40 chars of hash
};
