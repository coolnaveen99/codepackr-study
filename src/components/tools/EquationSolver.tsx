import { useState, useMemo } from 'react'
import { Sigma } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

type Mode = 'linear' | 'quadratic' | 'system2'

export const EquationSolver: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'equation-solver')!
  const [mode, setMode] = useState<Mode>('quadratic')
  // Linear: ax + b = 0
  const [la, setLa] = useState(2)
  const [lb, setLb] = useState(-6)
  // Quadratic: ax² + bx + c = 0
  const [qa, setQa] = useState(1)
  const [qb, setQb] = useState(-5)
  const [qc, setQc] = useState(6)
  // System 2x2: a1x + b1y = c1 ; a2x + b2y = c2
  const [a1, setA1] = useState(2)
  const [b1, setB1] = useState(3)
  const [c1, setC1] = useState(8)
  const [a2, setA2] = useState(1)
  const [b2, setB2] = useState(-1)
  const [c2, setC2] = useState(1)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const steps: string[] = []
    if (mode === 'linear') {
      if (Math.abs(la) < 1e-12) {
        if (Math.abs(lb) < 1e-12) return { steps: ['0 = 0 → infinitely many solutions'], solutions: ['all real x'] }
        return { steps: [`${lb} = 0 → contradiction`], solutions: ['no solution'] }
      }
      const x = -lb / la
      steps.push(`Equation: ${la}x + (${lb}) = 0`)
      steps.push(`Isolate x: ${la}x = ${-lb}`)
      steps.push(`x = ${-lb} / ${la} = ${x}`)
      return { steps, solutions: [`x = ${x}`] }
    }
    if (mode === 'quadratic') {
      if (Math.abs(qa) < 1e-12) {
        // degenerates to linear
        if (Math.abs(qb) < 1e-12) {
          if (Math.abs(qc) < 1e-12) return { steps: ['0 = 0'], solutions: ['all real x'] }
          return { steps: ['constant ≠ 0'], solutions: ['no solution'] }
        }
        const x = -qc / qb
        steps.push(`Degenerates to linear: ${qb}x + ${qc} = 0 → x = ${x}`)
        return { steps, solutions: [`x = ${x}`] }
      }
      steps.push(`Equation: ${qa}x² + (${qb})x + (${qc}) = 0`)
      const disc = qb * qb - 4 * qa * qc
      steps.push(`Discriminant D = b² − 4ac = (${qb})² − 4(${qa})(${qc}) = ${disc}`)
      if (disc < 0) {
        const real = -qb / (2 * qa)
        const imag = Math.sqrt(-disc) / (2 * qa)
        steps.push(`D < 0 → complex roots`)
        steps.push(`x = [${-qb} ± √(${-disc}) i] / (2·${qa})`)
        return { steps, solutions: [`x₁ = ${real} + ${imag}i`, `x₂ = ${real} − ${imag}i`] }
      }
      if (Math.abs(disc) < 1e-12) {
        const x = -qb / (2 * qa)
        steps.push(`D = 0 → repeated root`)
        steps.push(`x = −b / (2a) = ${x}`)
        return { steps, solutions: [`x = ${x} (double root)`] }
      }
      const sqrtD = Math.sqrt(disc)
      const x1 = (-qb + sqrtD) / (2 * qa)
      const x2 = (-qb - sqrtD) / (2 * qa)
      steps.push(`D > 0 → two real roots`)
      steps.push(`x = [−b ± √D] / (2a)`)
      steps.push(`x₁ = (${-qb} + ${sqrtD.toFixed(6)}) / ${2 * qa} = ${x1}`)
      steps.push(`x₂ = (${-qb} − ${sqrtD.toFixed(6)}) / ${2 * qa} = ${x2}`)
      return { steps, solutions: [`x₁ = ${x1}`, `x₂ = ${x2}`] }
    }
    // system2
    const det = a1 * b2 - a2 * b1
    steps.push(`System: ${a1}x + ${b1}y = ${c1}`)
    steps.push(`         ${a2}x + ${b2}y = ${c2}`)
    steps.push(`Determinant Δ = a₁b₂ − a₂b₁ = ${a1}·${b2} − ${a2}·${b1} = ${det}`)
    if (Math.abs(det) < 1e-12) {
      // check consistency
      const consistent = Math.abs(a1 * c2 - a2 * c1) < 1e-12 && Math.abs(b1 * c2 - b2 * c1) < 1e-12
      if (consistent) return { steps: [...steps, 'Δ = 0 and consistent → infinitely many solutions'], solutions: ['infinitely many'] }
      return { steps: [...steps, 'Δ = 0 and inconsistent → no solution'], solutions: ['no solution'] }
    }
    const x = (c1 * b2 - c2 * b1) / det
    const y = (a1 * c2 - a2 * c1) / det
    steps.push(`x = (c₁b₂ − c₂b₁) / Δ = ${x}`)
    steps.push(`y = (a₁c₂ − a₂c₁) / Δ = ${y}`)
    return { steps, solutions: [`x = ${x}`, `y = ${y}`] }
  }, [mode, la, lb, qa, qb, qc, a1, b1, c1, a2, b2, c2])

  const handleCopy = async () => {
    const text = ['Equation Solver — study.codepackr.com', ...result.steps, '', 'Solutions:', ...result.solutions].join('\n')
    if (await copyToClipboard(text)) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Science & Converters"
        onLoadSample={() => { setMode('quadratic'); setQa(1); setQb(-5); setQc(6) }}
        onReset={() => { setLa(1); setLb(0); setQa(1); setQb(0); setQc(0); setA1(1); setB1(0); setC1(0); setA2(0); setB2(1); setC2(0) }}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {(['linear', 'quadratic', 'system2'] as Mode[]).map(m => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {m === 'linear' ? 'Linear (ax+b=0)' : m === 'quadratic' ? 'Quadratic (ax²+bx+c=0)' : '2×2 System'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          {mode === 'linear' && (
            <>
              <p className="text-sm text-slate-600 font-mono">ax + b = 0</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">a</label><input type="number" step="any" value={la} onChange={e => setLa(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">b</label><input type="number" step="any" value={lb} onChange={e => setLb(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
            </>
          )}
          {mode === 'quadratic' && (
            <>
              <p className="text-sm text-slate-600 font-mono">ax² + bx + c = 0</p>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">a</label><input type="number" step="any" value={qa} onChange={e => setQa(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">b</label><input type="number" step="any" value={qb} onChange={e => setQb(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">c</label><input type="number" step="any" value={qc} onChange={e => setQc(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
            </>
          )}
          {mode === 'system2' && (
            <>
              <p className="text-sm text-slate-600 font-mono">a₁x + b₁y = c₁<br/>a₂x + b₂y = c₂</p>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">a₁</label><input type="number" step="any" value={a1} onChange={e => setA1(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">b₁</label><input type="number" step="any" value={b1} onChange={e => setB1(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">c₁</label><input type="number" step="any" value={c1} onChange={e => setC1(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">a₂</label><input type="number" step="any" value={a2} onChange={e => setA2(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">b₂</label><input type="number" step="any" value={b2} onChange={e => setB2(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">c₂</label><input type="number" step="any" value={c2} onChange={e => setC2(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600"><Sigma className="w-5 h-5" /><span className="text-xs font-bold uppercase">Solution</span></div>
          <div className="space-y-1">
            {result.solutions.map((s, i) => (
              <p key={i} className="text-xl font-extrabold text-slate-900 font-mono">{s}</p>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 space-y-1">
            <p className="text-xs font-bold uppercase text-slate-500 mb-2">Steps</p>
            {result.steps.map((s, i) => (
              <p key={i} className="text-sm text-slate-600 font-mono">{i + 1}. {s}</p>
            ))}
          </div>
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
