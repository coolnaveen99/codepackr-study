export type ToolCategory = 'academic' | 'citations' | 'study-aids' | 'science'

export type ToolBadge = 'New' | 'Popular' | 'Updated'

export interface ToolFaq {
  question: string
  answer: string
}

export interface ToolDefinition {
  id: string
  slug: string
  name: string
  category: ToolCategory
  description: string
  keywords: string[]
  icon: string
  badge?: ToolBadge
  seoTitle: string
  seoDescription: string
  faqs: ToolFaq[]
}

export interface CourseItem {
  id: string
  name: string
  credits: number
  grade: string // e.g. "A", "O", "90"
  score?: number
}

export interface Flashcard {
  id: string
  question: string
  answer: string
  hint?: string
}

export type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'Harvard'
export type SourceType = 'book' | 'journal' | 'website'
