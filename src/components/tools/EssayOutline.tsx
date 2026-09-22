import { useState } from 'react'
import { ListTree, Plus, Trash2 } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

type Body = { claim: string; evidence: string; analysis: string }

export const EssayOutline: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'essay-outline')!
  const [topic, setTopic] = useState('Impact of remote learning on student outcomes')
  const [thesis, setThesis] = useState('Remote learning improves access but requires structured support to match in-person outcomes.')
  const [bodies, setBodies] = useState<Body[]>([
    { claim: 'Access expands for non-traditional students.', evidence: 'Enrollment data / survey', analysis: 'Link access to equity goals' },
    { claim: 'Outcomes lag without interaction design.', evidence: 'Meta-analysis of engagement', analysis: 'Argue for hybrid best practices' },
  ])
  const [conclusion, setConclusion] = useState('Policy should fund both infrastructure and pedagogical design.')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const lines = [`Topic: ${topic}`, `Thesis: ${thesis}`, '', ...bodies.map((b, i) => `¶${i + 1}\n  Claim: ${b.claim}\n  Evidence: ${b.evidence}\n  Analysis: ${b.analysis}`), '', `Conclusion: ${conclusion}`, 'study.codepackr.com']
    if (await copyToClipboard(lines.join('\n'))) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const updateBody = (i: number, key: keyof Body, val: string) => {
    setBodies(prev => prev.map((b, idx) => idx === i ? { ...b, [key]: val } : b))
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Writing & Citations" onLoadSample={() => {}} onReset={() => { setTopic(''); setThesis(''); setBodies([{ claim: '', evidence: '', analysis: '' }]); setConclusion('') }} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><ListTree className="w-4 h-4 text-indigo-600" /> Topic</label>
          <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          <label className="text-xs font-bold uppercase text-slate-500">Thesis statement</label>
          <textarea rows={2} value={thesis} onChange={e => setThesis(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        {bodies.map((b, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-indigo-600">Body paragraph {i + 1}</span>
              {bodies.length > 1 && <button type="button" onClick={() => setBodies(prev => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <input placeholder="Claim / topic sentence" value={b.claim} onChange={e => updateBody(i, 'claim', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            <input placeholder="Evidence / source cue" value={b.evidence} onChange={e => updateBody(i, 'evidence', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            <input placeholder="Analysis / so-what" value={b.analysis} onChange={e => updateBody(i, 'analysis', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          </div>
        ))}
        <button type="button" onClick={() => setBodies(prev => [...prev, { claim: '', evidence: '', analysis: '' }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200"><Plus className="w-4 h-4" /> Add paragraph</button>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="text-xs font-bold uppercase text-slate-500">Conclusion</label>
          <textarea rows={2} value={conclusion} onChange={e => setConclusion(e.target.value)} className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
