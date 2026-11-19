---
name: ai-ml-development
description: Dual-task machine learning regression and deep learning clinical triage, SHAP explainability, and research integrity protocols.
---

# AI & Machine Learning Development Skill

## Purpose
Oversees the design, evaluation, explainability, and safety boundaries of the machine learning and deep learning pipelines.

## Implementation Guidelines
1. **Academic Non-Fabrication (Rule 4 & 16):**
   - Strictly avoid fabricated metrics or mock evaluation benchmarks.
   - Retain `TBD` and `XX.XX` placeholders in `/research` tables until empirical model runs occur.
2. **Clinical Safety Boundary (Rule 6):**
   - Always label clinical outputs as "Decision Support Only".
   - Cases scoring $\ge 70$ must automatically trigger a high-severity alert for physician triage.
3. **Dual-Mode Adapter Architecture:**
   - Develop both local deterministic fallback (`DemoAIAdapter`) and external FastAPI client (`RemoteAIAdapter`).
   - Persist prediction snapshots with input features and SHAP factors to the `predictions` database table.
