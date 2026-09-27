// Temporary helper — merge these two entries into src/data/tools.ts before the closing ] of TOOLS array.
// Then delete this file.

export const NEW_ACADEMIC_TOOLS = [
  {
    id: 'weighted-grade-calculator',
    slug: 'weighted-grade-calculator',
    name: 'Weighted Grade / Final Score Needed',
    category: 'academic' as const,
    description: 'Calculate what score you need on the final exam or remaining assignments to reach your target grade with multiple weighted items.',
    keywords: ['weighted grade calculator', 'what score do I need', 'final exam calculator', 'target grade', 'grade needed'],
    icon: 'Percent',
    badge: 'New' as const,
    seoTitle: 'Weighted Grade & Final Score Needed Calculator — Codepackr Study',
    seoDescription: 'Find the exact score you need on the final or remaining work to hit your target grade. Supports multiple weighted assignments. 100% client-side.',
    faqs: [
      { question: 'How is the required final score calculated?', answer: 'Required score on remaining weight = (Target overall % × Total weight − Current points) / Remaining weight × 100. Current points = Σ (score/max × weight) for graded items.' },
      { question: 'What if my weights do not add to 100%?', answer: 'Results are still computed using the weights you entered. A warning is shown so you can adjust them.' },
      { question: 'Is any of my grade data uploaded?', answer: 'No. All calculations run entirely in your browser. Nothing is sent to a server.' },
    ],
  },
  {
    id: 'gpa-goal-planner',
    slug: 'gpa-goal-planner',
    name: 'Semester / Cumulative GPA Goal Planner',
    category: 'academic' as const,
    description: 'Forward-looking planner: if I get X in remaining courses, what will my CGPA become? Also shows the minimum average needed to hit a target.',
    keywords: ['gpa goal', 'cgpa planner', 'what if gpa', 'target cgpa', 'remaining credits'],
    icon: 'Target',
    badge: 'New' as const,
    seoTitle: 'GPA Goal Planner — Project CGPA & Required Grades — Codepackr Study',
    seoDescription: 'Project your future CGPA from remaining courses and see the minimum average grade points needed to reach a target. Supports 4.0 and 10-point scales.',
    faqs: [
      { question: 'How is projected CGPA calculated?', answer: 'Projected CGPA = (Current CGPA × Completed credits + Σ Expected points × Credits) / (Completed + Remaining credits).' },
      { question: 'Which grading scale should I choose?', answer: 'Use 10-point for most Indian universities (UGC/AICTE). Use 4.0 for US-style GPAs.' },
      { question: 'Is my data saved online?', answer: 'No. Everything stays in browser memory unless you explicitly copy the result.' },
    ],
  },
]
