import { useState, useMemo } from 'react'
import { ListOrdered } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

const PRESETS: Record<string, { letter: string; min: number }[]> = {
  us: [
    { letter: 'A', min: 90 }, { letter: 'B', min: 80 }, { letter: 'C', min: 70 }, { letter: 'D', min: 60 }, { letter: 'F', min: 0 },
  ],
  indian: [
    { letter: 'O', min: 90 }, { letter: 'A+', min: 80 }, { letter: 'A', min: 70 }, { letter: 'B+', min: 60 }, { letter: 'B', min: 50 }, { letter: 'C', min: 40 }, { letter: 'F', min: 0 },
  ],
}

export const MarksToGrade: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'marks-to-grade')!
  const [marks, setMarks] = useState(78)
  const [preset, setPreset] = useState<'us' | 'indian' | 'custom'>('indian')
  const [custom, setCustom] = useState('A+:90\nA:80\nB+:70\nB:60\nC:50\nF:0')
  const [copied, setCopied] = useState(false)

  const scale = useMemo(() => {
    if (preset !== 'custom') return PRESETS[preset]
    return custom.split('\n').map(line => {
      const [letter, min] = line.split(':').map(s => s.trim())
      return { letter: letter || '?', min: Number(min) || 0 }
    }).sort((a, b) => b.min - a.min)
  }, [preset, custom])

  const grade = useMemo(() => {
    const m = Math.max(0, Math.min(100, marks))
    for (const row of scale) if (m >= row.min) return row.letter
    return scale[scale.length - 1]?.letter ?? '—'
  }, [marks, scale])

  const handleCopy = async () => {
    if (await copyToClipboard(`Marks: ${marks} → Grade: ${grade}\nScale: ${preset}\nstudy.codepackr.com`)) {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Academic Calculators" onLoadSample={() => { setMarks(78); setPreset('indian') }} onReset={() => setMarks(0)} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase text-slate-500">Marks / Percentage</label>
          <input type="number" min={0} max={100} value={marks} onChange={e => setMarks(Number(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <label className="block text-xs font-bold uppercase text-slate-500">Scale</label>
          <div className="flex flex-wrap gap-2">
            {(['indian', 'us', 'custom'] as const).map(p => (
              <button key={p} type="button" onClick={() => setPreset(p)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${preset === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{p}</button>
            ))}
          </div>
          {preset === 'custom' && (
            <textarea rows={6} value={custom} onChange={e => setCustom(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs" placeholder="Letter:Min per line" />
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 mb-3"><ListOrdered className="w-5 h-5" /><span className="text-xs font-bold uppercase">Letter grade</span></div>
          <div className="text-5xl font-extrabold text-slate-900">{grade}</div>
          <ul className="mt-6 space-y-1 text-xs text-slate-600">
            {scale.map(s => <li key={s.letter + s.min} className="flex justify-between border-b border-slate-100 py-1"><span>{s.letter}</span><span>≥ {s.min}</span></li>)}
          </ul>
        </div>
      </div>
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
