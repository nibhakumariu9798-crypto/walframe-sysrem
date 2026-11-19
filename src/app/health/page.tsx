"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldAlert, Stethoscope, CheckCircle2, AlertTriangle, FileText, ChevronRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { getAIAdapter } from "@/lib/ai";
import { HealthRiskResult } from "@/lib/ai/types";
import { useRole } from "@/context/role-context";
import { createClient } from "@/lib/supabase/client";

export default function HealthPage() {
  const { currentRole } = useRole();
  const { beneficiaries, addPrediction, addAlert } = useDataStore();

  const [selectedBenId, setSelectedBenId] = useState<string>("");
  const [assessmentResult, setAssessmentResult] = useState<HealthRiskResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [alertCreatedNotice, setAlertCreatedNotice] = useState<string | null>(null);

  const selectedBeneficiary =
    beneficiaries.find((b) => b.id === selectedBenId) || beneficiaries[0];

  const handleRunAssessment = async () => {
    if (!selectedBeneficiary) return;
    setEvaluating(true);
    setAlertCreatedNotice(null);
    try {
      // Query if this resident has real medical records in Supabase
      const supabase = createClient();
      const { data: medRecords } = await supabase
        .from("medical_records")
        .select("*")
        .eq("beneficiary_id", selectedBeneficiary.id)
        .order("measurement_date", { ascending: false })
        .limit(1);

      const latestRecord = medRecords && medRecords.length > 0 ? medRecords[0] : null;

      const isSenior = selectedBeneficiary.beneficiary_type === "elderly";
      const adapter = getAIAdapter();
      const result = await adapter.classifyHealthRisk({
        beneficiary_id: selectedBeneficiary.id,
        age: selectedBeneficiary.age,
        gender: selectedBeneficiary.gender,
        systolic_bp: latestRecord?.systolic_bp || (isSenior ? 138 : 115),
        diastolic_bp: latestRecord?.diastolic_bp || (isSenior ? 86 : 75),
        blood_sugar_fasting: latestRecord?.blood_sugar_fasting || (isSenior ? 120 : 85),
        bmi: latestRecord?.bmi || (isSenior ? 24.2 : 18.5),
        chronic_diseases_count: latestRecord?.chronic_diseases?.length || (isSenior ? 1 : 0),
        medication_dependency_count: latestRecord?.current_medications?.length || (isSenior ? 1 : 0),
      });
      setAssessmentResult(result);

      // Persist health risk classification to predictions table
      addPrediction({
        institution_id: selectedBeneficiary.institution_id,
        beneficiary_id: selectedBeneficiary.id,
        prediction_domain: "health_risk",
        target_variable: "health_risk_level",
        model_name: result.model_name,
        model_version: result.model_version,
        model_tier: result.model_tier,
        input_features: {
          age: selectedBeneficiary.age,
          gender: selectedBeneficiary.gender,
          systolic_bp: latestRecord?.systolic_bp || (isSenior ? 138 : 115),
          blood_sugar_fasting: latestRecord?.blood_sugar_fasting || (isSenior ? 120 : 85),
          bmi: latestRecord?.bmi || (isSenior ? 24.2 : 18.5),
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

      // If priority score >= 70 or requires doctor review, dispatch health alert automatically
      if (result.requires_doctor_review || result.welfare_priority_score >= 70) {
        addAlert({
          institution_id: selectedBeneficiary.institution_id,
          beneficiary_id: selectedBeneficiary.id,
          alert_type: "health_risk",
          severity: result.risk_class === "high" ? "high" : "medium",
          priority_score: result.welfare_priority_score,
          title: `Health Alert: ${selectedBeneficiary.first_name} (${result.risk_class.toUpperCase()} Risk)`,
          description: `Priority score ${result.welfare_priority_score}/100 exceeds doctor threshold (>70). Clinical review queued.`,
          status: "pending_review",
          is_synthetic: true,
        });
        setAlertCreatedNotice(`High-risk threshold exceeded (${result.welfare_priority_score}/100). Clinical review alert dispatched to Doctor queue.`);
      }
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-600" />
            Clinical Decision Support &amp; Health-Risk Analysis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Machine Learning and Deep Learning health triage for vulnerable children and geriatric residents.
          </p>
        </div>

        <Badge variant={currentRole === "doctor" ? "danger" : "secondary"}>
          Active Perspective: {currentRole.toUpperCase()}
        </Badge>
      </div>

      {/* Mandatory Medical Safety Disclaimer */}
      <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 space-y-1">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          Mandatory Clinical Safety Notice: Decision Support Only
        </div>
        <p className="leading-relaxed">
          The welfare priority scores and health risk classifications are algorithmic heuristics intended solely to prioritize clinical review queues. They do <strong>NOT</strong> constitute a medical diagnosis, do <strong>NOT</strong> prescribe medical treatment, and must never replace direct evaluation by a licensed physician.
        </p>
      </div>

      {/* Interactive Assessment Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resident Selector */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Resident ({beneficiaries.length})</CardTitle>
              <CardDescription>Choose an enrolled resident from Supabase for health-risk scoring</CardDescription>
            </CardHeader>
            <CardContent>
              {beneficiaries.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No resident beneficiaries found</p>
                  <p className="text-slate-400 mt-1">Admit residents in the Beneficiaries tab to enable health analysis.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {beneficiaries.map((ben) => (
                      <button
                        key={ben.id}
                        onClick={() => {
                          setSelectedBenId(ben.id);
                          setAssessmentResult(null);
                        }}
                        className={`w-full p-3 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          selectedBeneficiary?.id === ben.id
                            ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-700 font-semibold"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <div className="text-slate-900 dark:text-slate-100">{ben.first_name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {ben.identifier_code} &bull; {ben.age} yrs
                          </div>
                        </div>
                        <Badge variant={ben.beneficiary_type === "elderly" ? "secondary" : "indigo"}>
                          {ben.beneficiary_type}
                        </Badge>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={handleRunAssessment}
                      disabled={evaluating || !selectedBeneficiary}
                    >
                      <Stethoscope className="w-4 h-4 mr-1.5" />
                      {evaluating ? "Evaluating Factors..." : "Run Health Assessment"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assessment & Explainability Results */}
        <div className="lg:col-span-2 space-y-4">
          {assessmentResult && selectedBeneficiary ? (
            <Card className="border-indigo-200 dark:border-indigo-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      Assessment Summary: {selectedBeneficiary.first_name}
                    </CardTitle>
                    <CardDescription>
                      Model: {assessmentResult.model_name} ({assessmentResult.model_version})
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      assessmentResult.risk_class === "high"
                        ? "danger"
                        : assessmentResult.risk_class === "medium"
                        ? "warning"
                        : "success"
                    }
                    className="capitalize text-xs px-3 py-1"
                  >
                    {assessmentResult.risk_class} Risk Level
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {alertCreatedNotice && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{alertCreatedNotice}</span>
                  </div>
                )}

                {/* Score Dial / Bar */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Composite Welfare Priority Score
                    </span>
                    <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">
                      {assessmentResult.welfare_priority_score} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        assessmentResult.welfare_priority_score >= 70
                          ? "bg-rose-600"
                          : assessmentResult.welfare_priority_score >= 40
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${assessmentResult.welfare_priority_score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Score calculation: Age risk (max 20) + Health risk (max 35) + Chronic disease (max 25) + Medication dependency (max 20).
                    Threshold &gt; 70 automatically queues doctor notification.
                  </p>
                </div>

                {/* Model Explainability / SHAP Factor breakdown */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Top Contributing Risk Factors (SHAP Feature Importance Proxy)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {assessmentResult.shap_contributions.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                      >
                        <span className="capitalize text-slate-600 dark:text-slate-300">
                          {factor.feature.replace("_", " ")}
                        </span>
                        <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                          {factor.contribution}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action status */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {assessmentResult.requires_doctor_review ? (
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    <span>
                      {assessmentResult.requires_doctor_review
                        ? "Action required: Enqueued in Doctor Review Roster"
                        : "Nominal status: Routine quarterly checkup scheduled"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Stethoscope className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {beneficiaries.length === 0 ? "No residents registered in database" : "No active assessment selected"}
              </p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                {beneficiaries.length === 0
                  ? "Admit residents first to compute clinical decision-support triage."
                  : "Select a beneficiary from the roster on the left and click \"Run Health Assessment\" to compute decision support scores."}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
