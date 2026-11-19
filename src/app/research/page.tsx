"use client";

import React from "react";
import { Microscope, Database, Sliders, BarChart3, AlertOctagon, CheckCircle2, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ResearchWorkspacePage() {
  const exportProtocol = () => {
    const protocol = {
      title: "AI-Driven Smart Welfare Resource Management System — Empirical Research Protocol",
      version: "1.0.0",
      date_generated: new Date().toISOString(),
      academic_integrity_declaration: {
        rule_4_compliance: "Strictly zero fabricated metrics or unvalidated model scores",
        rule_6_compliance: "Clinical triage output is decision-support only; never a medical diagnosis",
        status: "Controlled Benchmark Evaluation Protocol",
      },
      task_1_resource_forecasting: {
        problem_type: "Supervised Multivariate Time-Series Regression",
        targets: ["food_provisions_kg", "clothing_kits", "medical_units", "budget_inr"],
        candidate_models: [
          { name: "Linear Regression", role: "Linear Baseline", hyperparameters: { fit_intercept: true } },
          { name: "Random Forest Regressor", role: "Non-linear Ensemble", hyperparameters: { n_estimators: 100, max_depth: 10, random_state: 42 } },
          { name: "XGBoost Regressor", role: "Gradient Boosting", hyperparameters: { learning_rate: 0.05, n_estimators: 150, max_depth: 6 } }
        ],
        validation_scheme: {
          method: "Strict Temporal Chronological Split",
          train_ratio: 0.70,
          val_ratio: 0.15,
          test_ratio: 0.15,
          leakage_prevention: "No future lookahead in feature lag calculations"
        },
        evaluation_metrics: ["Mean Absolute Error (MAE)", "Root Mean Squared Error (RMSE)", "Coefficient of Determination (R²)"]
      },
      task_2_clinical_health_triage: {
        problem_type: "Multiclass Health Risk Classification & Priority Scoring",
        classes: ["Low", "Medium", "High"],
        candidate_models: [
          { name: "Logistic Regression", role: "Linear Classification Baseline" },
          { name: "Random Forest Classifier", role: "Non-linear Tree Ensemble" },
          { name: "Multilayer Perceptron (MLP)", role: "Deep Learning Classifier", architecture: "Dense(64, ReLU) -> Dropout(0.2) -> Dense(32, ReLU) -> Dense(3, Softmax)" }
        ],
        explainability: {
          method: "SHapley Additive exPlanations (SHAP)",
          explainer_type: "TreeExplainer for RF / DeepExplainer for MLP",
          output: "Top 3 contributing physiological risk features"
        },
        priority_scoring_weights: {
          age_factor: 0.20,
          clinical_ml_risk: 0.35,
          chronic_history: 0.25,
          medication_dependency: 0.20
        },
        alert_trigger_threshold: "Priority Score >= 70 triggers immediate notification to licensed physician"
      }
    };

    const blob = new Blob([JSON.stringify(protocol, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `welfare_ai_experiment_protocol_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Microscope className="w-5 h-5 text-indigo-600" />
            Research &amp; Machine Learning Evaluation Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controlled laboratory area for dataset validation, experimental tracking, and algorithm benchmarking.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={exportProtocol}>
          <FileDown className="w-4 h-4 mr-1.5" /> Export Experiment Protocol
        </Button>
      </div>

      {/* Mandatory Academic Integrity Rule Banner */}
      <div className="p-4 bg-amber-50/80 text-amber-950 rounded-xl border border-amber-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-semibold text-amber-900">
          <AlertOctagon className="w-4 h-4 text-amber-600" />
          Mandatory Research Integrity Contract (Rule 4 &amp; 16)
        </div>
        <p className="text-amber-800 leading-relaxed text-[11px]">
          In accordance with the project specification and academic research protocol, <strong>NO model metrics, dataset sizes, hyperparameter selections, or validation scores are fabricated</strong>. All empirical values below remain marked as <code>TBD</code> or <code>XX.XX</code> until authentic model runs are executed against validated datasets.
        </p>
      </div>

      {/* THREE SECTIONS: Dataset Registry, Model Evaluation Benchmark, Feature Engineering */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regression Models Benchmark Table (Resource Forecasting) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Resource Demand Regression Benchmark
            </CardTitle>
            <CardDescription>
              Temporal split evaluation on historical monthly records
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Candidate Model</th>
                  <th className="px-4 py-2.5 font-semibold">Target</th>
                  <th className="px-4 py-2.5 font-semibold">MAE</th>
                  <th className="px-4 py-2.5 font-semibold">RMSE</th>
                  <th className="px-4 py-2.5 font-semibold">R² Score</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                <tr>
                  <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Linear Regression
                  </td>
                  <td className="px-4 py-3">Food (kg)</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">XX.XX</td>
                  <td className="px-4 py-3 font-sans">
                    <Badge variant="secondary">Baseline</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Random Forest Regressor
                  </td>
                  <td className="px-4 py-3">Food (kg)</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">XX.XX</td>
                  <td className="px-4 py-3 font-sans">
                    <Badge variant="warning">Evaluating</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    XGBoost Regressor
                  </td>
                  <td className="px-4 py-3">Food (kg)</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">XX.XX</td>
                  <td className="px-4 py-3 font-sans">
                    <Badge variant="warning">Evaluating</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Classification Models Benchmark Table (Health Risk) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-600" />
              Health Risk Classification Benchmark
            </CardTitle>
            <CardDescription>
              Low / Medium / High Risk multiclass triage (Recall prioritized)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Candidate Model</th>
                  <th className="px-4 py-2.5 font-semibold">Accuracy</th>
                  <th className="px-4 py-2.5 font-semibold">Precision</th>
                  <th className="px-4 py-2.5 font-semibold">Recall</th>
                  <th className="px-4 py-2.5 font-semibold">F1-Score</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                <tr>
                  <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Logistic Regression
                  </td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">XX.XX</td>
                  <td className="px-4 py-3 font-sans">
                    <Badge variant="secondary">Baseline</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Random Forest Classifier
                  </td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">XX.XX</td>
                  <td className="px-4 py-3 font-sans">
                    <Badge variant="warning">Evaluating</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Multilayer Perceptron (MLP)
                  </td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">TBD</td>
                  <td className="px-4 py-3 text-slate-400">XX.XX</td>
                  <td className="px-4 py-3 font-sans">
                    <Badge variant="warning">Evaluating</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Pipeline & Feature Selection Protocol */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Feature Engineering &amp; Selection Protocol
          </CardTitle>
          <CardDescription>
            Documented research pipeline specifications derived from the manuscript
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
            <h5 className="font-semibold text-slate-900 dark:text-slate-100">1. Temporal Preprocessing</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Strict chronological separation of training/testing splits to avoid future temporal data leakage in monthly consumption forecasting.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
            <h5 className="font-semibold text-slate-900 dark:text-slate-100">2. Feature Selection Candidates</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Boruta feature selection with XGBoost, Random Forest impurity importance, and SHAP-based additive explanation attribution.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
            <h5 className="font-semibold text-slate-900 dark:text-slate-100">3. Priority Score Weights</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Age factor (20%) + Clinical ML risk (35%) + Chronic history (25%) + Medication dependency (20%). Configurable via system configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
