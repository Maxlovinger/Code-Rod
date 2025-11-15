"use client"

import { useState } from 'react'
import { Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Advisor Dashboard</h1>
          <p className="text-gray-600">Monitor your advisees' academic progress</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{students.length}</h3>
                <p className="text-gray-600">Total Advisees</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{onTrackCount}</h3>
                <p className="text-gray-600">On Track</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{needsAttentionCount}</h3>
                <p className="text-gray-600">Need Attention</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Student Progress Overview
            </h2>
          </div>

          <div className="divide-y">
            {students.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-800 mr-3">
                        {student.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.onTrack 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.onTrack ? 'On Track' : 'Needs Attention'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{student.major}</span>
                      <span>•</span>
                      <span>{student.year}</span>
                      <span>•</span>
                      <span>Last meeting: {student.lastMeeting || 'Never'}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{student.creditsCompleted}/{student.totalCredits} credits</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              student.onTrack ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(student.creditsCompleted / student.totalCredits) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
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