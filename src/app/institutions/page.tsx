"use client";

import React, { useState } from "react";
import { Building2, Plus, Search, MapPin, Phone, Mail, Users, CheckCircle, Clock, ShieldCheck, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { useRole } from "@/context/role-context";
import { RegisterInstitutionModal } from "@/components/modals/register-institution-modal";
import { InstitutionType } from "@/types";

export default function InstitutionsPage() {
  const { institutions, updateInstitutionStatus } = useDataStore();
  const { currentRole } = useRole();

  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const filtered = institutions.filter((inst) => {
    const matchesType = filterType === "all" || inst.institution_type === filterType;
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.registration_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Welfare Institutions Directory ({institutions.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered orphanages, senior living facilities, and integrated social welfare homes.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsRegisterOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Register Institution
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, reg #, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          {(["all", "orphanage", "old_age_home", "mixed"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                filterType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {type === "all" ? "All" : type.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
              {institutions.length === 0 ? "No certified welfare institutions recorded yet" : "No matching institutions found"}
            </p>
            <p className="text-slate-400 mt-1 max-w-sm mx-auto">
              {institutions.length === 0
                ? "Click 'Register Institution' above to register a new care home into the system."
                : "Try clearing your search query or type filter."}
            </p>
          </div>
        ) : (
          filtered.map((inst) => (
          <Card key={inst.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                    {inst.name}
                  </CardTitle>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {inst.registration_number}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={
                      inst.verification_status === "verified"
                        ? "success"
                        : inst.verification_status === "pending"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {inst.verification_status === "verified"
                      ? "Verified"
                      : inst.verification_status === "pending"
                      ? "Pending Inspection"
                      : "Rejected"}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {inst.institution_type.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{inst.address}, {inst.city}, {inst.state} - {inst.pincode}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="text-slate-400">Capacity:</span>{" "}
                  <strong className="text-slate-700 dark:text-slate-200">{inst.capacity} beds</strong>
                </div>
                <div>
                  <span className="text-slate-400">Current Occupancy:</span>{" "}
                  <strong className="text-slate-700 dark:text-slate-200">{inst.current_occupancy} residents</strong>
                </div>
                <div className="col-span-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (inst.current_occupancy / inst.capacity) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {inst.contact_phone}
                </span>

                {/* Government Auditor Approval Controls */}
                {currentRole === "government" && inst.verification_status === "pending" ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateInstitutionStatus(inst.id, "verified")}
                      className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3 h-3" /> Approve State Verification
                    </button>
                    <button
                      onClick={() => updateInstitutionStatus(inst.id, "rejected")}
                      className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-semibold hover:bg-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                  </div>
                ) : (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {inst.contact_email}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
      </div>

      <RegisterInstitutionModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
