# BACKEND & API ENGINEERING RULES

1. **Authentication & Session Management:**
   - Use `@supabase/ssr` with HTTP-only encrypted cookies for session persistence.
   - Verify JWT signatures on server routes and actions.
   - Do not trust client-supplied user IDs or role claims; always resolve user identity server-side via `supabase.auth.getUser()`.

2. **Secrets & Credentials Hygiene:**
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` or other server secrets to client-side bundles.
   - Never prefix server-only keys with `NEXT_PUBLIC_`.

3. **Validation & Error Handling:**
   - Validate all user and API inputs using strict typed schemas (Pydantic for FastAPI, TypeScript interfaces for Next.js).
   - Handle authorization separately from input validation.
   - Return structured error responses conforming to standard error contracts (`code`, `message`, `details`, `timestamp`).

4. **AI Microservice Contract:**
   - The Python FastAPI microservice must match the TypeScript schemas declared in `src/lib/ai/types.ts`.
   - Maintain dual-mode fallback: If the external microservice is offline, frontend adapters must fall back gracefully to `DemoAIAdapter`.
