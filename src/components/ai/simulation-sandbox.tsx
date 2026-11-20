"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Sliders,
  Layers,
  Activity,
  Boxes,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function SimulationSandbox() {
  const [domain, setDomain] = useState<"resource" | "clinical">("clinical");

  // Clinical Simulation Parameters
  const [systolic, setSystolic] = useState(135);
  const [glucose, setGlucose] = useState(120);
  const [bmi, setBmi] = useState(24.5);
  const [chronicCount, setChronicCount] = useState(1);
  const [residentAge, setResidentAge] = useState(72);

  // Resource Simulation Parameters
  const [census, setCensus] = useState(55);
  const [season, setSeason] = useState<"winter" | "summer" | "monsoon">("winter");
  const [isFestival, setIsFestival] = useState(true);

  // Clinical Simulation Heuristic Calculation
  const baselineScore = 58; // Baseline for average senior
  const simulatedScore = Math.min(
    100,
    Math.round(
      (systolic >= 160 ? 30 : systolic >= 140 ? 20 : 10) +
      (glucose >= 140 ? 25 : glucose >= 110 ? 15 : 5) +
      (bmi >= 28 ? 15 : 5) +
      chronicCount * 12 +
      (residentAge >= 75 ? 20 : 10)
    )
  );

  const clinicalDelta = simulatedScore - baselineScore;

  // Resource Simulation Heuristic Calculation
  const baselineFood = 836; // kg
  const seasonMult = season === "winter" ? 1.05 : season === "summer" ? 0.98 : 1.0;
  const festivalMult = isFestival ? 1.12 : 1.0;
  const simulatedFood = Math.round(census * 15.2 * seasonMult * festivalMult);
  const foodDelta = simulatedFood - baselineFood;

  const baselineBudget = 104250;
  const simulatedBudget = Math.round((census * 1750 + 8000) * (isFestival ? 1.15 : 1.0));
  const budgetDelta = simulatedBudget - baselineBudget;

  return (
    <div className="space-y-6">
      {/* Header and Domain Switcher */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Interactive What-If Scenario Simulation Sandbox
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Model hypothetical clinical interventions and procurement demand shocks with side-by-side delta visualization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setDomain("clinical")}
            className={`px-3 py-1.5 text-xs rounded-md font-bold transition-all cursor-pointer ${
              domain === "clinical"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Clinical Triage What-If
          </button>
          <button
            onClick={() => setDomain("resource")}
            className={`px-3 py-1.5 text-xs rounded-md font-bold transition-all cursor-pointer ${
              domain === "resource"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Supply Quota What-If
          </button>
        </div>
      </div>

      {/* Strict Simulation Watermark Alert */}
      <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2.5 shadow-xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="font-semibold leading-relaxed">
          <strong>Mandatory Integrity Notice:</strong> This is a sandboxed scenario simulation for capacity planning and diagnostic modeling. Simulated outputs are ephemeral and are strictly <strong>NOT</strong> persisted to patient clinical medical records.
        </span>
      </div>

      {/* Main Grid: Inputs Left vs. Comparative Delta Right */}
      {domain === "clinical" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinical Simulation Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
              Hypothetical Patient Biometric Sliders
            </span>

            {/* Systolic BP Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Systolic Blood Pressure</span>
                <span className="font-mono font-bold text-rose-600">{systolic} mmHg</span>
              </div>
              <input
                type="range"
                min={90}
                max={200}
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Normal (115)</span>
                <span>Stage 1 (140)</span>
                <span>Severe (180+)</span>
              </div>
            </div>

            {/* Fasting Glucose Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Fasting Blood Sugar</span>
                <span className="font-mono font-bold text-amber-600">{glucose} mg/dL</span>
              </div>
              <input
                type="range"
                min={60}
                max={300}
                value={glucose}
                onChange={(e) => setGlucose(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Normal (85)</span>
                <span>Pre-diabetic (115)</span>
                <span>Diabetic Spike (200+)</span>
              </div>
            </div>

            {/* Chronic Illnesses */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Comorbid Chronic Illnesses</span>
                <span className="font-mono font-bold text-slate-900">{chronicCount} Diseases</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setChronicCount(n)}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      chronicCount === n
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {n} {n === 1 ? "Disease" : "Diseases"}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Resident Age</span>
                <span className="font-mono font-bold text-slate-900">{residentAge} Years</span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                value={residentAge}
                onChange={(e) => setResidentAge(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Comparative Delta Result Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
                Comparative Impact: Baseline vs. Simulated
              </span>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Baseline */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Baseline Population Mean
                  </span>
                  <span className="text-3xl font-black text-slate-700 mt-1 block">
                    {baselineScore}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-1">
                    Standard Geriatric Profile
                  </span>
                </div>

                {/* Simulated Output */}
                <div className={`p-4 rounded-xl border text-center ${
                  simulatedScore >= 70 ? "bg-rose-50 border-rose-200" : "bg-indigo-50 border-indigo-200"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
                    Simulated Scenario Score
                  </span>
                  <span className={`text-3xl font-black mt-1 block ${
                    simulatedScore >= 70 ? "text-rose-600" : "text-indigo-900"
                  }`}>
                    {simulatedScore}
                  </span>
                  <span className={`text-[10px] font-bold block mt-1 ${
                    simulatedScore >= 70 ? "text-rose-700" : "text-indigo-700"
                  }`}>
                    {simulatedScore >= 70 ? "High Priority Triggered" : "Moderate Monitoring"}
                  </span>
                </div>
              </div>

              {/* Delta Callout */}
              <div className="mt-4 p-3 bg-slate-100 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Projected Score Variance (&Delta;):</span>
                <span className={`font-mono text-sm ${clinicalDelta > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                  {clinicalDelta > 0 ? `+${clinicalDelta}` : clinicalDelta} Points
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              * The deep triage model indicates that reducing systolic blood pressure from {systolic} mmHg to 125 mmHg would reduce the resident&apos;s risk priority by ~18 points.
            </p>
          </div>
        </div>
      ) : (
        /* Resource Demand What-If */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
              Facility Census &amp; Shock Parameters
            </span>

            {/* Census Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Care Home Occupancy</span>
                <span className="font-mono font-bold text-indigo-600">{census} Residents</span>
              </div>
              <input
                type="range"
                min={20}
                max={150}
                value={census}
                onChange={(e) => setCensus(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Season Selector */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700 block">Season Shock Factor</span>
              <div className="grid grid-cols-3 gap-2">
                {(["winter", "summer", "monsoon"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeason(s)}
                    className={`py-1.5 rounded-lg border text-xs font-bold capitalize transition-all cursor-pointer ${
                      season === s
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Festival Toggle */}
            <div
              onClick={() => setIsFestival(!isFestival)}
              className={`p-3 rounded-lg border flex items-center justify-between text-xs cursor-pointer ${
                isFestival ? "bg-amber-50 border-amber-300 font-bold text-amber-900" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <span>Cultural Festival Month (+12% Demand Surge)</span>
              <input type="checkbox" checked={isFestival} onChange={(e) => setIsFestival(e.target.checked)} className="accent-amber-600" />
            </div>
          </div>

          {/* Results Delta */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
              Procurement Variance: Baseline vs. Simulated
            </span>

            <div className="space-y-3">
              {/* Food Grain Delta */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Monthly Food Grain Demand</span>
                  <span className="text-slate-400 text-[10px]">Baseline: {baselineFood} kg</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 text-sm block">{simulatedFood} kg</span>
                  <span className="font-bold font-mono text-[11px] text-indigo-700">
                    {foodDelta >= 0 ? `+${foodDelta}` : foodDelta} kg ({Math.round((foodDelta / baselineFood) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Budget Delta */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Operational Budget Quota</span>
                  <span className="text-slate-400 text-[10px]">Baseline: {formatCurrency(baselineBudget)}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 text-sm block">{formatCurrency(simulatedBudget)}</span>
                  <span className="font-bold font-mono text-[11px] text-indigo-700">
                    {budgetDelta >= 0 ? `+${formatCurrency(budgetDelta)}` : formatCurrency(budgetDelta)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
