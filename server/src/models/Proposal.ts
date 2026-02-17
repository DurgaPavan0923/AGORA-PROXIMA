import mongoose, { Document, Schema } from 'mongoose';

export interface IProposalVote {
  yes: number;
  no: number;
  abstain: number;
}

export interface IProposal extends Document {
  title: string;
  description: string;
  area: string;
  category: string;
  status: 'draft' | 'voting' | 'approved' | 'rejected' | 'implemented';
  votes: IProposalVote;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProposalVoteSchema = new Schema<IProposalVote>({
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  abstain: { type: Number, default: 0 },
});

const ProposalSchema = new Schema<IProposal>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'voting', 'approved', 'rejected', 'implemented'],
      default: 'draft',
    },
    votes: {
      type: ProposalVoteSchema,
      default: { yes: 0, no: 0, abstain: 0 },
    },
    endDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProposalSchema.index({ status: 1 });
ProposalSchema.index({ category: 1 });
ProposalSchema.index({ area: 1 });
ProposalSchema.index({ endDate: 1 });
ProposalSchema.index({ createdAt: -1 });

export const Proposal = mongoose.model<IProposal>('Proposal', ProposalSchema);
