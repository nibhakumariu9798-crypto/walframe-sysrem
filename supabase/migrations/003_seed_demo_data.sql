-- =============================================================================
-- Migration: 003_seed_demo_data.sql
-- Project: AI-Driven Smart Welfare Resource Management System
-- Purpose: Canonical synthetic seed data for local development & demonstration
-- Safety: All records marked is_synthetic = true; decision support only
-- =============================================================================

-- 1. SEED INSTITUTIONS
insert into public.institutions (
  id, name, institution_type, registration_number, address, city, state, pincode, contact_email, contact_phone, capacity, current_occupancy, verification_status
) values 
  (
    '24af4f81-d923-49a2-84f6-703c1b193827',
    'Aashraya Children''s Home',
    'orphanage',
    'REG-ORPH-2024-0412',
    'Plot 14, Shanti Nagar, Sector 5',
    'Ranchi',
    'Jharkhand',
    '834001',
    'contact@aashrayahome.org',
    '+91 94311 22334',
    65,
    52,
    'verified'
  ),
  (
    '5e5b77d7-f16f-4304-b3fe-ccbf565333fc',
    'Sandhya Prakash Senior Living Care',
    'old_age_home',
    'REG-OAH-2023-0189',
    '42 Anand Vihar, Bypass Road',
    'Ranchi',
    'Jharkhand',
    '834002',
    'support@sandhyaprakash.org',
    '+91 94311 55667',
    50,
    44,
    'verified'
  ),
  (
    'dd520f92-c8e2-44b9-ba65-00ce9863448c',
    'Sneha Sadan Integrated Care Foundation',
    'mixed',
    'REG-MIX-2025-0891',
    'Village Kanke, P.O. Birsa',
    'Ranchi',
    'Jharkhand',
    '834006',
    'info@snehasadan.org',
    '+91 94311 88990',
    90,
    78,
    'verified'
  ),
  (
    'dcd3ead6-ca20-4620-b89c-7fc7bc0752e0',
    'Navjeevan Seva Sadan',
    'orphanage',
    'REG-ORPH-2026-0922',
    'Near Circuit House, Morabadi',
    'Ranchi',
    'Jharkhand',
    '834008',
    'admin@navjeevan.org',
    '+91 94311 77112',
    40,
    28,
    'pending'
  )
on conflict (id) do nothing;


-- 2. SEED BENEFICIARIES
insert into public.beneficiaries (
  id, institution_id, beneficiary_type, identifier_code, first_name, gender, age, admission_date, status, special_needs
) values
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    '24af4f81-d923-49a2-84f6-703c1b193827',
    'child',
    'BEN-CHI-2024-001',
    'Aarav',
    'male',
    8,
    '2024-02-15',
    'active',
    'Mild lactose sensitivity'
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    '24af4f81-d923-49a2-84f6-703c1b193827',
    'child',
    'BEN-CHI-2024-002',
    'Pooja',
    'female',
    11,
    '2024-04-10',
    'active',
    null
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    '5e5b77d7-f16f-4304-b3fe-ccbf565333fc',
    'elderly',
    'BEN-ELD-2023-008',
    'Rameshwar',
    'male',
    76,
    '2023-09-01',
    'active',
    'Hypertension, early osteoarthritis'
  ),
  (
    'a1b2c3d4-0004-4000-8000-000000000004',
    '5e5b77d7-f16f-4304-b3fe-ccbf565333fc',
    'elderly',
    'BEN-ELD-2023-014',
    'Savitri Devi',
    'female',
    82,
    '2023-11-20',
    'active',
    'Type-2 diabetes, walker dependent'
  )
on conflict (id) do nothing;


-- 3. SEED INVENTORY ITEMS
insert into public.inventory_items (
  institution_id, category, item_name, current_stock, unit, reorder_threshold
) values
  ('24af4f81-d923-49a2-84f6-703c1b193827', 'food', 'Fortified Rice', 140, 'kg', 200),
  ('24af4f81-d923-49a2-84f6-703c1b193827', 'food', 'Toor Dal (Lentils)', 85, 'kg', 60),
  ('24af4f81-d923-49a2-84f6-703c1b193827', 'clothing', 'Winter Woolen Sweaters', 45, 'units', 50),
  ('5e5b77d7-f16f-4304-b3fe-ccbf565333fc', 'medicine', 'Amlodipine 5mg (Anti-hypertensive)', 180, 'units', 100),
  ('5e5b77d7-f16f-4304-b3fe-ccbf565333fc', 'medicine', 'Metformin 500mg', 60, 'units', 150),
  ('5e5b77d7-f16f-4304-b3fe-ccbf565333fc', 'food', 'Whole Wheat Flour', 210, 'kg', 180)
on conflict do nothing;


-- 4. SEED HISTORICAL RESOURCE CONSUMPTION (ML Training Data)
insert into public.resource_records (
  institution_id, record_year, record_month, season, is_festival_month, resident_count, food_consumed_kg, clothing_units, medicine_units, monthly_expense_inr, donations_received_inr, is_synthetic
) values
  ('24af4f81-d923-49a2-84f6-703c1b193827', 2025, 10, 'autumn', true, 50, 780, 25, 32, 92000, 110000, true),
  ('24af4f81-d923-49a2-84f6-703c1b193827', 2025, 11, 'winter', false, 51, 805, 42, 36, 96500, 85000, true),
  ('24af4f81-d923-49a2-84f6-703c1b193827', 2025, 12, 'winter', true, 52, 840, 50, 38, 105000, 140000, true),
  ('24af4f81-d923-49a2-84f6-703c1b193827', 2026, 1, 'winter', false, 52, 820, 20, 37, 98000, 75000, true),
  ('24af4f81-d923-49a2-84f6-703c1b193827', 2026, 2, 'summer', false, 52, 795, 15, 30, 91000, 68000, true)
on conflict do nothing;


-- 5. SEED DONATIONS
insert into public.donations (
  institution_id, donation_type, category, amount_inr, receipt_number, is_anonymous, allocated_purpose, status
) values
  ('24af4f81-d923-49a2-84f6-703c1b193827', 'monetary', 'food', 25000, 'REC-2026-03-001', false, 'Grain and nutrition procurement', 'utilized'),
  ('24af4f81-d923-49a2-84f6-703c1b193827', 'monetary', 'clothing', 15000, 'REC-2026-03-002', false, 'Annual school uniforms & warm wear', 'allocated'),
  ('5e5b77d7-f16f-4304-b3fe-ccbf565333fc', 'monetary', 'medicine', 30000, 'REC-2026-03-003', true, 'Cardiac and diabetic care supplies', 'received')
on conflict (receipt_number) do nothing;


-- 6. SEED ALERTS
insert into public.alerts (
  institution_id, beneficiary_id, alert_type, severity, priority_score, title, description, status, is_synthetic
) values
  (
    '5e5b77d7-f16f-4304-b3fe-ccbf565333fc',
    'a1b2c3d4-0003-4000-8000-000000000003',
    'health_risk',
    'high',
    78.5,
    'High Risk — Professional Physician Review Required',
    'Beneficiary BEN-ELD-2023-008 shows recurring systolic BP spikes (>155 mmHg) alongside fasting sugar elevation. Doctor review queued.',
    'pending_review',
    true
  ),
  (
    '24af4f81-d923-49a2-84f6-703c1b193827',
    null,
    'stock_shortage',
    'medium',
    55.0,
    'Stock Alert: Fortified Rice below threshold',
    'Current stock of Fortified Rice is 140 kg (reorder threshold: 200 kg). Next month predicted consumption: 825 kg.',
    'acknowledged',
    true
  )
on conflict do nothing;


-- 7. SEED AI PREDICTIONS
insert into public.predictions (
  institution_id, beneficiary_id, prediction_domain, target_variable, model_name, model_version, model_tier, input_features, predicted_value, predicted_class, confidence_score, explanation_payload, is_synthetic
) values
  (
    '24af4f81-d923-49a2-84f6-703c1b193827',
    null,
    'resource_forecast',
    'food_requirement',
    'XGBoost-Regressor-Baseline',
    'v0.1-synthetic-adapter',
    'demo',
    '{"resident_count": 52, "season": "summer", "is_festival_month": false, "prev_3m_avg_kg": 795}'::jsonb,
    825.4,
    null,
    0.88,
    '{"unit": "kg", "factors": [{"impact": "+45 kg", "feature": "resident_count"}, {"impact": "+12 kg", "feature": "seasonal_trend"}]}'::jsonb,
    true
  ),
  (
    '5e5b77d7-f16f-4304-b3fe-ccbf565333fc',
    'a1b2c3d4-0003-4000-8000-000000000003',
    'health_risk',
    'health_risk_level',
    'MLP-HealthClassifier-Baseline',
    'v0.1-synthetic-adapter',
    'demo',
    '{"age": 76, "systolic_bp": 158, "diastolic_bp": 94, "blood_sugar_fasting": 168, "bmi": 26.4, "chronic_diseases_count": 2}'::jsonb,
    78.5,
    'high_risk',
    0.84,
    '{"welfare_priority_score": 78.5, "requires_doctor_review": true, "shap_contributions": [{"feature": "systolic_bp", "contribution": "+0.32 (Elevated)"}, {"feature": "age", "contribution": "+0.24 (Geriatric)"}]}'::jsonb,
    true
  )
on conflict do nothing;
