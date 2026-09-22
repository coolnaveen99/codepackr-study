import { useState, useMemo } from 'react'
import { HelpCircle, Check, X } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

type QA = { q: string; a: string }

function parseNotes(raw: string): QA[] {
  return raw.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    if (line.includes('|')) {
      const [q, a] = line.split('|').map(s => s.trim())
      return { q, a: a || '' }
    }
    const idx = line.indexOf(':')
    if (idx > 0) return { q: line.slice(0, idx).trim(), a: line.slice(idx + 1).trim() }
    return { q: line, a: '' }
  }).filter(x => x.q && x.a)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const SAMPLE = `What is the powerhouse of the cell? | Mitochondria\nCapital of France? | Paris\n2 + 2 = ? | 4\nH2O is? | Water\nLargest planet? | Jupiter`

export const QuizGenerator: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'quiz-generator')!
  const [notes, setNotes] = useState(SAMPLE)
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [copied, setCopied] = useState(false)

  const pool = useMemo(() => parseNotes(notes), [notes])

  const buildChoices = (i: number, p: QA[]) => {
    const correct = p[i].a
    const wrongs = shuffle(p.filter((_, j) => j !== i).map(x => x.a)).slice(0, 3)
    setChoices(shuffle([correct, ...wrongs]))
  }

  const startQuiz = () => {
    if (pool.length < 2) return
    setStarted(true)
    setIndex(0)
    setScore(0)
    setAnswered(0)
    setPicked(null)
    buildChoices(0, pool)
  }

  const onPick = (c: string) => {
    if (picked) return
    setPicked(c)
    setAnswered(a => a + 1)
    if (c === pool[index].a) setScore(s => s + 1)
  }

  const next = () => {
    const ni = index + 1
    if (ni >= pool.length) {
      setStarted(false)
      return
    }
    setIndex(ni)
    setPicked(null)
    buildChoices(ni, pool)
  }

  const handleCopy = async () => {
    if (await copyToClipboard(`Quiz score: ${score}/${answered}\nItems: ${pool.length}\nstudy.codepackr.com`)) {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Study Aids" onLoadSample={() => setNotes(SAMPLE)} onReset={() => { setNotes(''); setStarted(false) }} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      {!started ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="text-xs font-bold uppercase text-slate-500">Notes (Question | Answer per line)</label>
            <textarea rows={8} value={notes} onChange={e => setNotes(e.target.value)} className="mt-2 w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            <p className="mt-2 text-xs text-slate-500">{pool.length} valid Q/A pairs detected (need ≥ 2)</p>
          </div>
          <button type="button" disabled={pool.length < 2} onClick={startQuiz} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold disabled:opacity-40 inline-flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Start MCQ quiz</button>
          {answered > 0 && <p className="text-sm text-slate-700">Last run: <strong>{score}/{answered}</strong></p>}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-xl">
          <div className="text-xs text-slate-500 mb-2">Question {index + 1} / {pool.length} · Score {score}</div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">{pool[index].q}</h3>
          <div className="space-y-2">
            {choices.map(c => {
              const isCorrect = c === pool[index].a
              const show = !!picked
              return (
                <button key={c} type="button" onClick={() => onPick(c)} className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium flex items-center justify-between ${show && isCorrect ? 'border-emerald-500 bg-emerald-50' : show && picked === c ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <span>{c}</span>
                  {show && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                  {show && picked === c && !isCorrect && <X className="w-4 h-4 text-red-500" />}
                </button>
              )
            })}
          </div>
          {picked && (
            <button type="button" onClick={next} className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold">
              {index + 1 >= pool.length ? 'Finish' : 'Next'}
            </button>
          )}
        </div>
      )}
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
