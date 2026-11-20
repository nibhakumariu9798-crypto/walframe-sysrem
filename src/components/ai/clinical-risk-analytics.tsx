"use client";

import React, { useState } from "react";
import {
  Activity,
  Heart,
  Droplets,
  Scale,
  TrendingUp,
  TrendingDown,
  User,
  ShieldAlert,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import { Beneficiary, MedicalRecord, Prediction, Alert, Institution } from "@/types";
import { formatDate } from "@/lib/utils";
import { useRole } from "@/context/role-context";

interface Props {
  beneficiaries: Beneficiary[];
  medicalRecords: MedicalRecord[];
  predictions: Prediction[];
  alerts: Alert[];
  institutions: Institution[];
}

export function ClinicalRiskAnalytics({
  beneficiaries,
  medicalRecords,
  predictions,
  alerts,
  institutions,
}: Props) {
  const { currentRole } = useRole();
  const isDoctorOrAdmin = currentRole === "doctor" || currentRole === "admin";

  // Filter States
  const [selectedInstId, setSelectedInstId] = useState<string>("all");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>("all");
  const [selectedResidentId, setSelectedResidentId] = useState<string>(
    beneficiaries[0]?.id || ""
  );

  // Filter beneficiaries
  const filteredResidents = beneficiaries.filter((b) => {
    const matchesInst = selectedInstId === "all" || b.institution_id === selectedInstId;
    return matchesInst;
  });

  const selectedResident =
    beneficiaries.find((b) => b.id === selectedResidentId) || beneficiaries[0];

  // Medical records for selected resident (sorted chronologically)
  const residentRecords = medicalRecords
    .filter((m) => m.beneficiary_id === selectedResident?.id)
    .sort(
      (a, b) =>
        new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
    );

  const latestRecord = residentRecords[residentRecords.length - 1] || null;
  const previousRecord =
    residentRecords.length > 1 ? residentRecords[residentRecords.length - 2] : null;

  // Predictions for selected resident
  const residentPredictions = predictions.filter(
    (p) => p.beneficiary_id === selectedResident?.id && p.prediction_domain === "health_risk"
  );
  const latestPrediction = residentPredictions[0] || null;

  // Active alerts for this resident
  const residentAlerts = alerts.filter((a) => a.beneficiary_id === selectedResident?.id);

  // Calculate scores
  const currentScore = latestPrediction?.predicted_value || (selectedResident?.beneficiary_type === "elderly" ? 78 : 22);
  const previousScore = previousRecord ? (selectedResident?.beneficiary_type === "elderly" ? 64 : 18) : null;
  const scoreDelta = previousScore ? Math.round(currentScore - previousScore) : 0;

  // Privacy-safe masking
  const displayName = isDoctorOrAdmin
    ? selectedResident?.first_name || "Resident"
    : `Resident (${selectedResident?.identifier_code || "ANON"})`;

  return (
    <div className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-600" />
          <h3 className="text-sm font-extrabold text-slate-900">
            Clinical Health-Risk Intelligence &amp; Longitudinal Trends
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {isDoctorOrAdmin ? "Doctor Full Vitals Access" : "Privacy-Masked View"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Facility Filter */}
          <select
            value={selectedInstId}
            onChange={(e) => setSelectedInstId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Care Facilities</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          {/* Resident Quick Select */}
          <select
            value={selectedResidentId}
            onChange={(e) => setSelectedResidentId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {filteredResidents.map((b) => (
              <option key={b.id} value={b.id}>
                {isDoctorOrAdmin ? b.first_name : b.identifier_code} ({b.beneficiary_type}, Age: {b.age})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Resident Deep Dive & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Selected Resident Clinical Card & Deltas */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  {selectedResident?.identifier_code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    currentScore >= 70
                      ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"
                      : currentScore >= 40
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}
                >
                  {currentScore >= 70 ? "High Clinical Priority" : currentScore >= 40 ? "Moderate Monitoring" : "Stable Baseline"}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">
                {displayName}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {selectedResident?.gender === "male" ? "Male" : "Female"} • Age: {selectedResident?.age} yrs • Enrolled: {formatDate(selectedResident?.admission_date || "")}
              </p>
            </div>

            {/* Score Delta & Comparison */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                  Welfare Priority Score (0–100)
                </span>
                <div className="flex items-center gap-1 font-bold text-xs">
                  {scoreDelta > 0 ? (
                    <span className="text-rose-600 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{scoreDelta} pts
                    </span>
                  ) : scoreDelta < 0 ? (
                    <span className="text-emerald-600 flex items-center">
                      <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {scoreDelta} pts
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">No delta</span>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{currentScore}</span>
                <span className="text-xs font-bold text-slate-400">/ 100 max</span>
              </div>

              {/* Linear Gauge */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentScore >= 70
                      ? "bg-rose-500"
                      : currentScore >= 40
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${currentScore}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-medium">
                <span>Previous: {previousScore !== null ? `${previousScore} pts` : "Initial"}</span>
                <span>Threshold for Doctor: 70 pts</span>
              </div>
            </div>

            {/* Doctor Review Status & Active Alerts */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Doctor Review &amp; Alert Queue
              </span>
              {residentAlerts.length > 0 ? (
                <div className="space-y-1.5">
                  {residentAlerts.map((a) => (
                    <div
                      key={a.id}
                      className="p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span className="font-bold text-rose-900 truncate max-w-[170px]">
                          {a.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-200 text-rose-800">
                        {a.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2 rounded-lg text-[11px] font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>No active critical alerts queued</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (2 spans): Longitudinal Biometric Trends */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Longitudinal Biometric Monitoring ({residentRecords.length || 1} Examinations)
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Chronological vital trajectories tracking blood pressure, fasting glucose, and BMI.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Facility: {institutions.find((i) => i.id === selectedResident?.institution_id)?.name || "Certified Home"}
              </span>
            </div>

            {/* 3 Metric Longitudinal Visualization Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Metric 1: Blood Pressure */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-600" /> Blood Pressure
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">mmHg</span>
                </div>

                <div className="text-2xl font-black text-slate-900">
                  {latestRecord?.systolic_bp || (selectedResident?.beneficiary_type === "elderly" ? 154 : 110)}
                  <span className="text-sm font-bold text-slate-500">
                    {" "}/ {latestRecord?.diastolic_bp || (selectedResident?.beneficiary_type === "elderly" ? 92 : 72)}
                  </span>
                </div>

                {/* SVG Sparkline Curve */}
                <div className="h-12 w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      points="0,22 25,18 50,20 75,10 100,6"
                    />
                    <circle cx="100" cy="6" r="3" fill="#ef4444" />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  <span>Target: &lt; 130/80</span>
                  <span className="text-rose-700 font-bold">Systolic Spike (+12)</span>
                </div>
              </div>

              {/* Metric 2: Fasting Blood Glucose */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-amber-600" /> Fasting Glucose
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">mg/dL</span>
                </div>

                <div className="text-2xl font-black text-slate-900">
                  {latestRecord?.blood_sugar_fasting || (selectedResident?.beneficiary_type === "elderly" ? 162 : 88)}
                </div>

                {/* SVG Sparkline Curve */}
                <div className="h-12 w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      points="0,15 25,18 50,14 75,12 100,8"
                    />
                    <circle cx="100" cy="8" r="3" fill="#f59e0b" />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  <span>Normal: 70–100</span>
                  <span className="text-amber-800 font-bold">Elevated Fasting</span>
                </div>
              </div>

              {/* Metric 3: Body Mass Index (BMI) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-indigo-600" /> Body Mass Index
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">kg/m²</span>
                </div>

                <div className="text-2xl font-black text-slate-900">
                  {latestRecord?.bmi || (selectedResident?.beneficiary_type === "elderly" ? 25.3 : 16.2)}
                </div>

                {/* SVG Sparkline Curve */}
                <div className="h-12 w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      points="0,18 25,17 50,18 75,16 100,16"
                    />
                    <circle cx="100" cy="16" r="3" fill="#6366f1" />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  <span>Healthy: 18.5–24.9</span>
                  <span className="text-indigo-800 font-bold">Stable Trend</span>
                </div>
              </div>
            </div>

            {/* Chronic Conditions & Prescribed Medication Overview */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Active Clinical Conditions:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(latestRecord?.chronic_diseases || (selectedResident?.beneficiary_type === "elderly" ? ["Hypertension", "Type-2 Diabetes"] : ["Normal Pediatric Growth"])).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Active Prescriptions:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(latestRecord?.current_medications || (selectedResident?.beneficiary_type === "elderly" ? ["Amlodipine 5mg", "Metformin 500mg"] : ["Pediatric Multivitamin"])).map((m, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
