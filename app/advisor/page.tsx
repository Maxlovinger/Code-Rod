"use client"

import { useState, useEffect } from 'react'
import { Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { AnimatedBackground } from '@/components/animated-background'
import { AppHeader } from '@/components/app-header'
import { supabase } from '@/lib/supabase'

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
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showStudentDetails, setShowStudentDetails] = useState(false)
  const [studentDetails, setStudentDetails] = useState<any>(null)

  // Fetch students from Supabase
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'student')

        if (error) {
          console.error('Error fetching students:', error)
          setLoading(false)
          return
        }

        if (data) {
          // Transform Supabase data to Student interface
          const transformedStudents: Student[] = data.map((student) => {
            const completedCourses = student.completed_courses || []
            const creditsCompleted = completedCourses.reduce((total: number, course: any) => {
              return total + (course.credits || 0)
            }, 0)

            // Map class year to year label
            const yearLabels: { [key: number]: string } = {
              2025: 'Senior',
              2026: 'Junior',
              2027: 'Sophomore',
              2028: 'Freshman'
            }
            const yearLabel = yearLabels[student.class_year] || `Class of ${student.class_year}`

            // Determine if student is on track
            const currentYear = new Date().getFullYear()
            const yearsUntilGrad = student.class_year - currentYear
            const expectedCredits = Math.max(0, (4 - yearsUntilGrad) * 8) // ~8 credits per year
            const onTrack = creditsCompleted >= expectedCredits - 4 // Allow 4 credit buffer

            return {
              id: student.id,
              name: student.full_name || 'Unknown Student',
              major: Array.isArray(student.major) ? student.major.join(', ') : 'Undeclared',
              year: yearLabel,
              creditsCompleted: creditsCompleted,
              totalCredits: 32,
              onTrack: onTrack,
              lastMeeting: undefined // Could add this to database later
            }
          })

          setStudents(transformedStudents)
        }
      } catch (error) {
        console.error('Failed to fetch students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // Fetch detailed student information when selected
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!selectedStudent) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', selectedStudent.id)
          .single()

        if (error) {
          console.error('Error fetching student details:', error)
          return
        }

        setStudentDetails(data)
      } catch (error) {
        console.error('Failed to fetch student details:', error)
      }
    }

    fetchStudentDetails()
  }, [selectedStudent])

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
            {loading ? (
              <div className="p-12 text-center">
                <p className="text-white/60">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-white/60">No students found</p>
              </div>
            ) : (
              students.map((student) => (
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
                    <button
                      onClick={() => {
                        setSelectedStudent(student)
                        setShowStudentDetails(true)
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl shadow-red-500/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/20 flex items-center justify-between sticky top-0 bg-white/10 backdrop-blur-lg">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedStudent.name}</h2>
                <p className="text-white/70 text-sm mt-1">{selectedStudent.major} • {selectedStudent.year}</p>
              </div>
              <button
                onClick={() => {
                  setShowStudentDetails(false)
                  setSelectedStudent(null)
                  setStudentDetails(null)
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Progress Overview */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Progress Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-sm">Credits Completed</p>
                    <p className="text-2xl font-bold text-white">{selectedStudent.creditsCompleted}/{selectedStudent.totalCredits}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border mt-2 ${
                      selectedStudent.onTrack
                        ? 'bg-green-500/10 border-green-500/30 text-green-300'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}>
                      {selectedStudent.onTrack ? 'On Track' : 'Needs Attention'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round((selectedStudent.creditsCompleted / selectedStudent.totalCredits) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        selectedStudent.onTrack
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                          : 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50'
                      }`}
                      style={{ width: `${(selectedStudent.creditsCompleted / selectedStudent.totalCredits) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Student Information */}
              {studentDetails && (
                <>
                  {/* Contact Information */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-white/60 text-sm">Email</p>
                        <p className="text-white">{studentDetails.email || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Completed Courses */}
                  {studentDetails.completed_courses && studentDetails.completed_courses.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">Completed Courses</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {studentDetails.completed_courses.map((course: any, index: number) => (
                          <div key={index} className="bg-white/5 rounded p-3 border border-white/10">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">{course.code || 'Unknown Code'}</p>
                                <p className="text-white/70 text-sm">{course.name || 'Unknown Course'}</p>
                              </div>
                              <span className="text-white/60 text-sm">{course.credits || 0} credits</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-sm">Class Year</p>
                        <p className="text-white">{studentDetails.class_year || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Last Meeting</p>
                        <p className="text-white">{selectedStudent.lastMeeting || 'Never'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/20 bg-white/5">
              <button
                onClick={() => {
                  setShowStudentDetails(false)
                  setSelectedStudent(null)
                  setStudentDetails(null)
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 border border-red-400/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}