---
name: database-management
description: PostgreSQL relational schema design, Supabase migration scripts, indexing strategies, and Row Level Security (RLS) enforcement.
---

# Database Management Skill

## Purpose
Directs database schema migrations, relational integrity constraints, foreign key cascades, and high-performance indexing.

## Core Rules
1. **12 Relational Tables:**
   - `institutions`, `profiles`, `institution_memberships`, `beneficiaries`, `medical_records`, `resource_records`, `inventory_items`, `donations`, `alerts`, `predictions`, `audit_logs`, `notifications`.
2. **Row Level Security (RLS):**
   - Must be enabled on every table.
   - Use security definer functions to prevent infinite RLS recursion.
3. **Medical Isolation:**
   - `medical_records` must restrict read and write access strictly to users with `role in ('doctor', 'admin')`.
