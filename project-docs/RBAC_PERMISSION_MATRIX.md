# RBAC PERMISSION MATRIX: AI-DRIVEN SMART WELFARE RESOURCE MANAGEMENT SYSTEM

**Document Purpose:** Comprehensive access control specification defining authorization bounds across all 7 user roles and 15 system modules.  
**Version:** 1.0.0  

---

## 1. Stakeholder Roles Overview

| Role Identifier | Role Display Name | Primary Jurisdiction |
|---|---|---|
| `government` | State Social Welfare Officer | Statewide audit, regulatory compliance, institution verification |
| `institution` | Institution Superintendent / Staff | Single care home administration, resident enrollment, inventory |
| `ngo` | NGO Welfare Coordinator | Multi-facility relief support, resource pooling, donations |
| `doctor` | Licensed Consulting Physician | Clinical examinations, resident vitals, triage alert handling |
| `donor` | Philanthropic Contributor | Monetary/in-kind contributions, receipt verification |
| `volunteer` | Community Service Volunteer | Recreational activities, tutoring, field assistance |
| `admin` | System & Security Administrator | Global configuration, identity lifecycle, audit logs |

---

## 2. Granular Module Permissions Matrix

**Legend:**  
- **C:** Create / Insert  
- **R:** Read / View  
- **U:** Update / Edit  
- **D:** Delete / Archive  
- **E:** Execute Action (Run AI, Export CSV/PDF, Acknowledge Alert)  
- **-:** No Access Allowed (Enforced via RLS & Route Guards)

| Module / Resource | Government | Institution | NGO | Doctor | Donor | Volunteer | Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1. Public Landing (`/`)** | R | R | R | R | R | R | R |
| **2. Auth & Profiles (`/(auth)/*`)** | R, U | R, U | R, U | R, U | R, U | R, U | C, R, U, D |
| **3. Institution Management (`/institutions`)** | R, U (Verify) | C, R, U (Own) | R | R | R (Verified) | R (Verified) | C, R, U, D |
| **4. Beneficiary Roster (`/beneficiaries`)** | R | C, R, U (Own) | R | R | - | R (Non-vitals) | C, R, U, D |
| **5. Medical Records & Vitals (`/health`)** | - | - | - | C, R, U, E | - | - | R, E |
| **6. Resources & Inventory (`/resources`)** | R, E | C, R, U, E | R, E | R | R | R | C, R, U, D, E |
| **7. Donation Management (`/donations`)** | R, E | R, U (Receipts) | R, C | - | C, R (Own) | - | C, R, U, D, E |
| **8. AI Resource Forecasting (`/resources`)** | R, E | R, E | R, E | - | - | - | R, E |
| **9. DL Health Triage & Risk (`/health`)** | - | - | - | R, E | - | - | R, E |
| **10. AI Predictions Audit (`/predictions`)** | R, E | R, E | R, E | R, E | - | - | C, R, U, D, E |
| **11. Research Evaluation Lab (`/research`)** | R, E | R, E | R, E | R, E | R | R | C, R, U, D, E |
| **12. Reports & Data Export (`/reports`)** | R, E | R, E (Own) | R, E | R, E (Clinical) | R, E (Receipts) | - | R, E (All) |
| **13. Alerts & Notifications (`/notifications`)** | R, U (Ack) | R, U (Ack) | R, U (Ack) | R, U (Ack) | R (Own) | R (Own) | C, R, U, D, E |
| **14. System Settings (`/settings`)** | R | R | R | R | R | R | C, R, U |
| **15. Regulatory Audit Logs (`PostgreSQL`)** | R | - | - | - | - | - | R, E |

---

## 3. Strict Clinical Privacy Boundary (Rule 5 & HIPAA Safeguards)

```sql
-- PostgreSQL RLS Policy for Medical Records Isolation
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
- **Administrative Personnel & Public:** Prohibited from viewing systolic/diastolic blood pressure, fasting glucose levels, prescription regimens, or psychiatric notes.
- **Reporting Engine Guard:** In `src/app/reports/page.tsx`, clinical reports check `currentRole === 'doctor' || currentRole === 'admin'`. Non-physician export attempts trigger an explicit authorization error dialog.

---

## 4. State Verification Gate (Rule 9)
Care facilities undergo state-mandated background checks.
- When an institution registers, `verification_status` defaults to `'pending'`.
- Only users with `role = 'government'` or `role = 'admin'` possess permission to invoke `updateInstitutionStatus(id, 'verified')`.
- Public donors can only view and contribute to institutions that are `'verified'`.
