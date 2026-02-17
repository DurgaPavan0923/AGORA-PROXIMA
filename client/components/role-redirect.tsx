// Component to redirect users to their appropriate dashboard based on role
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

interface User {
  role: "user" | "admin" | "election_commission"
}

export function RoleRedirect() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      try {
        // Check auth token from localStorage or cookies
        const token = localStorage.getItem("auth-token")

        if (!token) {
          router.push("/auth")
          return
        }

        // Mock user detection (in production, fetch from API)
        const roleFromToken = token.includes("ADMIN") ? "admin" : token.includes("EC") ? "election_commission" : "user"

        const dashboardMap: Record<string, string> = {
          user: "/dashboard/user",
          admin: "/dashboard/admin",
          election_commission: "/dashboard/election-commission",
        }

        router.push(dashboardMap[roleFromToken])
      } catch (error) {
        router.push("/auth")
      } finally {
        setIsLoading(false)
      }
    }

    redirectBasedOnRole()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  )
}
