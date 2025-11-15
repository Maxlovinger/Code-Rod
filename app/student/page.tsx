"use client"

import { useState } from "react"
import { User, Calendar, BookOpen, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { AppHeader } from "@/components/app-header"

export default function StudentDashboard() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader currentPage="/student" />

      {/* Page Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <p className="text-white/70 mt-1">
              Manage your academic journey
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <Link href="/profile">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group h-40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <User className="text-blue-400" size={32} />
                <ArrowRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Profile</h2>
                <p className="text-white/70 text-sm">
                  Set major, minor, class year, and advisors
                </p>
              </div>
            </div>
          </Link>

          {/* Schedule Builder Card */}
          <Link href="/schedule">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group h-40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-green-400" size={32} />
                <ArrowRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Schedule</h2>
                <p className="text-white/70 text-sm">
                  View current semester calendar and classes
                </p>
              </div>
            </div>
          </Link>

          {/* Long Term Plan Card */}
          <Link href="/long-term">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group h-40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="text-orange-400" size={32} />
                <ArrowRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Long Term</h2>
                <p className="text-white/70 text-sm">
                  Mock schedule of classes over time
                </p>
              </div>
            </div>
          </Link>

          {/* Requirements Card */}
          <Link href="/requirements">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group h-40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <Target className="text-purple-400" size={32} />
                <ArrowRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Requirements</h2>
                <p className="text-white/70 text-sm">
                  Language, Domains (A,B,C), major/minor requirements
                </p>
              </div>
            </div>
          </Link>

        </div>

        {/* Quick Overview */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">15</p>
              <p className="text-sm text-white/70">Credits Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">4</p>
              <p className="text-sm text-white/70">Current Courses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">48%</p>
              <p className="text-sm text-white/70">Degree Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">Spring 2027</p>
              <p className="text-sm text-white/70">Expected Graduation</p>
            </div>
          </div>
          
          {/* Academic Status */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/70">Major: <span className="text-white font-medium">Computer Science</span></p>
                <p className="text-white/70 mt-1">Minor: <span className="text-white font-medium">Mathematics</span></p>
              </div>
              <div>
                <p className="text-white/70">Class Year: <span className="text-white font-medium">2025</span></p>
                <p className="text-white/70 mt-1">Advisor: <span className="text-white font-medium">Dr. Smith, Dr. Johnson</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}