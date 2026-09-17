import { ToolDefinition } from '../types'

export const TOOLS: ToolDefinition[] = [
  {
    id: 'gpa-calculator',
    slug: 'gpa-calculator',
    name: 'GPA / CGPA Calculator',
    category: 'academic',
    description: 'Calculate semester GPA and cumulative CGPA across 4.0 US, 10.0 Indian UGC/AICTE, and European scales.',
    keywords: ['gpa calculator', 'cgpa calculator', 'grade point average', 'sgpa to cgpa', 'indian grading 10 point', '4.0 scale'],
    icon: 'GraduationCap',
    badge: 'Popular',
    seoTitle: 'GPA & CGPA Calculator — Free, 100% Client-Side Student Tool',
    seoDescription: 'Accurately calculate your semester GPA, cumulative CGPA, and percentage equivalent across US 4.0 and Indian 10.0 scales. Private and fast.',
    faqs: [
      {
        question: 'How is GPA calculated?',
        answer: 'GPA is calculated by multiplying the grade point of each course by its credit units, summing the quality points, and dividing by total credit hours: (Σ Grade Points × Credits) / Σ Credits.'
      },
      {
        question: 'How is CGPA converted to percentage?',
        answer: 'For the Indian 10-point scale (CBSE/AICTE), standard percentage conversion is CGPA × 9.5. For universities using direct linear conversion, it is CGPA × 10.'
      },
      {
        question: 'Is my transcript or course information saved online?',
        answer: 'No. Codepackr Study runs 100% in your local browser memory. Zero academic records or personal data are ever sent over the network.'
      }
    ]
  },
  {
    id: 'grade-calculator',
    slug: 'grade-calculator',
    name: 'Percentage & Grade Calculator',
    category: 'academic',
    description: 'Calculate overall test percentage, final weighted assignment grades, and what you need on the final exam.',
    keywords: ['grade calculator', 'percentage calculator', 'weighted grade', 'marks percentage', 'final exam grade'],
    icon: 'Percent',
    badge: 'Popular',
    seoTitle: 'Percentage & Weighted Grade Calculator — Codepackr Study',
    seoDescription: 'Calculate exam percentages, weighted course averages, and target final exam scores needed to pass or achieve an A.',
    faqs: [
      {
        question: 'What is a weighted grade?',
        answer: 'A weighted grade assigns distinct percentages of importance to different assignments (e.g., Homework 20%, Midterm 30%, Final 50%).'
      },
      {
        question: 'How do I calculate what score I need on the final?',
        answer: 'Target Final Score = (Desired Grade - Current Weighted Score) / Weight of Final Exam.'
      }
    ]
  },
  {
    id: 'citation-generator',
    slug: 'citation-generator',
    name: 'Citation Generator (APA, MLA, Harvard, Chicago)',
    category: 'citations',
    description: 'Format accurate academic references and in-text parenthetical citations for books, journals, and websites.',
    keywords: ['citation generator', 'apa citation', 'mla format', 'chicago manual of style', 'harvard referencing', 'bibliography'],
    icon: 'BookOpen',
    badge: 'New',
    seoTitle: 'Free APA, MLA, Harvard & Chicago Citation Generator — 100% Client-Side',
    seoDescription: 'Generate compliant bibliography citations and in-text citations in APA 7th, MLA 9th, Chicago 17th, and Harvard styles without tracking or ads.',
    faqs: [
      {
        question: 'Which citation style should I use?',
        answer: 'APA is commonly used in psychology, education, and sciences. MLA is used in humanities, literature, and arts. Chicago is common in history and fine arts, while Harvard is widely used in UK and Australian universities.'
      },
      {
        question: 'Does this generator format italics and punctuation properly?',
        answer: 'Yes, book and journal titles are styled with standard italicization, correct quote marks, and standard punctuation.'
      }
    ]
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter & Reading Time',
    category: 'citations',
    description: 'Count words, characters (with and without spaces), sentences, paragraphs, reading time, and speaking time.',
    keywords: ['word counter', 'character count', 'reading time', 'speaking duration', 'essay word limit', 'sentence counter'],
    icon: 'FileText',
    seoTitle: 'Word Counter & Essay Reading Time Estimator — Codepackr Study',
    seoDescription: 'Real-time word, character, sentence, and paragraph counter with estimated silent reading and speech presentation times for essays and assignments.',
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Standard silent reading speed is estimated at 225 words per minute (wpm), while comfortable presentation speaking speed is estimated at 130 words per minute.'
      },
      {
        question: 'Is my essay text stored or analyzed by an external server?',
        answer: 'No! All text statistics are analyzed purely within your browser memory. Nothing is transmitted externally.'
      }
    ]
  },
  {
    id: 'flashcard-generator',
    slug: 'flashcard-generator',
    name: 'Flashcard Generator & Practice',
    category: 'study-aids',
    description: 'Create custom flashcard decks, flip and test recall with keyboard shortcuts, shuffle cards, and track review scores.',
    keywords: ['flashcards', 'flashcard generator', 'study cards', 'exam practice', 'memorization', 'active recall'],
    icon: 'Layers',
    badge: 'New',
    seoTitle: 'Flashcard Generator & Active Recall Practice — Codepackr Study',
    seoDescription: 'Create revision decks, practice active recall with spacebar flips and arrow navigation, and test your exam readiness offline.',
    faqs: [
      {
        question: 'Can I use keyboard shortcuts while reviewing?',
        answer: 'Yes! Press Spacebar or Enter to flip the card, Right Arrow for Next / Got it Right, and Left Arrow for Previous / Need Practice.'
      },
      {
        question: 'Can I export or import decks?',
        answer: 'Yes, you can export your cards to JSON or plain text format, and import them anytime without creating an account.'
      }
    ]
  },
  {
    id: 'unit-converters',
    slug: 'unit-converters',
    name: 'Science & Math Unit Converters',
    category: 'science',
    description: 'Convert length, mass, temperature, pressure, energy, speed, angles, and data units with exact mathematical steps.',
    keywords: ['unit converter', 'physics unit converter', 'chemistry units', 'metric to imperial', 'temperature converter', 'joules to calories'],
    icon: 'Scale',
    seoTitle: 'Science & Math Unit Converter — Codepackr Study',
    seoDescription: 'Convert scientific and engineering units with instant precision, step-by-step conversion equations, and zero trackers.',
    faqs: [
      {
        question: 'Are scientific formulas shown for each conversion?',
        answer: 'Yes, each conversion display includes the exact multiplication or temperature transformation formula so you can verify your homework calculations.'
      }
    ]
  },
  {
    id: 'study-timer',
    slug: 'study-timer',
    name: 'Exam & Pomodoro Study Timer',
    category: 'study-aids',
    description: 'Focus timer designed for revision cycles, practice mock exams, and interval breaks with gentle audio alerts.',
    keywords: ['study timer', 'pomodoro timer', 'exam countdown', 'study session tracker', 'mock test timer'],
    icon: 'Clock',
    seoTitle: 'Exam & Study Focus Timer — Codepackr Study',
    seoDescription: 'Stay disciplined during exam prep with customizable 25/50-minute study blocks, mock exam countdowns, and sound alerts.',
    faqs: [
      {
        question: 'Does the timer continue when switching browser tabs?',
        answer: 'Yes, timing is calculated using timestamp delta checks so countdown accuracy is maintained even if backgrounded.'
      }
    ]
  }
]

export const CATEGORIES: { id: ToolDefinition['category'] | 'all'; label: string; count: number }[] = [
  { id: 'all', label: 'All Tools', count: TOOLS.length },
  { id: 'academic', label: 'Academic Calculators', count: TOOLS.filter(t => t.category === 'academic').length },
  { id: 'citations', label: 'Writing & Citations', count: TOOLS.filter(t => t.category === 'citations').length },
  { id: 'study-aids', label: 'Study Aids & Timers', count: TOOLS.filter(t => t.category === 'study-aids').length },
  { id: 'science', label: 'Science & Converters', count: TOOLS.filter(t => t.category === 'science').length },
]
