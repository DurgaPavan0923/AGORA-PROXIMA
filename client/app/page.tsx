"use client"

import { ArrowRight, Shield, Lock, Landmark, Users, Vote, Eye, CheckCircle, FileCheck, IndianRupee } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top Tricolor Band */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Navigation */}
      <nav className="bg-[#0C2340] text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#FF9933] p-2 rounded">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-wide">AGORA</span>
                <p className="text-xs text-blue-200 tracking-wider">DIGITAL VOTING PLATFORM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth">
                <Button variant="ghost" className="text-white hover:bg-white/10 border border-white/20">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button className="bg-[#FF9933] hover:bg-[#e88a2d] text-white font-semibold">
                  Register
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0C2340] to-[#1B3A5C] text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-8 text-sm">
              <Shield className="w-4 h-4 text-[#FF9933]" />
              <span>Secured by Blockchain Technology</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transparent &amp; Secure
              <br />
              <span className="text-[#FF9933]">Digital Voting</span> for India
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              A blockchain-powered citizen governance platform ensuring tamper-proof elections,
              verified voter identity, and complete transparency in democratic participation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth?tab=register">
                <Button
                  size="lg"
                  className="bg-[#FF9933] hover:bg-[#e88a2d] text-white px-8 py-6 text-lg font-semibold shadow-lg"
                >
                  Register to Vote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 hover:bg-white/10 text-white px-8 py-6 text-lg"
                >
                  Voter Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              {[
                { value: "100%", label: "Tamper-Proof" },
                { value: "Aadhaar", label: "Verified Identity" },
                { value: "24/7", label: "Accessible" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#FF9933]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 border-y border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            {[
              { icon: Shield, text: "Blockchain Verified" },
              { icon: Lock, text: "End-to-End Encrypted" },
              { icon: FileCheck, text: "Aadhaar Authenticated" },
              { icon: Eye, text: "Fully Transparent" },
              { icon: IndianRupee, text: "Zero Cost to Citizens" },
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                <badge.icon className="w-4 h-4 text-[#0C2340]" />
                <span className="font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0C2340] mb-3">
            Why Choose AGORA?
          </h2>
          <p className="text-gray-600 text-lg">
            Built for a secure and transparent democratic process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Shield,
              title: "Immutable Records",
              description: "Every vote is permanently recorded on the blockchain. No tampering, no alteration, no deletion — ever.",
            },
            {
              icon: Lock,
              title: "Voter Privacy",
              description: "Your vote remains anonymous. Advanced cryptographic techniques ensure complete ballot secrecy.",
            },
            {
              icon: Vote,
              title: "Instant Counting",
              description: "Real-time, transparent vote tallying. Results are verifiable on the public blockchain ledger.",
            },
            {
              icon: Users,
              title: "Citizen-Friendly",
              description: "Simple and accessible interface designed for every Indian citizen to participate with ease.",
            },
            {
              icon: CheckCircle,
              title: "Auditable",
              description: "Complete audit trail available for election observers. Trust through full transparency.",
            },
            {
              icon: Landmark,
              title: "Scalable",
              description: "From panchayat elections to national polls — the system scales to serve any level of governance.",
            },
          ].map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:border-[#FF9933]/50 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="inline-flex p-3 rounded-lg bg-[#0C2340] mb-4">
                  <feature.icon className="w-5 h-5 text-[#FF9933]" />
                </div>
                <h3 className="text-lg font-bold text-[#0C2340] mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C2340] mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Three simple steps to cast your vote securely
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Register & Verify",
                description: "Submit your Aadhaar and Voter ID. Admin verifies your identity. One-time process.",
              },
              {
                step: "02",
                title: "Authenticate & Vote",
                description: "Login with OTP and MPIN. Browse active elections and cast your ballot securely.",
              },
              {
                step: "03",
                title: "View Results",
                description: "Results are tallied in real-time on the blockchain. Fully transparent and verifiable.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-5 bg-[#0C2340] rounded-full text-[#FF9933] text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-[#0C2340] mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0C2340] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Vote. Your Voice. Your Future.
            </h2>
            <p className="text-blue-200 text-lg mb-8">
              Join the digital governance revolution. Secure, transparent, and accessible to every citizen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth?tab=register">
                <Button
                  size="lg"
                  className="bg-[#FF9933] hover:bg-[#e88a2d] text-white px-8 py-6 text-lg font-semibold"
                >
                  Register Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 hover:bg-white/10 text-white px-8 py-6 text-lg"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#091a30] text-gray-400 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#FF9933] p-1.5 rounded">
                <Landmark className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-white font-semibold">AGORA</span>
                <span className="text-xs text-gray-500 ml-2">Digital Voting Platform</span>
              </div>
            </div>
            <div className="text-sm text-center">
              <p>&copy; 2025 AGORA. Blockchain-Powered Citizen Governance.</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>Privacy Policy</span>
              <span className="text-gray-600">|</span>
              <span>Terms of Service</span>
              <span className="text-gray-600">|</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Tricolor Band */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </div>
  )
}
