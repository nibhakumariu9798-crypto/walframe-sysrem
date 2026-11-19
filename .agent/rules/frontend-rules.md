# FRONTEND ENGINEERING RULES

1. **Framework & Architecture:**
   - Stack: Next.js 16 with App Router, React 19, TypeScript strict mode.
   - Separate Client Components (`"use client"`) from Server Components. Keep client wrappers minimal.
   - Use modular components; avoid giant monolithic page files.

2. **Styling & Design System:**
   - Use Tailwind CSS v4 and standard theme tokens defined in `src/app/globals.css`.
   - Ensure complete light mode and dark mode visual harmony.
   - Avoid network-dependent external Google Fonts; use system font stacks for reliable offline compilation.

3. **User Experience States:**
   - Every data-driven screen must implement:
     a) Loading skeleton state
     b) Empty state with actionable call-to-action
     c) Error state with recovery button
     d) Success feedback

4. **React 19 & Hook Rules:**
   - Do not invoke synchronous `setState` directly inside the body of a `useEffect` to avoid cascading render cycles.
   - Initialize state directly from props, query parameters, or local storage using the function initializer: `useState(() => ...)`.
