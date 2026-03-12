import { ethers } from 'ethers';
import { getAdminSigner, getSigner, BLOCKCHAIN_CONFIG } from './web3Config';

// ABI for Voting Smart Contract
const VOTING_ABI = [
  'function createElection(string memory title, string memory description, uint256 startTime, uint256 endTime, string[] memory partyNames) external returns (uint256)',
  'function vote(uint256 electionId, uint256 partyIndex, address voterAddress) external',
  'function hasVoted(uint256 electionId, address voter) external view returns (bool)',
  'function getVoteCount(uint256 electionId, uint256 partyIndex) external view returns (uint256)',
  'function getTotalVotes(uint256 electionId) external view returns (uint256)',
  'function getElectionResults(uint256 electionId) external view returns (uint256[] memory)',
  'function getElectionStatus(uint256 electionId) external view returns (uint8)',
  'event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime)',
  'event VoteCast(uint256 indexed electionId, address indexed voter, uint256 partyIndex, uint256 timestamp)',
];

export class VotingService {
  private contract: ethers.Contract | null = null;
  private signer: ethers.Wallet | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      if (!BLOCKCHAIN_CONFIG.VOTING_CONTRACT_ADDRESS) {
        console.warn('⚠️ Voting contract address not configured - blockchain voting disabled');
        return;
      }

      this.signer = getAdminSigner();
      this.contract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.VOTING_CONTRACT_ADDRESS,
        VOTING_ABI,
        this.signer
      );
    } catch (error) {
      console.error('Failed to initialize Voting service:', error);
    }
  }

  /**
   * Create an election on the blockchain
   */
  async createElection(
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    parties: string[]
  ): Promise<{ success: boolean; electionId?: string; txHash?: string; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'Voting contract not initialized' };
      }

      const startTime = Math.floor(startDate.getTime() / 1000);
      const endTime = Math.floor(endDate.getTime() / 1000);

      const tx = await this.contract.createElection(
        title,
        description,
        startTime,
        endTime,
        parties
      );
      const receipt = await tx.wait();

      // Extract election ID from event
      const event = receipt.logs.find((log: any) => {
        try {
          return this.contract!.interface.parseLog(log)?.name === 'ElectionCreated';
        } catch {
          return false;
        }
      });

      const electionId = event
        ? this.contract.interface.parseLog(event)?.args.electionId.toString()
        : '0';

      console.log(`✅ Election created on blockchain - ID: ${electionId}`);

      return {
        success: true,
        electionId,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error creating election on blockchain:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cast a vote on the blockchain
   */
  async castVote(
    electionId: string,
    partyIndex: number,
    voterWalletAddress: string,
    voterPrivateKey?: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'Voting contract not initialized' };
      }

      // Check if already voted
      const hasVoted = await this.contract.hasVoted(electionId, voterWalletAddress);
      if (hasVoted) {
        return { success: false, error: 'User has already voted in this election' };
      }

      // Use voter's private key if provided, otherwise use admin signer
      const signer = voterPrivateKey ? getSigner(voterPrivateKey) : this.signer;
      const contractWithSigner = this.contract.connect(signer!) as ethers.Contract;

      const tx = await contractWithSigner.vote(electionId, partyIndex, voterWalletAddress);
      const receipt = await tx.wait();

      console.log(`✅ Vote cast on blockchain - Election: ${electionId}, Voter: ${voterWalletAddress}`);

      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error casting vote on blockchain:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if a user has voted in an election
   */
  async hasUserVoted(electionId: string, voterAddress: string): Promise<boolean> {
    try {
      if (!this.contract) return false;
      return await this.contract.hasVoted(electionId, voterAddress);
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  }

  /**
   * Get vote count for a specific party in an election
   */
  async getVoteCount(electionId: string, partyIndex: number): Promise<number> {
    try {
      if (!this.contract) return 0;
      const count = await this.contract.getVoteCount(electionId, partyIndex);
      return Number(count);
    } catch (error) {
      console.error('Error getting vote count:', error);
      return 0;
    }
  }

  /**
   * Get total votes in an election
   */
  async getTotalVotes(electionId: string): Promise<number> {
    try {
      if (!this.contract) return 0;
      const total = await this.contract.getTotalVotes(electionId);
      return Number(total);
    } catch (error) {
      console.error('Error getting total votes:', error);
      return 0;
    }
  }

  /**
   * Get complete election results
   */
  async getElectionResults(electionId: string): Promise<number[]> {
    try {
      if (!this.contract) return [];
      const results = await this.contract.getElectionResults(electionId);
      return results.map((r: any) => Number(r));
    } catch (error) {
      console.error('Error getting election results:', error);
      return [];
    }
  }

  /**
   * Get election status (0: Pending, 1: Active, 2: Ended)
   */
  async getElectionStatus(electionId: string): Promise<number> {
    try {
      if (!this.contract) return 0;
      return await this.contract.getElectionStatus(electionId);
    } catch (error) {
      console.error('Error getting election status:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const votingService = new VotingService();
