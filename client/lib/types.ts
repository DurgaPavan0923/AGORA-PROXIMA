// Shared types for the application
export interface User {
  uniqueId: string
  fullName: string
  phone: string
  address?: string
  role: "user" | "admin" | "election_commission"
  isVerified: boolean
  verifiedAt?: Date
  createdAt: Date
}

export interface Session {
  token: string
  user: User
  createdAt: Date
  expiresAt: Date
}

export interface Election {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  status: "draft" | "active" | "closed" | "completed"
  parties: Party[]
  createdBy: string
  createdAt: Date
}

export interface Party {
  id: string
  name: string
  manifesto: string
  boucherUrl?: string
  voteCount: number
}

export interface Vote {
  id: string
  userId: string
  electionId: string
  partyId: string
  timestamp: Date
  blockchainHash: string
}

export interface VotingHistoryItem {
  type: 'election' | 'proposal'
  electionId?: string
  electionTitle?: string
  proposalId?: string
  proposalTitle?: string
  vote?: string
  votedAt: Date
}
