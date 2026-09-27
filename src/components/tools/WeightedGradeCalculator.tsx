import { useState, useMemo } from 'react'
import { Percent } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

interface GradedItem {
  id: string
  name: string
  weight: number
  score: number | null
  maxScore: number
}

const SAMPLE: GradedItem[] = [
  { id: '1', name: 'Homework', weight: 20, score: 88, maxScore: 100 },
  { id: '2', name: 'Midterm', weight: 30, score: 76, maxScore: 100 },
  { id: '3', name: 'Project', weight: 20, score: 92, maxScore: 100 },
  { id: '4', name: 'Final Exam', weight: 30, score: null, maxScore: 100 },
]

export const WeightedGradeCalculator: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'weighted-grade-calculator')!
  const [items, setItems] = useState<GradedItem[]>(SAMPLE)
  const [targetGrade, setTargetGrade] = useState(85)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const graded = items.filter(i => i.score !== null && i.weight > 0)
    const ungraded = items.filter(i => i.score === null && i.weight > 0)
    const totalWeight = items.reduce((s, i) => s + Math.max(0, i.weight), 0)
    const gradedWeight = graded.reduce((s, i) => s + i.weight, 0)
    const currentPoints = graded.reduce((s, i) => s + ((i.score! / i.maxScore) * i.weight), 0)
    const currentAvg = gradedWeight > 0 ? (currentPoints / gradedWeight) * 100 : 0
    const remainingWeight = ungraded.reduce((s, i) => s + i.weight, 0)

    let neededOnRemaining: number | null = null
    let reachable = true
    if (remainingWeight > 0) {
      const neededFraction = (targetGrade / 100 * totalWeight - currentPoints) / remainingWeight
      neededOnRemaining = neededFraction * 100
      if (neededOnRemaining > 100 + 1e-6) reachable = false
      if (neededOnRemaining < 0) neededOnRemaining = 0
    } else {
      reachable = currentAvg >= targetGrade
    }

    return { currentAvg, gradedWeight, remainingWeight, totalWeight, neededOnRemaining, reachable }
  }, [items, targetGrade])

  const updateItem = (id: string, patch: Partial<GradedItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  }

  const addItem = () => {
    setItems(prev => [...prev, {
      id: crypto.randomUUID(),
      name: `Item ${prev.length + 1}`,
      weight: 10,
      score: null,
      maxScore: 100,
    }])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleCopy = async () => {
    const lines = [
      `Weighted Grade Summary — study.codepackr.com`,
      `Current weighted average: ${result.currentAvg.toFixed(2)}% (from ${result.gradedWeight.toFixed(1)}% of total weight)`,
      `Target: ${targetGrade}%`,
      result.remainingWeight > 0
        ? (result.reachable
            ? `Score needed on remaining ${result.remainingWeight.toFixed(1)}% weight: ${result.neededOnRemaining!.toFixed(2)}%`
            : `Target is unreachable even with 100% on remaining work.`)
        : (result.reachable ? 'Target already met.' : 'Target not met and no remaining weight.'),
      '',
      'Breakdown:',
      ...items.map(i => `- ${i.name}: weight ${i.weight}%, score ${i.score === null ? 'pending' : `${i.score}/${i.maxScore}`}`),
    ]
    if (await copyToClipboard(lines.join('\n'))) {
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
        onLoadSample={() => { setItems(SAMPLE); setTargetGrade(85) }}
        onReset={() => { setItems([{ id: '1', name: 'Final Exam', weight: 100, score: null, maxScore: 100 }]); setTargetGrade(85) }}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Graded items</h2>
              <button type="button" onClick={addItem} className="text-xs font-medium px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100">+ Add item</button>
            </div>
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Name</label>
                  <input value={item.name} onChange={e => updateItem(item.id, { name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Weight %</label>
                  <input type="number" min={0} max={100} value={item.weight} onChange={e => updateItem(item.id, { weight: Number(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Score</label>
                  <input type="number" min={0} placeholder="—" value={item.score === null ? '' : item.score} onChange={e => { const v = e.target.value; updateItem(item.id, { score: v === '' ? null : Number(v) }) }} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Max</label>
                  <input type="number" min={1} value={item.maxScore} onChange={e => updateItem(item.id, { maxScore: Number(e.target.value) || 100 })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-2 flex justify-end pb-0.5">
                  <button type="button" onClick={() => removeItem(item.id)} className="text-xs text-slate-400 hover:text-red-500 px-2 py-2" title="Remove">✕</button>
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-500 pt-1">Total weight: {result.totalWeight.toFixed(1)}%{Math.abs(result.totalWeight - 100) > 0.5 && <span className="text-amber-600 ml-2">(weights do not sum to 100% — results are still computed proportionally)</span>}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Target overall grade %</label>
            <input type="number" min={0} max={100} value={targetGrade} onChange={e => setTargetGrade(Number(e.target.value) || 0)} className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 text-indigo-600"><Percent className="w-5 h-5" /><span className="text-xs font-bold uppercase">Result</span></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Current weighted average</p>
            <p className="text-4xl font-extrabold text-slate-900">{result.currentAvg.toFixed(2)}%</p>
            <p className="text-xs text-slate-500 mt-1">From {result.gradedWeight.toFixed(1)}% of course weight</p>
          </div>
          {result.remainingWeight > 0 ? (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold">Score needed on remaining work</p>
              {result.reachable ? (
                <p className="text-3xl font-extrabold text-indigo-600">{result.neededOnRemaining!.toFixed(2)}%</p>
              ) : (
                <p className="text-lg font-bold text-amber-600">Unreachable</p>
              )}
              <p className="text-sm text-slate-600 mt-1">{result.reachable ? `You need at least ${result.neededOnRemaining!.toFixed(1)}% on the remaining ${result.remainingWeight.toFixed(1)}% weight to reach ${targetGrade}%.` : `Even 100% on the remaining ${result.remainingWeight.toFixed(1)}% weight cannot reach ${targetGrade}%.`}</p>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100">
              <p className={`text-sm font-medium ${result.reachable ? 'text-emerald-600' : 'text-amber-600'}`}>{result.reachable ? `Target ${targetGrade}% already achieved.` : `Target ${targetGrade}% not met and no remaining weight.`}</p>
            </div>
          )}
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
