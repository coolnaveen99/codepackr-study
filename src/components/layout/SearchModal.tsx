import React, { useState, useEffect, useRef } from 'react'
import { Search, X, GraduationCap, Percent, BookOpen, FileText, Layers, Scale, Clock, ArrowRight } from 'lucide-react'
import { TOOLS } from '../../data/tools'
import { ToolDefinition } from '../../types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTool: (tool: ToolDefinition) => void
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  GraduationCap,
  Percent,
  BookOpen,
  FileText,
  Layers,
  Scale,
  Clock
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const filtered = TOOLS.filter(t => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
    )
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1))
      } else if (e.key === 'Enter') {
        if (filtered[selectedIndex]) {
          onSelectTool(filtered[selectedIndex])
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered, selectedIndex, onClose, onSelectTool])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search GPA, citation generator, flashcards, unit converter..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No tools matching &quot;{query}&quot;. Try searching for &quot;GPA&quot;, &quot;Citation&quot;, or &quot;Unit&quot;.
            </div>
          ) : (
            filtered.map((tool, idx) => {
              const IconComponent = ICON_MAP[tool.icon] || GraduationCap
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool)
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-3 rounded-xl flex items-center justify-between gap-3 transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-sm truncate flex items-center gap-2">
                        <span>{tool.name}</span>
                        {tool.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {tool.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'translate-x-0.5 text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd></span>
          <span>Select with <kbd className="font-mono">↵ Enter</kbd></span>
        </div>
      </div>
    </div>
  )
}
