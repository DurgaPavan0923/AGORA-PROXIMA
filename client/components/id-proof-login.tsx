"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function IdProofLogin() {
  const [uniqueIdProof, setUniqueIdProof] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueIdProof, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      setSuccess(true)
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-teal-600" />
          <CardTitle>Secure Login</CardTitle>
        </div>
        <CardDescription>Sign in with your unique ID proof</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Login successful! Redirecting...</AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idproof">Unique ID Proof</Label>
              <Input
                id="idproof"
                placeholder="AGORA-XXXXXXXXX-XXXXX"
                value={uniqueIdProof}
                onChange={(e) => setUniqueIdProof(e.target.value)}
                className="font-mono"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Provided by Election Commission or Admin</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
