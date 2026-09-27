import { ToolDefinition } from '../types'
import { CORE_TOOLS } from './tools-core'
import { NEW_STUDY_AIDS } from './NEW_STUDY_AIDS'

export const TOOLS: ToolDefinition[] = [
  ...CORE_TOOLS,
  ...NEW_STUDY_AIDS,
]

export const CATEGORIES: { id: ToolDefinition['category'] | 'all'; label: string; count: number }[] = [
  { id: 'all', label: 'All Tools', count: TOOLS.length },
  { id: 'academic', label: 'Academic Calculators', count: TOOLS.filter(t => t.category === 'academic').length },
  { id: 'citations', label: 'Writing & Citations', count: TOOLS.filter(t => t.category === 'citations').length },
  { id: 'study-aids', label: 'Study Aids & Timers', count: TOOLS.filter(t => t.category === 'study-aids').length },
  { id: 'science', label: 'Science & Converters', count: TOOLS.filter(t => t.category === 'science').length },
]
