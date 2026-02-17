import mongoose, { Document, Schema } from 'mongoose';

export interface IPendingUser extends Document {
  fullName: string;
  phone: string;
  email?: string;
  aadhaar: string;
  address: string;
  age?: number;
  voterIdNumber?: string;
  uniqueVoterId?: string;
  role: 'user' | 'admin' | 'election_commission' | 'voter';
  status: 'pending' | 'verified' | 'rejected';
  uniqueId?: string;
  verifiedAt?: Date;
  // Document paths
  aadhaarCardPath?: string;
  voterIdCardPath?: string;
  // Blockchain fields
  blockchainTxHash?: string;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PendingUserSchema = new Schema<IPendingUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
    },
    aadhaar: {
      type: String,
      required: true,
      match: /^[0-9]{12}$/,
    },
    address: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    voterIdNumber: {
      type: String,
    },
    uniqueVoterId: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'election_commission', 'voter'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    uniqueId: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
    // Document paths
    aadhaarCardPath: {
      type: String,
    },
    voterIdCardPath: {
      type: String,
    },
    // Blockchain fields
    blockchainTxHash: {
      type: String,
    },
    walletAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PendingUserSchema.index({ phone: 1 });
PendingUserSchema.index({ status: 1 });
PendingUserSchema.index({ createdAt: -1 });

export const PendingUser = mongoose.model<IPendingUser>('PendingUser', PendingUserSchema);
