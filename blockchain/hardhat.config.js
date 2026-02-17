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
        // Default Hardhat account private key
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
    // For contract verification on block explorers
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || ""
    }
  }
};
