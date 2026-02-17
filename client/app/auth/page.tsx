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
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="relative w-full max-w-md z-10">
        {/* Logo Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-75" />
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg">
                <Vote className="w-8 h-8 text-white" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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
            <p className="text-gray-400">Blockchain-Powered Authentication</p>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center gap-6 pt-4 mt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Encrypted</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Secure</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Fingerprint className="w-4 h-4 text-pink-400" />
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
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
              >
                <Lock className="w-4 h-4 mr-2" />
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
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
                      <p className="text-gray-400 mb-4">
                        Your registration is pending admin verification.
                      </p>
                      <p className="text-sm text-purple-400">
                        You will receive your Unique ID via email once approved.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Create Your Account</h3>
                      <p className="text-sm text-gray-400">
                        Register to participate in democratic voting
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRegistration(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/50 hover:scale-[1.02] transition-all"
                    >
                      Start Registration
                    </button>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm backdrop-blur-sm">
                      <p className="text-blue-400 font-medium mb-2">📋 Registration Process:</p>
                      <ul className="text-gray-400 space-y-1 text-xs">
                        <li>1. Fill registration form with your details</li>
                        <li>2. Upload Aadhaar & Voter ID documents</li>
                        <li>3. Admin will verify your documents</li>
                        <li>4. Receive Unique ID via email</li>
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
          className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-xs text-center text-gray-400 leading-relaxed">
            🔒 Your data is encrypted and secured on the blockchain. We never store your passwords.
          </p>
        </motion.div>

        {/* Development Mode Link */}
        {process.env.NEXT_PUBLIC_DEV_MODE === "true" && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link
              href="/dev-access"
              className="block text-center text-xs text-yellow-400 hover:text-yellow-300 underline"
            >
              🔧 Development Access (Bypass Auth)
            </Link>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 10px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
