import { useState, useMemo } from 'react'
import { Briefcase } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

const SECTIONS = [
  { id: 'summary', label: 'Summary / Objective', softMax: 80 },
  { id: 'experience', label: 'Experience', softMax: 350 },
  { id: 'education', label: 'Education', softMax: 120 },
  { id: 'skills', label: 'Skills', softMax: 80 },
  { id: 'sop', label: 'Full SOP / Essay body', softMax: 1000 },
]

function wordCount(s: string) {
  return (s.trim().match(/\b[\w'-]+\b/g) || []).length
}

export const ResumeSopCounter: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'resume-sop-counter')!
  const [texts, setTexts] = useState<Record<string, string>>({
    summary: 'Final-year CS student focused on systems and privacy-first tools.',
    experience: 'Built client-side study tools used by classmates for GPA and revision.',
    education: 'B.Tech Computer Science, 2026',
    skills: 'TypeScript, React, algorithms, technical writing',
    sop: '',
  })
  const [copied, setCopied] = useState(false)

  const counts = useMemo(() => {
    const o: Record<string, number> = {}
    SECTIONS.forEach(s => { o[s.id] = wordCount(texts[s.id] || '') })
    return o
  }, [texts])

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  const handleCopy = async () => {
    const lines = SECTIONS.map(s => `${s.label}: ${counts[s.id]} words (soft max ${s.softMax})`)
    if (await copyToClipboard([...lines, `Total: ${total}`, 'study.codepackr.com'].join('\n'))) {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader title={toolDef.name} description={toolDef.description} badge={toolDef.badge} categoryName="Writing & Citations" onLoadSample={() => setTexts({ summary: 'Final-year CS student focused on systems and privacy-first tools.', experience: 'Built client-side study tools used by classmates for GPA and revision.', education: 'B.Tech Computer Science, 2026', skills: 'TypeScript, React, algorithms, technical writing', sop: 'I am applying because...' })} onReset={() => setTexts({ summary: '', experience: '', education: '', skills: '', sop: '' })} onCopyResult={handleCopy} isCopied={copied} onBack={onBack} />
      <div className="mb-4 flex items-center gap-2 text-indigo-600"><Briefcase className="w-5 h-5" /><span className="text-sm font-bold">Total words: {total}</span></div>
      <div className="space-y-4">
        {SECTIONS.map(s => {
          const n = counts[s.id]
          const over = n > s.softMax
          return (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold uppercase text-slate-500">{s.label}</span>
                <span className={over ? 'text-amber-600 font-bold' : 'text-slate-600'}>{n} / ~{s.softMax}</span>
              </div>
              <textarea rows={s.id === 'sop' ? 5 : 2} value={texts[s.id] || ''} onChange={e => setTexts(prev => ({ ...prev, [s.id]: e.target.value }))} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          )
        })}
      </div>
      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
