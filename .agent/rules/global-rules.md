# AGENT GLOBAL RULES: AI-DRIVEN SMART WELFARE RESOURCE MANAGEMENT SYSTEM

1. **Academic Integrity & Non-Fabrication (Rule 4 & 16):**
   - Never fabricate research metrics, model evaluation scores (Accuracy, Precision, Recall, F1, MAE, RMSE, R²), dataset sizes, or validation outcomes.
   - Benchmark tables must retain explicit `TBD` or `XX.XX` placeholders until genuine empirical model runs are conducted against authorized datasets.
   - Clearly label any synthetic demonstration data with `is_synthetic: true`. Never present demo values as empirical research findings.

2. **Clinical Safety Boundary (Rule 6):**
   - Health-risk model outputs are strictly decision-support heuristics and must NEVER be described or formatted as an autonomous medical diagnosis or prescription.
   - Mandatory disclaimer must accompany every health card: *"Clinical decision-support only. Not a medical diagnosis. Licensed physician review required."*
   - Any patient receiving a priority score $\ge 70$ must trigger an immediate high-priority alert for doctor review.

3. **Medical Privacy & Least Privilege (Rule 5):**
   - Patient vitals (blood pressure, blood glucose, medication regimens, clinical notes) are strictly protected under PostgreSQL Row Level Security (RLS).
   - Only authorized physicians (`role = 'doctor'`) and state administrators (`role = 'admin'`) may view or export clinical records.

4. **Working Style & Engineering Discipline:**
   - Always inspect existing code before creating or modifying files.
   - Never overwrite working features with untested stubs or pseudocode.
   - Every interactive element (button, dropdown, form) must perform its intended operation; zero fake buttons.
   - Develop in small, independently verifiable phases.
   - Run TypeScript checks (`tsc --noEmit`), lint checks (`eslint src --quiet`), and system verifications (`node scripts/verify-system.mjs`) before concluding any turn.
