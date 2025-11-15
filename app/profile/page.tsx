"use client"

import { useState, useEffect } from "react"
import { User, GraduationCap, Mail, Calendar, BookOpen, Plus, X, Check, Edit, Save } from "lucide-react"
import type { StudentProfile, CompletedCourse, Semester } from "@/lib/types"
import { mockCourses } from "@/lib/mock-data"
import { saveStudentProfile, loadStudentProfile } from "@/lib/storage"
import { AnimatedBackground } from "@/components/animated-background"
import { AppHeader } from "@/components/app-header"
import { supabase } from "@/lib/supabase"

const HAVERFORD_MAJORS = [
  "Anthropology", "Art and Art History", "Astronomy", "Biology", "Chemistry", "Classics", 
  "Comparative Literature", "Computer Science", "East Asian Languages and Cultures", "Economics", 
  "English", "French and Francophone Studies", "German and German Studies", "Growth and Structure of Cities", 
  "History", "History of Art", "Independent Major", "Italian", "Linguistics", "Mathematics", 
  "Music", "Philosophy", "Physics", "Political Science", "Psychology", "Religion", 
  "Romance Languages", "Russian", "Sociology", "Spanish", "Theater"
]

const HAVERFORD_MINORS = [
  "Africana Studies", "Anthropology", "Art History", "Astronomy", "Biochemistry and Biophysics", 
  "Biology", "Chemistry", "Chinese", "Classics", "Comparative Literature", "Computer Science", 
  "Creative Writing", "Dance", "Economics", "Educational Studies", "English", "Environmental Studies", 
  "Film and Media Studies", "French", "Gender and Sexuality Studies", "German", "Health Studies", 
  "Hebrew", "History", "Italian", "Japanese", "Jewish Studies", "Latin American and Iberian Studies", 
  "Linguistics", "Mathematics", "Middle Eastern and Islamic Studies", "Music", "Neuroscience", 
  "Peace, Justice, and Human Rights", "Philosophy", "Physics", "Political Science", "Psychology", 
  "Religion", "Russian", "Sociology", "Spanish", "Statistics", "Theater", "Visual Studies"
]

const GRADUATION_YEARS = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]
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
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSemester, setSelectedSemester] = useState<Semester>("Fall")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1)
  const [saved, setSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [availableAdvisors, setAvailableAdvisors] = useState<{id: string, name: string}[]>([])
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedMinors, setSelectedMinors] = useState<string[]>([])
  const [selectedAdvisors, setSelectedAdvisors] = useState<string[]>([])

  // Load profile and advisors on mount
  useEffect(() => {
    const fetchData = async () => {
      const userEmail = localStorage.getItem('userEmail')
      if (!userEmail) return

      try {
        const { data: user, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', userEmail)
          .single()

        if (user && !error) {
          const majors = user.major || []
          const minors = user.minor || []
          const advisors = user.advisors || []
          const completedCourses = user.completed_courses || []
          
          setSelectedMajors(majors)
          setSelectedMinors(minors)
          setSelectedAdvisors(advisors)
          setProfile({
            id: user.id,
            name: user.full_name || '',
            email: user.email || '',
            major: Array.isArray(majors) ? majors.join(', ') : '',
            minor: Array.isArray(minors) ? minors.join(', ') : '',
            currentYear: user.class_year || 2025,
            currentSemester: "Fall",
            expectedGraduation: { semester: "Spring", year: new Date().getFullYear() + 4 },
            advisor: Array.isArray(advisors) ? advisors.join(', ') : '',
            completedCourses: completedCourses,
            totalCreditsCompleted: 0
          })
        }
        
        const { data: advisorsList } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('user_type', 'advisor')
        
        if (advisorsList) {
          setAvailableAdvisors(advisorsList.map(a => ({ id: a.id, name: a.full_name })))
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) {
      alert('No user email found')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          major: selectedMajors,
          minor: selectedMinors,
          class_year: profile.currentYear,
          advisors: selectedAdvisors
        })
        .eq('email', userEmail)

      if (!error) {
        setProfile(prev => ({
          ...prev,
          major: Array.isArray(selectedMajors) ? selectedMajors.join(', ') : '',
          minor: Array.isArray(selectedMinors) ? selectedMinors.join(', ') : '',
          advisor: Array.isArray(selectedAdvisors) ? selectedAdvisors.join(', ') : ''
        }))
        
        setSaved(true)
        setIsEditing(false)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Failed to save profile')
      }
    } catch (error) {
      alert('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const addCompletedCourse = async () => {
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
      fulfills: course.fulfills,
    }

    const updatedCourses = [...profile.completedCourses, completedCourse]
    setProfile((prev) => ({
      ...prev,
      completedCourses: updatedCourses
    }))

    // Save to database
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      await supabase
        .from('profiles')
        .update({ completed_courses: updatedCourses })
        .eq('email', userEmail)
    }

    // Reset form
    setSelectedCourse("")
    setShowAddCourse(false)
  }

  const removeCompletedCourse = async (courseId: string) => {
    const updatedCourses = profile.completedCourses.filter((c) => c.courseId !== courseId)
    setProfile((prev) => ({
      ...prev,
      completedCourses: updatedCourses
    }))

    // Save to database
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      await supabase
        .from('profiles')
        .update({ completed_courses: updatedCourses })
        .eq('email', userEmail)
    }
  }



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
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30"
                >
                  <Edit size={20} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-white/30"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 border border-red-400/30 disabled:opacity-50"
                  >
                    {loading ? (
                      "Saving..."
                    ) : saved ? (
                      <>
                        <Check size={20} />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
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
              <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70">
                {profile.name || "Not set"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70">
                {profile.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Major(s)</label>
              {isEditing ? (
                <div className="w-full max-h-32 overflow-y-auto bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-2 shadow-lg shadow-red-500/10 scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-red-500/50 hover:scrollbar-thumb-red-500/70">
                  {HAVERFORD_MAJORS.map((major) => (
                    <label key={major} className="flex items-center p-2 hover:bg-red-500/10 rounded cursor-pointer transition-all duration-200 group">
                      <div className="relative mr-3">
                        <input
                          type="checkbox"
                          checked={selectedMajors.includes(major)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMajors([...selectedMajors, major])
                            } else {
                              setSelectedMajors(selectedMajors.filter(m => m !== major))
                            }
                          }}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${selectedMajors.includes(major) ? 'bg-red-500 border-red-500' : 'bg-white/10 border-white/30 group-hover:border-red-500/50'}`}>
                          {selectedMajors.includes(major) && (
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-white/90 text-sm group-hover:text-white transition-colors">{major}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  {Array.isArray(selectedMajors) && selectedMajors.length > 0 ? selectedMajors.join(", ") : "Not set"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Minor(s) (Optional)
              </label>
              {isEditing ? (
                <div className="w-full max-h-32 overflow-y-auto bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-2 shadow-lg shadow-red-500/10 scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-red-500/50 hover:scrollbar-thumb-red-500/70">
                  {HAVERFORD_MINORS.map((minor) => (
                    <label key={minor} className="flex items-center p-2 hover:bg-red-500/10 rounded cursor-pointer transition-all duration-200 group">
                      <div className="relative mr-3">
                        <input
                          type="checkbox"
                          checked={selectedMinors.includes(minor)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMinors([...selectedMinors, minor])
                            } else {
                              setSelectedMinors(selectedMinors.filter(m => m !== minor))
                            }
                          }}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${selectedMinors.includes(minor) ? 'bg-red-500 border-red-500' : 'bg-white/10 border-white/30 group-hover:border-red-500/50'}`}>
                          {selectedMinors.includes(minor) && (
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-white/90 text-sm group-hover:text-white transition-colors">{minor}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  {Array.isArray(selectedMinors) && selectedMinors.length > 0 ? selectedMinors.join(", ") : "No minor"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Advisor(s)
              </label>
              {isEditing ? (
                <div className="w-full max-h-32 overflow-y-auto bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-2 shadow-lg shadow-red-500/10 scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-red-500/50 hover:scrollbar-thumb-red-500/70">
                  {availableAdvisors.map((advisor) => (
                    <label key={advisor.id} className="flex items-center p-2 hover:bg-red-500/10 rounded cursor-pointer transition-all duration-200 group">
                      <div className="relative mr-3">
                        <input
                          type="checkbox"
                          checked={selectedAdvisors.includes(advisor.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAdvisors([...selectedAdvisors, advisor.name])
                            } else {
                              setSelectedAdvisors(selectedAdvisors.filter(a => a !== advisor.name))
                            }
                          }}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${selectedAdvisors.includes(advisor.name) ? 'bg-red-500 border-red-500' : 'bg-white/10 border-white/30 group-hover:border-red-500/50'}`}>
                          {selectedAdvisors.includes(advisor.name) && (
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-white/90 text-sm group-hover:text-white transition-colors">{advisor.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  {Array.isArray(selectedAdvisors) && selectedAdvisors.length > 0 ? selectedAdvisors.join(", ") : "Not set"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Graduation Year
              </label>
              {isEditing ? (
                <select
                  value={profile.currentYear}
                  onChange={(e) => setProfile({ ...profile, currentYear: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white hover:bg-white/10 transition-all duration-300 shadow-lg shadow-red-500/10"
                >
                  {GRADUATION_YEARS.map((year) => (
                    <option key={year} value={year} className="py-2 px-4 bg-black/90 text-white hover:bg-red-500/20">
                      {year}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  {profile.currentYear || "Not set"}
                </div>
              )}
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


        </div>
      </main>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add Completed Course</h2>
                <button
                  onClick={() => {
                    setShowAddCourse(false)
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
                  Select Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 bg-black"
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

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddCourse(false)
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