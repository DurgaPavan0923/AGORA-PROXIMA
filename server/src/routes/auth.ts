import { Router } from 'express';
import {
  requestOTP,
  verifyOTPAndMPIN,
  verifyAuth,
  register,
  issueIdProof,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { registrationUpload } from '../middleware/upload';

const router = Router();

router.post('/request-otp', requestOTP);
router.post('/verify-otp-mpin', verifyOTPAndMPIN);
router.post('/register', registrationUpload, register);
router.get('/verify', authenticate, verifyAuth);
router.post('/id-proof', authenticate, issueIdProof);

export default router;
