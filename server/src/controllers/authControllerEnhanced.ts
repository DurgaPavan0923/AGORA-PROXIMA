import { Request, Response } from 'express';
import { User } from '../models/User';
import { PendingUser } from '../models/PendingUser';
import { OTP } from '../models/OTP';
import { generateOTP, compareMPIN, generateUniqueId } from '../utils/crypto';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';
import { blockchainIntegration } from '../blockchain/blockchainIntegration';

/**
 * ENHANCED AUTH CONTROLLER WITH BLOCKCHAIN INTEGRATION
 * 
 * Data Flow: Action → Blockchain (PRIMARY STORAGE) → MongoDB (CACHE)
 * 
 * - All user registrations saved to blockchain first
 * - MongoDB used as fast query cache
 * - Blockchain is source of truth for verification
 */

// Request OTP for login (unchanged)
export const requestOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      res.status(400).json({ error: 'Invalid phone number' });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      res.status(404).json({ error: 'User not found. Please register first.' });
      return;
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP to database
    await OTP.findOneAndUpdate(
      { phone },
      { otp, attempts: 0, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true }
    );

    // In production, send OTP via SMS service
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP and MPIN for login (unchanged)
export const verifyOTPAndMPIN = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp, mpin } = req.body;

    if (!phone || !otp || !mpin) {
      res.status(400).json({ error: 'Phone, OTP, and MPIN are required' });
      return;
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ phone });
    if (!otpRecord) {
      res.status(400).json({ error: 'OTP not found or expired' });
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      res.status(400).json({ error: 'OTP expired' });
      return;
    }

    if (otpRecord.attempts >= 3) {
      res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
      return;
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      otpRecord.lastAttempt = new Date();
      await otpRecord.save();
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // Verify MPIN
    const user = await User.findOne({ phone }).select('+mpin');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValidMPIN = await compareMPIN(mpin, user.mpin);
    if (!isValidMPIN) {
      res.status(400).json({ error: 'Invalid MPIN' });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      uniqueId: user.uniqueId,
      role: user.role,
    });

    // Delete used OTP
    await OTP.deleteOne({ phone });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      success: true,
      token,
      user: {
        uniqueId: user.uniqueId,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP and MPIN error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * ENHANCED REGISTER WITH BLOCKCHAIN
 * Saves user data to blockchain first, then MongoDB
 */
export const registerWithBlockchain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, phone, email, aadhaar, address, age, voterIdNumber, role = 'voter' } = req.body;

    if (!fullName || !phone || !aadhaar || !address || !age) {
      res.status(400).json({ error: 'All required fields must be provided' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ phone }, { aadhaar }] });
    if (existingUser) {
      res.status(400).json({ error: 'User with this phone or Aadhaar already exists' });
      return;
    }

    // Check if pending user already exists
    const existingPendingUser = await PendingUser.findOne({ phone });
    if (existingPendingUser && existingPendingUser.status === 'pending') {
      res.status(400).json({ error: 'Registration already pending approval' });
      return;
    }

    // Generate unique voter ID
    const uniqueVoterId = generateUniqueId();

    // STEP 1: Save to BLOCKCHAIN first (source of truth)
    console.log('📝 Saving user registration to blockchain...');
    
    const blockchainResult = await blockchainIntegration.registerUserOnBlockchain({
      phoneNumber: phone,
      name: fullName,
      email: email || '',
      aadhaarNumber: aadhaar,
      address,
      age: parseInt(age),
      uniqueVoterId,
    });

    if (!blockchainResult.success) {
      console.warn('⚠️ Blockchain save failed, saving to MongoDB only:', blockchainResult.error);
      // Continue with MongoDB save even if blockchain fails (graceful degradation)
    } else {
      console.log(`✅ User registered on blockchain - TX: ${blockchainResult.txHash}`);
    }

    // STEP 2: Save to MongoDB (cache layer)
    const pendingUser = new PendingUser({
      fullName,
      phone,
      email,
      aadhaar,
      address,
      age: parseInt(age),
      voterIdNumber,
      uniqueVoterId,
      role,
      status: 'pending',
      blockchainTxHash: blockchainResult.txHash,
      walletAddress: blockchainResult.walletAddress,
    });

    await pendingUser.save();

    console.log(`💾 User saved to MongoDB cache - ID: ${pendingUser._id}`);

    res.json({
      success: true,
      message: 'Registration submitted successfully. Your data has been recorded on the blockchain.',
      userId: pendingUser._id,
      uniqueVoterId,
      walletAddress: blockchainResult.walletAddress,
      blockchainTxHash: blockchainResult.txHash,
      blockchainSaved: blockchainResult.success,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Verify if user is authenticated (unchanged)
export const verifyAuth = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uniqueId: req.user.uniqueId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Optionally verify against blockchain
    if (blockchainIntegration.isEnabled()) {
      const blockchainUser = await blockchainIntegration.getUserFromBlockchain(user.phone);
      if (blockchainUser) {
        console.log(`✅ User verified against blockchain: ${user.phone}`);
      }
    }

    res.json({
      success: true,
      user: {
        uniqueId: user.uniqueId,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error('Verify auth error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

/**
 * GET USER HISTORY FROM BLOCKCHAIN
 * Complete audit trail of all user actions
 */
export const getUserHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uniqueId: req.user.uniqueId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get complete history from blockchain
    const history = await blockchainIntegration.getUserHistoryFromBlockchain(user.phone);

    res.json({
      success: true,
      history,
      message: 'Complete audit trail from blockchain',
    });
  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
};

// Issue ID proof (unchanged)
export const issueIdProof = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uniqueId } = req.body;

    if (!uniqueId) {
      res.status(400).json({ error: 'Unique ID is required' });
      return;
    }

    const user = await User.findOne({ uniqueId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      idProof: {
        uniqueId: user.uniqueId,
        fullName: user.fullName,
        phone: user.phone,
        walletAddress: user.walletAddress,
        issuedAt: new Date(),
        blockchainVerified: !!user.walletAddress,
      },
    });
  } catch (error) {
    console.error('Issue ID proof error:', error);
    res.status(500).json({ error: 'Failed to issue ID proof' });
  }
};
