import React, { useState, useMemo } from 'react'
import {
  Search,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { TOOLS, CATEGORIES } from '../data/tools'
import { ToolDefinition, ToolCategory } from '../types'
import { getToolIcon } from '../lib/tool-icons'

interface HomeViewProps {
  onSelectTool: (tool: ToolDefinition) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTool,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all')

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q || (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q))
      )
      return matchesCat && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="w-full">
      <section className="text-center py-10 sm:py-16 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-6 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% Client-Side Privacy: No grades or research text ever leave your browser</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Student & Exam Tools
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          High-precision GPA calculators, citation generators, interactive flashcards, and scientific converters — engineered for students, researchers, and exam prep. Everything runs in your browser.
        </p>

        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tools (GPA, citation, flashcards…)"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" /> Instant</span>
          <span className="inline-flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-500" /> Private</span>
          <span className="inline-flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-indigo-500" /> {TOOLS.length} tools</span>
        </div>
      </section>

      <section className="mb-8 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-700'
                }`}
              >
                {cat.label}
                <span className={`ml-1.5 text-xs ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>({cat.count})</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        {filteredTools.length === 0 ? (
          <p className="text-center text-slate-500 py-16">No tools match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => {
              const IconComponent = getToolIcon(tool.icon)
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onSelectTool(tool)}
                  className="group text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-semibold text-slate-900 group-hover:text-indigo-700">{tool.name}</h2>
                        {tool.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600">{tool.badge}</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{tool.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Open <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
