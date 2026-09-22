import { useState, useMemo } from 'react'
import { CalendarCheck } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

export const AttendanceCalculator: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'attendance-calculator')!
  const [attended, setAttended] = useState(42)
  const [held, setHeld] = useState(50)
  const [target, setTarget] = useState(75)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const a = Math.max(0, attended)
    const h = Math.max(0, held)
    const t = Math.min(99.9, Math.max(1, target)) / 100
    const pct = h > 0 ? (a / h) * 100 : 0
    let need = 0
    if (pct < t * 100 && t < 1) {
      need = Math.ceil((t * h - a) / (1 - t))
      if (need < 0) need = 0
    }
    let canMiss = 0
    if (pct >= t * 100 && t > 0) {
      canMiss = Math.floor((a - t * h) / t)
      if (canMiss < 0) canMiss = 0
    }
    return { pct, need, canMiss, ok: pct >= target }
  }, [attended, held, target])

  const handleCopy = async () => {
    const text = `Attendance: ${attended}/${held} = ${result.pct.toFixed(2)}%\nTarget: ${target}%\nClasses still needed: ${result.need}\nCan miss (if already above): ${result.canMiss}\nstudy.codepackr.com`
    if (await copyToClipboard(text)) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Academic Calculators" onLoadSample={() => { setAttended(42); setHeld(50); setTarget(75) }} onReset={() => { setAttended(0); setHeld(0); setTarget(75) }} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Classes attended</label>
          <input type="number" min={0} value={attended} onChange={e => setAttended(Number(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Classes held so far</label>
          <input type="number" min={0} value={held} onChange={e => setHeld(Number(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Target attendance %</label>
          <input type="number" min={1} max={99} value={target} onChange={e => setTarget(Number(e.target.value) || 75)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600"><CalendarCheck className="w-5 h-5" /><span className="text-xs font-bold uppercase">Result</span></div>
          <div className={`text-4xl font-extrabold ${result.ok ? 'text-emerald-600' : 'text-amber-600'}`}>{result.pct.toFixed(2)}%</div>
          <p className="text-sm text-slate-600">{result.ok ? `You are at or above ${target}%.` : `Below ${target}% target.`}</p>
          {!result.ok && <p className="text-sm text-slate-800">Attend at least <strong>{result.need}</strong> more class{result.need === 1 ? '' : 'es'} in a row (assuming all future classes are attended).</p>}
          {result.ok && <p className="text-sm text-slate-800">You can still miss up to <strong>{result.canMiss}</strong> more class{result.canMiss === 1 ? '' : 'es'} and stay at {target}%.</p>}
        </div>
      </div>
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
