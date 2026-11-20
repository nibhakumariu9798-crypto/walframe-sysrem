"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  ShieldCheck,
  Heart,
  UserPlus,
  FileSpreadsheet,
  ArrowRightLeft,
  UserCheck,
  Building2,
  Calendar,
  Baby,
  Smile,
  SlidersHorizontal,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { AdmitBeneficiaryModal } from "@/components/modals/admit-beneficiary-modal";
import { formatDate } from "@/lib/utils";

export default function BeneficiariesPage() {
  const { beneficiaries, institutions, updateBeneficiaryStatus } = useDataStore();

  const [filterType, setFilterType] = useState<string>("all");
  const [filterInstitution, setFilterInstitution] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmitOpen, setIsAdmitOpen] = useState(false);

  // Live aggregates
  const totalBeneficiaries = beneficiaries.length;
  const childrenCount = beneficiaries.filter((b) => b.beneficiary_type === "child").length;
  const elderlyCount = beneficiaries.filter((b) => b.beneficiary_type === "elderly").length;
  const activeCount = beneficiaries.filter((b) => b.status === "active").length;
  const activeRate = totalBeneficiaries > 0 ? Math.round((activeCount / totalBeneficiaries) * 100) : 100;

  const filtered = beneficiaries.filter((ben) => {
    const matchesType = filterType === "all" || ben.beneficiary_type === filterType;
    const matchesInstitution = filterInstitution === "all" || ben.institution_id === filterInstitution;
    const matchesStatus = filterStatus === "all" || ben.status === filterStatus;
    const matchesSearch =
      ben.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ben.identifier_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesInstitution && matchesStatus && matchesSearch;
  });

  const getInstitutionName = (id: string) => {
    const found = institutions.find((i) => i.id === id);
    return found ? found.name : "Welfare Care Home";
  };

  const exportSafeRoster = () => {
    const headers = [
      "Identifier Code",
      "Resident Name",
      "Category",
      "Age",
      "Gender",
      "Institution Home",
      "Admission Date",
      "Status",
      "Special Notes",
    ];
    const rows = filtered.map((b) => [
      b.identifier_code,
      b.first_name,
      b.beneficiary_type === "child" ? "Child Resident" : "Senior Citizen",
      b.age,
      b.gender,
      getInstitutionName(b.institution_id),
      b.admission_date,
      b.status,
      b.special_needs || "None",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `safe_beneficiary_roster_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-700 flex items-center justify-center text-white shadow-xs">
              <Users className="w-4 h-4 text-indigo-100" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Beneficiary Resident Registry
            </h1>
            <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700 border-slate-300">
              {totalBeneficiaries} Enrolled Residents
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Privacy-preserving state registry of children and senior residents across certified welfare institutions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={exportSafeRoster}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Export Safe Roster (CSV)
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAdmitOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
          >
            <UserPlus className="w-4 h-4 mr-1.5" /> Admit Resident
          </Button>
        </div>
      </div>

      {/* Medical Isolation Disclaimer Banner */}
      <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 flex items-start sm:items-center gap-2.5 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5 sm:mt-0" />
        <span className="leading-relaxed">
          <strong className="font-bold text-sky-950">Strict Medical Confidentiality Boundary:</strong>{" "}
          Personal medical vitals (blood pressure, fasting glucose, medications) are strictly locked in doctor-only vaults protected by PostgreSQL Row Level Security (RLS). General staff and administrative users view privacy-safe administrative profiles only.
        </span>
      </div>

      {/* 4 Top KPI Cards with Colored Top Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Enrolled */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#0284c7] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Enrolled
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalBeneficiaries} Residents</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>{activeCount} Active in Care Homes</span>
          </div>
        </div>

        {/* KPI 2: Children in Care */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#4f46e5] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Children Residents
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Baby className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-950 mt-2">{childrenCount} Children</div>
          <div className="text-[11px] font-medium text-indigo-700 mt-1">
            Enrolled in Certified Orphanages
          </div>
        </div>

        {/* KPI 3: Elderly Residents */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#10b981] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Senior Citizens
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Heart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">{elderlyCount} Elderly</div>
          <div className="text-[11px] font-medium text-emerald-700 mt-1">
            Senior Living &amp; Geriatric Care
          </div>
        </div>

        {/* KPI 4: Active Care Rate */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#f59e0b] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Care Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeRate}%</div>
          <div className="text-[11px] font-medium text-amber-700 mt-1">
            {totalBeneficiaries - activeCount} Transferred / Discharged
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID code or resident name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            {(["all", "child", "elderly"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                  filterType === type
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {type === "all" ? "All Residents" : type === "child" ? "Children" : "Senior Citizens"}
              </button>
            ))}
          </div>

          {/* Institution Filter Dropdown */}
          <select
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
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

      {/* Resident Registry Table */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Identifier Code
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Resident Name
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Category
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Age &amp; Gender
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Host Care Home
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Admission Date
                </th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                  Status &amp; Management
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-xs text-slate-500">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                    <p className="font-bold text-slate-800 text-sm">
                      {beneficiaries.length === 0
                        ? "No residents registered in database yet"
                        : "No matching residents found"}
                    </p>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                      {beneficiaries.length === 0
                        ? "Click 'Admit Resident' above to record a new child or senior citizen into the registry."
                        : "Try clearing your search query or filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((ben) => {
                  const isChild = ben.beneficiary_type === "child";
                  return (
                    <tr key={ben.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Code */}
                      <td className="px-5 py-3.5 font-mono font-bold text-indigo-700">
                        <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {ben.identifier_code}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {ben.first_name}
                      </td>

                      {/* Category Badge */}
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={isChild ? "indigo" : "secondary"}
                          className="text-[10px] font-semibold"
                        >
                          {isChild ? "Child Resident" : "Senior Citizen"}
                        </Badge>
                      </td>

                      {/* Age & Gender */}
                      <td className="px-5 py-3.5 text-slate-700 capitalize font-medium">
                        {ben.age} yrs &bull; {ben.gender}
                      </td>

                      {/* Institution */}
                      <td className="px-5 py-3.5 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{getInstitutionName(ben.institution_id)}</span>
                        </div>
                      </td>

                      {/* Admission Date */}
                      <td className="px-5 py-3.5 text-slate-500 font-medium">
                        {formatDate(ben.admission_date)}
                      </td>

                      {/* Status / Quick Action */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              ben.status === "active"
                                ? "success"
                                : ben.status === "transferred"
                                ? "warning"
                                : "outline"
                            }
                            className="text-[10px] capitalize"
                          >
                            {ben.status}
                          </Badge>

                          <select
                            value={ben.status}
                            onChange={(e) =>
                              updateBeneficiaryStatus(
                                ben.id,
                                e.target.value as "active" | "transferred" | "discharged"
                              )
                            }
                            className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded px-2 py-1 text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                          >
                            <option value="active">Active</option>
                            <option value="transferred">Transferred</option>
                            <option value="discharged">Discharged</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <AdmitBeneficiaryModal
        isOpen={isAdmitOpen}
        onClose={() => setIsAdmitOpen(false)}
      />
    </div>
  );
}
