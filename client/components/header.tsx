"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface HeaderProps {
  onLoginClick?: () => void
}

export function Header({ onLoginClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={true} />
            <div className="hidden lg:block h-6 w-px bg-slate-300"></div>
            <span className="hidden lg:block text-xs text-slate-600 font-medium">Citizen Portal</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition">
              Features
            </a>
            <a href="#dashboard" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition">
              Dashboard
            </a>
            <a href="#about" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition">
              About
            </a>
          </nav>

          {/* Auth Button */}
          <motion.div 
            className="hidden sm:block"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button onClick={onLoginClick} className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
              Sign In
            </Button>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2 border-t border-slate-200 pt-4 mt-4">
            <a
              href="#features"
              className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition"
            >
              Features
            </a>
            <a
              href="#dashboard"
              className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition"
            >
              Dashboard
            </a>
            <a
              href="#about"
              className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition"
            >
              About
            </a>
            <Button onClick={onLoginClick} className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700">
              Sign In
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
