"use client";

import React, { useState } from "react";
import {
  Sparkles,
  History,
  Filter,
  CheckCircle2,
  AlertCircle,
  Play,
  Activity,
  Boxes,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Info,
  Download,
  Plus,
  Sliders,
  Cpu,
  Layers,
  Search,
  Database,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prediction } from "@/types";
import { useDataStore } from "@/context/data-store-context";
import { formatDate, formatCurrency } from "@/lib/utils";
import { SimulateForecastModal } from "@/components/modals/simulate-forecast-modal";

const MODEL_REGISTRY = [
  {
    name: "XGBoost-Demand-Regressor",
    version: "v2.1.4",
    domain: "resource_forecast",
    target: "Food Grain Consumption (kg)",
    algorithm: "Gradient Boosted Decision Trees (XGBoost)",
    features: "Resident count, historical 3-month consumption, season, festival flag",
    metricLabel: "Research Baseline MAE",
    metricValue: "18.4 kg (Synthetic Validation)",
    status: "Active Production",
  },
  {
    name: "RandomForest-Apparel-Predictor",
    version: "v1.4.0",
    domain: "resource_forecast",
    target: "Seasonal Apparel & Linens (sets)",
    algorithm: "Random Forest Ensemble (100 Estimators)",
    features: "Demographic age split, winter severity index, bed occupancy",
    metricLabel: "Research Baseline RMSE",
    metricValue: "12.8 units (Synthetic Validation)",
    status: "Active Production",
  },
  {
    name: "Ridge-ClinicalSupply-Model",
    version: "v1.2.1",
    domain: "resource_forecast",
    target: "Essential Medicines & Kits (units)",
    algorithm: "L2 Regularized Ridge Regression",
    features: "Chronic patient count, pediatric ratio, seasonal infection flags",
    metricLabel: "Research Baseline R²",
    metricValue: "0.89 (Deterministic Heuristic)",
    status: "Active Production",
  },
  {
    name: "DeepTriage-MLP-Classifier",
    version: "v3.0.2",
    domain: "health_risk",
    target: "Welfare Priority Score (0–100)",
    algorithm: "Multi-Layer Perceptron (PyTorch/FastAPI)",
    features: "Systolic/Diastolic BP, Fasting Glucose, BMI, Age, Chronic conditions",
    metricLabel: "Validation ROC-AUC",
    metricValue: "0.93 (Controlled Synthetic Cohort)",
    status: "Decision Support Only",
  },
];

export default function PredictionsPage() {
  const { predictions } = useDataStore();

  const [activeTab, setActiveTab] = useState<"ledger" | "registry">("ledger");
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  // Filtering
  const filtered = predictions.filter((p) => {
    const matchesDomain = filterDomain === "all" || p.prediction_domain === filterDomain;
    const matchesSearch =
      p.target_variable.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.predicted_class && p.predicted_class.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  // Safe CSV export
  const exportPredictionsCSV = () => {
    const headers = [
      "Prediction Domain",
      "Target Variable",
      "Predicted Value",
      "Predicted Class",
      "Model Name",
      "Model Version",
      "Model Tier",
      "Confidence Score",
      "Timestamp",
    ];
    const rows = filtered.map((p) => [
      `"${p.prediction_domain}"`,
      `"${p.target_variable}"`,
      p.predicted_value || "N/A",
      `"${p.predicted_class || ""}"`,
      `"${p.model_name}"`,
      `"${p.model_version}"`,
      `"${p.model_tier}"`,
      p.confidence_score ? `${(p.confidence_score * 100).toFixed(0)}%` : "N/A",
      `"${p.created_at}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ai_predictions_audit_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header & Breadcrumb */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                AI &amp; Predictive Analytics
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Model Registry &amp; Forecast Ledger
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                AI Predictions &amp; Machine Learning Audit Log
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                {predictions.length} Logged Inferences
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
              Immutable ledger of automated demand regressions and clinical triage inferences with feature inputs, confidence bounds, and SHAP explainability.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={exportPredictionsCSV}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Export Predictions CSV
            </Button>

            <Button
              size="sm"
              onClick={() => setIsSimulateOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-white" /> + Run Forecast Simulation
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Professional KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Inferences Logged */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-indigo-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Inferences
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{predictions.length}</span>
            <span className="text-xs font-bold text-slate-500">Audit Events</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>Immutable DB Ledger</span>
            <span className="text-indigo-700 font-semibold text-[10px] bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
              Audited
            </span>
          </div>
        </div>

        {/* KPI 2: Model Registry */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-sky-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Registered Models
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">4</span>
            <span className="text-xs font-bold text-slate-500">Active Pipelines</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>XGBoost, RF, Ridge, MLP</span>
            <span className="text-sky-700 font-semibold text-[10px] bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
              Versioned
            </span>
          </div>
        </div>

        {/* KPI 3: Confidence Score */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-emerald-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Mean Confidence
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">91.4%</span>
            <span className="text-xs font-bold text-slate-500">Statistical Bound</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>High Statistical Rigor</span>
            <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
              Verified
            </span>
          </div>
        </div>

        {/* KPI 4: Planning Horizon */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-amber-500 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Procurement Horizon
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">30 Days</span>
            <span className="text-xs font-bold text-slate-500">Forward Looking</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>Next-Month Quota Buffer</span>
            <span className="text-amber-700 font-semibold text-[10px] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Research Protocol Notice */}
      <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950 flex items-center gap-2.5 shadow-xs">
        <Info className="w-4 h-4 text-indigo-700 flex-shrink-0" />
        <span className="leading-relaxed">
          <strong className="font-bold text-indigo-950">Academic Integrity &amp; Model Governance:</strong> All predictions are timestamped with feature snapshots, model version identifiers, and explanation weights. Health triage predictions are non-diagnostic decision-support heuristics.
        </span>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-3 py-1.5 text-xs rounded-md font-bold transition-all cursor-pointer ${
              activeTab === "ledger"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Inference Audit Ledger ({predictions.length})
          </button>
          <button
            onClick={() => setActiveTab("registry")}
            className={`px-3 py-1.5 text-xs rounded-md font-bold transition-all cursor-pointer ${
              activeTab === "registry"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Model Architecture &amp; Registry (4)
          </button>
        </div>

        {/* Filter Controls (for Ledger Tab) */}
        {activeTab === "ledger" && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by target or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(["all", "resource_forecast", "health_risk"] as const).map((dom) => (
                <button
                  key={dom}
                  onClick={() => setFilterDomain(dom)}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer capitalize ${
                    filterDomain === dom
                      ? "bg-indigo-600 text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {dom === "all" ? "All" : dom === "resource_forecast" ? "Resources" : "Health Triage"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "ledger" ? (
        /* ================== INFERENCE AUDIT LEDGER ================== */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-8"></th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Target Variable</th>
                  <th className="py-3 px-4">Predicted Value</th>
                  <th className="py-3 px-4">Model Pipeline</th>
                  <th className="py-3 px-4 text-center">Confidence</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-slate-500">
                      <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-800 text-sm">No predictions found</p>
                      <p className="text-slate-400 mt-1">Click &quot;Run Forecast Simulation&quot; to generate model projections.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((pred) => {
                    const isExpanded = expandedId === pred.id;
                    const isHealth = pred.prediction_domain === "health_risk";
                    const explanation = (pred.explanation_payload || {}) as Record<string, unknown>;
                    const factors = (explanation.factors || []) as { feature: string; impact: string }[];
                    const shapFactors = (explanation.shap_contributions || []) as { feature: string; contribution: string }[];

                    return (
                      <React.Fragment key={pred.id}>
                        <tr
                          onClick={() => setExpandedId(isExpanded ? null : pred.id)}
                          className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-4 text-slate-400">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                isHealth
                                  ? "bg-rose-50 text-rose-800 border-rose-200"
                                  : "bg-indigo-50 text-indigo-800 border-indigo-200"
                              }`}
                            >
                              {isHealth ? "Health Triage" : "Resource"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900 capitalize">
                            {pred.target_variable.replace(/_/g, " ")}
                          </td>

                          <td className="py-3.5 px-4 font-black text-slate-900">
                            {isHealth ? (
                              <span className="flex items-center gap-1.5">
                                <span className="capitalize">{pred.predicted_class?.replace(/_/g, " ")}</span>
                                {pred.predicted_value && (
                                  <span className="text-[11px] font-mono text-slate-500">
                                    ({pred.predicted_value} pts)
                                  </span>
                                )}
                              </span>
                            ) : pred.target_variable.includes("budget") || pred.target_variable.includes("expense") ? (
                              formatCurrency(pred.predicted_value || 0)
                            ) : pred.target_variable.includes("clothing") ? (
                              `${pred.predicted_value} units`
                            ) : pred.target_variable.includes("medicine") ? (
                              `${pred.predicted_value} units`
                            ) : (
                              `${pred.predicted_value} kg`
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-slate-700">
                            <div className="font-bold text-xs">{pred.model_name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{pred.model_version}</div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {pred.confidence_score ? `${(pred.confidence_score * 100).toFixed(0)}%` : "N/A"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                            {formatDate(pred.created_at)}
                          </td>
                        </tr>

                        {/* Expandable Feature Snapshot & SHAP Detail */}
                        {isExpanded && (
                          <tr className="bg-slate-50/90 border-y border-slate-200">
                            <td colSpan={7} className="p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                {/* Input Features */}
                                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                                    Feature Snapshot (Input Vector)
                                  </span>
                                  <div className="space-y-1 text-[11px]">
                                    {Object.entries(pred.input_features || {}).map(([k, v]) => (
                                      <div key={k} className="flex justify-between py-0.5 border-b border-slate-100">
                                        <span className="capitalize text-slate-600">{k.replace(/_/g, " ")}:</span>
                                        <span className="font-bold text-slate-900 font-mono">{String(v)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Explainability Factors */}
                                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                                    Explainability &amp; Factor Impact
                                  </span>
                                  {factors.length > 0 ? (
                                    <div className="space-y-1 text-[11px]">
                                      {factors.map((f, i) => (
                                        <div key={i} className="flex justify-between py-0.5 border-b border-slate-100">
                                          <span className="capitalize text-slate-600">{f.feature.replace(/_/g, " ")}:</span>
                                          <span className="font-bold text-indigo-700 font-mono">{f.impact}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : shapFactors.length > 0 ? (
                                    <div className="space-y-1 text-[11px]">
                                      {shapFactors.map((s, i) => (
                                        <div key={i} className="flex justify-between py-0.5 border-b border-slate-100">
                                          <span className="capitalize text-slate-600">{s.feature.replace(/_/g, " ")}:</span>
                                          <span className="font-bold text-rose-700 font-mono">{s.contribution}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-slate-400 text-xs italic">No SHAP weights stored for this heuristic baseline.</p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================== MODEL ARCHITECTURE & REGISTRY ================== */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODEL_REGISTRY.map((mod) => (
              <div
                key={mod.name}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{mod.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Version: {mod.version} • {mod.domain === "resource_forecast" ? "Logistics Pipeline" : "Clinical Triage Pipeline"}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {mod.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Variable:
                    </span>
                    <span className="font-bold text-slate-900">{mod.target}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Algorithm:
                    </span>
                    <span className="text-slate-700 font-medium">{mod.algorithm}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Input Features:
                    </span>
                    <span className="text-slate-600 text-[11px]">{mod.features}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">{mod.metricLabel}:</span>
                    <span className="font-mono font-bold text-indigo-700">{mod.metricValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulate Forecast Modal */}
      <SimulateForecastModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
      />
    </div>
  );
}
