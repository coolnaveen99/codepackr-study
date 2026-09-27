import { useState, useMemo } from 'react'
import { Target } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

interface RemainingCourse {
  id: string
  name: string
  credits: number
  expectedPoints: number
}

const GRADE_OPTIONS_4 = [
  { label: 'A (4.0)', value: 4.0 },
  { label: 'A- (3.7)', value: 3.7 },
  { label: 'B+ (3.3)', value: 3.3 },
  { label: 'B (3.0)', value: 3.0 },
  { label: 'B- (2.7)', value: 2.7 },
  { label: 'C+ (2.3)', value: 2.3 },
  { label: 'C (2.0)', value: 2.0 },
  { label: 'D (1.0)', value: 1.0 },
  { label: 'F (0)', value: 0 },
]

const GRADE_OPTIONS_10 = [
  { label: 'O / 10', value: 10 },
  { label: 'A+ / 9', value: 9 },
  { label: 'A / 8', value: 8 },
  { label: 'B+ / 7', value: 7 },
  { label: 'B / 6', value: 6 },
  { label: 'C / 5', value: 5 },
  { label: 'P / 4', value: 4 },
  { label: 'F / 0', value: 0 },
]

export const GpaGoalPlanner: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'gpa-goal-planner')!
  const [scale, setScale] = useState<'4' | '10'>('10')
  const [currentCgpa, setCurrentCgpa] = useState(7.8)
  const [completedCredits, setCompletedCredits] = useState(80)
  const [targetCgpa, setTargetCgpa] = useState(8.5)
  const [courses, setCourses] = useState<RemainingCourse[]>([
    { id: '1', name: 'Course A', credits: 4, expectedPoints: 9 },
    { id: '2', name: 'Course B', credits: 3, expectedPoints: 8 },
    { id: '3', name: 'Course C', credits: 4, expectedPoints: 9 },
  ])
  const [copied, setCopied] = useState(false)

  const maxScale = scale === '4' ? 4 : 10
  const gradeOptions = scale === '4' ? GRADE_OPTIONS_4 : GRADE_OPTIONS_10

  const result = useMemo(() => {
    const remainingCredits = courses.reduce((s, c) => s + Math.max(0, c.credits), 0)
    const expectedQuality = courses.reduce((s, c) => s + c.expectedPoints * Math.max(0, c.credits), 0)
    const totalCredits = completedCredits + remainingCredits
    const currentQuality = currentCgpa * completedCredits
    const projectedCgpa = totalCredits > 0 ? (currentQuality + expectedQuality) / totalCredits : currentCgpa

    let minAvgNeeded: number | null = null
    let reachable = true
    if (remainingCredits > 0) {
      minAvgNeeded = (targetCgpa * totalCredits - currentQuality) / remainingCredits
      if (minAvgNeeded > maxScale + 1e-6) reachable = false
      if (minAvgNeeded < 0) minAvgNeeded = 0
    } else {
      reachable = currentCgpa >= targetCgpa
    }

    return { remainingCredits, projectedCgpa, minAvgNeeded, reachable, totalCredits }
  }, [currentCgpa, completedCredits, targetCgpa, courses, maxScale])

  const updateCourse = (id: string, patch: Partial<RemainingCourse>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }

  const addCourse = () => {
    setCourses(prev => [...prev, {
      id: crypto.randomUUID(),
      name: `Course ${prev.length + 1}`,
      credits: 3,
      expectedPoints: scale === '4' ? 3.0 : 8,
    }])
  }

  const handleCopy = async () => {
    const text = [
      `GPA Goal Planner — study.codepackr.com`,
      `Scale: ${scale}.0`,
      `Current CGPA: ${currentCgpa} (${completedCredits} credits)`,
      `Target CGPA: ${targetCgpa}`,
      `Remaining credits: ${result.remainingCredits}`,
      `Projected CGPA with expected grades: ${result.projectedCgpa.toFixed(3)}`,
      result.remainingCredits > 0
        ? (result.reachable
            ? `Minimum average grade points needed on remaining work: ${result.minAvgNeeded!.toFixed(3)}`
            : `Target unreachable even with perfect grades.`)
        : '',
    ].filter(Boolean).join('\n')
    if (await copyToClipboard(text)) {
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
        categoryName="Academic Calculators"
        onLoadSample={() => {
          setScale('10')
          setCurrentCgpa(7.8)
          setCompletedCredits(80)
          setTargetCgpa(8.5)
          setCourses([
            { id: '1', name: 'Course A', credits: 4, expectedPoints: 9 },
            { id: '2', name: 'Course B', credits: 3, expectedPoints: 8 },
            { id: '3', name: 'Course C', credits: 4, expectedPoints: 9 },
          ])
        }}
        onReset={() => {
          setCurrentCgpa(0)
          setCompletedCredits(0)
          setTargetCgpa(scale === '4' ? 3.5 : 8)
          setCourses([])
        }}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Scale</label>
              <select value={scale} onChange={e => setScale(e.target.value as '4' | '10')} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="10">10-point (India)</option>
                <option value="4">4.0 (US)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Current CGPA</label>
              <input type="number" step="0.01" min={0} max={maxScale} value={currentCgpa} onChange={e => setCurrentCgpa(Number(e.target.value) || 0)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Credits completed</label>
              <input type="number" min={0} value={completedCredits} onChange={e => setCompletedCredits(Number(e.target.value) || 0)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Target CGPA</label>
              <input type="number" step="0.01" min={0} max={maxScale} value={targetCgpa} onChange={e => setTargetCgpa(Number(e.target.value) || 0)} className="w-full max-w-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Remaining courses (what-if)</h2>
              <button type="button" onClick={addCourse} className="text-xs font-medium px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100">+ Add course</button>
            </div>
            {courses.map(c => (
              <div key={c.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Name</label>
                  <input value={c.name} onChange={e => updateCourse(c.id, { name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Credits</label>
                  <input type="number" min={0} value={c.credits} onChange={e => updateCourse(c.id, { credits: Number(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-4">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Expected grade</label>
                  <select value={c.expectedPoints} onChange={e => updateCourse(c.id, { expectedPoints: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button type="button" onClick={() => setCourses(prev => prev.filter(x => x.id !== c.id))} className="text-xs text-slate-400 hover:text-red-500 py-2">✕</button>
                </div>
              </div>
            ))}
            {courses.length === 0 && <p className="text-sm text-slate-500">Add remaining courses to project your CGPA.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 text-indigo-600"><Target className="w-5 h-5" /><span className="text-xs font-bold uppercase">Projection</span></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Projected CGPA</p>
            <p className="text-4xl font-extrabold text-slate-900">{result.projectedCgpa.toFixed(3)}</p>
            <p className="text-xs text-slate-500 mt-1">After {result.remainingCredits} more credits</p>
          </div>
          {result.remainingCredits > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold">Min avg needed for target</p>
              {result.reachable ? (
                <p className="text-3xl font-extrabold text-indigo-600">{result.minAvgNeeded!.toFixed(3)}</p>
              ) : (
                <p className="text-lg font-bold text-amber-600">Unreachable</p>
              )}
              <p className="text-sm text-slate-600 mt-1">{result.reachable ? `Average at least ${result.minAvgNeeded!.toFixed(2)} points on remaining courses to hit ${targetCgpa}.` : `Even perfect grades on remaining work cannot reach ${targetCgpa}.`}</p>
            </div>
          )}
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
