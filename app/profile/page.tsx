"use client"

import { useState, useEffect } from "react"
import { User, GraduationCap, Mail, Calendar, BookOpen, Plus, X, Check } from "lucide-react"
import type { StudentProfile, CompletedCourse, Semester } from "@/lib/types"
import { mockCourses } from "@/lib/mock-data"
import { saveStudentProfile, loadStudentProfile } from "@/lib/storage"
import { AnimatedBackground } from "@/components/animated-background"
import { AppHeader } from "@/components/app-header"

const MAJORS = [
  "Computer Science",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "English",
  "History",
  "Philosophy",
  "Economics",
  "Psychology",
  "Political Science",
  "Sociology",
]

const YEARS = [1, 2, 3, 4]
const SEMESTERS: Semester[] = ["Fall", "Spring", "Summer"]

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    id: "student-001",
    name: "",
    email: "",
    major: "",
    minor: "",
    currentYear: 1,
    currentSemester: "Fall",
    expectedGraduation: {
      semester: "Spring",
      year: new Date().getFullYear() + 4,
    },
    advisor: "",
    completedCourses: [],
    totalCreditsCompleted: 0,
  })

  const [showAddCourse, setShowAddCourse] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSemester, setSelectedSemester] = useState<Semester>("Fall")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1)
  const [selectedGrade, setSelectedGrade] = useState("A")
  const [saved, setSaved] = useState(false)

  // Load profile on mount
  useEffect(() => {
    const savedProfile = loadStudentProfile()
    if (savedProfile) {
      setProfile(savedProfile)
    }
  }, [])

  const handleSave = () => {
    // Calculate total credits
    const totalCredits = profile.completedCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    )

    const updatedProfile = {
      ...profile,
      totalCreditsCompleted: totalCredits,
    }

    saveStudentProfile(updatedProfile)
    setProfile(updatedProfile)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addCompletedCourse = () => {
    if (!selectedCourse) return

    const course = mockCourses.find((c) => c.id === selectedCourse)
    if (!course) return

    // Check if already added
    if (profile.completedCourses.some((c) => c.courseId === course.id)) {
      alert("Course already added to completed courses")
      return
    }

    const completedCourse: CompletedCourse = {
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      credits: course.credits,
      semester: selectedSemester,
      year: selectedYear,
      grade: selectedGrade,
      fulfills: course.fulfills,
    }

    setProfile((prev) => ({
      ...prev,
      completedCourses: [...prev.completedCourses, completedCourse],
    }))

    // Reset form
    setSelectedCourse("")
    setSearchQuery("")
    setShowAddCourse(false)
  }

  const removeCompletedCourse = (courseId: string) => {
    setProfile((prev) => ({
      ...prev,
      completedCourses: prev.completedCourses.filter((c) => c.courseId !== courseId),
    }))
  }

  const filteredCourses = mockCourses.filter(
    (course) =>
      searchQuery === "" ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const graduationYears = Array.from(
    { length: 8 },
    (_, i) => new Date().getFullYear() + i
  )

  const completionYears = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() - 4 + i
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader currentPage="/profile" />

      {/* Page Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Student Profile</h1>
              <p className="text-white/70 mt-1">
                Set up your academic profile and track completed courses
              </p>
            </div>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30"
            >
              {saved ? (
                <>
                  <Check size={20} />
                  Saved
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Basic Information */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <User size={24} className="text-blue-400" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="your.email@haverford.edu"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Major</label>
              <select
                value={profile.major}
                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
              >
                <option value="">Select major</option>
                {MAJORS.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Minor (Optional)
              </label>
              <select
                value={profile.minor || ""}
                onChange={(e) => setProfile({ ...profile, minor: e.target.value || undefined })}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
              >
                <option value="">No minor</option>
                {MAJORS.map((minor) => (
                  <option key={minor} value={minor}>
                    {minor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Advisor (Optional)
              </label>
              <input
                type="text"
                value={profile.advisor || ""}
                onChange={(e) => setProfile({ ...profile, advisor: e.target.value || undefined })}
                placeholder="Enter advisor name"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </div>

        {/* Academic Status */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-green-400" />
            Academic Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Current Year
              </label>
              <select
                value={profile.currentYear}
                onChange={(e) =>
                  setProfile({ ...profile, currentYear: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Current Semester
              </label>
              <select
                value={profile.currentSemester}
                onChange={(e) =>
                  setProfile({ ...profile, currentSemester: e.target.value as Semester })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
              >
                {SEMESTERS.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Expected Graduation Semester
              </label>
              <select
                value={profile.expectedGraduation.semester}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    expectedGraduation: {
                      ...profile.expectedGraduation,
                      semester: e.target.value as Semester,
                    },
                  })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
              >
                {SEMESTERS.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Expected Graduation Year
              </label>
              <select
                value={profile.expectedGraduation.year}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    expectedGraduation: {
                      ...profile.expectedGraduation,
                      year: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
              >
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Completed Courses */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <GraduationCap size={24} className="text-purple-400" />
              Completed Courses
            </h2>
            <button
              onClick={() => setShowAddCourse(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Course
            </button>
          </div>

          {profile.completedCourses.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg">
              <BookOpen className="mx-auto text-white/40" size={48} />
              <p className="text-white/70 mt-4">No completed courses added yet</p>
              <p className="text-sm text-white/60 mt-2">
                Add courses you've already completed to track your progress
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.completedCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="flex items-start justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{course.courseCode}</p>
                        <p className="text-white/90 mt-1">{course.courseTitle}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-white/70">
                          <span>
                            {course.semester} {course.year}
                          </span>
                          <span>{course.credits} credits</span>
                          {course.grade && <span className="font-medium">Grade: {course.grade}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeCompletedCourse(course.courseId)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/20 rounded"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-white/70">
              Total Credits Completed: <span className="font-semibold">{profile.totalCreditsCompleted}</span>
            </p>
          </div>
        </div>
      </main>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add Completed Course</h2>
                <button
                  onClick={() => {
                    setShowAddCourse(false)
                    setSearchQuery("")
                    setSelectedCourse("")
                  }}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Search Course
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course code or title..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Select Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
                >
                  <option value="">Choose a course</option>
                  {filteredCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Semester Completed
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value as Semester)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
                  >
                    {SEMESTERS.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Year Completed
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
                  >
                    {completionYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Grade (Optional)
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
                >
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="C-">C-</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                  <option value="P">P (Pass)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddCourse(false)
                    setSearchQuery("")
                    setSelectedCourse("")
                  }}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={addCompletedCourse}
                  disabled={!selectedCourse}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCourse
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30 text-white"
                      : "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
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
