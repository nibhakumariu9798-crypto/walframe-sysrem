---
name: qa-verification
description: Verifies end-to-end correctness, authorization, research integrity, data quality, accessibility, and production readiness for the welfare application.
---

# QA & Verification Skill

## Use when

Use for tests, bug fixes, feature completion, security review, acceptance review, CI checks, and release readiness.

## Verification layers

### 1. Static/runtime
- TypeScript/build checks
- linting
- schema/migration validation
- no missing environment-variable assumptions

### 2. Database/security
- RLS enabled on sensitive tables
- positive and negative role-access tests
- storage policy tests where applicable
- no client exposure of privileged keys

### 3. Functional flows
- sign up/login/logout
- role routing
- institution CRUD
- beneficiary CRUD
- resource usage/inventory
- donation flow
- medical record access restrictions
- alert acknowledgement
- report generation

### 4. AI integrity
- demo/production model status is visible
- model name/version is present for predictions
- no invented metrics
- input schema is validated
- missing model service fails clearly and safely

### 5. UX/accessibility
- keyboard navigation on critical flows
- clear validation errors
- responsive layouts
- accessible chart summaries
- permission-denied states

## Completion evidence

At the end of a task, report:
- commands/checks actually run;
- relevant test results;
- known limitations;
- any TODOs left intentionally.

Do not claim tests passed when they were not run.
