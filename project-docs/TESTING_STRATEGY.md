# TESTING STRATEGY & QUALITY ASSURANCE SPECIFICATION

**Document Purpose:** Verification protocols, automated testing suites, security audits, and quality gates.  
**Version:** 1.0.0  

---

## 1. Testing Pyramid & Verification Architecture

```
        ▲
       / \      End-to-End Verification (scripts/verify-system.mjs)
      /   \     - 48 System Assertions (Schema, RLS, Dual AI, Rules)
     /─────\
    /       \   Integration & Contract Testing
   /         \  - Dual-Mode AI Adapter Fallback & FastAPI Connectivity
  /───────────\
 /             \ Unit & Type Validation
/               \- TypeScript Strict Compilation (tsc --noEmit)
───────────────── - ESLint Static Code Analysis (eslint src --quiet)
                  - Mathematical Priority Scoring & SHAP Range Checks
```

---

## 2. Core Test Suites

### 2.1 Database & Schema Verification
- **Test Target:** `supabase/migrations/001_initial_schema.sql` & `002_auth_triggers_and_rbac.sql`
- **Validation Points:**
  - All 12 tables declared with appropriate primary and foreign keys.
  - Row Level Security (RLS) enabled on 100% of tables.
  - Security definer helper functions (`current_user_role`, `is_admin_or_gov`, `is_doctor_for_institution`) prevent infinite recursion.
  - `handle_new_user()` trigger properly creates public profile on auth signup.

### 2.2 AI Model & Safety Boundary Verification
- **Test Target:** `src/lib/ai/*` & `ai-service/main.py`
- **Validation Points:**
  - `DemoAIAdapter` produces deterministic regression values within standard biological and logistic bounds.
  - Priority score formula correctly weights features:
    $$P = \text{round}(w_{\text{age}} \cdot \text{NormAge} + w_{\text{risk}} \cdot \text{Risk} + w_{\text{chr}} \cdot \text{Chronic} + w_{\text{med}} \cdot \text{Meds})$$
  - Any clinical case receiving $P \ge 70$ sets `requires_doctor_review = true` and `risk_class = 'high'`.
  - Healthy child (e.g. Age 8, no chronic condition) computes $P < 30$ and `requires_doctor_review = false`.
  - Medical outputs ALWAYS contain the non-diagnostic clinical decision support disclaimer.
  - `RemoteAIAdapter` gracefully falls back to `DemoAIAdapter` upon network disconnection without crashing.

### 2.3 Role-Based Access Control & Clinical Privacy
- **Test Target:** `src/app/reports/page.tsx` & RLS Policies
- **Validation Points:**
  - Medical triage queue exports are restricted exclusively to `doctor` and `admin` roles.
  - Non-physicians attempting to export clinical vitals are blocked by client and server security checks.
  - Beneficiary rosters exported by non-medical staff omit all blood pressure, glucose, and prescription fields.

---

## 3. Automated Test Execution Commands

```powershell
# 1. Run the comprehensive End-to-End System Verification Suite (48 checks)
node scripts/verify-system.mjs

# 2. Strict TypeScript type check
npx tsc --noEmit

# 3. Next.js ESLint static analysis
npx eslint src --quiet

# 4. Production Static Build & Prerender check
npm run build
```

---

## 4. Quality Gates & Release Criteria

| Quality Gate | Requirement | Status |
|---|---|---|
| **TypeScript Compilation** | `0` errors with `strict: true` | Passing |
| **ESLint Analysis** | `0` errors with Next.js 16 / React 19 rules | Passing |
| **E2E System Suite** | `48 / 48` assertions passing | Passing (100%) |
| **Prerender Static Build** | All 21 routes build without prerender crashes | Passing |
| **Academic Non-Fabrication** | Zero fake metrics; `TBD`/`XX.XX` preserved in benchmarks | Verified |
| **Clinical Safety Boundary** | Decision-support disclaimer present on all health cards | Verified |
