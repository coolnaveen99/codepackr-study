import { useState, useMemo } from 'react'
import { GitCompare } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

function tokens(s: string) {
  return (s.toLowerCase().match(/\b[\w'-]+\b/g) || []).filter(w => w.length > 2)
}

export const ParaphraseChecker: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'paraphrase-checker')!
  const [original, setOriginal] = useState('Photosynthesis converts light energy into chemical energy stored in glucose.')
  const [rewritten, setRewritten] = useState('Green plants transform sunlight into chemical energy that is held in sugar molecules.')
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => {
    const a = tokens(original)
    const b = tokens(rewritten)
    const setA = new Set(a)
    const setB = new Set(b)
    const inter = [...setA].filter(x => setB.has(x))
    const union = new Set([...setA, ...setB])
    const jaccard = union.size ? inter.length / union.size : 0
    const overlapA = a.length ? inter.length / setA.size : 0
    return { jaccard, overlapA, shared: inter.length, wordsA: setA.size, wordsB: setB.size }
  }, [original, rewritten])

  const handleCopy = async () => {
    const t = `Jaccard: ${(stats.jaccard * 100).toFixed(1)}%\nShared unique words: ${stats.shared}\nstudy.codepackr.com`
    if (await copyToClipboard(t)) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Writing & Citations" onLoadSample={() => { setOriginal('Photosynthesis converts light energy into chemical energy stored in glucose.'); setRewritten('Green plants transform sunlight into chemical energy that is held in sugar molecules.') }} onReset={() => { setOriginal(''); setRewritten('') }} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-bold uppercase text-slate-500">Original</label>
          <textarea rows={6} value={original} onChange={e => setOriginal(e.target.value)} className="mt-2 w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-bold uppercase text-slate-500">Rewritten</label>
          <textarea rows={6} value={rewritten} onChange={e => setRewritten(e.target.value)} className="mt-2 w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-wrap gap-6 items-center">
        <GitCompare className="w-5 h-5 text-indigo-600" />
        <div><div className="text-xs text-slate-500 uppercase font-bold">Jaccard similarity</div><div className="text-3xl font-extrabold">{(stats.jaccard * 100).toFixed(1)}%</div></div>
        <div><div className="text-xs text-slate-500 uppercase font-bold">Shared unique words</div><div className="text-2xl font-bold">{stats.shared}</div></div>
        <div><div className="text-xs text-slate-500 uppercase font-bold">Vocab overlap (orig)</div><div className="text-2xl font-bold">{(stats.overlapA * 100).toFixed(0)}%</div></div>
        <p className="text-xs text-slate-500 w-full">Local stats only — not a web plagiarism search.</p>
      </div>
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
