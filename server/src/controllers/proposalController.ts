import { Request, Response } from 'express';
import { Proposal } from '../models/Proposal';
import { ProposalVote } from '../models/ProposalVote';
import { AuthRequest } from '../middleware/auth';

// Get all proposals
export const getAllProposals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, category, area } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (area) filter.area = area;

    const proposals = await Proposal.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, proposals });
  } catch (error) {
    console.error('Get proposals error:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
};

// Get proposal by ID
export const getProposalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    const totalVoters = await ProposalVote.countDocuments({ proposalId: id });
    const daysLeft = Math.ceil((proposal.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const participation = totalVoters > 0 ? Math.round((totalVoters / 1000) * 100) : 0; // Mock calculation

    res.json({
      success: true,
      proposal: {
        ...proposal.toObject(),
        totalVoters,
        daysLeft: Math.max(0, daysLeft),
        participation,
      },
    });
  } catch (error) {
    console.error('Get proposal error:', error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
};

// Create proposal
export const createProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, area, category, endDate } = req.body;

    if (!title || !description || !area || !category || !endDate) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const proposal = new Proposal({
      title,
      description,
      area,
      category,
      status: 'voting',
      endDate: new Date(endDate),
      createdBy: req.user?.uniqueId,
    });

    await proposal.save();

    res.json({
      success: true,
      message: 'Proposal created successfully',
      proposal,
    });
  } catch (error) {
    console.error('Create proposal error:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
};

// Vote on proposal
export const voteOnProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { vote } = req.body;

    if (!vote || !['yes', 'no', 'abstain'].includes(vote)) {
      res.status(400).json({ error: 'Valid vote (yes/no/abstain) is required' });
      return;
    }

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    // Check if proposal is open for voting
    if (proposal.status !== 'voting') {
      res.status(400).json({ error: 'Proposal is not open for voting' });
      return;
    }

    // Check if proposal has expired
    if (new Date() > proposal.endDate) {
      res.status(400).json({ error: 'Proposal voting period has ended' });
      return;
    }

    // Check if user already voted
    const existingVote = await ProposalVote.findOne({
      proposalId: id,
      userId: req.user?.uniqueId,
    });

    if (existingVote) {
      res.status(400).json({ error: 'You have already voted on this proposal' });
      return;
    }

    // Create vote and atomically update proposal count
    const proposalVote = new ProposalVote({
      proposalId: id,
      userId: req.user?.uniqueId,
      vote,
      votedAt: new Date(),
    });

    await proposalVote.save();

    // Use atomic $inc to prevent race conditions on vote counts
    await Proposal.findByIdAndUpdate(id, { $inc: { [`votes.${vote}`]: 1 } });

    res.json({
      success: true,
      message: 'Vote recorded successfully',
    });
  } catch (error) {
    console.error('Vote on proposal error:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
};

// Check if user has voted on proposal
export const checkUserVoted = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const vote = await ProposalVote.findOne({
      proposalId: id,
      userId: req.user?.uniqueId,
    });

    res.json({
      success: true,
      hasVoted: !!vote,
      userVote: vote?.vote || null,
    });
  } catch (error) {
    console.error('Check voted error:', error);
    res.status(500).json({ error: 'Failed to check vote status' });
  }
};

// Update proposal status
export const updateProposalStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    const proposal = await Proposal.findByIdAndUpdate(id, { status }, { new: true });

    if (!proposal) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Proposal status updated',
      proposal,
    });
  } catch (error) {
    console.error('Update proposal status error:', error);
    res.status(500).json({ error: 'Failed to update proposal status' });
  }
};
