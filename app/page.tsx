"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Menu } from "lucide-react"
import { LineShadowText } from "@/components/line-shadow-text"
import { ShimmerButton } from "@/components/shimmer-button"
import { useState } from "react"
import Link from "next/link"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="neonPulse1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                <stop offset="30%" stopColor="rgba(239,68,68,1)" />
                <stop offset="70%" stopColor="rgba(220,38,38,0.8)" />
                <stop offset="100%" stopColor="rgba(220,38,38,0)" />
              </radialGradient>
              <radialGradient id="neonPulse2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="25%" stopColor="rgba(239,68,68,0.9)" />
                <stop offset="60%" stopColor="rgba(185,28,28,0.7)" />
                <stop offset="100%" stopColor="rgba(185,28,28,0)" />
              </radialGradient>
              <radialGradient id="neonPulse3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                <stop offset="35%" stopColor="rgba(239,68,68,1)" />
                <stop offset="75%" stopColor="rgba(185,28,28,0.6)" />
                <stop offset="100%" stopColor="rgba(185,28,28,0)" />
              </radialGradient>
              <linearGradient id="threadFade1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,1)" />
                <stop offset="15%" stopColor="rgba(220,38,38,0.8)" />
                <stop offset="85%" stopColor="rgba(220,38,38,0.8)" />
                <stop offset="100%" stopColor="rgba(0,0,0,1)" />
              </linearGradient>
              <linearGradient id="threadFade2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,1)" />
                <stop offset="12%" stopColor="rgba(239,68,68,0.7)" />
                <stop offset="88%" stopColor="rgba(239,68,68,0.7)" />
                <stop offset="100%" stopColor="rgba(0,0,0,1)" />
              </linearGradient>
              <linearGradient id="threadFade3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,1)" />
                <stop offset="18%" stopColor="rgba(185,28,28,0.8)" />
                <stop offset="82%" stopColor="rgba(185,28,28,0.8)" />
                <stop offset="100%" stopColor="rgba(0,0,0,1)" />
              </linearGradient>
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g>
              {/* Thread 1 */}
              <path
                id="thread1"
                d="M50 720 Q200 590 350 540 Q500 490 650 520 Q800 550 950 460 Q1100 370 1200 340"
                stroke="url(#threadFade1)"
                strokeWidth="0.8"
                fill="none"
                opacity="0.8"
              />
              <circle r="2" fill="url(#neonPulse1)" opacity="1" filter="url(#neonGlow)">
                <animateMotion dur="4s" repeatCount="indefinite">
                  <mpath href="#thread1" />
                </animateMotion>
              </circle>

              {/* Thread 2 */}
              <path
                id="thread2"
                d="M80 730 Q250 620 400 570 Q550 520 700 550 Q850 580 1000 490 Q1150 400 1300 370"
                stroke="url(#threadFade2)"
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
              />
              <circle r="3" fill="url(#neonPulse2)" opacity="1" filter="url(#neonGlow)">
                <animateMotion dur="5s" repeatCount="indefinite">
                  <mpath href="#thread2" />
                </animateMotion>
              </circle>

              {/* Thread 3 */}
              <path
                id="thread3"
                d="M20 710 Q180 580 320 530 Q460 480 600 510 Q740 540 880 450 Q1020 360 1200 330"
                stroke="url(#threadFade3)"
                strokeWidth="1.2"
                fill="none"
                opacity="0.8"
              />
              <circle r="2.5" fill="url(#neonPulse1)" opacity="1" filter="url(#neonGlow)">
                <animateMotion dur="4.5s" repeatCount="indefinite">
                  <mpath href="#thread3" />
                </animateMotion>
              </circle>

              {/* Thread 4 */}
              <path
                id="thread4"
                d="M120 740 Q280 640 450 590 Q620 540 770 570 Q920 600 1070 510 Q1220 420 1350 390"
                stroke="url(#threadFade1)"
                strokeWidth="0.6"
                fill="none"
                opacity="0.6"
              />
              <circle r="1.5" fill="url(#neonPulse3)" opacity="1" filter="url(#neonGlow)">
                <animateMotion dur="5.5s" repeatCount="indefinite">
                  <mpath href="#thread4" />
                </animateMotion>
              </circle>

              {/* Thread 5 */}
              <path
                id="thread5"
                d="M60 725 Q220 600 380 550 Q540 500 680 530 Q820 560 960 470 Q1100 380 1280 350"
                stroke="url(#threadFade2)"
                strokeWidth="1.0"
                fill="none"
                opacity="0.7"
              />
              <circle r="2.2" fill="url(#neonPulse2)" opacity="1" filter="url(#neonGlow)">
                <animateMotion dur="4.2s" repeatCount="indefinite">
                  <mpath href="#thread5" />
                </animateMotion>
              </circle>

              {/* Thread 6 */}
              <path
                id="thread6"
                d="M150 735 Q300 660 480 610 Q660 560 800 590 Q940 620 1080 530 Q1220 440 1400 410"
                stroke="url(#threadFade3)"
                strokeWidth="1.3"
                fill="none"
                opacity="0.6"
              />
              <circle r="2.8" fill="url(#neonPulse1)" opacity="1" filter="url(#neonGlow)">
                <animateMotion dur="5.2s" repeatCount="indefinite">
                  <mpath href="#thread6" />
                </animateMotion>
              </circle>

              {/* Thread 7 */}
              <path
                id="thread7"
                d="M40 715 Q190 585 340 535 Q490 485 630 515 Q770 545 910 455 Q1050 365 1250 335"
                stroke="url(#threadFade1)"
                strokeWidth="0.9"
                fill="none"
                opacity="0.8"
              />
              <circle r="2" fill="url(#neonPulse3)" opacity="1" filter="url(#neonGlow)">
                <animateMotion dur="4.8s" repeatCount="indefinite">
                  <mpath href="#thread7" />
                </animateMotion>
              </circle>

              {/* Thread 8 */}
              <path
                id="thread8"
                d="M100 728 Q260 630 420 580 Q580 530 720 560 Q860 590 1000 500 Q1140 410 1320 380"
                stroke="url(#threadFade2)"
                strokeWidth="1.4"
                fill="none"
                opacity="0.7"
              />
              <circle r="3" fill="url(#neonPulse2)" opacity="1" filter="url(#neonGlow)">
                <animateMotion dur="5.8s" repeatCount="indefinite">
                  <mpath href="#thread8" />
                </animateMotion>
              </circle>
            </g>
          </svg>
        </div>
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-6 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-500/25">
            S
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-semibold text-lg">Schemer</h1>
            <p className="text-white/60 text-xs">Haverford College</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/student" className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium hover:scale-105">
            Student Portal
          </Link>
          <Link href="/advisor" className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium hover:scale-105">
            Advisor Portal
          </Link>
          <a href="#" className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium hover:scale-105">
            About
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium hover:scale-105">
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>

          <ShimmerButton className="hidden md:flex bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-red-500/25 border border-red-400/30">
            Get Started
          </ShimmerButton>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 z-20 shadow-2xl">
          <nav className="flex flex-col space-y-6 px-6 py-8">
            <Link href="/student" className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:translate-x-2">
              Student Portal
            </Link>
            <Link href="/advisor" className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:translate-x-2">
              Advisor Portal
            </Link>
            <a href="#" className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:translate-x-2">
              About
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:translate-x-2">
              Contact
            </a>
            <div className="pt-4 border-t border-white/10">
              <ShimmerButton className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg w-full border border-red-400/30">
                Get Started
              </ShimmerButton>
            </div>
          </nav>
        </div>
      )}

      <main className="relative z-10 flex flex-col items-start justify-center min-h-[calc(100vh-100px)] px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-2">
            <span className="text-white text-xs md:text-xs">Haverford College Course Planning</span>
          </div>
        </div>

        <h1 className="text-white text-4xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-bold leading-tight mb-4 sm:mb-6 text-balance">
          Plan Your Academic
          <br />
          Journey in{" "}
          <LineShadowText className="italic font-light" shadowColor="white">
            Minutes
          </LineShadowText>
        </h1>

        <p className="text-white/70 text-sm sm:text-base md:text-sm lg:text-2xl mb-6 sm:mb-8 max-w-2xl text-pretty">
          Track requirements, schedule courses,
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          and stay on track for graduation.
        </p>

        <Link href="/student">
          <Button className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base md:text-xs lg:text-lg font-semibold flex items-center gap-2 backdrop-blur-sm border border-red-400/30 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
            Get Started
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </Link>
      </main>
    </div>
  )
}