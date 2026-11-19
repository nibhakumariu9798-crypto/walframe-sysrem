# UI/UX DESIGN SYSTEM: AI-DRIVEN SMART WELFARE RESOURCE MANAGEMENT SYSTEM

**Document Purpose:** Frontend style guide, accessibility compliance specifications, component tokens, and responsive layout rules.  
**Version:** 1.0.0  

---

## 1. Visual Hierarchy & Theme Principles

The user interface follows a modern, clean, government-grade aesthetic characterized by subtle borders, high contrast ratios, semantic status colors, and dark-mode compatibility.

### 1.1 Color Palette & Semantic Tokens

| Token Family | Tailored Hex / Tailwind Class | Semantic Context |
|---|---|---|
| **Primary Brand** | `indigo-600` (`#4f46e5`) | Primary actions, navigation highlights, active states |
| **Success / Validated** | `emerald-600` (`#059669`) | Verified institutions, safe inventory levels, active donors |
| **Warning / Attention** | `amber-500` (`#f59e0b`) | Pending state inspections, moderate health scores (40-69) |
| **Danger / Critical** | `rose-600` (`#e11d48`) | Acute health triage ($\ge 70$), stockouts, rejected facilities |
| **Informational** | `blue-600` (`#2563eb`) | System advisories, HIPAA privacy notices, user hints |
| **Neutral Backgrounds** | `slate-50` / `slate-900` | Light mode surface / Dark mode canvas |
| **Card Surfaces** | `white` / `slate-900` | Content containers with `border-slate-200` / `slate-800` |

### 1.2 Typography Hierarchy
Natively resolved through high-performance system font stacks:
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```
- **Page Titles:** `text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100`
- **Section Headers:** `text-base font-semibold text-slate-800 dark:text-slate-200`
- **Body Text:** `text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed`
- **Technical Codes & Identifiers:** `font-mono text-[11px] text-slate-500`

---

## 2. Standardized UI Components

### 2.1 Buttons (`src/components/ui/button.tsx`)
- **Primary:** Solid `bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs`
- **Secondary:** Subtle `bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100`
- **Outline:** Clean border `border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800`
- **Danger:** High-visibility `bg-rose-600 text-white hover:bg-rose-700`
- **Ghost:** Borderless icon/link `hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600`

### 2.2 Status Badges (`src/components/ui/badge.tsx`)
Standardized variants: `default`, `secondary`, `outline`, `success`, `warning`, `danger`, `indigo`. All badges maintain rounded pill shapes (`rounded-full`) with crisp `text-[10px]` uppercase/capitalized lettering.

### 2.3 Interactive Modals (`src/components/modals/*`)
Built with accessible backdrops, autofocus isolation, smooth opacity transitions, and explicit close triggers:
- `RegisterInstitutionModal`
- `AdmitBeneficiaryModal`
- `RecordDonationModal`
- `RestockInventoryModal`

---

## 3. Mandatory Component States

Every page and dynamic list must implement all 4 UX states:
1. **Loading State:** Smooth pulsing skeletons (`animate-pulse bg-slate-200 dark:bg-slate-800`) matching the exact layout dimensions.
2. **Empty State:** High-contrast contextual icon, clear headline (e.g., "No beneficiaries registered yet"), descriptive guidance, and an actionable primary CTA button.
3. **Error State:** Bordered callout container with danger iconography, understandable error message, and a "Retry" or "Reset Filters" action.
4. **Success State:** Non-intrusive green alert banners or toasts confirming persistent database record creation.

---

## 4. Accessibility & Responsive Breakpoints

- **Contrast Ratios:** All body text meets or exceeds WCAG 2.1 AA standards (minimum 4.5:1 contrast against background).
- **Keyboard Navigation:** All interactive elements feature visible focus rings (`focus-visible:ring-2 focus-visible:ring-indigo-500`).
- **Responsive Layout:**
  - **Mobile (< 640px):** Single-column stacked cards, scrollable horizontal tables (`overflow-x-auto`), collapsible sidebar drawer.
  - **Tablet (640px – 1024px):** 2-column KPI grids, condensed search filters.
  - **Desktop (> 1024px):** Full 4-column KPI overview, persistent left navigation, dual-pane research layouts.
