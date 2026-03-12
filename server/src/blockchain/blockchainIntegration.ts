import { UserRegistryService } from './userRegistryService';
import { VotingService, votingService } from './votingService';
import { ethers } from 'ethers';

/**
 * Comprehensive Blockchain Integration
 * 
 * Data Flow: Action → Blockchain (PRIMARY) → MongoDB (CACHE)
 * 
 * All critical data is stored on blockchain first for immutability and transparency.
 * MongoDB serves as a fast cache layer for queries.
 */

export class BlockchainIntegration {
  private userRegistry!: UserRegistryService;
  private votingService!: VotingService;
  private enabled: boolean;

  constructor() {
    try {
      // Check if blockchain is configured
      if (!process.env.USER_REGISTRY_CONTRACT_ADDRESS || !process.env.VOTING_CONTRACT_ADDRESS) {
        console.warn('⚠️ Blockchain contract addresses not configured');
        console.warn('⚠️ Running in database-only mode (MongoDB primary storage)');
        this.enabled = false;
        return;
      }

      this.userRegistry = new UserRegistryService();
      this.votingService = votingService;
      this.enabled = true;
      console.log('✅ Blockchain integration initialized');
      console.log('✅ Using blockchain as primary storage');
    } catch (error: any) {
      console.warn('⚠️ Blockchain initialization failed:', error.message);
      console.warn('⚠️ Running in database-only mode');
      this.enabled = false;
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Generate a deterministic wallet address from phone number
   * This ensures same phone always gets same address
   */
  generateWalletAddress(phoneNumber: string): string {
    // Create deterministic hash from phone
    const hash = ethers.keccak256(ethers.toUtf8Bytes(phoneNumber));
    // Use first 20 bytes as address
    return ethers.getAddress('0x' + hash.slice(26));
  }

  /**
   * USER REGISTRATION
   * Save user data to blockchain with complete audit trail
   */
  async registerUserOnBlockchain(userData: {
    phoneNumber: string;
    name: string;
    email: string;
    aadhaarNumber: string;
    address: string;
    age: number;
    uniqueVoterId: string;
  }): Promise<{ success: boolean; txHash?: string; walletAddress?: string; error?: string }> {
    if (!this.enabled) {
      return { success: false, error: 'Blockchain not enabled' };
    }

    try {
      const walletAddress = this.generateWalletAddress(userData.phoneNumber);
      
      const result = await this.userRegistry.registerUser(
        walletAddress,
        userData.uniqueVoterId,
        userData.name,
        userData.email,
        userData.phoneNumber,
        `agora:did:${userData.uniqueVoterId}`, // DID
        Date.now() // SBT Token ID (timestamp)
      );

      if (result.success) {
        console.log(`✅ User registered on blockchain: ${userData.phoneNumber} → ${walletAddress}`);
        return {
          success: true,
          txHash: result.txHash,
          walletAddress,
        };
      }

      return result;
    } catch (error: any) {
      console.error('Blockchain user registration failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * USER VERIFICATION
   * Record admin verification on blockchain
   */
  async verifyUserOnBlockchain(
    phoneNumber: string,
    adminName: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.enabled) {
      return { success: false, error: 'Blockchain not enabled' };
    }

    try {
      const walletAddress = this.generateWalletAddress(phoneNumber);
      const result = await this.userRegistry.verifyUser(walletAddress, adminName);

      if (result.success) {
        console.log(`✅ User verified on blockchain: ${phoneNumber} by ${adminName}`);
      }

      return result;
    } catch (error: any) {
      console.error('Blockchain user verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * USER REJECTION
   * Record rejection reason on blockchain
   */
  async rejectUserOnBlockchain(
    phoneNumber: string,
    adminName: string,
    reason: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.enabled) {
      return { success: false, error: 'Blockchain not enabled' };
    }

    try {
      const walletAddress = this.generateWalletAddress(phoneNumber);
      const result = await this.userRegistry.rejectUser(walletAddress, adminName, reason);

      if (result.success) {
        console.log(`✅ User rejection recorded on blockchain: ${phoneNumber}`);
      }

      return result;
    } catch (error: any) {
      console.error('Blockchain user rejection failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ELECTION CREATION
   * Store election details on blockchain
   */
  async createElectionOnBlockchain(electionData: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    parties: Array<{ name: string; symbol: string; manifesto: string }>;
  }): Promise<{ success: boolean; blockchainElectionId?: string; txHash?: string; error?: string }> {
    if (!this.enabled) {
      return { success: false, error: 'Blockchain not enabled' };
    }

    try {
      const partyNames = electionData.parties.map(p => `${p.symbol} ${p.name}`);
      
      const result = await this.votingService.createElection(
        electionData.title,
        electionData.description,
        electionData.startDate,
        electionData.endDate,
        partyNames
      );

      if (result.success) {
        console.log(`✅ Election created on blockchain: ${electionData.title} - ID: ${result.electionId}`);
      }

      return {
        success: result.success,
        blockchainElectionId: result.electionId,
        txHash: result.txHash,
        error: result.error,
      };
    } catch (error: any) {
      console.error('Blockchain election creation failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * VOTE CASTING
   * Record vote on blockchain (immutable)
   */
  async castVoteOnBlockchain(voteData: {
    phoneNumber: string;
    blockchainElectionId: string;
    partyIndex: number;
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.enabled) {
      return { success: false, error: 'Blockchain not enabled' };
    }

    try {
      const walletAddress = this.generateWalletAddress(voteData.phoneNumber);

      // Check if already voted
      const hasVoted = await this.votingService.hasUserVoted(
        voteData.blockchainElectionId,
        walletAddress
      );

      if (hasVoted) {
        return { success: false, error: 'Already voted on blockchain' };
      }

      const result = await this.votingService.castVote(
        voteData.blockchainElectionId,
        voteData.partyIndex,
        walletAddress
      );

      if (result.success) {
        console.log(`✅ Vote recorded on blockchain: Election ${voteData.blockchainElectionId}, Voter ${walletAddress}`);
      }

      return result;
    } catch (error: any) {
      console.error('Blockchain vote casting failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET USER FROM BLOCKCHAIN
   * Retrieve user data from immutable storage
   */
  async getUserFromBlockchain(phoneNumber: string): Promise<any> {
    if (!this.enabled) {
      return null;
    }

    try {
      const walletAddress = this.generateWalletAddress(phoneNumber);
      const user = await this.userRegistry.getUser(walletAddress);
      return {
        ...user,
        walletAddress,
      };
    } catch (error: any) {
      console.error('Failed to get user from blockchain:', error);
      return null;
    }
  }

  /**
   * GET USER HISTORY FROM BLOCKCHAIN
   * Complete audit trail of all actions
   */
  async getUserHistoryFromBlockchain(phoneNumber: string): Promise<any[]> {
    if (!this.enabled) {
      return [];
    }

    try {
      const walletAddress = this.generateWalletAddress(phoneNumber);
      return await this.userRegistry.getUserHistory(walletAddress);
    } catch (error: any) {
      console.error('Failed to get user history from blockchain:', error);
      return [];
    }
  }

  /**
   * GET ELECTION RESULTS FROM BLOCKCHAIN
   * Tamper-proof vote counts
   */
  async getElectionResultsFromBlockchain(blockchainElectionId: string): Promise<{
    results: number[];
    totalVotes: number;
    status: number;
  }> {
    if (!this.enabled) {
      return { results: [], totalVotes: 0, status: 0 };
    }

    try {
      const [results, totalVotes, status] = await Promise.all([
        this.votingService.getElectionResults(blockchainElectionId),
        this.votingService.getTotalVotes(blockchainElectionId),
        this.votingService.getElectionStatus(blockchainElectionId),
      ]);

      return { results, totalVotes, status };
    } catch (error: any) {
      console.error('Failed to get election results from blockchain:', error);
      return { results: [], totalVotes: 0, status: 0 };
    }
  }

  /**
   * CHECK VOTE STATUS FROM BLOCKCHAIN
   * Verify if user has voted (source of truth)
   */
  async hasVotedOnBlockchain(phoneNumber: string, blockchainElectionId: string): Promise<boolean> {
    if (!this.enabled) {
      return false;
    }

    try {
      const walletAddress = this.generateWalletAddress(phoneNumber);
      return await this.votingService.hasUserVoted(blockchainElectionId, walletAddress);
    } catch (error: any) {
      console.error('Failed to check vote status on blockchain:', error);
      return false;
    }
  }

  /**
   * GET VOTE COUNT FOR PARTY
   * Real-time vote count from blockchain
   */
  async getPartyVoteCount(blockchainElectionId: string, partyIndex: number): Promise<number> {
    if (!this.enabled) {
      return 0;
    }

    try {
      return await this.votingService.getVoteCount(blockchainElectionId, partyIndex);
    } catch (error: any) {
      console.error('Failed to get party vote count from blockchain:', error);
      return 0;
    }
  }

  /**
   * SYNC DATA FROM BLOCKCHAIN TO MONGODB
   * Used for initial sync or recovery
   */
  async syncUserFromBlockchain(phoneNumber: string): Promise<any> {
    if (!this.enabled) {
      return null;
    }

    try {
      const userData = await this.getUserFromBlockchain(phoneNumber);
      if (!userData) {
        return null;
      }

      // Return data that should be synced to MongoDB
      return {
        walletAddress: userData.walletAddress,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        isVerified: userData.isVerified,
        isActive: userData.isActive,
        role: userData.role,
        registrationTimestamp: new Date(parseInt(userData.registrationTimestamp) * 1000),
      };
    } catch (error: any) {
      console.error('Failed to sync user from blockchain:', error);
      return null;
    }
  }

  /**
   * GET ALL USERS FROM BLOCKCHAIN
   * Admin function to list all registered users
   */
  async getAllUsersFromBlockchain(): Promise<string[]> {
    if (!this.enabled) {
      return [];
    }

    try {
      return await this.userRegistry.getAllUsers();
    } catch (error: any) {
      console.error('Failed to get all users from blockchain:', error);
      return [];
    }
  }

  /**
   * GET USER COUNT FROM BLOCKCHAIN
   */
  async getUserCountFromBlockchain(): Promise<number> {
    if (!this.enabled) {
      return 0;
    }

    try {
      return await this.userRegistry.getUserCount();
    } catch (error: any) {
      console.error('Failed to get user count from blockchain:', error);
      return 0;
    }
  }

  /**
   * UPDATE USER ROLE ON BLOCKCHAIN
   */
  async updateUserRoleOnBlockchain(
    phoneNumber: string,
    newRole: number,
    adminName: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.enabled) {
      return { success: false, error: 'Blockchain not enabled' };
    }

    try {
      const walletAddress = this.generateWalletAddress(phoneNumber);
      const result = await this.userRegistry.updateUserRole(walletAddress, newRole, adminName);

      if (result.success) {
        console.log(`✅ User role updated on blockchain: ${phoneNumber} → Role ${newRole}`);
      }

      return result;
    } catch (error: any) {
      console.error('Failed to update user role on blockchain:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const blockchainIntegration = new BlockchainIntegration();

// Role mappings for blockchain
export enum BlockchainRole {
  VOTER = 0,
  ADMIN = 1,
  ELECTION_COMMISSION = 2,
}

// Election status on blockchain
export enum BlockchainElectionStatus {
  PENDING = 0,
  ACTIVE = 1,
  ENDED = 2,
}
