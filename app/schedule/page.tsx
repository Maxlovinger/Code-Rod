"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
  Filter,
  ChevronDown,
  X,
} from "lucide-react"
import type { Course, ScheduledCourse, SemesterSchedule, DayOfWeek } from "@/lib/types"
import { mockCourses, mockStudentProfile } from "@/lib/mock-data"
import {
  detectScheduleConflicts,
  canAddCourse,
  formatCourseTimes,
  calculateTotalCredits,
  timeToMinutes,
} from "@/lib/schedule-utils"
import { saveCurrentSemesterSchedule, loadCurrentSemesterSchedule } from "@/lib/storage"
import { AnimatedBackground } from "@/components/animated-background"
import { AppHeader } from "@/components/app-header"

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
]

export default function SchedulePage() {
  const [studentProfile] = useState(mockStudentProfile)
  const [currentSchedule, setCurrentSchedule] = useState<SemesterSchedule>({
    semester: "Fall",
    year: 2024,
    courses: [],
    totalCredits: 0,
    conflicts: [],
  })
  const [showCourseBrowser, setShowCourseBrowser] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All")

  // Load schedule from localStorage on mount
  useEffect(() => {
    const saved = loadCurrentSemesterSchedule()
    if (saved) {
      setCurrentSchedule(saved)
    }
  }, [])

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    saveCurrentSemesterSchedule(currentSchedule)
  }, [currentSchedule])

  // Update schedule whenever courses change
  useEffect(() => {
    const courses = currentSchedule.courses.map((sc) => sc.course)
    const totalCredits = calculateTotalCredits(courses)
    const conflicts = detectScheduleConflicts(currentSchedule.courses, studentProfile)

    setCurrentSchedule((prev) => ({
      ...prev,
      totalCredits,
      conflicts,
    }))
  }, [currentSchedule.courses, studentProfile])

  const addCourse = (course: Course) => {
    const validation = canAddCourse(course, currentSchedule.courses, studentProfile)

    if (!validation.canAdd) {
      alert(validation.reason)
      return
    }

    const scheduledCourse: ScheduledCourse = {
      course,
      addedAt: new Date(),
      status: "shopping",
    }

    setCurrentSchedule((prev) => ({
      ...prev,
      courses: [...prev.courses, scheduledCourse],
    }))

    setShowCourseBrowser(false)
  }

  const removeCourse = (courseId: string) => {
    setCurrentSchedule((prev) => ({
      ...prev,
      courses: prev.courses.filter((sc) => sc.course.id !== courseId),
    }))
  }

  const getCourseAtTime = (day: DayOfWeek, time: string): Course | null => {
    const timeMinutes = timeToMinutes(time)

    for (const sc of currentSchedule.courses) {
      for (const slot of sc.course.meetingTimes) {
        if (slot.day === day) {
          const startMinutes = timeToMinutes(slot.startTime)
          const endMinutes = timeToMinutes(slot.endTime)

          if (timeMinutes >= startMinutes && timeMinutes < endMinutes) {
            return sc.course
          }
        }
      }
    }

    return null
  }

  const departments = ["All", ...new Set(mockCourses.map((c) => c.department))].sort()

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      searchQuery === "" ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      selectedDepartment === "All" || course.department === selectedDepartment

    const notAlreadyAdded = !currentSchedule.courses.some((sc) => sc.course.id === course.id)

    const notCompleted = !studentProfile.completedCourses.some((c) => c.courseId === course.id)

    return matchesSearch && matchesDepartment && notAlreadyAdded && notCompleted
  })

  const getCourseDuration = (course: Course, day: DayOfWeek): number => {
    const slot = course.meetingTimes.find((s) => s.day === day)
    if (!slot) return 0

    const start = timeToMinutes(slot.startTime)
    const end = timeToMinutes(slot.endTime)
    return (end - start) / 60 // Convert to hours
  }

  const getCourseColor = (course: Course): string => {
    const colors = [
      "bg-blue-500/20 border-blue-500/40 text-blue-200 backdrop-blur-md",
      "bg-green-500/20 border-green-500/40 text-green-200 backdrop-blur-md",
      "bg-purple-500/20 border-purple-500/40 text-purple-200 backdrop-blur-md",
      "bg-orange-500/20 border-orange-500/40 text-orange-200 backdrop-blur-md",
      "bg-pink-500/20 border-pink-500/40 text-pink-200 backdrop-blur-md",
      "bg-cyan-500/20 border-cyan-500/40 text-cyan-200 backdrop-blur-md",
    ]

    // Use course ID to consistently assign colors
    const index = parseInt(course.id.split("-")[1] || "0", 10) % colors.length
    return colors[index]
  }

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
                {currentSchedule.semester} {currentSchedule.year} • {studentProfile.name}
              </p>
            </div>
            <button
              onClick={() => setShowCourseBrowser(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30"
            >
              <Plus size={20} />
              Add Course
            </button>
          </div>

          {/* Schedule Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Courses</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {currentSchedule.courses.length}
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
                    {currentSchedule.totalCredits}
                  </p>
                </div>
                <Calendar className="text-green-400" size={24} />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Conflicts</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {currentSchedule.conflicts.length}
                  </p>
                </div>
                {currentSchedule.conflicts.length > 0 ? (
                  <AlertCircle className="text-red-400" size={24} />
                ) : (
                  <CheckCircle className="text-green-400" size={24} />
                )}
              </div>
            </div>
          </div>

          {/* Conflicts Display */}
          {currentSchedule.conflicts.length > 0 && (
            <div className="mt-4 space-y-2">
              {currentSchedule.conflicts.map((conflict, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border backdrop-blur-md ${
                    conflict.severity === "error"
                      ? "bg-red-500/10 border-red-500/30 text-red-200"
                      : "bg-yellow-500/10 border-yellow-500/30 text-yellow-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{conflict.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Weekly Calendar Grid */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid grid-cols-6 border-b border-white/10">
                <div className="p-4 bg-white/5 border-r border-white/10">
                  <Clock size={20} className="text-white/60" />
                </div>
                {DAYS.map((day) => (
                  <div key={day} className="p-4 bg-white/5 text-center border-r border-white/10">
                    <p className="font-semibold text-white">{day}</p>
                  </div>
                ))}
              </div>

              {TIME_SLOTS.map((time) => (
                <div key={time} className="grid grid-cols-6 border-b border-white/10 min-h-16">
                  <div className="p-4 bg-white/5 border-r border-white/10 text-sm text-white/70">
                    {time}
                  </div>
                  {DAYS.map((day) => {
                    const course = getCourseAtTime(day, time)
                    const isFirstSlot = course
                      ? course.meetingTimes.some(
                          (slot) => slot.day === day && slot.startTime === time
                        )
                      : false

                    return (
                      <div key={day} className="border-r border-white/10 relative bg-white/[0.02]">
                        {course && isFirstSlot && (
                          <div
                            className={`absolute inset-1 rounded p-2 border-l-4 ${getCourseColor(
                              course
                            )} overflow-hidden`}
                            style={{
                              height: `${getCourseDuration(course, day) * 4}rem`,
                            }}
                          >
                            <p className="font-semibold text-xs leading-tight">
                              {course.code}
                            </p>
                            <p className="text-xs leading-tight mt-1 line-clamp-2">
                              {course.title}
                            </p>
                            <p className="text-xs mt-1 opacity-75">{course.location}</p>
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
        {currentSchedule.courses.length > 0 && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Enrolled Courses</h2>
            <div className="space-y-3">
              {currentSchedule.courses.map((sc) => (
                <div
                  key={sc.course.id}
                  className="flex items-start justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{sc.course.code}</p>
                        <p className="text-white/90 mt-1">{sc.course.title}</p>
                        <p className="text-sm text-white/70 mt-1">{sc.course.instructor}</p>
                        <p className="text-sm text-white/70 mt-1">
                          {formatCourseTimes(sc.course)} • {sc.course.location}
                        </p>
                        <p className="text-sm text-white/60 mt-1">
                          {sc.course.credits} credits
                        </p>
                      </div>
                      <button
                        onClick={() => removeCourse(sc.course.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/20 rounded"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Course Browser Modal */}
      {showCourseBrowser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-black border border-white/20 rounded-lg shadow-2xl shadow-red-500/20 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Add Course</h2>
                <button
                  onClick={() => setShowCourseBrowser(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="relative">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept} className="bg-black">
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
            </div>

            {/* Course List */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto text-white/40" size={48} />
                  <p className="text-white/60 mt-4">No courses found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCourses.map((course) => {
                    const validation = canAddCourse(
                      course,
                      currentSchedule.courses,
                      studentProfile
                    )

                    return (
                      <div
                        key={course.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <p className="font-semibold text-white">{course.code}</p>
                                <p className="text-white/90 mt-1">{course.title}</p>
                                <p className="text-sm text-white/70 mt-2">{course.description}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-white/70">
                                  <span>{course.instructor}</span>
                                  <span>{formatCourseTimes(course)}</span>
                                  <span>{course.credits} credits</span>
                                  <span>
                                    {course.currentEnrollment}/{course.maxEnrollment} enrolled
                                  </span>
                                </div>
                                {course.prerequisites.length > 0 && (
                                  <p className="text-xs text-white/60 mt-2">
                                    Prerequisites required
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => addCourse(course)}
                            disabled={!validation.canAdd}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                              validation.canAdd
                                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30"
                                : "bg-white/10 text-white/40 cursor-not-allowed border border-white/20"
                            }`}
                          >
                            {validation.canAdd ? "Add" : "Cannot Add"}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
