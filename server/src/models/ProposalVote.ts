import mongoose, { Document, Schema } from 'mongoose';

export interface IProposalVote extends Document {
  proposalId: string;
  userId: string;
  vote: 'yes' | 'no' | 'abstain';
  votedAt: Date;
  createdAt: Date;
}

const ProposalVoteSchema = new Schema<IProposalVote>(
  {
    proposalId: {
      type: String,
      required: true,
      ref: 'Proposal',
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    vote: {
      type: String,
      enum: ['yes', 'no', 'abstain'],
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

// Compound index to ensure one vote per user per proposal
ProposalVoteSchema.index({ proposalId: 1, userId: 1 }, { unique: true });
ProposalVoteSchema.index({ proposalId: 1 });
ProposalVoteSchema.index({ userId: 1 });

export const ProposalVote = mongoose.model<IProposalVote>('ProposalVote', ProposalVoteSchema);
