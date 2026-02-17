"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Shield } from "lucide-react"
import { AnimatedButton } from "./animated-button"

interface CreateMPINModalProps {
  phoneNumber: string
  onSuccess: (mpin: string) => void
}

export function CreateMPINModal({ phoneNumber, onSuccess }: CreateMPINModalProps) {
  const [mpin, setMpin] = useState("")
  const [confirmMpin, setConfirmMpin] = useState("")
  const [showMpin, setShowMpin] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateMpin = (value: string): boolean => {
    if (value.length !== 6) {
      setError("MPIN must be exactly 6 digits")
      return false
    }
    if (!/^\d+$/.test(value)) {
      setError("MPIN must contain only numbers")
      return false
    }
    if (/^(\d)\1{5}$/.test(value)) {
      setError("MPIN cannot be all same digits (e.g., 111111)")
      return false
    }
    if (value === "123456" || value === "654321") {
      setError("MPIN cannot be sequential (123456 or 654321)")
      return false
    }
    return true
  }

  const handleMpinChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setMpin(value)
      setError("")
    }
  }

  const handleConfirmChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setConfirmMpin(value)
      setError("")
    }
  }

  const handleSubmit = async () => {
    setError("")

    if (!validateMpin(mpin)) {
      return
    }

    if (mpin !== confirmMpin) {
      setError("MPINs do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/create-mpin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          mpin,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create MPIN")
      }

      onSuccess(mpin)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const mpinStrength = mpin.length >= 6 && validateMpin(mpin) ? "strong" : mpin.length > 0 ? "weak" : ""

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
      >
        <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-green-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Your MPIN</h2>
              <p className="text-sm text-gray-600">Secure your account with a 6-digit PIN</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Security Info */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">First Time Setup</p>
                <p className="text-xs">
                  Create a secure 6-digit MPIN to protect your account. You can change it later from your profile.
                </p>
              </div>
            </div>
          </Card>

          {/* MPIN Input */}
          <div>
            <Label htmlFor="mpin">Create MPIN (6 digits)</Label>
            <div className="relative mt-1">
              <Input
                id="mpin"
                type={showMpin ? "text" : "password"}
                value={mpin}
                onChange={(e) => handleMpinChange(e.target.value)}
                placeholder="Enter 6-digit MPIN"
                maxLength={6}
                className="pr-10 text-center text-2xl tracking-widest font-mono"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowMpin(!showMpin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showMpin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Strength Indicator */}
            {mpin.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        mpinStrength === "strong"
                          ? "bg-green-500"
                          : mpinStrength === "weak"
                          ? "bg-orange-400"
                          : "bg-gray-300"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(mpin.length / 6) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      mpinStrength === "strong"
                        ? "text-green-600"
                        : mpinStrength === "weak"
                        ? "text-orange-600"
                        : "text-gray-400"
                    }`}
                  >
                    {mpin.length}/6
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Confirm MPIN Input */}
          <div>
            <Label htmlFor="confirmMpin">Confirm MPIN</Label>
            <div className="relative mt-1">
              <Input
                id="confirmMpin"
                type={showConfirm ? "text" : "password"}
                value={confirmMpin}
                onChange={(e) => handleConfirmChange(e.target.value)}
                placeholder="Re-enter MPIN"
                maxLength={6}
                className="pr-10 text-center text-2xl tracking-widest font-mono"
                autoComplete="off"
                disabled={mpin.length < 6}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={mpin.length < 6}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Match Indicator */}
            {confirmMpin.length === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 flex items-center gap-2"
              >
                {mpin === confirmMpin ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">MPINs match!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">MPINs don't match</span>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Security Tips */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Security Tips:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>Avoid using sequential numbers (123456)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>Don't use all same digits (111111)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>Don't share your MPIN with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>You can change it anytime from your profile</span>
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <AnimatedButton
            onClick={handleSubmit}
            disabled={isLoading || mpin.length < 6 || confirmMpin.length < 6 || mpin !== confirmMpin}
            className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Creating MPIN...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Create MPIN & Continue
              </>
            )}
          </AnimatedButton>

          <p className="text-xs text-center text-gray-500 mt-3">
            By creating an MPIN, you agree to keep it secure and confidential
          </p>
        </div>
      </motion.div>
    </div>
  )
}
