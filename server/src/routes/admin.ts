import { Router } from 'express';
import {
  getPendingUsers,
  verifyUser,
  rejectUser,
  createElectionCommission,
  getAdminStats,
} from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole('admin'));

router.get('/pending-users', getPendingUsers);
router.post('/verify-user', verifyUser);
router.post('/reject-user', rejectUser);
router.post('/create-election-commission', createElectionCommission);
router.get('/stats', getAdminStats);

export default router;
