"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, FileText, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { AnimatedButton } from "./animated-button"

interface RegistrationFormProps {
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  name: string
  email: string
  phoneNumber: string
  age: string
  address: string
  aadhaarNumber: string
  voterIdNumber: string
  aadhaarCard: File | null
  voterIdCard: File | null
}

const steps = [
  { id: 1, title: "Personal Info", description: "Basic details" },
  { id: 2, title: "Address & Age", description: "Location details" },
  { id: 3, title: "ID Documents", description: "Aadhaar & Voter ID" },
  { id: 4, title: "Upload Documents", description: "PDF files" },
]

export function RegistrationForm({ onClose, onSuccess }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    address: "",
    aadhaarNumber: "",
    voterIdNumber: "",
    aadhaarCard: null,
    voterIdCard: null,
  })

  const updateFormData = (field: keyof FormData, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleFileChange = (field: "aadhaarCard" | "voterIdCard", file: File | null) => {
    if (file && file.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      return
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }
    updateFormData(field, file as File)
  }

  const validateStep = (step: number): boolean => {
    setError("")
    
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.phoneNumber) {
          setError("Please fill all personal information fields")
          return false
        }
        if (!/^\d{10}$/.test(formData.phoneNumber)) {
          setError("Phone number must be 10 digits")
          return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError("Please enter a valid email address")
          return false
        }
        return true
      
      case 2:
        if (!formData.age || !formData.address) {
          setError("Please fill age and address")
          return false
        }
        const age = parseInt(formData.age)
        if (age < 18 || age > 120) {
          setError("Age must be between 18 and 120")
          return false
        }
        return true
      
      case 3:
        if (!formData.aadhaarNumber || !formData.voterIdNumber) {
          setError("Please provide Aadhaar and Voter ID numbers")
          return false
        }
        if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
          setError("Aadhaar number must be 12 digits")
          return false
        }
        return true
      
      case 4:
        if (!formData.aadhaarCard || !formData.voterIdCard) {
          setError("Please upload both Aadhaar Card and Voter ID Card PDFs")
          return false
        }
        return true
      
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setError("")
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsLoading(true)
    setError("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phoneNumber", formData.phoneNumber)
      formDataToSend.append("age", formData.age)
      formDataToSend.append("address", formData.address)
      formDataToSend.append("aadhaarNumber", formData.aadhaarNumber)
      formDataToSend.append("voterIdNumber", formData.voterIdNumber)
      
      if (formData.aadhaarCard) {
        formDataToSend.append("aadhaarCard", formData.aadhaarCard)
      }
      if (formData.voterIdCard) {
        formDataToSend.append("voterIdCard", formData.voterIdCard)
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Voter Registration</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    animate={{
                      scale: currentStep === step.id ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                  </motion.div>
                  <div className="text-center mt-2">
                    <p className="text-xs font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded ${
                      currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData("phoneNumber", e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="mt-1"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Address & Age */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    placeholder="Must be 18 or above"
                    min="18"
                    max="120"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Enter your complete residential address"
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: ID Documents Numbers */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                  <Input
                    id="aadhaar"
                    value={formData.aadhaarNumber}
                    onChange={(e) => updateFormData("aadhaarNumber", e.target.value.replace(/\D/g, ""))}
                    placeholder="12-digit Aadhaar number"
                    maxLength={12}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your Aadhaar will be encrypted and stored securely</p>
                </div>

                <div>
                  <Label htmlFor="voterId">Voter ID Number *</Label>
                  <Input
                    id="voterId"
                    value={formData.voterIdNumber}
                    onChange={(e) => updateFormData("voterIdNumber", e.target.value.toUpperCase())}
                    placeholder="Enter your Voter ID number"
                    className="mt-1"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Upload Documents */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label>Aadhaar Card (PDF) *</Label>
                  <Card className="mt-1 p-4 border-2 border-dashed hover:border-orange-500 transition cursor-pointer">
                    <label htmlFor="aadhaarFile" className="cursor-pointer flex flex-col items-center">
                      {formData.aadhaarCard ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <FileText className="w-6 h-6" />
                          <span className="text-sm font-medium">{formData.aadhaarCard.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload Aadhaar Card PDF</p>
                          <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                        </>
                      )}
                    </label>
                    <input
                      id="aadhaarFile"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange("aadhaarCard", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </Card>
                </div>

                <div>
                  <Label>Voter ID Card (PDF) *</Label>
                  <Card className="mt-1 p-4 border-2 border-dashed hover:border-green-500 transition cursor-pointer">
                    <label htmlFor="voterIdFile" className="cursor-pointer flex flex-col items-center">
                      {formData.voterIdCard ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <FileText className="w-6 h-6" />
                          <span className="text-sm font-medium">{formData.voterIdCard.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload Voter ID Card PDF</p>
                          <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                        </>
                      )}
                    </label>
                    <input
                      id="voterIdFile"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange("voterIdCard", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < 4 ? (
            <AnimatedButton onClick={handleNext} className="flex items-center gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </AnimatedButton>
          ) : (
            <AnimatedButton onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Registration
                </>
              )}
            </AnimatedButton>
          )}
        </div>
      </motion.div>
    </div>
  )
}
