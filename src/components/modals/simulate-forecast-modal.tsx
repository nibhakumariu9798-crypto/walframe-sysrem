"use client";

import React, { useState } from "react";
import { X, Sparkles, RefreshCw, CheckCircle2, TrendingUp, Sliders, Building2, Apple, Pill, Shirt, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { getAIAdapter } from "@/lib/ai";
import { ResourceForecastResult } from "@/lib/ai/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SimulateForecastModal({ isOpen, onClose }: Props) {
  const { institutions, addPrediction } = useDataStore();

  const [institutionId, setInstitutionId] = useState<string>(
    institutions[0]?.id || "24af4f81-d923-49a2-84f6-703c1b193827"
  );
  const [residentCount, setResidentCount] = useState<number>(55);
  const [season, setSeason] = useState<"summer" | "monsoon" | "winter" | "autumn">("winter");
  const [isFestivalMonth, setIsFestivalMonth] = useState<boolean>(true);
  const [prevFoodKg, setPrevFoodKg] = useState<number>(820);
  const [prevExpenseInr, setPrevExpenseInr] = useState<number>(95000);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResourceForecastResult[] | null>(null);
  const [persisted, setPersisted] = useState(false);

  if (!isOpen) return null;

  const selectedInst =
    institutions.find((i) => i.id === institutionId) || institutions[0] || {
      id: "all",
      name: "Selected Facility",
      current_occupancy: 55,
    };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPersisted(false);

    try {
      const adapter = getAIAdapter();
      const forecastResults = await adapter.forecastResource({
        institution_id: selectedInst.id,
        resident_count: Number(residentCount),
        season,
        is_festival_month: isFestivalMonth,
        prev_3m_avg_food_kg: Number(prevFoodKg),
        prev_3m_avg_expense_inr: Number(prevExpenseInr),
      });

      setResults(forecastResults);

      // Persist to predictions ledger in database
      forecastResults.forEach((res) => {
        addPrediction({
          institution_id: selectedInst.id !== "all" ? selectedInst.id : null,
          beneficiary_id: null,
          prediction_domain: "resource_forecast",
          target_variable: `${res.target}_requirement`,
          model_name: res.model_name,
          model_version: res.model_version,
          model_tier: res.model_tier,
          input_features: {
            facility_name: selectedInst.name,
            resident_count: Number(residentCount),
            season,
            is_festival_month: isFestivalMonth,
            prev_food_kg: Number(prevFoodKg),
            prev_expense_inr: Number(prevExpenseInr),
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

      setPersisted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                AI Demand Forecasting Simulator
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Multivariate regression inference (XGBoost &amp; Random Forest)
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

        <form onSubmit={handleSimulate} className="p-5 space-y-4 text-xs">
          {/* Facility Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Care Home Facility *
            </label>
            <select
              value={institutionId}
              onChange={(e) => {
                setInstitutionId(e.target.value);
                const found = institutions.find((i) => i.id === e.target.value);
                if (found) setResidentCount(found.current_occupancy || 50);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.institution_type === "orphanage" ? "Orphanage" : "Senior Living"}) — Occupancy: {i.current_occupancy}
                </option>
              ))}
            </select>
          </div>

          {/* Resident Census Slider */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1 text-xs">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Resident Census Count
              </span>
              <span className="font-mono font-black text-sm text-indigo-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                {residentCount} Individuals
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              step={1}
              value={residentCount}
              onChange={(e) => setResidentCount(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Small Home (10)</span>
              <span>Medium Facility (75)</span>
              <span>Large District Center (150)</span>
            </div>
          </div>

          {/* Season and Festival Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Seasonal Weather Index
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium capitalize"
              >
                <option value="winter">Winter (+Clothing / Blankets)</option>
                <option value="summer">Summer (High Hydration / Light Apparel)</option>
                <option value="monsoon">Monsoon (Antimalarial &amp; Hygiene)</option>
                <option value="autumn">Autumn (Standard Buffer)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Festival / Cultural Event
              </label>
              <div
                onClick={() => setIsFestivalMonth(!isFestivalMonth)}
                className={`flex items-center justify-between px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                  isFestivalMonth
                    ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                    : "bg-slate-50 border-slate-300 text-slate-600"
                }`}
              >
                <span>{isFestivalMonth ? "Festival Peak (+15% Demand)" : "Standard Monthly Demand"}</span>
                <input
                  type="checkbox"
                  checked={isFestivalMonth}
                  onChange={(e) => setIsFestivalMonth(e.target.checked)}
                  className="accent-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Historical Baseline Averages */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Prev 3-Mo Food Avg (kg)
              </label>
              <input
                type="number"
                min={100}
                max={5000}
                value={prevFoodKg}
                onChange={(e) => setPrevFoodKg(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Prev 3-Mo Monthly Budget (₹)
              </label>
              <input
                type="number"
                min={10000}
                max={1000000}
                value={prevExpenseInr}
                onChange={(e) => setPrevExpenseInr(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                required
              />
            </div>
          </div>

          {/* Submit Run Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs py-2.5"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-1.5" />
            )}
            Run Machine Learning Demand Forecast
          </Button>

          {/* Results Display */}
          {results && (
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 animate-in fade-in-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Inference Complete &amp; Logged to Audit
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedInst.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {results.map((r) => (
                  <div key={r.target} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      {r.target} Demand:
                    </span>
                    <span className="text-base font-black text-white">
                      {r.target === "budget"
                        ? formatCurrency(r.predicted_value)
                        : `${r.predicted_value} ${r.unit}`}
                    </span>
                    <span className="text-[9px] font-mono text-indigo-400 block mt-0.5">
                      Model: {r.model_name.split("-")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
