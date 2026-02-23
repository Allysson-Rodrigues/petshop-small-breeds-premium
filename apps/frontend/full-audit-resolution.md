# Plan: Full Audit Resolution & UI/UX Enhancement (Small Breeds)

## Context
A recent audit revealed issues in Acessibility, UI Consistency, UX Flow, and Linter configuration. The user wants a complete resolution following best practices.

## Proposed Design System (ui-ux-pro-max)
- **Style:** Claymorphism (Soft 3D, rounded, playful yet professional).
- **Colors:** Primary: #3B82F6, Background: #F8FAFC, Accent/CTA: #F97316.
- **Typography:** Fira Sans (Body), Fira Code (Dashboard/Data).

## Steps

### Phase 1: Environment Stabilization
1. Fix ESLint configuration (Flat Config compatibility).
2. Ensure `tsc` passes.

### Phase 2: Core UX & Strategy (Header & Navigation)
1. Group header items from 13 to max 7.
2. Add skip-to-main-content link in `index.html`.
3. Add `lang="pt-BR"` to `index.html`.

### Phase 3: Accessibility Implementation (Global)
1. Add `onKeyDown` handlers to elements with `onClick`.
2. Add `<label>` elements to all form inputs in `Agendamento.tsx` and `OverviewTab.tsx`.
3. Ensure sufficient contrast on all text elements.

### Phase 4: UI/UX Aesthetic Overhaul (Claymorphism)
1. Update `index.css` with the new design tokens (Shadows, Borders, Radius).
2. Integrate Google Fonts (Fira Sans & Fira Code).
3. Fix "Glassmorphism" failing components (add semi-transparent background).
4. Add `prefers-reduced-motion` media queries for accessibility.

### Phase 5: Verification
1. Run `python3 .agent/scripts/checklist.py .`.
2. Manual verification of mobile view cards.

## Verification Criteria
- [ ] ESLint passes.
- [ ] `accessibility_checker.py` returns significantly fewer (or zero) issues.
- [ ] `ux_audit.py` passes the "Hick's Law" check.
- [ ] Design matches the "Claymorphism" aesthetic.
