// Protected route wrapper component
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin" | "election_commission"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for dev mode bypass
        const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true"
        const hasDevSession = localStorage.getItem("dev-mode") === "true"
        const devRole = localStorage.getItem("dev-role")

        if (isDevMode && hasDevSession) {
          // Verify dev role matches required role
          if (requiredRole && devRole !== requiredRole) {
            redirect("/dashboard")
            return
          }
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        // Normal authentication flow
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token") || ""}`,
          },
        })

        if (!response.ok) {
          redirect("/auth")
        }

        const data = await response.json()

        if (requiredRole && data.user.role !== requiredRole) {
          redirect("/dashboard")
        }

        setIsAuthorized(true)
      } catch (error) {
        redirect("/auth")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return isAuthorized ? children : null
}
