# Codepackr Study — Complete AI Instructions

**Purpose of this document**  
This is the single source of truth for any AI (or human) building or extending **Codepackr Study** (`study.codepackr.com`).  
Follow every rule below. Do not invent alternative architectures or skip steps.

---

## 1. Project Identity

| Item | Value |
|------|-------|
| Product name | Codepackr Study |
| Live URL | https://study.codepackr.com |
| Repo | https://github.com/coolnaveen99/codepackr-study |
| Parent brand | Codepackr (https://www.codepackr.com) |
| Sibling | finance.codepackr.com (emerald theme) |
| Accent color | **Indigo `#6366f1`** |
| Stack | React 18 + TypeScript + Vite + Tailwind CSS v4 |
| Privacy model | 100% client-side. Zero academic data leaves the browser. |

**Tagline**  
*100% Client-Side Student & Exam Tools — GPA, Citations, Flashcards & More*

**Header backlink (mandatory on every page)**  
`← Codepackr Dev Suite` → `https://www.codepackr.com` (open in new tab)

---

## 2. Golden Rules (Non-Negotiable)

1. **100% Client-Side**  
   Never send grades, GPA inputs, citation data, flashcards, or any user academic content to any server, API, or analytics event.

2. **Ephemeral by Default**  
   Do not auto-save sensitive data. localStorage / IndexedDB only when the user explicitly clicks “Save” and it is clearly labeled.

3. **Indigo Brand Only**  
   Primary accent is `#6366f1` and the Tailwind indigo scale. Never use Finance emerald (`#10b981`) or random brand colors.

4. **Complete Tools Only**  
   Every tool must ship with:
   - Sample / Demo data button
   - Reset / Clear button
   - Copy-to-clipboard with visual feedback
   - Helpful empty & error states
   - Proper labels + keyboard support

5. **Quality Gate is Mandatory**  
   Before considering any tool finished, the checklist in `.github/skills/tool-quality-gate.md` must be 100% green.

6. **No Half-Finished Work**  
   Do not leave incomplete tools in the codebase.

---

## 3. Mandatory Files to Read Before Writing Code

| Priority | File | Why |
|----------|------|-----|
| 1 | `.github/copilot-instructions.md` | Master golden rules |
| 2 | `.github/skills/add-new-tool.md` | Exact SOP for adding any tool |
| 3 | `.github/skills/tool-quality-gate.md` | Final pass/fail checklist |
| 4 | `CONTRIBUTING.md` | Human + AI contribution rules |
| 5 | `AGENTS.md` | Role & branding summary |

---

## 4. Target Architecture (Evolve Toward This)

The current repo is a lean scaffold. Evolve it toward the same production patterns used in `coolnaveen99/codepackr-finance`:

```
src/
├── components/
│   ├── tools/              # One file (or folder) per tool
│   ├── layout/             # Header, Footer, Shell
│   ├── ui/                 # Reusable buttons, cards, inputs
│   └── HeroPreviewCards.tsx (optional later)
├── data/
│   └── tools.ts            # Single source of truth for tool registry
├── lib/
│   ├── urls.ts             # Slug ↔ tool ID mapping
│   └── utils.ts            # Pure helpers
├── App.tsx
├── main.tsx
└── index.css               # Tailwind + --brand: #6366f1
```

**Key principles**
- Tool registry lives in `src/data/tools.ts`
- Calculation logic is pure functions (easy to test)
- UI components stay presentational
- Routing uses clean slugs (`/gpa-calculator`)

---

## 5. How to Add a New Tool (Exact Sequence)

Follow `.github/skills/add-new-tool.md` precisely. Summary:

### Step 1 — Register
Add entry to `src/data/tools.ts`:

```ts
{
  id: 'gpa-calculator',
  name: 'GPA / CGPA Calculator',
  category: 'academic',          // academic | citations | study-aids | science
  description: 'Calculate GPA and CGPA with Indian and international grading scales.',
  keywords: ['gpa', 'cgpa', 'grade point', 'percentage'],
  icon: 'GraduationCap',         // valid Lucide icon
  badge: 'New'                   // optional
}
```

### Step 2 — Build Component
Create `src/components/tools/GpaCalculator.tsx` (example).

Required UI elements:
- Title + short description
- Sample / Demo button
- Reset / Clear button
- Copy result button + feedback
- Responsive `rounded-2xl` cards, `rounded-xl` controls
- Works in light + dark mode

### Step 3 — Routing
Map id ↔ slug in `src/lib/urls.ts` (or equivalent).

### Step 4 — SEO Metadata
Add title, description, keywords so prerender / meta generation can pick them up.

### Step 5 — Docs
Update the tool list in `README.md`.

### Step 6 — Quality Gate
Run the full checklist in `.github/skills/tool-quality-gate.md`.

### Step 7 — Verify
```bash
npm run lint
npm run build
```
Both must pass with zero errors.

---

## 6. Tool Categories

| Category     | Purpose                       | Examples                              |
|--------------|-------------------------------|---------------------------------------|
| `academic`   | Grades, GPA, percentages      | GPA Calculator, Grade Converter       |
| `citations`  | Reference generators           | APA, MLA, Chicago, Harvard            |
| `study-aids` | Learning & practice           | Flashcards, Exam Timer, Score Calc    |
| `science`    | Unit converters & helpers     | Physics / Chemistry unit converters   |

---

## 7. Priority Order for Building Tools

Build in this order for maximum value:

1. **GPA / CGPA Calculator** (highest search volume)
2. **Percentage / Grade Calculator**
3. **Word / Character Counter + Reading Time**
4. **APA + MLA Citation Generators** (start with one style, then expand)
5. **Flashcard Generator**
6. **Unit Converters**
7. Remaining tools

---

## 8. Design Tokens (Must Use)

```css
:root {
  --brand: #6366f1;        /* Indigo */
  --brand-hover: #4f46e5;
}
```

- Cards / containers → `rounded-2xl`
- Inputs / buttons → `rounded-xl`
- Icons → only `lucide-react`
- Support both light and dark themes with proper contrast (WCAG AA)

---

## 9. Privacy Checklist (Must Pass for Every Tool)

- [ ] No `fetch` / network calls containing user academic data
- [ ] No analytics events that include form values
- [ ] localStorage usage is opt-in and clearly labeled
- [ ] Sample data contains no real personal information

---

## 10. Definition of Done for Any Tool

A tool is finished **only** when all of the following are true:

1. Registered in `src/data/tools.ts`
2. Reachable via clean URL
3. Sample + Reset + Copy work correctly
4. Light & dark mode look correct
5. Mobile layout is usable
6. `npm run lint` and `npm run build` pass
7. Listed in `README.md`
8. Privacy checklist is fully green
9. Quality Gate (`.github/skills/tool-quality-gate.md`) is fully green

---

## 11. How to Expand the Project from Current Scaffold

Current state is a minimal working shell. Recommended evolution path:

1. Create `src/data/tools.ts` and basic tool registry
2. Create layout components (Header with backlink, Footer)
3. Implement first tool (GPA Calculator) following the SOP above
4. Add simple client-side routing (or keep state-based switching at first)
5. Add search (Ctrl/Cmd+K) later
6. Add PWA manifest + service worker when core tools exist
7. Add sitemap / prerender / IndexNow scripts when ready for production SEO (mirror finance repo patterns)

Always keep the indigo brand and privacy rules intact while expanding.

---

## 12. Reference Implementation

For advanced patterns (tool registry, routing, prerender, sitemap, hero cards, etc.) study:

- https://github.com/coolnaveen99/codepackr-finance

Adapt those patterns, but **re-theme to indigo** and **replace finance-specific logic** with student/exam logic.

---

## 13. Final Instruction to Any AI

- Never skip the Quality Gate.
- Never transmit academic data off-device.
- Never change the brand color away from indigo.
- Never merge incomplete tools.
- When in doubt, re-read `.github/skills/add-new-tool.md` and this document.

Build carefully. Protect privacy. Keep quality high.
