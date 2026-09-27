import { useState, useMemo } from 'react'
import { Library } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

type SourceType = 'book' | 'journal' | 'website'
type CiteStyle = 'APA' | 'MLA' | 'Chicago' | 'Harvard'

interface RefEntry {
  id: string
  type: SourceType
  authors: string // "Last, First; Last2, First2"
  title: string
  year: string
  publisher?: string
  journal?: string
  volume?: string
  issue?: string
  pages?: string
  url?: string
  doi?: string
}

const SAMPLE: RefEntry = {
  id: '1',
  type: 'journal',
  authors: 'Smith, Jane; Doe, John',
  title: 'Client-side learning tools for private study',
  year: '2024',
  journal: 'Journal of Educational Technology',
  volume: '12',
  issue: '3',
  pages: '45-62',
  doi: '10.1234/jet.2024.003',
}

function formatAuthors(authors: string, style: CiteStyle): string {
  const list = authors.split(';').map(a => a.trim()).filter(Boolean)
  if (list.length === 0) return 'Anonymous'
  if (style === 'MLA') {
    return list.map((a, i) => {
      const parts = a.split(',').map(p => p.trim())
      if (i === 0) return parts.length > 1 ? `${parts[0]}, ${parts[1]}` : a
      return parts.length > 1 ? `${parts[1]} ${parts[0]}` : a
    }).join(list.length === 2 ? ' and ' : ', ')
  }
  // APA / Chicago / Harvard-ish: Last, F.
  return list.map(a => {
    const parts = a.split(',').map(p => p.trim())
    if (parts.length < 2) return a
    const initials = parts[1].split(/\s+/).map(w => w[0] + '.').join(' ')
    return `${parts[0]}, ${initials}`
  }).join(', ')
}

function formatBib(r: RefEntry, style: CiteStyle): string {
  const auth = formatAuthors(r.authors, style)
  const y = r.year || 'n.d.'
  if (style === 'APA') {
    if (r.type === 'journal') {
      return `${auth} (${y}). ${r.title}. ${r.journal || 'Journal'}${r.volume ? `, ${r.volume}` : ''}${r.issue ? `(${r.issue})` : ''}${r.pages ? `, ${r.pages}` : ''}.${r.doi ? ` https://doi.org/${r.doi}` : ''}`
    }
    if (r.type === 'book') {
      return `${auth} (${y}). ${r.title}. ${r.publisher || 'Publisher'}.`
    }
    return `${auth} (${y}). ${r.title}. ${r.url || ''}`
  }
  if (style === 'MLA') {
    if (r.type === 'journal') {
      return `${auth}. "${r.title}." ${r.journal || 'Journal'}, vol. ${r.volume || '?'}, no. ${r.issue || '?'}, ${y}, pp. ${r.pages || '?'}.`
    }
    if (r.type === 'book') {
      return `${auth}. ${r.title}. ${r.publisher || 'Publisher'}, ${y}.`
    }
    return `${auth}. "${r.title}." ${r.url || 'Web'}, ${y}.`
  }
  if (style === 'Chicago') {
    if (r.type === 'journal') {
      return `${auth}. "${r.title}." ${r.journal || 'Journal'} ${r.volume || ''} (${y}): ${r.pages || ''}.`
    }
    return `${auth}. ${r.title}. ${r.publisher || 'Publisher'}, ${y}.`
  }
  // Harvard
  if (r.type === 'journal') {
    return `${auth} (${y}) '${r.title}', ${r.journal || 'Journal'}, ${r.volume || ''}(${r.issue || ''}), pp. ${r.pages || ''}.`
  }
  return `${auth} (${y}) ${r.title}. ${r.publisher || 'Publisher'}.`
}

function formatInText(r: RefEntry, style: CiteStyle): string {
  const first = r.authors.split(';')[0]?.trim() || 'Anonymous'
  const last = first.split(',')[0]?.trim() || first
  const y = r.year || 'n.d.'
  if (style === 'MLA') return `(${last} ${y})`
  if (style === 'Chicago') return `(${last} ${y})`
  return `(${last}, ${y})`
}

function toBibTeX(r: RefEntry): string {
  const key = (r.authors.split(',')[0] || 'ref').replace(/\W/g, '') + (r.year || '0000')
  const type = r.type === 'journal' ? 'article' : r.type === 'book' ? 'book' : 'misc'
  const lines = [`@${type}{${key},`, `  author = {${r.authors.replace(/;/g, ' and ')}},`, `  title = {${r.title}},`, `  year = {${r.year}},`]
  if (r.journal) lines.push(`  journal = {${r.journal}},`)
  if (r.publisher) lines.push(`  publisher = {${r.publisher}},`)
  if (r.volume) lines.push(`  volume = {${r.volume}},`)
  if (r.pages) lines.push(`  pages = {${r.pages}},`)
  if (r.doi) lines.push(`  doi = {${r.doi}},`)
  if (r.url) lines.push(`  url = {${r.url}},`)
  lines.push('}')
  return lines.join('\n')
}

export const LocalReferenceManager: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'local-reference-manager')!
  const [entry, setEntry] = useState<RefEntry>(SAMPLE)
  const [style, setStyle] = useState<CiteStyle>('APA')
  const [library, setLibrary] = useState<RefEntry[]>([SAMPLE])
  const [copied, setCopied] = useState(false)

  const bib = useMemo(() => formatBib(entry, style), [entry, style])
  const inText = useMemo(() => formatInText(entry, style), [entry, style])
  const bibtex = useMemo(() => toBibTeX(entry), [entry])

  const update = (patch: Partial<RefEntry>) => setEntry(prev => ({ ...prev, ...patch }))

  const handleCopy = async () => {
    const text = [`Bibliography (${style}):`, bib, '', `In-text: ${inText}`, '', 'BibTeX:', bibtex].join('\n')
    if (await copyToClipboard(text)) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const addToLibrary = () => {
    setLibrary(prev => [...prev, { ...entry, id: crypto.randomUUID() }])
  }

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Writing & Citations"
        onLoadSample={() => setEntry(SAMPLE)}
        onReset={() => setEntry({ id: crypto.randomUUID(), type: 'book', authors: '', title: '', year: '' })}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {(['APA', 'MLA', 'Chicago', 'Harvard'] as CiteStyle[]).map(s => (
          <button key={s} type="button" onClick={() => setStyle(s)} className={`px-3 py-1.5 rounded-xl text-sm font-medium ${style === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{s}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Type</label>
              <select value={entry.type} onChange={e => update({ type: e.target.value as SourceType })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="book">Book</option>
                <option value="journal">Journal</option>
                <option value="website">Website</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Year</label>
              <input value={entry.year} onChange={e => update({ year: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Authors (Last, First; …)</label>
            <input value={entry.authors} onChange={e => update({ authors: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
            <input value={entry.title} onChange={e => update({ title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          {entry.type === 'journal' && (
            <div className="grid grid-cols-3 gap-2">
              <div><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Journal</label><input value={entry.journal || ''} onChange={e => update({ journal: e.target.value })} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              <div><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Vol</label><input value={entry.volume || ''} onChange={e => update({ volume: e.target.value })} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              <div><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Pages</label><input value={entry.pages || ''} onChange={e => update({ pages: e.target.value })} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            </div>
          )}
          {entry.type === 'book' && (
            <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">Publisher</label><input value={entry.publisher || ''} onChange={e => update({ publisher: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">DOI</label><input value={entry.doi || ''} onChange={e => update({ doi: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">URL</label><input value={entry.url || ''} onChange={e => update({ url: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          </div>
          <button type="button" onClick={addToLibrary} className="text-sm font-medium text-indigo-600 hover:underline">+ Add to session library</button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600 mb-2"><Library className="w-5 h-5" /><span className="text-xs font-bold uppercase">Bibliography ({style})</span></div>
            <p className="text-sm text-slate-800 leading-relaxed">{bib}</p>
            <p className="text-xs text-slate-500 mt-3">In-text: <span className="font-mono text-slate-700">{inText}</span></p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500 mb-2">BibTeX</p>
            <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl">{bibtex}</pre>
          </div>
          {library.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-slate-500 mb-2">Session library ({library.length})</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {library.map(r => (
                  <li key={r.id} className="border-b border-slate-100 pb-2">{formatBib(r, style)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
