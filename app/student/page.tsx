"use client"

import { useState, useEffect } from "react"
import { User, Calendar, BookOpen, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { AppHeader } from "@/components/app-header"
import { supabase } from "@/lib/supabase"

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudentData = async () => {
      const userEmail = localStorage.getItem('userEmail')
      if (!userEmail) return

      try {
        // Fetch student profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', userEmail)
          .single()

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError)
          setLoading(false)
          return
        }

        // Fetch planned courses
        let { data: plannedCourses } = await supabase
          .from('planned_courses')
          .select('*')
          .eq('user_id', profile.id)

        // If no results with user_id, try with email
        if (!plannedCourses || plannedCourses.length === 0) {
          const { data: plannedByEmail } = await supabase
            .from('planned_courses')
            .select('*')
            .eq('user_email', userEmail)
          
          plannedCourses = plannedByEmail || []
        }

        // Fetch assigned advisor
        const { data: advisorData } = await supabase
          .from('advisor_students')
          .select('advisor_email')
          .eq('student_id', profile.id)

        const assignedAdvisor = advisorData?.[0]?.advisor_email || 'Not assigned'

        // Calculate progress
        const completedCourses = profile.completed_courses || []
        const creditsCompleted = completedCourses.reduce((total: number, course: any) => {
          return total + (course.credits || 0)
        }, 0)

        const plannedCredits = plannedCourses.reduce((total: number, course: any) => {
          return total + (course.credits || 0)
        }, 0)

        const totalCredits = creditsCompleted + plannedCredits
        const degreeProgress = Math.round((totalCredits / 32) * 100)

        // Calculate expected graduation
        const currentYear = new Date().getFullYear()
        const classYear = profile.class_year || currentYear + 4
        const graduationSemester = classYear <= currentYear + 1 ? 'Spring' : 'Spring'

        setStudentData({
          profile,
          creditsCompleted: totalCredits,
          currentCourses: plannedCourses.length,
          degreeProgress,
          expectedGraduation: `${graduationSemester} ${classYear}`,
          major: Array.isArray(profile.major) ? profile.major.join(', ') : 'Undeclared',
          minor: Array.isArray(profile.minor) ? profile.minor.join(', ') : 'None',
          advisor: assignedAdvisor
        })
      } catch (error) {
        console.error('Failed to fetch student data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader currentPage="/student" />

      {/* Page Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <p className="text-white/70 mt-1">
              Manage your academic journey
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <Link href="/profile">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group h-40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <User className="text-blue-400" size={32} />
                <ArrowRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Profile</h2>
                <p className="text-white/70 text-sm">
                  Set major, minor, class year, and advisors
                </p>
              </div>
            </div>
          </Link>

          {/* Schedule Builder Card */}
          <Link href="/schedule">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group h-40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-green-400" size={32} />
                <ArrowRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Schedule</h2>
                <p className="text-white/70 text-sm">
                  View current semester calendar and classes
                </p>
              </div>
            </div>
          </Link>

          {/* Long Term Plan Card */}
          <Link href="/long-term">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group h-40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="text-orange-400" size={32} />
                <ArrowRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Long Term</h2>
                <p className="text-white/70 text-sm">
                  Mock schedule of classes over time
                </p>
              </div>
            </div>
          </Link>

          {/* Requirements Card */}
          <Link href="/requirements">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group h-40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <Target className="text-purple-400" size={32} />
                <ArrowRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Requirements</h2>
                <p className="text-white/70 text-sm">
                  Language, Domains (A,B,C), major/minor requirements
                </p>
              </div>
            </div>
          </Link>

        </div>

        {/* Quick Overview */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{loading ? '...' : studentData?.creditsCompleted || 0}</p>
              <p className="text-sm text-white/70">Credits Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{loading ? '...' : studentData?.currentCourses || 0}</p>
              <p className="text-sm text-white/70">Planned Courses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{loading ? '...' : studentData?.degreeProgress || 0}%</p>
              <p className="text-sm text-white/70">Degree Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{loading ? '...' : studentData?.expectedGraduation || 'TBD'}</p>
              <p className="text-sm text-white/70">Expected Graduation</p>
            </div>
          </div>
          
          {/* Academic Status */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/70">Major: <span className="text-white font-medium">{loading ? '...' : studentData?.major || 'Undeclared'}</span></p>
                <p className="text-white/70 mt-1">Minor: <span className="text-white font-medium">{loading ? '...' : studentData?.minor || 'None'}</span></p>
              </div>
              <div>
                <p className="text-white/70">Class Year: <span className="text-white font-medium">{loading ? '...' : studentData?.profile?.class_year || 'Not set'}</span></p>
                <p className="text-white/70 mt-1">Advisor: <span className="text-white font-medium">{loading ? '...' : studentData?.advisor || 'Not assigned'}</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}