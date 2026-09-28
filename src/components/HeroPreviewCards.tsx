import React, { useState, useEffect, useRef } from 'react'
import {
  GraduationCap,
  BookOpen,
  Clock,
  CalendarCheck,
  Layers,
  Percent,
  FileText,
  Trophy,
  Calculator,
  Atom,
  HelpCircle,
  GitCompare,
  CalendarRange,
  ListOrdered,
  Scale,
  ListTree,
  ArrowRight
} from 'lucide-react'

export interface HeroPreviewCard {
  id: string
  title: string
  badge: string
  badgeTone: 'brand' | 'teal' | 'purple' | 'blue' | 'amber' | 'emerald'
  icon: React.ComponentType<{ className?: string }>
  body: React.ReactNode
  footerLeft: string
  cta: string
  targetId?: string // tool ID, slug, or route
}

export interface HeroPreviewCardsProps {
  onSelect?: (card: HeroPreviewCard) => void
  className?: string
}

const TONE_STYLES: Record<
  HeroPreviewCard['badgeTone'],
  {
    badge: string
    iconBg: string
    iconText: string
    accent: string
    accentLight: string
  }
> = {
  brand: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    iconBg: 'bg-indigo-50 group-hover:bg-indigo-600',
    iconText: 'text-indigo-600 group-hover:text-white',
    accent: '#6366f1',
    accentLight: 'rgba(99, 102, 241, 0.15)'
  },
  teal: {
    badge: 'bg-teal-50 text-teal-700 border-teal-200/80',
    iconBg: 'bg-teal-50 group-hover:bg-teal-600',
    iconText: 'text-teal-600 group-hover:text-white',
    accent: '#0d9488',
    accentLight: 'rgba(13, 148, 136, 0.15)'
  },
  purple: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
    iconBg: 'bg-purple-50 group-hover:bg-purple-600',
    iconText: 'text-purple-600 group-hover:text-white',
    accent: '#9333ea',
    accentLight: 'rgba(147, 51, 234, 0.15)'
  },
  blue: {
    badge: 'bg-sky-50 text-sky-700 border-sky-200/80',
    iconBg: 'bg-sky-50 group-hover:bg-sky-600',
    iconText: 'text-sky-600 group-hover:text-white',
    accent: '#0284c7',
    accentLight: 'rgba(2, 132, 199, 0.15)'
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    iconBg: 'bg-amber-50 group-hover:bg-amber-600',
    iconText: 'text-amber-600 group-hover:text-white',
    accent: '#d97706',
    accentLight: 'rgba(217, 119, 6, 0.15)'
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    iconBg: 'bg-emerald-50 group-hover:bg-emerald-600',
    iconText: 'text-emerald-600 group-hover:text-white',
    accent: '#059669',
    accentLight: 'rgba(5, 150, 105, 0.15)'
  }
}

// --------------------------------------------------------------------------
// 1. MiniProgressRing Component
// --------------------------------------------------------------------------
export interface MiniProgressRingProps {
  percentage: number
  label?: string
  sublabel?: string
  tone?: HeroPreviewCard['badgeTone']
  size?: number
}

export const MiniProgressRing: React.FC<MiniProgressRingProps> = ({
  percentage,
  label,
  sublabel,
  tone = 'brand',
  size = 46
}) => {
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, percentage))
  const strokeDashoffset = circumference - (circumference * clamped) / 100
  const color = TONE_STYLES[tone]?.accent || '#6366f1'

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold text-slate-800 tracking-tight">
            {Math.round(clamped)}%
          </span>
        </div>
      </div>
      {(label || sublabel) && (
        <div className="flex flex-col min-w-0">
          {label && <span className="text-xs font-bold text-slate-900 truncate">{label}</span>}
          {sublabel && <span className="text-[11px] text-slate-500 truncate">{sublabel}</span>}
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// 2. MiniSegmentedBar Component
// --------------------------------------------------------------------------
export interface MiniSegmentedBarProps {
  segments: {
    label: string
    value: number
    colorClass: string
  }[]
  total?: number
  height?: string
}

export const MiniSegmentedBar: React.FC<MiniSegmentedBarProps> = ({
  segments,
  total,
  height = 'h-2'
}) => {
  const computedTotal = total ?? segments.reduce((sum, seg) => sum + seg.value, 0)

  return (
    <div className="w-full space-y-1.5">
      <div className={`w-full ${height} bg-slate-100 rounded-full flex overflow-hidden p-0.5 gap-0.5`}>
        {segments.map((seg, idx) => {
          const widthPct = computedTotal > 0 ? (seg.value / computedTotal) * 100 : 0
          return (
            <div
              key={idx}
              className={`h-full rounded-full transition-all duration-500 ${seg.colorClass}`}
              style={{ width: `${widthPct}%` }}
              title={`${seg.label}: ${seg.value}`}
            />
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-500">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${seg.colorClass}`} />
            <span className="font-medium text-slate-600">{seg.label}</span>
            <span className="text-slate-400">({seg.value})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// 3. MiniSparkline Component
// --------------------------------------------------------------------------
export interface MiniSparklineProps {
  data: number[]
  tone?: HeroPreviewCard['badgeTone']
  height?: number
  width?: number
  label?: string
  value?: string
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  tone = 'brand',
  height = 36,
  width = 180,
  label,
  value
}) => {
  const color = TONE_STYLES[tone]?.accent || '#6366f1'
  const fillGradientId = `sparkline-grad-${tone}-${Math.random().toString(36).substring(2, 7)}`

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const paddingY = 4

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 8) + 4
    const y = height - paddingY - ((d - min) / range) * (height - paddingY * 2)
    return { x, y }
  })

  const linePath = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`
  }, '')

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {(label || value) && (
        <div className="flex flex-col min-w-0 pr-1">
          {value && <span className="text-xs font-bold text-slate-900 truncate">{value}</span>}
          {label && <span className="text-[11px] text-slate-500 truncate">{label}</span>}
        </div>
      )}
      <div className="relative flex-shrink-0" style={{ width, height }}>
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${fillGradientId})`} className="animate-fade-chart-area" />
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-line"
          />
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="2.5"
              fill={color}
              stroke="#ffffff"
              strokeWidth="1"
            />
          )}
        </svg>
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// 4. Domain Data Pool (16 Authentic Codepackr Study Tools)
// --------------------------------------------------------------------------
export const HERO_PREVIEW_CARDS_POOL: HeroPreviewCard[] = [
  {
    id: 'gpa-calculator',
    title: 'GPA & CGPA Calculator',
    badge: 'US 4.0 & UGC 10.0',
    badgeTone: 'brand',
    icon: GraduationCap,
    body: (
      <MiniProgressRing
        percentage={96}
        label="3.84 / 4.00 Cumulative GPA"
        sublabel="Summa Cum Laude • 42 Credits"
        tone="brand"
      />
    ),
    footerLeft: '100% private • Instant calculation',
    cta: 'Calculate GPA',
    targetId: 'gpa-calculator'
  },
  {
    id: 'citation-generator',
    title: 'Academic Citation Generator',
    badge: 'APA 7th & MLA 9th',
    badgeTone: 'blue',
    icon: BookOpen,
    body: (
      <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center justify-between text-xs">
        <div className="truncate">
          <span className="font-semibold text-slate-800">Smith, J. (2024).</span>{' '}
          <span className="italic text-slate-600">Cognitive Neurosciences.</span>
        </div>
        <span className="text-[10px] font-mono bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
          APA 7
        </span>
      </div>
    ),
    footerLeft: 'Zero tracking • In-text & Bibliography',
    cta: 'Generate Citation',
    targetId: 'citation-generator'
  },
  {
    id: 'study-timer',
    title: 'Focus & Exam Study Timer',
    badge: 'Pomodoro + Mocks',
    badgeTone: 'purple',
    icon: Clock,
    body: (
      <MiniSparkline
        data={[25, 40, 50, 70, 85, 95, 92]}
        tone="purple"
        value="2h 45m Focused"
        label="4 sessions completed today"
        width={150}
      />
    ),
    footerLeft: 'Delta timestamp timer • Background sync',
    cta: 'Start Timer',
    targetId: 'study-timer'
  },
  {
    id: 'attendance-calculator',
    title: 'Attendance & 75% Tracker',
    badge: 'Safe Margin: +4',
    badgeTone: 'emerald',
    icon: CalendarCheck,
    body: (
      <MiniProgressRing
        percentage={82}
        label="82.2% Attended (37 / 45)"
        sublabel="You can safely skip 4 more classes"
        tone="emerald"
      />
    ),
    footerLeft: 'Minimum bunk & 75% threshold rules',
    cta: 'Check Attendance',
    targetId: 'attendance-calculator'
  },
  {
    id: 'flashcard-generator',
    title: 'Flashcards & Active Recall',
    badge: 'Spaced Review',
    badgeTone: 'amber',
    icon: Layers,
    body: (
      <MiniSegmentedBar
        segments={[
          { label: 'Mastered', value: 42, colorClass: 'bg-emerald-500' },
          { label: 'Review', value: 16, colorClass: 'bg-amber-500' },
          { label: 'Learning', value: 7, colorClass: 'bg-indigo-500' }
        ]}
      />
    ),
    footerLeft: 'Spacebar flip • Local offline storage',
    cta: 'Practice Decks',
    targetId: 'flashcard-generator'
  },
  {
    id: 'grade-calculator',
    title: 'Weighted Final Exam Target',
    badge: 'Need 84% on Final',
    badgeTone: 'teal',
    icon: Percent,
    body: (
      <div className="flex items-center justify-between text-xs bg-teal-50/50 p-2 rounded-xl border border-teal-100">
        <div className="flex flex-col">
          <span className="text-[10px] text-teal-700 uppercase font-semibold">Current Course Avg</span>
          <span className="font-bold text-slate-800 text-sm">88.5% (B+)</span>
        </div>
        <div className="text-right flex flex-col">
          <span className="text-[10px] text-teal-700 uppercase font-semibold">Target Goal: A (90%)</span>
          <span className="font-bold text-teal-700 text-sm">Exam Weight: 35%</span>
        </div>
      </div>
    ),
    footerLeft: 'Exact weighted syllabus formulas',
    cta: 'Target Grade',
    targetId: 'grade-calculator'
  },
  {
    id: 'word-counter',
    title: 'Word & Reading Time Counter',
    badge: '1,450 Words',
    badgeTone: 'blue',
    icon: FileText,
    body: (
      <MiniSparkline
        data={[300, 650, 920, 1180, 1450]}
        tone="blue"
        value="6.4 min Read"
        label="11.2 min Speech • 84 Sentences"
        width={140}
      />
    ),
    footerLeft: 'Real-time syllable & reading speed stats',
    cta: 'Count Words',
    targetId: 'word-counter'
  },
  {
    id: 'sgpa-percentage',
    title: 'SGPA to Percentage & Rank',
    badge: 'AICTE × 9.5',
    badgeTone: 'brand',
    icon: Trophy,
    body: (
      <MiniProgressRing
        percentage={87}
        label="9.20 SGPA = 87.40%"
        sublabel="First Class with Distinction"
        tone="brand"
      />
    ),
    footerLeft: 'Official UGC, AICTE & university scales',
    cta: 'Convert SGPA',
    targetId: 'sgpa-percentage'
  },
  {
    id: 'scientific-calculator',
    title: 'Scientific Math Evaluator',
    badge: 'Rad & Deg Modes',
    badgeTone: 'emerald',
    icon: Calculator,
    body: (
      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100 font-mono text-xs">
        <span className="text-slate-600 truncate">sin(45°) + ln(e²) =</span>
        <span className="font-bold text-emerald-600 ml-2">2.7071</span>
      </div>
    ),
    footerLeft: 'Client-side math parser • No eval()',
    cta: 'Calculate Now',
    targetId: 'scientific-calculator'
  },
  {
    id: 'periodic-table',
    title: 'Periodic Table & Formula Sheet',
    badge: '118 Elements',
    badgeTone: 'purple',
    icon: Atom,
    body: (
      <MiniSegmentedBar
        segments={[
          { label: 'Metals', value: 95, colorClass: 'bg-purple-500' },
          { label: 'Nonmetals', value: 17, colorClass: 'bg-sky-500' },
          { label: 'Metalloids', value: 6, colorClass: 'bg-amber-500' }
        ]}
      />
    ),
    footerLeft: 'Electron config, atomic mass & constants',
    cta: 'Browse Table',
    targetId: 'periodic-table'
  },
  {
    id: 'quiz-generator',
    title: 'Quiz & MCQ Generator',
    badge: 'Self-Test Mode',
    badgeTone: 'teal',
    icon: HelpCircle,
    body: (
      <MiniProgressRing
        percentage={92}
        label="Score: 23 / 25 Correct"
        sublabel="Parsed from raw study notes"
        tone="teal"
      />
    ),
    footerLeft: 'Auto-shuffle & instant score tracking',
    cta: 'Generate Quiz',
    targetId: 'quiz-generator'
  },
  {
    id: 'paraphrase-checker',
    title: 'Paraphrase Similarity Checker',
    badge: 'Local Jaccard Match',
    badgeTone: 'amber',
    icon: GitCompare,
    body: (
      <MiniSegmentedBar
        segments={[
          { label: 'Unique', value: 78, colorClass: 'bg-emerald-500' },
          { label: 'Shared', value: 18, colorClass: 'bg-amber-500' },
          { label: 'Direct', value: 4, colorClass: 'bg-rose-500' }
        ]}
      />
    ),
    footerLeft: '100% private text comparison • No external API',
    cta: 'Compare Text',
    targetId: 'paraphrase-checker'
  },
  {
    id: 'spaced-repetition',
    title: 'Spaced-Repetition Scheduler',
    badge: 'SM-2 Interval',
    badgeTone: 'brand',
    icon: CalendarRange,
    body: (
      <MiniSparkline
        data={[1, 3, 7, 14, 30, 60]}
        tone="brand"
        value="Next: in 3 days"
        label="Interval: 1d → 3d → 7d → 14d"
        width={140}
      />
    ),
    footerLeft: 'Optimized long-term memory retention',
    cta: 'View Schedule',
    targetId: 'spaced-repetition'
  },
  {
    id: 'marks-to-grade',
    title: 'Marks to Grade Letter',
    badge: 'Grade: A+ (94%)',
    badgeTone: 'emerald',
    icon: ListOrdered,
    body: (
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
          <span className="text-slate-500">90 - 100</span>
          <span className="font-bold text-emerald-600">A+ (4.0)</span>
        </div>
        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
          <span className="text-slate-500">80 - 89</span>
          <span className="font-bold text-indigo-600">A (3.7)</span>
        </div>
      </div>
    ),
    footerLeft: 'Custom boundaries & grade thresholds',
    cta: 'Map Grades',
    targetId: 'marks-to-grade'
  },
  {
    id: 'unit-converters',
    title: 'Science & Unit Converters',
    badge: '8 Categories',
    badgeTone: 'blue',
    icon: Scale,
    body: (
      <MiniSegmentedBar
        segments={[
          { label: 'Length', value: 12, colorClass: 'bg-sky-500' },
          { label: 'Energy', value: 8, colorClass: 'bg-indigo-500' },
          { label: 'Temp', value: 6, colorClass: 'bg-teal-500' }
        ]}
      />
    ),
    footerLeft: 'Step-by-step conversion formulas',
    cta: 'Convert Units',
    targetId: 'unit-converters'
  },
  {
    id: 'essay-outline',
    title: 'Essay Outline & Thesis Helper',
    badge: '5-Paragraph Model',
    badgeTone: 'purple',
    icon: ListTree,
    body: (
      <MiniSegmentedBar
        segments={[
          { label: 'Thesis', value: 20, colorClass: 'bg-purple-500' },
          { label: 'Evidence', value: 60, colorClass: 'bg-indigo-500' },
          { label: 'Conclusion', value: 20, colorClass: 'bg-emerald-500' }
        ]}
      />
    ),
    footerLeft: 'Clear structure & topic sentence slots',
    cta: 'Structure Essay',
    targetId: 'essay-outline'
  }
]

// --------------------------------------------------------------------------
// 5. Main HeroPreviewCards Component
// --------------------------------------------------------------------------
export const HeroPreviewCards: React.FC<HeroPreviewCardsProps> = ({ onSelect, className = '' }) => {
  const [slotIndices, setSlotIndices] = useState<[number, number, number]>([0, 1, 2])
  const [isTransitioning, setIsTransitioning] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false
  ])
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)

  const hoveredSlotRef = useRef<number | null>(null)
  hoveredSlotRef.current = hoveredSlot

  const slotIndicesRef = useRef<[number, number, number]>(slotIndices)
  slotIndicesRef.current = slotIndices

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const BASE_INTERVAL = 6200
    const STAGGER_OFFSETS = [0, 1900, 3800]
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const intervals: ReturnType<typeof setInterval>[] = []

    const rotateSlot = (slotIdx: number) => {
      // Guard 1: Hover pause
      if (hoveredSlotRef.current === slotIdx) return

      // Guard 2: Tab visibility
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return

      const currentSlots = slotIndicesRef.current
      const currentCardIdx = currentSlots[slotIdx]
      const otherSlots = currentSlots.filter((_, idx) => idx !== slotIdx)

      // Collision Avoidance: pick candidate not shown in other slots
      let nextCandidate = (currentCardIdx + 1) % HERO_PREVIEW_CARDS_POOL.length
      let attempts = 0
      while (otherSlots.includes(nextCandidate) && attempts < HERO_PREVIEW_CARDS_POOL.length) {
        nextCandidate = (nextCandidate + 1) % HERO_PREVIEW_CARDS_POOL.length
        attempts++
      }

      // Smooth cross-fade transition: 180ms fade out, swap, 40ms fade in
      setIsTransitioning(prev => {
        const next = [...prev] as [boolean, boolean, boolean]
        next[slotIdx] = true
        return next
      })

      const tSwap = setTimeout(() => {
        setSlotIndices(prev => {
          const next = [...prev] as [number, number, number]
          next[slotIdx] = nextCandidate
          return next
        })

        const tFadeIn = setTimeout(() => {
          setIsTransitioning(prev => {
            const next = [...prev] as [boolean, boolean, boolean]
            next[slotIdx] = false
            return next
          })
        }, 40)
        timeouts.push(tFadeIn)
      }, 180)
      timeouts.push(tSwap)
    }

    // Set up staggered initial timers and recurring intervals
    STAGGER_OFFSETS.forEach((offset, slotIdx) => {
      const initTimer = setTimeout(() => {
        rotateSlot(slotIdx)
        const recurring = setInterval(() => {
          rotateSlot(slotIdx)
        }, BASE_INTERVAL)
        intervals.push(recurring)
      }, BASE_INTERVAL + offset)
      timeouts.push(initTimer)
    })

    return () => {
      timeouts.forEach(t => clearTimeout(t))
      intervals.forEach(i => clearInterval(i))
    }
  }, [])

  const staggeredMargins = ['ml-4', 'mr-2', 'ml-6']
  const floatClasses = ['animate-float-card-1', 'animate-float-card-2', 'animate-float-card-3']

  return (
    <div className={`hero-floating-cards relative hidden lg:flex flex-col gap-3.5 w-full select-none ${className}`}>
      {/* Ambient glowing radial gradient blur behind the cards */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-indigo-500/15 rounded-3xl blur-2xl pointer-events-none opacity-80" />

      {/* 3 Stacked Floating Cards */}
      {slotIndices.map((cardIdx, slotIdx) => {
        const card = HERO_PREVIEW_CARDS_POOL[cardIdx]
        const tone = TONE_STYLES[card.badgeTone] || TONE_STYLES.brand
        const Icon = card.icon
        const marginClass = staggeredMargins[slotIdx] || ''
        const floatClass = floatClasses[slotIdx] || ''
        const transitioning = isTransitioning[slotIdx]

        return (
          <div
            key={`slot-${slotIdx}`}
            onMouseEnter={() => setHoveredSlot(slotIdx)}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => onSelect?.(card)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.(card)
              }
            }}
            className={`relative z-10 ${marginClass} ${floatClass}`}
          >
            <div
              className={`p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-indigo-500/25 shadow-xl hover:shadow-2xl hover:scale-[1.035] hover:border-indigo-500 transition-all min-h-[148px] cursor-pointer group flex flex-col justify-between ${
                transitioning ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'
              } duration-200 ease-out`}
            >
              {/* Header: Icon, Title, Badge */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0 ${tone.iconBg} ${tone.iconText}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {card.title}
                  </h3>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 shadow-xs ${tone.badge}`}
                >
                  {card.badge}
                </span>
              </div>

              {/* Body: Elevated micro-visual component */}
              <div className="my-1.5 py-1 px-2 rounded-xl bg-slate-50/70 border border-slate-100/80">
                {card.body}
              </div>

              {/* Footer: Left context note & Right CTA */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 truncate max-w-[210px]">{card.footerLeft}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>{card.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
