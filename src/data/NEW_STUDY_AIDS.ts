/**
 * Merge into src/data/tools.ts — insert after the mock-exam-builder object,
 * before unit-converters. Then delete this file.
 */
import type { ToolDefinition } from '../types'

export const NEW_STUDY_AIDS: ToolDefinition[] = [
  {
    id: 'feynman-coach',
    slug: 'feynman-coach',
    name: 'Active Recall / Feynman Technique Coach',
    category: 'study-aids',
    description: 'Explain a concept in plain language, then get local keyword-coverage feedback against your key points — no AI, no upload.',
    keywords: ['feynman technique', 'active recall', 'explain concept', 'study coach', 'key points coverage'],
    icon: 'Lightbulb',
    badge: 'New',
    seoTitle: 'Feynman Technique Coach — Active Recall Explainer — Codepackr Study',
    seoDescription: 'Practice the Feynman technique: explain a topic simply and get instant coverage feedback on your key points. 100% client-side.',
    faqs: [
      { question: 'Does this use AI?', answer: 'No. Scoring is deterministic keyword coverage plus a simple length heuristic. Nothing leaves your browser.' },
      { question: 'How are key points matched?', answer: 'Both your key-point list and your explanation are tokenized. A key point counts as covered if a token from the explanation contains or is contained in that key point.' },
      { question: 'What is a good score?', answer: '70+ usually means most key points are present in a reasonably clear explanation. Aim to cover every key point in simple sentences.' },
    ],
  },
  {
    id: 'study-pack-exporter',
    slug: 'study-pack-exporter',
    name: 'Export / Import Study Pack (JSON)',
    category: 'study-aids',
    description: 'Backup and restore all Codepackr Study localStorage data as a single JSON file. Switch devices without losing decks or history.',
    keywords: ['export study data', 'import backup', 'study pack', 'localStorage backup', 'offline transfer'],
    icon: 'Package',
    badge: 'New',
    seoTitle: 'Study Pack Export & Import — Codepackr Study',
    seoDescription: 'Download or restore a JSON backup of your local study data. Never uploaded to any server.',
    faqs: [
      { question: 'What data is exported?', answer: 'Only localStorage keys that start with codepackr_study_. Theme preferences and other sites are not included.' },
      { question: 'Is the file uploaded anywhere?', answer: 'No. Export downloads to your device; import reads a file you choose. Zero network transfer of pack contents.' },
      { question: 'Will import overwrite existing data?', answer: 'Yes, for keys that already exist. Import merges by key name.' },
    ],
  },
]
