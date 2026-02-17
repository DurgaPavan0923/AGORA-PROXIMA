"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Copy } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AdminIdIssuer() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"user" | "admin" | "election_commission">("user")
  const [loading, setLoading] = useState(false)
  const [issuedId, setIssuedId] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleIssueId = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/id-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to issue ID")
      }

      setIssuedId(data.uniqueIdProof)
      setEmail("")
      setName("")
      setRole("user")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to issue ID")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(issuedId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Issue ID Proof</CardTitle>
        <CardDescription>Create unique ID proofs for users</CardDescription>
      </CardHeader>
      <CardContent>
        {issuedId ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">ID Proof issued successfully!</AlertDescription>
            </Alert>

            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all">{issuedId}</div>

            <Button onClick={copyToClipboard} variant="outline" className="w-full bg-transparent">
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy ID Proof"}
            </Button>

            <Button onClick={() => setIssuedId("")} variant="secondary" className="w-full">
              Issue Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleIssueId} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Citizen/Voter</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="election_commission">Election Commission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Issuing..." : "Issue ID Proof"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
