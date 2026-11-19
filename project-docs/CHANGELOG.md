# CHANGELOG: AI-DRIVEN SMART WELFARE RESOURCE MANAGEMENT SYSTEM

All notable changes, architectural milestones, and schema updates for this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-19 (Phase 1: Database Setup, Supabase Auth & Granular RBAC)

### Added
- Extended `002_auth_triggers_and_rbac.sql` with security definer RPC helper functions: `increment_occupancy(inst_id)` and `decrement_occupancy(inst_id)`.
- Added Server Actions in `src/lib/auth/actions.ts`: `resetPasswordForEmail()` and `updatePassword()`.
- Implemented route protection redirection in `src/lib/supabase/middleware.ts` (redirects unauthenticated users to `/login?next=...` and authenticated users away from auth forms).
- Expanded automated verification suite `scripts/verify-system.mjs` to **61 system assertions (100% pass rate)** including:
  - Auth actions export validation (`signIn`, `signUp`, `signOut`, `resetPasswordForEmail`, `updatePassword`).
  - Middleware route guard validation.
  - PKCE session exchange handler verification in `/auth/callback`.
  - Referential integrity cascade verification on `auth.users(id)` and `institutions(id)`.

### Security
- Verified strict session persistence via `@supabase/ssr` with encrypted HTTP-only cookie store.
- Verified foreign-key cascading deletes to prevent orphaned profile or beneficiary records.

---

## [1.0.0] - 2026-11-19 (Phase 0: Architecture & Complete Documentation)

### Added
- Created complete canonical project documentation repository under `project-docs/`:
  - `MASTER_BLUEPRINT.md`: Comprehensive system scope, research hypotheses, and phased delivery plan.
  - `PROJECT_MEMORY.md`: Persistent memory map, tech stack specifications, and domain boundaries.
  - `SYSTEM_ARCHITECTURE.md`: Multi-tier topology, sequence diagrams for forecasting & triage, offline resilience.
  - `DATABASE_SCHEMA.md`: 12 normalized PostgreSQL table definitions, indexing strategy, and RLS policies.
  - `RBAC_PERMISSION_MATRIX.md`: 7 user roles and granular CRUD permission matrix across all 15 modules.
  - `UI_UX_DESIGN_SYSTEM.md`: Color palette, typography, accessible components, and mandatory UX states.
  - `AI_ML_ARCHITECTURE.md`: Dual-task formulation (Regression & DL Triage), priority equations, and SHAP explainability.
  - `API_CONTRACTS.md`: Pydantic models, TypeScript contracts, endpoint payloads, and error schemas.
  - `DEVELOPMENT_ROADMAP.md`: Gantt timeline, phase deliverables, and acceptance criteria from Phase 0 to 7.
  - `TESTING_STRATEGY.md`: Testing pyramid, verification runbook, and release quality gates.
  - `SECURITY_RULES.md`: Least-privilege access, HIPAA-inspired medical safeguards, and anti-fraud verification.
  - `CHANGELOG.md`: Chronological milestone tracker.
  - `MODULE_STATUS.md`: Real-time readiness matrix across all 15 core domain modules.
- Created `.agent/rules/` and `.agent/skills/` engineering guides:
  - `global-rules.md`, `frontend-rules.md`, `backend-rules.md`, `database-rules.md`, `ai-ml-rules.md`, `security-rules.md`, `testing-rules.md`.
  - Skill manifests for architecture, frontend, backend, database, AI/ML, and security audit.
- Created `scripts/verify-system.mjs`: Automated End-to-End verification script executing 48 assertions covering migrations, RLS, AI math, and export security (100% pass rate).
- Created `ai-service/README.md`: Virtualenv setup, FastAPI Uvicorn execution, and API contract documentation.
- Created client-side research protocol export engine in `/research` generating `welfare_ai_experiment_protocol.json`.
- Created privacy-safe resident roster CSV export in `/beneficiaries`.

### Changed
- Standardized `RoleDashboard` header to include custom title and view for `currentRole === 'admin'`.
- Consolidated Tailwind CSS v4 and system font stack for offline sandbox build resilience.

### Security
- Verified strict medical isolation: Non-doctor roles cannot access or export clinical records.
- Verified priority score threshold: Cases scoring $\ge 70$ trigger high-priority alerts for clinical evaluation.
- Verified academic integrity policy: Zero fabricated metrics; benchmark tables retain `TBD` and `XX.XX`.
