import React from 'react'
import { Search, GraduationCap, Menu } from 'lucide-react'

interface HeaderProps {
  onOpenSearch: () => void
  onGoHome: () => void
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onGoHome,
  onToggleSidebar,
  sidebarOpen,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              type="button"
              id="sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0"
              aria-label={sidebarOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
              aria-expanded={sidebarOpen}
              aria-controls="app-sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onGoHome}
            className="flex items-center gap-2 group text-left cursor-pointer min-w-0"
            title="Codepackr Study — Home"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                <span className="text-indigo-600">Codepackr</span> Study
              </span>
              <span className="hidden md:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Client-Side
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            type="button"
            className="flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-300 hover:text-slate-700 transition cursor-pointer"
            aria-label="Search student tools"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  )
}
