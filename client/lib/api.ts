// API Client for Agora Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface RequestOptions extends RequestInit {
  data?: any
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Token management utilities
export const TokenManager = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('token', token)
  },

  removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
  },
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { data, ...customConfig } = options
    const token = TokenManager.getToken()

    const config: RequestInit = {
      method: data ? 'POST' : 'GET',
      ...customConfig,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...customConfig.headers,
      },
      credentials: 'include', // Important for cookies/JWT
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      
      // Handle unauthorized - redirect to login
      if (response.status === 401) {
        TokenManager.removeToken()
        if (typeof window !== 'undefined') {
          window.location.href = '/auth'
        }
        throw new Error('Unauthorized - Please login again')
      }

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'API Error')
      }

      return responseData
    } catch (error: any) {
      throw new Error(error.message || 'Network error')
    }
  }

  // Auth endpoints
  auth = {
    requestOTP: (phoneNumber: string) =>
      this.request('/auth/request-otp', {
        data: { phoneNumber },
      }),

    verifyOTPAndMPIN: (phoneNumber: string, otp: string, mpin: string) =>
      this.request('/auth/verify-otp-mpin', {
        data: { phoneNumber, otp, mpin },
      }),

    register: async (userData: FormData) => {
      // For file uploads, use FormData instead of JSON
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        body: userData,
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }
      return data
    },

    verifyAuth: () => this.request('/auth/verify'),

    logout: () =>
      this.request('/auth/logout', {
        method: 'POST',
      }),

    createMPIN: (mpin: string) =>
      this.request('/auth/create-mpin', {
        data: { mpin },
      }),

    verifyMPIN: (mpin: string) =>
      this.request('/auth/verify-mpin', {
        data: { mpin },
      }),

    changeMPIN: (oldMpin: string, newMpin: string) =>
      this.request('/auth/change-mpin', {
        data: { oldMpin, newMpin },
      }),

    checkMPIN: () => this.request('/auth/check-mpin'),
  }

  // Admin endpoints
  admin = {
    getPendingUsers: () => this.request('/admin/pending-users'),

    verifyUser: (userId: string) =>
      this.request('/admin/verify-user', {
        data: { userId },
      }),

    rejectUser: (userId: string, reason: string) =>
      this.request('/admin/reject-user', {
        data: { userId, reason },
      }),

    getStats: () => this.request('/admin/stats'),

    createElectionCommission: (userData: any) =>
      this.request('/admin/create-election-commission', {
        data: userData,
      }),

    getAllUsers: () => this.request('/admin/users'),

    getUserById: (userId: string) => this.request(`/admin/users/${userId}`),
  }

  // Election endpoints
  elections = {
    getAll: () => this.request('/elections'),

    getById: (id: string) => this.request(`/elections/${id}`),

    create: (electionData: any) =>
      this.request('/elections', {
        data: electionData,
      }),

    update: (id: string, electionData: any) =>
      this.request(`/elections/${id}`, {
        method: 'PUT',
        data: electionData,
      }),

    delete: (id: string) =>
      this.request(`/elections/${id}`, {
        method: 'DELETE',
      }),

    vote: (id: string, partyId: string) =>
      this.request(`/elections/${id}/vote`, {
        data: { partyId },
      }),

    checkVoted: (id: string) => this.request(`/elections/${id}/check-voted`),

    getResults: (id: string) => this.request(`/elections/${id}/results`),
  }

  // User endpoints
  user = {
    getProfile: () => this.request('/user/profile'),

    updateProfile: (profileData: any) =>
      this.request('/user/profile', {
        method: 'PUT',
        data: profileData,
      }),

    changeMPIN: (currentMPIN: string, newMPIN: string) =>
      this.request('/user/change-mpin', {
        method: 'POST',
        data: { currentMPIN, newMPIN },
      }),

    getStats: () => this.request('/user/stats'),

    getElections: () => this.request('/user/elections'),

    getVotingHistory: () => this.request('/user/voting-history'),

    getVoterCard: () => this.request('/user/voter-card'),
  }

  // Proposals endpoints
  proposals = {
    getAll: () => this.request('/proposals'),

    getById: (id: string) => this.request(`/proposals/${id}`),

    create: (proposalData: any) =>
      this.request('/proposals', {
        data: proposalData,
      }),

    vote: (id: string, voteType: 'for' | 'against') =>
      this.request(`/proposals/${id}/vote`, {
        data: { voteType },
      }),

    getResults: (id: string) => this.request(`/proposals/${id}/results`),
  }
}

export const api = new APIClient(API_URL)

// Type definitions for API responses
export interface User {
  _id: string
  name: string
  phoneNumber: string
  email?: string
  age: number
  address: string
  aadhaarNumber: string
  voterIdNumber: string
  uniqueVoterId?: string
  role: 'voter' | 'admin' | 'electionCommission'
  isVerified: boolean
  hasMpin: boolean
  aadhaarCardUrl?: string
  voterIdCardUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Election {
  _id: string
  title: string
  description: string
  type: 'national' | 'state' | 'local'
  startDate: string
  endDate: string
  status: 'upcoming' | 'active' | 'completed'
  parties: Party[]
  totalVotes: number
  results?: ElectionResult[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Party {
  name: string
  symbol: string
  manifesto: string
  votes?: number
}

export interface ElectionResult {
  partyIndex: number
  votes: number
  percentage: number
}

export interface Proposal {
  _id: string
  title: string
  description: string
  category: string
  proposedBy: string
  status: 'active' | 'passed' | 'rejected'
  votesFor: number
  votesAgainst: number
  deadline: string
  createdAt: string
  updatedAt: string
}

export interface VotingHistory {
  electionId: string
  electionTitle: string
  votedAt: string
  transactionHash?: string
}
