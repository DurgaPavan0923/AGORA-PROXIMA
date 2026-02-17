import mongoose, { Document, Schema } from 'mongoose';

export interface IParty {
  id: string;
  name: string;
  symbol: string;
  manifesto?: string;
}

export interface IElection extends Document {
  title: string;
  description: string;
  type: 'national' | 'state' | 'local';
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'upcoming';
  parties: IParty[];
  totalVotes?: number;
  createdBy: string;
  // Blockchain fields
  blockchainElectionId?: string;
  blockchainTxHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PartySchema = new Schema<IParty>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  manifesto: { type: String },
});

const ElectionSchema = new Schema<IElection>(
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
    type: {
      type: String,
      enum: ['national', 'state', 'local'],
      default: 'local',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled', 'upcoming'],
      default: 'draft',
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    parties: {
      type: [PartySchema],
      default: [],
    },
    createdBy: {
      type: String,
      required: true,
    },
    // Blockchain fields
    blockchainElectionId: {
      type: String,
    },
    blockchainTxHash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ElectionSchema.index({ status: 1 });
ElectionSchema.index({ startDate: 1, endDate: 1 });
ElectionSchema.index({ createdAt: -1 });

export const Election = mongoose.model<IElection>('Election', ElectionSchema);
