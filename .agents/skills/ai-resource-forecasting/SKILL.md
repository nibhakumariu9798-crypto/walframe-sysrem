---
name: ai-resource-forecasting
description: Builds the resource-demand forecasting workflow for food, clothing, medicine, and budget using research-safe data pipelines and versioned ML model adapters.
---

# AI Resource Forecasting Skill

## Use when

Use when implementing resource-demand prediction, historical resource analytics, experiment metadata, feature engineering, model comparison, or forecast presentation.

## Research objective

Predict the next month's requirement for:
- food
- clothing
- medicine
- budget

Candidate research models:
- Linear Regression
- Random Forest
- XGBoost

Metrics:
- MAE
- RMSE
- R²

## Data pipeline

1. Ingest source data from approved CSV/DB/API sources.
2. Validate schema and units.
3. Remove duplicates.
4. Identify invalid numeric ranges.
5. Impute missing numeric/categorical values according to the research specification.
6. Encode categorical values.
7. Engineer season, festival month, resident counts, age-group counts, and rolling/previous-three-month consumption features when enough history exists.
8. Use chronological train/test separation for temporal forecasting to avoid future leakage.
9. Perform feature selection only after the preprocessing pipeline is defined.
10. Train candidate models and record model version + parameters + dataset version.
11. Evaluate with MAE, RMSE, R².
12. Publish a model artifact only when validation passes defined checks.

## Important implementation boundary

Prefer Python for training/scikit-learn/XGBoost workloads. The Next.js application should call a typed inference/training service through an adapter.

The web app must support a `demo` adapter that is explicitly labeled and deterministic enough for UI testing, but it must never be mistaken for a validated model.

## Prediction record

Store prediction metadata including model name, model version, generated timestamp, target type, input snapshot/reference, predicted value, and review/status state.

## UI requirements

A forecast screen should show:
- selected institution;
- forecast month;
- target resource;
- predicted quantity/value;
- historical trend;
- model name/version;
- data freshness;
- confidence/interval only if the model supports a meaningful estimate;
- explicit demo/research/production status.

Never display invented accuracy badges.
