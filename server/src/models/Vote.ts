import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  electionId: string;
  userId: string;
  partyId: string;
  votedAt: Date;
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    electionId: {
      type: String,
      required: true,
      ref: 'Election',
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    partyId: {
      type: String,
      required: true,
    },
    votedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one vote per user per election
VoteSchema.index({ electionId: 1, userId: 1 }, { unique: true });
VoteSchema.index({ electionId: 1 });
VoteSchema.index({ userId: 1 });

export const Vote = mongoose.model<IVote>('Vote', VoteSchema);
