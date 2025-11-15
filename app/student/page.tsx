"use client"

import { useState } from 'react'
import { CheckCircle, Circle, Download, BookOpen, Target } from 'lucide-react'

interface Course {
  id: string
  name: string
  credits: number
  completed: boolean
  semester?: string
}

export default function StudentDashboard() {
  const [major, setMajor] = useState('Computer Science')
  const [minor, setMinor] = useState('Mathematics')
  
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'CMSC 105 - Intro to Computing', credits: 1, completed: true, semester: 'Fall 2023' },
    { id: '2', name: 'CMSC 106 - Intro to Computer Science', credits: 1, completed: true, semester: 'Spring 2024' },
    { id: '3', name: 'CMSC 245 - Data Structures', credits: 1, completed: false },
    { id: '4', name: 'CMSC 256 - Computer Systems', credits: 1, completed: false },
    { id: '5', name: 'MATH 215 - Linear Algebra', credits: 1, completed: true, semester: 'Fall 2023' },
    { id: '6', name: 'MATH 216 - Multivariable Calculus', credits: 1, completed: false },
  ])

  const toggleCourse = (id: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, completed: !course.completed } : course
    ))
  }

  const completedCredits = courses.filter(c => c.completed).reduce((sum, c) => sum + c.credits, 0)
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back! Track your academic progress</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Academic Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                <select 
                  value={major} 
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option>Computer Science</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Biology</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minor</label>
                <select 
                  value={minor} 
                  onChange={(e) => setMinor(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option>Mathematics</option>
                  <option>Philosophy</option>
                  <option>Economics</option>
                  <option>None</option>
                </select>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{completedCredits}/{totalCredits} credits</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(completedCredits / totalCredits) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                Course Requirements
              </h2>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    course.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleCourse(course.id)}
                >
                  {course.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 mr-3" />
                  )}
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${course.completed ? 'text-green-800' : 'text-gray-800'}`}>
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {course.credits} credit{course.credits !== 1 ? 's' : ''}
                      {course.semester && ` • Completed ${course.semester}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">AI Recommendation</h3>
              <p className="text-blue-700 text-sm">
                Based on your progress, consider taking CMSC 245 (Data Structures) next semester 
                to stay on track for graduation. This course is a prerequisite for several advanced CS courses.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}