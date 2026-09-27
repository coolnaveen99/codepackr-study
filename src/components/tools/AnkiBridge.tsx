import { useState, useMemo, useRef, useEffect } from 'react'
import { Layers } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

interface Card {
  id: string
  front: string
  back: string
  tags: string
}

const STORAGE_KEY = 'codepackr_study_anki_deck'

const SAMPLE_CARDS: Card[] = [
  { id: '1', front: 'What is the derivative of x²?', back: '2x', tags: 'calculus math' },
  { id: '2', front: 'Capital of France?', back: 'Paris', tags: 'geography' },
  { id: '3', front: 'Photosynthesis equation (simplified)', back: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', tags: 'biology chemistry' },
]

function parseImport(text: string): Card[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const cards: Card[] = []
  for (const line of lines) {
    // Skip Anki header-ish lines
    if (line.startsWith('#') || line.toLowerCase().startsWith('front')) continue
    let front = ''
    let back = ''
    let tags = ''
    if (line.includes('\t')) {
      const parts = line.split('\t')
      front = parts[0]?.trim() || ''
      back = parts[1]?.trim() || ''
      tags = parts[2]?.trim() || ''
    } else if (line.includes('|')) {
      const parts = line.split('|')
      front = parts[0]?.trim() || ''
      back = parts[1]?.trim() || ''
      tags = parts[2]?.trim() || ''
    } else if (line.includes(',')) {
      // simple CSV: "front","back","tags" or front,back
      const m = line.match(/"([^"]*)"\s*,\s*"([^"]*)"(?:\s*,\s*"([^"]*)")?/)
      if (m) {
        front = m[1]; back = m[2]; tags = m[3] || ''
      } else {
        const parts = line.split(',')
        front = parts[0]?.trim() || ''
        back = parts[1]?.trim() || ''
        tags = parts.slice(2).join(',').trim()
      }
    } else {
      continue
    }
    if (front || back) {
      cards.push({ id: crypto.randomUUID(), front, back, tags })
    }
  }
  return cards
}

function toAnkiTsv(cards: Card[]): string {
  // Anki text import: Front\tBack\tTags
  return cards.map(c => `${c.front.replace(/\t/g, ' ')}\t${c.back.replace(/\t/g, ' ')}\t${c.tags.replace(/\t/g, ' ')}`).join('\n')
}

export const AnkiBridge: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'anki-bridge')!
  const [cards, setCards] = useState<Card[]>(SAMPLE_CARDS)
  const [importText, setImportText] = useState('')
  const [deckName, setDeckName] = useState('Codepackr Study Deck')
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { name?: string; cards?: Card[] }
        if (parsed.cards?.length) {
          setCards(parsed.cards)
          if (parsed.name) setDeckName(parsed.name)
        }
      }
    } catch { /* ignore */ }
  }, [])

  const tsv = useMemo(() => toAnkiTsv(cards), [cards])

  const saveLocal = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: deckName, cards }))
      setStatus(`Saved ${cards.length} card(s) to this browser.`)
    } catch {
      setStatus('Could not save (storage full or blocked).')
    }
  }

  const handleImportPaste = () => {
    const parsed = parseImport(importText)
    if (parsed.length === 0) {
      setStatus('No cards found. Use Front[TAB]Back[TAB]Tags per line.')
      return
    }
    setCards(parsed)
    setStatus(`Imported ${parsed.length} card(s).`)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      const parsed = parseImport(text)
      if (parsed.length === 0) setStatus('No cards parsed from file.')
      else {
        setCards(parsed)
        setImportText(text)
        setStatus(`Imported ${parsed.length} card(s) from ${file.name}.`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExportDownload = () => {
    const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${deckName.replace(/[^\w-]+/g, '_') || 'deck'}.txt`
    a.click()
    URL.revokeObjectURL(url)
    setStatus('Downloaded Anki-compatible .txt (tab-separated). Import via Anki → File → Import.')
  }

  const handleCopy = async () => {
    if (await copyToClipboard(tsv)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setStatus('Copied TSV to clipboard.')
    }
  }

  const updateCard = (id: string, patch: Partial<Card>) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }

  const removeCard = (id: string) => setCards(prev => prev.filter(c => c.id !== id))

  const addCard = () => {
    setCards(prev => [...prev, { id: crypto.randomUUID(), front: '', back: '', tags: '' }])
  }

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Study Aids & Timers"
        onLoadSample={() => { setCards(SAMPLE_CARDS); setStatus('Loaded sample deck.') }}
        onReset={() => { setCards([]); setImportText(''); setStatus('Cleared deck.') }}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      <div className="mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Deck name</label>
          <input value={deckName} onChange={e => setDeckName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <button type="button" onClick={saveLocal} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">Save in browser</button>
        <button type="button" onClick={handleExportDownload} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">Download for Anki</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <p className="text-xs font-bold uppercase text-slate-500">Import (paste or file)</p>
          <p className="text-xs text-slate-500">One card per line: <code className="bg-slate-100 px-1 rounded">Front[TAB]Back[TAB]Tags</code> or CSV</p>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            rows={6}
            placeholder={"What is 2+2?\t4\tmath\nCapital of Japan?\tTokyo\tgeography"}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleImportPaste} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">Parse paste</button>
            <input ref={fileRef} type="file" accept=".txt,.tsv,.csv,text/plain" onChange={handleFile} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">Import file</button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500 mb-2">Anki import tips</p>
          <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
            <li>Download the .txt file (tab-separated).</li>
            <li>Open Anki → <strong>File → Import</strong>.</li>
            <li>Choose the file; set field separator to <strong>Tab</strong>.</li>
            <li>Map fields: 1 = Front, 2 = Back, 3 = Tags (optional).</li>
            <li>Allow HTML in fields if your cards use markup.</li>
          </ol>
          <p className="text-xs text-slate-400 mt-3">Cards stay on your device. This site never uploads your deck.</p>
        </div>
      </div>

      {status && (
        <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{status}</div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-indigo-600">
            <Layers className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">{cards.length} cards</span>
          </div>
          <button type="button" onClick={addCard} className="text-sm font-medium text-indigo-600 hover:underline">+ Add card</button>
        </div>
        <div className="space-y-3 max-h-[420px] overflow-y-auto">
          {cards.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">No cards yet — paste, import a file, or load sample.</p>
          )}
          {cards.map((c, i) => (
            <div key={c.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start border-b border-slate-100 pb-3">
              <span className="sm:col-span-1 text-xs text-slate-400 pt-2">{i + 1}</span>
              <input value={c.front} onChange={e => updateCard(c.id, { front: e.target.value })} placeholder="Front" className="sm:col-span-4 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input value={c.back} onChange={e => updateCard(c.id, { back: e.target.value })} placeholder="Back" className="sm:col-span-4 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input value={c.tags} onChange={e => updateCard(c.id, { tags: e.target.value })} placeholder="Tags" className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              <button type="button" onClick={() => removeCard(c.id)} className="sm:col-span-1 text-xs text-slate-400 hover:text-red-500 pt-2">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
