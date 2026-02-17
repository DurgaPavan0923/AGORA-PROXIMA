import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changeMPIN,
  getUserStats,
  getVotingHistory,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/change-mpin', changeMPIN);
router.get('/stats', getUserStats);
router.get('/voting-history', getVotingHistory);

export default router;
