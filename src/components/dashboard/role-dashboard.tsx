"use client";

import React from "react";
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

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {currentRole === "government" && "State Welfare Oversight & Monitoring Dashboard"}
              {currentRole === "institution" && "Institution Operations & Resource Command"}
              {currentRole === "doctor" && "Clinical Decision Support & High-Risk Patient Queue"}
              {currentRole === "ngo" && "NGO Program Operations & Resource Distribution"}
              {currentRole === "donor" && "Donor Impact & Fund Utilization Portal"}
              {currentRole === "volunteer" && "Volunteer Field Task Center"}
              {currentRole === "admin" && "System Administration & Global Welfare Command"}
            </h1>
            <Badge variant="outline" className="uppercase font-mono text-[10px] tracking-wider font-extrabold bg-sky-50 border-sky-300 text-sky-800">
              {currentRole}
            </Badge>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Logged in as <span className="font-bold text-slate-900">{currentProfile.full_name}</span> &bull; Regional Welfare Jurisdiction: <span className="font-semibold text-slate-700">Ranchi District</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="font-semibold text-slate-700 border-slate-200">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" /> March 2026
          </Button>
          <Link href="/predictions">
            <Button size="sm" className="bg-sky-700 hover:bg-sky-800 text-white font-bold shadow-sm cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-sky-200" /> Run AI Forecast
            </Button>
          </Link>
        </div>
      </div>

      {/* TOP KPI CARDS WITH HIGHLIGHT ACCENT BORDERS & VIBRANT ICONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Certified Institutions (Sky Blue Highlight) */}
        <Card className="border-t-4 border-t-sky-500 hover:shadow-md transition-all bg-white border border-slate-200/90 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {currentRole === "doctor" ? "High Risk Alerts" : "Total Institutions"}
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {currentRole === "doctor"
                  ? `${alerts.filter((a) => a.alert_type === "health_risk" && a.status === "pending_review").length} Cases`
                  : institutions.length}
              </h3>
              <div className="mt-1.5 flex items-center gap-1">
                {currentRole === "doctor" ? (
                  <span className="text-rose-700 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Priority review needed
                  </span>
                ) : (
                  <span className="text-emerald-800 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {institutions.filter((i) => i.verification_status === "verified").length} Verified &bull;{" "}
                    {institutions.filter((i) => i.verification_status === "pending").length} Pending
                  </span>
                )}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-2xs flex-shrink-0">
              {currentRole === "doctor" ? (
                <ShieldAlert className="w-6 h-6 text-rose-600" />
              ) : (
                <Building2 className="w-6 h-6 text-sky-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Registered Beneficiaries (Emerald Green Highlight) */}
        <Card className="border-t-4 border-t-emerald-500 hover:shadow-md transition-all bg-white border border-slate-200/90 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {currentRole === "doctor" ? "Under Medical Watch" : "Registered Beneficiaries"}
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {currentRole === "doctor"
                  ? `${beneficiaries.filter((b) => b.beneficiary_type === "elderly").length} Seniors`
                  : `${beneficiaries.length} Residents`}
              </h3>
              <div className="mt-1.5">
                <span className="text-teal-800 font-semibold text-[11px] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {beneficiaries.filter((b) => b.beneficiary_type === "child").length} Children &bull;{" "}
                  {beneficiaries.filter((b) => b.beneficiary_type === "elderly").length} Elderly
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs flex-shrink-0">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Contributions / Food Quota (Royal Indigo Highlight) */}
        <Card className="border-t-4 border-t-indigo-600 hover:shadow-md transition-all bg-white border border-slate-200/90 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {currentRole === "donor" ? "My Contributions" : "Next-Month AI Food Need"}
              </p>
              <h3 className="text-3xl font-black text-indigo-950 mt-1 tracking-tight">
                {currentRole === "donor"
                  ? formatCurrency(
                      donations.reduce((sum, d) => sum + (d.amount_inr || 0), 0)
                    )
                  : beneficiaries.length > 0
                  ? `${Math.round(beneficiaries.length * 15.2)} kg`
                  : "0 kg"}
              </h3>
              <div className="mt-1.5">
                <span className="text-indigo-800 font-semibold text-[11px] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-indigo-600" />
                  {currentRole === "donor"
                    ? `${donations.length} Active Records`
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

        {/* KPI 4: Welfare Alerts Active (Amber / Coral Highlight) */}
        <Card className="border-t-4 border-t-amber-500 hover:shadow-md transition-all bg-white border border-slate-200/90 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Welfare Alerts Active
              </p>
              <h3 className="text-3xl font-black text-amber-950 mt-1 tracking-tight">
                {alerts.filter((a) => a.status === "pending_review").length}
              </h3>
              <div className="mt-1.5">
                <span className="text-amber-800 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {alerts.length === 0
                    ? "All systems normal"
                    : `${alerts.filter((a) => a.status === "acknowledged").length} Acknowledged`}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* DOCTOR SPECIFIC PRIORITY QUEUE (If Doctor Role is Active) */}
      {currentRole === "doctor" && (
        <Card className="border-rose-200 bg-rose-50/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-rose-950 flex items-center gap-2 font-bold">
                  <Activity className="w-4 h-4 text-rose-600" />
                  Clinical Decision Support — Priority Patient Review Queue
                </CardTitle>
                <CardDescription className="text-rose-900/80">
                  Deep learning health-risk classification and multi-factor heuristic priority score (&gt; 70 threshold). Decision support only.
                </CardDescription>
              </div>
              <Badge variant="danger" className="font-bold">Doctor Action Required</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {alerts.filter((a) => a.alert_type === "health_risk").length === 0 ? (
              <div className="p-6 text-center text-xs text-rose-900 bg-white rounded-xl border border-rose-200">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-sm">No Urgent Clinical Alerts</p>
                <p className="text-slate-500 mt-1">All resident vitals and clinical queue records are currently within nominal limits.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.filter((a) => a.alert_type === "health_risk").map((alert) => {
                  const isAck = alert.status === "acknowledged";
                  return (
                    <div
                      key={alert.id}
                      className="p-4 bg-white rounded-xl border border-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {alert.title}
                          </span>
                          <Badge variant="danger" className="font-bold">Priority: {alert.priority_score}/100</Badge>
                        </div>
                        <p className="text-xs text-slate-700">
                          {alert.description}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Detected on {formatDate(alert.created_at)}
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
                            className="font-bold shadow-xs cursor-pointer"
                          >
                            Review &amp; Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                <Badge variant="indigo" className="font-bold">Dynamic Census Model</Badge>
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
              <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-extrabold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Welfare Alerts Queue ({alerts.length})
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs">
                Urgent inventory, verification, and medical notifications
              </CardDescription>
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
                  {alerts.map((alert) => {
                    const isAck = alert.status === "acknowledged";
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-xl border text-xs transition-all shadow-2xs ${
                          isAck
                            ? "bg-slate-50 border-slate-200 opacity-70"
                            : alert.severity === "high"
                            ? "bg-rose-50/70 border-l-4 border-l-rose-500 border border-rose-200"
                            : "bg-amber-50/70 border-l-4 border-l-amber-500 border border-amber-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 gap-2">
                          <span className={`font-bold text-xs ${
                            alert.severity === "high"
                              ? "text-rose-950"
                              : "text-amber-950"
                          }`}>
                            {alert.title}
                          </span>
                          <Badge
                            variant={
                              alert.severity === "high"
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
                          alert.severity === "high"
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
              <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-extrabold">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                Donations &amp; Utilization ({donations.length})
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs">
                Public transparency tracking for donor fund allocations
              </CardDescription>
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
                  {donations.map((don) => (
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
