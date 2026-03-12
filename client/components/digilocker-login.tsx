"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Lock, Phone, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type LoginStep = "uniqueId" | "otp" | "mpin"

export function DigiLockerLogin() {
  const [step, setStep] = useState<LoginStep>("uniqueId")
  const [uniqueId, setUniqueId] = useState("")
  const [otp, setOtp] = useState("")
  const [mpin, setMpin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [maskedPhone, setMaskedPhone] = useState("")
  const [otpTimer, setOtpTimer] = useState(0)

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uniqueId.trim()) {
      setError("Please enter your Unique ID")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to request OTP")
      }

      setMaskedPhone(data.phone)
      setStep("otp")
      setOtpTimer(30)

      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Please enter 6-digit OTP")
      return
    }

    setLoading(true)
    setError("")

    // Just validate OTP format and move to MPIN step
    // Actual verification happens when submitting MPIN
    setStep("mpin")
    setLoading(false)
  }

  const handleVerifyMPIN = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mpin.length !== 4 || !/^\d+$/.test(mpin)) {
      setError("MPIN must be 4 digits")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-otp-mpin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueId,
          otp,
          mpin,
          isFirstLogin: false,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid MPIN")
      }

      // Store token for API client
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      setSuccess(true)
      setTimeout(() => {
        window.location.href = `/dashboard`
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "MPIN verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/20">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg shadow-purple-500/50">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-white font-bold">
              Secure Login
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              {step === "uniqueId" && "Enter Your Unique ID"}
              {step === "otp" && "Verify with OTP"}
              {step === "mpin" && "Enter Your Security Code"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-8 space-y-6">
        {success ? (
          <div className="space-y-4 text-center slide-up">
            <div className="flex justify-center">
              <div className="p-4 bg-green-500/20 rounded-full border border-green-500/30 backdrop-blur-sm">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-white">Login Successful!</p>
              <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
            </div>
          </div>
        ) : step === "uniqueId" ? (
          <form onSubmit={handleRequestOTP} className="space-y-4 slide-up">
            <div className="space-y-3">
              <Label htmlFor="uniqueId" className="text-sm font-semibold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Unique ID
              </Label>
              <Input
                id="uniqueId"
                placeholder="IND-CITIZEN-XXXXXXXXXX"
                value={uniqueId}
                onChange={(e) => {
                  setUniqueId(e.target.value.toUpperCase())
                  setError("")
                }}
                className="font-mono text-center text-lg tracking-wider bg-white/5 border border-white/20 focus:border-purple-500 text-white placeholder:text-gray-500 transition-colors"
                disabled={loading}
                autoComplete="off"
              />
              <p className="text-xs text-gray-400 text-center">Provided by Agora Admin via email</p>
            </div>

            {error && (
              <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm slide-down">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 shadow-lg shadow-purple-500/50 hover:scale-[1.02] transition-all"
              disabled={loading || !uniqueId.trim()}
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </Button>
          </form>
        ) : step === "otp" ? (
          <form onSubmit={handleVerifyOTP} className="space-y-4 slide-up">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm backdrop-blur-sm flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">OTP Sent</p>
                <p className="text-xs mt-1 text-gray-400">6-digit code sent to {maskedPhone}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="otp" className="text-sm font-semibold text-white">
                Enter OTP Code
              </Label>
              <Input
                id="otp"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  setError("")
                }}
                className="font-mono text-center text-3xl tracking-[0.5em] bg-white/5 border border-white/20 focus:border-blue-500 text-white placeholder:text-gray-600 transition-colors py-3"
                maxLength={6}
                disabled={loading}
                autoComplete="one-time-code"
              />
              {otpTimer > 0 && <p className="text-xs text-gray-400 text-center">Expires in {otpTimer}s</p>}
            </div>

            {error && (
              <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm slide-down">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2.5 shadow-lg shadow-blue-500/50 hover:scale-[1.02] transition-all"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border border-white/20 hover:border-white/40 hover:bg-white/5 bg-transparent text-white"
              onClick={() => {
                setStep("uniqueId")
                setOtp("")
                setError("")
              }}
              disabled={loading}
            >
              Back
            </Button>
          </form>
        ) : step === "mpin" ? (
          <form onSubmit={handleVerifyMPIN} className="space-y-4 slide-up">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm backdrop-blur-sm flex items-start gap-3">
              <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Secure Access</p>
                <p className="text-xs mt-1 text-gray-400">Enter your 4-digit security code to complete login</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="mpin" className="text-sm font-semibold text-white">
                4-Digit Security Code
              </Label>
              <Input
                id="mpin"
                type="password"
                placeholder="••••"
                value={mpin}
                onChange={(e) => {
                  setMpin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  setError("")
                }}
                className="font-mono text-center text-3xl tracking-[0.5em] bg-white/5 border border-white/20 focus:border-purple-500 text-white placeholder:text-gray-600 transition-colors py-3"
                maxLength={4}
                disabled={loading}
                autoComplete="off"
              />
              <p className="text-xs text-gray-400 text-center">You set this during your first login</p>
            </div>

            {error && (
              <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm slide-down">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 shadow-lg shadow-purple-500/50 hover:scale-[1.02] transition-all"
              disabled={loading || mpin.length !== 4}
            >
              {loading ? "Logging in..." : "Login to Agora"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border border-white/20 hover:border-white/40 hover:bg-white/5 bg-transparent text-white"
              onClick={() => {
                setStep("uniqueId")
                setUniqueId("")
                setOtp("")
                setMpin("")
                setError("")
              }}
              disabled={loading}
            >
              Start Over
            </Button>
          </form>
        ) : null}

        <div className="pt-4 text-center text-xs text-gray-400 border-t border-white/10">
          <p>🔐 Secure login powered by blockchain</p>
        </div>
      </CardContent>
    </Card>
  )
}
