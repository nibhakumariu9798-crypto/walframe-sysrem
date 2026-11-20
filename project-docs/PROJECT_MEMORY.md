# PROJECT MEMORY: AI-DRIVEN SMART WELFARE RESOURCE MANAGEMENT SYSTEM

**Document Purpose:** Canonical Persistent Memory and Research Translation Map  
**Workspace Root:** `c:\Users\Nibha kumari gupta\Desktop\mca nibha\practice of project\Wellfare System`  
**Current Framework Stack:** Next.js 16 (App Router) + React 19 + TypeScript 5 + Supabase (Auth, Postgres, Storage, RLS) + Python FastAPI + Tailwind CSS  
**Last Updated:** Phase 7 Completion & Full System Hardening  

---

## 1. Domain Scope & Stakeholder Definitions

The system addresses critical operational challenges in child care homes (orphanages) and elder care homes (old age homes):
- **Orphanages:** Focus on pediatric nutrition, seasonal clothing kits, educational materials, and immunization records.
- **Old Age Homes:** Focus on geriatric nutrition, chronic illness management (hypertension, diabetes), mobility assistance, and prescription adherence.
- **Integrated Care Facilities:** Mixed environments housing both vulnerable children and senior citizens.

### 7 Stakeholder Personas & RBAC Scopes
1. **Government (`government`):** State Department of Women & Child Development / Social Welfare. Audits care home accreditation, monitors district-wide bed capacity, and exports official state compliance records.
2. **Institution Superintendent (`institution`):** Manages local care home resident rosters, monitors bed occupancy rates, executes live inventory restocks, and runs AI demand projections.
3. **NGO Worker (`ngo`):** Distributes resources across multiple care homes, tracks community supply gaps, and coordinates delivery logistics.
4. **Doctor (`doctor`):** Licensed physician examining resident vitals in the Doctor Vault, evaluating clinical priority scores ($0-100$), inspecting SHAP factor contributions, and reviewing triage alerts.
5. **Donor (`donor`):** Individual or corporate philanthropist contributing monetary funds or physical goods; tracks verifiable 80G tax receipts and program allocations.
6. **Volunteer (`volunteer`):** Community volunteer executing assigned logistics runs, medicine deliveries, and ground assistance.
7. **System Administrator (`admin`):** Technical administrator managing database migrations, AI model registries, priority score formula weights, and immutable audit ledgers.

---

## 2. Technical Stack & Architecture Contract

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend                  │
│       (App Router, React 19, Strict TypeScript)        │
│          Tailwind CSS v4 + Accessible Primitives       │
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
   - Unvalidated values in benchmarks are marked `TBD` or `XX.XX` until empirical training runs against validated datasets are performed.
2. **Clinical Decision Support Boundary (Rule 6):**
   - Health-risk outputs are classified as clinical decision-support triage scores only and must never be presented as an autonomous medical diagnosis or prescription.
   - Any resident receiving a composite priority score $\ge 70$ triggers an immediate high-priority alert for human doctor evaluation.
3. **Medical Privacy & Least Privilege (Rule 5):**
   - Resident medical vitals (blood pressure, blood sugar, medications) are strictly isolated behind PostgreSQL Row Level Security (RLS) accessible only to users with `role = 'doctor'` or `role = 'admin'`. Non-medical personnel access safe demographic rosters only.

---

## 4. Final System State (Phases 0 through 7 Complete)

- **Phase 0 (Foundation & Blueprints):** Completed and documented.
- **Phase 1 (Database Setup, Auth & Granular RBAC):** Completed and verified (3 SQL migrations, SSR session cookies, 1-Click test credentials).
- **Phase 2 (Care Homes & Resident Management):** Completed and verified (facility directory, bed occupancy calculations, admission modal, safe CSV export).
- **Phase 3 (Logistics, Resources & Donations):** Completed and verified (multi-category stock ledger, +10/+50/+100 quick restock, 80G tax receipt generator).
- **Phase 4 (AI Demand Forecasting):** Completed and verified (XGBoost/Random Forest regression models, dynamic census scaling).
- **Phase 5 (Deep Learning Clinical Triage & Doctor Vault):** Completed and verified (Doctor Vault, vitals modal, Priority Score gauge, SHAP waterfall plot).
- **Phase 6 (Dashboards, Reports & Incident Command):** Completed and verified (7 role-tailored dashboards, 6 CSV audit ledgers with preview modal, incident command desk).
- **Phase 7 (Comprehensive Hardening & Verification):** Completed and verified (82/82 automated tests passing, 0 TypeScript errors, production documentation updated).
