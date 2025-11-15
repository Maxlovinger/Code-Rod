"use client"

import { useState, useEffect } from "react"
import { Calendar, BookOpen, Plus, X } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { AppHeader } from "@/components/app-header"
import { supabase } from "@/lib/supabase"
import { mockCourses } from "@/lib/mock-data"

interface PlannedCourse {
  id: string
  course_id: string
  course_code: string
  course_title: string
  credits: number
  department: string
  semester: string
  year: number
}

export default function LongTermPlanPage() {
  const [plannedCourses, setPlannedCourses] = useState<PlannedCourse[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState("Fall")
  const [selectedYear, setSelectedYear] = useState(2024)
  const [selectedCourse, setSelectedCourse] = useState("")
  const [graduationYear, setGraduationYear] = useState(2027)

  useEffect(() => {
    loadPlannedCourses()
    loadGraduationYear()
  }, [])

  const loadPlannedCourses = async () => {
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) return

    const { data, error } = await supabase
      .from('planned_courses')
      .select('*')
      .eq('user_email', userEmail)
      .order('year', { ascending: true })
      .order('semester', { ascending: true })

    if (data && !error) {
      console.log('Loaded planned courses:', data)
      setPlannedCourses(data)
    } else if (error) {
      console.error('Error loading courses:', error)
    }
  }

  const loadGraduationYear = async () => {
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) return

    const { data, error } = await supabase
      .from('profiles')
      .select('class_year')
      .eq('email', userEmail)
      .single()

    if (data && !error && data.class_year) {
      setGraduationYear(data.class_year)
    }
  }

  const addCourse = async () => {
    if (!selectedCourse) return
    
    const course = mockCourses.find(c => c.id === selectedCourse)
    if (!course) return

    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) return

    const { data, error } = await supabase
      .from('planned_courses')
      .insert({
        user_email: userEmail,
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        credits: course.credits,
        department: course.department,
        semester: selectedSemester,
        year: selectedYear
      })
      .select()

    if (error) {
      console.error('Error adding course:', error)
      alert('Failed to add course: ' + error.message)
    } else {
      await loadPlannedCourses()
      setShowAddModal(false)
      setSelectedCourse("")
    }
  }

  const removeCourse = async (courseId: string) => {
    const { error } = await supabase
      .from('planned_courses')
      .delete()
      .eq('id', courseId)

    if (!error) {
      loadPlannedCourses()
    }
  }

  // Create 4 year containers based on graduation year
  const yearContainers = [
    graduationYear - 3,
    graduationYear - 2, 
    graduationYear - 1,
    graduationYear
  ]

  const getCoursesForYearSemester = (year: number, semester: string) => {
    const filtered = plannedCourses.filter(course => course.year === year && course.semester === semester)
    console.log(`Courses for ${semester} ${year}:`, filtered)
    return filtered
  }
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader currentPage="/long-term" />

      {/* Page Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Long Term Academic Plan</h1>
              <p className="text-white/70 mt-1">
                Your projected course schedule through graduation
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30"
            >
              <Plus size={20} />
              Add Course
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {yearContainers.map((year, index) => {
            const yearNames = ["First Year", "Second Year", "Third Year", "Fourth Year"]
            return (
              <div key={year} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-blue-400" size={24} />
                <h2 className="text-xl font-semibold text-white">{yearNames[index]}</h2>
              </div>

              {/* Fall Semester */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white/90 mb-3">Fall {year - 1}</h3>
                <div className="space-y-2">
                  {getCoursesForYearSemester(year, "Fall").map((course) => (
                    <div 
                      key={course.id} 
                      className="flex items-start justify-between p-3 bg-white/5 border border-white/10 rounded-lg group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{course.course_code}</p>
                        <p className="text-white/80 text-xs mt-1">{course.course_title}</p>
                        <p className="text-white/60 text-xs mt-1">{course.department}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-xs">{course.credits}cr</span>
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1 hover:bg-red-500/20 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-xs text-white/70">
                    Credits: <span className="font-medium text-white">{getCoursesForYearSemester(year, "Fall").reduce((sum, c) => sum + c.credits, 0)}</span>
                  </p>
                </div>
              </div>

              {/* Spring Semester */}
              <div>
                <h3 className="text-lg font-medium text-white/90 mb-3">Spring {year}</h3>
                <div className="space-y-2">
                  {getCoursesForYearSemester(year, "Spring").map((course) => (
                    <div 
                      key={course.id} 
                      className="flex items-start justify-between p-3 bg-white/5 border border-white/10 rounded-lg group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{course.course_code}</p>
                        <p className="text-white/80 text-xs mt-1">{course.course_title}</p>
                        <p className="text-white/60 text-xs mt-1">{course.department}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-xs">{course.credits}cr</span>
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1 hover:bg-red-500/20 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-xs text-white/70">
                    Credits: <span className="font-medium text-white">{getCoursesForYearSemester(year, "Spring").reduce((sum, c) => sum + c.credits, 0)}</span>
                  </p>
                </div>
              </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 max-w-md w-full">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Add Course to Plan</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white bg-black"
                >
                  <option value="">Choose a course</option>
                  {mockCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Semester</label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white bg-black"
                  >
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white bg-black"
                  >
                    {Array.from({ length: 5 }, (_, i) => graduationYear - 4 + i).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={addCourse}
                  disabled={!selectedCourse}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCourse
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }`}
                >
                  Add Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}