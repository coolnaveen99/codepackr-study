import React, { useState, useMemo } from 'react'
import { Plus, Trash2, Target, Percent, CheckCircle2 } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

interface Assignment {
  id: string
  name: string
  score: number
  total: number
  weight: number
}

const SAMPLE_ASSIGNMENTS: Assignment[] = [
  { id: '1', name: 'Homework & Problem Sets', score: 94, total: 100, weight: 20 },
  { id: '2', name: 'Midterm Exam', score: 85, total: 100, weight: 25 },
  { id: '3', name: 'Research Project', score: 90, total: 100, weight: 25 },
  { id: '4', name: 'Class Participation', score: 100, total: 100, weight: 10 },
]

export const GradeCalculator: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'grade-calculator')!
  const [activeTab, setActiveTab] = useState<'weighted' | 'simple' | 'target'>('weighted')

  // Simple marks
  const [obtainedMarks, setObtainedMarks] = useState<string>('442')
  const [maxMarks, setMaxMarks] = useState<string>('500')

  // Weighted assignments
  const [assignments, setAssignments] = useState<Assignment[]>(SAMPLE_ASSIGNMENTS)

  // Target final grade
  const [currentGrade, setCurrentGrade] = useState<string>('86')
  const [desiredGrade, setDesiredGrade] = useState<string>('90')
  const [finalWeight, setFinalWeight] = useState<string>('30')

  const [copied, setCopied] = useState(false)

  // Calculations for Weighted
  const weightedCalculation = useMemo(() => {
    let totalWeight = 0
    let earnedWeight = 0

    assignments.forEach(a => {
      const s = Number(a.score) || 0
      const t = Number(a.total) || 100
      const w = Number(a.weight) || 0

      if (t > 0 && w > 0) {
        const pct = s / t
        earnedWeight += pct * w
        totalWeight += w
      }
    })

    const courseGrade = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0
    let letter = 'F'
    if (courseGrade >= 93) letter = 'A'
    else if (courseGrade >= 90) letter = 'A-'
    else if (courseGrade >= 87) letter = 'B+'
    else if (courseGrade >= 83) letter = 'B'
    else if (courseGrade >= 80) letter = 'B-'
    else if (courseGrade >= 77) letter = 'C+'
    else if (courseGrade >= 70) letter = 'C'
    else if (courseGrade >= 60) letter = 'D'

    return {
      courseGrade: Number(courseGrade.toFixed(2)),
      totalWeight,
      letter
    }
  }, [assignments])

  // Calculation for Simple
  const simpleCalculation = useMemo(() => {
    const ob = parseFloat(obtainedMarks) || 0
    const mx = parseFloat(maxMarks) || 1
    const pct = mx > 0 ? (ob / mx) * 100 : 0
    return {
      percentage: Number(pct.toFixed(2)),
      isPassed: pct >= 40
    }
  }, [obtainedMarks, maxMarks])

  // Calculation for Final Target
  const targetCalculation = useMemo(() => {
    const current = parseFloat(currentGrade) || 0
    const desired = parseFloat(desiredGrade) || 0
    const weight = parseFloat(finalWeight) || 0

    if (weight <= 0 || weight >= 100) return { required: 0, possible: true }

    const currentWeight = (100 - weight) / 100
    const finalWeightDecimal = weight / 100
    // desired = (current * currentWeight) + (final * finalWeightDecimal)
    // final = (desired - (current * currentWeight)) / finalWeightDecimal
    const needed = (desired - (current * currentWeight)) / finalWeightDecimal
    return {
      required: Number(needed.toFixed(1)),
      possible: needed <= 100
    }
  }, [currentGrade, desiredGrade, finalWeight])

  const handleLoadSample = () => {
    if (activeTab === 'weighted') {
      setAssignments(SAMPLE_ASSIGNMENTS)
    } else if (activeTab === 'simple') {
      setObtainedMarks('465')
      setMaxMarks('500')
    } else {
      setCurrentGrade('84')
      setDesiredGrade('90')
      setFinalWeight('25')
    }
  }

  const handleReset = () => {
    if (activeTab === 'weighted') {
      setAssignments([
        { id: '1', name: 'Assignment 1', score: 80, total: 100, weight: 50 },
        { id: '2', name: 'Assignment 2', score: 90, total: 100, weight: 50 },
      ])
    } else if (activeTab === 'simple') {
      setObtainedMarks('')
      setMaxMarks('100')
    } else {
      setCurrentGrade('80')
      setDesiredGrade('90')
      setFinalWeight('30')
    }
  }

  const handleCopy = async () => {
    let text = ''
    if (activeTab === 'weighted') {
      text = `Codepackr Study — Course Grade Report\nOverall Grade: ${weightedCalculation.courseGrade}% (${weightedCalculation.letter})\nTotal Weight Accounted: ${weightedCalculation.totalWeight}%\nCalculated 100% in-browser at study.codepackr.com`
    } else if (activeTab === 'simple') {
      text = `Codepackr Study — Marks Percentage\nObtained: ${obtainedMarks}/${maxMarks} (${simpleCalculation.percentage}%)\nStatus: ${simpleCalculation.isPassed ? 'Passed' : 'Failed'}`
    } else {
      text = `Codepackr Study — Final Exam Target\nCurrent Course Grade: ${currentGrade}%\nTarget Final Course Grade: ${desiredGrade}%\nFinal Exam Weight: ${finalWeight}%\nRequired Score on Final Exam: ${targetCalculation.required}%`
    }

    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddAssignment = () => {
    setAssignments([
      ...assignments,
      {
        id: Date.now().toString(),
        name: `Assessment ${assignments.length + 1}`,
        score: 85,
        total: 100,
        weight: 15
      }
    ])
  }

  const handleRemoveAssignment = (id: string) => {
    if (assignments.length <= 1) return
    setAssignments(assignments.filter(a => a.id !== id))
  }

  const handleUpdateAssignment = (id: string, field: keyof Assignment, val: any) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: val } : a))
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

      {/* Mode Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit">
        <button
          onClick={() => setActiveTab('weighted')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
            activeTab === 'weighted'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Weighted Grade Calculator
        </button>
        <button
          onClick={() => setActiveTab('simple')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
            activeTab === 'simple'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Marks to Percentage
        </button>
        <button
          onClick={() => setActiveTab('target')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
            activeTab === 'target'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Final Exam Target
        </button>
      </div>

      {/* TAB 1: Weighted Assignments */}
      {activeTab === 'weighted' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Course Assessments
                </h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  weightedCalculation.totalWeight === 100
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  Weight: {weightedCalculation.totalWeight}% / 100%
                </span>
              </div>

              <div className="space-y-3">
                {assignments.map(item => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60"
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={e => handleUpdateAssignment(item.id, 'name', e.target.value)}
                      placeholder="Assessment Name"
                      className="flex-1 w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-1">
                        <label className="text-xs text-slate-500 font-medium">Score:</label>
                        <input
                          type="number"
                          min="0"
                          value={item.score}
                          onChange={e => handleUpdateAssignment(item.id, 'score', parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <span className="text-xs text-slate-400">/</span>
                        <input
                          type="number"
                          min="1"
                          value={item.total}
                          onChange={e => handleUpdateAssignment(item.id, 'total', parseFloat(e.target.value) || 100)}
                          className="w-16 px-2 py-1 text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <label className="text-xs text-slate-500 font-medium">Weight %:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.weight}
                          onChange={e => handleUpdateAssignment(item.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveAssignment(item.id)}
                        disabled={assignments.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddAssignment}
                className="mt-4 w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Assessment</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-slate-900 p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                Course Weighted Grade
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {weightedCalculation.courseGrade}%
                </span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  ({weightedCalculation.letter})
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex justify-between">
                  <span>Completed Weight</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {weightedCalculation.totalWeight}%
                  </span>
                </div>
                {weightedCalculation.totalWeight < 100 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    Remaining {100 - weightedCalculation.totalWeight}% of course grade has not been entered yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Simple Marks to Percentage */}
      {activeTab === 'simple' && (
        <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Marks Obtained
              </label>
              <input
                type="number"
                min="0"
                value={obtainedMarks}
                onChange={e => setObtainedMarks(e.target.value)}
                placeholder="e.g. 450"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Total / Maximum Marks
              </label>
              <input
                type="number"
                min="1"
                value={maxMarks}
                onChange={e => setMaxMarks(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Calculated Percentage
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-1">
              {simpleCalculation.percentage}%
            </div>
            <div className="mt-3 text-xs flex items-center justify-center gap-1.5 font-medium">
              <CheckCircle2 className={`w-4 h-4 ${simpleCalculation.isPassed ? 'text-emerald-500' : 'text-rose-500'}`} />
              <span className={simpleCalculation.isPassed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                {simpleCalculation.isPassed ? 'Passed (≥40%)' : 'Below Passing Threshold (<40%)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Final Exam Target */}
      {activeTab === 'target' && (
        <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              What Grade Do I Need on the Final Exam?
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Course Grade (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={currentGrade}
                onChange={e => setCurrentGrade(e.target.value)}
                placeholder="e.g. 84"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Overall Grade Desired (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={desiredGrade}
                onChange={e => setDesiredGrade(e.target.value)}
                placeholder="e.g. 90"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Weight of Final Exam (% of overall grade)
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={finalWeight}
                onChange={e => setFinalWeight(e.target.value)}
                placeholder="e.g. 30"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Required Final Exam Score
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-1">
              {targetCalculation.required}%
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {targetCalculation.required <= 100 && targetCalculation.required >= 0
                ? `You need at least ${targetCalculation.required}% on your final exam to achieve ${desiredGrade}%.`
                : targetCalculation.required > 100
                ? `Achieving ${desiredGrade}% is mathematically impossible without extra credit.`
                : `You have already secured your target grade!`}
            </p>
          </div>
        </div>
      )}

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
