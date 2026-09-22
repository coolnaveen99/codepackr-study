import { useState } from 'react'
import { Calculator } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

function evalExpr(expr: string, deg: boolean): string {
  try {
    let e = expr.replace(/\s+/g, '')
    if (!e) return ''
    e = e.replace(/π|pi/gi, String(Math.PI)).replace(/e(?![a-z])/gi, String(Math.E))
    e = e.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
    e = e.replace(/(\d+(?:\.\d+)?)!/g, (_, n) => {
      const v = Number(n)
      if (v > 170 || v < 0 || !Number.isInteger(v)) throw new Error('bad fact')
      let r = 1
      for (let i = 2; i <= v; i++) r *= i
      return String(r)
    })
    const wrap = (name: string, fn: string) => {
      e = e.replace(new RegExp(name + '\\(', 'gi'), fn + '(')
    }
    wrap('sqrt', 'Math.sqrt')
    wrap('abs', 'Math.abs')
    wrap('ln', 'Math.log')
    wrap('log', 'Math.log10')
    if (deg) {
      e = e.replace(/sin\(/gi, 'Math.sin(Math.PI/180*')
      e = e.replace(/cos\(/gi, 'Math.cos(Math.PI/180*')
      e = e.replace(/tan\(/gi, 'Math.tan(Math.PI/180*')
    } else {
      wrap('sin', 'Math.sin')
      wrap('cos', 'Math.cos')
      wrap('tan', 'Math.tan')
    }
    e = e.replace(/\^/g, '**')
    // eslint-disable-next-line no-new-func
    const val = Function(`"use strict"; return (${e})`)()
    if (typeof val !== 'number' || !Number.isFinite(val)) return 'Error'
    return String(Number(val.toPrecision(12)))
  } catch {
    return 'Error'
  }
}

const KEYS = [
  ['7', '8', '9', '/', 'sin('],
  ['4', '5', '6', '*', 'cos('],
  ['1', '2', '3', '-', 'tan('],
  ['0', '.', '(', ')', '+'],
  ['sqrt(', '^', 'log(', 'ln(', 'π'],
]

export const ScientificCalculator: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'scientific-calculator')!
  const [expr, setExpr] = useState('sin(30)+sqrt(16)')
  const [deg, setDeg] = useState(true)
  const [result, setResult] = useState('6')
  const [copied, setCopied] = useState(false)

  const run = (e = expr) => setResult(evalExpr(e, deg))

  const handleCopy = async () => {
    if (await copyToClipboard(`${expr} = ${result}\nstudy.codepackr.com`)) {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Science & Converters" onLoadSample={() => { setExpr('sin(30)+sqrt(16)'); setResult(evalExpr('sin(30)+sqrt(16)', deg)) }} onReset={() => { setExpr(''); setResult('') }} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1"><Calculator className="w-4 h-4 text-indigo-600" /> Expression</span>
          <div className="flex gap-1">
            <button type="button" onClick={() => setDeg(true)} className={`px-2 py-1 rounded-lg text-[11px] font-bold ${deg ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>DEG</button>
            <button type="button" onClick={() => setDeg(false)} className={`px-2 py-1 rounded-lg text-[11px] font-bold ${!deg ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>RAD</button>
          </div>
        </div>
        <input value={expr} onChange={e => setExpr(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()} className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
        <div className="text-2xl font-extrabold text-slate-900 min-h-[2rem]">{result}</div>
        <div className="grid grid-cols-5 gap-1.5">
          {KEYS.flat().map(k => (
            <button key={k} type="button" onClick={() => setExpr(prev => prev + k)} className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold font-mono">{k}</button>
          ))}
          <button type="button" onClick={() => setExpr('')} className="py-2 rounded-lg bg-slate-200 text-xs font-bold col-span-2">AC</button>
          <button type="button" onClick={() => setExpr(prev => prev.slice(0, -1))} className="py-2 rounded-lg bg-slate-200 text-xs font-bold">⌫</button>
          <button type="button" onClick={() => run()} className="py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold col-span-2">=</button>
        </div>
      </div>
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
