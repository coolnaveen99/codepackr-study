import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { CodepackrFamilyBar } from './components/CodepackrFamilyBar'
import { Footer } from './components/layout/Footer'
import { MobileBottomNav, STUDY_MOBILE_TABS } from './components/MobileBottomNav'
import { SearchModal } from './components/layout/SearchModal'
import { HomeView } from './components/HomeView'
import { ContactView } from './components/ContactView'
import { ToolView } from './components/ToolView'
import { TOOLS, getToolById } from './data/tools'
import { getCurrentSlug, setToolUrl, setHomeUrl, setContactUrl } from './lib/routing'

export default function App() {
  const [currentTool, setCurrentTool] = useState<string | null>(null)
  const [showContact, setShowContact] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState('home')

  // Dark mode deferred — light theme only (MOBILE_PREMIUM_UX §1B).
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    try {
      if (localStorage.getItem('codepackr_study_theme') === 'dark') {
        localStorage.setItem('codepackr_study_theme', 'light')
      }
    } catch { /* ignore */ }
  }, [])

  const syncRoute = useCallback(() => {
    const slug = getCurrentSlug()
    if (slug === 'contact') {
      setShowContact(true)
      setCurrentTool(null)
      document.title = 'Contact — Codepackr Study'
      return
    }
    if (slug && getToolById(slug)) {
      setCurrentTool(slug)
      setShowContact(false)
      document.title = `${getToolById(slug)?.name ?? slug} — Codepackr Study`
      return
    }
    setCurrentTool(null)
    setShowContact(false)
    document.title = 'Codepackr Study — Student Tools'
  }, [])

  useEffect(() => {
    syncRoute()
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [syncRoute])

  const openTool = (id: string) => {
    setCurrentTool(id)
    setShowContact(false)
    setToolUrl(id)
    setSearchOpen(false)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => {
    setCurrentTool(null)
    setShowContact(false)
    setHomeUrl()
    setMobileTab('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openContact = () => {
    setShowContact(true)
    setCurrentTool(null)
    setContactUrl()
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleMobileTab = (tab: string) => {
    setMobileTab(tab)
    if (tab === 'home') goHome()
    else if (tab === 'subjects') {
      setSidebarOpen(true)
    } else if (tab === 'practice') {
      // open first practice-oriented tool or subjects
      setSidebarOpen(true)
    } else if (tab === 'progress') {
      goHome()
    } else if (tab === 'more') {
      setSidebarOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <CodepackrFamilyBar />
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSidebar={() => setSidebarOpen(true)}
        onGoHome={goHome}
        onOpenContact={openContact}
      />
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectTool={openTool}
          currentTool={currentTool}
        />
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 cp-mobile-main-pad">
          {showContact ? (
            <ContactView onBack={goHome} />
          ) : currentTool ? (
            <ToolView toolId={currentTool} onBack={goHome} onSelectRelated={openTool} />
          ) : (
            <HomeView onSelectTool={openTool} onOpenSearch={() => setSearchOpen(true)} />
          )}
        </main>
      </div>
      <MobileBottomNav
        tabs={STUDY_MOBILE_TABS}
        activeTab={mobileTab}
        onSelectTab={handleMobileTab}
      />
      <Footer onGoHome={goHome} onOpenContact={openContact} />
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={openTool}
      />
    </div>
  )
}
