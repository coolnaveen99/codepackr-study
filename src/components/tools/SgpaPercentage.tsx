import { useState, useMemo } from 'react'
import { Trophy } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

export const SgpaPercentage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'sgpa-percentage')!
  const [sgpa, setSgpa] = useState(8.4)
  const [formula, setFormula] = useState<'9.5' | '10'>('9.5')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const g = Math.max(0, Math.min(10, sgpa))
    const mult = formula === '9.5' ? 9.5 : 10
    const pct = g * mult
    let label = 'Pass'
    if (pct >= 75) label = 'Distinction / First Class with Distinction'
    else if (pct >= 60) label = 'First Class'
    else if (pct >= 50) label = 'Second Class'
    else if (pct >= 40) label = 'Pass Class'
    else label = 'Below typical pass band'
    return { pct, label }
  }, [sgpa, formula])

  const handleCopy = async () => {
    const text = `SGPA/CGPA: ${sgpa}\nFormula: ×${formula}\nPercentage: ${result.pct.toFixed(2)}%\nClass label: ${result.label}\nstudy.codepackr.com`
    if (await copyToClipboard(text)) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Academic Calculators" onLoadSample={() => { setSgpa(8.4); setFormula('9.5') }} onReset={() => setSgpa(0)} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">SGPA / CGPA (0–10)</label>
          <input type="number" step="0.01" min={0} max={10} value={sgpa} onChange={e => setSgpa(Number(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Conversion formula</label>
          <div className="flex gap-2">
            {(['9.5', '10'] as const).map(f => (
              <button key={f} type="button" onClick={() => setFormula(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold ${formula === f ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>×{f}</button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-600"><Trophy className="w-5 h-5" /><span className="text-xs font-bold uppercase">Converted</span></div>
          <div className="text-4xl font-extrabold text-slate-900">{result.pct.toFixed(2)}%</div>
          <p className="text-sm font-medium text-slate-700">{result.label}</p>
          <p className="text-xs text-slate-500">Labels are indicative; confirm with your university regulations.</p>
        </div>
      </div>
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
