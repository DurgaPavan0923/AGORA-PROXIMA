"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStatistics } from "@/components/admin-statistics"
import { AdminUserManagement } from "@/components/admin-user-management"
import { AdminElectionEditor } from "@/components/admin-election-editor"
import { AdminPendingUsers } from "@/components/admin-pending-users"
import { LogOut, BarChart3, Users, Edit, Shield, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          window.location.href = "/auth"
          return
        }

        const data = await response.json()
        
        if (!data.user) {
          window.location.href = "/auth"
          return
        }
        
        // Check if user is admin
        if (data.user.role !== "admin") {
          console.log("Not admin, redirecting")
          window.location.href = "/dashboard"
          return
        }

        setUser(data.user)
        setLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        window.location.href = "/auth"
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      // Clear cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      window.location.href = "/auth"
    } catch (error) {
      console.error("Logout error:", error)
      window.location.href = "/auth"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.fullName || "Admin"}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Pending</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Statistics</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="elections" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              <span>Elections</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <AdminPendingUsers />
          </TabsContent>

          <TabsContent value="stats" className="mt-6 space-y-6">
            <AdminStatistics />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="elections" className="mt-6">
            <AdminElectionEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
