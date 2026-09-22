import { useState, useMemo } from 'react'
import { CalendarRange, Plus, Trash2 } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

const INTERVALS = [1, 3, 7, 14, 30, 60]

type Item = { id: string; topic: string; stage: number; lastReview: string }

function addDays(iso: string, days: number) {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const SpacedRepetition: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'spaced-repetition')!
  const today = new Date().toISOString().slice(0, 10)
  const [items, setItems] = useState<Item[]>([
    { id: '1', topic: 'Organic chemistry — isomerism', stage: 1, lastReview: today },
    { id: '2', topic: 'Data structures — trees', stage: 0, lastReview: today },
  ])
  const [newTopic, setNewTopic] = useState('')
  const [copied, setCopied] = useState(false)

  const rows = useMemo(() => items.map(it => {
    const interval = INTERVALS[Math.min(it.stage, INTERVALS.length - 1)]
    const next = addDays(it.lastReview, interval)
    return { ...it, interval, next }
  }).sort((a, b) => a.next.localeCompare(b.next)), [items])

  const markReviewed = (id: string, success: boolean) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it
      const stage = success ? Math.min(it.stage + 1, INTERVALS.length - 1) : 0
      return { ...it, stage, lastReview: today }
    }))
  }

  const addTopic = () => {
    if (!newTopic.trim()) return
    setItems(prev => [...prev, { id: String(Date.now()), topic: newTopic.trim(), stage: 0, lastReview: today }])
    setNewTopic('')
  }

  const handleCopy = async () => {
    const lines = rows.map(r => `${r.next} · ${r.topic} (stage ${r.stage}, +${r.interval}d)`)
    if (await copyToClipboard(lines.join('\n') + '\nstudy.codepackr.com')) {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Study Aids" onLoadSample={() => setItems([{ id: '1', topic: 'Organic chemistry — isomerism', stage: 1, lastReview: today }, { id: '2', topic: 'Data structures — trees', stage: 0, lastReview: today }])} onReset={() => setItems([])} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      <div className="flex gap-2 mb-4">
        <input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="New topic" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" onKeyDown={e => e.key === 'Enter' && addTopic()} />
        <button type="button" onClick={addTopic} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
      </div>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap items-center gap-3 justify-between">
            <div>
              <div className="font-semibold text-slate-900 flex items-center gap-2"><CalendarRange className="w-4 h-4 text-indigo-600" />{r.topic}</div>
              <div className="text-xs text-slate-500 mt-1">Next review: <strong>{r.next}</strong> · interval {r.interval}d · stage {r.stage}</div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => markReviewed(r.id, true)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">Got it</button>
              <button type="button" onClick={() => markReviewed(r.id, false)} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold">Again</button>
              <button type="button" onClick={() => setItems(prev => prev.filter(x => x.id !== r.id))} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">Add topics to build a review schedule.</p>}
      </div>
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
