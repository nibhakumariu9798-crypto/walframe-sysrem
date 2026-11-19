# AI-Driven Smart Welfare Resource Management System

> **Enterprise-Grade Welfare Management Platform for Orphanages & Old Age Homes with Machine Learning Demand Forecasting and Clinical Health-Risk Triage**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20PostgreSQL%20%7C%20RLS-3ecf8e?logo=supabase)](https://supabase.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## 1. Project Overview

This platform provides a centralized, role-based welfare resource and clinical decision-support ecosystem connecting **certified welfare care homes (orphanages, old age homes, mixed institutions), state/district government coordinators, licensed physicians, NGOs, donors, and volunteers**.

### Core Problem Solved
- **Record Preservation:** Replaces vulnerable paper registers with encrypted, role-partitioned PostgreSQL records.
- **Resource Optimization:** Replaces intuition-based procurement with ML regression forecasting for food (kg), clothing (units), medicine (units), and operational budget (INR).
- **Early Health Intervention:** Employs deep learning classification and a multi-factor Welfare Priority Score (0–100) to alert physicians to high-risk residents before critical health crises occur.
- **Donation Transparency:** Reconciles public contributions with verified receipt numbers, tracking utilization down to specific program allocations.

---

## 2. Stakeholder Roles & Access Control Matrix

The system enforces strict Row Level Security (RLS) across 7 distinct stakeholder roles:

| Role | Operational Scope | Beneficiary Access | Medical Vitals | Resource & Inventory | AI Predictions & Alerts | Reports & Exports |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Government** | State/District monitoring; care home accreditation | Full roster (anonymized) | Denied (privacy-safe) | State-wide demand overview | View forecasts; manage alerts | Full operational & compliance reports |
| **Institution** | Care home management (superintendent) | Full profiles for own residents | Basic administrative data | Full CRUD on own stock; restock triggers | Run forecasts; view shortages | Institutional summaries & restock CSV |
| **NGO** | Program allocations & outreach | Enrolled residents in assigned homes | Denied | View stock deficits & supply gaps | View demand projections | Program impact & allocation audits |
| **Doctor** | Clinical triage & geriatric review | Clinical review queue | **Full Access** (Doctor Vault) | Review medicine stock | Run health triage; review SHAP factors | Doctor clinical review summaries |
| **Donor** | Verified contributions | Anonymized impact metrics | Denied | View verified institutional needs | General transparent utilization | Donor transparency & receipt audits |
| **Volunteer** | Field tasks & supply delivery | Minimal assigned task data | Denied | View delivery requisitions | View task alerts | Task completion summaries |
| **Admin** | System-wide governance | Full administrative access | Audit access | Full administrative access | Model tier management & registry | Full system export |

---

## 3. Technology Stack & Architecture

- **Frontend & App Framework:** Next.js 16.4.0 (App Router), React 19.3.0, TypeScript 5.
- **Styling & UI:** Tailwind CSS v4, Lucide Icons, accessible component primitives.
- **Backend & Database:** Supabase Auth (cookie-based SSR), PostgreSQL 15+ with Row Level Security (RLS) enabled on all 12 tables.
- **AI Service Boundary:** Provider-agnostic adapter architecture supporting:
  - `demo`: Deterministic synthetic baseline pipeline (`DemoAIAdapter`) for offline testing and continuous demonstration.
  - `remote`: External Python microservice (FastAPI + scikit-learn / XGBoost / PyTorch) for production ML inference.

---

## 4. Quickstart & Local Setup

### 4.1 Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- `npm` or `pnpm`

### 4.2 Clone & Install
```bash
# 1. Clone repository
git clone <repository-url>
cd "Wellfare System"

# 2. Install dependencies
npm install
```

### 4.3 Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials in `.env.local`:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AI_ADAPTER_MODE=demo
```

### 4.4 Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Supabase Database Setup & Migrations

To initialize your Supabase PostgreSQL database, execute the SQL migration scripts located in `supabase/migrations/` in the following sequence via the **Supabase SQL Editor**:

1. **`001_initial_schema.sql`**
   - Enables `uuid-ossp` extension.
   - Creates the 12 normalized relational tables (`institutions`, `profiles`, `institution_memberships`, `beneficiaries`, `medical_records`, `resource_records`, `inventory_items`, `donations`, `alerts`, `predictions`, `audit_logs`, `notifications`).
   - Enables PostgreSQL Row Level Security (RLS) on all tables.
2. **`002_auth_triggers_and_rbac.sql`**
   - Configures the automatic user profile provisioning trigger (`on_auth_user_created`).
   - Creates security definer helper functions (`current_user_role()`, `is_doctor_for_institution()`, `is_admin_or_gov()`).
   - Sets granular, non-recursive RLS access policies.
3. **`003_seed_demo_data.sql`**
   - Seeds 4 certified care homes, sample children and senior residents, inventory stock, historical monthly consumption records, verified donation receipts, active alerts, and baseline prediction logs.

---

## 6. AI Microservice Integration (Production Mode)

To connect a production Python ML microservice:

1. Update `.env.local`:
   ```ini
   NEXT_PUBLIC_AI_ADAPTER_MODE=remote
   AI_SERVICE_URL=http://127.0.0.1:8000
   ```
2. The external Python FastAPI service must implement the following endpoints:
   - `POST /predict/resource-demand`: Accepts resident count, season, festival boolean, and rolling averages; returns next-month demand for food, clothing, medicine, and budget.
   - `POST /predict/health-risk`: Accepts vitals (blood pressure, fasting glucose, BMI, chronic diseases, medication count); returns risk class (`low`, `medium`, `high`), composite priority score (0–100), SHAP contributions, and doctor review trigger.

---

## 7. Build & Verification Commands

```bash
# Typecheck & build production bundle
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 8. Academic Integrity & Medical Safety Mandates

1. **No Fabricated Model Performance:** In compliance with the project charter and academic ethics, no benchmark metrics (MAE, RMSE, R², Accuracy, Precision, Recall, F1) are invented. Comparative fields remain labeled `TBD` or `XX.XX` until empirical training runs against validated datasets are performed.
2. **Clinical Decision Support Only:** Health-risk triage and welfare priority scores are decision-support heuristics. They do **NOT** constitute medical diagnoses, do **NOT** prescribe treatment, and must never replace direct evaluation by a licensed physician.
3. **Strict Data Privacy:** Personal medical vitals are isolated in doctor-only vaults protected by PostgreSQL RLS. General user queries and public donor exports automatically sanitize sensitive patient details.
