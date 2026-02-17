import { Response } from 'express';
import { User } from '../models/User';
import { PendingUser } from '../models/PendingUser';
import { Election } from '../models/Election';
import { Vote } from '../models/Vote';
import { Proposal } from '../models/Proposal';
import { generateUniqueId, hashMPIN } from '../utils/crypto';
import { generateWallet } from '../blockchain/web3Config';
import { sbtService } from '../blockchain/sbtService';
import { AuthRequest } from '../middleware/auth';

// Get all pending users
export const getPendingUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pendingUsers = await PendingUser.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ success: true, pendingUsers });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
};

// Verify and approve pending user
export const verifyUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, mpin } = req.body;

    if (!userId || !mpin) {
      res.status(400).json({ error: 'User ID and MPIN are required' });
      return;
    }

    const pendingUser = await PendingUser.findById(userId);
    if (!pendingUser) {
      res.status(404).json({ error: 'Pending user not found' });
      return;
    }

    if (pendingUser.status !== 'pending') {
      res.status(400).json({ error: 'User already processed' });
      return;
    }

    // Generate unique ID based on role
    const uniqueId = generateUniqueId(pendingUser.role);

    // Hash MPIN
    const hashedMPIN = await hashMPIN(mpin);

    // Generate blockchain wallet for user
    const wallet = generateWallet();

    // Create verified user
    const user = new User({
      uniqueId,
      fullName: pendingUser.fullName,
      phone: pendingUser.phone,
      email: pendingUser.email,
      aadhaar: pendingUser.aadhaar,
      address: pendingUser.address,
      role: pendingUser.role,
      mpin: hashedMPIN,
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: req.user?.uniqueId,
      walletAddress: wallet.address,
      encryptedPrivateKey: wallet.privateKey, // In production, encrypt this!
    });

    await user.save();

    // Issue SBT token on blockchain
    try {
      const sbtResult = await sbtService.issueSBT(
        wallet.address,
        uniqueId,
        pendingUser.fullName
      );
      
      if (sbtResult.success) {
        user.sbtTokenId = sbtResult.tokenId;
        await user.save();
        console.log(`✅ SBT issued for user ${uniqueId}: Token ID ${sbtResult.tokenId}`);
      } else {
        console.warn(`⚠️ Failed to issue SBT for user ${uniqueId}: ${sbtResult.error}`);
      }
    } catch (error) {
      console.error('Error issuing SBT:', error);
      // Continue even if blockchain fails - user is still verified in DB
    }

    // Update pending user status
    pendingUser.status = 'verified';
    pendingUser.uniqueId = uniqueId;
    pendingUser.verifiedAt = new Date();
    await pendingUser.save();

    // Send unique ID via SMS
    try {
      const { sendSMS } = await import('../utils/smsService');
      await sendSMS({
        phone: user.phone,
        message: `Hello ${user.fullName}, Welcome to AGORA! Your account is approved. Unique ID: ${uniqueId}, MPIN: ${mpin}. Keep them secure. Login at ${process.env.CLIENT_URL || 'http://localhost:3000'} - AGORA Team`,
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }

    // Send unique ID via email if available
    if (user.email) {
      try {
        const { sendUniqueIdEmail } = await import('../utils/emailService');
        await sendUniqueIdEmail(user.email, user.fullName, uniqueId);
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    res.json({
      success: true,
      message: 'User verified successfully. Credentials sent via SMS and email.',
      user: {
        uniqueId: user.uniqueId,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
};

// Reject pending user
export const rejectUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, reason } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const pendingUser = await PendingUser.findById(userId);
    if (!pendingUser) {
      res.status(404).json({ error: 'Pending user not found' });
      return;
    }

    pendingUser.status = 'rejected';
    pendingUser.rejectionReason = reason || 'Document verification failed';
    await pendingUser.save();

    // Send rejection notification via SMS
    try {
      const { sendSMS } = await import('../utils/smsService');
      await sendSMS({
        phone: pendingUser.phone,
        message: `Hello ${pendingUser.fullName}, Your AGORA registration needs review. Reason: ${reason || 'Document verification failed'}. Please contact support or reapply. - AGORA Team`,
      });
    } catch (error) {
      console.error('Failed to send rejection SMS:', error);
    }

    // Send rejection notification via email if available
    if (pendingUser.email) {
      try {
        const { sendRejectionEmail } = await import('../utils/emailService');
        await sendRejectionEmail(pendingUser.email, pendingUser.fullName, reason || 'Document verification failed');
      } catch (error) {
        console.error('Failed to send rejection email:', error);
      }
    }

    res.json({ success: true, message: 'User rejected. Notification sent via SMS and email.' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
};

// Create election commission user
export const createElectionCommission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, phone, aadhaar, address, mpin } = req.body;

    if (!fullName || !phone || !aadhaar || !address || !mpin) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ phone }, { aadhaar }] });
    if (existingUser) {
      res.status(400).json({ error: 'User with this phone or Aadhaar already exists' });
      return;
    }

    const uniqueId = generateUniqueId('election_commission');
    const hashedMPIN = await hashMPIN(mpin);

    const user = new User({
      uniqueId,
      fullName,
      phone,
      aadhaar,
      address,
      role: 'election_commission',
      mpin: hashedMPIN,
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: req.user?.uniqueId,
    });

    await user.save();

    res.json({
      success: true,
      message: 'Election commission user created',
      user: {
        uniqueId: user.uniqueId,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Create election commission error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Get admin statistics
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ isVerified: true });
    const pendingUsers = await PendingUser.countDocuments({ status: 'pending' });
    const totalElections = await Election.countDocuments();
    const activeElections = await Election.countDocuments({ status: 'active' });
    const totalVotes = await Vote.countDocuments();
    const totalProposals = await Proposal.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        pendingUsers,
        totalElections,
        activeElections,
        totalVotes,
        totalProposals,
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
