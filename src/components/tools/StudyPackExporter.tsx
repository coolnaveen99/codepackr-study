import { useState, useRef } from 'react'
import { Download, Upload, Package } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

const PACK_VERSION = 1
const STORAGE_PREFIX = 'codepackr_study_'

interface StudyPack {
  version: number
  exportedAt: string
  keys: Record<string, string>
}

function collectLocalData(): StudyPack {
  const keys: Record<string, string> = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(STORAGE_PREFIX)) {
        const v = localStorage.getItem(k)
        if (v !== null) keys[k] = v
      }
    }
  } catch { /* ignore */ }
  return {
    version: PACK_VERSION,
    exportedAt: new Date().toISOString(),
    keys,
  }
}

function applyPack(pack: StudyPack): { imported: number; errors: string[] } {
  const errors: string[] = []
  let imported = 0
  if (!pack || typeof pack !== 'object' || !pack.keys) {
    return { imported: 0, errors: ['Invalid pack format'] }
  }
  try {
    for (const [k, v] of Object.entries(pack.keys)) {
      if (typeof k === 'string' && k.startsWith(STORAGE_PREFIX) && typeof v === 'string') {
        localStorage.setItem(k, v)
        imported++
      }
    }
  } catch (e) {
    errors.push(String(e))
  }
  return { imported, errors }
}

export const StudyPackExporter: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'study-pack-exporter')!
  const [status, setStatus] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const pack = collectLocalData()
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `codepackr-study-pack-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setStatus(`Exported ${Object.keys(pack.keys).length} key(s) to file.`)
  }

  const handleCopyJson = async () => {
    const pack = collectLocalData()
    if (await copyToClipboard(JSON.stringify(pack, null, 2))) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setStatus(`Copied ${Object.keys(pack.keys).length} key(s) as JSON.`)
    }
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const pack = JSON.parse(String(reader.result)) as StudyPack
        const { imported, errors } = applyPack(pack)
        if (errors.length) setStatus(`Import finished with errors: ${errors.join('; ')}`)
        else setStatus(`Imported ${imported} key(s) successfully. Reload tools that use saved data if needed.`)
      } catch {
        setStatus('Could not parse JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClearStudyData = () => {
    if (!confirm('Remove all Codepackr Study data from this browser? This cannot be undone.')) return
    const toRemove: string[] = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith(STORAGE_PREFIX)) toRemove.push(k)
      }
      toRemove.forEach(k => localStorage.removeItem(k))
      setStatus(`Cleared ${toRemove.length} key(s).`)
    } catch {
      setStatus('Could not clear storage.')
    }
  }

  const packPreview = collectLocalData()

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Study Aids & Timers"
        onLoadSample={() => setStatus('No sample data — this tool works with your real localStorage keys.')}
        onReset={() => setStatus('')}
        onCopyResult={handleCopyJson}
        isCopied={copied}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Download className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Export</span>
          </div>
          <p className="text-sm text-slate-600">
            Download a JSON backup of all Codepackr Study data stored in this browser
            (keys starting with <code className="text-xs bg-slate-100 px-1 rounded">{STORAGE_PREFIX}</code>).
          </p>
          <p className="text-sm text-slate-500">Currently found: <strong>{Object.keys(packPreview.keys).length}</strong> key(s)</p>
          <button
            type="button"
            onClick={handleExport}
            className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            Download study pack (.json)
          </button>
          <button
            type="button"
            onClick={handleCopyJson}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
          >
            Copy JSON to clipboard
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Upload className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Import</span>
          </div>
          <p className="text-sm text-slate-600">
            Restore a previously exported pack. Existing keys with the same name will be overwritten.
          </p>
          <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleImportFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import from file
          </button>
          <button
            type="button"
            onClick={handleClearStudyData}
            className="w-full px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50"
          >
            Clear all study data in this browser
          </button>
        </div>
      </div>

      {status && (
        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          {status}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-slate-500 mb-2">Privacy note</p>
        <p className="text-sm text-slate-600">
          Export and import happen entirely in your browser. The JSON file is never uploaded to any server.
          Only keys that start with <code className="text-xs bg-slate-100 px-1 rounded">{STORAGE_PREFIX}</code> are included.
        </p>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
