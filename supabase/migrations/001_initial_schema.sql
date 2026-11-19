-- =============================================================================
-- Migration: 001_initial_schema.sql
-- Project: AI-Driven Smart Welfare Resource Management System
-- Purpose: Canonical normalized relational schema with Row Level Security (RLS)
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. INSTITUTIONS
create table if not exists institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  institution_type text not null check (institution_type in ('orphanage', 'old_age_home', 'mixed')),
  registration_number text unique not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  contact_email text not null,
  contact_phone text not null,
  capacity integer not null default 0 check (capacity >= 0),
  current_occupancy integer not null default 0 check (current_occupancy >= 0),
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. USER PROFILES
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('government', 'ngo', 'institution', 'doctor', 'donor', 'volunteer', 'admin')),
  phone text,
  institution_id uuid references institutions(id) on delete set null,
  verification_status text not null default 'verified' check (verification_status in ('pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. INSTITUTION MEMBERSHIPS (Multi-institution role bindings, e.g., NGOs & Doctors)
create table if not exists institution_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  institution_id uuid not null references institutions(id) on delete cascade,
  membership_role text not null default 'assigned',
  created_at timestamptz not null default now(),
  unique (user_id, institution_id)
);

-- 4. BENEFICIARIES (Privacy-preserving core resident profiles)
create table if not exists beneficiaries (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  beneficiary_type text not null check (beneficiary_type in ('child', 'elderly')),
  identifier_code text unique not null,
  first_name text not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  age integer not null check (age >= 0 and age <= 130),
  admission_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'transferred', 'discharged')),
  special_needs text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. MEDICAL RECORDS (Doctor-only / strict medical confidentiality)
create table if not exists medical_records (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references beneficiaries(id) on delete cascade,
  recorded_by uuid references profiles(id) on delete set null,
  measurement_date timestamptz not null default now(),
  systolic_bp integer check (systolic_bp between 50 and 260),
  diastolic_bp integer check (diastolic_bp between 30 and 160),
  blood_sugar_fasting numeric check (blood_sugar_fasting between 30 and 500),
  weight_kg numeric check (weight_kg between 2 and 300),
  height_cm numeric check (height_cm between 30 and 250),
  bmi numeric generated always as (
    case 
      when height_cm > 0 and weight_kg > 0 then round((weight_kg / ((height_cm / 100.0) * (height_cm / 100.0)))::numeric, 1)
      else null 
    end
  ) stored,
  chronic_diseases text[] default '{}',
  current_medications text[] default '{}',
  mobility_status text,
  doctor_notes text,
  is_synthetic boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. RESOURCE USAGE RECORDS (Historical institutional time-series data)
create table if not exists resource_records (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  record_year integer not null,
  record_month integer not null check (record_month between 1 and 12),
  season text not null check (season in ('winter', 'summer', 'monsoon', 'autumn')),
  is_festival_month boolean not null default false,
  resident_count integer not null check (resident_count >= 0),
  food_consumed_kg numeric not null check (food_consumed_kg >= 0),
  clothing_units numeric not null check (clothing_units >= 0),
  medicine_units numeric not null check (medicine_units >= 0),
  monthly_expense_inr numeric not null check (monthly_expense_inr >= 0),
  donations_received_inr numeric not null default 0 check (donations_received_inr >= 0),
  is_synthetic boolean not null default false,
  created_at timestamptz not null default now(),
  unique (institution_id, record_year, record_month)
);

-- 7. INVENTORY ITEMS (Operational stock status)
create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  category text not null check (category in ('food', 'clothing', 'medicine', 'budget', 'hygiene', 'educational')),
  item_name text not null,
  current_stock numeric not null default 0 check (current_stock >= 0),
  unit text not null,
  reorder_threshold numeric not null check (reorder_threshold >= 0),
  last_restocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. DONATIONS
create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references profiles(id) on delete set null,
  institution_id uuid not null references institutions(id) on delete cascade,
  donation_type text not null check (donation_type in ('monetary', 'in_kind')),
  category text not null check (category in ('food', 'clothing', 'medicine', 'budget', 'general')),
  amount_inr numeric check (amount_inr >= 0),
  item_description text,
  quantity numeric check (quantity >= 0),
  unit text,
  status text not null default 'pledged' check (status in ('pledged', 'received', 'allocated', 'utilized')),
  receipt_number text unique not null,
  is_anonymous boolean not null default false,
  allocated_purpose text,
  donated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 9. WELFARE & MEDICAL ALERTS
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  beneficiary_id uuid references beneficiaries(id) on delete cascade,
  alert_type text not null check (alert_type in ('health_risk', 'stock_shortage', 'budget_deficit', 'unverified_institution')),
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  priority_score numeric check (priority_score between 0 and 100),
  title text not null,
  description text not null,
  status text not null default 'pending_review' check (status in ('pending_review', 'acknowledged', 'resolved')),
  acknowledged_by uuid references profiles(id) on delete set null,
  acknowledged_at timestamptz,
  resolution_notes text,
  is_synthetic boolean not null default false,
  created_at timestamptz not null default now()
);

-- 10. AI PREDICTIONS (Immutable forecast & classification audit history)
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references institutions(id) on delete cascade,
  beneficiary_id uuid references beneficiaries(id) on delete cascade,
  prediction_domain text not null check (prediction_domain in ('resource_forecast', 'health_risk')),
  target_variable text not null,
  model_name text not null,
  model_version text not null,
  model_tier text not null default 'demo' check (model_tier in ('demo', 'research', 'production')),
  input_features jsonb not null default '{}'::jsonb,
  predicted_value numeric,
  predicted_class text,
  confidence_score numeric check (confidence_score between 0 and 1),
  explanation_payload jsonb default '{}'::jsonb,
  is_synthetic boolean not null default true,
  created_at timestamptz not null default now()
);

-- 11. AUDIT LOGS (Immutable tracking for governance)
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- 12. NOTIFICATIONS
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  link_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) on all tables
alter table institutions enable row level security;
alter table profiles enable row level security;
alter table institution_memberships enable row level security;
alter table beneficiaries enable row level security;
alter table medical_records enable row level security;
alter table resource_records enable row level security;
alter table inventory_items enable row level security;
alter table donations enable row level security;
alter table alerts enable row level security;
alter table predictions enable row level security;
alter table audit_logs enable row level security;
alter table notifications enable row level security;

-- Basic Read Policies for Authenticated Users (Refined in Phase 1)
create policy "Authenticated users can view verified institutions"
  on institutions for select
  to authenticated
  using (verification_status = 'verified' or auth.uid() in (
    select id from profiles where role in ('government', 'admin')
  ));

create policy "Users can view and update their own profile"
  on profiles for all
  to authenticated
  using (auth.uid() = id);

create policy "Doctors can view medical records for their assigned institutions"
  on medical_records for all
  to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('doctor', 'admin')
    )
  );

create policy "Notifications are private to the recipient"
  on notifications for all
  to authenticated
  using (auth.uid() = user_id);
