import { Request, Response } from 'express';
import { User } from '../models/User';
import { PendingUser } from '../models/PendingUser';
import { OTP } from '../models/OTP';
import { generateOTP, hashMPIN, compareMPIN, generateUniqueId } from '../utils/crypto';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// Request OTP for login
export const requestOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, uniqueId } = req.body;

    let user;
    let userPhone;

    // Check if uniqueId is provided (admin/EC login)
    if (uniqueId) {
      user = await User.findOne({ uniqueId });
      if (!user) {
        res.status(404).json({ error: 'User not found. Please check your unique ID.' });
        return;
      }
      userPhone = user.phone;
    } 
    // Otherwise use phone number (regular login)
    else if (phone) {
      if (!/^[0-9]{10}$/.test(phone)) {
        res.status(400).json({ error: 'Invalid phone number' });
        return;
      }
      user = await User.findOne({ phone });
      if (!user) {
        res.status(404).json({ error: 'User not found. Please register first.' });
        return;
      }
      userPhone = phone;
    } else {
      res.status(400).json({ error: 'Phone number or unique ID is required' });
      return;
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP to database using phone
    await OTP.findOneAndUpdate(
      { phone: userPhone },
      { otp, attempts: 0, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true }
    );

    // Send OTP via SMS
    const { sendOTPSMS } = await import('../utils/smsService');
    await sendOTPSMS(userPhone, otp);
    
    // Also send OTP via email if user has email
    if (user.email) {
      const { sendEmail } = await import('../utils/emailService');
      await sendEmail({
        to: user.email,
        subject: 'Your AGORA Login OTP',
        text: `Hello ${user.fullName},\n\nYour OTP for AGORA login is: ${otp}\n\nThis OTP is valid for 5 minutes.\n\nDo not share this OTP with anyone.\n\nRegards,\nAGORA Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">AGORA Login OTP</h2>
            <p>Hello <strong>${user.fullName}</strong>,</p>
            <p>Your OTP for AGORA login is:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #6B7280;">This OTP is valid for 5 minutes.</p>
            <p style="color: #DC2626; font-weight: bold;">⚠️ Do not share this OTP with anyone.</p>
          </div>
        `,
      });
    }

    console.log(`OTP sent to ${user.fullName} (${userPhone}): ${otp}`);

    res.json({ success: true, message: 'OTP sent successfully to your phone and email', phone: userPhone });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP and MPIN for login (can accept phone or uniqueId)
export const verifyOTPAndMPIN = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, uniqueId, otp, mpin } = req.body;

    if ((!phone && !uniqueId) || !otp || !mpin) {
      res.status(400).json({ error: 'Unique ID/Phone, OTP, and MPIN are required' });
      return;
    }

    // Find user by uniqueId or phone
    let user;
    let userPhone;

    if (uniqueId) {
      user = await User.findOne({ uniqueId }).select('+mpin');
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      userPhone = user.phone;
    } else {
      userPhone = phone;
      user = await User.findOne({ phone: userPhone }).select('+mpin');
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ phone: userPhone });
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
    await OTP.deleteOne({ phone: userPhone });

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

// Verify if user is authenticated
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

    res.json({
      success: true,
      user: {
        uniqueId: user.uniqueId,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify auth error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// Register new user (creates pending user)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, phone, email, aadhaar, address, age, voterId, role = 'voter' } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validate required fields
    if (!fullName || !phone || !aadhaar || !address || !age) {
      res.status(400).json({ error: 'All required fields must be provided' });
      return;
    }

    // Validate files
    if (!files || !files.aadhaarCard || !files.voterIdCard) {
      res.status(400).json({ error: 'Both Aadhaar Card and Voter ID Card PDFs are required' });
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

    // Create pending user with file paths
    const pendingUser = new PendingUser({
      fullName,
      phone,
      email,
      aadhaar,
      address,
      age: parseInt(age),
      voterIdNumber: voterId,
      aadhaarCardPath: files.aadhaarCard[0].path,
      voterIdCardPath: files.voterIdCard[0].path,
      role,
      status: 'pending',
    });

    await pendingUser.save();

    res.json({
      success: true,
      message: 'Registration submitted. Awaiting admin approval.',
      userId: pendingUser._id,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Issue ID proof (after verification by admin)
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
        issuedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Issue ID proof error:', error);
    res.status(500).json({ error: 'Failed to issue ID proof' });
  }
};
