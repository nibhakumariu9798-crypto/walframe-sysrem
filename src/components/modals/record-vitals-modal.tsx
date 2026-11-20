"use client";

import React, { useState } from "react";
import { X, Activity, Stethoscope, Heart, AlertCircle, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetBeneficiaryId?: string;
}

const COMMON_CHRONIC_CONDITIONS = [
  "Hypertension",
  "Type-2 Diabetes",
  "Osteoarthritis",
  "Asthma / COPD",
  "Cardiovascular Disease",
  "Chronic Kidney Disease",
  "Cognitive Impairment",
];

export function RecordVitalsModal({ isOpen, onClose, targetBeneficiaryId }: Props) {
  const { beneficiaries, addMedicalRecord } = useDataStore();

  const [selectedBenId, setSelectedBenId] = useState<string>(
    targetBeneficiaryId || beneficiaries[0]?.id || ""
  );
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [diastolicBp, setDiastolicBp] = useState<number>(80);
  const [bloodSugarFasting, setBloodSugarFasting] = useState<number>(95);
  const [weightKg, setWeightKg] = useState<number>(60);
  const [heightCm, setHeightCm] = useState<number>(165);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [medicationsInput, setMedicationsInput] = useState<string>("");
  const [mobilityStatus, setMobilityStatus] = useState<"independent" | "assisted" | "bedridden">("independent");
  const [doctorNotes, setDoctorNotes] = useState<string>("");

  if (!isOpen) return null;

  // Calculate live BMI
  const heightM = heightCm > 0 ? heightCm / 100 : 0;
  const liveBmi = heightM > 0 && weightKg > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : null;

  const toggleDisease = (disease: string) => {
    setSelectedDiseases((prev) =>
      prev.includes(disease) ? prev.filter((d) => d !== disease) : [...prev, disease]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBenId) return;

    const medications = medicationsInput
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    addMedicalRecord({
      beneficiary_id: selectedBenId,
      measurement_date: new Date().toISOString(),
      systolic_bp: Number(systolicBp),
      diastolic_bp: Number(diastolicBp),
      blood_sugar_fasting: Number(bloodSugarFasting),
      weight_kg: Number(weightKg),
      height_cm: Number(heightCm),
      chronic_diseases: selectedDiseases,
      current_medications: medications,
      mobility_status: mobilityStatus,
      doctor_notes: doctorNotes || "Routine physician vitals examination.",
      is_synthetic: true,
    });

    onClose();
  };

  const selectedBen = beneficiaries.find((b) => b.id === selectedBenId) || beneficiaries[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Record Clinical Vitals &amp; Biometrics
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Confidential physician clinical record entry with automatic BMI computation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Beneficiary Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Resident Beneficiary *
            </label>
            <select
              value={selectedBenId}
              onChange={(e) => setSelectedBenId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:bg-white"
            >
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.first_name} ({b.beneficiary_type === "child" ? "Child" : "Senior"}, Age: {b.age}) — {b.identifier_code}
                </option>
              ))}
            </select>
          </div>

          {/* Blood Pressure (Systolic / Diastolic) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                <Heart className="w-3.5 h-3.5 text-rose-600" /> Blood Pressure (mmHg)
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  systolicBp > 140 || diastolicBp > 90
                    ? "bg-rose-100 text-rose-800"
                    : systolicBp > 120
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {systolicBp > 140 || diastolicBp > 90
                  ? "Elevated / Hypertension"
                  : systolicBp > 120
                  ? "Pre-Hypertension"
                  : "Normal Range"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  Systolic (e.g. 120)
                </label>
                <input
                  type="number"
                  min={50}
                  max={260}
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  Diastolic (e.g. 80)
                </label>
                <input
                  type="number"
                  min={30}
                  max={160}
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Blood Sugar & Biometrics (Height, Weight, BMI) */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Fasting Sugar (mg/dL)
              </label>
              <input
                type="number"
                min={30}
                max={500}
                value={bloodSugarFasting}
                onChange={(e) => setBloodSugarFasting(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                min={5}
                max={250}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min={40}
                max={240}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                required
              />
            </div>
          </div>

          {/* Live Computed BMI Tag */}
          <div className="flex items-center justify-between p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-950 font-medium">
            <span className="text-[11px]">Computed Body Mass Index (BMI):</span>
            <span className="font-mono font-bold text-sm text-indigo-900">
              {liveBmi ? `${liveBmi} kg/m²` : "N/A"}
            </span>
          </div>

          {/* Chronic Conditions Checklist */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Identified Chronic Conditions
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_CHRONIC_CONDITIONS.map((cond) => {
                const active = selectedDiseases.includes(cond);
                return (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => toggleDisease(cond)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                      active
                        ? "bg-rose-50 text-rose-800 border-rose-300 font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {cond}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Daily Medications */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Current Medications (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Amlodipine 5mg, Metformin 500mg, Calcium D3"
              value={medicationsInput}
              onChange={(e) => setMedicationsInput(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Mobility Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobility Independence Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["independent", "assisted", "bedridden"] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMobilityStatus(m)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border capitalize transition-all cursor-pointer ${
                    mobilityStatus === m
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Physician Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Physician Clinical Observations
            </label>
            <textarea
              rows={2}
              placeholder="Observations on diet, adherence to prescription, physical vitality..."
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-slate-300 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs"
            >
              Save Confidential Clinical Vitals
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
