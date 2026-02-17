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
      const response = await api.user.getProfile()
      setUser(response.user)
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
      // If unauthorized, redirect to auth
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        router.push('/auth')
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AGORA
              </span>
            </Link>
            <div className="hidden md:block h-6 w-px bg-white/20"></div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-white">Citizen Portal</h1>
              <p className="text-xs text-gray-400">Blockchain-Powered Voting</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.fullName}</p>
                  <p className="text-xs text-gray-400">{user.phone}</p>
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
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
              <p className="text-gray-400">Loading your profile...</p>
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
              <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-xl border border-white/10 p-1">
                <TabsTrigger 
                  value="elections" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Elections</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
                >
                  <span>History</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
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

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 10px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
