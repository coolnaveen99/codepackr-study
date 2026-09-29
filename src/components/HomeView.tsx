import React, { useState, useMemo } from 'react'
import {
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Compass,
  Lock,
  Zap
} from 'lucide-react'
import { TOOLS, CATEGORIES } from '../data/tools'
import { ToolDefinition, ToolCategory } from '../types'
import { getToolIcon } from '../lib/tool-icons'
import { HeroPreviewCards } from './HeroPreviewCards'

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
      {/* 1. Hero Section - Enclosed Modern High-Tech Box Container */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 p-5 sm:p-7 lg:p-9 shadow-md shadow-indigo-500/5">
        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-3.5 sm:space-y-4 lg:col-span-7">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/90 px-3 py-1 text-xs font-bold tracking-wide text-indigo-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>100% Client-Side Student &amp; Exam Tools Suite</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-900 leading-tight">
              Codepackr Study
              <span className="block text-indigo-600 text-xl sm:text-3xl lg:text-[2.1rem] mt-1 font-bold">
                100% Client-Side GPA, Citations &amp; Exam Tools
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              High-precision GPA calculators, citation generators, interactive flashcards, and scientific converters — engineered for students, researchers, and test-takers. Zero academic data ever leaves your device.
            </p>

            {/* Value Props Strip */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1 text-[11px] sm:text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 rounded-lg bg-white/90 border border-slate-200/90 px-2.5 py-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Step-by-Step Calc</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/90 border border-slate-200/90 px-2.5 py-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>US 4.0 &amp; UGC 10.0 Scales</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/90 border border-slate-200/90 px-2.5 py-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/90 border border-slate-200/90 px-2.5 py-1 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{TOOLS.length}+ Free Academic Tools</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const gpaTool = TOOLS.find(t => t.id === 'gpa-calculator')
                  if (gpaTool) onSelectTool(gpaTool)
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Calculate GPA (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('all-tools-section')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-95 cursor-pointer"
              >
                <span>Explore All Tools</span>
                <span className="text-[11px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-extrabold">
                  {TOOLS.length}+
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Floating Preview Cards */}
          <HeroPreviewCards
            className="lg:col-span-5"
            onSelect={card => {
              if (card.targetId) {
                const targetTool = TOOLS.find(t => t.id === card.targetId || t.slug === card.targetId)
                if (targetTool) {
                  onSelectTool(targetTool)
                }
              }
            }}
          />
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-purple-500/10 blur-3xl" />
      </section>

      {/* 2. Complete Tools Directory */}
      <section id="all-tools-section" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600">
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

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tools (GPA, quiz, citations...)"
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white shadow-xs text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
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

        {/* Category Filter Pills */}
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
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
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

        {/* Tools Grid */}
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
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer"
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
                  className="group text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-xs">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {tool.name}
                          </h3>
                          {tool.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
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

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* 3. Privacy & Performance Guarantee Section */}
      <section className="pt-8 pb-4 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              Zero Academic Data Leak
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every GPA formula, course grade, citation string, and flashcard runs 100% locally in your browser memory.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              Instant Client-Side Computation
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No server roundtrips, paywalls, or accounts needed. Formulas update instantly with every keypress.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              Global Scale Standards
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              US 4.0 letter grades, Indian 10-point AICTE/UGC systems, APA 7th, and MLA 9th bibliography standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
