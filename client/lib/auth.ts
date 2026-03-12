// Authentication utilities and session management
import type { User, Session } from "./types"

export type UserRole = "user" | "admin" | "election_commission"

// Re-export User from canonical types
export type { User } from "./types"

// Mock session storage (in production, use database/JWT)
const sessions = new Map<string, Session>()

export function generateUniqueIdProof(): string {
  return `ID-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export function createSession(user: User, token: string): Session {
  const session: Session = {
    token,
    user,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  }
  sessions.set(token, session)
  return session
}

export function getSession(token: string): Session | null {
  const session = sessions.get(token)
  if (!session || new Date() > session.expiresAt) {
    sessions.delete(token)
    return null
  }
  return session
}

export function verifyUserRole(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  return roles.includes(userRole)
}
