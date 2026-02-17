import { Router } from 'express';
import {
  getAllElections,
  getElectionById,
  createElection,
  updateElection,
  voteInElection,
  checkUserVoted,
  deleteElection,
  getElectionWinner,
} from '../controllers/electionController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllElections);
router.get('/:id', getElectionById);
router.get('/:id/winner', getElectionWinner);

// Protected routes - require authentication
router.post('/', authenticate, requireRole('election_commission', 'admin'), createElection);
router.put('/:id', authenticate, requireRole('election_commission', 'admin'), updateElection);
router.delete('/:id', authenticate, requireRole('election_commission', 'admin'), deleteElection);
router.post('/:id/vote', authenticate, voteInElection);
router.get('/:id/check-voted', authenticate, checkUserVoted);

export default router;
