import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Bell, CheckCircle2 } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

type TimerMode = 'pomodoro25' | 'deep50' | 'mock60' | 'custom'

export const StudyTimer: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'study-timer')!
  const [mode, setMode] = useState<TimerMode>('pomodoro25')
  const [totalSeconds, setTotalSeconds] = useState(25 * 60)
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  // Gentle audio chime using Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3) // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.8)
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsRunning(false)
            setCompletedSessions(c => c + 1)
            playChime()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning])

  const setTimerDuration = (m: TimerMode, sec: number) => {
    setIsRunning(false)
    setMode(m)
    setTotalSeconds(sec)
    setSecondsRemaining(sec)
  }

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0

  const handleStartPause = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(totalSeconds)
    }
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSecondsRemaining(totalSeconds)
  }

  const handleLoadSample = () => {
    setTimerDuration('pomodoro25', 25 * 60)
    setCompletedSessions(3)
  }

  const handleCopy = async () => {
    const text = `Codepackr Study Focus Session\nCompleted Study Cycles: ${completedSessions}\nMode: ${mode}\nTime Remaining: ${minutes}m ${seconds}s\nTracked 100% in-browser at study.codepackr.com`
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddFiveMin = () => {
    setSecondsRemaining(prev => prev + 300)
    setTotalSeconds(prev => prev + 300)
  }

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Study Aids"
        onLoadSample={handleLoadSample}
        onReset={() => {
          handleReset()
          setCompletedSessions(0)
        }}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit">
        <button
          onClick={() => setTimerDuration('pomodoro25', 25 * 60)}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
            mode === 'pomodoro25'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          25m Pomodoro
        </button>
        <button
          onClick={() => setTimerDuration('deep50', 50 * 60)}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
            mode === 'deep50'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          50m Deep Work
        </button>
        <button
          onClick={() => setTimerDuration('mock60', 60 * 60)}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
            mode === 'mock60'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          60m Mock Exam
        </button>
      </div>

      {/* Timer Display Card */}
      <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center shadow-sm space-y-6">
        {/* Circular or Bar Progress */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Big Digital Clock */}
        <div className="py-6">
          <div className="text-6xl sm:text-7xl font-mono font-extrabold tracking-tight text-slate-900 dark:text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {isRunning ? 'Focus Mode Active' : secondsRemaining === 0 ? 'Session Complete!' : 'Paused'}
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleStartPause}
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleAddFiveMin}
            className="px-3.5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
            title="Add 5 minutes"
          >
            +5m
          </button>
        </div>

        {/* Completed count */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Completed Blocks: <strong className="text-slate-900 dark:text-white font-bold">{completedSessions}</strong></span>
          </div>
          <button
            onClick={playChime}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600 transition cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            Test sound chime
          </button>
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
