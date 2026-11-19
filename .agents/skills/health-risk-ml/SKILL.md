---
name: health-risk-ml
description: Implements privacy-conscious health-risk classification, model evaluation, explainability, alerts, and medical decision-support boundaries for beneficiary records.
---

# Health Risk ML Skill

## Use when

Use for medical record workflows, health-risk predictions, model evaluation, model explanations, alerts, or health-specific UI.

## Research objective

Classify beneficiaries as:
- low risk
- medium risk
- high risk

Research inputs may include:
- age
- gender where justified
- blood pressure
- weight
- BMI
- blood sugar
- disease history
- medication status

Candidate models:
- Logistic Regression baseline
- Random Forest
- XGBoost
- MLP
- LSTM only when genuinely sequential health measurements are available
- CNN only if medical images are later incorporated

Metrics:
- accuracy
- precision
- recall
- F1-score

## Safety boundary

The application is a decision-support system, not a diagnostic tool. High-risk predictions must be phrased as alerts for professional review, not as diagnoses.

## Data protection

1. Keep medical records separated from general beneficiary profiles.
2. Enforce tighter RLS for medical tables.
3. Minimize data displayed to non-medical roles.
4. Avoid placing raw medical values in URLs, logs, analytics events, or public search.
5. Record prediction/model version for reproducibility.
6. Store human review/acknowledgement status for alerts.

## Alert flow

Prediction → risk class → priority score/alert rules → doctor review queue → acknowledgement/action → audit event.

Do not auto-prescribe medication, alter treatment, or claim clinical certainty.

## Explainability

When SHAP or another explanation artifact is available:
- show top contributing features;
- explain that contribution is model-specific, not causal evidence;
- expose the model/version used;
- avoid displaying explanations where they could create misleading clinical certainty.

## Research integrity

Do not invent model accuracy, recall, F1, ROC results, subgroup performance, or model superiority. Until real experiments are available, use `TBD`, demo labels, or absent metrics.
