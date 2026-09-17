import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { SearchModal } from './components/layout/SearchModal'
import { HomeView } from './components/HomeView'
import { GpaCalculator } from './components/tools/GpaCalculator'
import { GradeCalculator } from './components/tools/GradeCalculator'
import { WordCounter } from './components/tools/WordCounter'
import { CitationGenerator } from './components/tools/CitationGenerator'
import { FlashcardGenerator } from './components/tools/FlashcardGenerator'
import { UnitConverters } from './components/tools/UnitConverters'
import { StudyTimer } from './components/tools/StudyTimer'
import { ToolDefinition } from './types'
import { getToolBySlug, getCurrentSlug } from './lib/urls'

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('codepackr_study_theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const [currentTool, setCurrentTool] = useState<ToolDefinition | null>(() => {
    const slug = getCurrentSlug()
    return getToolBySlug(slug) || null
  })

  const [searchOpen, setSearchOpen] = useState(false)
  const [homeSearchQuery, setHomeSearchQuery] = useState('')

  // Sync dark theme to root element & localStorage
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('codepackr_study_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('codepackr_study_theme', 'light')
    }
  }, [dark])

  // Hash & Popstate routing sync
  const syncRoute = useCallback(() => {
    const slug = getCurrentSlug()
    const tool = getToolBySlug(slug)
    setCurrentTool(tool || null)
    if (tool) {
      document.title = `${tool.name} — Codepackr Study`
    } else {
      document.title = 'Codepackr Study — 100% Client-Side Student & Exam Tools'
    }
  }, [])

  useEffect(() => {
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    syncRoute()
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [syncRoute])

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelectTool = (tool: ToolDefinition) => {
    setCurrentTool(tool)
    window.location.hash = `#/${tool.slug}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoHome = () => {
    setCurrentTool(null)
    window.location.hash = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderToolComponent = () => {
    if (!currentTool) return null

    switch (currentTool.id) {
      case 'gpa-calculator':
        return <GpaCalculator onBack={handleGoHome} />
      case 'grade-calculator':
        return <GradeCalculator onBack={handleGoHome} />
      case 'word-counter':
        return <WordCounter onBack={handleGoHome} />
      case 'citation-generator':
        return <CitationGenerator onBack={handleGoHome} />
      case 'flashcard-generator':
        return <FlashcardGenerator onBack={handleGoHome} />
      case 'unit-converters':
        return <UnitConverters onBack={handleGoHome} />
      case 'study-timer':
        return <StudyTimer onBack={handleGoHome} />
      default:
        return (
          <div className="text-center py-16">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Tool Not Found</h2>
            <button
              onClick={handleGoHome}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
            >
              Back to All Tools
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Header */}
      <Header
        dark={dark}
        onToggleTheme={() => setDark(!dark)}
        onOpenSearch={() => setSearchOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentTool ? (
          renderToolComponent()
        ) : (
          <HomeView
            onSelectTool={handleSelectTool}
            searchQuery={homeSearchQuery}
            setSearchQuery={setHomeSearchQuery}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTool={handleSelectTool} />

      {/* Cmd+K Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  )
}
