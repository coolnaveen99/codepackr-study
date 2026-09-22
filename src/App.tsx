import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { CodepackrFamilyBar } from './components/CodepackrFamilyBar'
import { Footer } from './components/layout/Footer'
import { SearchModal } from './components/layout/SearchModal'
import { HomeView } from './components/HomeView'
import { ContactView } from './components/ContactView'
import { GpaCalculator } from './components/tools/GpaCalculator'
import { GradeCalculator } from './components/tools/GradeCalculator'
import { WordCounter } from './components/tools/WordCounter'
import { CitationGenerator } from './components/tools/CitationGenerator'
import { FlashcardGenerator } from './components/tools/FlashcardGenerator'
import { UnitConverters } from './components/tools/UnitConverters'
import { StudyTimer } from './components/tools/StudyTimer'
import { AttendanceCalculator } from './components/tools/AttendanceCalculator'
import { SgpaPercentage } from './components/tools/SgpaPercentage'
import { MarksToGrade } from './components/tools/MarksToGrade'
import { ParaphraseChecker } from './components/tools/ParaphraseChecker'
import { EssayOutline } from './components/tools/EssayOutline'
import { ResumeSopCounter } from './components/tools/ResumeSopCounter'
import { QuizGenerator } from './components/tools/QuizGenerator'
import { SpacedRepetition } from './components/tools/SpacedRepetition'
import { ScientificCalculator } from './components/tools/ScientificCalculator'
import { PeriodicTable } from './components/tools/PeriodicTable'
import { ToolDefinition } from './types'
import { getToolBySlug, getCurrentSlug } from './lib/urls'

export default function App() {
  const [currentTool, setCurrentTool] = useState<ToolDefinition | null>(() => {
    const slug = getCurrentSlug()
    return getToolBySlug(slug) || null
  })
  const [showContact, setShowContact] = useState(() => getCurrentSlug() === 'contact')
  const [searchOpen, setSearchOpen] = useState(false)
  const [homeSearchQuery, setHomeSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ToolDefinition['category'] | 'all'>('all')

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('codepackr_study_theme', 'light')
  }, [])

  const syncRoute = useCallback(() => {
    const slug = getCurrentSlug()
    if (slug === 'contact') {
      setShowContact(true)
      setCurrentTool(null)
      document.title = 'Contact — Codepackr Study'
      return
    }
    setShowContact(false)
    const tool = getToolBySlug(slug)
    setCurrentTool(tool || null)
    document.title = tool ? `${tool.name} — Codepackr Study` : 'Codepackr Study — 100% Client-Side Student & Exam Tools'
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
    setShowContact(false)
    setCurrentTool(tool)
    window.location.hash = `#/${tool.slug}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoHome = () => {
    setShowContact(false)
    setCurrentTool(null)
    window.location.hash = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenContact = () => {
    setCurrentTool(null)
    setShowContact(true)
    window.location.hash = '#/contact'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderToolComponent = () => {
    if (!currentTool) return null
    switch (currentTool.id) {
      case 'gpa-calculator': return <GpaCalculator onBack={handleGoHome} />
      case 'grade-calculator': return <GradeCalculator onBack={handleGoHome} />
      case 'attendance-calculator': return <AttendanceCalculator onBack={handleGoHome} />
      case 'sgpa-percentage': return <SgpaPercentage onBack={handleGoHome} />
      case 'marks-to-grade': return <MarksToGrade onBack={handleGoHome} />
      case 'word-counter': return <WordCounter onBack={handleGoHome} />
      case 'citation-generator': return <CitationGenerator onBack={handleGoHome} />
      case 'paraphrase-checker': return <ParaphraseChecker onBack={handleGoHome} />
      case 'essay-outline': return <EssayOutline onBack={handleGoHome} />
      case 'resume-sop-counter': return <ResumeSopCounter onBack={handleGoHome} />
      case 'flashcard-generator': return <FlashcardGenerator onBack={handleGoHome} />
      case 'study-timer': return <StudyTimer onBack={handleGoHome} />
      case 'quiz-generator': return <QuizGenerator onBack={handleGoHome} />
      case 'spaced-repetition': return <SpacedRepetition onBack={handleGoHome} />
      case 'unit-converters': return <UnitConverters onBack={handleGoHome} />
      case 'scientific-calculator': return <ScientificCalculator onBack={handleGoHome} />
      case 'periodic-table': return <PeriodicTable onBack={handleGoHome} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <CodepackrFamilyBar />
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onGoHome={handleGoHome}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSelectTool={handleSelectTool}
        onGoHome={handleGoHome}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {showContact ? (
          <ContactView onBack={handleGoHome} />
        ) : currentTool ? (
          renderToolComponent()
        ) : (
          <HomeView
            onSelectTool={handleSelectTool}
            searchQuery={homeSearchQuery}
            setSearchQuery={setHomeSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}
      </main>
      <Footer onSelectTool={handleSelectTool} onOpenContact={handleOpenContact} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSelectTool={handleSelectTool} />
    </div>
  )
}
