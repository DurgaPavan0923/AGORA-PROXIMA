"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    const redirectToDashboard = async () => {
      try {
        console.log("[Dashboard] Fetching user data...")
        
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        })

        console.log("[Dashboard] Status:", response.status)

        if (!response.ok) {
          console.log("[Dashboard] Not authenticated, redirecting to login")
          window.location.href = "/auth"
          return
        }

        const data = await response.json()
        console.log("[Dashboard] User data:", data)
        
        const role = data.user?.role
        console.log("[Dashboard] User role:", role)

        // Redirect based on role
        if (role === "admin") {
          console.log("[Dashboard] Redirecting to admin dashboard")
          window.location.href = "/dashboard/admin"
        } else if (role === "election_commission") {
          console.log("[Dashboard] Redirecting to EC dashboard")
          window.location.href = "/dashboard/election-commission"
        } else {
          console.log("[Dashboard] Redirecting to user dashboard")
          window.location.href = "/dashboard/user"
        }
      } catch (error) {
        console.error("[Dashboard] Error:", error)
        window.location.href = "/auth"
      }
    }

    redirectToDashboard()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-white text-lg">Loading your dashboard...</p>
        <p className="text-gray-400 text-sm">Please wait...</p>
      </div>
    </div>
  )
}
