"use client";

import React, { useState } from "react";
import { Users, Plus, Search, ShieldCheck, Heart, UserPlus, FileSpreadsheet, ArrowRightLeft, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { AdmitBeneficiaryModal } from "@/components/modals/admit-beneficiary-modal";
import { formatDate } from "@/lib/utils";

export default function BeneficiariesPage() {
  const { beneficiaries, institutions, updateBeneficiaryStatus } = useDataStore();

  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmitOpen, setIsAdmitOpen] = useState(false);

  const filtered = beneficiaries.filter((ben) => {
    const matchesType = filterType === "all" || ben.beneficiary_type === filterType;
    const matchesSearch =
      ben.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ben.identifier_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getInstitutionName = (id: string) => {
    const found = institutions.find((i) => i.id === id);
    return found ? found.name : id;
  };

  const exportSafeRoster = () => {
    const headers = ["Identifier Code", "Resident Name", "Category", "Age", "Gender", "Institution", "Admission Date", "Status"];
    const rows = filtered.map((b) => [
      b.identifier_code,
      b.first_name,
      b.beneficiary_type,
      b.age,
      b.gender,
      getInstitutionName(b.institution_id),
      b.admission_date,
      b.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `safe_beneficiary_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Beneficiary Resident Registry ({beneficiaries.length} Enrolled)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Privacy-preserving registry of children and senior residents across certified welfare institutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportSafeRoster}>
            <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Export Safe Roster
          </Button>
          <Button size="sm" onClick={() => setIsAdmitOpen(true)}>
            <UserPlus className="w-4 h-4 mr-1.5" /> Admit Resident
          </Button>
        </div>
      </div>

      {/* Medical Isolation Disclaimer */}
      <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          <strong>Strict Confidentiality Boundary:</strong> Detailed medical vitals (blood pressure, glucose, medication regimens) are isolated in doctor-only vaults protected by PostgreSQL RLS. General users see non-clinical administrative profiles.
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID code or resident name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Category:</span>
          {(["all", "child", "elderly"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer capitalize ${
                filterType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {type === "all" ? "All Residents" : type === "child" ? "Children" : "Elderly"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Identifier Code</th>
                <th className="px-5 py-3 font-semibold">Resident Name</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Age / Gender</th>
                <th className="px-5 py-3 font-semibold">Institution Home</th>
                <th className="px-5 py-3 font-semibold">Admission Date</th>
                <th className="px-5 py-3 font-semibold">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      {beneficiaries.length === 0 ? "No beneficiaries registered in database yet" : "No matching beneficiaries found"}
                    </p>
                    <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                      {beneficiaries.length === 0
                        ? "Click 'Admit Resident' above to record a new child or senior citizen into the registry."
                        : "Try clearing your search query or category filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((ben) => (
                <tr key={ben.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    {ben.identifier_code}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    {ben.first_name}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={ben.beneficiary_type === "child" ? "indigo" : "secondary"}>
                      {ben.beneficiary_type === "child" ? "Child" : "Elderly"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300 capitalize">
                    {ben.age} yrs &bull; {ben.gender}
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                    {getInstitutionName(ben.institution_id)}
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {formatDate(ben.admission_date)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          ben.status === "active"
                            ? "success"
                            : ben.status === "transferred"
                            ? "warning"
                            : "outline"
                        }
                      >
                        {ben.status}
                      </Badge>
                      <select
                        value={ben.status}
                        onChange={(e) => updateBeneficiaryStatus(ben.id, e.target.value as "active" | "transferred" | "discharged")}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5"
                      >
                        <option value="active">Active</option>
                        <option value="transferred">Transferred</option>
                        <option value="discharged">Discharged</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
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
