# DATABASE & SQL ENGINEERING RULES

1. **Migration-First Principle:**
   - Every database change must be documented as an incremental SQL migration file in `supabase/migrations/`.
   - Never apply undocumented ad-hoc DDL queries directly to the production database.

2. **Row Level Security (RLS) is Mandatory:**
   - Every single table created in PostgreSQL must execute: `alter table <table_name> enable row level security;`.
   - Write granular policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

3. **Avoid RLS Recursion:**
   - When RLS policies reference other tables (e.g., verifying user role in `profiles`), use `security definer` helper functions (such as `current_user_role()`) to eliminate infinite recursive policy evaluations.

4. **Referential Integrity & Auditing:**
   - Always define explicit foreign-key constraints with appropriate `ON DELETE CASCADE` or `ON DELETE SET NULL` clauses.
   - Maintain `created_at` and `updated_at` timestamps on all entity tables.
   - Record mutating actions into `audit_logs` for compliance tracking.
