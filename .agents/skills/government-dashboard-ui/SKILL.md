---
name: government-dashboard-ui
description: Designs accessible, professional public-service dashboards for government, NGOs, donors, institutions, doctors, volunteers, and privacy-safe public views.
---

# Government Dashboard UI Skill

## Use when

Use for page design, dashboard layout, information hierarchy, navigation, charts, tables, responsive behavior, accessibility, or role-specific UX.

## Visual direction

Build a credible public-sector/product-grade portal:
- calm and trustworthy;
- strong typography and spacing;
- dense enough for operational work without feeling crowded;
- responsive;
- accessible contrast and keyboard navigation;
- consistent status/severity semantics;
- no decorative UI that hides operational meaning.

Avoid a generic consumer SaaS aesthetic. The system should look appropriate for a government/NGO welfare program.

## Core navigation

Dashboard, Institutions, Beneficiaries, Resources, Donations, Health & Alerts, AI Predictions, Reports, Notifications, Settings.

Adjust visible navigation by role.

## Dashboard rules

Every role dashboard should answer:
1. What needs attention now?
2. What changed recently?
3. What should happen next?
4. What evidence supports the displayed number?

Use KPI cards for summary, tables for operational queues, and charts for trends/comparisons.

## Health UI

Use neutral risk labeling and clear textual descriptions. Do not use color alone to communicate severity.

Example:
`High risk — professional review required`
not
`Danger / diagnosis`

## Data tables

Include:
- search/filter;
- pagination or virtualization when necessary;
- empty state;
- error state;
- loading state;
- accessible column labels;
- explicit date/time formatting;
- role-appropriate actions.

## Charts

Every chart needs:
- meaningful title;
- unit;
- date range/context;
- accessible alternative or summary text;
- no misleading axes.

## Sensitive data

Never render sensitive medical columns simply because the user can reach the page. The role policy must determine what the UI requests and renders.
