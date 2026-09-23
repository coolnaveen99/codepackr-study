import React from 'react'
import { Search, GraduationCap, Menu, X } from 'lucide-react'

interface HeaderProps {
  onOpenSearch: () => void
  onGoHome: () => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onGoHome,
  onToggleSidebar,
  sidebarOpen,
}) => {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Left hamburger */}
          <button
            type="button"
            id="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0 shadow-xs"
            aria-label={sidebarOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 group text-left cursor-pointer min-w-0 focus:outline-none"
            title="Codepackr Study — Home"
          >
            <div className="size-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs ring-1 ring-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                  <span className="text-indigo-600">CodePackr</span> Study
                </span>
                <span className="hidden md:inline-block text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/80 font-mono">
                  Student Suite
                </span>
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            type="button"
            className="flex items-center gap-2.5 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-400 hover:ring-2 hover:ring-indigo-500/15 hover:text-slate-900 transition-all duration-200 cursor-pointer shadow-2xs group"
            aria-label="Search student tools"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="hidden sm:inline">Search calculators & tools...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium bg-white border border-slate-200 rounded-md text-slate-400 group-hover:border-indigo-300 transition-colors">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  )
}
