"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle,
  Circle,
  Award,
  TrendingUp,
  BookOpen,
  Target,
  AlertCircle,
} from "lucide-react"
import type { Requirement, StudentProfile, RequirementCategory } from "@/lib/types"
import { mockRequirements, mockStudentProfile } from "@/lib/mock-data"
import { loadStudentProfile, loadRequirements, saveRequirements } from "@/lib/storage"
import { AnimatedBackground } from "@/components/animated-background"
import { AppHeader } from "@/components/app-header"

export default function RequirementsPage() {
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(mockStudentProfile)
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements)

  // Load data on mount
  useEffect(() => {
    const savedProfile = loadStudentProfile()
    if (savedProfile) {
      setStudentProfile(savedProfile)
    }

    const savedRequirements = loadRequirements()
    if (savedRequirements) {
      setRequirements(savedRequirements)
    } else {
      // Save mock requirements on first load
      saveRequirements(mockRequirements)
    }
  }, [])

  // Calculate overall progress
  const totalRequiredCredits = requirements.reduce(
    (sum, req) => sum + req.creditsRequired,
    0
  )
  const totalCompletedCredits = requirements.reduce(
    (sum, req) => sum + req.creditsCompleted,
    0
  )
  const overallProgress = totalRequiredCredits > 0
    ? (totalCompletedCredits / totalRequiredCredits) * 100
    : 0

  const completedRequirements = requirements.filter((req) => req.completed).length
  const totalRequirements = requirements.length

  const remainingCredits = totalRequiredCredits - totalCompletedCredits

  // Group requirements by completion status
  const completedReqs = requirements.filter((req) => req.completed)
  const inProgressReqs = requirements.filter(
    (req) => !req.completed && req.creditsCompleted > 0
  )
  const notStartedReqs = requirements.filter(
    (req) => !req.completed && req.creditsCompleted === 0
  )

  const getProgressPercentage = (req: Requirement): number => {
    return req.creditsRequired > 0 ? (req.creditsCompleted / req.creditsRequired) * 100 : 0
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return "bg-gradient-to-r from-green-500 to-emerald-500"
    if (percentage >= 50) return "bg-gradient-to-r from-red-500 to-red-600"
    if (percentage > 0) return "bg-gradient-to-r from-yellow-500 to-orange-500"
    return "bg-white/20"
  }

  const getCategoryIcon = (category: RequirementCategory) => {
    switch (category) {
      case "Major Core":
      case "Major Elective":
        return <BookOpen size={20} className="text-blue-400" />
      case "General Education":
        return <Award size={20} className="text-purple-400" />
      case "Natural Sciences":
        return <Target size={20} className="text-green-400" />
      case "Quantitative":
        return <TrendingUp size={20} className="text-orange-400" />
      default:
        return <Circle size={20} className="text-white/60" />
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader currentPage="/requirements" />

      {/* Page Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Degree Requirements</h1>
            <p className="text-white/70 mt-1">
              {studentProfile.name} • {studentProfile.major}
              {studentProfile.minor && ` / ${studentProfile.minor}`}
            </p>
          </div>

          {/* Overall Progress Card */}
          <div className="mt-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 shadow-lg shadow-red-500/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Overall Progress
                </h2>
                <div className="flex items-end gap-6">
                  <div>
                    <p className="text-4xl font-bold text-red-400">
                      {overallProgress.toFixed(0)}%
                    </p>
                    <p className="text-sm text-white/70 mt-1">Complete</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-white">
                      {completedRequirements}/{totalRequirements}
                    </p>
                    <p className="text-sm text-white/70 mt-1">Requirements Met</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-white">
                      {totalCompletedCredits}/{totalRequiredCredits}
                    </p>
                    <p className="text-sm text-white/70 mt-1">Credits Earned</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 shadow-lg shadow-red-500/50"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              <Award className="text-red-400" size={48} />
            </div>

            {remainingCredits > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-white/80">
                  <span className="font-semibold">{remainingCredits} credits</span> remaining to
                  graduate
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg shadow-green-500/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Completed</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{completedReqs.length}</p>
              </div>
              <CheckCircle className="text-green-400" size={24} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">In Progress</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{inProgressReqs.length}</p>
              </div>
              <TrendingUp className="text-red-400" size={24} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg shadow-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Not Started</p>
                <p className="text-2xl font-bold text-white/90 mt-1">{notStartedReqs.length}</p>
              </div>
              <Circle className="text-white/60" size={24} />
            </div>
          </div>
        </div>

        {/* Requirements List */}
        <div className="space-y-6">
          {/* Completed Requirements */}
          {completedReqs.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-green-500/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-400" size={24} />
                Completed Requirements
              </h2>
              <div className="space-y-3">
                {completedReqs.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-green-500/10 border border-green-500/30 backdrop-blur-md rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getCategoryIcon(req.category)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{req.category}</h3>
                            <CheckCircle className="text-green-400" size={18} />
                          </div>
                          <p className="text-sm text-white/70 mt-1">{req.description}</p>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <span className="text-green-300 font-medium">
                              {req.creditsCompleted}/{req.creditsRequired} credits
                            </span>
                            {req.coursesRequired && (
                              <span className="text-green-300 font-medium">
                                {req.coursesCompleted}/{req.coursesRequired} courses
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In Progress Requirements */}
          {inProgressReqs.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-red-500/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-red-400" size={24} />
                In Progress
              </h2>
              <div className="space-y-3">
                {inProgressReqs.map((req) => {
                  const progress = getProgressPercentage(req)
                  return (
                    <div
                      key={req.id}
                      className="p-4 bg-red-500/10 border border-red-500/30 backdrop-blur-md rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {getCategoryIcon(req.category)}
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{req.category}</h3>
                            <p className="text-sm text-white/70 mt-1">{req.description}</p>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm">
                              <span className="text-red-300 font-medium">
                                {req.creditsCompleted}/{req.creditsRequired} credits
                              </span>
                              {req.coursesRequired && (
                                <span className="text-red-300 font-medium">
                                  {req.coursesCompleted}/{req.coursesRequired} courses
                                </span>
                              )}
                              <span className="text-white/60">
                                {req.creditsRequired - req.creditsCompleted} credits remaining
                              </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3">
                              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-500 ${getProgressColor(
                                    progress
                                  )}`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Not Started Requirements */}
          {notStartedReqs.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg shadow-white/5 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="text-white/60" size={24} />
                Not Started
              </h2>
              <div className="space-y-3">
                {notStartedReqs.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getCategoryIcon(req.category)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{req.category}</h3>
                          <p className="text-sm text-white/70 mt-1">{req.description}</p>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <span className="text-white/80 font-medium">
                              {req.creditsRequired} credits required
                            </span>
                            {req.coursesRequired && (
                              <span className="text-white/80 font-medium">
                                {req.coursesRequired} courses required
                              </span>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Graduation Status */}
        {overallProgress >= 100 ? (
          <div className="mt-8 bg-green-500/10 backdrop-blur-lg border border-green-500/30 rounded-lg p-6 shadow-lg shadow-green-500/20">
            <div className="flex items-start gap-4">
              <Award className="text-green-400 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-lg font-semibold text-green-300">
                  Congratulations! You're Ready to Graduate
                </h3>
                <p className="text-green-200 mt-2">
                  You've completed all degree requirements for {studentProfile.major}. Expected
                  graduation: {studentProfile.expectedGraduation.semester}{" "}
                  {studentProfile.expectedGraduation.year}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-red-500/10 backdrop-blur-lg border border-red-500/30 rounded-lg p-6 shadow-lg shadow-red-500/20">
            <div className="flex items-start gap-4">
              <Target className="text-red-400 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-lg font-semibold text-red-300">On Track to Graduate</h3>
                <p className="text-red-200 mt-2">
                  Complete {remainingCredits} more credits to meet all requirements for{" "}
                  {studentProfile.major}. Expected graduation:{" "}
                  {studentProfile.expectedGraduation.semester}{" "}
                  {studentProfile.expectedGraduation.year}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
