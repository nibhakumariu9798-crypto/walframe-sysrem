---
name: frontend-development
description: Next.js 16 App Router, React 19, Tailwind CSS v4, and accessible shadcn/ui component engineering for the welfare system.
---

# Frontend Development Skill

## Purpose
Governs client-side component construction, responsive UI engineering, theme tokens, and React 19 hook patterns.

## Development Patterns
1. **React 19 State Initialization:**
   - Always avoid synchronous `setState` inside `useEffect`.
   - Prefer lazy state initialization: `const [state, setState] = useState(() => initialValue)`.
2. **Accessible Modals:**
   - Modals must manage focus trapping, backdrop escape handling, and keyboard accessibility.
   - Use standardized `Button` and `Badge` variants for consistency.
3. **Responsive Breakpoints:**
   - Mobile: 1-column layout, horizontal scroll for tables.
   - Tablet: 2-column KPI cards.
   - Desktop: 4-column overview with persistent left navigation.
