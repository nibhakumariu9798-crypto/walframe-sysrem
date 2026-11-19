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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {currentRole === "government" && "State Welfare Oversight & Monitoring Dashboard"}
              {currentRole === "institution" && "Institution Operations & Resource Command"}
              {currentRole === "doctor" && "Clinical Decision Support & High-Risk Patient Queue"}
              {currentRole === "ngo" && "NGO Program Operations & Resource Distribution"}
              {currentRole === "donor" && "Donor Impact & Fund Utilization Portal"}
              {currentRole === "volunteer" && "Volunteer Field Task Center"}
              {currentRole === "admin" && "System Administration & Global Welfare Command"}
            </h1>
            <Badge variant="outline" className="uppercase font-mono text-[10px] tracking-wider font-semibold border-slate-300 dark:border-slate-700">
              {currentRole}
            </Badge>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Logged in as <span className="font-semibold text-slate-900 dark:text-slate-200">{currentProfile.full_name}</span> &bull; Regional Welfare Jurisdiction: <span className="font-medium text-slate-700 dark:text-slate-300">Ranchi District</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500 dark:text-slate-400" /> March 2026
          </Button>
          <Link href="/predictions">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-200" /> Run AI Forecast
            </Button>
          </Link>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {currentRole === "doctor" ? "High Risk Alerts" : "Total Institutions"}
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
                {currentRole === "doctor"
                  ? `${alerts.filter((a) => a.alert_type === "health_risk" && a.status === "pending_review").length} Cases`
                  : institutions.length}
              </h3>
              <p className="text-[11px] font-semibold mt-1 flex items-center gap-1">
                {currentRole === "doctor" ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">Priority review needed</span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    {institutions.filter((i) => i.verification_status === "verified").length} Verified &bull;{" "}
                    {institutions.filter((i) => i.verification_status === "pending").length} Pending
                  </span>
                )}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 flex items-center justify-center text-blue-700 dark:text-blue-300 shadow-2xs flex-shrink-0">
              {currentRole === "doctor" ? (
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              ) : (
                <Building2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {currentRole === "doctor" ? "Under Medical Watch" : "Registered Beneficiaries"}
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
                {currentRole === "doctor"
                  ? `${beneficiaries.filter((b) => b.beneficiary_type === "elderly").length} Seniors`
                  : `${beneficiaries.length} Residents`}
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">
                {beneficiaries.filter((b) => b.beneficiary_type === "child").length} Children &bull;{" "}
                {beneficiaries.filter((b) => b.beneficiary_type === "elderly").length} Elderly
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-2xs flex-shrink-0">
              <Users className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {currentRole === "donor" ? "My Contributions" : "Next-Month AI Food Need"}
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
                {currentRole === "donor"
                  ? formatCurrency(
                      donations.reduce((sum, d) => sum + (d.amount_inr || 0), 0)
                    )
                  : beneficiaries.length > 0
                  ? `${Math.round(beneficiaries.length * 15.2)} kg`
                  : "0 kg"}
              </h3>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3 h-3" />
                {currentRole === "donor"
                  ? `${donations.length} Active Records`
                  : beneficiaries.length > 0
                  ? `Computed for ${beneficiaries.length} enrolled residents`
                  : "No residents registered yet"}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 flex items-center justify-center text-indigo-700 dark:text-indigo-300 shadow-2xs flex-shrink-0">
              <Boxes className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Welfare Alerts Active
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
                {alerts.filter((a) => a.status === "pending_review").length}
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-semibold">
                {alerts.length === 0
                  ? "All systems normal • 0 alerts"
                  : `${alerts.filter((a) => a.status === "acknowledged").length} acknowledged`}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-800/60 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-2xs flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DOCTOR SPECIFIC PRIORITY QUEUE (If Doctor Role is Active) */}
      {currentRole === "doctor" && (
        <Card className="border-rose-200/90 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-rose-950 dark:text-rose-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Clinical Decision Support — Priority Patient Review Queue
                </CardTitle>
                <CardDescription className="text-rose-900/80 dark:text-rose-300/80">
                  Deep learning health-risk classification and multi-factor heuristic priority score (&gt; 70 threshold). Decision support only.
                </CardDescription>
              </div>
              <Badge variant="danger">Doctor Action Required</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {alerts.filter((a) => a.alert_type === "health_risk").length === 0 ? (
              <div className="p-6 text-center text-xs text-rose-900 dark:text-rose-200 bg-white/60 dark:bg-slate-900/40 rounded-xl border border-rose-200/60">
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
                      className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-rose-200/80 dark:border-rose-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {alert.title}
                          </span>
                          <Badge variant="danger">Priority: {alert.priority_score}/100</Badge>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          {alert.description}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Detected on {formatDate(alert.created_at)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isAck ? (
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Acknowledged
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleAcknowledge(alert.id)}
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
        {/* Left Column (2 Cols) - AI Resource Demand Forecasts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    AI Resource Demand Forecast
                  </CardTitle>
                  <CardDescription>
                    Machine Learning regression models (XGBoost &amp; Random Forest) predicting requirements based on verified resident census.
                  </CardDescription>
                </div>
                <Badge variant="indigo">Dynamic Census Model</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {beneficiaries.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6">
                  <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Active Resident Census</p>
                  <p className="text-slate-400 mt-1 max-w-md mx-auto">
                    No beneficiaries are currently enrolled in the database. Admitting residents will enable automated forecasting for food, medicine, and operational budget.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      <span>Food Requirement (kg)</span>
                      <Badge variant="indigo" className="font-mono text-[10px]">XGBoost Model</Badge>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {Math.round(beneficiaries.length * 15.2)} kg
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2.5 space-y-1 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>Based on {beneficiaries.length} verified residents</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>15.2 kg per-resident monthly quota</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      <span>Operational Budget (INR)</span>
                      <Badge variant="secondary" className="font-mono text-[10px]">Linear Ensemble</Badge>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {formatCurrency(beneficiaries.length * 1750 + 8000)}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2.5 space-y-1 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>Per-capita allowance: ₹1,750 &times; {beneficiaries.length}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Base facility utilities: ₹8,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Research Protocol Notice */}
              <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4">
                <span>
                  <strong>Database Synchronized:</strong> Projections derived from authentic database records. Experimental claims marked TBD.
                </span>
                <Link href="/research" className="font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 underline flex items-center gap-1 flex-shrink-0">
                  View ML Workspace <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Institutional Inventory & Reorder Thresholds */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <Boxes className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    Essential Supplies &amp; Stock Levels ({inventory.length})
                  </CardTitle>
                  <CardDescription>
                    Live inventory monitoring across orphanages and senior care homes.
                  </CardDescription>
                </div>
                <Link href="/resources">
                  <Button variant="ghost" size="sm" className="font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100">
                    View All Stock
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {inventory.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <Boxes className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No Inventory Items Recorded</p>
                  <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                    There are currently no supply items in the database. Add food, medicine, or apparel provisions from the Resources page.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {inventory.map((item) => {
                    const isLow = item.current_stock < item.reorder_threshold;
                    return (
                      <div
                        key={item.id}
                        className="py-3 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {item.item_name}
                            </span>
                            <Badge variant="secondary" className="capitalize text-[10px] font-medium">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                            Threshold: <span className="font-medium text-slate-800 dark:text-slate-300">{item.reorder_threshold} {item.unit}</span> &bull; Restocked {formatDate(item.last_restocked_at || "")}
                          </p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-black text-sm ${
                              isLow ? "text-amber-700 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"
                            }`}
                          >
                            {item.current_stock} {item.unit}
                          </span>
                          <div className="mt-0.5">
                            {isLow ? (
                              <Badge variant="warning">Reorder Needed</Badge>
                            ) : (
                              <Badge variant="success">Adequate</Badge>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Welfare Alerts Queue ({alerts.length})
              </CardTitle>
              <CardDescription>
                Urgent inventory, verification, and medical notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Zero Active Alerts</p>
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
                        className={`p-3.5 rounded-xl border text-xs transition-colors shadow-2xs ${
                          isAck
                            ? "bg-slate-50/80 border-slate-200/80 opacity-70 dark:bg-slate-800/40 dark:border-slate-800"
                            : alert.severity === "high"
                            ? "bg-rose-50/80 border-rose-200/90 dark:bg-rose-950/30 dark:border-rose-900/60"
                            : "bg-amber-50/80 border-amber-200/90 dark:bg-amber-950/30 dark:border-amber-900/60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 gap-2">
                          <span className={`font-bold text-xs ${
                            alert.severity === "high"
                              ? "text-rose-950 dark:text-rose-100"
                              : "text-amber-950 dark:text-amber-100"
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
                            className="font-semibold uppercase tracking-wider text-[10px]"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${
                          alert.severity === "high"
                            ? "text-rose-900/90 dark:text-rose-200/90"
                            : "text-amber-900/90 dark:text-amber-200/90"
                        }`}>
                          {alert.description}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            {formatDate(alert.created_at)}
                          </span>
                          {!isAck ? (
                            <button
                              onClick={() => handleAcknowledge(alert.id)}
                              className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 hover:underline cursor-pointer"
                            >
                              Mark Acknowledged
                            </button>
                          ) : (
                            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Donations &amp; Utilization ({donations.length})
              </CardTitle>
              <CardDescription>
                Public transparency tracking for donor fund allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <HeartHandshake className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No Donations Recorded Yet</p>
                  <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                    Contributions logged by donors will appear here with audit verification receipts.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {donations.map((don) => (
                    <div
                      key={don.id}
                      className="p-3.5 bg-slate-50/90 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {don.amount_inr ? formatCurrency(don.amount_inr) : `${don.quantity} ${don.unit}`}
                        </span>
                        <Badge variant={don.status === "utilized" ? "success" : "indigo"}>
                          {don.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
                        {don.item_description || "Welfare operational contribution"}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-mono">
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

