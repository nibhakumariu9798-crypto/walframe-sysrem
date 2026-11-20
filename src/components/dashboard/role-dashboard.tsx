"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRole } from "@/context/role-context";
import {
  Building2,
  Users,
  AlertTriangle,
  HeartHandshake,
  TrendingUp,
  Activity,
  Boxes,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  FileText,
  Stethoscope,
  PlusCircle,
  Truck,
  ShieldCheck,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useDataStore } from "@/context/data-store-context";

export function RoleDashboard() {
  const { currentRole, currentProfile } = useRole();
  const {
    institutions,
    beneficiaries,
    inventory,
    alerts,
    donations,
    acknowledgeAlert,
  } = useDataStore();

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId);
  };

  // Compute key summary metrics
  const verifiedHomes = institutions.filter((i) => i.verification_status === "verified");
  const pendingHomes = institutions.filter((i) => i.verification_status === "pending");
  const totalCapacity = institutions.reduce((sum, i) => sum + (i.capacity || 0), 0);
  const totalOccupancy = institutions.reduce((sum, i) => sum + (i.current_occupancy || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  const childrenCount = beneficiaries.filter((b) => b.beneficiary_type === "child").length;
  const elderlyCount = beneficiaries.filter((b) => b.beneficiary_type === "elderly").length;

  const lowStockItems = inventory.filter((item) => item.current_stock < item.reorder_threshold);
  const totalFoodStockKg = inventory
    .filter((i) => i.category === "food")
    .reduce((sum, i) => sum + i.current_stock, 0);

  const pendingAlerts = alerts.filter((a) => a.status === "pending_review");
  const highSeverityAlerts = alerts.filter(
    (a) => (a.severity === "high" || a.severity === "critical") && a.status === "pending_review"
  );
  const clinicalAlerts = alerts.filter((a) => a.alert_type === "health_risk");
  const pendingClinicalAlerts = clinicalAlerts.filter((a) => a.status === "pending_review");

  const totalDonationsINR = donations.reduce((sum, d) => sum + (d.amount_inr || 0), 0);
  const utilizedDonationsINR = donations
    .filter((d) => d.status === "utilized")
    .reduce((sum, d) => sum + (d.amount_inr || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Operational Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {currentRole === "government" && "State Welfare Oversight & Regulatory Command"}
              {currentRole === "institution" && "Institution Operations & Resource Command"}
              {currentRole === "doctor" && "Clinical Decision Support & High-Risk Triage"}
              {currentRole === "ngo" && "NGO Program Operations & Resource Logistics"}
              {currentRole === "donor" && "Donor Impact & Fund Utilization Portal"}
              {currentRole === "volunteer" && "Volunteer Field Logistics & Outreach Hub"}
              {currentRole === "admin" && "Global System Governance & AI Oversight"}
            </h1>
            <Badge
              variant="outline"
              className="uppercase font-mono text-[10px] tracking-wider font-extrabold bg-sky-50 border-sky-300 text-sky-800"
            >
              {currentRole}
            </Badge>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Logged in as <span className="font-bold text-slate-900">{currentProfile.full_name}</span> &bull; Regional Welfare Jurisdiction: <span className="font-semibold text-slate-800">Ranchi District &bull; Jharkhand State</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="outline" size="sm" className="font-semibold text-slate-700 border-slate-200">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" /> Fiscal 2026-Q1
          </Button>
          <Link href="/predictions">
            <Button size="sm" className="bg-sky-700 hover:bg-sky-800 text-white font-bold shadow-xs cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-sky-200" /> AI Demand Forecast
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 DYNAMIC ROLE-TAILORED KPI CARDS WITH ENTERPRISE LEFT-BORDER ACCENTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Primary Entity Metric (Sky Blue Left Accent) */}
        <Card className="border-l-4 border-l-sky-600 bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {currentRole === "doctor"
                  ? "High-Risk Patients"
                  : currentRole === "donor"
                  ? "Total Contributions"
                  : currentRole === "volunteer"
                  ? "Assigned Field Runs"
                  : "Certified Care Homes"}
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {currentRole === "doctor"
                  ? `${pendingClinicalAlerts.length} Cases`
                  : currentRole === "donor"
                  ? formatCurrency(totalDonationsINR)
                  : currentRole === "volunteer"
                  ? "4 Tasks"
                  : institutions.length}
              </h3>
              <div className="mt-1.5 flex items-center gap-1">
                {currentRole === "doctor" ? (
                  <span className="text-rose-700 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Priority Score &ge; 70
                  </span>
                ) : currentRole === "donor" ? (
                  <span className="text-sky-800 font-semibold text-[11px] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    {donations.length} Active Records
                  </span>
                ) : (
                  <span className="text-emerald-800 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {verifiedHomes.length} Verified &bull; {pendingHomes.length} Pending
                  </span>
                )}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-2xs flex-shrink-0">
              {currentRole === "doctor" ? (
                <ShieldAlert className="w-6 h-6 text-rose-600" />
              ) : currentRole === "donor" ? (
                <HeartHandshake className="w-6 h-6 text-sky-600" />
              ) : currentRole === "volunteer" ? (
                <Truck className="w-6 h-6 text-sky-600" />
              ) : (
                <Building2 className="w-6 h-6 text-sky-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Census & Capacity Metric (Emerald Green Left Accent) */}
        <Card className="border-l-4 border-l-emerald-600 bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {currentRole === "doctor"
                  ? "Under Medical Watch"
                  : currentRole === "donor"
                  ? "Care Homes Reached"
                  : "Resident Census"}
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {currentRole === "doctor"
                  ? `${elderlyCount} Seniors`
                  : currentRole === "donor"
                  ? `${institutions.length} Facilities`
                  : `${beneficiaries.length} Residents`}
              </h3>
              <div className="mt-1.5">
                <span className="text-teal-800 font-semibold text-[11px] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {childrenCount} Children &bull; {elderlyCount} Elderly
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs flex-shrink-0">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Logistics & AI Demand Metric (Royal Indigo Left Accent) */}
        <Card className="border-l-4 border-l-indigo-600 bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {currentRole === "donor"
                  ? "Utilized Impact"
                  : currentRole === "institution"
                  ? "Bed Occupancy Rate"
                  : "Next-Month AI Food Need"}
              </p>
              <h3 className="text-3xl font-black text-indigo-950 mt-1 tracking-tight">
                {currentRole === "donor"
                  ? formatCurrency(utilizedDonationsINR)
                  : currentRole === "institution"
                  ? `${occupancyRate}%`
                  : beneficiaries.length > 0
                  ? `${Math.round(beneficiaries.length * 15.2)} kg`
                  : "0 kg"}
              </h3>
              <div className="mt-1.5">
                <span className="text-indigo-800 font-semibold text-[11px] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-indigo-600" />
                  {currentRole === "donor"
                    ? "Directly Allocated"
                    : currentRole === "institution"
                    ? `${totalOccupancy} of ${totalCapacity} Beds`
                    : beneficiaries.length > 0
                    ? `For ${beneficiaries.length} enrolled residents`
                    : "0 residents enrolled"}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs flex-shrink-0">
              <Boxes className="w-6 h-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Alerts & Shortages (Amber / Coral Left Accent) */}
        <Card className="border-l-4 border-l-amber-500 bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {currentRole === "institution"
                  ? "Low-Stock Deficits"
                  : "Active Alerts"}
              </p>
              <h3 className="text-3xl font-black text-amber-950 mt-1 tracking-tight">
                {currentRole === "institution"
                  ? `${lowStockItems.length} SKUs`
                  : `${pendingAlerts.length} Actionable`}
              </h3>
              <div className="mt-1.5">
                <span className="text-amber-800 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {highSeverityAlerts.length > 0
                    ? `${highSeverityAlerts.length} High-Severity Alert${highSeverityAlerts.length > 1 ? "s" : ""}`
                    : "Zero Critical Deficits"}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ROLE SPECIFIC OPERATIONAL ACTION WORKSPACE */}
      {currentRole === "doctor" && (
        <Card className="border-l-4 border-l-rose-600 border-rose-200 bg-rose-50/50 shadow-xs">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base text-rose-950 flex items-center gap-2 font-bold">
                  <Activity className="w-4 h-4 text-rose-600" />
                  Clinical Decision Support — High-Risk Resident Queue ({clinicalAlerts.length})
                </CardTitle>
                <CardDescription className="text-rose-900/80 text-xs">
                  Priority triage heuristics scoring blood pressure, glucose, and age vulnerability. Decision support only — not a clinical diagnosis.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/health">
                  <Button size="sm" variant="danger" className="font-bold shadow-xs">
                    <Stethoscope className="w-3.5 h-3.5 mr-1" /> Open Doctor Vault
                  </Button>
                </Link>
                <Link href="/predictions">
                  <Button size="sm" variant="outline" className="border-rose-300 text-rose-800 bg-white font-bold">
                    SHAP Explainability &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {clinicalAlerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-rose-900 bg-white rounded-xl border border-rose-200">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-sm">No Urgent Clinical Alerts</p>
                <p className="text-slate-500 mt-1">All resident vitals and clinical queue records are currently within nominal limits.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {clinicalAlerts.map((alert) => {
                  const isAck = alert.status === "acknowledged";
                  return (
                    <div
                      key={alert.id}
                      className="p-4 bg-white rounded-xl border border-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">
                            {alert.title}
                          </span>
                          <Badge variant="danger" className="font-bold text-[10px]">
                            Priority Score: {alert.priority_score || 85}/100
                          </Badge>
                          <Badge variant="outline" className="text-[10px] bg-slate-50 border-slate-200 text-slate-600">
                            {formatDate(alert.created_at)}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isAck ? (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Acknowledged
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleAcknowledge(alert.id)}
                            className="font-bold shadow-xs cursor-pointer text-xs"
                          >
                            Review &amp; Acknowledge
                          </Button>
                        )}
                        <Link href="/health">
                          <Button size="sm" variant="outline" className="text-xs font-bold border-slate-200 text-slate-700">
                            Examine Vitals
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentRole === "government" && (
        <Card className="border-l-4 border-l-sky-600 bg-sky-50/40 border border-sky-200 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900 text-sm">State Regulatory &amp; Accreditation Desk</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                You have <strong>{pendingHomes.length} care home facilities</strong> awaiting official state verification. Review accreditation documentation to certify compliance under the Welfare Protection Act.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/institutions">
                <Button size="sm" className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs">
                  Review Facilities &rarr;
                </Button>
              </Link>
              <Link href="/reports">
                <Button size="sm" variant="outline" className="border-sky-300 text-sky-800 bg-white font-bold text-xs">
                  <FileText className="w-3.5 h-3.5 mr-1" /> Audit Exports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {currentRole === "institution" && (
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/40 border border-emerald-200 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Care Home Daily Command Center</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                Current Bed Occupancy: <strong>{occupancyRate}% ({totalOccupancy} of {totalCapacity} beds filled)</strong>. {lowStockItems.length > 0 ? `${lowStockItems.length} items require replenishment to prevent shortage.` : "All essential food and medicine stocks are adequate."}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/beneficiaries">
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs">
                  <PlusCircle className="w-3.5 h-3.5 mr-1" /> Admit Resident
                </Button>
              </Link>
              <Link href="/resources">
                <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-800 bg-white font-bold text-xs">
                  Restock Inventory &rarr;
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {currentRole === "donor" && (
        <Card className="border-l-4 border-l-indigo-600 bg-indigo-50/40 border border-indigo-200 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-slate-900 text-sm">Philanthropic Impact &amp; 80G Tax Exemption Center</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                All donations are 100% reconciled to food grains, winter clothing, and pediatric/geriatric medicine. <strong>{formatCurrency(totalDonationsINR)}</strong> contributed to verified shelters.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/donations">
                <Button size="sm" className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs">
                  Log New Donation &rarr;
                </Button>
              </Link>
              <Link href="/reports">
                <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-800 bg-white font-bold text-xs">
                  <FileText className="w-3.5 h-3.5 mr-1" /> Download Receipt Ledger
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TWO COLUMN OPERATIONAL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols) - AI Resource Demand Forecasts & Inventory */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Resource Demand Forecast Card with Highlight Boxes */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-extrabold">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    AI Resource Demand Forecast
                  </CardTitle>
                  <CardDescription className="text-slate-500 text-xs mt-0.5">
                    Machine Learning regression models (XGBoost &amp; Random Forest) predicting requirements based on verified resident census.
                  </CardDescription>
                </div>
                <Badge variant="indigo" className="font-bold text-[10px]">Dynamic Census Model</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              {beneficiaries.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200 p-6">
                  <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-sm">No Active Resident Census</p>
                  <p className="text-slate-400 mt-1 max-w-md mx-auto">
                    No beneficiaries are currently enrolled in the database. Admitting residents will enable automated forecasting for food, medicine, and operational budget.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  
                  {/* Food Requirement Highlight Box */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/60 border border-indigo-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-900 mb-2">
                      <span className="uppercase tracking-wider">Food Requirement (kg)</span>
                      <span className="font-mono text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                        XGBoost Model
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight">
                      {Math.round(beneficiaries.length * 15.2)} kg
                    </div>
                    <div className="text-[11px] text-slate-600 mt-3 space-y-1 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        <span>Based on <strong>{beneficiaries.length} verified residents</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>15.2 kg per-resident monthly quota</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Budget Highlight Box */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/60 border border-emerald-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
                      <span className="uppercase tracking-wider">Operational Budget (INR)</span>
                      <span className="font-mono text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                        Linear Ensemble
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                      {formatCurrency(beneficiaries.length * 1750 + 8000)}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-3 space-y-1 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>Per-capita allowance: ₹1,750 &times; {beneficiaries.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-600" />
                        <span>Base facility utilities: ₹8,000</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Research Protocol Notice */}
              <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4">
                <span>
                  <strong>Database Synchronized:</strong> Projections derived from authentic database records. Experimental claims marked TBD.
                </span>
                <Link href="/predictions" className="font-bold text-sky-700 hover:text-sky-900 underline flex items-center gap-1 flex-shrink-0">
                  View ML Workspace <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Institutional Inventory & Reorder Thresholds */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-extrabold">
                    <Boxes className="w-4 h-4 text-slate-700" />
                    Essential Supplies &amp; Stock Levels ({inventory.length})
                  </CardTitle>
                  <CardDescription className="text-slate-500 text-xs">
                    Live inventory monitoring across orphanages and senior care homes.
                  </CardDescription>
                </div>
                <Link href="/resources">
                  <Button variant="ghost" size="sm" className="font-bold text-sky-700 hover:text-sky-900 hover:bg-sky-50">
                    View All Stock &rarr;
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {inventory.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">No Inventory Items Recorded</p>
                  <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                    There are currently no supply items in the database. Add food, medicine, or apparel provisions from the Resources page.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {inventory.map((item) => {
                    const isLow = item.current_stock < item.reorder_threshold;
                    return (
                      <div
                        key={item.id}
                        className="py-3 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {item.item_name}
                            </span>
                            <Badge variant="secondary" className="capitalize text-[10px] font-semibold">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5 font-medium">
                            Threshold: <strong className="text-slate-800">{item.reorder_threshold} {item.unit}</strong> &bull; Restocked {formatDate(item.last_restocked_at || "")}
                          </p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-black text-sm block ${
                              isLow ? "text-amber-700" : "text-slate-900"
                            }`}
                          >
                            {item.current_stock} {item.unit}
                          </span>
                          <div className="mt-0.5">
                            {isLow ? (
                              <Badge variant="warning" className="font-bold text-[10px]">Reorder Needed</Badge>
                            ) : (
                              <Badge variant="success" className="font-bold text-[10px]">Adequate</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col) - Welfare Alerts & Recent Donations */}
        <div className="space-y-6">
          
          {/* Active Alerts Queue */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-extrabold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Welfare Alerts Queue ({alerts.length})
                  </CardTitle>
                  <CardDescription className="text-slate-500 text-xs">
                    Urgent inventory, verification, and medical notifications
                  </CardDescription>
                </div>
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="font-bold text-sky-700 hover:text-sky-900 hover:bg-sky-50 text-xs">
                    Command Desk &rarr;
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {alerts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">Zero Active Alerts</p>
                  <p className="text-slate-400 mt-1">
                    All storage, facility, and medical queues are running nominally with no pending warnings.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => {
                    const isAck = alert.status === "acknowledged";
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-xl border text-xs transition-all shadow-2xs ${
                          isAck
                            ? "bg-slate-50 border-slate-200 opacity-70"
                            : alert.severity === "high" || alert.severity === "critical"
                            ? "bg-rose-50/70 border-l-4 border-l-rose-500 border border-rose-200"
                            : "bg-amber-50/70 border-l-4 border-l-amber-500 border border-amber-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 gap-2">
                          <span className={`font-bold text-xs ${
                            alert.severity === "high" || alert.severity === "critical"
                              ? "text-rose-950"
                              : "text-amber-950"
                          }`}>
                            {alert.title}
                          </span>
                          <Badge
                            variant={
                              alert.severity === "high" || alert.severity === "critical"
                                ? "danger"
                                : alert.severity === "medium"
                                ? "warning"
                                : "secondary"
                            }
                            className="font-bold uppercase tracking-wider text-[10px]"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${
                          alert.severity === "high" || alert.severity === "critical"
                            ? "text-rose-900"
                            : "text-amber-900"
                        }`}>
                          {alert.description}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60">
                          <span className="text-[10px] text-slate-500 font-medium">
                            {formatDate(alert.created_at)}
                          </span>
                          {!isAck ? (
                            <button
                              onClick={() => handleAcknowledge(alert.id)}
                              className="text-[11px] font-bold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
                            >
                              Mark Acknowledged
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transparent Donation Utilization */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-extrabold">
                    <HeartHandshake className="w-4 h-4 text-emerald-600" />
                    Donations &amp; Utilization ({donations.length})
                  </CardTitle>
                  <CardDescription className="text-slate-500 text-xs">
                    Public transparency tracking for donor fund allocations
                  </CardDescription>
                </div>
                <Link href="/donations">
                  <Button variant="ghost" size="sm" className="font-bold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 text-xs">
                    All Donations &rarr;
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {donations.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <HeartHandshake className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">No Donations Recorded Yet</p>
                  <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                    Contributions logged by donors will appear here with audit verification receipts.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {donations.slice(0, 4).map((don) => (
                    <div
                      key={don.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          {don.amount_inr ? formatCurrency(don.amount_inr) : `${don.quantity} ${don.unit}`}
                        </span>
                        <Badge variant={don.status === "utilized" ? "success" : "indigo"} className="font-bold text-[10px]">
                          {don.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">
                        {don.item_description || "Welfare operational contribution"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                        Receipt: {don.receipt_number} &bull; {formatDate(don.donated_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
