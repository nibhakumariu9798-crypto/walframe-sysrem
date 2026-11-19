---
name: supabase-rbac-security
description: Implements secure Supabase Auth, Postgres Row Level Security, storage policies, role-based access, and auditability for welfare and medical data.
---

# Supabase RBAC & Security Skill

## Use when

Use for authentication, authorization, Supabase schema changes, RLS, storage, sensitive data access, server/client boundaries, or security reviews.

## Required technical baseline

Use the current official Supabase Next.js SSR approach, including `@supabase/ssr` and cookie-based sessions. Verify current official API details before coding because framework packages evolve.

## Rules

1. Authentication answers "who are you?"; authorization answers "what may you access?" Never confuse the two.
2. Enforce authorization in database RLS policies, not only in React UI.
3. Every sensitive table needs an explicit RLS strategy.
4. Prefer role + institution membership + record ownership/context as authorization dimensions.
5. Medical records require tighter access than normal beneficiary profile data.
6. Never expose a Supabase service-role key to browser/client code.
7. Keep server-only operations in server-side modules/actions/route handlers as appropriate.
8. Storage buckets containing sensitive documents must have explicit policies; do not rely on obscure bucket names.
9. Validate input before mutation and perform authorization checks before executing privileged writes.
10. Add audit events for security-sensitive mutations.

## Suggested authorization model

- `government`: read verified institutions and aggregated operational metrics; write only permitted administrative fields.
- `ngo`: read/write assigned institution program data according to explicit membership.
- `institution`: manage its own institution, beneficiaries, resources, and donations within scope.
- `doctor`: access authorized medical records and health alerts for assigned institutions.
- `donor`: read own donations and privacy-safe utilization summaries.
- `volunteer`: read assigned tasks and minimal beneficiary/institution information needed to perform them.
- `public`: read only explicitly published, aggregated information.

Treat these as starting policies. Confirm exact business requirements before implementing broad access.

## RLS workflow

For every new table:
1. Add foreign keys and indexes.
2. Enable RLS.
3. Add explicit select/insert/update/delete policies.
4. Test each role against allowed and denied paths.
5. Add fixtures/test users where practical.
6. Document any intentional privileged operation.

## Security review checklist

Check for:
- service-role leakage;
- client imports of server-only secrets;
- unprotected tables;
- overly broad `select` policies;
- medical data joining into public queries;
- insecure file uploads;
- missing audit trails;
- predictable identifiers exposed unnecessarily;
- authorization performed only on UI routes.
