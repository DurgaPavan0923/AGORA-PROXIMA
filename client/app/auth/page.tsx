"use client"

import { useState, useEffect, Suspense } from "react"
import { ShieldCheck, Lock, Fingerprint, Vote, UserPlus } from "lucide-react"
import { DigiLockerLogin } from "@/components/digilocker-login"
import { RegistrationForm } from "@/components/registration-form"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function AuthContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("login")
  const [showRegistration, setShowRegistration] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
      setShowRegistration(true)
    }
  }, [searchParams])

  const handleRegistrationSuccess = () => {
    setShowRegistration(false)
    setRegistrationSuccess(true)
    setTimeout(() => {
      setActiveTab("login")
      setRegistrationSuccess(false)
    }, 3000)
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-gradient-to-b from-[#0C2340] to-[#1B3A5C] flex items-center justify-center p-4 relative overflow-hidden"
    >

      <div className="relative w-full max-w-md z-10">
        {/* Logo Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="bg-[#FF9933] p-3 rounded-lg">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-wide">
              AGORA
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-2xl font-bold text-white">Secure Access Portal</h1>
            <p className="text-blue-200">Digital Voting Platform</p>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center gap-6 pt-4 mt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-xs text-blue-200">
              <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
              <span>Encrypted</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-xs text-blue-200">
              <Lock className="w-4 h-4 text-[#FF9933]" />
              <span>Secure</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-xs text-blue-200">
              <Fingerprint className="w-4 h-4 text-[#FF9933]" />
              <span>Private</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Login/Register Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-xl border border-white/10 p-1 mb-6">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-[#FF9933] data-[state=active]:text-white text-blue-200"
              >
                <Lock className="w-4 h-4 mr-2" />
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="data-[state=active]:bg-[#FF9933] data-[state=active]:text-white text-blue-200"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <DigiLockerLogin />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                {registrationSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                      <ShieldCheck className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Registration Submitted!</h3>
                      <p className="text-blue-200 mb-4">
                        Your registration is pending admin verification.
                      </p>
                      <p className="text-sm text-[#FF9933]">
                        You will receive your Unique ID via email and SMS once approved.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Create Your Account</h3>
                      <p className="text-sm text-blue-200">
                        Register to participate in democratic voting
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRegistration(true)}
                      className="w-full bg-[#FF9933] hover:bg-[#e88a2d] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:scale-[1.02] transition-all"
                    >
                      Start Registration
                    </button>
                    <div className="bg-white/5 border border-white/20 rounded-lg p-4 text-sm">
                      <p className="text-[#FF9933] font-medium mb-2">Registration Process:</p>
                      <ul className="text-blue-200 space-y-1 text-xs">
                        <li>1. Fill registration form with your details</li>
                        <li>2. Upload Aadhaar &amp; Voter ID documents</li>
                        <li>3. Admin will verify your documents</li>
                        <li>4. Receive Unique ID via email &amp; SMS</li>
                        <li>5. Login using Unique ID + OTP + MPIN</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Registration Modal */}
        <AnimatePresence>
          {showRegistration && (
            <RegistrationForm
              onClose={() => setShowRegistration(false)}
              onSuccess={handleRegistrationSuccess}
            />
          )}
        </AnimatePresence>

        {/* Footer Note */}
        <motion.div
          className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-xs text-center text-blue-200 leading-relaxed">
            Your data is encrypted and secured on the blockchain. We never store your passwords.
          </p>
        </motion.div>
      </div>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0C2340] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
