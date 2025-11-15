import type {
  StudentProfile,
  SemesterSchedule,
  FourYearPlan,
  CourseCart,
  Requirement,
} from "./types"

// LocalStorage keys
const STORAGE_KEYS = {
  STUDENT_PROFILE: "schemer_student_profile",
  FOUR_YEAR_PLAN: "schemer_four_year_plan",
  COURSE_CART: "schemer_course_cart",
  REQUIREMENTS: "schemer_requirements",
  CURRENT_SEMESTER: "schemer_current_semester",
} as const

/**
 * Student Profile Storage
 */
export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile))
  } catch (error) {
    console.error("Failed to save student profile:", error)
  }
}

export function loadStudentProfile(): StudentProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Failed to load student profile:", error)
    return null
  }
}

/**
 * Four Year Plan Storage
 */
export function saveFourYearPlan(plan: FourYearPlan): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FOUR_YEAR_PLAN, JSON.stringify(plan))
  } catch (error) {
    console.error("Failed to save four year plan:", error)
  }
}

export function loadFourYearPlan(): FourYearPlan | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FOUR_YEAR_PLAN)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Failed to load four year plan:", error)
    return null
  }
}

/**
 * Current Semester Schedule Storage
 */
export function saveCurrentSemesterSchedule(schedule: SemesterSchedule): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SEMESTER, JSON.stringify(schedule))
  } catch (error) {
    console.error("Failed to save current semester schedule:", error)
  }
}

export function loadCurrentSemesterSchedule(): SemesterSchedule | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SEMESTER)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Failed to load current semester schedule:", error)
    return null
  }
}

/**
 * Course Cart Storage
 */
export function saveCourseCart(cart: CourseCart): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COURSE_CART, JSON.stringify(cart))
  } catch (error) {
    console.error("Failed to save course cart:", error)
  }
}

export function loadCourseCart(): CourseCart | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COURSE_CART)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Failed to load course cart:", error)
    return null
  }
}

/**
 * Requirements Storage
 */
export function saveRequirements(requirements: Requirement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(requirements))
  } catch (error) {
    console.error("Failed to save requirements:", error)
  }
}

export function loadRequirements(): Requirement[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REQUIREMENTS)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Failed to load requirements:", error)
    return null
  }
}

/**
 * Clear all stored data
 */
export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Failed to clear data:", error)
  }
}

/**
 * Export all data as JSON for backup/transfer
 */
export function exportAllData(): string {
  const data = {
    studentProfile: loadStudentProfile(),
    fourYearPlan: loadFourYearPlan(),
    currentSemester: loadCurrentSemesterSchedule(),
    courseCart: loadCourseCart(),
    requirements: loadRequirements(),
    exportedAt: new Date().toISOString(),
  }
  return JSON.stringify(data, null, 2)
}

/**
 * Import data from JSON backup
 */
export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString)

    if (data.studentProfile) saveStudentProfile(data.studentProfile)
    if (data.fourYearPlan) saveFourYearPlan(data.fourYearPlan)
    if (data.currentSemester) saveCurrentSemesterSchedule(data.currentSemester)
    if (data.courseCart) saveCourseCart(data.courseCart)
    if (data.requirements) saveRequirements(data.requirements)

    return true
  } catch (error) {
    console.error("Failed to import data:", error)
    return false
  }
}
