"use client"

import { useState, useEffect } from "react"
import { UserProfileEditor } from "@/components/user-profile-editor"
import { UserVotingHistory } from "@/components/user-voting-history"
import { ActiveElectionsUser } from "@/components/active-elections-user"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Settings, BarChart3, Vote, User, Home, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { api, TokenManager } from "@/lib/api"
import type { User as UserType } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function UserDashboard() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      // Use Next.js API route (same-origin, has cookie) instead of direct backend call
      const res = await fetch('/api/auth/verify', { credentials: 'include' })
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth')
          return
        }
        throw new Error('Failed to load profile')
      }
      const data = await res.json()
      setUser(data.user)
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handleLogout = () => {
    TokenManager.removeToken()
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative z-10 bg-[#0C2340] border-b border-[#1B3A5C] sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#FF9933] p-2 rounded-lg">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                AGORA
              </span>
            </Link>
            <div className="hidden md:block h-6 w-px bg-white/20"></div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-white">Citizen Portal</h1>
              <p className="text-xs text-blue-200">Digital Voting Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-[#FF9933] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.fullName}</p>
                  <p className="text-xs text-blue-200">{user.phone}</p>
                </div>
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-white/20 hover:border-white/40 hover:bg-white/5 bg-transparent text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <Loader2 className="w-12 h-12 text-[#0C2340] animate-spin mx-auto" />
              <p className="text-gray-500">Loading your profile...</p>
            </motion.div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-lg max-w-md text-center"
            >
              <p className="mb-4">{error}</p>
              <Button onClick={fetchUserProfile} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                Try Again
              </Button>
            </motion.div>
          </div>
        ) : user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="elections" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 p-1 shadow-sm">
                <TabsTrigger 
                  value="elections" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#0C2340] data-[state=active]:text-white text-gray-600"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Elections</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#0C2340] data-[state=active]:text-white text-gray-600"
                >
                  <span>History</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#0C2340] data-[state=active]:text-white text-gray-600"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="elections" className="mt-6">
                <ActiveElectionsUser />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <UserVotingHistory />
              </TabsContent>

              <TabsContent value="profile" className="mt-6">
                <UserProfileEditor user={user} onRefresh={fetchUserProfile} />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>

    </div>
  )
}
