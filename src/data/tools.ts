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
      { question: 'How is GPA calculated?', answer: 'GPA is calculated by multiplying the grade point of each course by its credit units, summing the quality points, and dividing by total credit hours: (Σ Grade Points × Credits) / Σ Credits.' },
      { question: 'How is CGPA converted to percentage?', answer: 'For the Indian 10-point scale (CBSE/AICTE), standard percentage conversion is CGPA × 9.5. For universities using direct linear conversion, it is CGPA × 10.' },
      { question: 'Is my transcript or course information saved online?', answer: 'No. Codepackr Study runs 100% in your local browser memory. Zero academic records or personal data are ever sent over the network.' }
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
      { question: 'What is a weighted grade?', answer: 'A weighted grade assigns distinct percentages of importance to different assignments (e.g., Homework 20%, Midterm 30%, Final 50%).' },
      { question: 'How do I calculate what score I need on the final?', answer: 'Target Final Score = (Desired Grade - Current Weighted Score) / Weight of Final Exam.' }
    ]
  },
  {
    id: 'attendance-calculator',
    slug: 'attendance-calculator',
    name: 'Attendance / Percentage Calculator',
    category: 'academic',
    description: 'Track classes attended vs held, compute attendance %, and find how many more classes you need to hit 75% or custom targets.',
    keywords: ['attendance calculator', 'attendance percentage', '75% attendance', 'classes needed', 'college attendance'],
    icon: 'CalendarCheck',
    badge: 'New',
    seoTitle: 'Attendance Percentage Calculator — Codepackr Study',
    seoDescription: 'Calculate college attendance percentage and how many more classes you need to reach 75% or any custom threshold. 100% client-side.',
    faqs: [
      { question: 'How is attendance percentage calculated?', answer: 'Attendance % = (Classes Attended ÷ Classes Held) × 100.' },
      { question: 'How many more classes do I need for 75%?', answer: 'If A = attended, H = held, and T = target (0.75): you need the smallest N such that (A+N)/(H+N) ≥ T, which is N ≥ (T×H − A)/(1 − T).' }
    ]
  },
  {
    id: 'sgpa-percentage',
    slug: 'sgpa-percentage',
    name: 'SGPA → Percentage / Class Rank',
    category: 'academic',
    description: 'Convert SGPA/CGPA to percentage (×9.5 or ×10), estimate class rank bands, and map to First Class / Distinction labels.',
    keywords: ['sgpa to percentage', 'cgpa to percentage', 'class rank', 'distinction', 'first class'],
    icon: 'Trophy',
    badge: 'New',
    seoTitle: 'SGPA to Percentage & Class Rank Converter — Codepackr Study',
    seoDescription: 'Convert SGPA/CGPA to percentage with AICTE ×9.5 or ×10 formulas and estimate class rank labels. Private, in-browser.',
    faqs: [
      { question: 'Which conversion formula should I use?', answer: 'Many Indian universities use Percentage = CGPA × 9.5 (AICTE). Some use ×10. Check your university handbook.' },
      { question: 'What is a typical First Class threshold?', answer: 'Often ≥60% is First Class and ≥75% is Distinction, but exact cutoffs vary by institution.' }
    ]
  },
  {
    id: 'marks-to-grade',
    slug: 'marks-to-grade',
    name: 'Marks to Grade Letter (Custom Scales)',
    category: 'academic',
    description: 'Map marks or percentages to letter grades using US, Indian, or fully custom scale thresholds you define.',
    keywords: ['marks to grade', 'letter grade', 'grade scale', 'custom grading', 'percentage to grade'],
    icon: 'ListOrdered',
    badge: 'New',
    seoTitle: 'Marks to Letter Grade Converter — Custom Scales — Codepackr Study',
    seoDescription: 'Convert marks to letter grades with US, Indian, or custom thresholds. Runs entirely in your browser.',
    faqs: [
      { question: 'Can I define my own scale?', answer: 'Yes. Switch to Custom and set min marks for each letter grade (A+, A, B, etc.).' }
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
      { question: 'Which citation style should I use?', answer: 'APA is commonly used in psychology, education, and sciences. MLA is used in humanities. Chicago in history; Harvard in UK/Australian universities.' }
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
      { question: 'How is reading time calculated?', answer: 'Standard silent reading speed is estimated at 225 words per minute (wpm), while comfortable presentation speaking speed is estimated at 130 words per minute.' }
    ]
  },
  {
    id: 'paraphrase-checker',
    slug: 'paraphrase-checker',
    name: 'Paraphrase Similarity Checker (Local)',
    category: 'citations',
    description: 'Compare original vs rewritten text with local similarity stats (word overlap, Jaccard). No external plagiarism API.',
    keywords: ['paraphrase checker', 'similarity checker', 'rewrite checker', 'jaccard', 'local plagiarism stats'],
    icon: 'GitCompare',
    badge: 'New',
    seoTitle: 'Local Paraphrase Similarity Checker — Codepackr Study',
    seoDescription: 'Compare two texts with client-side word overlap and Jaccard similarity. Your writing never leaves the browser.',
    faqs: [
      { question: 'Is this a plagiarism detector?', answer: 'No. It only compares two texts you paste, locally. It does not search the web or any database.' },
      { question: 'What does Jaccard similarity mean?', answer: 'Jaccard = |intersection of unique words| / |union of unique words|. Higher means more shared vocabulary.' }
    ]
  },
  {
    id: 'essay-outline',
    slug: 'essay-outline',
    name: 'Essay Outline / Thesis Helper',
    category: 'citations',
    description: 'Structure essays with thesis, topic sentences, evidence slots, and conclusion prompts — structure only, no AI writing.',
    keywords: ['essay outline', 'thesis helper', 'essay structure', 'topic sentences', 'argument outline'],
    icon: 'ListTree',
    badge: 'New',
    seoTitle: 'Essay Outline & Thesis Structure Helper — Codepackr Study',
    seoDescription: 'Build a clear essay outline with thesis, body paragraphs, and conclusion structure. 100% local, no AI generation.',
    faqs: [
      { question: 'Does this write my essay for me?', answer: 'No. It only helps you organize thesis, claims, and evidence slots. You write the content.' }
    ]
  },
  {
    id: 'resume-sop-counter',
    slug: 'resume-sop-counter',
    name: 'Resume / SOP Word & Section Counter',
    category: 'citations',
    description: 'Count words by section for resumes and statements of purpose, with soft limits for education, experience, and summary.',
    keywords: ['resume word count', 'sop word count', 'statement of purpose', 'cv length', 'section counter'],
    icon: 'Briefcase',
    badge: 'New',
    seoTitle: 'Resume & SOP Word Counter by Section — Codepackr Study',
    seoDescription: 'Track word counts per resume/SOP section with recommended ranges. Private, client-side only.',
    faqs: [
      { question: 'What is a good SOP length?', answer: 'Many programs prefer 500–1000 words. Always follow the program-specific limit if provided.' }
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
      { question: 'Can I use keyboard shortcuts while reviewing?', answer: 'Yes! Press Spacebar or Enter to flip the card, Right Arrow for Next / Got it Right, and Left Arrow for Previous / Need Practice.' }
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
      { question: 'Does the timer continue when switching browser tabs?', answer: 'Yes, timing is calculated using timestamp delta checks so countdown accuracy is maintained even if backgrounded.' }
    ]
  },
  {
    id: 'quiz-generator',
    slug: 'quiz-generator',
    name: 'Quiz / MCQ Generator from Notes',
    category: 'study-aids',
    description: 'Turn Q/A lines from your notes into a multiple-choice quiz with shuffle, score tracking, and local-only storage.',
    keywords: ['mcq generator', 'quiz from notes', 'practice test', 'multiple choice', 'self quiz'],
    icon: 'HelpCircle',
    badge: 'New',
    seoTitle: 'Quiz & MCQ Generator from Notes — Codepackr Study',
    seoDescription: 'Paste note Q/A pairs and practice as MCQs with score tracking. Everything stays in your browser.',
    faqs: [
      { question: 'What format should notes be in?', answer: 'One pair per line: Question? | Answer  or  Question: Answer' }
    ]
  },
  {
    id: 'spaced-repetition',
    slug: 'spaced-repetition',
    name: 'Spaced-Repetition Review Schedule',
    category: 'study-aids',
    description: 'Plan review dates with a simple SM-2 style interval schedule for topics or flashcard decks you already have.',
    keywords: ['spaced repetition', 'sm-2', 'review schedule', 'anki schedule', 'memory intervals'],
    icon: 'CalendarRange',
    badge: 'New',
    seoTitle: 'Spaced Repetition Review Scheduler — Codepackr Study',
    seoDescription: 'Generate next-review dates using spaced-repetition intervals. Client-side only, no account required.',
    faqs: [
      { question: 'What algorithm is used?', answer: 'A simplified SM-2 style schedule: intervals grow after successful reviews (1d → 3d → 7d → 14d → 30d…).' }
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
      { question: 'Are scientific formulas shown for each conversion?', answer: 'Yes, each conversion display includes the exact multiplication or temperature transformation formula so you can verify your homework calculations.' }
    ]
  },
  {
    id: 'scientific-calculator',
    slug: 'scientific-calculator',
    name: 'Scientific Calculator (Expressions)',
    category: 'science',
    description: 'Evaluate math expressions with sin, cos, tan, log, ln, sqrt, powers, and constants — all in the browser.',
    keywords: ['scientific calculator', 'expression calculator', 'sin cos log', 'math evaluator'],
    icon: 'Calculator',
    badge: 'New',
    seoTitle: 'Scientific Expression Calculator — Codepackr Study',
    seoDescription: 'Evaluate scientific expressions with trig, logs, and powers. 100% client-side.',
    faqs: [
      { question: 'Are angles in degrees or radians?', answer: 'You can toggle Degrees / Radians. Default is degrees for school use.' }
    ]
  },
  {
    id: 'periodic-table',
    slug: 'periodic-table',
    name: 'Periodic Table / Formula Sheet',
    category: 'science',
    description: 'Interactive periodic table with element details plus a quick formula sheet for common physics and chemistry equations.',
    keywords: ['periodic table', 'elements', 'formula sheet', 'chemistry reference', 'physics formulas'],
    icon: 'Atom',
    badge: 'New',
    seoTitle: 'Periodic Table & Formula Sheet — Codepackr Study',
    seoDescription: 'Browse elements and common science formulas offline in your browser.',
    faqs: [
      { question: 'Does this need the network?', answer: 'No. Element data and formulas are bundled in the page.' }
    ]
  },
]

export const CATEGORIES: { id: ToolDefinition['category'] | 'all'; label: string; count: number }[] = [
  { id: 'all', label: 'All Tools', count: TOOLS.length },
  { id: 'academic', label: 'Academic Calculators', count: TOOLS.filter(t => t.category === 'academic').length },
  { id: 'citations', label: 'Writing & Citations', count: TOOLS.filter(t => t.category === 'citations').length },
  { id: 'study-aids', label: 'Study Aids & Timers', count: TOOLS.filter(t => t.category === 'study-aids').length },
  { id: 'science', label: 'Science & Converters', count: TOOLS.filter(t => t.category === 'science').length },
]
