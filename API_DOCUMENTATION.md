# Schemer API Documentation

This document provides comprehensive documentation for all API endpoints in the Schemer scheduling system. These endpoints are designed to be easily integrated with external AI services, advisor systems, and data sources.

---

## Table of Contents

1. [Course Search & Discovery](#course-search--discovery)
2. [Schedule Management](#schedule-management)
3. [Requirements Tracking](#requirements-tracking)
4. [AI Recommendations](#ai-recommendations)

---

## Course Search & Discovery

### GET /api/courses/search

Search and filter courses using query parameters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (searches code, title, instructor, description) |
| `department` | string | Filter by department name |
| `credits` | number | Filter by credit hours |
| `semester` | string | Filter by semester (Fall, Spring, Summer) |
| `hasSeats` | boolean | Filter courses with available seats |
| `sort` | string | Sort field (code, title, credits, enrollment, department) |
| `order` | string | Sort direction (asc, desc) |

**Example Request:**
```bash
GET /api/courses/search?q=computer&department=Computer%20Science&hasSeats=true&sort=code&order=asc
```

**Response:**
```json
{
  "courses": [
    {
      "id": "cs-101",
      "code": "CMSC 101",
      "title": "Introduction to Computer Science",
      "description": "...",
      "credits": 4,
      "department": "Computer Science",
      "instructor": "Dr. Smith",
      "meetingTimes": [...],
      "prerequisites": [],
      "corequisites": [],
      "fulfills": ["Major Core", "Quantitative"],
      "semester": "Fall",
      "year": 2024,
      "maxEnrollment": 30,
      "currentEnrollment": 22,
      "location": "Stokes Hall 240"
    }
  ],
  "total": 1
}
```

---

### POST /api/courses/search

Advanced search with complex filters.

**Request Body:**
```typescript
{
  searchQuery?: string
  departments?: string[]
  credits?: number[]
  semesters?: Semester[]
  daysOfWeek?: DayOfWeek[]
  timeRange?: { start: string, end: string }
  fulfillsRequirements?: RequirementCategory[]
  hasSeatsAvailable?: boolean
}
```

**Example Request:**
```json
{
  "searchQuery": "data",
  "departments": ["Computer Science", "Mathematics"],
  "credits": [3, 4],
  "semesters": ["Fall"],
  "daysOfWeek": ["Monday", "Wednesday"],
  "timeRange": {
    "start": "10:00",
    "end": "16:00"
  },
  "fulfillsRequirements": ["Major Core", "Major Elective"],
  "hasSeatsAvailable": true
}
```

**Response:**
```json
{
  "courses": [...],
  "total": 5
}
```

---

## Schedule Management

### POST /api/schedule/validate

Validate a schedule for conflicts and prerequisite issues.

**Request Body:**
```typescript
{
  courses: ScheduledCourse[]
  studentProfile: StudentProfile
}
```

**Example Request:**
```json
{
  "courses": [
    {
      "course": {
        "id": "cs-101",
        "code": "CMSC 101",
        ...
      },
      "addedAt": "2024-08-15T10:00:00Z",
      "status": "confirmed"
    }
  ],
  "studentProfile": {
    "id": "student-001",
    "name": "Alex Johnson",
    "completedCourses": [...],
    ...
  }
}
```

**Response:**
```json
{
  "valid": true,
  "conflicts": [],
  "totalCredits": 16,
  "warnings": [],
  "errors": []
}
```

**Conflict Types:**
- `time` - Time slot overlap between courses
- `prerequisite` - Missing prerequisite courses
- `corequisite` - Missing corequisite courses
- `overload` - Too many credits (>18)

**Example with Conflicts:**
```json
{
  "valid": false,
  "conflicts": [
    {
      "type": "time",
      "courseIds": ["cs-101", "math-121"],
      "message": "Time conflict between CMSC 101 and MATH 121",
      "severity": "error"
    },
    {
      "type": "overload",
      "courseIds": ["cs-101", "math-121", "engl-101", "biol-100", "psyc-100"],
      "message": "Credit overload: 19 credits (maximum recommended: 18)",
      "severity": "warning"
    }
  ],
  "totalCredits": 19,
  "warnings": [
    {
      "type": "overload",
      ...
    }
  ],
  "errors": [
    {
      "type": "time",
      ...
    }
  ]
}
```

---

## Requirements Tracking

### POST /api/requirements/progress

Calculate requirement progress based on completed and scheduled courses.

**Request Body:**
```typescript
{
  requirements: Requirement[]
  completedCourses: CompletedCourse[]
  scheduledCourses?: Course[]
}
```

**Example Request:**
```json
{
  "requirements": [
    {
      "id": "req-cs-core",
      "category": "Major Core",
      "description": "Core Computer Science courses",
      "creditsRequired": 20,
      "creditsCompleted": 8,
      "coursesRequired": 5,
      "coursesCompleted": 2,
      "completed": false
    }
  ],
  "completedCourses": [
    {
      "courseId": "cs-101",
      "courseCode": "CMSC 101",
      "courseTitle": "Introduction to Computer Science",
      "credits": 4,
      "semester": "Fall",
      "year": 2023,
      "grade": "A",
      "fulfills": ["Major Core", "Quantitative"]
    }
  ],
  "scheduledCourses": [
    {
      "id": "cs-201",
      "code": "CMSC 201",
      "title": "Data Structures",
      "credits": 4,
      "fulfills": ["Major Core"],
      ...
    }
  ]
}
```

**Response:**
```json
{
  "requirements": [
    {
      "id": "req-cs-core",
      "category": "Major Core",
      "description": "Core Computer Science courses",
      "creditsRequired": 20,
      "creditsCompleted": 12,
      "coursesRequired": 5,
      "coursesCompleted": 3,
      "completed": false
    }
  ],
  "overallProgress": 48.5,
  "totalCreditsCompleted": 32,
  "totalCreditsRequired": 66,
  "completedRequirements": 2,
  "totalRequirements": 7,
  "onTrack": true,
  "remainingCredits": 34
}
```

---

## AI Recommendations

### POST /api/recommendations

Get AI-powered course recommendations based on student profile and goals.

**Request Body:**
```typescript
{
  studentProfile: StudentProfile
  currentSchedule: SemesterSchedule
  remainingRequirements: Requirement[]
  preferences?: {
    preferredDays?: DayOfWeek[]
    preferredTimeRange?: { start: string, end: string }
    maxCreditsPerSemester?: number
    avoidBackToBack?: boolean
  }
}
```

**Example Request:**
```json
{
  "studentProfile": {
    "id": "student-001",
    "name": "Alex Johnson",
    "major": "Computer Science",
    "currentYear": 2,
    "completedCourses": [...],
    ...
  },
  "currentSchedule": {
    "semester": "Fall",
    "year": 2024,
    "courses": [...],
    "totalCredits": 12,
    "conflicts": []
  },
  "remainingRequirements": [
    {
      "category": "Major Core",
      "creditsRequired": 20,
      "creditsCompleted": 8,
      ...
    }
  ],
  "preferences": {
    "preferredDays": ["Monday", "Wednesday", "Friday"],
    "preferredTimeRange": {
      "start": "10:00",
      "end": "16:00"
    },
    "maxCreditsPerSemester": 16,
    "avoidBackToBack": true
  }
}
```

**Response:**
```json
{
  "recommendedCourses": [
    {
      "id": "cs-245",
      "code": "CMSC 245",
      "title": "Database Systems",
      "credits": 4,
      "rationale": "Fulfills Major Core requirement and has no time conflicts",
      ...
    }
  ],
  "reasoning": "Based on your major requirements and current progress, these courses would help you stay on track for graduation.",
  "alternativePaths": [
    {
      "description": "Accelerated path - Complete major requirements early",
      "courses": [...]
    },
    {
      "description": "Balanced path - Mix major and general education courses",
      "courses": [...]
    }
  ],
  "warnings": [
    "Some courses have limited availability",
    "Consider scheduling advisor meeting to discuss options"
  ]
}
```

---

## Integration Guidelines

### AI Service Integration

The `/api/recommendations` endpoint is structured for easy AI integration:

**OpenAI GPT-4 Example:**
```typescript
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function getAIRecommendations(request: AIRecommendationRequest) {
  const prompt = `
    Student Profile: ${JSON.stringify(request.studentProfile)}
    Current Schedule: ${JSON.stringify(request.currentSchedule)}
    Remaining Requirements: ${JSON.stringify(request.remainingRequirements)}

    Recommend courses that:
    1. Fulfill remaining requirements
    2. Have no time conflicts
    3. Meet prerequisites
    4. Align with student preferences
  `

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  })

  return parseAIResponse(completion.choices[0].message.content)
}
```

**Anthropic Claude Example:**
```typescript
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function getAIRecommendations(request: AIRecommendationRequest) {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze this student's academic plan and recommend courses...`
    }],
  })

  return parseAIResponse(message.content)
}
```

---

### External Data Source Integration

All endpoints currently use mock data from `/lib/mock-data.ts`. To integrate with external systems:

**Database Integration:**
```typescript
// Replace mock data imports
import { prisma } from "@/lib/prisma"

// Example: Get courses from database
const courses = await prisma.course.findMany({
  where: { semester: "Fall", year: 2024 },
  include: { prerequisites: true, meetingTimes: true }
})
```

**External API Integration:**
```typescript
// Example: Fetch from Banner/PeopleSoft
async function fetchCoursesFromBanner(semester: string, year: number) {
  const response = await fetch(`${BANNER_API_URL}/courses`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    params: { semester, year }
  })
  return response.json()
}
```

---

### Advisor System Integration

The API structure supports integration with advisor dashboards:

**Example: Check Student Progress**
```typescript
const response = await fetch('/api/requirements/progress', {
  method: 'POST',
  body: JSON.stringify({
    requirements: studentRequirements,
    completedCourses: student.completedCourses,
    scheduledCourses: student.currentSchedule
  })
})

const { onTrack, remainingCredits } = await response.json()

if (!onTrack) {
  notifyAdvisor(student.id, { remainingCredits })
}
```

---

## Error Handling

All endpoints follow a consistent error format:

**400 Bad Request:**
```json
{
  "error": "Missing required fields: courses and studentProfile"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to validate schedule"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider:

- Rate limit by user/session
- Implement caching for frequently accessed data
- Use Redis for session management
- Monitor API usage metrics

---

## Future Enhancements

Planned API improvements:

1. **Real-time Updates**: WebSocket support for live schedule updates
2. **Batch Operations**: Bulk course validation and enrollment
3. **Analytics**: Student success prediction endpoints
4. **Collaboration**: Shared schedule planning endpoints
5. **Mobile API**: Optimized responses for mobile clients

---

## Testing

**Example API Tests:**

```typescript
// Test course search
const searchResponse = await fetch('/api/courses/search?q=computer')
expect(searchResponse.status).toBe(200)

// Test schedule validation
const validateResponse = await fetch('/api/schedule/validate', {
  method: 'POST',
  body: JSON.stringify({ courses, studentProfile })
})
expect(validateResponse.status).toBe(200)
const { valid, conflicts } = await validateResponse.json()
expect(conflicts).toHaveLength(0)
```

---

**Last Updated**: 2025-11-14
**Version**: 1.0
