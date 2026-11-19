# API CONTRACTS & SCHEMAS

**Document Purpose:** Interface contracts, HTTP route specifications, JSON payload schemas, and error models.  
**Version:** 1.0.0  

---

## 1. Python FastAPI Microservice Endpoints (`ai-service`)

### 1.1 Health Probe
- **Method:** `GET /health`
- **Response `200 OK`:**
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "service": "Welfare Resource & Health AI Microservice",
    "academic_integrity_mode": "enforced"
  }
  ```

---

### 1.2 Resource Demand Forecast
- **Method:** `POST /predict/resource-demand`
- **Request Headers:** `Content-Type: application/json`
- **Request Payload (`ResourceForecastInput`):**
  ```json
  {
    "institution_id": "24af4f81-d923-49a2-84f6-703c1b193827",
    "resident_count": 52,
    "season": "winter",
    "is_festival_month": true,
    "prev_3m_avg_food_kg": 720.0,
    "prev_3m_avg_expense_inr": 95000.0
  }
  ```
- **Validation Rules:**
  - `resident_count`: integer $\ge 1$.
  - `season`: string enum `["winter", "summer", "monsoon", "autumn"]`.
  - `is_festival_month`: boolean.
- **Response `200 OK` (`ResourceForecastResult[]`):**
  ```json
  [
    {
      "target": "food_provisions_kg",
      "predicted_value": 816.4,
      "unit": "kg",
      "model_name": "RandomForestRegressor",
      "model_version": "v1.0.0",
      "model_tier": "candidate_heuristic",
      "confidence_score": 0.88,
      "factors": [
        { "feature": "resident_count (52)", "impact": "+45.2%" },
        { "feature": "season_winter", "impact": "+15.0%" },
        { "feature": "is_festival_month", "impact": "+10.0%" }
      ],
      "is_synthetic": true,
      "disclaimer": "Academic benchmark candidate. Real predictions require retraining on authentic historical ledger data."
    }
  ]
  ```

---

### 1.3 Clinical Health-Risk Triage
- **Method:** `POST /predict/health-risk`
- **Request Headers:** `Content-Type: application/json`
- **Request Payload (`HealthRiskInput`):**
  ```json
  {
    "beneficiary_id": "c7112028-592b-42ea-a4be-47b2c58908d2",
    "age": 78,
    "gender": "female",
    "systolic_bp": 154.0,
    "diastolic_bp": 94.0,
    "blood_glucose_mg_dl": 180.0,
    "bmi": 26.4,
    "has_chronic_illness": true,
    "chronic_diseases_count": 2,
    "medication_count": 4,
    "mobility_score": 3,
    "weights": {
      "age_factor": 0.20,
      "clinical_ml_risk": 0.35,
      "chronic_history": 0.25,
      "medication_dependency": 0.20
    }
  }
  ```
- **Response `200 OK` (`HealthRiskResult`):**
  ```json
  {
    "risk_level": "High",
    "risk_score": 82.5,
    "priority_score": 79.0,
    "requires_immediate_attention": true,
    "confidence_score": 0.86,
    "model_name": "MLPClassifier-Triage",
    "model_version": "v1.0.0",
    "shap_factors": [
      { "feature": "Systolic Blood Pressure (154.0 mmHg)", "impact": "+0.34 SHAP", "direction": "positive" },
      { "feature": "Fasting Glucose (180.0 mg/dL)", "impact": "+0.28 SHAP", "direction": "positive" },
      { "feature": "Geriatric Age Bracket (78 yrs)", "impact": "+0.22 SHAP", "direction": "positive" }
    ],
    "disclaimer": "Clinical decision-support only. Not a medical diagnosis. Licensed physician review required."
  }
  ```

---

## 2. Standard Error Response Schema

All HTTP 4xx and 5xx errors return a unified JSON payload:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed on request parameters",
    "details": [
      {
        "field": "resident_count",
        "issue": "Resident count must be greater than or equal to 1"
      }
    ],
    "timestamp": "2026-11-19T15:20:00Z"
  }
}
```
