export type UserRole =
  | "government"
  | "ngo"
  | "institution"
  | "doctor"
  | "donor"
  | "volunteer"
  | "admin";

export type InstitutionType = "orphanage" | "old_age_home" | "mixed";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type BeneficiaryType = "child" | "elderly";
export type BeneficiaryStatus = "active" | "transferred" | "discharged";
export type Gender = "male" | "female" | "other";

export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type AlertStatus = "pending_review" | "acknowledged" | "resolved";
export type AlertType =
  | "health_risk"
  | "stock_shortage"
  | "budget_deficit"
  | "unverified_institution";

export type ModelTier = "demo" | "research" | "production";
export type PredictionDomain = "resource_forecast" | "health_risk";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  institution_id?: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Institution {
  id: string;
  name: string;
  institution_type: InstitutionType;
  registration_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contact_email: string;
  contact_phone: string;
  capacity: number;
  current_occupancy: number;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Beneficiary {
  id: string;
  institution_id: string;
  beneficiary_type: BeneficiaryType;
  identifier_code: string;
  first_name: string;
  gender: Gender;
  age: number;
  admission_date: string;
  status: BeneficiaryStatus;
  special_needs?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  beneficiary_id: string;
  recorded_by?: string | null;
  measurement_date: string;
  systolic_bp?: number | null;
  diastolic_bp?: number | null;
  blood_sugar_fasting?: number | null;
  weight_kg?: number | null;
  height_cm?: number | null;
  bmi?: number | null;
  chronic_diseases: string[];
  current_medications: string[];
  mobility_status?: string | null;
  doctor_notes?: string | null;
  is_synthetic: boolean;
  created_at: string;
}

export interface ResourceRecord {
  id: string;
  institution_id: string;
  record_year: number;
  record_month: number;
  season: "winter" | "summer" | "monsoon" | "autumn";
  is_festival_month: boolean;
  resident_count: number;
  food_consumed_kg: number;
  clothing_units: number;
  medicine_units: number;
  monthly_expense_inr: number;
  donations_received_inr: number;
  is_synthetic: boolean;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  institution_id: string;
  category: "food" | "clothing" | "medicine" | "budget" | "hygiene" | "educational";
  item_name: string;
  current_stock: number;
  unit: string;
  reorder_threshold: number;
  last_restocked_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id?: string | null;
  institution_id: string;
  donation_type: "monetary" | "in_kind";
  category: "food" | "clothing" | "medicine" | "budget" | "general";
  amount_inr?: number | null;
  item_description?: string | null;
  quantity?: number | null;
  unit?: string | null;
  status: "pledged" | "received" | "allocated" | "utilized";
  receipt_number: string;
  is_anonymous: boolean;
  allocated_purpose?: string | null;
  donated_at: string;
  created_at: string;
}

export interface Alert {
  id: string;
  institution_id: string;
  beneficiary_id?: string | null;
  alert_type: AlertType;
  severity: AlertSeverity;
  priority_score?: number | null;
  title: string;
  description: string;
  status: AlertStatus;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  resolution_notes?: string | null;
  is_synthetic: boolean;
  created_at: string;
}

export interface Prediction {
  id: string;
  institution_id?: string | null;
  beneficiary_id?: string | null;
  prediction_domain: PredictionDomain;
  target_variable: string;
  model_name: string;
  model_version: string;
  model_tier: ModelTier;
  input_features: Record<string, unknown>;
  predicted_value?: number | null;
  predicted_class?: string | null;
  confidence_score?: number | null;
  explanation_payload?: Record<string, unknown>;
  is_synthetic: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, unknown>;
  ip_address?: string | null;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link_url?: string | null;
  is_read: boolean;
  created_at: string;
}
