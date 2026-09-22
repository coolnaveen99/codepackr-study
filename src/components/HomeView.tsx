import React, { useState, useMemo } from 'react'
import {
  GraduationCap,
  Percent,
  BookOpen,
  FileText,
  Layers,
  Scale,
  Clock,
  Search,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  Trophy,
  ListOrdered,
  GitCompare,
  ListTree,
  Briefcase,
  HelpCircle,
  CalendarRange,
  Calculator,
  Atom
} from 'lucide-react'
import { TOOLS, CATEGORIES } from '../data/tools'
import { ToolDefinition, ToolCategory } from '../types'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  GraduationCap,
  Percent,
  BookOpen,
  FileText,
  Layers,
  Scale,
  Clock,
  CalendarCheck,
  Trophy,
  ListOrdered,
  GitCompare,
  ListTree,
  Briefcase,
  HelpCircle,
  CalendarRange,
  Calculator,
  Atom
}

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
          High-precision GPA calculators, citation generators, interactive flashcards, and scientific converters — engineered for students, researchers, and test-takers.
        </p>

        <div className="mt-8 max-w-xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. GPA, attendance, quiz, periodic table)..."
              className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mb-8 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-2xl transition cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-slate-200 bg-white p-8">
            <p className="text-base text-slate-600 font-medium">
              No tools found matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map(tool => {
              const IconComponent = ICON_MAP[tool.icon] || GraduationCap
              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool)}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-sm">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {tool.badge && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                            {tool.badge}
                          </span>
                        )}
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 capitalize">
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 pt-12 border-t border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl font-bold text-slate-900">
            Built Strictly for Academic Privacy & Performance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Why thousands of students trust Codepackr Study for exam prep and research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Zero Academic Data Transmission
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every formula, grade point calculation, and citation string executes strictly inside your browser memory. We never log or store your papers.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Instant Client-Side Speed
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No slow network latency, paywalls, login prompts, or invasive popup advertisements. Tools react instantaneously with every keystroke.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Global Scale Support
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compliant with US 4.0 letter grades, Indian 10-point UGC/AICTE scales, and official APA 7th / MLA 9th bibliography standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
