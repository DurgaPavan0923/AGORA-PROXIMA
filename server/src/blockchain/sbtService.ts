import { ethers } from 'ethers';
import { getAdminSigner, BLOCKCHAIN_CONFIG } from './web3Config';

// ABI for Soulbound Token (SBT) Contract
const SBT_ABI = [
  'function issueSBT(address _to, string memory _uniqueId, string memory _fullName) external returns (uint256)',
  'function revokeSBT(uint256 _tokenId) external',
  'function reactivateSBT(uint256 _tokenId) external',
  'function getTokenByOwner(address _owner) external view returns (uint256)',
  'function getTokenByUniqueId(string memory _uniqueId) external view returns (uint256)',
  'function getToken(uint256 _tokenId) external view returns (address owner, string memory uniqueId, string memory fullName, bool isActive, uint256 issuedAt)',
  'function hasActiveSBT(address _owner) external view returns (bool)',
  'function isUniqueIdRegistered(string memory _uniqueId) external view returns (bool)',
  'function getTotalSupply() external view returns (uint256)',
  'event TokenIssued(uint256 indexed tokenId, address indexed owner, string uniqueId, uint256 timestamp)',
  'event TokenRevoked(uint256 indexed tokenId, address indexed owner, uint256 timestamp)',
];

export class SBTService {
  private contract: ethers.Contract | null = null;
  private signer: ethers.Wallet | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      if (!BLOCKCHAIN_CONFIG.SBT_CONTRACT_ADDRESS) {
        console.warn('⚠️ SBT contract address not configured - blockchain features disabled');
        return;
      }

      this.signer = getAdminSigner();
      this.contract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.SBT_CONTRACT_ADDRESS,
        SBT_ABI,
        this.signer
      );
    } catch (error) {
      console.error('Failed to initialize SBT service:', error);
    }
  }

  /**
   * Issue a Soulbound Token (non-transferable identity) for a verified citizen
   */
  async issueSBT(
    walletAddress: string,
    uniqueId: string,
    fullName: string
  ): Promise<{ success: boolean; tokenId?: string; txHash?: string; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'SBT contract not initialized' };
      }

      // Check if user already has an SBT
      const hasToken = await this.contract.hasActiveSBT(walletAddress);
      if (hasToken) {
        return { success: false, error: 'User already has a Soulbound Token' };
      }

      // Issue SBT
      const tx = await this.contract.issueSBT(walletAddress, uniqueId, fullName);
      const receipt = await tx.wait();

      // Get token ID from event
      const event = receipt.logs.find((log: any) => {
        try {
          return this.contract!.interface.parseLog(log)?.name === 'TokenIssued';
        } catch {
          return false;
        }
      });

      const tokenId = event
        ? this.contract.interface.parseLog(event)?.args.tokenId.toString()
        : '0';

      console.log(`✅ SBT issued for ${walletAddress} - Token ID: ${tokenId}, Unique ID: ${uniqueId}`);

      return {
        success: true,
        tokenId,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error issuing SBT:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if an address has an active Soulbound Token
   */
  async hasActiveSBT(walletAddress: string): Promise<boolean> {
    try {
      if (!this.contract) return false;
      return await this.contract.hasActiveSBT(walletAddress);
    } catch (error) {
      console.error('Error checking SBT:', error);
      return false;
    }
  }

  /**
   * Get token details for a wallet address
   */
  async getTokenByOwner(walletAddress: string): Promise<any | null> {
    try {
      if (!this.contract) return null;
      const tokenId = await this.contract.getTokenByOwner(walletAddress);
      if (tokenId.toString() === '0') return null;
      
      const token = await this.contract.getToken(tokenId);
      return {
        tokenId: tokenId.toString(),
        owner: token.owner,
        uniqueId: token.uniqueId,
        fullName: token.fullName,
        isActive: token.isActive,
        issuedAt: token.issuedAt.toString(),
      };
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Get token ID by unique ID
   */
  async getTokenByUniqueId(uniqueId: string): Promise<string | null> {
    try {
      if (!this.contract) return null;
      const tokenId = await this.contract.getTokenByUniqueId(uniqueId);
      return tokenId.toString();
    } catch (error) {
      console.error('Error getting token ID:', error);
      return null;
    }
  }

  /**
   * Revoke a Soulbound Token (admin only, in case of fraud)
   */
  async revokeSBT(tokenId: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'SBT contract not initialized' };
      }

      const tx = await this.contract.revokeSBT(tokenId);
      const receipt = await tx.wait();

      console.log(`✅ SBT revoked - Token ID: ${tokenId}`);

      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error revoking SBT:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reactivate a revoked Soulbound Token
   */
  async reactivateSBT(tokenId: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'SBT contract not initialized' };
      }

      const tx = await this.contract.reactivateSBT(tokenId);
      const receipt = await tx.wait();

      console.log(`✅ SBT reactivated - Token ID: ${tokenId}`);

      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error reactivating SBT:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const sbtService = new SBTService();
