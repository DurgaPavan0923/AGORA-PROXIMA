"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Vote } from "lucide-react"
import { IndianFlag } from "@/components/indian-flag"

interface HeroProps {
  onGetStarted?: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-gray-50 py-16 sm:py-24">
      {/* Professional grid pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(100 116 139 / 0.08) 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-blue-900">Official Government Portal</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Digital Democracy <br />
                <span className="text-blue-600">Platform</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Participate in secure, transparent elections with blockchain-verified voting. 
                A modernized platform for citizen engagement and democratic governance.
              </p>

              <div className="p-5 border-l-4 border-blue-600 bg-blue-50/50 rounded-r-lg">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold">Secure by Design:</span> Your vote is protected with end-to-end encryption 
                  and stored immutably on blockchain technology.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 group shadow-lg shadow-blue-600/20"
              >
                <Vote className="w-5 h-5 mr-2" />
                Access Voting Portal
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 hover:bg-slate-50"
                onClick={() => document.getElementById("news")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Local Updates
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div className="slide-up stagger-1 text-center">
                <p className="text-3xl font-bold text-blue-600">256-bit</p>
                <p className="text-xs text-slate-600 mt-1">Encryption</p>
              </div>
              <div className="slide-up stagger-2 text-center">
                <p className="text-3xl font-bold text-blue-600">1:1</p>
                <p className="text-xs text-slate-600 mt-1">Verified Vote</p>
              </div>
              <div className="slide-up stagger-3 text-center">
                <p className="text-3xl font-bold text-blue-600">24/7</p>
                <p className="text-xs text-slate-600 mt-1">Available</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Professional illustration */}
          <div className="relative hidden md:flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl border-2 border-slate-200 shadow-2xl flex items-center justify-center p-12">
                <div className="text-center space-y-6 w-full">
                  <div className="relative">
                    <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
                      <Vote className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <span className="text-xs text-white font-bold">✓</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-lg font-bold text-slate-900">Blockchain Verified</p>
                    <p className="text-sm text-slate-600">Every vote is cryptographically secured and permanently recorded</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500">Secure</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500">Private</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500">Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
