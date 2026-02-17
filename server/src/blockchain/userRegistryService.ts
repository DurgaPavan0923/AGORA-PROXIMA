import { ethers } from 'ethers';
import { getProvider, getSigner } from './web3Config';

const USER_REGISTRY_ABI = [
  "function registerUser(address _userAddress, string memory _uniqueIdProof, string memory _name, string memory _email, string memory _phoneNumber, string memory _did, uint256 _sbtTokenId) public returns (bool)",
  "function verifyUser(address _userAddress, string memory _adminName) public returns (bool)",
  "function rejectUser(address _userAddress, string memory _adminName, string memory _reason) public returns (bool)",
  "function deactivateUser(address _userAddress, string memory _adminName, string memory _reason) public returns (bool)",
  "function reactivateUser(address _userAddress, string memory _adminName) public returns (bool)",
  "function updateUserRole(address _userAddress, uint8 _newRole, string memory _adminName) public returns (bool)",
  "function getUser(address _userAddress) public view returns (string memory name, string memory email, string memory phoneNumber, string memory did, uint256 sbtTokenId, bool isVerified, bool isActive, uint8 role, uint256 registrationTimestamp, string memory verifiedBy)",
  "function getUserHistory(address _userAddress) public view returns (tuple(uint256 timestamp, string action, string performedBy, string reason)[] memory)",
  "function isUserVerified(address _userAddress) public view returns (bool)",
  "function getAddressByPhone(string memory _phoneNumber) public view returns (address)",
  "function getAllUsers() public view returns (address[] memory)",
  "function getUserCount() public view returns (uint256)",
  "event UserRegistered(address indexed userAddress, string phoneNumber, uint256 timestamp)",
  "event UserVerified(address indexed userAddress, string verifiedBy, uint256 timestamp)",
  "event UserRejected(address indexed userAddress, string rejectedBy, string reason, uint256 timestamp)"
];

export class UserRegistryService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor() {
    const contractAddress = process.env.USER_REGISTRY_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('USER_REGISTRY_CONTRACT_ADDRESS not set in environment variables');
    }

    this.signer = getSigner();
    this.contract = new ethers.Contract(contractAddress, USER_REGISTRY_ABI, this.signer);
  }

  /**
   * Register a new user on blockchain
   */
  async registerUser(
    userAddress: string,
    uniqueIdProof: string,
    name: string,
    email: string,
    phoneNumber: string,
    did: string,
    sbtTokenId: number
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const tx = await this.contract.registerUser(
        userAddress,
        uniqueIdProof,
        name,
        email,
        phoneNumber,
        did,
        sbtTokenId
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error registering user on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify user (admin only)
   */
  async verifyUser(
    userAddress: string,
    adminName: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const tx = await this.contract.verifyUser(userAddress, adminName);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error verifying user on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reject user verification (admin only)
   */
  async rejectUser(
    userAddress: string,
    adminName: string,
    reason: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const tx = await this.contract.rejectUser(userAddress, adminName, reason);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error rejecting user on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user data from blockchain
   */
  async getUser(userAddress: string): Promise<any> {
    try {
      const user = await this.contract.getUser(userAddress);
      
      return {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        did: user.did,
        sbtTokenId: user.sbtTokenId.toString(),
        isVerified: user.isVerified,
        isActive: user.isActive,
        role: user.role,
        registrationTimestamp: user.registrationTimestamp.toString(),
        verifiedBy: user.verifiedBy
      };
    } catch (error: any) {
      console.error('Error getting user from blockchain:', error);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Get user history from blockchain
   */
  async getUserHistory(userAddress: string): Promise<any[]> {
    try {
      const history = await this.contract.getUserHistory(userAddress);
      
      return history.map((entry: any) => ({
        timestamp: entry.timestamp.toString(),
        action: entry.action,
        performedBy: entry.performedBy,
        reason: entry.reason
      }));
    } catch (error: any) {
      console.error('Error getting user history from blockchain:', error);
      return [];
    }
  }

  /**
   * Check if user is verified
   */
  async isUserVerified(userAddress: string): Promise<boolean> {
    try {
      return await this.contract.isUserVerified(userAddress);
    } catch (error: any) {
      console.error('Error checking user verification:', error);
      return false;
    }
  }

  /**
   * Get wallet address by phone number
   */
  async getAddressByPhone(phoneNumber: string): Promise<string> {
    try {
      return await this.contract.getAddressByPhone(phoneNumber);
    } catch (error: any) {
      console.error('Error getting address by phone:', error);
      return ethers.ZeroAddress;
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<string[]> {
    try {
      return await this.contract.getAllUsers();
    } catch (error: any) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  /**
   * Get total user count
   */
  async getUserCount(): Promise<number> {
    try {
      const count = await this.contract.getUserCount();
      return count.toNumber();
    } catch (error: any) {
      console.error('Error getting user count:', error);
      return 0;
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(
    userAddress: string,
    newRole: number,
    adminName: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const tx = await this.contract.updateUserRole(userAddress, newRole, adminName);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error updating user role on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Deactivate user (admin only)
   */
  async deactivateUser(
    userAddress: string,
    adminName: string,
    reason: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const tx = await this.contract.deactivateUser(userAddress, adminName, reason);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error deactivating user on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reactivate user (admin only)
   */
  async reactivateUser(
    userAddress: string,
    adminName: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const tx = await this.contract.reactivateUser(userAddress, adminName);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error reactivating user on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
