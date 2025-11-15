# College Course Scheduling System - Schemer

A comprehensive web application for college students to select courses and automatically build conflict-free schedules that ensure graduation requirements are met.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Pages & Navigation](#pages--navigation)
4. [Technical Architecture](#technical-architecture)
5. [Data Models](#data-models)
6. [Getting Started](#getting-started)
7. [Future Enhancements](#future-enhancements)

---

## Overview

**Schemer** is an academic course planning platform designed for Haverford College students. It provides:

- Visual weekly schedule builder with automatic conflict detection
- Comprehensive course catalog with search and filtering
- Degree requirements tracking with progress visualization
- Student profile management with completed course history
- API-ready architecture for AI-powered recommendations

---

## Features

### Core Components

#### 1. Student Profile Setup ([/profile](app/profile/page.tsx))

**Functionality:**
- Basic information: name, email, major, minor, advisor
- Academic status: current year, semester, expected graduation
- Completed courses tracking with grades and semesters
- Automatic credit calculation

**Key Features:**
- Add/remove completed courses
- Search course catalog
- Data persistence with localStorage
- Export-ready profile data

---

#### 2. Schedule Builder ([/schedule](app/schedule/page.tsx))

**Functionality:**
- Visual weekly calendar grid (Monday-Friday, 8am-6pm)
- Add/remove courses to schedule
- Real-time conflict detection
- Credit hour tracking per semester

**Key Features:**
- **Time Conflict Detection**: Automatically identifies overlapping course times
- **Prerequisite Validation**: Ensures all prerequisites are met before adding courses
- **Corequisite Checking**: Validates concurrent course requirements
- **Credit Overload Warnings**: Alerts when exceeding 18 credits
- **Course Browser Modal**: Search and filter available courses
- **Visual Calendar**: Color-coded course blocks with location and time info

**Conflict Types:**
- Time conflicts (error - prevents scheduling)
- Missing prerequisites (error - prevents scheduling)
- Missing corequisites (error - prevents scheduling)
- Credit overload (warning - allows scheduling with caution)

---

#### 3. Course Catalog Browser

**Built into Schedule Builder**

**Functionality:**
- Search by course code, title, or instructor
- Filter by department
- View course details: description, credits, times, enrollment
- Real-time availability checking

**Search Features:**
- Intelligent filtering (excludes completed and already-scheduled courses)
- Department dropdown
- Instant search results
- Enrollment status (X/Y enrolled)
- Prerequisite indicators

---

#### 4. Requirements Tracking ([/requirements](app/requirements/page.tsx))

**Functionality:**
- Degree requirements checklist
- Visual progress indicators
- Requirement category grouping
- Graduation readiness status

**Key Features:**
- **Overall Progress Bar**: Shows percentage complete across all requirements
- **Categorized Requirements**: Major Core, Major Electives, General Education, etc.
- **Three Status Groups**:
  - Completed (green) - Requirements fully met
  - In Progress (blue) - Partially completed
  - Not Started (gray) - No progress yet
- **Credit Tracking**: Shows credits completed vs. required for each category
- **Course Counting**: Tracks number of courses if specific count required
- **Graduation Status**: Congratulations message when all requirements met

**Requirement Categories:**
- Major Core
- Major Elective
- General Education
- Humanities
- Social Sciences
- Natural Sciences
- Quantitative
- Writing
- Language
- Free Elective

---

#### 5. Data Persistence

**Storage System** ([lib/storage.ts](lib/storage.ts))

**LocalStorage Keys:**
- `schemer_student_profile` - Student information and completed courses
- `schemer_four_year_plan` - Multi-semester planning data
- `schemer_course_cart` - Shopping cart for course selection
- `schemer_requirements` - Degree requirements and progress
- `schemer_current_semester` - Active semester schedule

**Functions:**
- Save/load for each data type
- Export all data as JSON
- Import from JSON backup
- Clear all data

---

#### 6. API Endpoints (Future AI Integration)

**Course Search** ([/api/courses/search](app/api/courses/search/route.ts))
- GET with query parameters
- POST with complex filters
- Returns filtered course list

**Schedule Validation** ([/api/schedule/validate](app/api/schedule/validate/route.ts))
- Validates schedule for conflicts
- Returns conflict details and severity
- Calculates total credits

**Requirements Progress** ([/api/requirements/progress](app/api/requirements/progress/route.ts))
- Calculates completion percentage
- Updates requirement status
- Projects future progress with scheduled courses

**AI Recommendations** ([/api/recommendations](app/api/recommendations/route.ts))
- Ready for AI service integration (OpenAI, Anthropic Claude, etc.)
- Structured request/response format
- Supports student preferences (preferred days, time ranges, etc.)
- Returns course recommendations with reasoning

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for full API details.

---

## Pages & Navigation

### Landing Page ([/](app/page.tsx))
- Red/black theme with animated background
- Navigation to all features
- "Get Started" CTA → Schedule Builder

### Schedule Builder ([/schedule](app/schedule/page.tsx))
- Visual weekly calendar
- Course browser modal
- Real-time conflict detection
- Credit tracking

### Requirements Dashboard ([/requirements](app/requirements/page.tsx))
- Progress visualization
- Categorized requirements
- Graduation status

### Student Profile ([/profile](app/profile/page.tsx))
- Personal information
- Academic status
- Completed courses management

### Advisor Dashboard ([/advisor](app/advisor/page.tsx))
- Existing advisor portal (preserved from original)
- Student monitoring

---

## Technical Architecture

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18 (Client Components)
- TypeScript (Strict Mode)
- Tailwind CSS

**Libraries:**
- Framer Motion - Animations
- Lucide React - Icons
- clsx & tailwind-merge - Utility class management

**State Management:**
- React useState/useEffect hooks
- LocalStorage for persistence
- No global state library (clean, simple architecture)

---

### File Structure

```
/app
  /page.tsx                       # Landing page
  /schedule/page.tsx              # Schedule builder
  /requirements/page.tsx          # Requirements tracker
  /profile/page.tsx               # Student profile
  /advisor/page.tsx               # Advisor dashboard
  /student/page.tsx               # Legacy student portal
  /api
    /courses/search/route.ts      # Course search API
    /schedule/validate/route.ts   # Schedule validation API
    /requirements/progress/route.ts # Requirements progress API
    /recommendations/route.ts     # AI recommendations API (ready)

/lib
  /types.ts                       # TypeScript interfaces
  /schedule-utils.ts              # Schedule validation logic
  /mock-data.ts                   # Sample data
  /storage.ts                     # LocalStorage utilities

/components
  /shimmer-button.tsx             # Animated button component
  /line-shadow-text.tsx           # Text effect component
  /ui/button.tsx                  # Base button component
```

---

### Design System

**Color Scheme:**
- Landing: Black background + Red accents (`from-red-500 to-red-600`)
- Dashboards: Gray-50 background + White cards
- Status colors: Blue (primary), Green (success), Red (warning/error)

**Spacing:**
- Based on 4px grid
- Standard card padding: `p-6`
- Standard gap: `gap-6`

**Typography:**
- Headings: `text-2xl font-bold text-gray-800`
- Body: `text-gray-600`
- Small text: `text-sm text-gray-600`

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for complete design guidelines.

---

## Data Models

### Core Types

**Course** - Full course information
```typescript
{
  id: string
  code: string              // e.g., "CMSC 106"
  title: string
  description: string
  credits: number
  department: string
  instructor: string
  meetingTimes: TimeSlot[]
  prerequisites: string[]   // Course IDs
  corequisites: string[]
  fulfills: RequirementCategory[]
  semester: "Fall" | "Spring" | "Summer"
  year: number
  maxEnrollment: number
  currentEnrollment: number
  location: string
}
```

**StudentProfile** - Student information and history
```typescript
{
  id: string
  name: string
  email: string
  major: string
  minor?: string
  currentYear: 1-4
  currentSemester: "Fall" | "Spring" | "Summer"
  expectedGraduation: { semester, year }
  advisor?: string
  completedCourses: CompletedCourse[]
  totalCreditsCompleted: number
}
```

**Requirement** - Degree requirement tracking
```typescript
{
  id: string
  category: RequirementCategory
  description: string
  creditsRequired: number
  creditsCompleted: number
  coursesRequired?: number
  coursesCompleted?: number
  specificCourses?: string[]
  completed: boolean
}
```

**SemesterSchedule** - Schedule for one semester
```typescript
{
  semester: "Fall" | "Spring" | "Summer"
  year: number
  courses: ScheduledCourse[]
  totalCredits: number
  conflicts: ScheduleConflict[]
}
```

See [lib/types.ts](lib/types.ts) for all type definitions.

---

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### First Time Setup

1. Visit [/profile](http://localhost:3000/profile)
2. Enter your student information
3. Add completed courses
4. Navigate to [/schedule](http://localhost:3000/schedule)
5. Start building your schedule

### Using the Schedule Builder

1. Click "Add Course" to open the course browser
2. Search or filter courses by department
3. Click "Add" on desired courses
4. View automatic conflict detection
5. Remove courses with X button
6. Check requirements progress at [/requirements](http://localhost:3000/requirements)

---

## Schedule Validation Rules

### Time Conflicts
- Courses cannot overlap in time on the same day
- Even 1-minute overlap triggers error
- Example: Course A (10:00-11:00 Mon) conflicts with Course B (10:30-11:30 Mon)

### Prerequisite Validation
- All prerequisite courses must be completed OR scheduled in same semester
- Example: Cannot schedule CMSC 201 without CMSC 101 completed

### Corequisite Validation
- Corequisite courses must be completed OR scheduled concurrently
- Example: Cannot schedule Lab without Lecture

### Credit Limits
- Warning at 18+ credits
- No hard limit (advisor approval assumed)
- Displayed prominently in schedule stats

---

## Mock Data

The system includes realistic mock data:

**Departments:**
- Computer Science
- Mathematics
- English
- Biology
- Psychology
- Economics
- Philosophy

**Sample Courses:**
- CMSC 101 - Introduction to Computer Science (4 credits)
- CMSC 201 - Data Structures (4 credits, prereq: CMSC 101)
- MATH 121 - Calculus I (4 credits)
- ENGL 101 - College Writing (3 credits)
- And 10+ more courses

**Sample Student:**
- Name: Alex Johnson
- Major: Computer Science
- Minor: Mathematics
- Current: Sophomore, Fall 2024
- Completed: 15 credits (4 courses)

See [lib/mock-data.ts](lib/mock-data.ts) for all mock data.

---

## Future Enhancements

### Phase 1: AI Integration
- [ ] Connect AI recommendations API to OpenAI/Claude
- [ ] Intelligent course suggestions based on:
  - Major requirements
  - Past course performance
  - Preferred schedule patterns
  - Graduation timeline
- [ ] Alternative path generation
- [ ] "What-if" scenario planning

### Phase 2: Real Data Integration
- [ ] Connect to Banner/PeopleSoft course catalog
- [ ] Real-time enrollment data
- [ ] Live waitlist status
- [ ] Course prerequisite tree from registrar

### Phase 3: Collaboration Features
- [ ] Share schedules with advisors
- [ ] Advisor approval workflow
- [ ] Comments and feedback system
- [ ] Course recommendations from advisor

### Phase 4: Advanced Planning
- [ ] Four-year plan builder
- [ ] Multiple semester planning
- [ ] Study abroad integration
- [ ] Transfer credit management
- [ ] Dual degree planning

### Phase 5: Mobile & Notifications
- [ ] Mobile-responsive improvements
- [ ] Progressive Web App (PWA)
- [ ] Push notifications for:
  - Course seat availability
  - Registration deadlines
  - Advisor messages
- [ ] Calendar export (iCal, Google Calendar)

### Phase 6: Analytics & Insights
- [ ] Course difficulty predictions
- [ ] Workload balance analysis
- [ ] Success probability scoring
- [ ] Historical grade data integration
- [ ] Student success patterns

### Phase 7: Social Features
- [ ] Find classmates in courses
- [ ] Group study scheduling
- [ ] Course reviews and ratings
- [ ] Anonymous feedback system

---

## Integration Points

### External Systems Ready for Integration

**Course Catalog APIs:**
- Banner
- PeopleSoft
- Colleague
- Custom registrar systems

**AI Services:**
- OpenAI GPT-4
- Anthropic Claude
- Google Gemini
- Custom ML models

**Calendar Systems:**
- Google Calendar API
- iCal export
- Outlook integration

**Authentication:**
- SAML/SSO
- OAuth providers
- College directory (LDAP)

---

## Development Guidelines

### Adding New Features

1. **Define TypeScript interfaces** in [lib/types.ts](lib/types.ts)
2. **Create utility functions** in `lib/` directory
3. **Build UI component** following [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
4. **Add API endpoint** if needed in `app/api/`
5. **Update navigation** in landing page
6. **Test conflict detection** if schedule-related

### Code Style

- Follow existing patterns in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- Use TypeScript interfaces for all data
- Keep components client-side for now
- Use Tailwind for all styling
- Follow naming conventions:
  - PascalCase for components
  - camelCase for variables
  - kebab-case for files

### Testing Workflow

1. Test with mock data first
2. Add edge cases to mock data
3. Test conflict detection thoroughly
4. Verify localStorage persistence
5. Check responsive design
6. Test API endpoints with Postman/curl

---

## Troubleshooting

### Common Issues

**Schedule not saving:**
- Check browser localStorage is enabled
- Verify no JavaScript errors in console
- Try clearing cache and reloading

**Courses not appearing:**
- Verify mock data is loaded
- Check filter settings in course browser
- Ensure courses match current semester

**Conflicts not detected:**
- Check time format (HH:MM 24-hour)
- Verify schedule-utils functions
- Review conflict detection logic

**API endpoints not working:**
- Ensure Next.js dev server is running
- Check API route file naming
- Verify request body format matches types

---

## Performance Considerations

### Current Optimizations
- Client-side rendering (fast initial load)
- LocalStorage (no server round-trips)
- Efficient conflict detection algorithms
- Filtered search (excludes completed/scheduled)

### Future Optimizations
- Server-side rendering for SEO
- Database caching
- Redis for session management
- CDN for static assets
- Code splitting by route
- Lazy loading for large course lists

---

## Security Considerations

### Current State
- Client-side only (no authentication yet)
- LocalStorage (browser-based, per-device)
- No sensitive data transmission

### Production Requirements
- [ ] User authentication (SSO)
- [ ] Role-based access control
- [ ] HTTPS enforcement
- [ ] API rate limiting
- [ ] Input validation and sanitization
- [ ] CSRF protection
- [ ] Audit logging

---

## Accessibility

### Current Features
- Semantic HTML
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader friendly labels

### Future Improvements
- [ ] ARIA labels for calendar grid
- [ ] Keyboard shortcuts documentation
- [ ] High contrast mode
- [ ] Screen reader testing
- [ ] Focus management improvements

---

## Browser Support

**Tested:**
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

**Required Features:**
- LocalStorage
- ES6+ JavaScript
- CSS Grid
- Flexbox

---

## License

[Add your license here]

---

## Contact

For questions or issues with the scheduling system:
- Check existing documentation
- Review API documentation
- Contact development team

---

**Last Updated**: 2025-11-14
**Version**: 1.0
**Status**: Production Ready (with mock data)
