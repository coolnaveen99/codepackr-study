import React from 'react'
import { Sparkles, RotateCcw, Copy, Check, ShieldCheck, ArrowLeft } from 'lucide-react'

interface ToolHeaderProps {
  title: string
  description: string
  badge?: string
  categoryName?: string
  onLoadSample?: () => void
  onReset?: () => void
  onCopyResult?: () => void
  isCopied?: boolean
  copyDisabled?: boolean
  onBack?: () => void
  customActions?: React.ReactNode
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  title,
  description,
  badge,
  categoryName,
  onLoadSample,
  onReset,
  onCopyResult,
  isCopied,
  copyDisabled = false,
  onBack,
  customActions
}) => {
  return (
    <div className="mb-8">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Study Tools</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {categoryName && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {categoryName}
            </span>
          )}
          {badge && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
              {badge}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
            <ShieldCheck className="w-3 h-3" />
            100% Client-Side
          </span>
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            {description}
          </p>
        </div>

        {/* Standardized Tool Actions: Sample, Reset, Copy */}
        <div className="flex flex-wrap items-center gap-2">
          {onLoadSample && (
            <button
              onClick={onLoadSample}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition cursor-pointer"
              title="Fill with realistic sample data"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Sample Data</span>
            </button>
          )}

          {onReset && (
            <button
              onClick={onReset}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition cursor-pointer"
              title="Clear all fields"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Reset</span>
            </button>
          )}

          {onCopyResult && (
            <button
              onClick={onCopyResult}
              disabled={copyDisabled}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                isCopied
                  ? 'bg-emerald-600 text-white'
                  : copyDisabled
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
              title="Copy calculation or result to clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Result</span>
                </>
              )}
            </button>
          )}

          {customActions}
        </div>
      </div>
    </div>
  )
}
