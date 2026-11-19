# Welfare AI Microservice (Python FastAPI + Scikit-Learn)

This service provides machine learning regression for institutional resource forecasting and deep learning classification for beneficiary health-risk triage in the **AI-Driven Smart Welfare Resource Management System**.

---

## 1. System Overview

- **Framework:** FastAPI with Uvicorn ASGI server
- **ML Tooling:** Scikit-Learn, XGBoost, NumPy, Pydantic v2
- **Port:** `http://localhost:8000` (default)
- **Frontend Integration:** Directly called by `RemoteAIAdapter` in Next.js when `NEXT_PUBLIC_AI_ADAPTER_MODE=remote`.

---

## 2. API Contracts & Endpoints

All endpoints adhere strictly to the TypeScript interface contracts declared in [`src/lib/ai/types.ts`](file:///c:/Users/Nibha%20kumari%20gupta/Desktop/mca%20nibha/practice%20of%20project/Wellfare%20System/src/lib/ai/types.ts).

### 2.1 Health Check
- **Route:** `GET /health`
- **Response:**
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "service": "Welfare Resource & Health AI Microservice",
    "academic_integrity_mode": "enforced"
  }
  ```

### 2.2 Resource Demand Forecasting
- **Route:** `POST /predict/resource-demand`
- **Request Body:**
  ```json
  {
    "institution_id": "inst-001",
    "resident_count": 48,
    "season": "winter",
    "is_festival_month": true,
    "prev_3m_avg_food_kg": 650.0,
    "prev_3m_avg_expense_inr": 85000.0
  }
  ```
- **Response Body:**
  ```json
  {
    "target": "food_provisions_kg",
    "predicted_value": 782.4,
    "unit": "kg",
    "model_name": "RandomForestRegressor",
    "model_version": "v1.0.0",
    "model_tier": "candidate_heuristic",
    "confidence_score": 0.88,
    "factors": [
      { "feature": "resident_count", "impact": "+42.5%" },
      { "feature": "seasonal_winter_heating", "impact": "+15.0%" },
      { "feature": "festival_month_provisions", "impact": "+10.0%" }
    ],
    "is_synthetic": true,
    "disclaimer": "Academic benchmark candidate. Real predictions require retraining on authentic historical ledger data."
  }
  ```

### 2.3 Clinical Health-Risk Triage
- **Route:** `POST /predict/health-risk`
- **Request Body:**
  ```json
  {
    "beneficiary_id": "ben-001",
    "age": 74,
    "gender": "male",
    "systolic_bp": 148.0,
    "diastolic_bp": 92.0,
    "blood_glucose_mg_dl": 165.0,
    "has_chronic_illness": true,
    "medication_count": 3,
    "mobility_score": 4,
    "weights": {
      "age_factor": 0.20,
      "clinical_ml_risk": 0.35,
      "chronic_history": 0.25,
      "medication_dependency": 0.20
    }
  }
  ```
- **Response Body:**
  ```json
  {
    "risk_level": "High",
    "risk_score": 78.4,
    "priority_score": 76.5,
    "requires_immediate_attention": true,
    "confidence_score": 0.85,
    "model_name": "MLPClassifier-Triage",
    "model_version": "v1.0.0",
    "shap_factors": [
      { "feature": "Systolic Blood Pressure (148.0 mmHg)", "impact": "+0.32 SHAP", "direction": "positive" },
      { "feature": "Advanced Age (74 yrs)", "impact": "+0.28 SHAP", "direction": "positive" },
      { "feature": "Chronic Condition Present", "impact": "+0.22 SHAP", "direction": "positive" }
    ],
    "disclaimer": "Clinical decision-support only. Not a medical diagnosis. Licensed physician review required."
  }
  ```

---

## 3. Local Setup & Execution

### Step 1: Create and Activate Python Virtual Environment

**Windows (PowerShell):**
```powershell
cd "c:\Users\Nibha kumari gupta\Desktop\mca nibha\practice of project\Wellfare System\ai-service"
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the FastAPI Microservice
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The interactive Swagger API documentation will be available at:
`http://localhost:8000/docs`

### Step 4: Configure the Next.js Web App
In the root directory's `.env.local`:
```env
NEXT_PUBLIC_AI_ADAPTER_MODE=remote
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```
When running Next.js (`npm run dev`), the client seamlessly executes predictions through this Python microservice. If the microservice is offline, Next.js automatically and gracefully falls back to the local `DemoAIAdapter`.

---

## 4. Academic Integrity & Safety Rules

1. **Non-Fabrication Policy (Rule 4 & 16):** Untrained models must never report fabricated metrics (e.g., claiming 99.4% accuracy or 0.01 MAE). Unvalidated values are labeled `TBD` or `XX.XX`.
2. **Clinical Boundary (Rule 6):** Health-risk outputs are classified as clinical decision-support triage scores only and must never be presented as an autonomous medical diagnosis.
