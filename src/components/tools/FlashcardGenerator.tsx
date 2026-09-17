import React, { useState, useEffect } from 'react'
import { Layers, Plus, Trash2, RotateCw, Play, Shuffle, Check, X, ArrowLeft, ArrowRight } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'
import { Flashcard } from '../../types'

const SAMPLE_DECK: Flashcard[] = [
  {
    id: '1',
    question: 'What is the primary function of the Mitochondria in eukaryotic cells?',
    answer: 'Known as the "powerhouse of the cell", it generates most of the chemical energy needed to power biochemical reactions via adenosine triphosphate (ATP).',
    hint: 'Cellular respiration'
  },
  {
    id: '2',
    question: 'What is Newton’s Third Law of Motion?',
    answer: 'For every action, there is an equal and opposite reaction. In mathematical form: F_A = -F_B.',
    hint: 'Pairs of forces'
  },
  {
    id: '3',
    question: 'What is the difference between Mitosis and Meiosis?',
    answer: 'Mitosis results in two identical diploid daughter cells (somatic growth), while Meiosis produces four genetically diverse haploid gametes (sexual reproduction).',
    hint: 'Cell division types'
  },
  {
    id: '4',
    question: 'Define the Spacing Effect in cognitive psychology.',
    answer: 'The phenomenon whereby learning is greater when studying is spread out over time (distributed practice) rather than concentrated in a single cram session.',
    hint: 'Ebbinghaus forgetting curve'
  },
  {
    id: '5',
    question: 'What is the Law of Conservation of Energy (First Law of Thermodynamics)?',
    answer: 'Energy can neither be created nor destroyed; it can only transform from one form to another, meaning the total energy of an isolated system remains constant.',
    hint: 'Isolated systems'
  }
]

export const FlashcardGenerator: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'flashcard-generator')!
  const [cards, setCards] = useState<Flashcard[]>(SAMPLE_DECK)
  const [mode, setMode] = useState<'edit' | 'practice'>('practice')

  // Practice state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [knownCount, setKnownCount] = useState(0)
  const [copied, setCopied] = useState(false)

  // Keyboard navigation during practice mode
  useEffect(() => {
    if (mode !== 'practice') return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Space or Enter: Flip card
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        setIsFlipped(prev => !prev)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNextCard()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevCard()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, currentIndex, cards.length])

  const currentCard = cards[currentIndex]

  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
      setShowHint(false)
    }
  }

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
      setShowHint(false)
    }
  }

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowHint(false)
    setKnownCount(0)
  }

  const handleMarkKnown = (known: boolean) => {
    if (known) {
      setKnownCount(prev => prev + 1)
    }
    handleNextCard()
  }

  const handleAddCard = () => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      question: '',
      answer: '',
      hint: ''
    }
    setCards([...cards, newCard])
    setMode('edit')
  }

  const handleUpdateCard = (id: string, field: keyof Flashcard, value: string) => {
    setCards(cards.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const handleDeleteCard = (id: string) => {
    if (cards.length <= 1) return
    setCards(cards.filter(c => c.id !== id))
    if (currentIndex >= cards.length - 1) {
      setCurrentIndex(Math.max(0, cards.length - 2))
    }
  }

  const handleLoadSample = () => {
    setCards(SAMPLE_DECK)
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownCount(0)
    setMode('practice')
  }

  const handleReset = () => {
    setCards([
      { id: '1', question: '', answer: '', hint: '' }
    ])
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownCount(0)
    setMode('edit')
  }

  const handleCopyDeck = async () => {
    const json = JSON.stringify(cards, null, 2)
    const ok = await copyToClipboard(json)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Study Aids"
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onCopyResult={handleCopyDeck}
        isCopied={copied}
        onBack={onBack}
      />

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit">
          <button
            onClick={() => setMode('practice')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
              mode === 'practice'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Practice Mode</span>
          </button>
          <button
            onClick={() => setMode('edit')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
              mode === 'edit'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Edit Cards ({cards.length})</span>
          </button>
        </div>

        {mode === 'practice' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Mastered: {knownCount}/{cards.length}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Card {currentIndex + 1} of {cards.length}
            </span>
          </div>
        )}
      </div>

      {/* PRACTICE MODE */}
      {mode === 'practice' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
          </div>

          {/* Flashcard interactive flip element */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] sm:min-h-[340px] p-6 sm:p-10 rounded-2xl border-2 border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-between text-center cursor-pointer shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition group select-none relative"
          >
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {isFlipped ? 'Answer' : 'Question'}
              </span>
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                Click or Space to flip
              </span>
            </div>

            {/* Card Content */}
            <div className="my-auto py-6">
              <div className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed max-w-xl">
                {isFlipped ? currentCard.answer : currentCard.question || 'Empty Question'}
              </div>

              {!isFlipped && currentCard.hint && showHint && (
                <div className="mt-4 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium inline-block border border-indigo-100 dark:border-indigo-900">
                  Hint: {currentCard.hint}
                </div>
              )}
            </div>

            {/* Card bottom bar */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              {!isFlipped && currentCard.hint && !showHint ? (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    setShowHint(true)
                  }}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Show Hint
                </button>
              ) : <div />}

              <span className="text-[11px] text-slate-400">
                Codepackr Active Recall
              </span>
            </div>
          </div>

          {/* Action buttons (Know it vs Need practice) */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrevCard}
              disabled={currentIndex === 0}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer"
              title="Previous card (Left Arrow)"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleMarkKnown(false)}
              className="flex-1 max-w-xs py-3 px-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-amber-100 transition cursor-pointer"
            >
              <X className="w-4 h-4 text-amber-600" />
              <span>Need Practice</span>
            </button>

            <button
              type="button"
              onClick={() => handleMarkKnown(true)}
              className="flex-1 max-w-xs py-3 px-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 transition cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Know It!</span>
            </button>

            <button
              type="button"
              onClick={handleNextCard}
              disabled={currentIndex === cards.length - 1}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer"
              title="Next card (Right Arrow)"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Keyboard tip */}
          <p className="text-center text-xs text-slate-500">
            Keyboard Shortcuts: <kbd className="font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Space</kbd> to flip, <kbd className="font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">←</kbd> <kbd className="font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">→</kbd> to navigate.
          </p>
        </div>
      )}

      {/* EDIT MODE */}
      {mode === 'edit' && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  Card #{idx + 1}
                </span>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  disabled={cards.length <= 1}
                  className="text-slate-400 hover:text-rose-500 disabled:opacity-30 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Question / Term
                </label>
                <input
                  type="text"
                  value={card.question}
                  onChange={e => handleUpdateCard(card.id, 'question', e.target.value)}
                  placeholder="Enter the concept, term or exam question..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Answer / Definition
                </label>
                <textarea
                  rows={2}
                  value={card.answer}
                  onChange={e => handleUpdateCard(card.id, 'answer', e.target.value)}
                  placeholder="Enter the explanation, formula or definition..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Optional Hint
                </label>
                <input
                  type="text"
                  value={card.hint || ''}
                  onChange={e => handleUpdateCard(card.id, 'hint', e.target.value)}
                  placeholder="Key mnemonic or clue..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleAddCard}
            className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Flashcard</span>
          </button>
        </div>
      )}

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
