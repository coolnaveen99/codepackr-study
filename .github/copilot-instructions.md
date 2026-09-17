# Codepackr Study — Mandatory Architecture & Tool Rules

You are working on **Codepackr Study** (`study.codepackr.com`) — a 100% privacy-first, client-side student & exam tools platform.

Every calculation, citation, flashcard, and converter runs **only** in the browser. Zero academic data ever leaves the device.

---

## 🛡️ GOLDEN RULES (Non-Negotiable)

### 1. 100% Client-Side & Ephemeral Privacy
- **NEVER** send grades, GPA inputs, citation data, flashcard content, or any user academic data to any server, API, analytics event, or database.
- All processing must happen in browser memory (or Web Workers).
- localStorage / IndexedDB is allowed **only** for explicit user-requested features (e.g. "Save my flashcards") and must be clearly labeled.

### 2. Brand & Visual Identity
- Primary accent color: **Indigo `#6366f1`** (and its Tailwind indigo scale).
- Never use Finance emerald (`#10b981`) or arbitrary brand colors.
- Always include the header backlink: `← Codepackr Dev Suite` → `https://www.codepackr.com`.
- Support Light + Dark mode with CSS variables / Tailwind dark: classes.

### 3. Design System Compliance
- Use `rounded-2xl` for cards/containers, `rounded-xl` for inputs/buttons.
- Prefer Lucide React icons only.
- Maintain WCAG AA contrast in both themes.
- Mobile-first responsive layout is mandatory.

### 4. Tool Completeness Standard
Every new tool **must** ship with:
- Clear title + short description
- Sample / Demo data button
- Reset / Clear button
- Copy-to-clipboard (with visual success feedback)
- Helpful empty state and error handling
- Accessible form labels and keyboard support

### 5. SEO & Discoverability (Zero Friction)
- Every tool must have a clean canonical slug.
- Metadata, sitemap entry, and social promotion copy must be updated in the same PR.
- Never leave a tool without proper title, description, and keywords.

### 6. No Half-Finished Tools
- Do not merge a tool that is only partially working.
- If a feature is complex (e.g. full citation styles), ship a solid MVP first and document future enhancements.

---

## 📋 Mandatory Checklist for EVERY New Tool

When adding **any** tool you must complete this sequence (see also `.github/skills/add-new-tool.md`):

1. [ ] Define tool in `src/data/tools.ts` (id, name, category, description, keywords, icon)
2. [ ] Create the component under `src/components/tools/`
3. [ ] Register routing / slug in `src/lib/urls.ts` (or equivalent)
4. [ ] Add SEO metadata
5. [ ] Update README tool directory
6. [ ] Add sample data + Reset + Copy actions
7. [ ] Verify light/dark mode + mobile layout
8. [ ] Run `npm run lint` and `npm run build` with zero errors
9. [ ] Confirm no user academic data is ever transmitted

---

## Architecture Principles

- Prefer pure functions and small focused components.
- Keep calculation logic separate from UI (easier to test).
- Avoid heavy dependencies unless absolutely necessary.
- All user-facing numbers and text must be readable and well-formatted.
