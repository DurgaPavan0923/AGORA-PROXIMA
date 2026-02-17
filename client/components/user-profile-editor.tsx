"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, CheckCircle2, Camera, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { api } from "@/lib/api"
import type { User } from "@/lib/types"

interface UserProfileEditorProps {
  user: User
  onRefresh: () => void
}

export function UserProfileEditor({ user, onRefresh }: UserProfileEditorProps) {
  const [showMPINForm, setShowMPINForm] = useState(false)
  const [currentMPIN, setCurrentMPIN] = useState("")
  const [newMPIN, setNewMPIN] = useState("")
  const [confirmMPIN, setConfirmMPIN] = useState("")
  const [loadingMPIN, setLoadingMPIN] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleMPINChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingMPIN(true)
    setError("")
    setSuccess("")

    if (newMPIN !== confirmMPIN) {
      setError("MPINs do not match")
      setLoadingMPIN(false)
      return
    }

    if (newMPIN.length !== 6 || !/^[0-9]{6}$/.test(newMPIN)) {
      setError("MPIN must be exactly 6 digits")
      setLoadingMPIN(false)
      return
    }

    if (currentMPIN.length !== 6 || !/^[0-9]{6}$/.test(currentMPIN)) {
      setError("Current MPIN must be exactly 6 digits")
      setLoadingMPIN(false)
      return
    }

    try {
      await api.user.changeMPIN(currentMPIN, newMPIN)
      setSuccess("MPIN changed successfully!")
      setCurrentMPIN("")
      setNewMPIN("")
      setConfirmMPIN("")
      setShowMPINForm(false)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change MPIN")
    } finally {
      setLoadingMPIN(false)
    }
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Read-Only Account Information */}
      <Card className="border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Verified identity details (cannot be changed)</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase">Full Name</Label>
              <p className="text-lg font-medium mt-1 text-gray-800">{user.fullName}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase">Phone</Label>
              <p className="text-lg font-medium mt-1 text-gray-800">{user.phone}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase">Role</Label>
              <p className="text-lg font-medium mt-1 text-gray-800 capitalize">{user.role.replace(/_/g, " ")}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase">Unique ID</Label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 break-all text-gray-800">{user.uniqueId}</p>
            </div>
            {user.address && (
              <div className="col-span-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase">Address</Label>
                <p className="text-gray-800 mt-1">{user.address}</p>
              </div>
            )}
          </div>

          <Alert className="border-blue-200 bg-blue-50 mt-4">
            <Lock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              These details are verified by admin and immutable. Contact admin support to report changes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* MPIN Change Section */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your MPIN (6-digit password)</CardDescription>
        </CardHeader>
        <CardContent>
          {!showMPINForm ? (
            <Button onClick={() => setShowMPINForm(true)} variant="outline" className="border-saffron-300">
              Change MPIN
            </Button>
          ) : (
            <form onSubmit={handleMPINChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-mpin">Current MPIN</Label>
                <Input
                  id="current-mpin"
                  type="password"
                  placeholder="••••••"
                  value={currentMPIN}
                  onChange={(e) => setCurrentMPIN(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  disabled={loadingMPIN}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-mpin">New MPIN (6 digits)</Label>
                <Input
                  id="new-mpin"
                  type="password"
                  placeholder="••••••"
                  value={newMPIN}
                  onChange={(e) => setNewMPIN(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  disabled={loadingMPIN}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-mpin">Confirm MPIN</Label>
                <Input
                  id="confirm-mpin"
                  type="password"
                  placeholder="••••••"
                  value={confirmMPIN}
                  onChange={(e) => setConfirmMPIN(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  disabled={loadingMPIN}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={loadingMPIN}>
                  {loadingMPIN ? "Changing..." : "Change MPIN"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMPINForm(false)}
                  disabled={loadingMPIN}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
