# Contributing to Codepackr Study

Thank you for helping improve **Codepackr Study** (`study.codepackr.com`).

This project is part of the Codepackr family of 100% client-side, privacy-first tools.  
Every contribution must protect user privacy and maintain consistent quality.

---

## Before You Start

Please read these files carefully:

| Document | Purpose |
|----------|---------|
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | Master golden rules for the entire project |
| [`.github/skills/add-new-tool.md`](.github/skills/add-new-tool.md) | **Mandatory** step-by-step process for adding any new tool |
| [`.github/skills/tool-quality-gate.md`](.github/skills/tool-quality-gate.md) | Final checklist that every tool must pass |

These rules are non-negotiable. Tools that skip steps or violate privacy will not be accepted.

---

## Golden Rules (Summary)

1. **100% Client-Side**  
   Grades, citations, flashcards, and all academic data must stay in the browser. Never send them to any server or analytics endpoint.

2. **Complete Tools Only**  
   Every tool must ship with:
   - Sample / Demo data button
   - Reset / Clear button
   - Copy-to-clipboard with visual feedback
   - Clean empty and error states

3. **Brand Consistency**  
   - Accent color: Indigo `#6366f1`
   - Always include the header backlink to [codepackr.com](https://www.codepackr.com)
   - Support both Light and Dark modes

4. **Quality Gate**  
   Before opening a PR, run through the full checklist in `.github/skills/tool-quality-gate.md`.

---

## How to Add a New Tool

Follow the exact sequence in [`.github/skills/add-new-tool.md`](.github/skills/add-new-tool.md):

1. Register the tool in `src/data/tools.ts`
2. Build the component under `src/components/tools/`
3. Wire routing / slug
4. Add SEO metadata
5. Update the tool list in `README.md`
6. Pass `npm run lint` and `npm run build`
7. Confirm the Quality Gate is fully green

---

## Development Setup

```bash
git clone https://github.com/coolnaveen99/codepackr-study.git
cd codepackr-study
npm install
npm run dev
```

- **Lint**: `npm run lint`
- **Build**: `npm run build`

Both must pass with zero errors before submitting a pull request.

---

## Pull Request Guidelines

- Keep PRs focused (one tool or one clear improvement).
- Reference the Quality Gate checklist in the PR description.
- Do not include half-finished tools.
- Describe any intentional deviations (there should be almost none).

---

## Questions?

Open an issue or start a discussion.  
When in doubt, follow the skills in `.github/skills/` — they are the source of truth.

Thank you for keeping Codepackr Study private, fast, and high-quality.
