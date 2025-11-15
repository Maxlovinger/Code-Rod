# Schemer Design System & Development Guide

> **Purpose**: This document serves as the single source of truth for maintaining design and code consistency across the Schemer application (Haverford College Course Planning Platform).

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Color Schemes](#color-schemes)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Patterns](#component-patterns)
6. [Animation Guidelines](#animation-guidelines)
7. [Code Style Conventions](#code-style-conventions)
8. [Page Templates](#page-templates)

---

## Technology Stack

### Core Technologies
- **Framework**: Next.js 14.0.0 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3.4.18
- **Animation**: Framer Motion v10.18.0
- **Icons**: Lucide React v0.294.0

### Key Utilities
```typescript
// /lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Import Alias
```typescript
"@/*" // All imports use @ prefix
// Example: import { cn } from "@/lib/utils"
```

---

## Color Schemes

### Landing Page Theme (Black + Red)

**Background & Text**:
```typescript
bg-black           // Pure black background
text-white         // Primary text
text-white/80      // Secondary text (80% opacity)
text-white/60      // Tertiary text (60% opacity)
```

**Red Accent Palette**:
| Usage | Tailwind Class | RGB Value | Opacity |
|-------|----------------|-----------|---------|
| Primary gradient start | `from-red-500` | `239, 68, 68` | 100% |
| Primary gradient end | `to-red-600` | `220, 38, 38` | 100% |
| Hover gradient start | `hover:from-red-600` | `220, 38, 38` | 100% |
| Hover gradient end | `hover:to-red-700` | `185, 28, 28` | 100% |
| Border accent | `border-red-400/30` | `248, 113, 113` | 30% |
| Shadow | `shadow-red-500/25` | `239, 68, 68` | 25% |
| Hover shadow | `shadow-red-500/40` | `239, 68, 68` | 40% |

**Primary CTA Button**:
```tsx
<button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300">
  Get Started
</button>
```

---

### Dashboard Theme (Gray + Semantic Colors)

**Base Colors**:
```typescript
bg-gray-50         // Page background (#F9FAFB)
bg-white           // Card surfaces
text-gray-800      // Headings (#1F2937)
text-gray-600      // Body text (#4B5563)
border-gray-200    // Card borders (#E5E7EB)
bg-gray-200        // Progress bar background
```

**Semantic Colors**:
| Purpose | Background | Text | Icon | Border |
|---------|------------|------|------|--------|
| **Primary Action** | `bg-blue-600` | `text-white` | `text-blue-600` | `border-blue-200` |
| **Success/On Track** | `bg-green-50` | `text-green-800` | `text-green-600` | `border-green-200` |
| **Warning/Attention** | `bg-red-100` | `text-red-800` | `text-red-600` | `border-red-200` |
| **Info** | `bg-blue-50` | `text-blue-800` | `text-blue-700` | `border-blue-200` |

**Standard Dashboard Card**:
```tsx
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Card Title</h2>
  <p className="text-gray-600">Card content...</p>
</div>
```

---

### CSS Custom Properties (globals.css)

**Design Tokens** (OKLCH color space):
```css
:root {
  --background: oklch(1 0 0);           /* Pure white */
  --foreground: oklch(0.145 0 0);       /* Near black */
  --primary: oklch(0.205 0 0);          /* Dark gray */
  --destructive: oklch(0.577 0.245 27.325); /* Red tone */
  --radius: 0.625rem;                   /* 10px base border radius */
  --speed: 1s;                          /* Animation duration */
}
```

**Border Radius Scale**:
```css
--radius-sm: calc(var(--radius) - 4px)  /* 6px */
--radius-md: calc(var(--radius) - 2px)  /* 8px */
--radius-lg: var(--radius)              /* 10px */
--radius-xl: calc(var(--radius) + 4px)  /* 14px */
```

---

## Typography

### Font Scale
```typescript
text-xs     // 12px - Labels, metadata
text-sm     // 14px - Secondary text
text-base   // 16px - Body text
text-lg     // 18px - Emphasized text
text-xl     // 20px - Small headings
text-2xl    // 24px - Section headings
text-3xl    // 30px - Page headings
text-5xl    // 48px - Large hero text
text-6xl    // 60px - XL hero text
text-8xl    // 96px - XXL hero text (landing page)
```

### Font Weights
```typescript
font-light      // 300 - Light text
font-medium     // 500 - Emphasized body
font-semibold   // 600 - Subheadings
font-bold       // 700 - Headings
```

### Responsive Typography Pattern
```tsx
// Landing page hero headline
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">
  Headline Text
</h1>
```

---

## Spacing & Layout

### Tailwind Spacing Scale (4px base unit)
```typescript
p-2   // 8px   - Tight padding
p-4   // 16px  - Medium padding
p-6   // 24px  - Standard card padding
p-8   // 32px  - Large padding

gap-2  // 8px   - Tight grid/flex gap
gap-4  // 16px  - Medium gap
gap-6  // 24px  - Standard gap

space-x-3  // 12px - Horizontal spacing
space-x-4  // 16px - Horizontal spacing
space-y-4  // 16px - Vertical spacing
```

### Common Layout Patterns

**Max-Width Container**:
```tsx
<div className="max-w-6xl mx-auto px-6">
  {/* Content */}
</div>
```

**Responsive Grid**:
```tsx
// 1 column mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

**Card Layout**:
```tsx
<div className="bg-white rounded-lg shadow p-6 space-y-4">
  {/* Card content */}
</div>
```

---

## Component Patterns

### Component Structure Template

```tsx
"use client"

import React, { forwardRef, type ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

interface MyComponentProps extends ComponentPropsWithoutRef<"div"> {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
}

const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes",
          variant === "primary" && "primary-classes",
          variant === "secondary" && "secondary-classes",
          size === "sm" && "text-sm p-2",
          size === "md" && "text-base p-4",
          size === "lg" && "text-lg p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

MyComponent.displayName = "MyComponent"

export default MyComponent
```

### Custom Components Reference

#### ShimmerButton
```tsx
import ShimmerButton from "@/components/shimmer-button"

<ShimmerButton
  shimmerColor="#ffffff"
  shimmerSize="0.05em"
  borderRadius="100px"
  shimmerDuration="3s"
  background="rgba(0, 0, 0, 1)"
  className="px-6 py-2.5"
>
  Button Text
</ShimmerButton>
```

#### LineShadowText
```tsx
import LineShadowText from "@/components/line-shadow-text"

<LineShadowText shadowColor="white" className="italic">
  Emphasized Text
</LineShadowText>
```

---

## Animation Guidelines

### Standard Transitions
```typescript
// All properties
transition-all duration-300

// Colors only (better performance)
transition-colors duration-300

// Transform only
transition-transform duration-300
```

### Hover Effects

**Button Hover**:
```tsx
className="hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
```

**Card Hover**:
```tsx
className="hover:bg-gray-50 transition-colors duration-300"
```

**Link/Arrow Hover**:
```tsx
<div className="group">
  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
</div>
```

### Active States
```typescript
active:translate-y-px  // Button press effect
```

### Custom Keyframe Animations

**Shimmer Effect** (from globals.css):
```css
animation: shimmer-slide var(--speed) ease-in-out infinite alternate
```

**Line Shadow** (from globals.css):
```css
animation: line-shadow 15s linear infinite
```

---

## Code Style Conventions

### TypeScript Rules

**Strict Mode**: Always enabled
```json
{
  "strict": true,
  "noEmit": true,
  "isolatedModules": true
}
```

**Type Imports**:
```typescript
import type React from "react"
import { type ClassValue } from "clsx"
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Components** | PascalCase | `ShimmerButton`, `LineShadowText` |
| **Props Interfaces** | `{Component}Props` | `ShimmerButtonProps` |
| **Files** | kebab-case | `shimmer-button.tsx` |
| **State Variables** | camelCase | `mobileMenuOpen`, `completedCredits` |
| **Boolean States** | Prefix `is`/verb | `isOpen`, `onTrack` |
| **CSS Variables** | kebab-case | `--shimmer-color`, `--radius-lg` |
| **Folders** | lowercase | `advisor`, `student` |

### Client Components
All pages currently use client components:
```tsx
"use client"

export default function Page() {
  // ...
}
```

### Props Spreading Pattern
```tsx
const Component = ({ specificProp, ...props }: Props) => (
  <element {...props}>...</element>
)
```

### Conditional Rendering
```tsx
// Ternary for className
className={course.completed ? 'bg-green-50' : 'bg-gray-50'}

// Logical AND for optional rendering
{mobileMenuOpen && <MobileMenu />}
```

---

## Page Templates

### Landing Page Pattern

```tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Logo and links */}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Animated background (optional) */}

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20">
              <span className="text-sm">Badge Text</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">
              Your Headline
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Subheadline text
            </p>

            {/* CTA Button */}
            <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 px-6 py-3 rounded-lg font-medium">
              Call to Action
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
```

---

### Dashboard Page Pattern

```tsx
"use client"

import { useState } from "react"
import { Users, CheckCircle, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Title</h1>
          <p className="text-gray-600 mt-1">Dashboard description</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stat Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Metric Name</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">123</p>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Section Title
          </h2>
          {/* Content */}
        </div>
      </main>
    </div>
  )
}
```

---

## Quick Reference Checklist

When creating a new page/component, ensure:

- [ ] `"use client"` directive if using state/events
- [ ] TypeScript interface for props (extends native element props)
- [ ] `cn()` utility for conditional classes
- [ ] Correct color scheme:
  - Landing style → Black bg + red accents
  - Dashboard style → Gray-50 bg + white cards
- [ ] Consistent spacing (`p-6` for cards, `gap-6` for grids)
- [ ] Responsive breakpoints (`md:`, `lg:`)
- [ ] Semantic colors (blue=primary, green=success, red=warning)
- [ ] Standard transitions (`transition-all duration-300`)
- [ ] ForwardRef pattern for reusable UI components
- [ ] DisplayName set for components

---

## File Structure Reference

```
/Users/aidanrodriguez/Documents/Code-Rod/
├── app/
│   ├── page.tsx              # Landing page (black + red theme)
│   ├── student/page.tsx      # Student dashboard
│   ├── advisor/page.tsx      # Advisor dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles & animations
├── components/
│   ├── shimmer-button.tsx    # Animated shimmer button
│   ├── line-shadow-text.tsx  # Text with line shadow effect
│   └── ui/
│       └── button.tsx        # Base button component
├── lib/
│   └── utils.ts              # cn() helper function
└── public/
    ├── logo.png              # Primary logo
    └── logo2.png             # Alternative logo
```

---

## Common Data Structures

### Course Interface
```typescript
interface Course {
  id: string
  name: string
  credits: number
  completed: boolean
  semester?: string
}
```

### Student Interface
```typescript
interface Student {
  id: string
  name: string
  major: string
  year: string
  creditsCompleted: number
  totalCredits: number
  onTrack: boolean
  lastMeeting?: string
}
```

---

## Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Next.js 14 Docs**: https://nextjs.org/docs
- **Lucide Icons**: https://lucide.dev
- **Framer Motion**: https://www.framer.com/motion

---

**Last Updated**: 2025-11-14
**Maintained By**: Development Team
**Version**: 1.0
