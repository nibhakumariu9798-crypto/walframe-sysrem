# PROJECT MEMORY: AI-DRIVEN SMART WELFARE RESOURCE MANAGEMENT SYSTEM

**Document Purpose:** Canonical Persistent Memory and Research Translation Map  
**Workspace Root:** `c:\Users\Nibha kumari gupta\Desktop\mca nibha\practice of project\Wellfare System`  
**Current Framework Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Supabase + Python FastAPI + Tailwind CSS  
**Last Updated:** Phase 0 Completion  

---

## 1. Domain Scope & Stakeholder Definitions

The system addresses critical operational challenges in child care homes (orphanages) and elder care homes (old age homes):
- **Orphanages:** Focus on pediatric nutrition, seasonal clothing kits, educational materials, and immunization records.
- **Old Age Homes:** Focus on geriatric nutrition, chronic illness management (hypertension, diabetes), mobility assistance, and prescription adherence.
- **Integrated Care Facilities:** Mixed environments housing both vulnerable children and senior citizens.

### 7 Stakeholder Personas
1. **Government (`government`):** State Department of Women & Child Development / Social Welfare. Audits institutions, approves state verification licenses, monitors regional safety.
2. **Institution Superintendent (`institution`):** Manages local resident rosters, requests supplies, records inventory changes, logs facility issues.
3. **NGO Worker (`ngo`):** Distributes resources across multiple care homes, plans community food drives, coordinates relief.
4. **Doctor (`doctor`):** Licensed physician examining resident vitals, reviewing automated health-risk triage alerts, signing off on medical logs.
5. **Donor (`donor`):** Individual or corporate donor contributing monetary funds or physical goods; tracks verifiable impact receipts.
6. **Volunteer (`volunteer`):** Community volunteer providing tutoring, companionship, or logistical delivery support.
7. **System Administrator (`admin`):** Technical administrator managing database migrations, role provisioning, and audit oversight.

---

## 2. Technical Stack & Architecture Contract

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend                  │
│       (App Router, React 19, Strict TypeScript)        │
│              Tailwind CSS v4 + shadcn/ui               │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
       REST / WebSocket          HTTP REST (JSON)
                │                        │
┌───────────────▼────────┐      ┌────────▼───────────────┐
│     Supabase Cloud     │      │   FastAPI AI Service   │
│  - Auth (SSR Cookie)   │      │   (Python, Scikit,     │
│  - PostgreSQL 15 (RLS) │      │    XGBoost, Uvicorn)   │
│  - 12 Tables & Triggers│      │   - Demand Forecast    │
│  - Audit Logs          │      │   - Health-Risk Triage │
└────────────────────────┘      └────────────────────────┘
```

### Dual-Mode AI Adapter Pattern
- **Abstract Interface:** Defined in `src/lib/ai/types.ts` (`AIAdapterInterface`).
- **Mode 1 (`demo`):** Local deterministic heuristic implementation (`src/lib/ai/demo-adapter.ts`). Executes client/server side without network dependencies. Explicitly flags `is_synthetic: true`.
- **Mode 2 (`remote`):** HTTP client calling external Python FastAPI microservice at `http://localhost:8000` (`src/lib/ai/remote-adapter.ts`). If unreachable, seamlessly falls back to `DemoAIAdapter` to prevent crashes.

---

## 3. Academic Integrity & Medical Safety Boundaries

1. **Non-Fabrication Policy (Rule 4 & 16):**
   - Untrained or simulated models must never report fabricated metrics (e.g., claiming 99.4% accuracy or 0.01 MAE).
   - Unvalidated values in benchmarks are marked `TBD` or `XX.XX` until empirical training runs are completed.
2. **Clinical Decision Support Boundary (Rule 6):**
   - Health-risk outputs are classified as clinical decision-support triage scores only and must never be presented as an autonomous medical diagnosis or prescription.
   - Any resident receiving a composite priority score $\ge 70$ triggers an immediate high-priority alert for human doctor evaluation.
3. **Medical Privacy & Least Privilege (Rule 5):**
   - Resident medical vitals (blood pressure, blood sugar, medications) are strictly isolated behind PostgreSQL Row Level Security (RLS) accessible only to users with `role = 'doctor'` or `role = 'admin'`. Non-medical personnel access safe demographic rosters only.

---

## 4. Current State of Development

- **Phase 0 (Foundation & Blueprints):** Completed and documented.
- **Phase 1 (Database Setup, Auth & Granular RBAC):** Completed and verified.
  - 3 complete SQL migrations created in `supabase/migrations/` (`001_initial_schema.sql`, `002_auth_triggers_and_rbac.sql`, `003_seed_demo_data.sql`).
  - RPC occupancy triggers, non-recursive RLS security definer helpers, and cascade constraints verified.
  - Full Supabase SSR Auth suite with Server Actions (`signIn`, `signUp`, `signOut`, `resetPasswordForEmail`, `updatePassword`).
  - Middleware route protection redirecting unauthorized traffic and routing authenticated users.
- **Verification Suite:** `scripts/verify-system.mjs` running **61 automated assertions** across schema, cascades, RLS, AI math, and auth security (100% passing).
- **Core App Shell:** Next.js 16 App Router compiles all 21 routes with 0 TypeScript and 0 ESLint errors.
