"use client";

import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  XCircle,
  Bed,
  Check,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Compute live aggregates
  const totalInstitutions = institutions.length;
  const totalCapacity = institutions.reduce((sum, i) => sum + (Number(i.capacity) || 0), 0);
  const totalOccupancy = institutions.reduce((sum, i) => sum + (Number(i.current_occupancy) || 0), 0);
  const overallOccupancyRate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
  const pendingCount = institutions.filter((i) => i.verification_status === "pending").length;

  const filtered = institutions.filter((inst) => {
    const matchesType = filterType === "all" || inst.institution_type === filterType;
    const matchesStatus = filterStatus === "all" || inst.verification_status === filterStatus;
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.registration_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-4 h-4 text-sky-100" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Welfare Institutions Directory
            </h1>
            <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700 border-slate-300">
              {totalInstitutions} Certified Facilities
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official public registry of certified orphanages, senior living facilities, and integrated social welfare homes.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsRegisterOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Register Institution
        </Button>
      </div>

      {/* 4 Top KPI Cards with Colored Top Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Facilities */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#0284c7] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Facilities
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalInstitutions}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>{totalInstitutions - pendingCount} Verified Active</span>
          </div>
        </div>

        {/* KPI 2: Total Bed Capacity */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#10b981] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Approved Bed Capacity
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Bed className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalCapacity} Beds</div>
          <div className="text-[11px] font-medium text-emerald-700 mt-1">
            Across Jharkhand State Registry
          </div>
        </div>

        {/* KPI 3: Occupancy & Rate */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#4f46e5] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Occupancy
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalOccupancy}{" "}
            <span className="text-xs font-semibold text-slate-400">/ {totalCapacity}</span>
          </div>
          <div className="text-[11px] font-medium text-indigo-700 mt-1">
            {overallOccupancyRate}% Total Capacity Utilization
          </div>
        </div>

        {/* KPI 4: Pending Verification */}
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#f59e0b] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              State Inspections
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {pendingCount}{" "}
            <span className="text-xs font-medium text-slate-500">Facility</span>
          </div>
          <div className="text-[11px] font-medium text-amber-700 mt-1">
            {pendingCount > 0 ? "Awaiting State Auditor Review" : "All Facilities Certified"}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search care home name, reg #, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-semibold mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-slate-400" /> Category:
          </span>
          {(["all", "orphanage", "old_age_home", "mixed"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                filterType === type
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {type === "all"
                ? "All Categories"
                : type === "orphanage"
                ? "Orphanages"
                : type === "old_age_home"
                ? "Old Age Homes"
                : "Integrated"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-800 text-sm">
              {institutions.length === 0
                ? "No certified welfare institutions recorded yet"
                : "No matching institutions found"}
            </p>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">
              {institutions.length === 0
                ? "Click 'Register Institution' above to enroll a new welfare care home into the database."
                : "Try clearing your search query or category filter."}
            </p>
          </div>
        ) : (
          filtered.map((inst) => {
            const occRate =
              inst.capacity > 0 ? Math.round((inst.current_occupancy / inst.capacity) * 100) : 0;
            const isVerified = inst.verification_status === "verified";
            const isPending = inst.verification_status === "pending";

            // Top accent border color based on verification
            const topBorderClass = isVerified
              ? "border-t-4 border-t-emerald-500"
              : isPending
              ? "border-t-4 border-t-amber-500"
              : "border-t-4 border-t-rose-500";

            // Capacity bar color
            const barColor =
              occRate >= 90 ? "bg-rose-500" : occRate >= 75 ? "bg-amber-500" : "bg-emerald-500";

            return (
              <Card
                key={inst.id}
                className={`bg-white border-slate-200 shadow-xs hover:shadow-md transition-shadow ${topBorderClass}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base text-slate-900 font-bold">
                        {inst.name}
                      </CardTitle>
                      <p className="text-[11px] font-mono font-semibold text-slate-500 mt-0.5">
                        {inst.registration_number}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge
                        variant={
                          isVerified ? "success" : isPending ? "warning" : "danger"
                        }
                        className="text-[10px]"
                      >
                        {isVerified
                          ? "State Verified"
                          : isPending
                          ? "Pending Inspection"
                          : "Rejected"}
                      </Badge>
                      <Badge variant="secondary" className="capitalize text-[10px]">
                        {inst.institution_type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3.5 text-xs">
                  {/* Address */}
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      {inst.address}, {inst.city}, {inst.state} - {inst.pincode}
                    </span>
                  </div>

                  {/* Bed Capacity Progress Box */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-semibold text-slate-600 flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" /> Bed Capacity &amp; Occupancy
                      </span>
                      <span className="font-bold text-slate-900">
                        {inst.current_occupancy} / {inst.capacity} beds ({occRate}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${barColor} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(100, occRate)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>{inst.capacity - inst.current_occupancy} beds available</span>
                      <span className={occRate >= 90 ? "text-rose-600 font-bold" : "text-emerald-700 font-semibold"}>
                        {occRate >= 90 ? "High Occupancy Warning" : "Accepting Admissions"}
                      </span>
                    </div>
                  </div>

                  {/* Contact & Government Approval Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {inst.contact_phone}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {inst.contact_email}
                      </span>
                    </div>

                    {/* Government Auditor Approval Controls */}
                    {currentRole === "government" && isPending ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateInstitutionStatus(inst.id, "verified")}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Approve State License
                        </button>
                        <button
                          onClick={() => updateInstitutionStatus(inst.id, "rejected")}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Government License Audited</span>
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <RegisterInstitutionModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
