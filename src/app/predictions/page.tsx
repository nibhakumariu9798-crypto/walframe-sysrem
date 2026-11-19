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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prediction } from "@/types";
import { useDataStore } from "@/context/data-store-context";
import { getAIAdapter } from "@/lib/ai";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function PredictionsPage() {
  const { predictions, institutions, beneficiaries, addPrediction } = useDataStore();
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [runningAction, setRunningAction] = useState<string | null>(null);

  const filtered = predictions.filter((p) => {
    return filterDomain === "all" || p.prediction_domain === filterDomain;
  });

  const handleSimulateResourceForecast = async () => {
    setRunningAction("resource");
    try {
      const inst = institutions[0] || {
        id: "24af4f81-d923-49a2-84f6-703c1b193827",
        name: "Aashraya Children's Home",
        current_occupancy: 52,
      };

      const adapter = getAIAdapter();
      const results = await adapter.forecastResource({
        institution_id: inst.id,
        resident_count: inst.current_occupancy,
        season: "winter",
        is_festival_month: true,
        prev_3m_avg_food_kg: 810,
        prev_3m_avg_expense_inr: 95000,
      });

      results.forEach((res) => {
        addPrediction({
          institution_id: inst.id,
          beneficiary_id: null,
          prediction_domain: "resource_forecast",
          target_variable: `${res.target}_requirement`,
          model_name: res.model_name,
          model_version: res.model_version,
          model_tier: res.model_tier,
          input_features: {
            institution_name: inst.name,
            resident_count: inst.current_occupancy,
            season: "winter",
            is_festival_month: true,
          },
          predicted_value: res.predicted_value,
          predicted_class: null,
          confidence_score: res.confidence_score,
          explanation_payload: {
            unit: res.unit,
            factors: res.factors,
            disclaimer: res.disclaimer,
          },
          is_synthetic: res.is_synthetic,
        });
      });
    } finally {
      setRunningAction(null);
    }
  };

  const handleSimulateHealthTriage = async () => {
    setRunningAction("health");
    try {
      const ben = beneficiaries.find((b) => b.beneficiary_type === "elderly") || beneficiaries[0] || {
        id: "ben-sim-001",
        first_name: "Rameshwar",
        age: 78,
        gender: "male",
        institution_id: "5e5b77d7-f16f-4304-b3fe-ccbf565333fc",
      };

      const adapter = getAIAdapter();
      const result = await adapter.classifyHealthRisk({
        beneficiary_id: ben.id,
        age: ben.age,
        gender: ben.gender,
        systolic_bp: 154,
        diastolic_bp: 92,
        blood_sugar_fasting: 162,
        bmi: 26.1,
        chronic_diseases_count: 2,
        medication_dependency_count: 3,
      });

      addPrediction({
        institution_id: ben.institution_id,
        beneficiary_id: ben.id,
        prediction_domain: "health_risk",
        target_variable: "health_risk_level",
        model_name: result.model_name,
        model_version: result.model_version,
        model_tier: result.model_tier,
        input_features: {
          resident_name: ben.first_name,
          age: ben.age,
          gender: ben.gender,
          systolic_bp: 154,
          diastolic_bp: 92,
          blood_sugar_fasting: 162,
          chronic_diseases: 2,
        },
        predicted_value: result.welfare_priority_score,
        predicted_class: result.risk_class,
        confidence_score: result.confidence_score,
        explanation_payload: {
          welfare_priority_score: result.welfare_priority_score,
          requires_doctor_review: result.requires_doctor_review,
          shap_contributions: result.shap_contributions,
          medical_disclaimer: result.medical_disclaimer,
        },
        is_synthetic: result.is_synthetic,
      });
    } finally {
      setRunningAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Predictions &amp; Model Audit Log ({predictions.length} Records)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable log of machine learning predictions, model versions, and audit trails.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={runningAction !== null}
            onClick={handleSimulateResourceForecast}
            className="text-xs"
          >
            <Boxes className="w-3.5 h-3.5 mr-1 text-indigo-600" />
            {runningAction === "resource" ? "Generating..." : "Forecast Demand"}
          </Button>

          <Button
            size="sm"
            disabled={runningAction !== null}
            onClick={handleSimulateHealthTriage}
            className="text-xs"
          >
            <Activity className="w-3.5 h-3.5 mr-1 text-rose-200" />
            {runningAction === "health" ? "Classifying..." : "Run Health Triage"}
          </Button>
        </div>
      </div>

      {/* Mandatory Disclaimer Alert */}
      <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Research Model Audit Trail:</span> All inference events preserve their model name, version tag, input snapshot, and confidence metric. Health outputs remain professional decision support indicators, not diagnoses.
        </div>
      </div>

      {/* Domain filter */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Domain:</span>
          {(["all", "resource_forecast", "health_risk"] as const).map((dom) => (
            <button
              key={dom}
              onClick={() => setFilterDomain(dom)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                filterDomain === dom
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {dom === "all" ? "All Domains" : dom === "resource_forecast" ? "Resource Forecasts" : "Health Classifications"}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Showing {filtered.length} entries
        </span>
      </div>

      {/* Predictions Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold w-8"></th>
                <th className="px-4 py-3 font-semibold">Prediction Domain</th>
                <th className="px-4 py-3 font-semibold">Target Variable</th>
                <th className="px-4 py-3 font-semibold">Predicted Output</th>
                <th className="px-4 py-3 font-semibold">Model Artifact</th>
                <th className="px-4 py-3 font-semibold">Model Tier</th>
                <th className="px-4 py-3 font-semibold">Confidence</th>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-xs text-slate-500">
                    <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      No ML predictions recorded in database yet
                    </p>
                    <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                      Use the &quot;Forecast Demand&quot; or &quot;Run Health Triage&quot; buttons above to generate model inferences.
                    </p>
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
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-400">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={isHealth ? "danger" : "indigo"}>
                            {isHealth ? "Health Risk" : "Resource"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-mono font-medium text-slate-900 dark:text-slate-100 capitalize">
                          {pred.target_variable.replace(/_/g, " ")}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">
                          {isHealth ? (
                            <span className="flex items-center gap-1.5">
                              <span className="capitalize">{pred.predicted_class?.replace(/_/g, " ")}</span>
                              {pred.predicted_value && (
                                <span className="text-[11px] font-mono text-slate-400">
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
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          <div className="font-medium text-[11px]">{pred.model_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{pred.model_version}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="warning" className="uppercase font-mono text-[10px]">
                            {pred.model_tier}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                          {pred.confidence_score ? `${(pred.confidence_score * 100).toFixed(0)}%` : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                          {formatDate(pred.created_at)}
                        </td>
                      </tr>

                      {/* Expandable audit & explainability detail row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 dark:bg-slate-850/50 border-y border-indigo-100 dark:border-indigo-900/40">
                          <td colSpan={8} className="p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {/* Input Snapshot */}
                              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                                <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px] uppercase tracking-wider">
                                  Model Input Snapshot
                                </span>
                                <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                                  {Object.entries(pred.input_features || {}).map(([k, v]) => (
                                    <div key={k} className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                                      <span className="capitalize">{k.replace(/_/g, " ")}:</span>
                                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {String(v)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Explanations & Factor Weights */}
                              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                                <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px] uppercase tracking-wider">
                                  Explainability &amp; Factor Contribution
                                </span>
                                {factors.length > 0 ? (
                                  <div className="space-y-1 text-[11px]">
                                    {factors.map((f, i) => (
                                      <div key={i} className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                                        <span className="capitalize">{f.feature.replace(/_/g, " ")}:</span>
                                        <span className="font-medium text-indigo-600 dark:text-indigo-400">{f.impact}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : shapFactors.length > 0 ? (
                                  <div className="space-y-1 text-[11px]">
                                    {shapFactors.map((s, i) => (
                                      <div key={i} className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                                        <span className="capitalize">{s.feature.replace(/_/g, " ")}:</span>
                                        <span className="font-mono text-rose-600 dark:text-rose-400">{s.contribution}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-slate-400 italic">
                                    Baseline regression linear weights applied.
                                  </p>
                                )}
                              </div>
                            </div>

                            {pred.is_synthetic && (
                              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                                ⚠ SYNTHETIC DEMO LOG: Model output produced for workflow prototyping under research safety constraints.
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
