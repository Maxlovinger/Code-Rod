"use client"

import { useState } from "react"
import { User, Mail, Lock, UserCheck, ArrowLeft } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "student"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userName', formData.fullName)
        localStorage.setItem('userType', formData.userType)
        
        // Redirect based on user type
        window.location.href = formData.userType === 'student' ? '/student' : '/advisor'
      } else {
        alert('Registration failed')
      }
    } catch (error) {
      alert('Registration failed')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Join Schemer</h1>
            <p className="text-white/70">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40"
                  placeholder="your.email@haverford.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'student' })}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    formData.userType === 'student'
                      ? 'bg-red-500/20 border-red-500/50 text-red-200'
                      : 'bg-white/5 border-white/20 text-white/70 hover:border-white/40'
                  }`}
                >
                  <User className="mx-auto mb-2" size={24} />
                  <span className="text-sm font-medium">Student</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'advisor' })}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    formData.userType === 'advisor'
                      ? 'bg-red-500/20 border-red-500/50 text-red-200'
                      : 'bg-white/5 border-white/20 text-white/70 hover:border-white/40'
                  }`}
                >
                  <UserCheck className="mx-auto mb-2" size={24} />
                  <span className="text-sm font-medium">Advisor</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25 border border-red-400/30"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{" "}
              <a href="/" className="text-red-400 hover:text-red-300 transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}