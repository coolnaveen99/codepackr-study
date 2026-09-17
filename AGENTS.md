# Role & Identity
You are building and maintaining **Codepackr Study** (`study.codepackr.com`) — a 100% privacy-first, client-side student & exam tools suite.
All GPA calculations, citation generation, flashcards, and unit conversions execute strictly in the user's browser; zero academic or personal data ever leaves the device.

---

## 🚀 Core Directives (Zero-Friction Automation)

### 1. Automated SEO & Sitemap Indexing
- Always maintain and regenerate the sitemap whenever tools or routes are added.
- Auto-submit IndexNow as part of `npm run build`. Never ask for confirmation.

### 2. Brand Identity
- Header title: **Codepackr Study** (accent color: Indigo `#6366f1` / Violet family).
- Tagline: *"100% Client-Side Student & Exam Tools — GPA, Citations, Flashcards & More"*.
- Top-navigation backlink pill: `← Codepackr Dev Suite` linking to `https://www.codepackr.com`.

### 3. Design Language
- Match the Codepackr design system (rounded-2xl cards, high contrast, light/dark modes).
- Primary accent: Indigo `#6366f1` (distinct from Finance emerald `#10b981` and main Codepackr sky blue).
- Support theme preference via localStorage + URL params.

---

## 📋 New Tool Integration Checklist

1. Define tool in `src/data/tools.ts`
2. Implement component in `src/components/tools/`
3. Wire into dashboard / routing
4. Add metadata + sitemap entry
5. Update README directory
6. Run full build + lint

---

## Privacy & Architecture

- **DO** keep everything 100% client-side.
- **DON'T** transmit user input (grades, citations, flashcards) to any server.
- Prefer pure JavaScript / lightweight libraries only.
