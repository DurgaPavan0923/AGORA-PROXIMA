"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Shield, X } from "lucide-react"
import { AnimatedButton } from "./animated-button"

interface ChangeMPINModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function ChangeMPINModal({ onClose, onSuccess }: ChangeMPINModalProps) {
  const [step, setStep] = useState<"verify" | "create">("verify")
  const [oldMpin, setOldMpin] = useState("")
  const [newMpin, setNewMpin] = useState("")
  const [confirmMpin, setConfirmMpin] = useState("")
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
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

  const handleOldMpinChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOldMpin(value)
      setError("")
    }
  }

  const handleNewMpinChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setNewMpin(value)
      setError("")
    }
  }

  const handleConfirmChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setConfirmMpin(value)
      setError("")
    }
  }

  const handleVerifyOldMpin = async () => {
    setError("")

    if (oldMpin.length !== 6) {
      setError("Please enter your current 6-digit MPIN")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-mpin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mpin: oldMpin }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Invalid MPIN")
      }

      // Move to create new MPIN step
      setStep("create")
      setError("")
    } catch (err: any) {
      setError(err.message || "Invalid MPIN. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNewMpin = async () => {
    setError("")

    if (!validateMpin(newMpin)) {
      return
    }

    if (newMpin === oldMpin) {
      setError("New MPIN must be different from old MPIN")
      return
    }

    if (newMpin !== confirmMpin) {
      setError("New MPINs do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/change-mpin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldMpin,
          newMpin,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to change MPIN")
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const mpinStrength =
    newMpin.length >= 6 && validateMpin(newMpin) ? "strong" : newMpin.length > 0 ? "weak" : ""

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Change MPIN</h2>
                <p className="text-sm text-gray-600">
                  {step === "verify" ? "Verify your current MPIN" : "Create new MPIN"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`flex-1 h-1.5 rounded-full transition ${
                step === "verify" || step === "create" ? "bg-green-500" : "bg-gray-200"
              }`}
            />
            <div
              className={`flex-1 h-1.5 rounded-full transition ${
                step === "create" ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Verify Old MPIN */}
          {step === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-6"
            >
              <Card className="p-4 bg-orange-50 border-orange-200">
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-900">
                    <p className="font-semibold mb-1">Security Verification</p>
                    <p className="text-xs">
                      Enter your current MPIN to proceed with changing it.
                    </p>
                  </div>
                </div>
              </Card>

              <div>
                <Label htmlFor="oldMpin">Current MPIN</Label>
                <div className="relative mt-1">
                  <Input
                    id="oldMpin"
                    type={showOld ? "text" : "password"}
                    value={oldMpin}
                    onChange={(e) => handleOldMpinChange(e.target.value)}
                    placeholder="Enter current MPIN"
                    maxLength={6}
                    className="pr-10 text-center text-2xl tracking-widest font-mono"
                    autoComplete="off"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && oldMpin.length === 6) {
                        handleVerifyOldMpin()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{oldMpin.length}/6 digits</p>
              </div>

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

              <AnimatedButton
                onClick={handleVerifyOldMpin}
                disabled={isLoading || oldMpin.length < 6}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Verify & Continue
                  </>
                )}
              </AnimatedButton>
            </motion.div>
          )}

          {/* Step 2: Create New MPIN */}
          {step === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-6"
            >
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-900">
                    <p className="font-semibold mb-1">Old MPIN Verified!</p>
                    <p className="text-xs">Now create your new 6-digit MPIN.</p>
                  </div>
                </div>
              </Card>

              {/* New MPIN Input */}
              <div>
                <Label htmlFor="newMpin">New MPIN (6 digits)</Label>
                <div className="relative mt-1">
                  <Input
                    id="newMpin"
                    type={showNew ? "text" : "password"}
                    value={newMpin}
                    onChange={(e) => handleNewMpinChange(e.target.value)}
                    placeholder="Enter new MPIN"
                    maxLength={6}
                    className="pr-10 text-center text-2xl tracking-widest font-mono"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Strength Indicator */}
                {newMpin.length > 0 && (
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
                          animate={{ width: `${(newMpin.length / 6) * 100}%` }}
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
                        {newMpin.length}/6
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Confirm New MPIN */}
              <div>
                <Label htmlFor="confirmMpin">Confirm New MPIN</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmMpin"
                    type={showConfirm ? "text" : "password"}
                    value={confirmMpin}
                    onChange={(e) => handleConfirmChange(e.target.value)}
                    placeholder="Re-enter new MPIN"
                    maxLength={6}
                    className="pr-10 text-center text-2xl tracking-widest font-mono"
                    autoComplete="off"
                    disabled={newMpin.length < 6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={newMpin.length < 6}
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
                    {newMpin === confirmMpin ? (
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

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setStep("verify")
                    setNewMpin("")
                    setConfirmMpin("")
                    setError("")
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <AnimatedButton
                  onClick={handleCreateNewMpin}
                  disabled={
                    isLoading ||
                    newMpin.length < 6 ||
                    confirmMpin.length < 6 ||
                    newMpin !== confirmMpin
                  }
                  className="flex-1 bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Update MPIN
                    </>
                  )}
                </AnimatedButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
