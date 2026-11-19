# AI & MACHINE LEARNING ARCHITECTURE

**System Scope:** Dual-Task Machine Learning & Deep Learning Decision Support  
**Frameworks:** Scikit-Learn, XGBoost, PyTorch/TensorFlow (MLP), SHAP, FastAPI, TypeScript  
**Version:** 1.0.0  

---

## 1. Dual-Task Machine Learning Formulation

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Welfare AI Engine Pipeline                      │
├───────────────────────────────────┬────────────────────────────────────┤
│   Task 1: Resource Forecasting    │    Task 2: Clinical Health Triage  │
│  (Multivariate Time-Series Regr.) │    (Multiclass DL Classification)  │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Targets: Food, Clothes, Meds,   │ • Targets: Low / Medium / High Risk│
│   Budget                          │ • Composite Priority Score (0-100) │
│ • Features: Resident count,       │ • Features: Vitals, Glucose, BMI,  │
│   Seasonality, Festivals, Lags    │   Chronic illnesses, Mobility      │
│ • Models: Linear, RF, XGBoost     │ • Models: Logistic, RF, MLP        │
│ • Metrics: MAE, RMSE, R²          │ • Metrics: Precision, Recall, F1   │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Task 1: Institutional Resource Demand Forecasting

### 2.1 Problem Formulation
Let $\mathbf{x}_t \in \mathbb{R}^d$ represent the institutional feature vector for month $t$:
$$\mathbf{x}_t = [N_t, c_{\text{child}}, c_{\text{elderly}}, S_t, F_t, y_{t-1}, y_{t-2}, y_{t-3}]^T$$
Where:
- $N_t$: Total current resident occupancy.
- $c_{\text{child}}, c_{\text{elderly}}$: Proportional demographic density.
- $S_t \in \{\text{winter}, \text{summer}, \text{monsoon}, \text{autumn}\}$: One-hot encoded seasonal vector.
- $F_t \in \{0, 1\}$: Binary festive cycle indicator (e.g. Diwali, Eid, Christmas).
- $y_{t-k}$: Lagged historical consumption over previous quarters.

The objective is to train regression models $f_\theta(\mathbf{x}_t)$ minimizing the mean squared loss across 4 resource targets:
1. Food provisions (kg / month)
2. Clothing distribution kits (units / month)
3. Essential pharmaceutical supplies (units / month)
4. Operational expenditure budget (INR / month)

### 2.2 Candidate Regression Models
- **Baseline:** Ordinary Least Squares (OLS) Linear Regression with L2 regularization.
- **Ensemble Tree:** Random Forest Regressor ($n=100$, max depth $=10$).
- **Gradient Boosting:** XGBoost Regressor with early stopping ($\eta = 0.05$).

### 2.3 Validation Protocol & Temporal Splitting
To prevent temporal data leakage, records are partitioned chronologically:
- **Training Set:** Oldest 70% of chronological monthly ledger records.
- **Validation Set:** Middle 15% of records for hyperparameter tuning.
- **Testing Set:** Most recent 15% of records for uncompromised holdout evaluation.

---

## 3. Task 2: Clinical Health-Risk Triage & Priority Scoring

### 3.1 Physiological Feature Vector
$$\mathbf{z}_i = [\text{Age}_i, \text{Gender}_i, \text{SBP}_i, \text{DBP}_i, \text{Glucose}_i, \text{BMI}_i, C_i, M_i, \text{Mobility}_i]^T$$
Where:
- $\text{SBP}, \text{DBP}$: Systolic and Diastolic blood pressure (mmHg).
- $\text{Glucose}$: Fasting blood sugar level (mg/dL).
- $\text{BMI}$: Body Mass Index ($\text{kg}/\text{m}^2$).
- $C_i$: Count of diagnosed chronic conditions (Hypertension, Diabetes, Arthritis).
- $M_i$: Number of prescribed ongoing daily medications.
- $\text{Mobility}_i$: Functional mobility index (1 to 5 scale).

### 3.2 Deep Learning Multilayer Perceptron (MLP) Architecture
```
Input Layer (9 Features)
    │
Dense Layer (64 units, ReLU activation)
    │
Dropout (rate = 0.20)
    │
Dense Layer (32 units, ReLU activation)
    │
Dense Layer (16 units, ReLU activation)
    │
Output Layer (3 units, Softmax activation) ──> [P(Low), P(Medium), P(High)]
```

### 3.3 Composite Welfare Priority Scoring Equation
The final triage score $P \in [0, 100]$ is computed as a weighted sum of normalized risk factors:
$$P = \text{round}\Big( w_1 \cdot \text{NormAge} + w_2 \cdot \text{ML\_Risk} + w_3 \cdot \text{NormChronic} + w_4 \cdot \text{NormMeds} \Big)$$

**Default Configurable System Weights:**
- $w_1 = 0.20$ (Age factor: normalized against geriatric threshold $\ge 80$).
- $w_2 = 0.35$ (Clinical ML risk: predicted probability $P(\text{High}) \times 100$).
- $w_3 = 0.25$ (Chronic condition history).
- $w_4 = 0.20$ (Medication dependency count).

**Clinical Alert Trigger Boundary (Rule 6):**
$$\text{If } P \ge 70 \implies \text{Trigger High-Severity Alert } (\text{status} = \text{'pending\_review'})$$

---

## 4. Model Explainability via SHAP (Shapley Additive exPlanations)

To ensure clinical and administrative interpretability, every prediction generates local feature attribution values:
$$\phi_j(f, \mathbf{x}) = \sum_{S \subseteq F \setminus \{j\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} \Big[ f(S \cup \{j\}) - f(S) \Big]$$
- **Tree-based models:** Analyzed using `shap.TreeExplainer`.
- **Deep MLP models:** Analyzed using `shap.DeepExplainer`.
- **User Presentation:** Each health and forecast output renders the top contributing positive and negative factors directly within the UI drawer.

---

## 5. Dual-Mode Adapter Contract & Service Fallback

```typescript
export interface AIAdapterInterface {
  predictResourceDemand(input: ResourceForecastInput): Promise<ResourceForecastResult[]>;
  classifyHealthRisk(input: HealthRiskInput): Promise<HealthRiskResult>;
}
```
1. **`NEXT_PUBLIC_AI_ADAPTER_MODE=demo`:** Invokes `DemoAIAdapter` locally with deterministic algorithms and explicit `is_synthetic: true` flags.
2. **`NEXT_PUBLIC_AI_ADAPTER_MODE=remote`:** Invokes `RemoteAIAdapter`, issuing HTTP POST requests to `http://localhost:8000/predict/*`. If the service is unreachable or times out after 5000ms, it gracefully falls back to `DemoAIAdapter` without throwing unhandled exceptions.

---

## 6. Academic Integrity & Non-Fabrication Rule (Rule 4 & 16)
- The system strictly forbids fabricating empirical validation metrics (e.g. claiming 98.7% accuracy or 0.02 MAE for simulated mock models).
- The `/research` benchmark page keeps all unvalidated models marked as `TBD` or `XX.XX` until real empirical experiments are executed against authorized datasets.
- Medical outputs are labeled "Clinical Decision Support Only" and explicitly require review by a licensed physician.
