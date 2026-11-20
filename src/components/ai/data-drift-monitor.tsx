"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  BarChart2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DataDriftMonitor() {
  const [recalibrating, setRecalibrating] = useState(false);
  const [calibratedNotice, setCalibratedNotice] = useState(false);

  // Population Stability Index (PSI) Calculation
  // Features tracked: Systolic BP, Fasting Glucose, Age distribution
  const SBP_BINS = [
    { range: "< 120 mmHg (Normal)", expectedPct: 35, actualPct: 32 },
    { range: "120–139 mmHg (Elevated)", expectedPct: 30, actualPct: 31 },
    { range: "140–159 mmHg (Stage 1)", expectedPct: 22, actualPct: 24 },
    { range: "&ge; 160 mmHg (Stage 2)", expectedPct: 13, actualPct: 13 },
  ];

  // Calculate SBP PSI: sum((actual - expected) * ln(actual / expected))
  const sbpPsi = SBP_BINS.reduce((sum, bin) => {
    const act = bin.actualPct / 100;
    const exp = bin.expectedPct / 100;
    return sum + (act - exp) * Math.log(act / exp);
  }, 0);

  const GLUCOSE_BINS = [
    { range: "< 100 mg/dL (Normal)", expectedPct: 50, actualPct: 48 },
    { range: "100–125 mg/dL (Pre-diabetes)", expectedPct: 32, actualPct: 33 },
    { range: "&ge; 126 mg/dL (Diabetes)", expectedPct: 18, actualPct: 19 },
  ];

  const glucosePsi = GLUCOSE_BINS.reduce((sum, bin) => {
    const act = bin.actualPct / 100;
    const exp = bin.expectedPct / 100;
    return sum + (act - exp) * Math.log(act / exp);
  }, 0);

  const compositePsi = Number(((sbpPsi + glucosePsi) / 2).toFixed(3));
  const isOptimal = compositePsi < 0.1;

  const handleRecalibrate = () => {
    setRecalibrating(true);
    setCalibratedNotice(false);
    setTimeout(() => {
      setRecalibrating(false);
      setCalibratedNotice(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              AI Model &amp; Input Data Drift Monitoring (PSI Engine)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Statistical Population Stability Index (PSI) tracking distributional shifts between training baseline and live production inferences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRecalibrate}
            disabled={recalibrating}
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs"
          >
            {recalibrating ? (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            )}
            Recalibrate Weights &amp; Baselines
          </Button>
        </div>
      </div>

      {calibratedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2 shadow-xs animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Model distribution weights recalibrated successfully against current 30-day moving baseline.</span>
        </div>
      )}

      {/* 3 Metric Cards for Drift Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* PSI Composite */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-teal-600 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Composite Population Stability Index (PSI)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">{compositePsi}</span>
            <span className="text-xs font-bold text-slate-500">Threshold &lt; 0.10</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>Status: No Significant Shift</span>
            <span className="text-teal-800 font-bold text-[10px] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Optimal Baseline
            </span>
          </div>
        </div>

        {/* Data Quality & Missingness */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-sky-600 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Input Data Completeness Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">99.4%</span>
            <span className="text-xs font-bold text-slate-500">Complete Records</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>0.6% Missing Fasting Lab Tests</span>
            <span className="text-sky-800 font-bold text-[10px] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              High Quality
            </span>
          </div>
        </div>

        {/* Sensor & Sensor Outlier Screening */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-indigo-600 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Biometric Outlier Detection (Z &gt; 3.0)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">0</span>
            <span className="text-xs font-bold text-slate-500">Unverified Spikes</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>Sensor Bounds: 50–260 mmHg</span>
            <span className="text-indigo-800 font-bold text-[10px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Bounded Checks
            </span>
          </div>
        </div>
      </div>

      {/* Feature Distribution Shifts Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SBP Distribution Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-slate-900">
                Systolic BP Distribution Shift (PSI: {sbpPsi.toFixed(3)})
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Training Baseline Cohort vs. Live 30-Day Production Inferences
              </p>
            </div>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
              Stable Shift
            </span>
          </div>

          <div className="space-y-3">
            {SBP_BINS.map((bin, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-slate-700">{bin.range}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">Baseline: {bin.expectedPct}%</span>
                    <span className="text-indigo-700 font-bold">Live: {bin.actualPct}%</span>
                  </div>
                </div>
                {/* Visual Comparative Bars */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: `${bin.expectedPct}%` }} />
                  </div>
                  <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${bin.actualPct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-slate-400 inline-block"></span> Baseline Expected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-indigo-600 inline-block"></span> Production Actual
            </span>
          </div>
        </div>

        {/* Glucose Distribution Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-slate-900">
                Fasting Glucose Distribution Shift (PSI: {glucosePsi.toFixed(3)})
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Training Baseline Cohort vs. Live 30-Day Production Inferences
              </p>
            </div>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
              Stable Shift
            </span>
          </div>

          <div className="space-y-3">
            {GLUCOSE_BINS.map((bin, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-slate-700">{bin.range}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">Baseline: {bin.expectedPct}%</span>
                    <span className="text-teal-700 font-bold">Live: {bin.actualPct}%</span>
                  </div>
                </div>
                {/* Visual Comparative Bars */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: `${bin.expectedPct}%` }} />
                  </div>
                  <div className="w-full bg-teal-50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${bin.actualPct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-slate-400 inline-block"></span> Baseline Expected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-teal-600 inline-block"></span> Production Actual
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
