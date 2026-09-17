# Skill: Add New Tool to Codepackr Study

**This is the single source of truth.** Every new student/exam tool must follow this SOP exactly. No exceptions.

---

## 1. Architectural Principles (Mandatory)

1. **100% Client-Side** — All logic runs in the browser. Zero network calls with user academic data.
2. **Ephemeral by Default** — Do not auto-save sensitive inputs. Only persist when the user explicitly clicks "Save".
3. **Indigo Brand** — Primary accent is `#6366f1`. Never introduce other brand colors.
4. **Complete UX** — Sample data, Reset, Copy-to-clipboard, and clear error states are required.
5. **SEO Ready** — Tool must be discoverable the moment it ships.

---

## 2. Step-by-Step Implementation Flow

### Step 1 — Register the Tool Definition
**File**: `src/data/tools.ts`

```ts
{
  id: 'gpa-calculator',                    // kebab-case, unique
  name: 'GPA / CGPA Calculator',
  category: 'academic',                    // academic | citations | study-aids | science
  description: 'Calculate GPA and CGPA with Indian and international grading scales.',
  keywords: ['gpa', 'cgpa', 'grade point', 'percentage', 'indian grading'],
  icon: 'GraduationCap',                   // valid Lucide icon name
  badge: 'New'                             // optional: 'New' | 'Popular' | 'Updated'
}
```

### Step 2 — Build the Component
**File**: `src/components/tools/GpaCalculator.tsx` (example)

Required elements inside every tool:
- Title + short description at the top
- **Sample / Demo** button that fills realistic example data
- **Reset / Clear** button that returns to empty state
- **Copy result** button with toast/visual feedback
- Proper labels, ARIA attributes, and keyboard support
- Responsive layout (`rounded-2xl` cards, `rounded-xl` controls)
- Works perfectly in both light and dark mode

Calculation logic should live in pure functions (easy to unit test later).

### Step 3 — Wire Routing & Slugs
**File**: `src/lib/urls.ts` (or equivalent routing map)

- Add canonical slug mapping
- Support any legacy aliases if needed
- Deep linking must work (`/gpa-calculator`)

### Step 4 — SEO Metadata
Add title, description, keywords, and FAQ entries for the tool so prerender / meta generation can pick them up.

### Step 5 — Update Human-Facing Docs
- Add the tool to the categorized list in `README.md` with the live URL.
- Keep the list in the same order as the categories in `tools.ts`.

### Step 6 — Quality Gate
```bash
npm run lint
npm run build
```
Both must pass with **zero** errors before the tool is considered done.

---

## 3. Tool Categories (Study)

| Category     | Purpose                          | Examples                          |
|--------------|----------------------------------|-----------------------------------|
| `academic`   | Grades, GPA, percentages         | GPA Calculator, Grade Converter   |
| `citations`  | Reference generators              | APA, MLA, Chicago, Harvard        |
| `study-aids` | Learning & practice              | Flashcards, Exam Timer, Score Calc|
| `science`    | Unit converters & helpers        | Physics/Chemistry unit converters |

---

## 4. Privacy Checklist (Must Pass)

- [ ] No `fetch` / `axios` / analytics calls containing user grades or text
- [ ] No automatic upload of flashcards or citation data
- [ ] Any localStorage usage is opt-in and clearly labeled
- [ ] Sample data does not contain real personal information

---

## 5. Definition of Done

A tool is **only** considered complete when:
1. It appears in the tools registry
2. It is reachable via clean URL
3. Sample + Reset + Copy work
4. Light & dark mode look correct
5. Mobile layout is usable
6. Lint + build pass
7. README lists it
8. No privacy violations exist
