import {
  AIAdapter,
  HealthRiskInput,
  HealthRiskResult,
  ResourceForecastInput,
  ResourceForecastResult,
} from "./types";

export class DemoAIAdapter implements AIAdapter {
  async forecastResource(
    input: ResourceForecastInput
  ): Promise<ResourceForecastResult[]> {
    const { resident_count, season, is_festival_month, prev_3m_avg_food_kg } =
      input;

    // Baseline food requirement: ~15.2 kg per resident/month
    const baseFood = prev_3m_avg_food_kg
      ? prev_3m_avg_food_kg * 1.02
      : resident_count * 15.2;
    const seasonMultiplier =
      season === "winter" ? 1.05 : season === "summer" ? 0.98 : 1.0;
    const festivalMultiplier = is_festival_month ? 1.12 : 1.0;
    const predictedFood = Math.round(
      baseFood * seasonMultiplier * festivalMultiplier
    );

    // Clothing: ~0.3 units per resident/month, surge before winter or festival
    const predictedClothing = Math.round(
      resident_count * (season === "winter" ? 0.5 : 0.25) * (is_festival_month ? 1.4 : 1.0)
    );

    // Medicine: ~0.6 units per resident/month, higher in winter/monsoon
    const medMultiplier = season === "winter" || season === "monsoon" ? 1.2 : 1.0;
    const predictedMedicine = Math.round(resident_count * 0.65 * medMultiplier);

    // Monthly Budget: ~₹1,750 per resident + base operations
    const predictedBudget = Math.round(
      (resident_count * 1750 + 8000) * (is_festival_month ? 1.15 : 1.0)
    );

    return [
      {
        target: "food",
        predicted_value: predictedFood,
        unit: "kg",
        model_name: "XGBoost-Regressor-Baseline (Simulated)",
        model_version: "v0.1-demo",
        model_tier: "demo",
        confidence_score: 0.89,
        factors: [
          { feature: "resident_count", impact: `+${Math.round(resident_count * 15)} kg` },
          { feature: "season", impact: `${season} adjustment` },
          { feature: "festival_factor", impact: is_festival_month ? "+12%" : "normal" },
        ],
        is_synthetic: true,
        disclaimer:
          "DEMO FORECAST: Model estimate generated via synthetic baseline pipeline. Not verified for production procurement without institutional review.",
      },
      {
        target: "clothing",
        predicted_value: predictedClothing,
        unit: "units",
        model_name: "RandomForest-Regressor (Simulated)",
        model_version: "v0.1-demo",
        model_tier: "demo",
        confidence_score: 0.82,
        factors: [
          { feature: "seasonal_demand", impact: season },
          { feature: "festival_cycles", impact: is_festival_month ? "high" : "nominal" },
        ],
        is_synthetic: true,
        disclaimer:
          "DEMO FORECAST: Synthetic estimate for planning prototypes only.",
      },
      {
        target: "medicine",
        predicted_value: predictedMedicine,
        unit: "units",
        model_name: "RandomForest-Regressor (Simulated)",
        model_version: "v0.1-demo",
        model_tier: "demo",
        confidence_score: 0.85,
        factors: [
          { feature: "health_profile_density", impact: `${resident_count} individuals` },
          { feature: "seasonal_vulnerability", impact: season },
        ],
        is_synthetic: true,
        disclaimer:
          "DEMO FORECAST: Medical resource estimates require authorized physician sign-off.",
      },
      {
        target: "budget",
        predicted_value: predictedBudget,
        unit: "INR",
        model_name: "LinearRegression-Ensemble (Simulated)",
        model_version: "v0.1-demo",
        model_tier: "demo",
        confidence_score: 0.91,
        factors: [
          { feature: "per_capita_cost", impact: "₹1,750 / resident" },
          { feature: "fixed_utilities", impact: "₹8,000 base" },
        ],
        is_synthetic: true,
        disclaimer:
          "DEMO FORECAST: Simulated budgetary projections for financial planning mockups.",
      },
    ];
  }

  async classifyHealthRisk(input: HealthRiskInput): Promise<HealthRiskResult> {
    const {
      age,
      systolic_bp = 120,
      diastolic_bp = 80,
      blood_sugar_fasting = 90,
      bmi = 22,
      chronic_diseases_count = 0,
      medication_dependency_count = 0,
    } = input;

    // Configurable heuristic weights (default to manuscript Sec. 10 defaults)
    let maxAgeWeight = 20;
    let maxDlWeight = 35;
    let maxChronicWeight = 25;
    let maxMedWeight = 20;
    let doctorThreshold = 70;

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("welfare_priority_weights");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.ageWeight) maxAgeWeight = Number(parsed.ageWeight);
          if (parsed.dlRiskWeight) maxDlWeight = Number(parsed.dlRiskWeight);
          if (parsed.chronicWeight) maxChronicWeight = Number(parsed.chronicWeight);
          if (parsed.medWeight) maxMedWeight = Number(parsed.medWeight);
          if (parsed.threshold) doctorThreshold = Number(parsed.threshold);
        }
      } catch {
        // Safe fallback to defaults
      }
    }

    // 1. Age risk heuristic
    let ageRiskFraction = 0.25;
    if (age >= 80 || age < 5) ageRiskFraction = 1.0;
    else if (age >= 70 || age < 10) ageRiskFraction = 0.75;
    else if (age >= 60) ageRiskFraction = 0.5;
    const ageRisk = Math.round(maxAgeWeight * ageRiskFraction);

    // 2. DL Health risk proxy
    let clinicalFraction = 0.2;
    if (systolic_bp >= 160 || diastolic_bp >= 100 || blood_sugar_fasting >= 200) {
      clinicalFraction += 0.6;
    } else if (systolic_bp >= 140 || diastolic_bp >= 90 || blood_sugar_fasting >= 140) {
      clinicalFraction += 0.35;
    }

    if (bmi >= 30 || bmi < 16) {
      clinicalFraction += 0.2;
    } else if (bmi >= 25 || bmi < 18.5) {
      clinicalFraction += 0.1;
    }
    const clinicalRisk = Math.round(maxDlWeight * Math.min(1.0, clinicalFraction));

    // 3. Chronic disease history
    const chronicFraction = Math.min(1.0, chronic_diseases_count * 0.5);
    const chronicRisk = Math.round(maxChronicWeight * chronicFraction);

    // 4. Medicine dependency
    const medicationFraction = Math.min(1.0, medication_dependency_count * 0.4);
    const medicationRisk = Math.round(maxMedWeight * medicationFraction);

    // Composite Priority Score (0-100)
    const totalScore = Math.min(
      100,
      Math.round(ageRisk + clinicalRisk + chronicRisk + medicationRisk)
    );

    const riskClass =
      totalScore >= doctorThreshold ? "high" : totalScore >= 40 ? "medium" : "low";
    const requiresDoctorReview = totalScore >= doctorThreshold;

    return {
      beneficiary_id: input.beneficiary_id,
      risk_class: riskClass,
      welfare_priority_score: totalScore,
      requires_doctor_review: requiresDoctorReview,
      model_name: "MLP-HealthClassifier (Simulated Demo)",
      model_version: "v0.1-synthetic",
      model_tier: "demo",
      confidence_score: 0.86,
      shap_contributions: [
        {
          feature: "blood_pressure",
          contribution: systolic_bp >= 140 ? "+0.31 (Elevated)" : "+0.02 (Normal)",
        },
        {
          feature: "chronic_diseases",
          contribution: chronic_diseases_count > 0 ? `+0.28 (${chronic_diseases_count} active)` : "0.00",
        },
        {
          feature: "age_bracket",
          contribution: age >= 65 ? "+0.21 (Geriatric)" : "+0.05",
        },
        {
          feature: "blood_sugar",
          contribution: blood_sugar_fasting >= 130 ? "+0.18 (Elevated)" : "+0.01",
        },
      ],
      is_synthetic: true,
      medical_disclaimer:
        "DECISION SUPPORT ONLY: This assessment is an automated algorithmic heuristic for professional clinical prioritization. It is NOT a medical diagnosis, does not prescribe treatment, and must be reviewed by a licensed physician.",
    };
  }
}
