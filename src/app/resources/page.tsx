"use client";

import React, { useState } from "react";
import { Boxes, Sparkles, TrendingUp, RefreshCw, AlertCircle, ShoppingCart, Plus, PackageCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { getAIAdapter } from "@/lib/ai";
import { ResourceForecastResult } from "@/lib/ai/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RestockInventoryModal } from "@/components/modals/restock-inventory-modal";

export default function ResourcesPage() {
  const { inventory, institutions, restockItem, resourceRecords, addPrediction } = useDataStore();

  const [selectedInstitution, setSelectedInstitution] = useState(institutions[0]?.id || "");
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastResults, setForecastResults] = useState<ResourceForecastResult[] | null>(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [targetItemId, setTargetItemId] = useState<string | undefined>(undefined);
  const [persistedNotice, setPersistedNotice] = useState(false);

  const currentInst = institutions.find((i) => i.id === selectedInstitution) || institutions[0];

  const handleRunForecast = async () => {
    setForecastLoading(true);
    setPersistedNotice(false);
    try {
      const adapter = getAIAdapter();
      const results = await adapter.forecastResource({
        institution_id: currentInst.id,
        resident_count: currentInst.current_occupancy,
        season: "summer",
        is_festival_month: false,
        prev_3m_avg_food_kg: 795,
        prev_3m_avg_expense_inr: 90000,
      });
      setForecastResults(results);

      // Persist forecasts to immutable predictions table
      results.forEach((res) => {
        addPrediction({
          institution_id: currentInst.id,
          beneficiary_id: null,
          prediction_domain: "resource_forecast",
          target_variable: `${res.target}_demand`,
          model_name: res.model_name,
          model_version: res.model_version,
          model_tier: res.model_tier,
          input_features: {
            resident_count: currentInst.current_occupancy,
            season: "summer",
            is_festival_month: false,
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
      setPersistedNotice(true);
    } finally {
      setForecastLoading(false);
    }
  };

  const handleQuickRestock = (id: string, amount: number) => {
    restockItem(id, amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600" />
            Resource Management &amp; Inventory Forecasting
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily stock of food, medicine, and clothing with AI-driven monthly demand forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTargetItemId(undefined);
              setIsRestockOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Restock / Add Supply
          </Button>

          <Button size="sm" onClick={handleRunForecast} disabled={forecastLoading}>
            {forecastLoading ? (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            )}
            Generate AI Forecast
          </Button>
        </div>
      </div>

      {/* FORECAST RESULTS PANEL */}
      {forecastResults && (
        <Card className="border-indigo-200 dark:border-indigo-900 bg-indigo-50/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Next-Month Resource Forecast Results (April 2026)
                </CardTitle>
                <CardDescription>
                  Forecast produced by baseline regression pipeline for {currentInst.name} ({currentInst.current_occupancy} residents).
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {persistedNotice && (
                  <Badge variant="success" className="text-xs">
                    ✓ Logged to Predictions Audit
                  </Badge>
                )}
                <Badge variant="indigo">Simulated Demo Adapter</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
              {forecastResults.map((res) => (
                <div
                  key={res.target}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-slate-500">
                      {res.target}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {res.model_name.split("-")[0]}
                    </Badge>
                  </div>

                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {res.target === "budget"
                      ? formatCurrency(res.predicted_value)
                      : `${res.predicted_value} ${res.unit}`}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                    {res.factors.map((f, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="capitalize">{f.feature.replace("_", " ")}:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{f.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-indigo-900 dark:text-indigo-300 italic">
              * Research Protocol Notice: These predicted quantities are generated by the local demo adapter for planning simulation.
            </p>
          </CardContent>
        </Card>
      )}

      {/* TWO SECTIONS: Current Inventory and Historical Consumption Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CURRENT INVENTORY */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Current Stock Inventory ({inventory.length} Items)</CardTitle>
                <CardDescription>Stock levels with threshold tracking &amp; instant restock</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {inventory.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                <Boxes className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No stock inventory recorded yet</p>
                <p className="text-slate-400 mt-1">Click &quot;Restock / Add Supply&quot; above to log items into the database.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {inventory.map((item) => {
                  const isLow = item.current_stock < item.reorder_threshold;
                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {item.item_name}
                          </span>
                          <Badge variant="secondary" className="capitalize text-[10px]">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Reorder Threshold: {item.reorder_threshold} {item.unit} &bull; Updated {formatDate(item.last_restocked_at || "")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span
                            className={`font-bold text-sm ${
                              isLow ? "text-amber-600" : "text-slate-900 dark:text-slate-100"
                            }`}
                          >
                            {item.current_stock} {item.unit}
                          </span>
                          <div className="mt-0.5">
                            <Badge variant={isLow ? "warning" : "success"}>
                              {isLow ? "Low Stock" : "Sufficient"}
                            </Badge>
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickRestock(item.id, 50)}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Add +50 units"
                        >
                          +50
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* HISTORICAL CONSUMPTION */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historical Monthly Consumption</CardTitle>
            <CardDescription>
              Chronological time-series used for training ML regression models
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resourceRecords.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No Historical Resource Logs</p>
                <p className="text-slate-400 mt-1">Monthly consumption logs recorded by institutions will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {resourceRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {rec.record_month === 1 ? "January" : rec.record_month === 2 ? "February" : "December"} {rec.record_year}
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {rec.season} {rec.is_festival_month && "&bull; Festival"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <div>
                        Food: <strong>{rec.food_consumed_kg} kg</strong>
                      </div>
                      <div>
                        Medicine: <strong>{rec.medicine_units} units</strong>
                      </div>
                      <div>
                        Expense: <strong>{formatCurrency(rec.monthly_expense_inr)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RestockInventoryModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        targetItemId={targetItemId}
      />
    </div>
  );
}
