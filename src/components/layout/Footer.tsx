import React from 'react'
import { ShieldCheck, GraduationCap, ExternalLink } from 'lucide-react'
import { TOOLS } from '../../data/tools'
import { ToolDefinition } from '../../types'

interface FooterProps {
  onSelectTool: (tool: ToolDefinition) => void
  onOpenContact?: () => void
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool, onOpenContact }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-20 transition-colors">
      <div className="border-b border-slate-100 dark:border-slate-800/80 bg-indigo-50/50 dark:bg-indigo-950/20 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium text-slate-900 dark:text-slate-200">100% Client-Side Privacy:</span>
            <span>All calculations stay in your browser.</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                <span className="text-indigo-600 dark:text-indigo-400">Codepackr</span> Study
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Free, fast, and private browser-based utilities for students.
            </p>
            <a href="https://www.codepackr.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs font-medium inline-flex items-center gap-0.5">
              Codepackr Suite <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3">Academic</h3>
            <ul className="space-y-2 text-xs">
              {TOOLS.filter(t => t.category === 'academic').map(tool => (
                <li key={tool.id}><button onClick={() => onSelectTool(tool)} className="text-slate-600 hover:text-indigo-600">{tool.name}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3">Writing</h3>
            <ul className="space-y-2 text-xs">
              {TOOLS.filter(t => t.category === 'citations').map(tool => (
                <li key={tool.id}><button onClick={() => onSelectTool(tool)} className="text-slate-600 hover:text-indigo-600">{tool.name}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3">More</h3>
            <ul className="space-y-2 text-xs">
              {TOOLS.filter(t => t.category === 'study-aids' || t.category === 'science').map(tool => (
                <li key={tool.id}><button onClick={() => onSelectTool(tool)} className="text-slate-600 hover:text-indigo-600">{tool.name}</button></li>
              ))}
              <li><button onClick={onOpenContact} className="text-indigo-600 font-semibold">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          © {new Date().getFullYear()} Codepackr Study.
        </div>
      </div>
    </footer>
  )
}
