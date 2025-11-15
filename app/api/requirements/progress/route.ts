import { NextRequest, NextResponse } from "next/server"
import type { Requirement, CompletedCourse, Course } from "@/lib/types"

/**
 * POST /api/requirements/progress
 *
 * Calculate requirement progress based on completed and scheduled courses
 *
 * Request body:
 * {
 *   requirements: Requirement[],
 *   completedCourses: CompletedCourse[],
 *   scheduledCourses?: Course[]
 * }
 *
 * Response:
 * {
 *   requirements: Requirement[], // Updated with new progress
 *   overallProgress: number,
 *   totalCreditsCompleted: number,
 *   totalCreditsRequired: number,
 *   onTrack: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requirements, completedCourses, scheduledCourses = [] } = body

    if (!requirements || !completedCourses) {
      return NextResponse.json(
        { error: "Missing required fields: requirements and completedCourses" },
        { status: 400 }
      )
    }

    // Update requirements based on completed courses
    const updatedRequirements = requirements.map((req: Requirement) => {
      // Calculate credits completed for this requirement
      const creditsFromCompleted = completedCourses
        .filter((course: CompletedCourse) => course.fulfills.includes(req.category))
        .reduce((sum: number, course: CompletedCourse) => sum + course.credits, 0)

      // Calculate credits from scheduled courses (for future projection)
      const creditsFromScheduled = scheduledCourses
        .filter((course: Course) => course.fulfills.includes(req.category))
        .reduce((sum: number, course: Course) => sum + course.credits, 0)

      // Count courses
      const coursesFromCompleted = completedCourses.filter((course: CompletedCourse) =>
        course.fulfills.includes(req.category)
      ).length

      const coursesFromScheduled = scheduledCourses.filter((course: Course) =>
        course.fulfills.includes(req.category)
      ).length

      const totalCreditsCompleted = creditsFromCompleted + creditsFromScheduled
      const totalCoursesCompleted = coursesFromCompleted + coursesFromScheduled

      return {
        ...req,
        creditsCompleted: totalCreditsCompleted,
        coursesCompleted: totalCoursesCompleted,
        completed: totalCreditsCompleted >= req.creditsRequired,
      }
    })

    // Calculate overall statistics
    const totalCreditsRequired = updatedRequirements.reduce(
      (sum: number, req: Requirement) => sum + req.creditsRequired,
      0
    )

    const totalCreditsCompleted = updatedRequirements.reduce(
      (sum: number, req: Requirement) => sum + req.creditsCompleted,
      0
    )

    const overallProgress =
      totalCreditsRequired > 0 ? (totalCreditsCompleted / totalCreditsRequired) * 100 : 0

    const completedReqs = updatedRequirements.filter((req: Requirement) => req.completed).length
    const onTrack = overallProgress >= 25 // Example: should be 25% done by end of year 1

    return NextResponse.json(
      {
        requirements: updatedRequirements,
        overallProgress,
        totalCreditsCompleted,
        totalCreditsRequired,
        completedRequirements: completedReqs,
        totalRequirements: updatedRequirements.length,
        onTrack,
        remainingCredits: totalCreditsRequired - totalCreditsCompleted,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error calculating requirement progress:", error)
    return NextResponse.json(
      { error: "Failed to calculate requirement progress" },
      { status: 500 }
    )
  }
}
