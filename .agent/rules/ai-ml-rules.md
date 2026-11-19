# AI & MACHINE LEARNING ENGINEERING RULES

1. **Academic Non-Fabrication Standard (Rule 4 & 16):**
   - Untrained or mock models must never claim fabricated performance scores (e.g. 99.1% accuracy or 0.05 MAE).
   - Unvalidated entries in benchmark tables must remain marked as `TBD` or `XX.XX` until real empirical experiments are executed against authorized datasets.

2. **Dual-Task Architecture:**
   - **Task 1: Resource Forecasting:** Supervised regression predicting monthly Food (kg), Clothing (kits), Medicine (units), and Budget (INR).
   - **Task 2: Clinical Health Triage:** Multiclass classification evaluating Low, Medium, and High acute risk with SHAP explainability.

3. **Medical Safety Boundary (Rule 6):**
   - Health-risk outputs are clinical decision-support triage scores only and must NEVER be described as a medical diagnosis.
   - Any resident with a composite priority score $\ge 70$ triggers an automatic high-priority alert for human physician evaluation.

4. **Adapter Independence:**
   - All AI calls must pass through `getAIAdapter()`.
   - Maintain `is_synthetic: true` on all heuristic demo data.
   - External Python microservice calls must have a 5000ms timeout with automatic fallback to local demo models.
