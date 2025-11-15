import type {
  Course,
  TimeSlot,
  ScheduleConflict,
  ScheduledCourse,
  StudentProfile,
  CompletedCourse,
} from "./types"

/**
 * Converts time string (HH:MM) to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/**
 * Checks if two time slots overlap
 */
export function timeSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
  if (slot1.day !== slot2.day) return false

  const start1 = timeToMinutes(slot1.startTime)
  const end1 = timeToMinutes(slot1.endTime)
  const start2 = timeToMinutes(slot2.startTime)
  const end2 = timeToMinutes(slot2.endTime)

  return start1 < end2 && start2 < end1
}

/**
 * Checks if two courses have time conflicts
 */
export function coursesHaveTimeConflict(course1: Course, course2: Course): boolean {
  for (const slot1 of course1.meetingTimes) {
    for (const slot2 of course2.meetingTimes) {
      if (timeSlotsOverlap(slot1, slot2)) {
        return true
      }
    }
  }
  return false
}

/**
 * Detects all schedule conflicts for a set of courses
 */
export function detectScheduleConflicts(
  scheduledCourses: ScheduledCourse[],
  studentProfile: StudentProfile
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = []
  const courses = scheduledCourses.map((sc) => sc.course)

  // Check for time conflicts
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      if (coursesHaveTimeConflict(courses[i], courses[j])) {
        conflicts.push({
          type: "time",
          courseIds: [courses[i].id, courses[j].id],
          message: `Time conflict between ${courses[i].code} and ${courses[j].code}`,
          severity: "error",
        })
      }
    }
  }

  // Check for prerequisite conflicts
  const completedCourseIds = new Set(
    studentProfile.completedCourses.map((c) => c.courseId)
  )
  const scheduledCourseIds = new Set(courses.map((c) => c.id))

  for (const course of courses) {
    for (const prereqId of course.prerequisites) {
      if (!completedCourseIds.has(prereqId) && !scheduledCourseIds.has(prereqId)) {
        conflicts.push({
          type: "prerequisite",
          courseIds: [course.id],
          message: `Missing prerequisite for ${course.code}`,
          severity: "error",
        })
      }
    }
  }

  // Check for corequisite conflicts
  for (const course of courses) {
    for (const coreqId of course.corequisites) {
      if (!completedCourseIds.has(coreqId) && !scheduledCourseIds.has(coreqId)) {
        conflicts.push({
          type: "corequisite",
          courseIds: [course.id],
          message: `Missing corequisite for ${course.code}. Must be taken concurrently or previously.`,
          severity: "error",
        })
      }
    }
  }

  // Check for credit overload (typically 18+ credits)
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
  if (totalCredits > 18) {
    conflicts.push({
      type: "overload",
      courseIds: courses.map((c) => c.id),
      message: `Credit overload: ${totalCredits} credits (maximum recommended: 18)`,
      severity: "warning",
    })
  }

  return conflicts
}

/**
 * Checks if a student has completed a specific course
 */
export function hasCompletedCourse(
  studentProfile: StudentProfile,
  courseId: string
): boolean {
  return studentProfile.completedCourses.some((c) => c.courseId === courseId)
}

/**
 * Checks if student meets prerequisites for a course
 */
export function meetsPrerequisites(
  course: Course,
  studentProfile: StudentProfile,
  currentSchedule: Course[]
): boolean {
  const completedIds = new Set(studentProfile.completedCourses.map((c) => c.courseId))
  const scheduledIds = new Set(currentSchedule.map((c) => c.id))

  for (const prereqId of course.prerequisites) {
    if (!completedIds.has(prereqId) && !scheduledIds.has(prereqId)) {
      return false
    }
  }

  return true
}

/**
 * Checks if student meets corequisites for a course
 */
export function meetsCorequisites(
  course: Course,
  studentProfile: StudentProfile,
  currentSchedule: Course[]
): boolean {
  const completedIds = new Set(studentProfile.completedCourses.map((c) => c.courseId))
  const scheduledIds = new Set(currentSchedule.map((c) => c.id))

  for (const coreqId of course.corequisites) {
    if (!completedIds.has(coreqId) && !scheduledIds.has(coreqId)) {
      return false
    }
  }

  return true
}

/**
 * Validates if a course can be added to the schedule
 */
export function canAddCourse(
  course: Course,
  scheduledCourses: ScheduledCourse[],
  studentProfile: StudentProfile
): { canAdd: boolean; reason?: string } {
  const courses = scheduledCourses.map((sc) => sc.course)

  // Check time conflicts
  for (const existing of courses) {
    if (coursesHaveTimeConflict(course, existing)) {
      return {
        canAdd: false,
        reason: `Time conflict with ${existing.code}`,
      }
    }
  }

  // Check prerequisites
  if (!meetsPrerequisites(course, studentProfile, courses)) {
    return {
      canAdd: false,
      reason: "Prerequisites not met",
    }
  }

  // Check corequisites
  if (!meetsCorequisites(course, studentProfile, courses)) {
    return {
      canAdd: false,
      reason: "Corequisites not met",
    }
  }

  // Check if course is full
  if (course.currentEnrollment >= course.maxEnrollment) {
    return {
      canAdd: false,
      reason: "Course is full",
    }
  }

  // Check if already in schedule
  if (courses.some((c) => c.id === course.id)) {
    return {
      canAdd: false,
      reason: "Course already in schedule",
    }
  }

  // Check if already completed
  if (hasCompletedCourse(studentProfile, course.id)) {
    return {
      canAdd: false,
      reason: "Course already completed",
    }
  }

  return { canAdd: true }
}

/**
 * Formats time slot for display (e.g., "MWF 10:00-11:00")
 */
export function formatTimeSlot(slot: TimeSlot): string {
  return `${slot.day.slice(0, 3)} ${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`
}

/**
 * Formats time from 24-hour to 12-hour format
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

/**
 * Formats course meeting times for display
 */
export function formatCourseTimes(course: Course): string {
  if (course.meetingTimes.length === 0) return "TBA"

  // Group by time, combine days
  const timeGroups = new Map<string, Set<string>>()

  for (const slot of course.meetingTimes) {
    const timeKey = `${slot.startTime}-${slot.endTime}`
    if (!timeGroups.has(timeKey)) {
      timeGroups.set(timeKey, new Set())
    }
    timeGroups.get(timeKey)!.add(slot.day.slice(0, 3))
  }

  const formatted = Array.from(timeGroups.entries()).map(([time, days]) => {
    const [start, end] = time.split("-")
    const dayStr = Array.from(days).join("")
    return `${dayStr} ${formatTime(start)}-${formatTime(end)}`
  })

  return formatted.join(", ")
}

/**
 * Calculates total credits for a set of courses
 */
export function calculateTotalCredits(courses: Course[]): number {
  return courses.reduce((sum, course) => sum + course.credits, 0)
}

/**
 * Groups courses by day of week
 */
export function groupCoursesByDay(courses: Course[]): Map<string, Course[]> {
  const grouped = new Map<string, Course[]>()

  for (const course of courses) {
    for (const slot of course.meetingTimes) {
      if (!grouped.has(slot.day)) {
        grouped.set(slot.day, [])
      }
      if (!grouped.get(slot.day)!.includes(course)) {
        grouped.get(slot.day)!.push(course)
      }
    }
  }

  return grouped
}
