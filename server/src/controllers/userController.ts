import { Response } from 'express';
import { User } from '../models/User';
import { Vote } from '../models/Vote';
import { ProposalVote } from '../models/ProposalVote';
import { Election } from '../models/Election';
import { Proposal } from '../models/Proposal';
import { hashMPIN, compareMPIN } from '../utils/crypto';
import { AuthRequest } from '../middleware/auth';

// Get user profile
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ uniqueId: req.user?.uniqueId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        uniqueId: user.uniqueId,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isVerified: user.isVerified,
        verifiedAt: user.verifiedAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, address } = req.body;

    const user = await User.findOneAndUpdate(
      { uniqueId: req.user?.uniqueId },
      { fullName, address },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        uniqueId: user.uniqueId,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Change MPIN
export const changeMPIN = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentMPIN, newMPIN } = req.body;

    if (!currentMPIN || !newMPIN) {
      res.status(400).json({ error: 'Current and new MPIN are required' });
      return;
    }

    if (newMPIN.length !== 6 || !/^[0-9]{6}$/.test(newMPIN)) {
      res.status(400).json({ error: 'MPIN must be 6 digits' });
      return;
    }

    const user = await User.findOne({ uniqueId: req.user?.uniqueId }).select('+mpin');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current MPIN
    const isValidMPIN = await compareMPIN(currentMPIN, user.mpin);
    if (!isValidMPIN) {
      res.status(400).json({ error: 'Current MPIN is incorrect' });
      return;
    }

    // Hash and update new MPIN
    const hashedMPIN = await hashMPIN(newMPIN);
    user.mpin = hashedMPIN;
    await user.save();

    res.json({
      success: true,
      message: 'MPIN changed successfully',
    });
  } catch (error) {
    console.error('Change MPIN error:', error);
    res.status(500).json({ error: 'Failed to change MPIN' });
  }
};

// Get user statistics
export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uniqueId;

    const totalElectionVotes = await Vote.countDocuments({ userId });
    const totalProposalVotes = await ProposalVote.countDocuments({ userId });
    const activeElections = await Election.countDocuments({ 
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });
    const activeProposals = await Proposal.countDocuments({ 
      status: 'voting',
      endDate: { $gte: new Date() }
    });

    res.json({
      success: true,
      stats: {
        totalElectionVotes,
        totalProposalVotes,
        activeElections,
        activeProposals,
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Get user voting history
export const getVotingHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uniqueId;

    const electionVotes = await Vote.find({ userId })
      .sort({ votedAt: -1 })
      .limit(20);

    const proposalVotes = await ProposalVote.find({ userId })
      .sort({ votedAt: -1 })
      .limit(20);

    // Populate election details
    const electionHistory = await Promise.all(
      electionVotes.map(async (vote) => {
        const election = await Election.findById(vote.electionId);
        return {
          type: 'election',
          electionId: vote.electionId,
          electionTitle: election?.title,
          votedAt: vote.votedAt,
        };
      })
    );

    // Populate proposal details
    const proposalHistory = await Promise.all(
      proposalVotes.map(async (vote) => {
        const proposal = await Proposal.findById(vote.proposalId);
        return {
          type: 'proposal',
          proposalId: vote.proposalId,
          proposalTitle: proposal?.title,
          vote: vote.vote,
          votedAt: vote.votedAt,
        };
      })
    );

    const history = [...electionHistory, ...proposalHistory]
      .sort((a, b) => b.votedAt.getTime() - a.votedAt.getTime())
      .slice(0, 20);

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Get voting history error:', error);
    res.status(500).json({ error: 'Failed to fetch voting history' });
  }
};
