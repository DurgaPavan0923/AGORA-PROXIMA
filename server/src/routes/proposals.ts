import { Router } from 'express';
import {
  getAllProposals,
  getProposalById,
  createProposal,
  voteOnProposal,
  checkUserVoted,
  updateProposalStatus,
} from '../controllers/proposalController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllProposals);
router.get('/:id', getProposalById);

// Protected routes - require authentication
router.post('/', authenticate, createProposal);
router.post('/:id/vote', authenticate, voteOnProposal);
router.get('/:id/check-voted', authenticate, checkUserVoted);
router.put('/:id/status', authenticate, requireRole('admin', 'election_commission'), updateProposalStatus);

export default router;
