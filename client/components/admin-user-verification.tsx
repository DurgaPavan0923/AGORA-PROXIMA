"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Copy } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PendingUser {
  id: string
  fullName: string
  phone: string
  aadhaar: string
  address: string
  role: string
  status: string
  createdAt: string
}

export function AdminUserVerification() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [verifying, setVerifying] = useState<string | null>(null)
  const [verified, setVerified] = useState<{ id: string; uniqueId: string } | null>(null)

  useEffect(() => {
    // In production, fetch from API
    // For now, load from mock data
    setPendingUsers([])
    setLoading(false)
  }, [])

  const handleVerifyUser = async (pendingUserId: string) => {
    setVerifying(pendingUserId)
    setError("")

    try {
      const response = await fetch("/api/admin/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingUserId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Verification failed")
      }

      setVerified({ id: pendingUserId, uniqueId: data.uniqueId })
      setPendingUsers(pendingUsers.filter((u) => u.id !== pendingUserId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setVerifying(null)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Card className="border-saffron-200">
      <CardHeader>
        <CardTitle>Pending User Verifications</CardTitle>
        <CardDescription>Verify user information and issue Unique IDs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {verified && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              User verified! Unique ID: <span className="font-mono font-bold">{verified.uniqueId}</span>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 bg-transparent"
                onClick={() => navigator.clipboard.writeText(verified.uniqueId)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {pendingUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No pending verifications</div>
        ) : (
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span> <span className="font-semibold">{user.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Role:</span> <span className="font-semibold">{user.role}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span> <span className="font-mono">{user.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Aadhaar:</span>{" "}
                    <span className="font-mono">****-****-{user.aadhaar.slice(-4)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Address:</span> <span>{user.address}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleVerifyUser(user.id)}
                  disabled={verifying === user.id}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {verifying === user.id ? "Verifying..." : "Verify & Issue Unique ID"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
