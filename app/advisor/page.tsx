"use client"

import { useState } from 'react'
import { Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { AnimatedBackground } from '@/components/animated-background'
import { AppHeader } from '@/components/app-header'

interface Student {
  id: string
  name: string
  major: string
  year: string
  creditsCompleted: number
  totalCredits: number
  onTrack: boolean
  lastMeeting?: string
}

export default function AdvisorDashboard() {
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      major: 'Computer Science',
      year: 'Sophomore',
      creditsCompleted: 16,
      totalCredits: 32,
      onTrack: true,
      lastMeeting: '2024-10-15'
    },
    {
      id: '2',
      name: 'Bob Smith',
      major: 'Mathematics',
      year: 'Junior',
      creditsCompleted: 18,
      totalCredits: 32,
      onTrack: false,
      lastMeeting: '2024-09-20'
    },
    {
      id: '3',
      name: 'Carol Davis',
      major: 'Physics',
      year: 'Senior',
      creditsCompleted: 28,
      totalCredits: 32,
      onTrack: true,
      lastMeeting: '2024-11-01'
    },
    {
      id: '4',
      name: 'David Wilson',
      major: 'Biology',
      year: 'Freshman',
      creditsCompleted: 6,
      totalCredits: 32,
      onTrack: false,
      lastMeeting: '2024-08-30'
    }
  ])

  const onTrackCount = students.filter(s => s.onTrack).length
  const needsAttentionCount = students.filter(s => !s.onTrack).length

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader currentPage="/advisor" />

      {/* Page Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-white">Advisor Dashboard</h1>
          <p className="text-white/70 mt-1">Monitor your advisees' academic progress</p>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg shadow-blue-500/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{students.length}</h3>
                <p className="text-white/70 mt-1">Total Advisees</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg shadow-green-500/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{onTrackCount}</h3>
                <p className="text-white/70 mt-1">On Track</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{needsAttentionCount}</h3>
                <p className="text-white/70 mt-1">Need Attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Student Progress Overview
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {students.map((student) => (
              <div 
                key={student.id} 
                className="p-6 bg-white/5 border-b border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-white mr-3">
                        {student.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        student.onTrack
                          ? 'bg-green-500/10 border-green-500/30 text-green-300'
                          : 'bg-red-500/10 border-red-500/30 text-red-300'
                      }`}>
                        {student.onTrack ? 'On Track' : 'Needs Attention'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-white/70 mb-3">
                      <span>{student.major}</span>
                      <span>•</span>
                      <span>{student.year}</span>
                      <span>•</span>
                      <span>Last meeting: {student.lastMeeting || 'Never'}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm text-white/70 mb-1">
                          <span>Progress</span>
                          <span>{student.creditsCompleted}/{student.totalCredits} credits</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              student.onTrack
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                                : 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50'
                            }`}
                            style={{ width: `${(student.creditsCompleted / student.totalCredits) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}