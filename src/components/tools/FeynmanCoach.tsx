import { useState, useMemo } from 'react'
import { Lightbulb } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
}

function unique(arr: string[]): string[] {
  return [...new Set(arr)]
}

export const FeynmanCoach: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'feynman-coach')!
  const [concept, setConcept] = useState('Photosynthesis')
  const [keyPoints, setKeyPoints] = useState(
    'chlorophyll, sunlight, carbon dioxide, water, glucose, oxygen, chloroplast, light reaction, dark reaction, Calvin cycle'
  )
  const [explanation, setExplanation] = useState('')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const keys = unique(tokenize(keyPoints))
    if (keys.length === 0) return { coverage: 0, hit: [] as string[], miss: [] as string[], wordCount: 0, score: 0 }
    const explTokens = unique(tokenize(explanation))
    const hit = keys.filter(k => explTokens.some(e => e.includes(k) || k.includes(e)))
    const miss = keys.filter(k => !hit.includes(k))
    const coverage = hit.length / keys.length
    const wordCount = explanation.trim() ? explanation.trim().split(/\s+/).length : 0
    // Heuristic: coverage 70% + length bonus (prefer 50–150 words for a clear explanation)
    let lengthScore = 0
    if (wordCount >= 30 && wordCount <= 200) lengthScore = 0.3
    else if (wordCount > 10) lengthScore = 0.15
    const score = Math.min(100, Math.round((coverage * 0.7 + lengthScore) * 100))
    return { coverage, hit, miss, wordCount, score }
  }, [keyPoints, explanation])

  const handleCopy = async () => {
    const text = [
      'Feynman Coach — study.codepackr.com',
      `Concept: ${concept}`,
      `Score: ${result.score}/100`,
      `Coverage: ${(result.coverage * 100).toFixed(0)}% (${result.hit.length}/${result.hit.length + result.miss.length} key points)`,
      result.miss.length ? `Missing: ${result.miss.join(', ')}` : 'All key points covered!',
      '',
      'Your explanation:',
      explanation || '(empty)',
    ].join('\n')
    if (await copyToClipboard(text)) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const loadSample = () => {
    setConcept('Photosynthesis')
    setKeyPoints('chlorophyll, sunlight, carbon dioxide, water, glucose, oxygen, chloroplast, light reaction, dark reaction, Calvin cycle')
    setExplanation(
      'Plants use chlorophyll in chloroplasts to capture sunlight. They take in carbon dioxide and water and produce glucose and oxygen. The light reaction splits water; the dark reaction (Calvin cycle) builds sugar.'
    )
  }

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Study Aids & Timers"
        onLoadSample={loadSample}
        onReset={() => { setConcept(''); setKeyPoints(''); setExplanation('') }}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Concept / topic</label>
              <input
                value={concept}
                onChange={e => setConcept(e.target.value)}
                placeholder="e.g. Newton's Second Law"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Key points (comma-separated)</label>
              <textarea
                value={keyPoints}
                onChange={e => setKeyPoints(e.target.value)}
                rows={3}
                placeholder="force, mass, acceleration, F=ma, ..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Explain it like you're teaching a 12-year-old
            </label>
            <textarea
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              rows={8}
              placeholder="Write in plain language. Avoid jargon unless you define it..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
            />
            <p className="text-xs text-slate-400 mt-2">{result.wordCount} words</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 text-indigo-600">
            <Lightbulb className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Feedback</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Score</p>
            <p className={`text-5xl font-extrabold ${result.score >= 70 ? 'text-emerald-600' : result.score >= 40 ? 'text-amber-600' : 'text-slate-400'}`}>
              {result.score}
            </p>
            <p className="text-xs text-slate-500">out of 100 (coverage + clarity length)</p>
          </div>
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-bold mb-2">
              Key points covered ({result.hit.length}/{result.hit.length + result.miss.length})
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {result.hit.map(k => (
                <span key={k} className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">{k}</span>
              ))}
            </div>
            {result.miss.length > 0 && (
              <>
                <p className="text-xs text-slate-500 uppercase font-bold mb-2">Missing — try to include</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.miss.map(k => (
                    <span key={k} className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">{k}</span>
                  ))}
                </div>
              </>
            )}
          </div>
          {explanation.trim() && result.score < 70 && (
            <p className="text-sm text-slate-600 pt-2 border-t border-slate-100">
              Tip: Cover more of the key points in simple sentences. Aim for roughly 50–150 words.
            </p>
          )}
          {result.score >= 70 && (
            <p className="text-sm text-emerald-700 pt-2 border-t border-slate-100 font-medium">
              Strong explanation — you could teach this concept clearly.
            </p>
          )}
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
