# SECURITY RULES & COMPLIANCE SPECIFICATION

**Document Purpose:** Security principles, data isolation boundaries, HIPAA-inspired medical safeguards, and credential management.  
**Version:** 1.0.0  

---

## 1. Core Security Commandments

1. **Least-Privilege Access:** Users and system processes are granted only the minimum permissions necessary to perform their designated operational tasks.
2. **Never Expose Service-Role Credentials:** The Supabase `SUPABASE_SERVICE_ROLE_KEY` must never be referenced in browser-executed code or prefixed with `NEXT_PUBLIC_`.
3. **Defense-in-Depth:** Authorization is validated at three independent boundaries:
   - Next.js Client Route Guards (`src/context/role-context.tsx`).
   - Server Actions / API Route Middleware.
   - PostgreSQL Database Engine via Row Level Security (RLS).
4. **Non-Repudiation & Auditability:** Every mutating operation (resident admission, donation pledge, institution status change) records an immutable entry in the `audit_logs` table.

---

## 2. Clinical Data Privacy & Medical Isolation (Rule 5)

Detailed clinical vitals (systolic/diastolic blood pressure, fasting glucose, prescription regimens, psychological notes) represent sensitive health information and are protected under strict isolation protocols:
- **Database Vault:** Stored in the dedicated `medical_records` table, isolated from general demographic records in `beneficiaries`.
- **Doctor-Only RLS Policy:**
  ```sql
  create policy "Doctors and Admins Only - Medical Records"
    on public.medical_records
    for select
    to authenticated
    using (
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
        and p.role in ('doctor', 'admin')
      )
    );
  ```
- **Safe Administrative Views:** Superintendents, NGO workers, and volunteers access only de-identified rosters (`identifier_code`, `first_name`, `age`, `gender`, `institution_id`).
- **Export Scrubbing:** Any CSV export initiated by non-physicians strips all physiological and diagnostic fields automatically.

---

## 3. Session & Authentication Architecture

- **Session Handling:** Managed via `@supabase/ssr` using encrypted, HTTP-only cookie storage to mitigate Cross-Site Scripting (XSS) token exfiltration.
- **Role Synchronization:** User roles are assigned upon signup via metadata, verified against the authorized role enum, and persisted into `public.profiles`.
- **Security Definer Functions:** Helper functions used within RLS policies are marked `security definer` with explicit `search_path = public` to prevent privilege escalation attacks and RLS infinite recursion loops.

---

## 4. State Verification Gate (Anti-Fraud)

To prevent fraudulent fundraising campaigns:
- Unverified care homes (`verification_status = 'pending'`) are hidden from public donor directories.
- Only verified institutions can receive allocated donation disbursements.
- Status upgrades from `pending` to `verified` require explicit digital sign-off by a verified state social welfare officer (`role = 'government'`).
