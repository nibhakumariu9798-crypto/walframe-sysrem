# TESTING & QUALITY ASSURANCE RULES

1. **Pre-Completion Quality Gates:**
   Before marking any task or phase as complete, verify:
   - `node scripts/verify-system.mjs`: All 48 system assertions must pass (100%).
   - `npx tsc --noEmit`: Strict TypeScript check must exit with code 0 (zero errors).
   - `npx eslint src --quiet`: Next.js ESLint must exit with code 0 (zero errors).
   - `npm run build`: Static compilation must succeed across all routes without prerender failures.

2. **Regression Testing:**
   - Any new feature must not break previously completed modules or routes.
   - Maintain backwards compatibility for existing components and context stores.

3. **Verification Integrity:**
   - Never remove or disable an automated test assertion simply to make the build pass.
   - Fix the underlying code or database schema to adhere to the test specification.
