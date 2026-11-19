---
name: backend-development
description: Server Actions, Supabase SSR Auth, API Route Handlers, and FastAPI microservice connectivity for the welfare system.
---

# Backend Development Skill

## Purpose
Specifies server-side business logic, API route implementations, session management, and external service communication.

## Key Directives
1. **Supabase SSR:**
   - Use `@supabase/ssr` with cookie-based JWT sessions.
   - Guard mutating server routes using session verification.
2. **AI Microservice Integration:**
   - Call Python FastAPI microservice using typed JSON payloads matching `ResourceForecastInput` and `HealthRiskInput`.
   - Implement network timeouts (5000ms) with graceful fallback to `DemoAIAdapter`.
3. **Audit Trails:**
   - Log all inserts, updates, and deletes to the `audit_logs` table with actor ID, entity type, and timestamp.
