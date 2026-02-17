import { Request, Response } from 'express';
import { Election } from '../models/Election';
import { Vote } from '../models/Vote';
import { User } from '../models/User';
import { votingService } from '../blockchain/votingService';
import { AuthRequest } from '../middleware/auth';

// Get all elections
export const getAllElections = async (req: Request, res: Response): Promise<void> => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });

    const electionsWithVotes = await Promise.all(
      elections.map(async (election) => {
        const votes = await Vote.find({ electionId: election._id });
        const voteCount = votes.length;
        
        // Calculate vote counts per party
        const voteCounts: Record<string, number> = {};
        votes.forEach((vote) => {
          voteCounts[vote.partyId] = (voteCounts[vote.partyId] || 0) + 1;
        });
        
        return {
          ...election.toObject(),
          totalVotes: voteCount,
          voteCounts,
        };
      })
    );

    res.json({ success: true, elections: electionsWithVotes });
  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
};

// Get election by ID
export const getElectionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);
    if (!election) {
      res.status(404).json({ error: 'Election not found' });
      return;
    }

    // Get vote counts per party
    const votes = await Vote.find({ electionId: id });
    const voteCounts: Record<string, number> = {};
    
    votes.forEach((vote) => {
      voteCounts[vote.partyId] = (voteCounts[vote.partyId] || 0) + 1;
    });

    res.json({
      success: true,
      election: {
        ...election.toObject(),
        totalVotes: votes.length,
        voteCounts,
      },
    });
  } catch (error) {
    console.error('Get election error:', error);
    res.status(500).json({ error: 'Failed to fetch election' });
  }
};

// Create new election
export const createElection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, startDate, endDate, parties, type } = req.body;

    if (!title || !description || !startDate || !endDate) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Auto-generate party IDs if not provided
    const partiesWithIds = (parties || []).map((party: any) => ({
      ...party,
      id: party.id || `party-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    const election = new Election({
      title,
      description,
      type: type || 'local',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'upcoming',
      parties: partiesWithIds,
      createdBy: req.user?.uniqueId,
    });

    await election.save();

    // Store election on blockchain
    try {
      const partyNames = parties ? parties.map((p: any) => p.name) : [];
      const blockchainResult = await votingService.createElection(
        title,
        description,
        new Date(startDate),
        new Date(endDate),
        partyNames
      );

      if (blockchainResult.success) {
        election.blockchainTxHash = blockchainResult.txHash;
        await election.save();
        console.log(`✅ Election created on blockchain: ${blockchainResult.electionId}`);
      } else {
        console.warn(`⚠️ Failed to create election on blockchain: ${blockchainResult.error}`);
      }
    } catch (error) {
      console.error('Error creating election on blockchain:', error);
      // Continue even if blockchain fails
    }

    res.json({
      success: true,
      message: 'Election created successfully',
      election,
    });
  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({ error: 'Failed to create election' });
  }
};

// Update election
export const updateElection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log('📝 Update Election Request:');
    console.log('  - Election ID:', id);
    console.log('  - Updates:', JSON.stringify(updates));
    console.log('  - User:', req.user?.uniqueId, req.user?.role);

    const election = await Election.findByIdAndUpdate(id, updates, { new: true });

    if (!election) {
      console.log('❌ Election not found:', id);
      res.status(404).json({ error: 'Election not found' });
      return;
    }

    console.log('✅ Election updated successfully:', election._id);
    res.json({
      success: true,
      message: 'Election updated successfully',
      election,
    });
  } catch (error: any) {
    console.error('❌ Update election error:');
    console.error('  - Error type:', error.name);
    console.error('  - Error message:', error.message);
    console.error('  - Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to update election',
      details: error.message 
    });
  }
};

// Vote in election
export const voteInElection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { partyId } = req.body;

    if (!partyId) {
      res.status(400).json({ error: 'Party ID is required' });
      return;
    }

    const election = await Election.findById(id);
    if (!election) {
      res.status(404).json({ error: 'Election not found' });
      return;
    }

    // Check if election is active
    if (election.status !== 'active') {
      res.status(400).json({ error: 'Election is not active' });
      return;
    }

    // Check if election is within date range
    const now = new Date();
    if (now < election.startDate || now > election.endDate) {
      res.status(400).json({ error: 'Election is not currently open for voting' });
      return;
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      electionId: id,
      userId: req.user?.uniqueId,
    });

    if (existingVote) {
      res.status(400).json({ error: 'You have already voted in this election' });
      return;
    }

    // Get user's wallet address
    const user = await User.findOne({ uniqueId: req.user?.uniqueId });
    if (!user || !user.walletAddress) {
      res.status(400).json({ error: 'User wallet not found' });
      return;
    }

    // Create vote in database
    const vote = new Vote({
      electionId: id,
      userId: req.user?.uniqueId,
      partyId,
      votedAt: new Date(),
    });

    await vote.save();

    // Record vote on blockchain
    try {
      // Find party index
      const partyIndex = election.parties.findIndex((p: any) => p.id === partyId);
      if (partyIndex === -1) {
        console.warn('Party not found, skipping blockchain vote');
      } else {
        const blockchainResult = await votingService.castVote(
          election._id.toString(), // Using MongoDB ID as election ID
          partyIndex,
          user.walletAddress,
          user.encryptedPrivateKey // In production, decrypt this first
        );

        if (blockchainResult.success) {
          vote.blockchainTxHash = blockchainResult.txHash;
          await vote.save();
          console.log(`✅ Vote recorded on blockchain: ${blockchainResult.txHash}`);
        } else {
          console.warn(`⚠️ Failed to record vote on blockchain: ${blockchainResult.error}`);
        }
      }
    } catch (error) {
      console.error('Error recording vote on blockchain:', error);
      // Continue even if blockchain fails - vote is still recorded in DB
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully',
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
};

// Check if user has voted
export const checkUserVoted = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const vote = await Vote.findOne({
      electionId: id,
      userId: req.user?.uniqueId,
    });

    res.json({
      success: true,
      hasVoted: !!vote,
    });
  } catch (error) {
    console.error('Check voted error:', error);
    res.status(500).json({ error: 'Failed to check vote status' });
  }
};

// Delete election
export const deleteElection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);
    if (!election) {
      res.status(404).json({ error: 'Election not found' });
      return;
    }

    // Allow EC to delete any election
    await Election.findByIdAndDelete(id);
    
    // Also delete all votes for this election
    await Vote.deleteMany({ electionId: id });

    res.json({
      success: true,
      message: 'Election deleted successfully',
    });
  } catch (error) {
    console.error('Delete election error:', error);
    res.status(500).json({ error: 'Failed to delete election' });
  }
};

// Get election winner
export const getElectionWinner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);
    if (!election) {
      res.status(404).json({ error: 'Election not found' });
      return;
    }

    if (election.status !== 'completed') {
      res.status(400).json({ error: 'Election is not yet completed' });
      return;
    }

    // Get vote counts
    const votes = await Vote.find({ electionId: id });
    const voteCounts: Record<string, number> = {};
    
    votes.forEach((vote) => {
      voteCounts[vote.partyId] = (voteCounts[vote.partyId] || 0) + 1;
    });

    // Find winner
    let maxVotes = 0;
    let winningParty: any = null;
    let isTie = false;
    const tiedParties: any[] = [];

    election.parties.forEach((party: any) => {
      const voteCount = voteCounts[party.id] || 0;
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        winningParty = party;
        isTie = false;
        tiedParties.length = 0;
        tiedParties.push(party);
      } else if (voteCount === maxVotes && maxVotes > 0) {
        isTie = true;
        tiedParties.push(party);
      }
    });

    if (isTie) {
      res.json({
        success: true,
        winner: null,
        isTie: true,
        tiedParties: tiedParties.map(p => ({
          ...p,
          votes: maxVotes,
          percentage: votes.length > 0 ? Math.round((maxVotes / votes.length) * 100) : 0,
        })),
        message: 'The election resulted in a tie',
        voteCounts,
        totalVotes: votes.length,
      });
      return;
    }

    if (!winningParty) {
      res.json({
        success: true,
        winner: null,
        isTie: false,
        message: 'No votes cast in this election',
        voteCounts,
        totalVotes: 0,
      });
      return;
    }

    res.json({
      success: true,
      winner: {
        ...winningParty,
        votes: maxVotes,
        percentage: votes.length > 0 ? Math.round((maxVotes / votes.length) * 100) : 0,
      },
      isTie: false,
      voteCounts,
      totalVotes: votes.length,
    });
  } catch (error) {
    console.error('Get winner error:', error);
    res.status(500).json({ error: 'Failed to get election winner' });
  }
};
