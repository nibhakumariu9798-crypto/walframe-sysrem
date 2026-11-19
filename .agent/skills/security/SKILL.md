---
name: security-audit
description: Security verification, HIPAA-inspired clinical privacy checks, state anti-fraud gates, and credential protection.
---

# Security & Compliance Skill

## Purpose
Enforces least-privilege access, clinical confidentiality boundaries, credential safety, and regulatory audit compliance.

## Directives
1. **Clinical Vitals Isolation:**
   - Audit all database queries and UI pages to guarantee that non-physician users cannot inspect patient vitals.
2. **State Verification Anti-Fraud Gate:**
   - Verify that institution status upgrades from `pending` to `verified` are executable only by authenticated government officers or administrators.
3. **Secret Hygiene:**
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is never imported or bundled into client code.
4. **Data Sanitization:**
   - Prevent CSV Formula Injection by sanitizing cell values during tabular data exports.
