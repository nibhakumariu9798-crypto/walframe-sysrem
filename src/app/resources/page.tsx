"use client";

import React, { useState } from "react";
import {
  Boxes,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Plus,
  PackageCheck,
  Building2,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Apple,
  Pill,
  Shirt,
  Sparkle,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { getAIAdapter } from "@/lib/ai";
import { ResourceForecastResult } from "@/lib/ai/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RestockInventoryModal } from "@/components/modals/restock-inventory-modal";

export default function ResourcesPage() {
  const { inventory, institutions, restockItem, addPrediction } = useDataStore();

  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastResults, setForecastResults] = useState<ResourceForecastResult[] | null>(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [targetItemId, setTargetItemId] = useState<string | undefined>(undefined);
  const [persistedNotice, setPersistedNotice] = useState(false);

  // Filter inventory
  const filtered = inventory.filter((item) => {
    const matchesInst = selectedInstitution === "all" || item.institution_id === selectedInstitution;
    const matchesCat = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch = item.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesInst && matchesCat && matchesSearch;
  });

  // Calculate live aggregates
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter((i) => i.current_stock <= i.reorder_threshold);
  const totalFoodKg = inventory
    .filter((i) => i.category === "food" && i.unit.toLowerCase() === "kg")
    .reduce((sum, i) => sum + i.current_stock, 0);
  const totalMedicineUnits = inventory
    .filter((i) => i.category === "medicine")
    .reduce((sum, i) => sum + i.current_stock, 0);

  const getInstitutionName = (id: string) => {
    const found = institutions.find((i) => i.id === id);
    return found ? found.name : "Welfare Care Home";
  };

  const currentInst =
    institutions.find((i) => i.id === selectedInstitution) || institutions[0] || {
      id: "all",
      name: "All Certified Facilities",
      current_occupancy: 52,
    };

  const handleRunForecast = async () => {
    setForecastLoading(true);
    setPersistedNotice(false);
    try {
      const adapter = getAIAdapter();
      const results = await adapter.forecastResource({
        institution_id: currentInst.id,
        resident_count: currentInst.current_occupancy || 52,
        season: "summer",
        is_festival_month: false,
        prev_3m_avg_food_kg: 795,
        prev_3m_avg_expense_inr: 90000,
      });
      setForecastResults(results);

      // Persist forecasts to immutable predictions table
      results.forEach((res) => {
        addPrediction({
          institution_id: currentInst.id !== "all" ? currentInst.id : null,
          beneficiary_id: null,
          prediction_domain: "resource_forecast",
          target_variable: `${res.target}_demand`,
          model_name: res.model_name,
          model_version: res.model_version,
          model_tier: res.model_tier,
          input_features: {
            resident_count: currentInst.current_occupancy || 52,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center text-white shadow-xs">
              <Boxes className="w-4 h-4 text-sky-100" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Resource Management &amp; Inventory Ledger
            </h1>
            <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700 border-slate-300">
              {totalItems} Tracked Items
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-category tracking of food grains, clothing, and essential medicines with automated reorder triggers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTargetItemId(undefined);
              setIsRestockOpen(true);
            }}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Restock / Add Supply
          </Button>

          <Button
            size="sm"
            onClick={handleRunForecast}
            disabled={forecastLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
          >
            {forecastLoading ? (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            )}
            Run AI Demand Forecast
          </Button>
        </div>
      </div>

      {/* 4 Top KPI Cards with Colored Top Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Supplies Tracked */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#0284c7] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Stock Items
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalItems} SKUs</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">
            Across Food, Medicine, Clothes &amp; Hygiene
          </div>
        </div>

        {/* KPI 2: Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#ef4444] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Low-Stock Deficits
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {lowStockItems.length}{" "}
            <span className="text-xs font-semibold text-slate-400">Items Alert</span>
          </div>
          <div className="text-[11px] font-medium text-rose-700 mt-1">
            {lowStockItems.length > 0 ? "Requires Immediate Restock" : "All Stock Levels Healthy"}
          </div>
        </div>

        {/* KPI 3: Food Reserves */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#10b981] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Food Grain Reserves
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Apple className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">{totalFoodKg} kg</div>
          <div className="text-[11px] font-medium text-emerald-700 mt-1">
            Fortified Rice, Dal &amp; Essentials
          </div>
        </div>

        {/* KPI 4: Medical Inventory */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#4f46e5] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Essential Medicines
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Pill className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-950 mt-2">{totalMedicineUnits} Units</div>
          <div className="text-[11px] font-medium text-indigo-700 mt-1">
            Hypertension, Diabetes &amp; Pediatric Care
          </div>
        </div>
      </div>

      {/* AI DEMAND FORECAST RESULTS PANEL (Dynamic) */}
      {forecastResults && (
        <Card className="bg-gradient-to-r from-sky-50/50 via-indigo-50/30 to-blue-50/40 border-2 border-indigo-200 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base text-indigo-950 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  AI Resource Demand Projections (Next Month Forecast)
                </CardTitle>
                <CardDescription className="text-xs text-slate-600">
                  Multivariate regression predictions for {currentInst.name} based on verified census ({currentInst.current_occupancy || 52} residents).
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {persistedNotice && (
                  <Badge variant="success" className="text-[10px] font-bold">
                    ✓ Logged to Predictions Audit
                  </Badge>
                )}
                <Badge variant="indigo" className="text-[10px] font-semibold">
                  Dynamic Census Heuristic
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {forecastResults.map((res) => (
                <div
                  key={res.target}
                  className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-slate-600">
                      {res.target} Requirement
                    </span>
                    <Badge variant="secondary" className="text-[9px] font-bold">
                      {res.model_name.split("-")[0]}
                    </Badge>
                  </div>

                  <div className="text-2xl font-black text-slate-900">
                    {res.target === "budget"
                      ? formatCurrency(res.predicted_value)
                      : `${res.predicted_value} ${res.unit}`}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    {res.factors.map((f, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="capitalize">{f.feature.replace("_", " ")}:</span>
                        <span className="font-bold text-slate-900">{f.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-indigo-900 italic font-medium">
              * Research Protocol Notice: Projections are generated by the machine learning regression model to assist procurement planning without human bias.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search supply name (e.g. Rice, Paracetamol)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(["all", "food", "medicine", "clothing", "hygiene"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer capitalize ${
                  filterCategory === cat
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? "All Supplies" : cat}
              </button>
            ))}
          </div>

          {/* Care Home Filter Dropdown */}
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Care Homes</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* INVENTORY STOCK LEDGER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
            <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-800 text-sm">
              {inventory.length === 0 ? "No inventory items recorded yet" : "No matching supplies found"}
            </p>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">
              {inventory.length === 0
                ? "Click 'Restock / Add Supply' above to catalog supplies into the database."
                : "Try clearing your search query or category filter."}
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isLow = item.current_stock <= item.reorder_threshold;
            const stockRatio =
              item.reorder_threshold > 0
                ? Math.round((item.current_stock / item.reorder_threshold) * 100)
                : 100;

            const topBorderClass = isLow
              ? "border-t-4 border-t-rose-500"
              : stockRatio < 150
              ? "border-t-4 border-t-amber-500"
              : "border-t-4 border-t-emerald-500";

            const barColor = isLow
              ? "bg-rose-500"
              : stockRatio < 150
              ? "bg-amber-500"
              : "bg-emerald-500";

            return (
              <Card
                key={item.id}
                className={`bg-white border-slate-200 shadow-xs hover:shadow-md transition-shadow ${topBorderClass}`}
              >
                <CardHeader className="pb-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base text-slate-900 font-bold">
                        {item.item_name}
                      </CardTitle>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{getInstitutionName(item.institution_id)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge
                        variant={isLow ? "danger" : stockRatio < 150 ? "warning" : "success"}
                        className="text-[10px]"
                      >
                        {isLow ? "Low Stock Alert" : stockRatio < 150 ? "Moderate Stock" : "Sufficient"}
                      </Badge>
                      <Badge variant="secondary" className="capitalize text-[10px]">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3.5 text-xs">
                  {/* Stock Level Progress */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-semibold text-slate-600">
                        Current Available Stock:
                      </span>
                      <span className="font-black text-slate-900 text-sm">
                        {item.current_stock} {item.unit}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${barColor} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(100, (item.current_stock / (item.reorder_threshold * 2)) * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>Reorder Threshold: {item.reorder_threshold} {item.unit}</span>
                      <span className={isLow ? "text-rose-600 font-bold" : "text-emerald-700 font-semibold"}>
                        {isLow ? "CRITICAL REPLENISHMENT NEEDED" : "Safe Operational Buffer"}
                      </span>
                    </div>
                  </div>

                  {/* Quick Restock Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Last Updated: {formatDate(item.last_restocked_at || "")}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 mr-1">Quick Restock:</span>
                      <button
                        onClick={() => handleQuickRestock(item.id, 10)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        title="Add +10 units"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleQuickRestock(item.id, 50)}
                        className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        title="Add +50 units"
                      >
                        +50
                      </button>
                      <button
                        onClick={() => handleQuickRestock(item.id, 100)}
                        className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        title="Add +100 units"
                      >
                        +100
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <RestockInventoryModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        targetItemId={targetItemId}
      />
    </div>
  );
}
