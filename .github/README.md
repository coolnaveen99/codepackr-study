# Codepackr Study — AI Agents, Prompts & Skills

This folder defines how AI assistants and contributors must work on **Codepackr Study** (`study.codepackr.com`).

---

## Quick Start

1. Read the master guide: [`../AI_INSTRUCTIONS.md`](../AI_INSTRUCTIONS.md)
2. Follow the tool SOP: [`skills/add-new-tool.md`](skills/add-new-tool.md)
3. Pass the checklist: [`skills/tool-quality-gate.md`](skills/tool-quality-gate.md)

---

## Agents (Roles)

| Agent | File | Use when |
|-------|------|----------|
| **Core Engineer** | [`agents/core-engineer.yml`](agents/core-engineer.yml) | Building tools, logic, TypeScript, privacy |
| **UI Architect** | [`agents/ui-architect.yml`](agents/ui-architect.yml) | Layout, design system, accessibility, UX completeness |
| **SEO Specialist** | [`agents/seo-specialist.yml`](agents/seo-specialist.yml) | Metadata, slugs, README listings, discoverability |

Each agent points to its detailed prompt in `prompts/`.

---

## Prompts

| Prompt | File |
|--------|------|
| Core Engineer | [`prompts/core-engineer.prompt.md`](prompts/core-engineer.prompt.md) |
| UI Architect | [`prompts/ui-architect.prompt.md`](prompts/ui-architect.prompt.md) |
| SEO Specialist | [`prompts/seo-specialist.prompt.md`](prompts/seo-specialist.prompt.md) |

---

## Skills (SOPs)

| Skill | File | Purpose |
|-------|------|---------|
| **Add New Tool** | [`skills/add-new-tool.md`](skills/add-new-tool.md) | Mandatory step-by-step for every new tool |
| **Tool Quality Gate** | [`skills/tool-quality-gate.md`](skills/tool-quality-gate.md) | Final pass/fail checklist |

---

## Global Rules

- [`copilot-instructions.md`](copilot-instructions.md) — Golden rules for the whole project
- Brand accent: **Indigo `#6366f1`**
- Privacy: 100% client-side only

Never skip the Quality Gate. Never transmit academic data off-device.
