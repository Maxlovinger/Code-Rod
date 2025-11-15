"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { ShimmerButton } from "@/components/shimmer-button"

interface AppHeaderProps {
  showGetStarted?: boolean
  currentPage?: string
}

export function AppHeader({ showGetStarted = false, currentPage }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/schedule", label: "Schedule" },
    { href: "/requirements", label: "Requirements" },
    { href: "/profile", label: "Profile" },
    { href: "/advisor", label: "Advisor" },
  ]

  return (
    <>
      <header className="relative z-10 px-6 py-6 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <img src="/logo.png" alt="Schemer" className="h-10 w-auto rounded-lg cursor-pointer" />
            </Link>
            <div className="hidden sm:block">
              <p className="text-white/60 text-xs">Haverford College</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  currentPage === link.href
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {showGetStarted && (
              <Link href="/schedule">
                <ShimmerButton className="hidden md:flex bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-red-500/25 border border-red-400/30">
                  Get Started
                </ShimmerButton>
              </Link>
            )}
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 z-20 shadow-2xl">
          <nav className="flex flex-col space-y-6 px-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-all duration-300 hover:translate-x-2 ${
                  currentPage === link.href
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {showGetStarted && (
              <div className="pt-4 border-t border-white/10">
                <Link href="/schedule">
                  <ShimmerButton className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg w-full border border-red-400/30">
                    Get Started
                  </ShimmerButton>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
