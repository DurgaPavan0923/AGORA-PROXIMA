"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Lock, Smartphone } from "lucide-react"

interface AuthModalProps {
  onClose: () => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [step, setStep] = useState<"uniqueId" | "otp" | "mpin">("uniqueId")
  const [uniqueId, setUniqueId] = useState("")
  const [otp, setOtp] = useState("")
  const [mpin, setMpin] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUniqueIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueId }),
      })
      if (response.ok) {
        setStep("otp")
      } else {
        alert("Unique ID not found. Please check and try again.")
      }
    } catch (error) {
      console.error("Error requesting OTP:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/auth/verify-otp-mpin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueId, otp, mpin: mpin || undefined }),
      })
      if (response.ok) {
        if (mpin) {
          const data = await response.json()
          localStorage.setItem("authToken", data.token)
          onClose()
        } else {
          setStep("mpin")
        }
      } else {
        alert("Invalid OTP. Please try again.")
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMpinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/auth/verify-otp-mpin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueId, otp, mpin }),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("authToken", data.token)
        onClose()
      } else {
        alert("Invalid MPIN. Please try again.")
      }
    } catch (error) {
      console.error("Error verifying MPIN:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md backdrop-blur-sm border-saffron/20 shadow-xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-saffron/5 to-emerald/5">
          <div>
            <CardTitle className="text-xl font-bold text-saffron">Agora</CardTitle>
            <CardDescription className="text-emerald">Secure Governance Access</CardDescription>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="pt-6">
          {step === "uniqueId" && (
            <form onSubmit={handleUniqueIdSubmit} className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Unique ID</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your 12-digit Unique ID"
                    value={uniqueId}
                    onChange={(e) => setUniqueId(e.target.value.toUpperCase())}
                    className="pl-10 font-mono text-lg tracking-widest border-saffron/30 focus:border-saffron"
                    maxLength={12}
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron" />
                </div>
                <p className="text-xs text-muted-foreground">As provided by Agora Admin</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-saffron to-orange-500 hover:from-saffron/90 hover:to-orange-600 text-white font-semibold py-2 animate-pulse-glow"
              >
                {loading ? "Verifying..." : "Request OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 animate-fade-in">
              <div className="bg-blue/5 border border-blue/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-foreground">OTP sent to registered phone number</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Enter OTP</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10 font-mono text-2xl tracking-widest text-center border-blue/30 focus:border-blue"
                    maxLength={6}
                    required
                  />
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue" />
                </div>
                <p className="text-xs text-muted-foreground">OTP expires in 5 minutes</p>
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue to-cyan-500 hover:from-blue/90 hover:to-cyan-600 text-white font-semibold py-2 animate-pulse-glow"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("uniqueId")
                  setOtp("")
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition"
              >
                Use Different ID
              </button>
            </form>
          )}

          {step === "mpin" && (
            <form onSubmit={handleMpinSubmit} className="space-y-4 animate-fade-in">
              <div className="bg-emerald/5 border border-emerald/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-foreground">Enter your 4-digit MPIN for secure access</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">4-Digit MPIN</label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••"
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                    className="pl-10 font-mono text-2xl tracking-widest text-center border-emerald/30 focus:border-emerald"
                    maxLength={4}
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || mpin.length !== 4}
                className="w-full bg-gradient-to-r from-emerald to-teal-500 hover:from-emerald/90 hover:to-teal-600 text-white font-semibold py-2 animate-pulse-glow"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("otp")
                  setMpin("")
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition"
              >
                Re-enter OTP
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">Your account is managed by Agora Admin</p>
            <p className="text-xs text-muted-foreground mt-1">No self-signup available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
