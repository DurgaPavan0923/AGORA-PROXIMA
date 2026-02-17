"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Copy, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ElectionCommissionCreator() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [generatedId, setGeneratedId] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCreateEC = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/create-election-commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          department,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create Election Commission user")
      }

      setGeneratedId(data.credentials.uniqueId)
      setSuccess(true)
      setFullName("")
      setPhone("")
      setEmail("")
      setDepartment("")

      setTimeout(() => setSuccess(false), 8000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <CardTitle>Create Election Commission Official</CardTitle>
        </div>
        <CardDescription>Generate secure credentials for Election Commission members</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {success ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Election Commission user created successfully!
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Unique ID</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 bg-white p-2 rounded font-mono text-sm text-gray-800 break-all border border-gray-200">
                    {generatedId}
                  </code>
                  <Button onClick={copyToClipboard} size="sm" variant="outline" className="shrink-0 bg-transparent">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Temporary MPIN</p>
                <p className="mt-1 font-mono text-lg text-center text-gray-800">0000</p>
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  Send credentials via secure email. User must change MPIN on first login.
                </AlertDescription>
              </Alert>
            </div>

            <Button onClick={() => setGeneratedId("")} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Create Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreateEC} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ec-name">Full Name</Label>
                <Input
                  id="ec-name"
                  placeholder="Officer Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ec-phone">Phone Number</Label>
                <Input
                  id="ec-phone"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ec-email">Email</Label>
                <Input
                  id="ec-email"
                  type="email"
                  placeholder="officer@election.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ec-dept">Department/Region</Label>
                <Input
                  id="ec-dept"
                  placeholder="Election Commission - Delhi"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Creating..." : "Generate Election Commission ID"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
