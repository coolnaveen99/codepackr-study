# Skill: Tool Quality Gate

Use this skill **before** declaring any new tool finished.

## Mandatory Checks

### Privacy
- [ ] Zero network requests that include user academic data
- [ ] No third-party scripts receiving form values
- [ ] localStorage usage is explicit and optional

### UX Completeness
- [ ] Sample / Demo button present and fills realistic data
- [ ] Reset / Clear returns the tool to initial empty state
- [ ] Copy-to-clipboard works and shows feedback
- [ ] Empty states and error messages are helpful
- [ ] All interactive elements have visible focus states

### Visual & Brand
- [ ] Uses Indigo accent (`#6366f1` / Tailwind indigo)
- [ ] `rounded-2xl` cards, `rounded-xl` controls
- [ ] Perfect contrast in both light and dark themes
- [ ] Mobile layout does not break

### Technical
- [ ] TypeScript compiles with zero errors
- [ ] No console errors in browser
- [ ] Calculation logic is pure and testable
- [ ] Tool is registered in `src/data/tools.ts`
- [ ] Slug and routing work
- [ ] README directory updated

### Accessibility
- [ ] Form inputs have associated labels
- [ ] Buttons have accessible names
- [ ] Keyboard navigation works
- [ ] Color is not the only way to convey meaning

If any checkbox is unchecked, the tool is **not ready** to merge.
