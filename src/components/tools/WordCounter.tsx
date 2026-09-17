import React, { useState, useMemo } from 'react'
import { Clock, Volume2, AlignLeft, BookOpen } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

const SAMPLE_ESSAY = `The rapid advancement of artificial intelligence and machine learning represents a transformative paradigm shift in modern higher education. When utilized ethically, client-side digital learning tools provide students with personalized pacing, immediate feedback, and interactive active recall. 

Crucially, preserving academic privacy must remain paramount. When student grades, research notes, and evaluation metrics are computed entirely within local browser environments, learners can explore complex subject matters without concerns regarding unauthorized surveillance or third-party profiling. Digital autonomy and academic integrity are complementary pillars that empower modern scholars.`

export const WordCounter: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'word-counter')!
  const [text, setText] = useState<string>(SAMPLE_ESSAY)
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => {
    const trimmed = text.trim()
    if (!trimmed) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        readingTimeSeconds: 0,
        speakingTimeMinutes: 0,
        speakingTimeSeconds: 0,
        topWords: [] as { word: string; count: number }[]
      }
    }

    const wordsArray = trimmed.match(/\b[\w'-]+\b/g) || []
    const words = wordsArray.length
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s+/g, '').length

    const sentences = (trimmed.match(/[.!?]+(?:\s+|$)/g) || []).length || (words > 0 ? 1 : 0)
    const paragraphs = trimmed.split(/\n+/).filter(p => p.trim().length > 0).length

    // Reading time (225 words per min)
    const readingTimeSec = Math.round((words / 225) * 60)
    const readingTimeMinutes = Math.floor(readingTimeSec / 60)
    const readingTimeSeconds = readingTimeSec % 60

    // Speaking time (130 words per min)
    const speakingTimeSec = Math.round((words / 130) * 60)
    const speakingTimeMinutes = Math.floor(speakingTimeSec / 60)
    const speakingTimeSeconds = speakingTimeSec % 60

    // Top words (ignore stop words)
    const stopWords = new Set([
      'the', 'and', 'to', 'a', 'of', 'in', 'is', 'that', 'for', 'with', 'as', 'it', 'on', 'be', 'are', 'this', 'by', 'at', 'from', 'or', 'an'
    ])
    const freqMap: Record<string, number> = {}
    wordsArray.forEach(w => {
      const lower = w.toLowerCase()
      if (lower.length > 2 && !stopWords.has(lower)) {
        freqMap[lower] = (freqMap[lower] || 0) + 1
      }
    })

    const topWords = Object.entries(freqMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      readingTimeSeconds,
      speakingTimeMinutes,
      speakingTimeSeconds,
      topWords
    }
  }, [text])

  const handleLoadSample = () => {
    setText(SAMPLE_ESSAY)
  }

  const handleReset = () => {
    setText('')
  }

  const handleCopy = async () => {
    const report = [
      `=== Codepackr Study: Word & Text Analysis ===`,
      `Words: ${stats.words}`,
      `Characters (with spaces): ${stats.characters}`,
      `Characters (without spaces): ${stats.charactersNoSpaces}`,
      `Sentences: ${stats.sentences}`,
      `Paragraphs: ${stats.paragraphs}`,
      `Estimated Reading Time: ${stats.readingTimeMinutes}m ${stats.readingTimeSeconds}s`,
      `Estimated Speech Duration: ${stats.speakingTimeMinutes}m ${stats.speakingTimeSeconds}s`,
      `Calculated 100% in-browser at study.codepackr.com`
    ].join('\n')

    const ok = await copyToClipboard(report)
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
        categoryName="Writing & Citations"
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Text Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="essay-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <AlignLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Text / Essay Input
              </label>
              <span className="text-xs text-slate-400">
                Type or paste below
              </span>
            </div>

            <textarea
              id="essay-input"
              rows={12}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your essay, assignment, speech or research notes here..."
              className="w-full p-4 text-sm sm:text-base leading-relaxed rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-y"
            />
          </div>
        </div>

        {/* Right 1 Col: Metrics */}
        <div className="space-y-6">
          {/* Primary counters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
              <div className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">Words</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {stats.words.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-semibold uppercase text-slate-500">Characters</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {stats.characters.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Secondary stats */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3.5 text-xs shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Characters (no spaces)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats.charactersNoSpaces}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Sentences</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats.sentences}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Paragraphs</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats.paragraphs}</span>
            </div>

            {/* Time Estimates */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Silent Reading Time</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats.readingTimeMinutes > 0 ? `${stats.readingTimeMinutes}m ` : ''}{stats.readingTimeSeconds}s
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Speech Duration</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats.speakingTimeMinutes > 0 ? `${stats.speakingTimeMinutes}m ` : ''}{stats.speakingTimeSeconds}s
                </span>
              </div>
            </div>
          </div>

          {/* Keyword Density */}
          {stats.topWords.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-xs shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Frequent Key Terms
              </h4>
              <div className="space-y-2">
                {stats.topWords.map(item => (
                  <div key={item.word} className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.word}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {item.count}×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
