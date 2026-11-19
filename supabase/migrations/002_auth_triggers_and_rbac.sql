-- =============================================================================
-- Migration: 002_auth_triggers_and_rbac.sql
-- Project: AI-Driven Smart Welfare Resource Management System
-- Purpose: Automatic profile creation trigger and granular Row Level Security
-- =============================================================================

-- 1. AUTOMATIC PROFILE CREATION TRIGGER
-- When a user registers through Supabase Auth (auth.users), automatically
-- create their public.profiles record with metadata provided at signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_role text;
  user_full_name text;
begin
  -- Extract role from metadata, defaulting safely to 'donor' if unspecified
  user_role := coalesce(new.raw_user_meta_data->>'role', 'donor');
  if user_role not in ('government', 'ngo', 'institution', 'doctor', 'donor', 'volunteer', 'admin') then
    user_role := 'donor';
  end if;

  user_full_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    phone,
    institution_id,
    verification_status,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    user_full_name,
    user_role,
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'institution_id')::uuid,
    case 
      when user_role in ('government', 'doctor', 'institution') then 'pending'
      else 'verified'
    end,
    now(),
    now()
  );

  return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. HELPER FUNCTIONS FOR RLS (Security Definer helpers avoid recursion)
create or replace function public.current_user_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_institution()
returns uuid
language sql
security definer
stable
as $$
  select institution_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin_or_gov()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'government')
  );
$$;

create or replace function public.is_doctor_for_institution(inst_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role = 'doctor'
    and (
      p.institution_id = inst_id
      or exists (
        select 1 from public.institution_memberships m
        where m.user_id = p.id and m.institution_id = inst_id
      )
    )
  );
$$;

create or replace function public.increment_occupancy(inst_id uuid)
returns void
language sql
security definer
as $$
  update public.institutions
  set current_occupancy = current_occupancy + 1,
      updated_at = now()
  where id = inst_id;
$$;

create or replace function public.decrement_occupancy(inst_id uuid)
returns void
language sql
security definer
as $$
  update public.institutions
  set current_occupancy = greatest(0, current_occupancy - 1),
      updated_at = now()
  where id = inst_id;
$$;


-- 3. GRANULAR ROW LEVEL SECURITY POLICIES

-- PROFILES POLICIES
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (
    auth.uid() = id or public.is_admin_or_gov()
  );

drop policy if exists "Users can update non-privileged profile fields" on public.profiles;
create policy "Users can update non-privileged profile fields"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id and (
      -- Regular users cannot self-escalate role or verification status
      role = (select role from public.profiles where id = auth.uid())
      and verification_status = (select verification_status from public.profiles where id = auth.uid())
    )
    or public.is_admin_or_gov()
  );


-- INSTITUTIONS POLICIES
drop policy if exists "Institutions viewable by authenticated" on public.institutions;
create policy "Institutions viewable by authenticated"
  on public.institutions for select
  to authenticated
  using (
    verification_status = 'verified' 
    or id = public.current_user_institution()
    or public.is_admin_or_gov()
  );

drop policy if exists "Government and Admin can insert institutions" on public.institutions;
create policy "Government and Admin can insert institutions"
  on public.institutions for insert
  to authenticated
  with check (public.is_admin_or_gov() or public.current_user_role() = 'institution');

drop policy if exists "Institution superintendents and admin can update" on public.institutions;
create policy "Institution superintendents and admin can update"
  on public.institutions for update
  to authenticated
  using (
    id = public.current_user_institution() or public.is_admin_or_gov()
  );


-- BENEFICIARIES POLICIES
drop policy if exists "Beneficiaries access policy" on public.beneficiaries;
create policy "Beneficiaries access policy"
  on public.beneficiaries for select
  to authenticated
  using (
    institution_id = public.current_user_institution()
    or public.is_admin_or_gov()
    or public.is_doctor_for_institution(institution_id)
  );

drop policy if exists "Institution staff can insert beneficiaries" on public.beneficiaries;
create policy "Institution staff can insert beneficiaries"
  on public.beneficiaries for insert
  to authenticated
  with check (
    (institution_id = public.current_user_institution() and public.current_user_role() = 'institution')
    or public.is_admin_or_gov()
  );

drop policy if exists "Institution staff can update beneficiaries" on public.beneficiaries;
create policy "Institution staff can update beneficiaries"
  on public.beneficiaries for update
  to authenticated
  using (
    institution_id = public.current_user_institution() or public.is_admin_or_gov()
  );


-- MEDICAL RECORDS POLICIES (Strict medical confidentiality)
drop policy if exists "Doctors can view medical records for assigned homes" on public.medical_records;
create policy "Doctors can view medical records for assigned homes"
  on public.medical_records for select
  to authenticated
  using (
    exists (
      select 1 from public.beneficiaries b
      where b.id = beneficiary_id
      and (
        public.is_doctor_for_institution(b.institution_id)
        or public.is_admin_or_gov()
      )
    )
  );

drop policy if exists "Only doctors can insert medical records" on public.medical_records;
create policy "Only doctors can insert medical records"
  on public.medical_records for insert
  to authenticated
  with check (
    public.current_user_role() in ('doctor', 'admin')
  );

drop policy if exists "Only doctors can update medical records" on public.medical_records;
create policy "Only doctors can update medical records"
  on public.medical_records for update
  to authenticated
  using (
    public.current_user_role() in ('doctor', 'admin')
  );


-- DONATIONS POLICIES
drop policy if exists "Donors view their own donations" on public.donations;
create policy "Donors view their own donations"
  on public.donations for select
  to authenticated
  using (
    donor_id = auth.uid()
    or institution_id = public.current_user_institution()
    or public.is_admin_or_gov()
  );

drop policy if exists "Donors can create donations" on public.donations;
create policy "Donors can create donations"
  on public.donations for insert
  to authenticated
  with check (
    donor_id = auth.uid() or public.is_admin_or_gov()
  );


-- ALERTS POLICIES
drop policy if exists "Authorized personnel view alerts" on public.alerts;
create policy "Authorized personnel view alerts"
  on public.alerts for select
  to authenticated
  using (
    institution_id = public.current_user_institution()
    or public.is_doctor_for_institution(institution_id)
    or public.is_admin_or_gov()
  );

drop policy if exists "Doctors and Superintendents can acknowledge alerts" on public.alerts;
create policy "Doctors and Superintendents can acknowledge alerts"
  on public.alerts for update
  to authenticated
  using (
    institution_id = public.current_user_institution()
    or public.is_doctor_for_institution(institution_id)
    or public.is_admin_or_gov()
  );
