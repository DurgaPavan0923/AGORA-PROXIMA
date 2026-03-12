import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  uniqueId: string;
  fullName: string;
  phone: string;
  email?: string;
  aadhaar: string;
  address: string;
  role: 'user' | 'admin' | 'election_commission' | 'voter';
  mpin: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  // Blockchain fields
  walletAddress?: string;
  did?: string; // Decentralized ID
  sbtTokenId?: string; // Soulbound Token ID
  encryptedPrivateKey?: string; // Encrypted wallet private key (optional)
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    aadhaar: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{12}$/,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'election_commission', 'voter'],
      default: 'user',
    },
    mpin: {
      type: String,
      required: true,
      select: false, // Don't include by default in queries
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: String,
    },
    // Blockchain fields
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
    },
    did: {
      type: String,
      unique: true,
      sparse: true,
    },
    sbtTokenId: {
      type: String,
    },
    encryptedPrivateKey: {
      type: String,
      select: false, // Don't include by default
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
UserSchema.index({ isVerified: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
