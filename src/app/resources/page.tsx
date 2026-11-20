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
  Download,
  LayoutGrid,
  List,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
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
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastResults, setForecastResults] = useState<ResourceForecastResult[] | null>(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [targetItemId, setTargetItemId] = useState<string | undefined>(undefined);
  const [persistedNotice, setPersistedNotice] = useState(false);

  // Filter inventory
  const filtered = inventory.filter((item) => {
    const matchesInst = selectedInstitution === "all" || item.institution_id === selectedInstitution;
    const matchesCat = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch =
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
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
    return found ? found.name : "Welfare Care Facility";
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

  const handleOpenRestockFor = (id: string) => {
    setTargetItemId(id);
    setIsRestockOpen(true);
  };

  // Safe CSV Export
  const exportLedgerCSV = () => {
    const headers = [
      "Item Name",
      "Category",
      "Current Stock",
      "Unit",
      "Reorder Threshold",
      "Stock Status",
      "Facility",
      "Last Restocked",
    ];
    const rows = filtered.map((item) => {
      const isLow = item.current_stock <= item.reorder_threshold;
      const status = isLow
        ? "CRITICAL_SHORTAGE"
        : item.current_stock < item.reorder_threshold * 1.5
        ? "MODERATE_RESERVE"
        : "SUFFICIENT_BUFFER";
      return [
        `"${item.item_name.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        item.current_stock,
        `"${item.unit}"`,
        item.reorder_threshold,
        `"${status}"`,
        `"${getInstitutionName(item.institution_id).replace(/"/g, '""')}"`,
        `"${item.last_restocked_at || ""}"`,
      ].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `welfare_inventory_ledger_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return <Apple className="w-4 h-4 text-amber-600" />;
      case "medicine":
        return <Pill className="w-4 h-4 text-indigo-600" />;
      case "clothing":
        return <Shirt className="w-4 h-4 text-sky-600" />;
      default:
        return <Boxes className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "food":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "medicine":
        return "bg-indigo-50 text-indigo-800 border-indigo-200/80";
      case "clothing":
        return "bg-sky-50 text-sky-800 border-sky-200/80";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Breadcrumb & Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Supply Chain &amp; Logistics
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Central Inventory Ledger
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Resource Management &amp; Inventory Ledger
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {totalItems} Tracked Items
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
              Multi-facility resource monitoring of food grains, clothing sets, and critical medicines with automated reorder thresholds and AI predictive demand forecasting.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={exportLedgerCSV}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-xs"
              title="Download CSV Inventory Report"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Export CSV
            </Button>

            <Button
              size="sm"
              onClick={() => {
                setTargetItemId(undefined);
                setIsRestockOpen(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5 text-white" /> Restock / Add Supply
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
      </div>

      {/* 4 Professional KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total SKUs Tracked */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-sky-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Stock SKUs
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{totalItems}</span>
            <span className="text-xs font-bold text-slate-500">Items Cataloged</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>Food, Medicine, Apparel</span>
            <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
              Active
            </span>
          </div>
        </div>

        {/* KPI 2: Low-Stock Deficits */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-rose-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Low-Stock Deficits
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-rose-600">{lowStockItems.length}</span>
            <span className="text-xs font-bold text-slate-500">Items Need Restock</span>
          </div>
          <div className="text-[11px] font-medium mt-1 flex items-center justify-between">
            <span className={lowStockItems.length > 0 ? "text-rose-700 font-semibold" : "text-emerald-700 font-semibold"}>
              {lowStockItems.length > 0 ? "Immediate Action Required" : "All Buffers Healthy"}
            </span>
            {lowStockItems.length > 0 && (
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded border border-rose-200 animate-pulse">
                Action Alert
              </span>
            )}
          </div>
        </div>

        {/* KPI 3: Food Reserves */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-emerald-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Food Grain Reserves
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <Apple className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{totalFoodKg}</span>
            <span className="text-xs font-bold text-slate-500">kg on Hand</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>Rice, Dal &amp; Staples</span>
            <span className="text-slate-600 font-semibold text-[10px] bg-slate-100 px-1.5 py-0.2 rounded">
              Audited
            </span>
          </div>
        </div>

        {/* KPI 4: Medical Inventory */}
        <div className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-indigo-600 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Essential Medicines
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{totalMedicineUnits}</span>
            <span className="text-xs font-bold text-slate-500">Units in Stock</span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>Hypertension &amp; Pediatric</span>
            <span className="text-indigo-700 font-semibold text-[10px] bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
              Clinical
            </span>
          </div>
        </div>
      </div>

      {/* AI DEMAND FORECAST RESULTS PANEL (Dynamic) */}
      {forecastResults && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-indigo-800/40">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  AI Resource Demand Projections — Next Month Horizon
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/30 text-indigo-200 rounded-md border border-indigo-400/30">
                  Dual ML Regression
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-1">
                Multivariate predictions for <span className="font-semibold text-white">{currentInst.name}</span> based on resident census ({currentInst.current_occupancy || 52} individuals), historical seasonal consumption, and clinical load.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {persistedNotice && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized with DB
                </span>
              )}
            </div>
          </div>

          {/* 4 Forecast Output Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {forecastResults.map((res) => (
              <div
                key={res.target}
                className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-indigo-200 uppercase tracking-wider text-[10px]">
                      {res.target} Target
                    </span>
                    <span className="text-[10px] font-mono font-semibold bg-white/10 px-1.5 py-0.5 rounded text-white/90">
                      {res.model_name.split("-")[0]}
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white mt-1">
                    {res.target === "budget"
                      ? formatCurrency(res.predicted_value)
                      : `${res.predicted_value} ${res.unit}`}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 space-y-1 text-[11px] text-indigo-200/90">
                  <span className="text-[10px] font-semibold text-indigo-300/80 uppercase">Key Influencing Factors:</span>
                  {res.factors.map((f, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px]">
                      <span className="capitalize text-slate-300">{f.feature.replace(/_/g, " ")}:</span>
                      <span className="font-bold text-white font-mono">{f.impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-indigo-800/30 text-[11px] text-indigo-300/80">
            <p className="italic">
              * Decision Support Guideline: Projections are computed via validated regression models to eliminate stockouts. Final replenishment requires authorized personnel review.
            </p>
            <span className="text-indigo-400 font-semibold text-[10px]">Model Tier: Production Deterministic</span>
          </div>
        </div>
      )}

      {/* Modern Filter, Search & View Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search supply name (e.g. Rice, Paracetamol)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Tabs & Care Home Select */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(["all", "food", "medicine", "clothing", "hygiene"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer capitalize ${
                  filterCategory === cat
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          {/* Institution Dropdown */}
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Care Facilities</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          {/* View Toggle (Grid vs Table) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* INVENTORY PRESENTATION (GRID VIEW OR TABLE VIEW) */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
          <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-800 text-sm">
            {inventory.length === 0 ? "No inventory items cataloged yet" : "No matching supplies found"}
          </p>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">
            {inventory.length === 0
              ? "Click 'Restock / Add Supply' to register food grains, medicines, or clothing into the system."
              : "Try clearing your search query or choosing another category."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ================== GRID VIEW ================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const isLow = item.current_stock <= item.reorder_threshold;
            const bufferTarget = item.reorder_threshold * 2;
            const stockPercent = Math.min(100, Math.round((item.current_stock / bufferTarget) * 100));
            const stockRatio =
              item.reorder_threshold > 0
                ? Math.round((item.current_stock / item.reorder_threshold) * 100)
                : 100;

            const statusBadge = isLow ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                Critical Deficit
              </span>
            ) : stockRatio < 150 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Moderate Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Sufficient
              </span>
            );

            const progressBarColor = isLow
              ? "bg-rose-500"
              : stockRatio < 150
              ? "bg-amber-500"
              : "bg-emerald-500";

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between gap-3"
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200/60">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                          {item.item_name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[170px]">
                            {getInstitutionName(item.institution_id)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">{statusBadge}</div>
                  </div>
                </div>

                {/* Stock Level Display */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                      Available Stock:
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">
                        {item.current_stock}
                      </span>{" "}
                      <span className="text-xs font-bold text-slate-500">{item.unit}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${progressBarColor} h-full rounded-full transition-all duration-300`}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Threshold: {item.reorder_threshold} {item.unit}</span>
                    <span className={isLow ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}>
                      {isLow ? "Needs Immediate Restock" : "Safe Operational Buffer"}
                    </span>
                  </div>
                </div>

                {/* Quick Actions & Restock Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.last_restocked_at
                      ? `Updated: ${formatDate(item.last_restocked_at)}`
                      : "Recently updated"}
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 mr-0.5">Add:</span>
                    <button
                      onClick={() => handleQuickRestock(item.id, 10)}
                      className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                      title="Add 10 units"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handleQuickRestock(item.id, 50)}
                      className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                      title="Add 50 units"
                    >
                      +50
                    </button>
                    <button
                      onClick={() => handleQuickRestock(item.id, 100)}
                      className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                      title="Add 100 units"
                    >
                      +100
                    </button>
                    <button
                      onClick={() => handleOpenRestockFor(item.id)}
                      className="ml-1 px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold transition-colors cursor-pointer"
                      title="Full Restock Form"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================== ENTERPRISE TABLE VIEW ================== */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Supply Item &amp; SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Care Facility</th>
                  <th className="py-3 px-4">Stock Level vs Threshold</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Quick Replenish</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isLow = item.current_stock <= item.reorder_threshold;
                  const bufferTarget = item.reorder_threshold * 2;
                  const stockPercent = Math.min(100, Math.round((item.current_stock / bufferTarget) * 100));
                  const stockRatio =
                    item.reorder_threshold > 0
                      ? Math.round((item.current_stock / item.reorder_threshold) * 100)
                      : 100;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Name & SKU */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{item.item_name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              SKU-{item.category.toUpperCase()}-{item.id.slice(0, 4)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </td>

                      {/* Facility */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {getInstitutionName(item.institution_id)}
                      </td>

                      {/* Stock Level with mini bar */}
                      <td className="py-3.5 px-4 min-w-[160px]">
                        <div className="flex items-baseline justify-between mb-1 text-[11px]">
                          <span className="font-black text-slate-900">
                            {item.current_stock} {item.unit}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Limit: {item.reorder_threshold} {item.unit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isLow
                                ? "bg-rose-500"
                                : stockRatio < 150
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            Low Stock
                          </span>
                        ) : stockRatio < 150 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Moderate
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Sufficient
                          </span>
                        )}
                      </td>

                      {/* Quick Restock Pills */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleQuickRestock(item.id, 10)}
                            className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="Add 10"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleQuickRestock(item.id, 50)}
                            className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="Add 50"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => handleQuickRestock(item.id, 100)}
                            className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="Add 100"
                          >
                            +100
                          </button>
                        </div>
                      </td>

                      {/* Manage Button */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRestockFor(item.id)}
                          className="h-7 px-2.5 text-[11px] font-bold border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                          Restock
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock Inventory Modal */}
      <RestockInventoryModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        targetItemId={targetItemId}
      />
    </div>
  );
}
