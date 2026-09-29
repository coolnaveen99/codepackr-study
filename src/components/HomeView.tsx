import React, { useState, useMemo } from 'react'
import {
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Compass,
  Lock,
  Zap,
  BookOpen,
  Timer,
  Quote
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
    <div className="w-full space-y-8 sm:space-y-10">
      {/* UNIQUE Study hero: centered campus banner + horizontal metric strip (NOT split + 3 floating cards) */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-b from-violet-50 via-white to-indigo-50/40 shadow-md">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500" />
        <div className="pointer-events-none absolute -right-16 top-8 size-64 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 size-48 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative z-10 px-5 py-8 sm:px-10 sm:py-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-3 py-1 text-xs font-bold tracking-wide text-violet-700 shadow-2xs mb-5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Campus Suite · 100% Client-Side · Zero Grade Leak</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Study smarter.
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              GPA, citations &amp; exams — private.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            High-precision GPA calculators, APA/MLA citations, flashcards, and converters for students and researchers. Every formula runs on your device.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                const gpaTool = TOOLS.find(t => t.id === 'gpa-calculator')
                if (gpaTool) onSelectTool(gpaTool)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-violet-500/25 hover:bg-violet-700 active:scale-95 transition cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              Calculate GPA
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('all-tools-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-violet-400 transition cursor-pointer"
            >
              Explore {TOOLS.length}+ tools
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 px-5 pb-8 sm:px-10">
          <button
            type="button"
            onClick={() => {
              const t = TOOLS.find(x => x.id === 'gpa-calculator')
              if (t) onSelectTool(t)
            }}
            className="flex items-center gap-4 rounded-2xl border border-violet-200/80 bg-white/95 p-4 text-left shadow-sm hover:border-violet-400 hover:shadow-md transition cursor-pointer"
          >
            <div className="relative size-14 shrink-0">
              <svg className="size-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#ede9fe" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="96 100" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-violet-700">3.8</span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">GPA &amp; CGPA</div>
              <div className="text-xs text-slate-500">US 4.0 · UGC 10.0 scales</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              const t = TOOLS.find(x => x.id === 'citation-generator' || x.id.includes('citation'))
              if (t) onSelectTool(t)
              else {
                const any = TOOLS.find(x => x.keywords?.some(k => k.includes('citation') || k.includes('apa')))
                if (any) onSelectTool(any)
              }
            }}
            className="flex items-center gap-4 rounded-2xl border border-indigo-200/80 bg-white/95 p-4 text-left shadow-sm hover:border-indigo-400 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Quote className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Citations</div>
              <div className="text-xs text-slate-500">APA 7th · MLA 9th · in-text</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              const t = TOOLS.find(x => x.id.includes('timer') || x.id.includes('pomodoro') || x.id.includes('focus'))
              if (t) onSelectTool(t)
              else document.getElementById('all-tools-section')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex items-center gap-4 rounded-2xl border border-fuchsia-200/80 bg-white/95 p-4 text-left shadow-sm hover:border-fuchsia-400 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Focus Timer</div>
              <div className="text-xs text-slate-500">Pomodoro · exam mocks</div>
            </div>
          </button>
        </div>
      </section>

      <section id="all-tools-section" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600">
              <Compass className="w-4 h-4" />
              <span>Complete Academic Tools Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Explore All Student &amp; Exam Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} available • 100% private in your browser
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tools (GPA, quiz, citations...)"
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white shadow-xs text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-slate-200 bg-white p-8">
            <p className="text-base text-slate-600 font-medium">
              No tools match your search &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => {
              const IconComponent = getToolIcon(tool.icon)
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onSelectTool(tool)}
                  className="group text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-violet-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:scale-105 group-hover:bg-violet-600 group-hover:text-white transition-all duration-200 shadow-xs">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                            {tool.name}
                          </h3>
                          {tool.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-100">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-violet-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <section className="pt-8 pb-4 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Zero Academic Data Leak</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every GPA formula, course grade, citation string, and flashcard runs 100% locally in your browser memory.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2.5">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Instant Client-Side Computation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No server roundtrips, paywalls, or accounts needed. Formulas update instantly with every keypress.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Global Scale Standards</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              US 4.0 letter grades, Indian 10-point AICTE/UGC systems, APA 7th, and MLA 9th bibliography standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
