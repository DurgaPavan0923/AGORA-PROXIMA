import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  lastAttempt?: Date;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    otp: {
      type: String,
      required: true,
      match: /^[0-9]{6}$/,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastAttempt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
OTPSchema.index({ phone: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired OTPs

export const OTP = mongoose.model<IOTP>('OTP', OTPSchema);
