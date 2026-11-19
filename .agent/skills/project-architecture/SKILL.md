---
name: project-architecture
description: High-level architectural patterns, module dependency graphs, and phased engineering roadmap for the AI-Driven Smart Welfare Resource Management System.
---

# Project Architecture Skill

## Purpose
Guides system-level structural decisions, domain boundary definitions, and phased delivery plans for the Welfare Resource Management System.

## Architectural Standards
1. **Next.js 16 App Router Structure:**
   - Routes organized cleanly under `src/app/`.
   - Reusable UI elements in `src/components/ui/`.
   - Domain-specific modals in `src/components/modals/`.
   - State management providers in `src/context/`.
   - AI adapter interfaces in `src/lib/ai/`.
2. **7 User Roles:**
   - `government`, `institution`, `ngo`, `doctor`, `donor`, `volunteer`, `admin`.
   - Role dashboard rendering managed via `RoleDashboard` component.
3. **Phased Development Protocol:**
   - Always read `project-docs/PROJECT_MEMORY.md` and `project-docs/MASTER_BLUEPRINT.md` before initiating major modifications.
   - Maintain complete backwards compatibility across completed modules.
