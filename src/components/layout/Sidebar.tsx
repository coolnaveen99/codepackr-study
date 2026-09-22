import { useEffect } from 'react'
import {
  LayoutGrid,
  X,
  ShieldCheck,
  Lock,
  GraduationCap,
  Percent,
  CalendarCheck,
  Trophy,
  ListOrdered,
  BookOpen,
  FileText,
  GitCompare,
  ListTree,
  Briefcase,
  Layers,
  Clock,
  HelpCircle,
  CalendarRange,
  Scale,
  Calculator,
  Atom,
  type LucideIcon,
} from 'lucide-react'
import { TOOLS, CATEGORIES } from '../../data/tools'
import type { ToolDefinition } from '../../types'

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Percent,
  CalendarCheck,
  Trophy,
  ListOrdered,
  BookOpen,
  FileText,
  GitCompare,
  ListTree,
  Briefcase,
  Layers,
  Clock,
  HelpCircle,
  CalendarRange,
  Scale,
  Calculator,
  Atom,
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory: ToolDefinition['category'] | 'all'
  onSelectCategory: (cat: ToolDefinition['category'] | 'all') => void
  onSelectTool: (tool: ToolDefinition) => void
  onGoHome: () => void
}

export function Sidebar({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  onSelectTool,
  onGoHome,
}: SidebarProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        id="app-sidebar"
        className={`
          fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-72 max-w-[85vw]
          flex flex-col border-r border-slate-200 bg-white shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 lg:hidden">
          <span className="font-semibold text-slate-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all')
                onGoHome()
                onClose()
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 shrink-0" />
                All Tools
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                  selectedCategory === 'all' ? 'bg-white/20' : 'bg-slate-100'
                }`}
              >
                {TOOLS.length}
              </span>
            </button>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2 block">
              Categories
            </span>
            <div className="space-y-1">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const active = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id)
                      onGoHome()
                      onClose()
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate text-left">{cat.label}</span>
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded-md shrink-0 ${
                        active ? 'bg-indigo-100' : 'bg-slate-100'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2 block">
              Tools
            </span>
            <div className="space-y-0.5">
              {TOOLS.filter(
                (t) => selectedCategory === 'all' || t.category === selectedCategory,
              ).map((tool) => {
                const Icon = ICONS[tool.icon] || LayoutGrid
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      onSelectTool(tool)
                      onClose()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-left"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-indigo-500" />
                    <span className="truncate">{tool.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Client-Side Processing</span>
            </div>
            <p className="text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
              Zero server data transmission.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
