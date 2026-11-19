---
name: welfare-architecture
description: Designs and implements the AI-driven welfare platform architecture, domain modules, data flows, and phased delivery plan for orphanages and old age homes.
---

# Welfare Architecture Skill

## Use when

Use for feature planning, domain modeling, new modules, system architecture, API boundaries, database design, or cross-module changes.

## Required context

Read `ANTIGRAVITY_PROJECT_MEMORY.md` before making architectural decisions.

## Protocol

1. Identify the stakeholder role(s), domain entity(ies), data sensitivity, and research requirement involved.
2. Trace the request through the layers: UI → server/action/route → authorization → database → AI adapter/service when applicable.
3. Prefer modular domain boundaries rather than a single large dashboard or API route.
4. Identify whether the change is operational, research-only, or both.
5. For database changes, propose a migration before coding.
6. For cross-cutting changes, list impacted routes/components/tables and update docs when architecture materially changes.
7. Preserve an auditable history for sensitive or consequential actions.
8. Keep AI model code behind an interface so the web application is not coupled to one inference implementation.

## Domain modules

Institution, Beneficiary, Medical, Resource, Donation, Volunteer, Government, AI Forecasting, Health Risk, Alerts, Reports, Notifications, Audit.

## Decision rules

- If a feature reads or writes sensitive medical data: apply the strictest authorization path.
- If a feature changes resource forecasts: store prediction metadata and model version; never overwrite raw usage history.
- If a feature is useful to more than one role: implement shared domain services/components and role-specific views.
- If a feature is research-only: place it under a restricted research/admin area and do not leak internal experiment details into public dashboards.

## Before finishing

Confirm:
- architecture is consistent with the memory map;
- permissions are defined;
- loading/error/empty states exist;
- no research claims were fabricated;
- implementation can be tested locally.
