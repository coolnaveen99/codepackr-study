import { useState, useMemo, useEffect, useRef } from 'react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

interface Question {
  id: string
  text: string
  type: 'mcq' | 'numerical'
  options?: string[]
  correct: string // option index as string or numerical answer
  marks: number
  negative: number
}

interface Section {
  id: string
  name: string
  durationMin: number
  questions: Question[]
}

const SAMPLE_SECTIONS: Section[] = [
  {
    id: '1',
    name: 'Physics',
    durationMin: 20,
    questions: [
      { id: 'q1', text: 'Acceleration due to gravity on Earth is approximately?', type: 'mcq', options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '11 m/s²'], correct: '0', marks: 4, negative: 1 },
      { id: 'q2', text: 'A body starts from rest with acceleration 2 m/s². Distance in 5 s (m)?', type: 'numerical', correct: '25', marks: 4, negative: 0 },
    ],
  },
  {
    id: '2',
    name: 'Chemistry',
    durationMin: 15,
    questions: [
      { id: 'q3', text: 'Atomic number of Carbon is?', type: 'mcq', options: ['4', '6', '8', '12'], correct: '1', marks: 4, negative: 1 },
    ],
  },
]

type Phase = 'build' | 'exam' | 'review'

export const MockExamBuilder: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'mock-exam-builder')!
  const [sections, setSections] = useState<Section[]>(SAMPLE_SECTIONS)
  const [phase, setPhase] = useState<Phase>('build')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalDuration = useMemo(() => sections.reduce((s, sec) => s + sec.durationMin, 0), [sections])
  const allQuestions = useMemo(() => sections.flatMap(s => s.questions.map(q => ({ ...q, sectionName: s.name }))), [sections])

  const score = useMemo(() => {
    let obtained = 0
    let max = 0
    let correct = 0
    let wrong = 0
    let skipped = 0
    for (const q of allQuestions) {
      max += q.marks
      const ans = answers[q.id]
      if (ans === undefined || ans === '') { skipped++; continue }
      const isCorrect = q.type === 'mcq' ? ans === q.correct : Math.abs(parseFloat(ans) - parseFloat(q.correct)) < 1e-6
      if (isCorrect) { obtained += q.marks; correct++ }
      else { obtained -= q.negative; wrong++ }
    }
    return { obtained, max, correct, wrong, skipped, pct: max > 0 ? (obtained / max) * 100 : 0 }
  }, [allQuestions, answers])

  useEffect(() => {
    if (phase !== 'exam') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setPhase('review')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  const startExam = () => {
    setAnswers({})
    setActiveSectionIdx(0)
    setSecondsLeft(totalDuration * 60)
    setPhase('exam')
  }

  const handleCopy = async () => {
    const text = [
      'Mock Exam Results — study.codepackr.com',
      `Score: ${score.obtained.toFixed(1)} / ${score.max} (${score.pct.toFixed(1)}%)`,
      `Correct: ${score.correct} | Wrong: ${score.wrong} | Skipped: ${score.skipped}`,
    ].join('\n')
    if (await copyToClipboard(text)) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const fmtTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  // BUILD phase
  if (phase === 'build') {
    return (
      <div className="w-full">
        <ToolHeader
          title={toolDef.name}
          description={toolDef.description}
          badge={toolDef.badge}
          categoryName="Study Aids & Timers"
          onLoadSample={() => setSections(SAMPLE_SECTIONS)}
          onReset={() => setSections([{ id: '1', name: 'Section 1', durationMin: 30, questions: [] }])}
          onCopyResult={handleCopy}
          isCopied={copied}
          onBack={onBack}
        />
        <div className="space-y-4">
          {sections.map((sec, si) => (
            <div key={sec.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Section name</label>
                  <input value={sec.name} onChange={e => setSections(prev => prev.map((s, i) => i === si ? { ...s, name: e.target.value } : s))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="w-28">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Minutes</label>
                  <input type="number" min={1} value={sec.durationMin} onChange={e => setSections(prev => prev.map((s, i) => i === si ? { ...s, durationMin: Number(e.target.value) || 1 } : s))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <button type="button" onClick={() => setSections(prev => prev.filter((_, i) => i !== si))} className="text-xs text-slate-400 hover:text-red-500 px-2 py-2">Remove</button>
              </div>
              {sec.questions.map((q, qi) => (
                <div key={q.id} className="pl-3 border-l-2 border-indigo-100 space-y-1">
                  <input value={q.text} onChange={e => setSections(prev => prev.map((s, i) => i === si ? { ...s, questions: s.questions.map((qq, j) => j === qi ? { ...qq, text: e.target.value } : qq) } : s))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Question text" />
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100">{q.type}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">+{q.marks} / -{q.negative}</span>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setSections(prev => prev.map((s, i) => i === si ? { ...s, questions: [...s.questions, { id: crypto.randomUUID(), text: 'New question', type: 'mcq', options: ['A', 'B', 'C', 'D'], correct: '0', marks: 4, negative: 1 }] } : s))} className="text-xs font-medium text-indigo-600 hover:underline">+ Add question</button>
            </div>
          ))}
          <button type="button" onClick={() => setSections(prev => [...prev, { id: crypto.randomUUID(), name: `Section ${prev.length + 1}`, durationMin: 20, questions: [] }])} className="text-sm font-medium px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">+ Add section</button>
          <div className="pt-4">
            <button type="button" onClick={startExam} disabled={allQuestions.length === 0} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
              Start Mock Exam ({totalDuration} min, {allQuestions.length} Qs)
            </button>
          </div>
        </div>
        <FaqSection faqs={toolDef.faqs} />
      </div>
    )
  }

  // EXAM phase
  if (phase === 'exam') {
    const sec = sections[activeSectionIdx] || sections[0]
    return (
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">{sec?.name || 'Exam'}</h1>
          <div className={`text-2xl font-mono font-bold ${secondsLeft < 60 ? 'text-red-600' : 'text-indigo-600'}`}>{fmtTime(secondsLeft)}</div>
          <button type="button" onClick={() => setPhase('review')} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-medium">Submit</button>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {sections.map((s, i) => (
            <button key={s.id} type="button" onClick={() => setActiveSectionIdx(i)} className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap ${i === activeSectionIdx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{s.name}</button>
          ))}
        </div>
        <div className="space-y-6">
          {sec?.questions.map((q, idx) => (
            <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-medium text-slate-900 mb-3">Q{idx + 1}. {q.text} <span className="text-xs text-slate-400">(+{q.marks}/-{q.negative})</span></p>
              {q.type === 'mcq' && q.options ? (
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name={q.id} checked={answers[q.id] === String(oi)} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: String(oi) }))} className="text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-sm text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input type="number" step="any" value={answers[q.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))} placeholder="Enter number" className="w-full max-w-xs px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // REVIEW phase
  return (
    <div className="w-full">
      <ToolHeader
        title="Exam Review"
        description={`Score: ${score.obtained.toFixed(1)} / ${score.max} (${score.pct.toFixed(1)}%)`}
        categoryName="Study Aids & Timers"
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={() => setPhase('build')}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-2xl font-bold text-emerald-600">{score.correct}</p><p className="text-xs text-slate-500">Correct</p></div>
        <div><p className="text-2xl font-bold text-red-500">{score.wrong}</p><p className="text-xs text-slate-500">Wrong</p></div>
        <div><p className="text-2xl font-bold text-slate-400">{score.skipped}</p><p className="text-xs text-slate-500">Skipped</p></div>
        <div><p className="text-2xl font-bold text-indigo-600">{score.pct.toFixed(1)}%</p><p className="text-xs text-slate-500">Score</p></div>
      </div>
      <div className="space-y-4">
        {allQuestions.map((q, idx) => {
          const ans = answers[q.id]
          const isCorrect = ans !== undefined && ans !== '' && (q.type === 'mcq' ? ans === q.correct : Math.abs(parseFloat(ans) - parseFloat(q.correct)) < 1e-6)
          const skipped = ans === undefined || ans === ''
          return (
            <div key={q.id} className={`rounded-2xl border p-4 ${skipped ? 'border-slate-200 bg-slate-50' : isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
              <p className="text-sm font-medium text-slate-800">Q{idx + 1}. {q.text}</p>
              <p className="text-xs text-slate-500 mt-1">Your answer: {skipped ? '—' : (q.type === 'mcq' && q.options ? q.options[parseInt(ans)] : ans)} | Correct: {q.type === 'mcq' && q.options ? q.options[parseInt(q.correct)] : q.correct}</p>
            </div>
          )
        })}
      </div>
      <div className="mt-6">
        <button type="button" onClick={() => setPhase('build')} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700">Back to Builder</button>
      </div>
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
