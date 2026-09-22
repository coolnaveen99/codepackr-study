import { useState } from 'react'
import { Atom } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

const ELEMENTS = [
  { z: 1, sym: 'H', name: 'Hydrogen', mass: 1.008 },
  { z: 2, sym: 'He', name: 'Helium', mass: 4.003 },
  { z: 3, sym: 'Li', name: 'Lithium', mass: 6.94 },
  { z: 4, sym: 'Be', name: 'Beryllium', mass: 9.012 },
  { z: 5, sym: 'B', name: 'Boron', mass: 10.81 },
  { z: 6, sym: 'C', name: 'Carbon', mass: 12.01 },
  { z: 7, sym: 'N', name: 'Nitrogen', mass: 14.01 },
  { z: 8, sym: 'O', name: 'Oxygen', mass: 16.00 },
  { z: 9, sym: 'F', name: 'Fluorine', mass: 19.00 },
  { z: 10, sym: 'Ne', name: 'Neon', mass: 20.18 },
  { z: 11, sym: 'Na', name: 'Sodium', mass: 22.99 },
  { z: 12, sym: 'Mg', name: 'Magnesium', mass: 24.31 },
  { z: 13, sym: 'Al', name: 'Aluminium', mass: 26.98 },
  { z: 14, sym: 'Si', name: 'Silicon', mass: 28.09 },
  { z: 15, sym: 'P', name: 'Phosphorus', mass: 30.97 },
  { z: 16, sym: 'S', name: 'Sulfur', mass: 32.07 },
  { z: 17, sym: 'Cl', name: 'Chlorine', mass: 35.45 },
  { z: 18, sym: 'Ar', name: 'Argon', mass: 39.95 },
  { z: 19, sym: 'K', name: 'Potassium', mass: 39.10 },
  { z: 20, sym: 'Ca', name: 'Calcium', mass: 40.08 },
  { z: 26, sym: 'Fe', name: 'Iron', mass: 55.85 },
  { z: 29, sym: 'Cu', name: 'Copper', mass: 63.55 },
  { z: 30, sym: 'Zn', name: 'Zinc', mass: 65.38 },
  { z: 47, sym: 'Ag', name: 'Silver', mass: 107.9 },
  { z: 79, sym: 'Au', name: 'Gold', mass: 197.0 },
]

const FORMULAS = [
  { name: 'Newton II', eq: 'F = m·a' },
  { name: 'Kinetic energy', eq: 'KE = ½mv²' },
  { name: 'Ohm', eq: 'V = I·R' },
  { name: 'Ideal gas', eq: 'PV = nRT' },
  { name: 'Photon energy', eq: 'E = h·f' },
  { name: 'Coulomb', eq: 'F = k·q₁q₂/r²' },
  { name: 'Wave', eq: 'v = f·λ' },
  { name: 'Density', eq: 'ρ = m/V' },
]

export const PeriodicTable: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'periodic-table')!
  const [selected, setSelected] = useState(ELEMENTS[5])
  const [tab, setTab] = useState<'table' | 'formulas'>('table')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const t = tab === 'table'
      ? `${selected.sym} (Z=${selected.z}) ${selected.name} · ${selected.mass} u`
      : FORMULAS.map(f => `${f.name}: ${f.eq}`).join('\n')
    if (await copyToClipboard(t + '\nstudy.codepackr.com')) {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Science & Converters" onLoadSample={() => setSelected(ELEMENTS[5])} onReset={() => setSelected(ELEMENTS[0])} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setTab('table')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${tab === 'table' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Elements</button>
        <button type="button" onClick={() => setTab('formulas')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${tab === 'formulas' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Formula sheet</button>
      </div>
      {tab === 'table' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-wrap gap-2">
            {ELEMENTS.map(el => (
              <button key={el.z} type="button" onClick={() => setSelected(el)} className={`w-14 h-14 rounded-xl border text-center ${selected.z === el.z ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                <div className="text-[9px] text-slate-400">{el.z}</div>
                <div className="font-bold text-sm">{el.sym}</div>
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Atom className="w-5 h-5 text-indigo-600 mb-2" />
            <div className="text-3xl font-extrabold">{selected.sym}</div>
            <div className="text-lg font-semibold text-slate-800">{selected.name}</div>
            <div className="text-sm text-slate-500 mt-2">Atomic number Z = {selected.z}</div>
            <div className="text-sm text-slate-500">Atomic mass ≈ {selected.mass} u</div>
            <p className="text-xs text-slate-400 mt-4">Subset of common elements for quick reference.</p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {FORMULAS.map(f => (
            <div key={f.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500">{f.name}</div>
              <div className="font-mono text-lg font-semibold text-slate-900 mt-1">{f.eq}</div>
            </div>
          ))}
        </div>
      )}
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
