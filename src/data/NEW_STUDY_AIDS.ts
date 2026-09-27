/**
 * Additional study-aids / citations tools composed into tools.ts
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
  {
    id: 'local-reference-manager',
    slug: 'local-reference-manager',
    name: 'Local Reference Manager',
    category: 'citations',
    description: 'Build bibliography entries offline with APA, MLA, Chicago, and Harvard styles, plus BibTeX export. Nothing leaves your browser.',
    keywords: ['reference manager', 'bibliography', 'bibtex', 'apa', 'mla', 'citation library', 'local citations'],
    icon: 'Library',
    badge: 'New',
    seoTitle: 'Local Reference Manager — APA MLA Chicago Harvard — Codepackr Study',
    seoDescription: 'Create and format academic references offline. Export BibTeX. 100% client-side reference manager.',
    faqs: [
      { question: 'Can I import BibTeX files?', answer: 'This version focuses on manual entry and BibTeX export. Full BibTeX import is a planned enhancement.' },
      { question: 'Are styles 100% style-guide perfect?', answer: 'They follow common student patterns for APA 7, MLA 9, Chicago author-date, and Harvard. Always double-check against your institution guide for edge cases.' },
      { question: 'Is my library uploaded?', answer: 'No. The session library lives only in memory for this tab unless you copy or export text yourself.' },
    ],
  },
  {
    id: 'anki-bridge',
    slug: 'anki-bridge',
    name: 'Anki Bridge (Import / Export Deck)',
    category: 'study-aids',
    description: 'Import and export flashcard decks as Anki-compatible tab-separated text. Edit cards locally and download for Anki File → Import.',
    keywords: ['anki', 'anki import', 'anki export', 'flashcard tsv', 'deck export', 'spaced repetition anki'],
    icon: 'Layers',
    badge: 'New',
    seoTitle: 'Anki Bridge — Import & Export Flashcard Decks — Codepackr Study',
    seoDescription: 'Convert between pasted TSV/CSV and Anki-ready tab-separated decks. Edit cards in the browser. Nothing is uploaded.',
    faqs: [
      { question: 'How do I import into Anki?', answer: 'Download the .txt file, then in Anki use File → Import. Set the field separator to Tab and map columns to Front, Back, and Tags.' },
      { question: 'Does this support .apkg files?', answer: 'Not yet. Anki’s .apkg is a binary package. Use tab-separated text import/export, which Anki supports natively.' },
      { question: 'Where are cards stored?', answer: 'Optionally in localStorage (codepackr_study_anki_deck). Export downloads stay on your device only.' },
    ],
  },
]
