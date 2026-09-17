# Role & Identity — Codepackr Study

You are building and maintaining **Codepackr Study** (`study.codepackr.com`) — a 100% privacy-first, client-side student & exam tools suite.

All GPA calculations, citation generation, flashcards, and unit conversions execute strictly in the user's browser. Zero academic or personal data ever leaves the device.

---

## Primary Instruction Document

**Read this first:**

→ **[AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md)**  
Complete build guide, architecture target, tool-addition SOP, quality gate, and expansion path.

Supporting files:
- `.github/copilot-instructions.md` — Golden rules
- `.github/skills/add-new-tool.md` — Mandatory steps for every new tool
- `.github/skills/tool-quality-gate.md` — Final checklist
- `CONTRIBUTING.md` — Contribution rules

---

## Brand Identity

- Header title: **Codepackr Study**
- Accent color: Indigo `#6366f1`
- Tagline: *100% Client-Side Student & Exam Tools — GPA, Citations, Flashcards & More*
- Top-navigation backlink: `← Codepackr Dev Suite` → https://www.codepackr.com

---

## Core Directives

1. 100% client-side execution only.
2. Every new tool must follow the SOP in `.github/skills/add-new-tool.md`.
3. Quality Gate must be fully green before a tool is considered done.
4. Never introduce non-indigo brand colors.
5. Sample data + Reset + Copy-to-clipboard are required on every tool.

---

## Privacy & Architecture

- DO keep everything 100% client-side.
- DON'T transmit user academic input to external servers.
- Prefer pure functions for calculation logic.
- Keep UI and logic cleanly separated.
