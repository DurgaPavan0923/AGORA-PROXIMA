// Guard component to protect dashboard routes
"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface DashboardGuardProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin" | "election_commission"
}

export function DashboardGuard({ children, requiredRole }: DashboardGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          headers: {
            Cookie: document.cookie,
          },
        })

        if (!response.ok) {
          router.push("/auth")
          return
        }

        const data = await response.json()

        if (requiredRole && data.user.role !== requiredRole) {
          router.push("/dashboard")
          return
        }
      } catch (error) {
        console.error("[v0] Access verification failed:", error)
        router.push("/auth")
      }
    }

    verifyAccess()
  }, [router, requiredRole])

  return <>{children}</>
}
