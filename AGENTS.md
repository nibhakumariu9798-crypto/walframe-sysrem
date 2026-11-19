# Project Agent Rules — AI-Driven Smart Welfare Resource Management System

This is the persistent project contract for Antigravity.

## Primary context

Read these files before making non-trivial changes:
- `ANTIGRAVITY_PROJECT_MEMORY.md` — canonical project memory map and research-to-product translation.
- `.agents/skills/*/SKILL.md` — task-specific implementation guidance.
- `ANTIGRAVITY_MASTER_PROMPT.md` — phased build protocol and acceptance criteria.

Use the memory map as the source of truth for domain scope. Do not silently change the research framing, stakeholder roles, AI objectives, or safety boundaries.

## Mandatory engineering constraints

1. Stack target: Next.js App Router + TypeScript + Supabase (Auth, Postgres, Storage, Realtime where justified).
2. Prefer current official Supabase SSR/Auth patterns and `@supabase/ssr`; verify current APIs instead of relying on stale examples.
3. Keep AI training/inference behind an explicit adapter/service boundary. The web app must not pretend that untrained models are production models.
4. No fabricated model metrics, dataset sizes, validation results, or medical conclusions.
5. All sensitive beneficiary/medical data is protected with least-privilege access and Supabase Row Level Security.
6. Health-risk outputs are decision-support only and must never be presented as a medical diagnosis.
7. Use synthetic/demo data only when explicitly labeled as synthetic/demo. Never present demo values as research results.
8. Use server-side secrets only where required. Never expose Supabase service-role credentials to browser code.
9. Validate all user input with typed schemas and handle authorization separately from validation.
10. Build in phases. Before a major phase, produce a concise implementation plan and identify impacted files/database migrations.
11. Keep components modular and accessible. Avoid giant page components and giant API handlers.
12. Add loading, empty, error, and permission-denied states for important screens.
13. Every database change must be migration-first and documented.
14. Prefer auditable actions: who changed what, when, and for which institution/beneficiary/resource.
15. Do not delete research evidence or replace source-derived assumptions without recording the change in project docs.

## Working style

- Inspect the existing repository before creating or replacing files.
- Reuse working code where safe; avoid unnecessary rewrites.
- When an implementation choice is ambiguous, select the simplest production-worthy option that preserves the research requirements.
- When a current library/API detail is uncertain, verify the official documentation before coding.
- After changes, run the relevant checks and report what was actually verified.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
