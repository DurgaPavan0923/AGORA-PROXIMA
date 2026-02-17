"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Key } from "lucide-react"

export default function DevAccessPage() {
  const router = useRouter()
  const [devKey, setDevKey] = useState("")
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | "election_commission">("admin")
  const [error, setError] = useState("")

  // Check if dev mode is enabled
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true"
  const correctDevKey = process.env.NEXT_PUBLIC_DEV_KEY || "agora_dev_2024"

  if (!isDevMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-white p-8 max-w-md">
          <div className="text-center space-y-4">
            <ShieldCheck className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Development Mode Disabled</h1>
            <p className="text-gray-600">
              This page is only accessible when NEXT_PUBLIC_DEV_MODE is enabled.
            </p>
            <Button onClick={() => router.push("/auth")}>Go to Login</Button>
          </div>
        </Card>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (devKey !== correctDevKey) {
      setError("Invalid development key")
      return
    }

    // Store dev session
    localStorage.setItem("dev-mode", "true")
    localStorage.setItem("dev-role", selectedRole)
    
    // Create a mock auth token
    const mockUser = {
      uniqueId: `dev-${selectedRole}-${Date.now()}`,
      fullName: `Dev ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`,
      phone: "0000000000",
      role: selectedRole,
    }
    localStorage.setItem("auth-token", "dev-token")
    localStorage.setItem("user", JSON.stringify(mockUser))

    // Redirect to dashboard
    const dashboardMap = {
      user: "/dashboard/user",
      admin: "/dashboard/admin",
      election_commission: "/dashboard/election-commission",
    }
    router.push(dashboardMap[selectedRole])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-white p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Development Access</h1>
          <p className="text-sm text-gray-600">Enter dev key to bypass authentication</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="devKey">Development Key</Label>
            <Input
              id="devKey"
              type="password"
              value={devKey}
              onChange={(e) => setDevKey(e.target.value)}
              placeholder="Enter dev key"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label>Select Role</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                type="button"
                variant={selectedRole === "admin" ? "default" : "outline"}
                onClick={() => setSelectedRole("admin")}
                className="text-sm"
              >
                Admin
              </Button>
              <Button
                type="button"
                variant={selectedRole === "user" ? "default" : "outline"}
                onClick={() => setSelectedRole("user")}
                className="text-sm"
              >
                User
              </Button>
              <Button
                type="button"
                variant={selectedRole === "election_commission" ? "default" : "outline"}
                onClick={() => setSelectedRole("election_commission")}
                className="text-sm text-xs"
              >
                EC
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full">
            Access Dashboard
          </Button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ Development Only:</strong> This bypass is only for development/testing.
            Never use this in production!
          </p>
          <p className="text-xs text-gray-600 mt-2">
            <strong>Dev Key Hint:</strong> Check your .env.local file (NEXT_PUBLIC_DEV_KEY)
          </p>
        </div>
      </Card>
    </div>
  )
}
