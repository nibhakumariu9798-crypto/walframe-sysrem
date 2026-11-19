# SECURITY & PRIVACY ENGINEERING RULES

1. **Medical Confidentiality (Rule 5 & HIPAA Safeguards):**
   - Detailed patient vitals (blood pressure, blood glucose, prescription medications, clinical notes) are strictly isolated to licensed physicians (`role = 'doctor'`) and state administrators (`role = 'admin'`).
   - Non-medical users (superintendents, donors, volunteers) can view only de-identified resident demographic rosters.

2. **State Verification Anti-Fraud Gate (Rule 9):**
   - Registered welfare institutions default to `verification_status = 'pending'`.
   - Only state social welfare officers (`role = 'government'`) or administrators can verify care homes.
   - Donors can only allocate contributions to verified facilities.

3. **Input Sanitization & Injection Prevention:**
   - Use parameterized SQL queries (native in Supabase client).
   - Sanitize all strings before rendering in DOM to prevent Cross-Site Scripting (XSS).
   - Validate and escape CSV export cells to prevent CSV Formula Injection (`=` or `@` prefix attacks).
