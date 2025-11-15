"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  BookOpen,
} from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { AppHeader } from "@/components/app-header"
import { supabase } from "@/lib/supabase"



export default function SchedulePage() {
  const [studentName, setStudentName] = useState('')
  const [plannedCourses, setPlannedCourses] = useState<any[]>([])
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([])
  const [selectedSemester, setSelectedSemester] = useState('')
  const [semesterCourses, setSemesterCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = localStorage.getItem('userEmail')
      if (!userEmail) return

      try {
        // Fetch student profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', userEmail)
          .single()

        if (profile) {
          setStudentName(profile.full_name || 'Student')
        }

        // Fetch planned courses
        let { data: planned } = await supabase
          .from('planned_courses')
          .select('*')
          .eq('user_id', profile?.id)

        if (!planned || planned.length === 0) {
          const { data: plannedByEmail } = await supabase
            .from('planned_courses')
            .select('*')
            .eq('user_email', userEmail)
          
          planned = plannedByEmail || []
        }

        setPlannedCourses(planned)

        // Get unique semesters
        const semesters = [...new Set(planned.map(course => `${course.semester} ${course.year}`))]
        setAvailableSemesters(semesters)
        
        if (semesters.length > 0 && !selectedSemester) {
          setSelectedSemester(semesters[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (selectedSemester) {
      const [semester, year] = selectedSemester.split(' ')
      const courses = plannedCourses.filter(course => 
        course.semester === semester && course.year === parseInt(year)
      )
      setSemesterCourses(courses)
    }
  }, [selectedSemester, plannedCourses])



  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader currentPage="/schedule" />

      {/* Page Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Schedule Builder</h1>
              <p className="text-white/70 mt-1">
                {selectedSemester} • {studentName}
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white [color-scheme:dark]"
              >
                <option value="">Select Semester</option>
                {availableSemesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Courses</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {semesterCourses.length}
                  </p>
                </div>
                <BookOpen className="text-blue-400" size={24} />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Credits</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {semesterCourses.reduce((total, course) => total + (course.credits || 0), 0)}
                  </p>
                </div>
                <Calendar className="text-green-400" size={24} />
              </div>
            </div>
          </div>


        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-white/60">Loading schedule...</p>
          </div>
        ) : !selectedSemester ? (
          <div className="text-center py-12">
            <p className="text-white/60">Please select a semester to view your schedule</p>
          </div>
        ) : semesterCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">No courses planned for {selectedSemester}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Weekly Calendar Grid */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Weekly Schedule - {selectedSemester}</h2>
              </div>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="grid grid-cols-6 border-b border-white/10">
                    <div className="p-4 bg-white/5 border-r border-white/10">
                      <Clock size={20} className="text-white/60" />
                    </div>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <div key={day} className="p-4 bg-white/5 text-center border-r border-white/10">
                        <p className="font-semibold text-white">{day}</p>
                      </div>
                    ))}
                  </div>

                  {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                    <div key={time} className="grid grid-cols-6 border-b border-white/10 min-h-16">
                      <div className="p-4 bg-white/5 border-r border-white/10 text-sm text-white/70">
                        {time}
                      </div>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                        let courseAtTime = null
                        let courseIndex = -1
                        
                        semesterCourses.forEach((course, index) => {
                          // Mock meeting times - classes meet 2-3 times per week
                          const schedulePatterns = [
                            { days: ['Monday', 'Wednesday', 'Friday'], times: ['09:00', '10:00'] },
                            { days: ['Tuesday', 'Thursday'], times: ['11:00', '13:00'] },
                            { days: ['Monday', 'Wednesday'], times: ['14:00', '15:00'] },
                            { days: ['Tuesday', 'Thursday'], times: ['09:00', '10:00'] },
                            { days: ['Monday', 'Friday'], times: ['13:00', '14:00'] }
                          ]
                          const pattern = schedulePatterns[index % schedulePatterns.length]
                          if (pattern.days.includes(day) && pattern.times.includes(time)) {
                            courseAtTime = course
                            courseIndex = index
                          }
                        })
                        
                        const getCourseColor = (index: number) => {
                          const colors = [
                            'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/40 text-blue-200',
                            'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/40 text-green-200',
                            'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/40 text-purple-200',
                            'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/40 text-orange-200',
                            'bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-pink-500/40 text-pink-200',
                            'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/40 text-cyan-200',
                            'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/40 text-red-200',
                            'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/40 text-yellow-200'
                          ]
                          return colors[index % colors.length]
                        }

                        return (
                          <div key={day} className="border-r border-white/10 relative bg-white/[0.02] p-2">
                            {courseAtTime && (
                              <div className={`${getCourseColor(courseIndex)} border backdrop-blur-md rounded p-2 text-xs hover:scale-105 transition-all duration-300`}>
                                <p className="font-semibold">{courseAtTime.course_code}</p>
                                <p className="truncate mt-1">{courseAtTime.course_name}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course List */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Course Details</h2>
              <div className="grid gap-4">
                {semesterCourses.map((course, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{course.course_code}</p>
                        <p className="text-white/90 mt-1">{course.course_name}</p>
                        <p className="text-sm text-white/70 mt-1">
                          {course.credits} credits
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


      </main>


    </div>
  )
}
