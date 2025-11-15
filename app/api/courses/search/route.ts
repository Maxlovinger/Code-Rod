import { NextRequest, NextResponse } from "next/server"
import type { CourseFilters, SortOption } from "@/lib/types"
import { mockCourses } from "@/lib/mock-data"

/**
 * GET /api/courses/search
 *
 * Search and filter courses
 *
 * Query parameters:
 * - q: search query
 * - department: filter by department
 * - credits: filter by credits
 * - semester: filter by semester
 * - hasSeats: filter courses with available seats
 * - sort: sort field
 * - order: sort direction (asc/desc)
 *
 * Response: Course[]
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get("q") || ""
    const department = searchParams.get("department")
    const credits = searchParams.get("credits")
    const semester = searchParams.get("semester")
    const hasSeats = searchParams.get("hasSeats") === "true"
    const sortField = searchParams.get("sort") as SortOption["field"] | null
    const sortDirection = searchParams.get("order") as SortOption["direction"] | null

    // Start with all courses
    let filteredCourses = [...mockCourses]

    // Apply search query
    if (query) {
      const lowercaseQuery = query.toLowerCase()
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.code.toLowerCase().includes(lowercaseQuery) ||
          course.title.toLowerCase().includes(lowercaseQuery) ||
          course.instructor.toLowerCase().includes(lowercaseQuery) ||
          course.description.toLowerCase().includes(lowercaseQuery)
      )
    }

    // Apply department filter
    if (department) {
      filteredCourses = filteredCourses.filter(
        (course) => course.department === department
      )
    }

    // Apply credits filter
    if (credits) {
      const creditsNum = parseInt(credits, 10)
      filteredCourses = filteredCourses.filter(
        (course) => course.credits === creditsNum
      )
    }

    // Apply semester filter
    if (semester) {
      filteredCourses = filteredCourses.filter(
        (course) => course.semester === semester
      )
    }

    // Apply seats available filter
    if (hasSeats) {
      filteredCourses = filteredCourses.filter(
        (course) => course.currentEnrollment < course.maxEnrollment
      )
    }

    // Apply sorting
    if (sortField) {
      filteredCourses.sort((a, b) => {
        let aValue: any = a[sortField]
        let bValue: any = b[sortField]

        if (sortField === "code" || sortField === "title" || sortField === "department") {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (sortDirection === "desc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
        }
      })
    }

    return NextResponse.json(
      {
        courses: filteredCourses,
        total: filteredCourses.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error searching courses:", error)
    return NextResponse.json(
      { error: "Failed to search courses" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/courses/search
 *
 * Advanced search with complex filters
 *
 * Request body: CourseFilters
 * Response: Course[]
 */
export async function POST(request: NextRequest) {
  try {
    const filters: CourseFilters = await request.json()

    let filteredCourses = [...mockCourses]

    // Apply search query
    if (filters.searchQuery) {
      const lowercaseQuery = filters.searchQuery.toLowerCase()
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.code.toLowerCase().includes(lowercaseQuery) ||
          course.title.toLowerCase().includes(lowercaseQuery) ||
          course.instructor.toLowerCase().includes(lowercaseQuery) ||
          course.description.toLowerCase().includes(lowercaseQuery)
      )
    }

    // Apply department filter
    if (filters.departments && filters.departments.length > 0) {
      filteredCourses = filteredCourses.filter((course) =>
        filters.departments!.includes(course.department)
      )
    }

    // Apply credits filter
    if (filters.credits && filters.credits.length > 0) {
      filteredCourses = filteredCourses.filter((course) =>
        filters.credits!.includes(course.credits)
      )
    }

    // Apply semester filter
    if (filters.semesters && filters.semesters.length > 0) {
      filteredCourses = filteredCourses.filter((course) =>
        filters.semesters!.includes(course.semester)
      )
    }

    // Apply day of week filter
    if (filters.daysOfWeek && filters.daysOfWeek.length > 0) {
      filteredCourses = filteredCourses.filter((course) =>
        course.meetingTimes.some((slot: any) =>
          filters.daysOfWeek!.includes(slot.day)
        )
      )
    }

    // Apply time range filter
    if (filters.timeRange) {
      const { start, end } = filters.timeRange
      filteredCourses = filteredCourses.filter((course) =>
        course.meetingTimes.some(
          (slot: any) => slot.startTime >= start && slot.endTime <= end
        )
      )
    }

    // Apply requirements filter
    if (filters.fulfillsRequirements && filters.fulfillsRequirements.length > 0) {
      filteredCourses = filteredCourses.filter((course) =>
        course.fulfills.some((req: any) =>
          filters.fulfillsRequirements!.includes(req)
        )
      )
    }

    // Apply seats available filter
    if (filters.hasSeatsAvailable) {
      filteredCourses = filteredCourses.filter(
        (course) => course.currentEnrollment < course.maxEnrollment
      )
    }

    return NextResponse.json(
      {
        courses: filteredCourses,
        total: filteredCourses.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in advanced search:", error)
    return NextResponse.json(
      { error: "Failed to perform advanced search" },
      { status: 500 }
    )
  }
}
