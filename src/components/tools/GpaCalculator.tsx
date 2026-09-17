import React, { useState, useMemo } from 'react'
import { Plus, Trash2, Award, BookCheck, Calculator } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'
import { CourseItem } from '../../types'

type GradingSystem = 'us4' | 'in10' | 'percentage'

const US_GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
}

const IN_GRADE_POINTS: Record<string, { points: number; label: string }> = {
  'O': { points: 10, label: 'Outstanding (10)' },
  'A+': { points: 9, label: 'Excellent (9)' },
  'A': { points: 8, label: 'Very Good (8)' },
  'B+': { points: 7, label: 'Good (7)' },
  'B': { points: 6, label: 'Above Average (6)' },
  'C': { points: 5, label: 'Average (5)' },
  'P': { points: 4, label: 'Pass (4)' },
  'F': { points: 0, label: 'Fail (0)' },
}

const SAMPLE_COURSES_US: CourseItem[] = [
  { id: '1', name: 'Calculus II', credits: 4, grade: 'A' },
  { id: '2', name: 'Data Structures & Algorithms', credits: 4, grade: 'A-' },
  { id: '3', name: 'Physics Mechanics', credits: 4, grade: 'B+' },
  { id: '4', name: 'Academic Writing & Research', credits: 3, grade: 'A' },
  { id: '5', name: 'Introduction to Psychology', credits: 3, grade: 'B' },
]

const SAMPLE_COURSES_IN: CourseItem[] = [
  { id: '1', name: 'Engineering Mathematics', credits: 4, grade: 'O' },
  { id: '2', name: 'Object Oriented Programming', credits: 4, grade: 'A+' },
  { id: '3', name: 'Digital Electronics', credits: 3, grade: 'A' },
  { id: '4', name: 'Computer Architecture', credits: 3, grade: 'B+' },
  { id: '5', name: 'Microprocessor Lab', credits: 2, grade: 'O' },
]

interface GpaCalculatorProps {
  onBack?: () => void
}

export const GpaCalculator: React.FC<GpaCalculatorProps> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'gpa-calculator')!
  const [scale, setScale] = useState<GradingSystem>('us4')
  const [courses, setCourses] = useState<CourseItem[]>([
    { id: '1', name: 'Course 1', credits: 3, grade: scale === 'us4' ? 'A' : 'O' },
    { id: '2', name: 'Course 2', credits: 3, grade: scale === 'us4' ? 'B+' : 'A+' },
    { id: '3', name: 'Course 3', credits: 4, grade: scale === 'us4' ? 'A-' : 'A' },
  ])

  // Cumulative CGPA state
  const [includePriorCgpa, setIncludePriorCgpa] = useState(false)
  const [priorCredits, setPriorCredits] = useState<string>('60')
  const [priorCgpa, setPriorCgpa] = useState<string>('3.65')

  const [copied, setCopied] = useState(false)

  // Calculations
  const calculations = useMemo(() => {
    let totalCredits = 0
    let totalGradePoints = 0

    courses.forEach(course => {
      const cred = Number(course.credits) || 0
      if (cred <= 0) return

      let point = 0
      if (scale === 'us4') {
        point = US_GRADE_POINTS[course.grade] ?? 0
      } else if (scale === 'in10') {
        point = IN_GRADE_POINTS[course.grade]?.points ?? 0
      } else {
        const mark = Number(course.score) || 0
        point = mark / 10 // Linear percentage to 10
      }

      totalCredits += cred
      totalGradePoints += cred * point
    })

    const semesterGpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0

    // Cumulative CGPA calculation
    let cumulativeCgpa = semesterGpa
    let overallCredits = totalCredits

    if (includePriorCgpa) {
      const pCred = parseFloat(priorCredits) || 0
      const pGpa = parseFloat(priorCgpa) || 0
      if (pCred > 0 && pGpa >= 0) {
        overallCredits = totalCredits + pCred
        cumulativeCgpa = ((semesterGpa * totalCredits) + (pGpa * pCred)) / overallCredits
      }
    }

    // Percentage conversion estimations
    let percentageEquivalent = 0
    if (scale === 'in10') {
      percentageEquivalent = cumulativeCgpa * 9.5 // UGC/CBSE standard
    } else {
      percentageEquivalent = (cumulativeCgpa / 4.0) * 100
    }

    // Classification
    let honors = 'Good Standing'
    if (scale === 'us4') {
      if (cumulativeCgpa >= 3.9) honors = 'Summa Cum Laude (Highest Honors)'
      else if (cumulativeCgpa >= 3.7) honors = 'Magna Cum Laude (High Honors)'
      else if (cumulativeCgpa >= 3.5) honors = 'Cum Laude (Dean’s List)'
      else if (cumulativeCgpa < 2.0) honors = 'Academic Warning'
    } else {
      if (cumulativeCgpa >= 8.5) honors = 'First Class with Distinction'
      else if (cumulativeCgpa >= 7.0) honors = 'First Class'
      else if (cumulativeCgpa >= 5.5) honors = 'Second Class'
      else if (cumulativeCgpa >= 4.0) honors = 'Pass Class'
      else honors = 'Requires Improvement'
    }

    return {
      semesterGpa: Number(semesterGpa.toFixed(2)),
      totalCredits,
      cumulativeCgpa: Number(cumulativeCgpa.toFixed(2)),
      overallCredits,
      percentageEquivalent: Number(percentageEquivalent.toFixed(1)),
      honors
    }
  }, [courses, scale, includePriorCgpa, priorCredits, priorCgpa])

  const handleAddCourse = () => {
    const newId = Date.now().toString()
    setCourses([
      ...courses,
      {
        id: newId,
        name: `Course ${courses.length + 1}`,
        credits: 3,
        grade: scale === 'us4' ? 'A' : 'A+',
        score: 85
      }
    ])
  }

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return
    setCourses(courses.filter(c => c.id !== id))
  }

  const handleCourseChange = (id: string, field: keyof CourseItem, value: any) => {
    setCourses(courses.map(c => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleLoadSample = () => {
    if (scale === 'in10') {
      setCourses(SAMPLE_COURSES_IN)
      setPriorCredits('45')
      setPriorCgpa('8.6')
    } else {
      setCourses(SAMPLE_COURSES_US)
      setPriorCredits('60')
      setPriorCgpa('3.72')
    }
    setIncludePriorCgpa(true)
  }

  const handleReset = () => {
    setCourses([
      { id: '1', name: '', credits: 3, grade: scale === 'us4' ? 'A' : 'O' }
    ])
    setIncludePriorCgpa(false)
    setPriorCredits('0')
    setPriorCgpa('0')
  }

  const handleCopy = async () => {
    const scaleLabel = scale === 'us4' ? 'US 4.0 Scale' : scale === 'in10' ? 'Indian 10.0 Scale' : 'Percentage Scale'
    const report = [
      `=== Codepackr Study: GPA & CGPA Calculation Report ===`,
      `Grading System: ${scaleLabel}`,
      `Semester GPA: ${calculations.semesterGpa} (Credits: ${calculations.totalCredits})`,
      includePriorCgpa ? `Overall Cumulative CGPA: ${calculations.cumulativeCgpa} (Total Credits: ${calculations.overallCredits})` : '',
      `Estimated Percentage: ${calculations.percentageEquivalent}%`,
      `Academic Standing: ${calculations.honors}`,
      ``,
      `Courses Included:`,
      ...courses.map((c, i) => `  ${i + 1}. ${c.name || 'Unnamed Course'}: ${c.credits} credits - Grade: ${c.grade}`),
      ``,
      `Calculated 100% in-browser at study.codepackr.com`
    ].filter(Boolean).join('\n')

    const success = await copyToClipboard(report)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Academic Calculator"
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      {/* Scale Selector */}
      <div className="mb-6 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit">
        <button
          onClick={() => setScale('us4')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
            scale === 'us4'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          4.0 Scale (US / International)
        </button>
        <button
          onClick={() => setScale('in10')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
            scale === 'in10'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          10.0 Scale (Indian UGC / AICTE)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Course Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Semester Courses</span>
              </h2>
              <span className="text-xs text-slate-500">
                {courses.length} {courses.length === 1 ? 'course' : 'courses'}
              </span>
            </div>

            <div className="space-y-3">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60"
                >
                  <div className="w-6 text-xs font-semibold text-slate-400 text-center shrink-0">
                    #{index + 1}
                  </div>

                  {/* Course Name */}
                  <input
                    type="text"
                    value={course.name}
                    onChange={e => handleCourseChange(course.id, 'name', e.target.value)}
                    placeholder="Course name (e.g. Calculus)"
                    className="flex-1 w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  {/* Credits */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-slate-500 font-medium">Credits:</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={course.credits}
                        onChange={e => handleCourseChange(course.id, 'credits', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2.5 py-1.5 text-xs sm:text-sm text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Grade selector */}
                    <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                      <label className="text-xs text-slate-500 font-medium">Grade:</label>
                      <select
                        value={course.grade}
                        onChange={e => handleCourseChange(course.id, 'grade', e.target.value)}
                        className="flex-1 sm:w-28 px-2.5 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {scale === 'us4' ? (
                          Object.entries(US_GRADE_POINTS).map(([letter, pts]) => (
                            <option key={letter} value={letter}>
                              {letter} ({pts.toFixed(1)})
                            </option>
                          ))
                        ) : (
                          Object.entries(IN_GRADE_POINTS).map(([letter, info]) => (
                            <option key={letter} value={letter}>
                              {letter} ({info.points} pts)
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Delete course */}
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(course.id)}
                      disabled={courses.length <= 1}
                      title="Remove course"
                      className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddCourse}
              className="mt-4 w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Course</span>
            </button>
          </div>

          {/* Cumulative Prior GPA Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cumulative CGPA (Prior Semesters)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Combine current semester with your previous transcripts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePriorCgpa}
                  onChange={e => setIncludePriorCgpa(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {includePriorCgpa && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Completed Prior Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={priorCredits}
                    onChange={e => setPriorCredits(e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Previous CGPA ({scale === 'us4' ? 'Max 4.0' : 'Max 10.0'})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={scale === 'us4' ? '4.0' : '10.0'}
                    step="0.01"
                    value={priorCgpa}
                    onChange={e => setPriorCgpa(e.target.value)}
                    placeholder={scale === 'us4' ? '3.50' : '8.25'}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Scorecard & Honours */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-slate-900 p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Semester Performance
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {calculations.semesterGpa.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-slate-500">
                / {scale === 'us4' ? '4.00' : '10.00'}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/40 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Semester Credits</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {calculations.totalCredits}
                </span>
              </div>

              {includePriorCgpa && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Overall CGPA</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                      {calculations.cumulativeCgpa.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Credits Earned</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {calculations.overallCredits}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500">Approx. Percentage</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ~{calculations.percentageEquivalent}%
                </span>
              </div>
            </div>

            {/* Academic Standing */}
            <div className="mt-5 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-medium text-slate-500">Academic Standing</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {calculations.honors}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Grading Scale Guide */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Scale Guide
            </h4>
            <p className="text-slate-500 mb-3 leading-relaxed">
              {scale === 'us4'
                ? 'US Standard Scale assigns 4.0 for A, 3.0 for B, 2.0 for C, and 0 for F.'
                : 'Indian 10-point scale: O (10), A+ (9), A (8), B+ (7), B (6), C (5), P (4). CBSE formula: % = CGPA × 9.5.'}
            </p>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[11px]">
              GPA Formula: <span className="font-mono">Σ(Credits × Grade Points) / Σ(Credits)</span>
            </div>
          </div>
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
