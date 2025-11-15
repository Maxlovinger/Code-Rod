"use client"

import { useState, useEffect } from 'react'
import { Users, AlertTriangle, CheckCircle, TrendingUp, FileText, Save, Plus, X } from 'lucide-react'
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
  const [allStudents, setAllStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showStudentDetails, setShowStudentDetails] = useState(false)
  const [studentDetails, setStudentDetails] = useState<any>(null)
  const [plannedCourses, setPlannedCourses] = useState<any[]>([])
  const [studentNotes, setStudentNotes] = useState('')
  const [lastMeeting, setLastMeeting] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('')

  // Fetch advisor's students and all students
  useEffect(() => {
    const fetchStudents = async () => {
      const advisorEmail = localStorage.getItem('userEmail')
      if (!advisorEmail) return

      try {
        // Fetch all students for dropdown first
        const { data: allStudentsData, error: allError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'student')

        console.log('All students data:', allStudentsData)
        console.log('All students error:', allError)

        if (allStudentsData) {
          setAllStudents(allStudentsData)
          console.log('Set all students:', allStudentsData.length)
        }

        // Fetch advisor's assigned students using a simpler approach
        const { data: advisorStudentIds, error: advisorError } = await supabase
          .from('advisor_students')
          .select('student_id')
          .eq('advisor_email', advisorEmail)

        if (advisorError) {
          console.log('Advisor students table error:', advisorError)
          setStudents([])
          setLoading(false)
          return
        }

        // Get the student IDs
        const studentIds = advisorStudentIds?.map(item => item.student_id) || []
        
        if (studentIds.length === 0) {
          setStudents([])
          setLoading(false)
          return
        }

        // Fetch the actual student profiles
        const { data: studentProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', studentIds)

        if (profilesError) {
          console.error('Error fetching student profiles:', profilesError)
          setStudents([])
          setLoading(false)
          return
        }

        if (studentProfiles) {
          // Fetch planned courses for all students to calculate total planned credits
          const studentsWithPlannedCredits = await Promise.all(
            studentProfiles.map(async (student) => {
              const completedCourses = student.completed_courses || []
              const creditsCompleted = completedCourses.reduce((total: number, course: any) => {
                return total + (course.credits || 0)
              }, 0)

              // Fetch planned courses for this student
              let { data: plannedData } = await supabase
                .from('planned_courses')
                .select('credits')
                .eq('user_id', student.id)

              // If no results with user_id, try with email
              if (!plannedData || plannedData.length === 0) {
                const { data: plannedByEmail } = await supabase
                  .from('planned_courses')
                  .select('credits')
                  .eq('user_email', student.email)
                
                plannedData = plannedByEmail
              }

              const plannedCredits = plannedData?.reduce((total: number, course: any) => {
                return total + (course.credits || 0)
              }, 0) || 0

              const totalCreditsEarned = creditsCompleted + plannedCredits

              // Map class year to year label
              const yearLabels: { [key: number]: string } = {
                2025: 'Senior',
                2026: 'Junior',
                2027: 'Sophomore',
                2028: 'Freshman'
              }
              const yearLabel = yearLabels[student.class_year] || `Class of ${student.class_year}`

              // Determine if student is on track (out of 32 total credits needed)
              const onTrack = totalCreditsEarned >= 28 // Allow 4 credit buffer from 32

              return {
                id: student.id,
                name: student.full_name || 'Unknown Student',
                major: Array.isArray(student.major) ? student.major.join(', ') : 'Undeclared',
                year: yearLabel,
                creditsCompleted: totalCreditsEarned,
                totalCredits: 32,
                onTrack: onTrack,
                lastMeeting: student.last_meeting ? new Date(student.last_meeting).toLocaleDateString() : 'Never'
              }
            })
          )

          setStudents(studentsWithPlannedCredits)
        }
      } catch (error) {
        console.error('Failed to fetch students:', error)
        setStudents([])
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
        setStudentNotes(data.advisor_notes || '')
        setLastMeeting(data.last_meeting || '')

        // Fetch planned courses - try both user_id and email
        let { data: plannedData, error: plannedError } = await supabase
          .from('planned_courses')
          .select('*')
          .eq('user_id', selectedStudent.id)
          .order('year', { ascending: true })
          .order('semester', { ascending: true })

        // If no results with user_id, try with email
        if (!plannedData || plannedData.length === 0) {
          const { data: plannedByEmail, error: emailError } = await supabase
            .from('planned_courses')
            .select('*')
            .eq('user_email', data.email)
            .order('year', { ascending: true })
            .order('semester', { ascending: true })
          
          plannedData = plannedByEmail
          plannedError = emailError
        }

        console.log('Planned courses data:', plannedData)
        console.log('Planned courses error:', plannedError)
        console.log('Student ID:', selectedStudent.id)
        console.log('Student email:', data.email)

        if (!plannedError && plannedData) {
          setPlannedCourses(plannedData)
        }
      } catch (error) {
        console.error('Failed to fetch student details:', error)
      }
    }

    fetchStudentDetails()
  }, [selectedStudent])

  const addStudentToAdvisor = async () => {
    if (!selectedStudentToAdd) return
    
    const advisorEmail = localStorage.getItem('userEmail')
    if (!advisorEmail) return

    try {
      const { error } = await supabase
        .from('advisor_students')
        .insert({
          advisor_email: advisorEmail,
          student_id: selectedStudentToAdd
        })

      if (error) {
        console.error('Error adding student:', error)
        alert('Failed to add student. The advisor_students table may not exist yet.')
      } else {
        setShowAddStudent(false)
        setSelectedStudentToAdd('')
        // Refresh the students list
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to add student:', error)
      alert('Failed to add student. The advisor_students table may not exist yet.')
    }
  }

  const removeStudentFromAdvisor = async (studentId: string) => {
    const advisorEmail = localStorage.getItem('userEmail')
    if (!advisorEmail) return

    if (!confirm('Are you sure you want to remove this student from your advisees?')) return

    try {
      const { error } = await supabase
        .from('advisor_students')
        .delete()
        .eq('advisor_email', advisorEmail)
        .eq('student_id', studentId)

      if (error) {
        console.error('Error removing student:', error)
        alert('Failed to remove student')
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to remove student:', error)
      alert('Failed to remove student')
    }
  }

  const saveNotes = async () => {
    if (!selectedStudent) return
    
    const advisorEmail = localStorage.getItem('userEmail')
    if (!advisorEmail) return
    
    setSavingNotes(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          advisor_notes: studentNotes,
          last_meeting: lastMeeting 
        })
        .eq('id', selectedStudent.id)

      if (error) {
        console.error('Error saving notes:', error)
        alert('Failed to save notes')
      }
    } catch (error) {
      console.error('Failed to save notes:', error)
      alert('Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }



  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader currentPage="/advisor" />

      {/* Page Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Advisor Dashboard</h1>
              <p className="text-white/70 mt-1">Monitor your advisees' academic progress</p>
            </div>
            <button
              onClick={() => setShowAddStudent(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30"
            >
              <Plus size={20} />
              Add Student
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg shadow-blue-500/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{students.length}</h3>
                <p className="text-white/70 mt-1">Total Advisees</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
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
                      <h3 className="text-lg font-semibold text-white">
                        {student.name}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-white/70 mb-3">
                      <span>{student.major}</span>
                      <span>•</span>
                      <span>{student.year}</span>
                      <span>•</span>
                      <span>Last meeting: {student.lastMeeting}</span>
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

                  <div className="ml-6 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedStudent(student)
                        setShowStudentDetails(true)
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => removeStudentFromAdvisor(student.id)}
                      className="px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-gray-500/25 hover:shadow-xl hover:shadow-gray-500/40 hover:scale-105 border border-gray-500/30"
                      title="Remove student"
                    >
                      <X size={16} />
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
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl shadow-red-500/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-red-500/50 hover:scrollbar-thumb-red-500/70">
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
                  setPlannedCourses([])
                  setStudentNotes('')
                  setLastMeeting('')
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
                        <input
                          type="date"
                          value={lastMeeting}
                          onChange={(e) => setLastMeeting(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Long-term Course Plan */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Long-term Course Plan ({plannedCourses.length} courses)</h3>
                    {plannedCourses.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-red-500/50 hover:scrollbar-thumb-red-500/70">
                        {plannedCourses.map((course, index) => (
                          <div key={index} className="bg-white/5 rounded p-3 border border-white/10">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">{course.course_code}</p>
                                <p className="text-white/70 text-sm">{course.course_name}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white/60 text-sm">{course.year} - {course.semester}</p>
                                <p className="text-white/60 text-sm">{course.credits} credits</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/60">No planned courses found</p>
                    )}
                  </div>

                  {/* Advisor Notes */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FileText size={20} className="text-blue-400" />
                        Advisor Notes
                      </h3>
                      <button
                        onClick={saveNotes}
                        disabled={savingNotes}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 border border-blue-400/30 disabled:opacity-50"
                      >
                        <Save size={16} />
                        {savingNotes ? 'Saving...' : 'Save Notes'}
                      </button>
                    </div>
                    <textarea
                      value={studentNotes}
                      onChange={(e) => setStudentNotes(e.target.value)}
                      placeholder="Add notes about this student's progress, meetings, concerns, etc..."
                      className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-white/40 resize-none"
                    />
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
                  setPlannedCourses([])
                  setStudentNotes('')
                  setLastMeeting('')
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 border border-red-400/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-blue-500/10 max-w-md w-full">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Add Student to Your Advisees</h2>
                <button
                  onClick={() => setShowAddStudent(false)}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Select Student</label>
                <select
                  value={selectedStudentToAdd}
                  onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white bg-black"
                >
                  <option value="">Choose a student</option>
                  {allStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddStudent(false)}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={addStudentToAdvisor}
                  disabled={!selectedStudentToAdd}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg border ${
                    selectedStudentToAdd
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 border-red-400/30 hover:scale-105"
                      : "bg-white/10 text-white/40 cursor-not-allowed border-white/20"
                  }`}
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}