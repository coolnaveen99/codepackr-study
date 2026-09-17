# Codepackr Study

[![Live App](https://img.shields.io/badge/Live%20App-study.codepackr.com-6366f1?style=for-the-badge&logo=vercel)](https://study.codepackr.com)
[![Parent Hub](https://img.shields.io/badge/Parent%20Hub-codepackr.com-0ea5e9?style=for-the-badge&logo=github)](https://www.codepackr.com)
[![License](https://img.shields.io/badge/%C2%A9%202026-All%20Rights%20Reserved-6b7280?style=for-the-badge)](https://study.codepackr.com)

**Codepackr Study** is a free collection of browser-based student & exam tools for GPA, grades, citations, flashcards, unit converters, and more.  
Live at **[study.codepackr.com](https://study.codepackr.com)** (coming soon).

All tools run **100% client-side**. Your academic data never leaves your device.

---

## 📚 Planned Tools Directory

### Academic Calculators
- GPA / CGPA Calculator (Indian + international scales)
- Percentage / Grade Calculator
- Grade to Percentage Converter
- Weighted Grade Calculator

### Writing & Citations
- APA Citation Generator
- MLA Citation Generator
- Chicago Citation Generator
- Harvard Citation Generator
- Word / Character Counter + Reading Time

### Study Aids
- Flashcard Generator + Practice Mode
- Simple Spaced Repetition
- Exam Timer
- Score Calculator

### Science Tools
- Unit Converters (Physics, Chemistry, Math)
- Scientific helpers

> Tools will be added following the strict process in [`.github/skills/add-new-tool.md`](.github/skills/add-new-tool.md).

---

## ✨ Features

- **100% Client-Side Privacy** — All processing happens in your browser. Zero academic data is uploaded.
- **Fast Search & Keyboard Navigation** — `Ctrl/Cmd + K` global tool search (planned).
- **Theme Support** — Persistent Light and Dark modes.
- **Deep Linking** — Clean, shareable tool URLs.
- **Offline Capable** — Designed as a Progressive Web App.
- **Responsive** — Works well on mobile and desktop.
- **SEO & AdSense Ready** — Structured for discovery and monetization.

---

## 💜 Brand & Theme

| Item | Value |
|------|-------|
| Accent color | Indigo `#6366f1` |
| Header title | **Codepackr Study** |
| Tagline | *100% Client-Side Student & Exam Tools* |
| Backlink | `← Codepackr Dev Suite` → [codepackr.com](https://www.codepackr.com) |
| Sibling products | [codepackr.com](https://www.codepackr.com) (Dev tools) · [finance.codepackr.com](https://finance.codepackr.com) (Finance calculators) |

The indigo accent deliberately differentiates Study from Finance (emerald) and the main developer suite.

---

## 🚀 Development Quickstart

**Prerequisites:** Node.js 18 or 20+

```bash
git clone https://github.com/coolnaveen99/codepackr-study.git
cd codepackr-study
npm install
npm run dev          # → http://localhost:3000
npm run lint         # TypeScript check
npm run build        # Production build
```

Stack: React 18 + TypeScript + Vite + Tailwind CSS v4.

---

## 📝 Contributing

We welcome contributions that follow the project standards.

**Required reading before adding any tool:**

1. [CONTRIBUTING.md](CONTRIBUTING.md) — Overview and expectations
2. [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — Golden rules
3. [`.github/skills/add-new-tool.md`](.github/skills/add-new-tool.md) — Mandatory step-by-step SOP
4. [`.github/skills/tool-quality-gate.md`](.github/skills/tool-quality-gate.md) — Final checklist every tool must pass

Key rules in short:
- 100% client-side only
- Every tool must include Sample data, Reset, and Copy-to-clipboard
- Indigo brand only
- Lint + build must be clean

Pull requests that skip the quality gate or violate privacy will not be merged.

---

## 🛠️ Project Structure (Current)

```
codepackr-study/
├── .github/
│   ├── agents/          # Role definitions (Core Engineer, UI Architect, SEO)
│   ├── prompts/         # System prompts for each role
│   ├── skills/          # Mandatory SOPs and quality gate
│   └── copilot-instructions.md
├── src/
│   ├── App.tsx          # Main shell + placeholder tool cards
│   ├── main.tsx
│   └── index.css        # Tailwind + indigo brand token
├── public/
├── CONTRIBUTING.md
├── README.md
└── package.json
```

The scaffold is intentionally lean. Full tool registry, routing, PWA, and prerender infrastructure will follow the patterns established in [codepackr-finance](https://github.com/coolnaveen99/codepackr-finance).

---

## ⚖️ Copyright & Privacy

**© 2026 Codepackr Study. All rights reserved.**

**Privacy guarantee:** All calculations, citations, and study tools execute entirely in the user's browser. No academic or personal data is transmitted to or stored on Codepackr servers.

Parent suite: [Codepackr](https://www.codepackr.com)  
Source: [coolnaveen99/codepackr-study](https://github.com/coolnaveen99/codepackr-study)
