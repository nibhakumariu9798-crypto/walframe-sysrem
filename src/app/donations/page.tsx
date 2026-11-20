"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  Plus,
  Search,
  FileText,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Building2,
  Receipt,
  IndianRupee,
  Layers,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { RecordDonationModal } from "@/components/modals/record-donation-modal";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DonationsPage() {
  const { donations, institutions, updateDonationStatus } = useDataStore();
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getInstitutionName = (id: string) => {
    const found = institutions.find((i) => i.id === id);
    return found ? found.name : "Welfare Care Home";
  };

  const getNextStatus = (current: string): "received" | "allocated" | "utilized" | null => {
    if (current === "pledged") return "received";
    if (current === "received") return "allocated";
    if (current === "allocated") return "utilized";
    return null;
  };

  // Live aggregates
  const totalDonations = donations.length;
  const totalMonetary = donations
    .filter((d) => d.donation_type === "monetary" && d.amount_inr)
    .reduce((sum, d) => sum + (d.amount_inr || 0), 0);
  const totalInKind = donations.filter((d) => d.donation_type === "in_kind").length;
  const utilizedCount = donations.filter((d) => d.status === "utilized").length;
  const utilizationRate =
    totalDonations > 0 ? Math.round((utilizedCount / totalDonations) * 100) : 0;

  const filtered = donations.filter((don) => {
    const matchesType = filterType === "all" || don.donation_type === filterType;
    const matchesStatus = filterStatus === "all" || don.status === filterStatus;
    const matchesSearch =
      don.receipt_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (don.allocated_purpose &&
        don.allocated_purpose.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <HeartHandshake className="w-4 h-4 text-emerald-100" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Donation Management &amp; Public Transparency
            </h1>
            <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700 border-slate-300">
              {totalDonations} Audited Contributions
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auditable tracking of monetary contributions and in-kind provisions allocated across care homes.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsRecordOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Record Contribution
        </Button>
      </div>

      {/* 4 Top KPI Cards with Colored Top Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Contributions */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#10b981] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Contributions
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalDonations} Grants</div>
          <div className="text-[11px] font-medium text-emerald-700 mt-1">
            Verified Receipts Issued
          </div>
        </div>

        {/* KPI 2: Total Funds Mobilized */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#0284c7] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Monetary Funds
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {formatCurrency(totalMonetary)}
          </div>
          <div className="text-[11px] font-medium text-sky-700 mt-1">
            Zero-Leakage Tracking Active
          </div>
        </div>

        {/* KPI 3: In-Kind Provisions */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#4f46e5] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              In-Kind Provisions
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-950 mt-2">{totalInKind} Shipments</div>
          <div className="text-[11px] font-medium text-indigo-700 mt-1">
            Food Grains, Blankets &amp; Medicine Kits
          </div>
        </div>

        {/* KPI 4: Active Fund Utilization Rate */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#f59e0b] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Disbursed &amp; Utilized
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{utilizationRate}%</div>
          <div className="text-[11px] font-medium text-amber-700 mt-1">
            {utilizedCount} of {totalDonations} Fully Utilized
          </div>
        </div>
      </div>

      {/* Transparency Guarantee Banner */}
      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
        <span className="leading-relaxed">
          <strong className="font-bold text-emerald-950">Open Social Welfare Transparency:</strong> Donors receive verified audit receipts and can track whether funds are pledged, received, allocated to specific supplies, or actively utilized on the ground.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by receipt # or allocated purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {(["all", "monetary", "in_kind"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer capitalize ${
                filterType === type
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {type === "all" ? "All Contributions" : type === "monetary" ? "Monetary Grants" : "In-Kind Goods"}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Receipt Number
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Benefiting Care Home
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Contribution Value
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Category
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Allocated Purpose
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Lifecycle Status &amp; Action
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-xs text-slate-500">
                    <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                    <p className="font-bold text-slate-800 text-sm">
                      No contributions recorded matching your filters
                    </p>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                      Click &quot;Record Contribution&quot; above to log an initial donation or in-kind support.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((don) => {
                  const next = getNextStatus(don.status);
                  return (
                    <tr key={don.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Receipt */}
                      <td className="px-5 py-3.5 font-mono font-bold text-emerald-800">
                        <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {don.receipt_number}
                        </span>
                        {don.is_anonymous && (
                          <span className="block text-[10px] text-slate-400 font-sans font-medium mt-0.5">
                            Anonymous Citizen Philanthropist
                          </span>
                        )}
                      </td>

                      {/* Benefiting Care Home */}
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{getInstitutionName(don.institution_id)}</span>
                        </div>
                      </td>

                      {/* Contribution */}
                      <td className="px-5 py-3.5 font-extrabold text-slate-900 text-sm">
                        {don.amount_inr
                          ? formatCurrency(don.amount_inr)
                          : `${don.quantity} ${don.unit}`}
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <Badge variant="secondary" className="capitalize text-[10px] font-semibold">
                          {don.category}
                        </Badge>
                      </td>

                      {/* Allocated Purpose */}
                      <td className="px-5 py-3.5 text-slate-700 font-medium">
                        {don.allocated_purpose || "General Welfare Fund"}
                      </td>

                      {/* Lifecycle Status & Transition Action */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              don.status === "utilized"
                                ? "success"
                                : don.status === "allocated"
                                ? "indigo"
                                : don.status === "received"
                                ? "info"
                                : "warning"
                            }
                            className="text-[10px] capitalize font-semibold"
                          >
                            {don.status}
                          </Badge>

                          {next && (
                            <button
                              onClick={() => updateDonationStatus(don.id, next)}
                              className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-300 rounded text-[10px] font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                              title={`Advance status to ${next}`}
                            >
                              <span>Advance &rarr; {next}</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-slate-500 font-medium">
                        {formatDate(don.donated_at || don.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <RecordDonationModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
      />
    </div>
  );
}
