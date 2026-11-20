"use client";

import React, { useState } from "react";
import {
  Activity,
  ShieldAlert,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
  Users,
  Plus,
  Download,
  Heart,
  TrendingUp,
  Pill,
  Clock,
  UserCheck,
  Scale,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { getAIAdapter } from "@/lib/ai";
import { HealthRiskResult } from "@/lib/ai/types";
import { useRole } from "@/context/role-context";
import { formatDate } from "@/lib/utils";
import { RecordVitalsModal } from "@/components/modals/record-vitals-modal";

export default function HealthPage() {
  const { currentRole } = useRole();
  const { beneficiaries, medicalRecords, addPrediction, addAlert } = useDataStore();

  const [selectedBenId, setSelectedBenId] = useState<string>(
    beneficiaries[0]?.id || ""
  );
  const [assessmentResult, setAssessmentResult] = useState<HealthRiskResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [alertCreatedNotice, setAlertCreatedNotice] = useState<string | null>(null);
  const [isRecordVitalsOpen, setIsRecordVitalsOpen] = useState(false);

  const selectedBeneficiary =
    beneficiaries.find((b) => b.id === selectedBenId) || beneficiaries[0];

  // Latest medical record for the selected resident
  const residentRecords = medicalRecords.filter(
    (m) => m.beneficiary_id === selectedBeneficiary?.id
  );
  const latestRecord = residentRecords[0] || null;

  // Live Aggregates
  const totalBeneficiaries = beneficiaries.length;
  const seniorCount = beneficiaries.filter((b) => b.beneficiary_type === "elderly").length;
  const totalRecordsLogged = medicalRecords.length;
  const criticalVitalsCount = medicalRecords.filter(
    (m) => (m.systolic_bp && m.systolic_bp >= 150) || (m.blood_sugar_fasting && m.blood_sugar_fasting >= 160)
  ).length;

  const handleRunAssessment = async () => {
    if (!selectedBeneficiary) return;
    setEvaluating(true);
    setAlertCreatedNotice(null);
    try {
      const isSenior = selectedBeneficiary.beneficiary_type === "elderly";
      const adapter = getAIAdapter();

      // Use real recorded vitals if available, else clinical seed baseline
      const systolic = latestRecord?.systolic_bp || (isSenior ? 142 : 112);
      const diastolic = latestRecord?.diastolic_bp || (isSenior ? 88 : 74);
      const sugar = latestRecord?.blood_sugar_fasting || (isSenior ? 130 : 88);
      const bmi = latestRecord?.bmi || (isSenior ? 24.8 : 17.5);
      const chronicCount = latestRecord?.chronic_diseases?.length || (isSenior ? 1 : 0);
      const medCount = latestRecord?.current_medications?.length || (isSenior ? 1 : 0);

      const result = await adapter.classifyHealthRisk({
        beneficiary_id: selectedBeneficiary.id,
        age: selectedBeneficiary.age,
        gender: selectedBeneficiary.gender,
        systolic_bp: systolic,
        diastolic_bp: diastolic,
        blood_sugar_fasting: sugar,
        bmi,
        chronic_diseases_count: chronicCount,
        medication_dependency_count: medCount,
      });

      setAssessmentResult(result);

      // Persist health classification to immutable predictions table
      addPrediction({
        institution_id: selectedBeneficiary.institution_id,
        beneficiary_id: selectedBeneficiary.id,
        prediction_domain: "health_risk",
        target_variable: "health_risk_level",
        model_name: result.model_name,
        model_version: result.model_version,
        model_tier: result.model_tier,
        input_features: {
          resident_name: selectedBeneficiary.first_name,
          age: selectedBeneficiary.age,
          gender: selectedBeneficiary.gender,
          systolic_bp: systolic,
          blood_sugar_fasting: sugar,
          bmi,
          chronic_count: chronicCount,
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

      // Automated High-Severity Alert Queue Dispatch
      if (result.requires_doctor_review || result.welfare_priority_score >= 70) {
        addAlert({
          institution_id: selectedBeneficiary.institution_id,
          beneficiary_id: selectedBeneficiary.id,
          alert_type: "health_risk",
          severity: result.risk_class === "high" ? "high" : "medium",
          priority_score: result.welfare_priority_score,
          title: `Clinical Alert: ${selectedBeneficiary.first_name} (${result.risk_class.toUpperCase()} Risk)`,
          description: `Priority Score ${result.welfare_priority_score}/100 exceeds doctor review threshold (≥70). Systolic: ${systolic} mmHg, Sugar: ${sugar} mg/dL.`,
          status: "pending_review",
          is_synthetic: true,
        });
        setAlertCreatedNotice(
          `High clinical threshold triggered (${result.welfare_priority_score}/100). Emergency notification sent to attending Doctor review queue.`
        );
      }
    } finally {
      setEvaluating(false);
    }
  };

  // Safe CSV export for doctors
  const exportTriageCSV = () => {
    const headers = [
      "Resident Name",
      "Identifier Code",
      "Category",
      "Age",
      "Systolic BP",
      "Diastolic BP",
      "Fasting Sugar",
      "BMI",
      "Chronic Conditions",
      "Current Medications",
    ];
    const rows = beneficiaries.map((b) => {
      const rec = medicalRecords.find((m) => m.beneficiary_id === b.id);
      return [
        `"${b.first_name.replace(/"/g, '""')}"`,
        `"${b.identifier_code}"`,
        `"${b.beneficiary_type}"`,
        b.age,
        rec?.systolic_bp || "N/A",
        rec?.diastolic_bp || "N/A",
        rec?.blood_sugar_fasting || "N/A",
        rec?.bmi || "N/A",
        `"${(rec?.chronic_diseases || []).join("; ")}"`,
        `"${(rec?.current_medications || []).join("; ")}"`,
      ].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clinical_triage_queue_${new Date().toISOString().split("T")[0]}.csv`);
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
                Clinical Health Services
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                Medical Decision Support Vault
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Clinical Decision Support &amp; Health Triage
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                Doctor Vault Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
              Multi-parameter clinical triage analyzing vital biometrics, fasting blood sugar, blood pressure elevation, and chronic illnesses with SHAP explainability.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={exportTriageCSV}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Export Triage CSV
            </Button>

            <Button
              size="sm"
              onClick={() => setIsRecordVitalsOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5 text-white" /> + Record Clinical Vitals
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Professional Clinical Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Monitored Residents */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-sky-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Beneficiaries
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{totalBeneficiaries}</span>
            <span className="text-xs font-bold text-slate-500">Residents</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>{seniorCount} Elderly • {totalBeneficiaries - seniorCount} Children</span>
            <span className="text-sky-700 font-semibold text-[10px] bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
              Active
            </span>
          </div>
        </div>

        {/* KPI 2: Elevated Risk Cases */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-rose-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Critical Biometric Flags
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-rose-600">{criticalVitalsCount}</span>
            <span className="text-xs font-bold text-slate-500">Alerts Detected</span>
          </div>
          <div className="text-[11px] font-medium text-rose-700 mt-1 flex items-center justify-between">
            <span>BP &gt; 150 or Sugar &gt; 160</span>
            <span className="text-rose-800 font-bold text-[10px] bg-rose-100 px-1.5 py-0.2 rounded border border-rose-200">
              High Priority
            </span>
          </div>
        </div>

        {/* KPI 3: Vitals Logged */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-indigo-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Clinical Records Vault
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{totalRecordsLogged}</span>
            <span className="text-xs font-bold text-slate-500">Logged Entries</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>Confidential Doctor Notes</span>
            <span className="text-indigo-700 font-semibold text-[10px] bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
              RLS Secured
            </span>
          </div>
        </div>

        {/* KPI 4: Priority Scoring Threshold */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-emerald-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Doctor Review Trigger
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">Score &ge; 70</span>
            <span className="text-xs font-bold text-slate-500">/ 100</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>Automated Queue Escalation</span>
            <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
              Protocol
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Clinical Safety Notice Banner (Rule 6) */}
      <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-rose-950 text-xs">
            Mandatory Academic &amp; Clinical Safety Protocol (Non-Diagnostic Decision Support)
          </p>
          <p className="leading-relaxed text-[11px] text-rose-800">
            Algorithmic priority scores and risk categorizations generated by this deep-learning triage adapter are intended strictly to assist attending doctors in prioritizing review queues. <strong>They do NOT constitute a medical diagnosis, do NOT replace licensed clinical evaluation, and do NOT prescribe pharmaceuticals.</strong>
          </p>
        </div>
      </div>

      {/* Alert Dispatch Notice */}
      {alertCreatedNotice && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2 shadow-xs animate-in fade-in-50">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{alertCreatedNotice}</span>
        </div>
      )}

      {/* Main Two-Column Triage Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Resident Clinical Directory */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Resident Roster ({beneficiaries.length})
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">Select to analyze</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {beneficiaries.map((ben) => {
              const isSelected = ben.id === selectedBeneficiary?.id;
              const isSenior = ben.beneficiary_type === "elderly";
              const benRecord = medicalRecords.find((m) => m.beneficiary_id === ben.id);

              return (
                <div
                  key={ben.id}
                  onClick={() => {
                    setSelectedBenId(ben.id);
                    setAssessmentResult(null);
                    setAlertCreatedNotice(null);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-rose-50/70 border-rose-300 shadow-xs ring-1 ring-rose-200"
                      : "bg-white border-slate-200/90 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {ben.first_name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded capitalize ${
                            isSenior
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-sky-100 text-sky-800 border border-sky-200"
                          }`}
                        >
                          {ben.beneficiary_type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {ben.identifier_code} • Age: {ben.age} ({ben.gender})
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-rose-600 translate-x-1" : "text-slate-300"
                      }`}
                    />
                  </div>

                  {/* Quick Vitals Snapshot */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      BP:{" "}
                      <strong className="text-slate-900 font-bold">
                        {benRecord?.systolic_bp ? `${benRecord.systolic_bp}/${benRecord.diastolic_bp}` : "Pending"}
                      </strong>
                    </span>
                    <span className="text-slate-500">
                      Sugar:{" "}
                      <strong className="text-slate-900 font-bold">
                        {benRecord?.blood_sugar_fasting ? `${benRecord.blood_sugar_fasting} mg/dL` : "Pending"}
                      </strong>
                    </span>
                    <span className="text-slate-500">
                      BMI:{" "}
                      <strong className="text-slate-900 font-bold">
                        {benRecord?.bmi ? `${benRecord.bmi}` : "N/A"}
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Clinical Evaluation & AI Triage */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected Resident Clinical Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedBeneficiary?.first_name}
                  </h3>
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedBeneficiary?.identifier_code}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {selectedBeneficiary?.beneficiary_type === "elderly" ? "Geriatric Care Home Resident" : "Pediatric Child Home Resident"} • Enrolled since {formatDate(selectedBeneficiary?.admission_date || "")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleRunAssessment}
                  disabled={evaluating}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  {evaluating ? (
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Run AI Clinical Triage
                </Button>
              </div>
            </div>

            {/* Current Recorded Biometrics Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Latest Recorded Biometrics &amp; Vitals
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {latestRecord ? `Recorded: ${formatDate(latestRecord.measurement_date)}` : "Baseline Seed Data"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* BP */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Blood Pressure</span>
                  <span className="text-lg font-black text-slate-900 mt-0.5 block">
                    {latestRecord?.systolic_bp || 120} / {latestRecord?.diastolic_bp || 80}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">mmHg (Systolic/Dia)</span>
                </div>

                {/* Fasting Sugar */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Fasting Glucose</span>
                  <span className="text-lg font-black text-slate-900 mt-0.5 block">
                    {latestRecord?.blood_sugar_fasting || 95}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">mg/dL (Fasting)</span>
                </div>

                {/* BMI */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Body Mass Index</span>
                  <span className="text-lg font-black text-slate-900 mt-0.5 block">
                    {latestRecord?.bmi || 22.4}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">kg/m² (Computed)</span>
                </div>

                {/* Mobility */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Mobility Status</span>
                  <span className="text-sm font-extrabold text-slate-900 mt-1 capitalize block truncate">
                    {latestRecord?.mobility_status || "Independent"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Physical Autonomy</span>
                </div>
              </div>
            </div>

            {/* Chronic Conditions & Prescriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Diagnosed Chronic Conditions:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(latestRecord?.chronic_diseases || ["Routine pediatric monitoring"]).map((c, i) => (
                    <span key={i} className="text-[10px] font-bold bg-white text-slate-800 px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Current Active Medications:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(latestRecord?.current_medications || ["Multivitamin Supplements"]).map((m, i) => (
                    <span key={i} className="text-[10px] font-bold bg-white text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 shadow-2xs">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Physician Notes */}
            {latestRecord?.doctor_notes && (
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-950 font-medium">
                <span className="font-bold text-amber-900 block text-[11px] mb-0.5">Doctor Clinical Notes:</span>
                {latestRecord.doctor_notes}
              </div>
            )}
          </div>

          {/* AI Clinical Triage Results Panel */}
          {assessmentResult ? (
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-5 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">
                      Composite Welfare Priority Assessment
                    </h4>
                    <p className="text-xs text-slate-400">
                      Multivariate weighted risk formula: P = w_a A_norm + w_r R_norm + w_c C_norm + w_m M_norm
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      assessmentResult.risk_class === "high"
                        ? "bg-rose-500 text-white animate-pulse"
                        : assessmentResult.risk_class === "medium"
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {assessmentResult.risk_class} Risk Class
                  </span>
                </div>
              </div>

              {/* Score Gauge & Escalation Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-1 bg-white/10 rounded-xl p-4 text-center border border-white/10">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                    Priority Score
                  </span>
                  <div className="text-4xl font-black text-white mt-1">
                    {assessmentResult.welfare_priority_score}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        assessmentResult.welfare_priority_score >= 70
                          ? "bg-rose-500"
                          : assessmentResult.welfare_priority_score >= 40
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      }`}
                      style={{ width: `${assessmentResult.welfare_priority_score}%` }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                    Clinical Workflow Action
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {assessmentResult.welfare_priority_score >= 70
                      ? "Critical prioritization threshold exceeded. Clinical alert has been dispatched to the central medical dashboard. Attending physician examination queued within 24 hours."
                      : assessmentResult.welfare_priority_score >= 40
                      ? "Moderate biometric variance detected. Patient scheduled for routine weekly nursing review and vitals verification."
                      : "All vital metrics align with stable pediatric/adult reference norms. Routine seasonal care schedule maintained."}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Model: {assessmentResult.model_name} • Confidence: {(assessmentResult.confidence_score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* SHAP Feature Contribution Waterfall */}
              <div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  SHAP Explainability (Biometric Feature Contributions)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {assessmentResult.shap_contributions.map((shap, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 p-2.5 rounded-lg border border-white/5 flex items-center justify-between"
                    >
                      <span className="capitalize text-slate-300 font-medium text-[11px]">
                        {shap.feature.replace(/_/g, " ")}:
                      </span>
                      <span className="font-mono font-bold text-rose-300 text-xs">
                        {shap.contribution}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-800 text-sm">
                No active health triage evaluation run yet
              </p>
              <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                Click &quot;Run AI Clinical Triage&quot; above to calculate the multi-parameter Welfare Priority Score and inspect SHAP explainability.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Record Vitals Modal */}
      <RecordVitalsModal
        isOpen={isRecordVitalsOpen}
        onClose={() => setIsRecordVitalsOpen(false)}
        targetBeneficiaryId={selectedBeneficiary?.id}
      />
    </div>
  );
}
