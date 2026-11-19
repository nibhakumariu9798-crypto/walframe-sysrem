import { ModelTier } from "@/types";

export interface ResourceForecastInput {
  institution_id: string;
  resident_count: number;
  season: "winter" | "summer" | "monsoon" | "autumn";
  is_festival_month: boolean;
  prev_3m_avg_food_kg?: number;
  prev_3m_avg_expense_inr?: number;
}

export interface ResourceForecastResult {
  target: "food" | "clothing" | "medicine" | "budget";
  predicted_value: number;
  unit: string;
  model_name: string;
  model_version: string;
  model_tier: ModelTier;
  confidence_score: number;
  factors: { feature: string; impact: string }[];
  is_synthetic: boolean;
  disclaimer: string;
}

export interface HealthRiskInput {
  beneficiary_id: string;
  age: number;
  gender: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  blood_sugar_fasting?: number;
  bmi?: number;
  chronic_diseases_count: number;
  medication_dependency_count: number;
}

export interface HealthRiskResult {
  beneficiary_id: string;
  risk_class: "low" | "medium" | "high";
  welfare_priority_score: number; // 0-100 heuristic
  requires_doctor_review: boolean;
  model_name: string;
  model_version: string;
  model_tier: ModelTier;
  confidence_score: number;
  shap_contributions: { feature: string; contribution: string }[];
  is_synthetic: boolean;
  medical_disclaimer: string;
}

export interface AIAdapter {
  forecastResource(input: ResourceForecastInput): Promise<ResourceForecastResult[]>;
  classifyHealthRisk(input: HealthRiskInput): Promise<HealthRiskResult>;
}
