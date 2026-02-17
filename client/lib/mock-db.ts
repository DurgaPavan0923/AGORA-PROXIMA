// Mock database for development/hackathon
import type { User, Election, Vote } from "./types"

export interface PendingUser {
  id: string
  fullName: string
  phone: string
  aadhaar: string
  address: string
  role: "user" | "admin" | "election_commission"
  status: "pending" | "verified" | "rejected"
  createdAt: Date
  verifiedAt?: Date
  uniqueId?: string
}

export interface OTPRecord {
  phone: string
  otp: string
  expiresAt: Date
  attempts: number
  lastAttempt?: Date
}

export class MockDatabase {
  private users: Map<string, User> = new Map()
  private elections: Map<string, Election> = new Map()
  private votes: Map<string, Vote> = new Map()
  private pendingUsers: Map<string, PendingUser> = new Map()
  private otpRecords: Map<string, OTPRecord> = new Map()
  private mpinMap: Map<string, string> = new Map() // uniqueId -> MPIN
  private userSessions: Map<string, { uniqueId: string; role: string; expiresAt: Date }> = new Map()
  private idProofs: Map<string, { user: Partial<User>; issued: Date }> = new Map()

  // Users
  createUser(user: User): User {
    this.users.set(user.id, user)
    return user
  }

  getUser(id: string): User | null {
    return this.users.get(id) || null
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.users.get(id)
    if (!user) return null
    const updated = { ...user, ...updates }
    this.users.set(id, updated)
    return updated
  }

  // Elections
  createElection(election: Election): Election {
    this.elections.set(election.id, election)
    return election
  }

  getElection(id: string): Election | null {
    return this.elections.get(id) || null
  }

  getAllElections(): Election[] {
    return Array.from(this.elections.values())
  }

  updateElection(id: string, updates: Partial<Election>): Election | null {
    const election = this.elections.get(id)
    if (!election) return null
    const updated = { ...election, ...updates }
    this.elections.set(id, updated)
    return updated
  }

  // Votes
  addVote(vote: Vote): Vote {
    this.votes.set(vote.id, vote)
    return vote
  }

  getVotesByElection(electionId: string): Vote[] {
    return Array.from(this.votes.values()).filter((v) => v.electionId === electionId)
  }

  // ID Proofs
  issueIdProof(uniqueIdProof: string, user: Partial<User>): void {
    this.idProofs.set(uniqueIdProof, {
      user,
      issued: new Date(),
    })
  }

  verifyIdProof(uniqueIdProof: string): Partial<User> | null {
    const proof = this.idProofs.get(uniqueIdProof)
    return proof ? proof.user : null
  }

  // Pending User Management
  createPendingUser(pendingUser: PendingUser): PendingUser {
    this.pendingUsers.set(pendingUser.id, pendingUser)
    return pendingUser
  }

  getPendingUser(id: string): PendingUser | null {
    return this.pendingUsers.get(id) || null
  }

  getAllPendingUsers(): PendingUser[] {
    return Array.from(this.pendingUsers.values())
  }

  verifyPendingUser(id: string, uniqueId: string): PendingUser | null {
    const user = this.pendingUsers.get(id)
    if (!user) return null
    const verified: PendingUser = {
      ...user,
      status: "verified",
      uniqueId,
      verifiedAt: new Date(),
    }
    this.pendingUsers.set(id, verified)
    return verified
  }

  rejectPendingUser(id: string): PendingUser | null {
    const user = this.pendingUsers.get(id)
    if (!user) return null
    const rejected: PendingUser = { ...user, status: "rejected" }
    this.pendingUsers.set(id, rejected)
    return rejected
  }

  // OTP Management
  generateOTP(phone: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    this.otpRecords.set(phone, {
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0,
    })
    return otp
  }

  verifyOTP(phone: string, otp: string): boolean {
    const record = this.otpRecords.get(phone)
    if (!record) return false
    if (record.expiresAt < new Date()) return false
    if (record.attempts >= 3) return false
    if (record.otp !== otp) {
      record.attempts++
      record.lastAttempt = new Date()
      return false
    }
    return true
  }

  // MPIN Management
  setMPIN(uniqueId: string, mpin: string): void {
    // In production, encrypt the MPIN
    this.mpinMap.set(uniqueId, mpin)
  }

  verifyMPIN(uniqueId: string, mpin: string): boolean {
    return this.mpinMap.get(uniqueId) === mpin
  }

  // Session Management
  createSession(uniqueId: string, role: string): string {
    const sessionToken = `session-${Math.random().toString(36).substr(2, 20)}`
    this.userSessions.set(sessionToken, {
      uniqueId,
      role,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })
    return sessionToken
  }

  getSession(token: string): { uniqueId: string; role: string } | null {
    const session = this.userSessions.get(token)
    if (!session || session.expiresAt < new Date()) return null
    return { uniqueId: session.uniqueId, role: session.role }
  }

  getUserByUniqueId(uniqueId: string): User | null {
    for (const user of this.users.values()) {
      if (user.uniqueId === uniqueId) return user
    }
    return null
  }
}

export const mockDb = new MockDatabase()
