import { TOOLS } from '../data/tools'
import { ToolDefinition } from '../types'

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  if (!slug) return undefined
  const clean = slug.replace(/^#\/?/, '').replace(/^\//, '').split('?')[0].split('#')[0].toLowerCase()
  return TOOLS.find(t => t.slug.toLowerCase() === clean || t.id.toLowerCase() === clean)
}

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find(t => t.id === id)
}

export function getToolPath(tool: ToolDefinition): string {
  return `#/${tool.slug}`
}

export function getCurrentSlug(): string {
  if (typeof window === 'undefined') return ''
  // Support both hash routing #/slug and path routing /slug
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (hash) {
    return hash.split('?')[0].split('#')[0]
  }
  const path = window.location.pathname.replace(/^\//, '')
  return path.split('?')[0].split('#')[0]
}
