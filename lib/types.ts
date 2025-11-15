// Core data models for the scheduling system

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"

export type Semester = "Fall" | "Spring" | "Summer"

export type RequirementCategory =
  | "Major Core"
  | "Major Elective"
  | "General Education"
  | "Humanities"
  | "Social Sciences"
  | "Natural Sciences"
  | "Quantitative"
  | "Writing"
  | "Language"
  | "Free Elective"

export interface TimeSlot {
  day: DayOfWeek
  startTime: string // Format: "HH:MM" (24-hour)
  endTime: string   // Format: "HH:MM" (24-hour)
}

export interface Course {
  id: string
  code: string              // e.g., "CMSC 106"
  title: string
  description: string
  credits: number
  department: string
  instructor: string
  meetingTimes: TimeSlot[]
  prerequisites: string[]   // Course IDs
  corequisites: string[]    // Course IDs
  fulfills: RequirementCategory[]
  semester: Semester
  year: number
  maxEnrollment: number
  currentEnrollment: number
  location: string
}

export interface CompletedCourse {
  courseId: string
  courseCode: string
  courseTitle: string
  credits: number
  semester: Semester
  year: number
  grade?: string
  fulfills: RequirementCategory[]
}

export interface Requirement {
  id: string
  category: RequirementCategory
  description: string
  creditsRequired: number
  creditsCompleted: number
  coursesRequired?: number  // Optional: specific number of courses
  coursesCompleted?: number
  specificCourses?: string[] // Optional: specific course IDs required
  completed: boolean
}

export interface StudentProfile {
  id: string
  name: string
  email: string
  major: string
  minor?: string
  currentYear: number        // 1-4
  currentSemester: Semester
  expectedGraduation: {
    semester: Semester
    year: number
  }
  advisor?: string
  completedCourses: CompletedCourse[]
  totalCreditsCompleted: number
}

export interface ScheduledCourse {
  course: Course
  addedAt: Date
  status: "confirmed" | "waitlist" | "shopping"
}

export interface SemesterSchedule {
  semester: Semester
  year: number
  courses: ScheduledCourse[]
  totalCredits: number
  conflicts: ScheduleConflict[]
}

export interface ScheduleConflict {
  type: "time" | "prerequisite" | "corequisite" | "overload"
  courseIds: string[]
  message: string
  severity: "error" | "warning"
}

export interface FourYearPlan {
  studentId: string
  semesters: SemesterSchedule[]
  createdAt: Date
  lastModified: Date
}

// Shopping cart for course selection
export interface CourseCart {
  studentId: string
  targetSemester: Semester
  targetYear: number
  courses: Course[]
  addedAt: Date
}

// API-ready structure for future AI integration
export interface AIRecommendationRequest {
  studentProfile: StudentProfile
  currentSchedule: SemesterSchedule
  remainingRequirements: Requirement[]
  preferences?: {
    preferredDays?: DayOfWeek[]
    preferredTimeRange?: { start: string; end: string }
    maxCreditsPerSemester?: number
    avoidBackToBack?: boolean
  }
}

export interface AIRecommendationResponse {
  recommendedCourses: Course[]
  reasoning: string
  alternativePaths?: {
    description: string
    courses: Course[]
  }[]
  warnings?: string[]
}

// Filter and search types
export interface CourseFilters {
  departments?: string[]
  credits?: number[]
  semesters?: Semester[]
  daysOfWeek?: DayOfWeek[]
  timeRange?: { start: string; end: string }
  fulfillsRequirements?: RequirementCategory[]
  hasSeatsAvailable?: boolean
  searchQuery?: string
}

export interface SortOption {
  field: "code" | "title" | "credits" | "enrollment" | "department"
  direction: "asc" | "desc"
}
