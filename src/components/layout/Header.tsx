import React from 'react'
import { Search, Sun, Moon, GraduationCap } from 'lucide-react'

interface HeaderProps {
  dark: boolean
  onToggleTheme: () => void
  onOpenSearch: () => void
  onGoHome: () => void
}

export const Header: React.FC<HeaderProps> = ({
  dark,
  onToggleTheme,
  onOpenSearch,
  onGoHome
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 group text-left cursor-pointer"
            title="Codepackr Study — Home"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                <span className="text-indigo-600 dark:text-indigo-400">Codepackr</span> Study
              </span>
              <span className="hidden md:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                100% Client-Side
              </span>
            </div>
          </button>
        </div>

        {/* Center/Right: Quick Search Trigger & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            type="button"
            className="flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600 transition cursor-pointer"
            aria-label="Search student tools"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onToggleTheme}
            type="button"
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  )
}
