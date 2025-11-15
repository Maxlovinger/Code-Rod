import { NextRequest, NextResponse } from "next/server"
import type { Course, ScheduledCourse, StudentProfile, ScheduleConflict } from "@/lib/types"
import { detectScheduleConflicts } from "@/lib/schedule-utils"

/**
 * POST /api/schedule/validate
 *
 * Validates a schedule for conflicts and prerequisite issues
 *
 * Request body:
 * {
 *   courses: ScheduledCourse[],
 *   studentProfile: StudentProfile
 * }
 *
 * Response:
 * {
 *   valid: boolean,
 *   conflicts: ScheduleConflict[],
 *   totalCredits: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courses, studentProfile } = body

    if (!courses || !studentProfile) {
      return NextResponse.json(
        { error: "Missing required fields: courses and studentProfile" },
        { status: 400 }
      )
    }

    // Detect conflicts
    const conflicts = detectScheduleConflicts(courses, studentProfile)

    // Calculate total credits
    const totalCredits = courses.reduce(
      (sum: number, sc: ScheduledCourse) => sum + sc.course.credits,
      0
    )

    // Determine if schedule is valid
    const valid = conflicts.filter((c) => c.severity === "error").length === 0

    return NextResponse.json(
      {
        valid,
        conflicts,
        totalCredits,
        warnings: conflicts.filter((c) => c.severity === "warning"),
        errors: conflicts.filter((c) => c.severity === "error"),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error validating schedule:", error)
    return NextResponse.json(
      { error: "Failed to validate schedule" },
      { status: 500 }
    )
  }
}
