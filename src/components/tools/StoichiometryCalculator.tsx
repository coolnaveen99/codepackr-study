import { useState, useMemo } from 'react'
import { FlaskConical } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

// Minimal molar masses for common elements (g/mol)
const MM: Record<string, number> = {
  H: 1.008, C: 12.011, N: 14.007, O: 15.999, Na: 22.99, Mg: 24.305,
  Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, K: 39.098,
  Ca: 40.078, Fe: 55.845, Cu: 63.546, Zn: 65.38, Br: 79.904, Ag: 107.87,
  I: 126.9, Ba: 137.33, Pb: 207.2,
}

function parseFormula(formula: string): Record<string, number> {
  const counts: Record<string, number> = {}
  const re = /([A-Z][a-z]?)(\d*)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(formula)) !== null) {
    const el = m[1]
    const n = m[2] ? parseInt(m[2], 10) : 1
    counts[el] = (counts[el] || 0) + n
  }
  return counts
}

function molarMass(formula: string): number {
  const counts = parseFormula(formula)
  let total = 0
  for (const [el, n] of Object.entries(counts)) {
    if (!MM[el]) return NaN
    total += MM[el] * n
  }
  return total
}

interface Species {
  id: string
  formula: string
  coeff: number
  role: 'reactant' | 'product'
  givenAmount: number | null // grams or moles
  unit: 'g' | 'mol'
}

const SAMPLE: Species[] = [
  { id: '1', formula: 'H2', coeff: 2, role: 'reactant', givenAmount: 4, unit: 'g' },
  { id: '2', formula: 'O2', coeff: 1, role: 'reactant', givenAmount: 32, unit: 'g' },
  { id: '3', formula: 'H2O', coeff: 2, role: 'product', givenAmount: null, unit: 'g' },
]

export const StoichiometryCalculator: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'stoichiometry-calculator')!
  const [species, setSpecies] = useState<Species[]>(SAMPLE)
  const [actualYield, setActualYield] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const withMass = species.map(s => {
      const mm = molarMass(s.formula)
      const molesGiven = s.givenAmount !== null && !isNaN(mm)
        ? (s.unit === 'mol' ? s.givenAmount : s.givenAmount / mm)
        : null
      return { ...s, mm, molesGiven }
    })

    // Limiting reagent: among reactants with given amount, find smallest molesGiven / coeff
    const reactantsWithAmt = withMass.filter(s => s.role === 'reactant' && s.molesGiven !== null && s.coeff > 0)
    let limitingId: string | null = null
    let limitingRatio = Infinity
    for (const r of reactantsWithAmt) {
      const ratio = r.molesGiven! / r.coeff
      if (ratio < limitingRatio) {
        limitingRatio = ratio
        limitingId = r.id
      }
    }

    // Theoretical moles of each product based on limiting
    const theo: Record<string, { moles: number; grams: number }> = {}
    if (limitingId !== null && isFinite(limitingRatio)) {
      for (const s of withMass) {
        if (s.role === 'product' && s.coeff > 0 && !isNaN(s.mm)) {
          const moles = limitingRatio * s.coeff
          theo[s.id] = { moles, grams: moles * s.mm }
        }
      }
    }

    // Percent yield if actual given for first product
    let percentYield: number | null = null
    const firstProduct = withMass.find(s => s.role === 'product')
    if (firstProduct && theo[firstProduct.id] && actualYield !== null && theo[firstProduct.id].grams > 0) {
      percentYield = (actualYield / theo[firstProduct.id].grams) * 100
    }

    return { withMass, limitingId, limitingRatio, theo, percentYield }
  }, [species, actualYield])

  const update = (id: string, patch: Partial<Species>) => {
    setSpecies(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  const add = (role: 'reactant' | 'product') => {
    setSpecies(prev => [...prev, {
      id: crypto.randomUUID(),
      formula: role === 'reactant' ? 'A' : 'B',
      coeff: 1,
      role,
      givenAmount: null,
      unit: 'g',
    }])
  }

  const handleCopy = async () => {
    const lines = [
      'Stoichiometry — study.codepackr.com',
      'Equation: ' + species.filter(s => s.role === 'reactant').map(s => `${s.coeff}${s.formula}`).join(' + ') +
        ' → ' + species.filter(s => s.role === 'product').map(s => `${s.coeff}${s.formula}`).join(' + '),
    ]
    if (result.limitingId) {
      const lim = species.find(s => s.id === result.limitingId)
      lines.push(`Limiting reagent: ${lim?.formula}`)
    }
    for (const [id, t] of Object.entries(result.theo)) {
      const s = species.find(x => x.id === id)
      lines.push(`Theoretical ${s?.formula}: ${t.moles.toFixed(4)} mol / ${t.grams.toFixed(3)} g`)
    }
    if (result.percentYield !== null) lines.push(`Percent yield: ${result.percentYield.toFixed(2)}%`)
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
        categoryName="Science & Converters"
        onLoadSample={() => { setSpecies(SAMPLE); setActualYield(null) }}
        onReset={() => { setSpecies([{ id: '1', formula: 'H2', coeff: 1, role: 'reactant', givenAmount: null, unit: 'g' }]); setActualYield(null) }}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Reactants & products</h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => add('reactant')} className="text-xs font-medium px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">+ Reactant</button>
                <button type="button" onClick={() => add('product')} className="text-xs font-medium px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">+ Product</button>
              </div>
            </div>
            {species.map(s => (
              <div key={s.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Coeff</label>
                  <input type="number" min={1} value={s.coeff} onChange={e => update(s.id, { coeff: Number(e.target.value) || 1 })} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Formula</label>
                  <input value={s.formula} onChange={e => update(s.id, { formula: e.target.value.replace(/\s/g, '') })} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Role</label>
                  <select value={s.role} onChange={e => update(s.id, { role: e.target.value as 'reactant' | 'product' })} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="reactant">Reactant</option>
                    <option value="product">Product</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Given amount</label>
                  <input type="number" min={0} step="any" placeholder="—" value={s.givenAmount === null ? '' : s.givenAmount} onChange={e => update(s.id, { givenAmount: e.target.value === '' ? null : Number(e.target.value) })} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Unit</label>
                  <select value={s.unit} onChange={e => update(s.id, { unit: e.target.value as 'g' | 'mol' })} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="g">g</option>
                    <option value="mol">mol</option>
                  </select>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button type="button" onClick={() => setSpecies(prev => prev.filter(x => x.id !== s.id))} className="text-xs text-slate-400 hover:text-red-500 py-2">✕</button>
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-500">Supported elements: H, C, N, O, Na, Mg, Al, Si, P, S, Cl, K, Ca, Fe, Cu, Zn, Br, Ag, I, Ba, Pb</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Actual yield of first product (g) — optional for % yield</label>
            <input type="number" min={0} step="any" placeholder="Leave blank" value={actualYield === null ? '' : actualYield} onChange={e => setActualYield(e.target.value === '' ? null : Number(e.target.value))} className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 text-indigo-600"><FlaskConical className="w-5 h-5" /><span className="text-xs font-bold uppercase">Results</span></div>
          {result.limitingId ? (
            <>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Limiting reagent</p>
                <p className="text-2xl font-extrabold text-amber-600">{species.find(s => s.id === result.limitingId)?.formula}</p>
              </div>
              {Object.entries(result.theo).map(([id, t]) => {
                const s = species.find(x => x.id === id)
                return (
                  <div key={id} className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Theoretical {s?.formula}</p>
                    <p className="text-lg font-bold text-slate-900">{t.moles.toFixed(4)} mol</p>
                    <p className="text-sm text-slate-600">{t.grams.toFixed(3)} g</p>
                  </div>
                )
              })}
              {result.percentYield !== null && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold">Percent yield</p>
                  <p className="text-2xl font-extrabold text-indigo-600">{result.percentYield.toFixed(2)}%</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500">Enter formulas and at least one reactant amount to compute limiting reagent and yields.</p>
          )}
          {result.withMass.map(s => (
            <p key={s.id} className="text-xs text-slate-400">M({s.formula}) = {isNaN(s.mm) ? '?' : s.mm.toFixed(3)} g/mol</p>
          ))}
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
