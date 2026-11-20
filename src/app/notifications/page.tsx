"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Stethoscope,
  Boxes,
  Building2,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { useRole } from "@/context/role-context";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const { currentRole } = useRole();
  const { alerts, acknowledgeAlert } = useDataStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Summary Metrics
  const totalAlerts = alerts.length;
  const pendingAlerts = alerts.filter((a) => a.status === "pending_review");
  const highSeverityAlerts = alerts.filter(
    (a) => (a.severity === "high" || a.severity === "critical") && a.status === "pending_review"
  );
  const stockAlerts = alerts.filter((a) => a.alert_type === "stock_shortage");
  const clinicalAlerts = alerts.filter((a) => a.alert_type === "health_risk");
  const acknowledgedCount = alerts.filter((a) => a.status === "acknowledged").length;
  const resolutionRate = totalAlerts > 0 ? Math.round((acknowledgedCount / totalAlerts) * 100) : 100;

  // Filtered Alert List
  const filteredAlerts = alerts.filter((a) => {
    // 1. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.alert_type.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "health_risk" && a.alert_type !== "health_risk") return false;
      if (selectedCategory === "stock_shortage" && a.alert_type !== "stock_shortage") return false;
      if (
        selectedCategory === "verification" &&
        a.alert_type !== "unverified_institution"
      )
        return false;
    }

    // 3. Severity filter
    if (selectedSeverity !== "all") {
      if (selectedSeverity === "high" && a.severity !== "high" && a.severity !== "critical")
        return false;
      if (selectedSeverity === "medium" && a.severity !== "medium") return false;
      if (selectedSeverity === "low" && a.severity !== "low") return false;
    }

    // 4. Status filter
    if (selectedStatus !== "all") {
      if (a.status !== selectedStatus) return false;
    }

    return true;
  });

  const handleMarkAllVisible = () => {
    filteredAlerts.forEach((a) => {
      if (a.status === "pending_review") {
        acknowledgeAlert(a.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Batch Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-indigo-700" />
              Centralized Incident &amp; Notification Command Center
            </h1>
            <Badge className="bg-indigo-50 text-indigo-800 border-indigo-200 font-extrabold text-[10px] tracking-wide uppercase">
              Live Real-Time Dispatch
            </Badge>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Automated monitoring for clinical priority triage spikes, critical inventory stockouts, and institutional verification reviews.
          </p>
        </div>

        {pendingAlerts.length > 0 && (
          <Button
            size="sm"
            onClick={handleMarkAllVisible}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-xs cursor-pointer flex-shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Visible as Acknowledged
          </Button>
        )}
      </div>

      {/* 4 TOP KPI CARDS WITH ENTERPRISE LEFT BORDERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Incidents */}
        <Card className="border-l-4 border-l-sky-600 bg-white border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total In-App Incidents
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {totalAlerts} Alerts
              </h3>
              <p className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 mt-1 inline-block">
                {pendingAlerts.length} Action Pending
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: High Severity Action Needed */}
        <Card className="border-l-4 border-l-rose-600 bg-white border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                High-Severity Critical
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-950 mt-1 tracking-tight">
                {highSeverityAlerts.length} Cases
              </h3>
              <p className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 mt-1 inline-block">
                Immediate Action Required
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Stock Deficits & Supplies */}
        <Card className="border-l-4 border-l-amber-500 bg-white border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Inventory Deficits
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-950 mt-1 tracking-tight">
                {stockAlerts.length} Shortages
              </h3>
              <p className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-1 inline-block">
                Below Reorder Threshold
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Acknowledged / Resolved Rate */}
        <Card className="border-l-4 border-l-emerald-600 bg-white border border-slate-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Resolution Rate
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 tracking-tight">
                {resolutionRate}%
              </h3>
              <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1 inline-block">
                {acknowledgedCount} Acknowledged
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* SEARCH AND MULTI-FILTER BAR */}
      <Card className="bg-white border border-slate-200 shadow-xs">
        <CardContent className="p-4 space-y-3">
          {/* Top Row: Search and Status/Severity Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search incident title, condition, description or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="high">Critical / High</option>
                <option value="medium">Medium Severity</option>
                <option value="low">Low Severity</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending_review">Pending Review</option>
                <option value="acknowledged">Acknowledged</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-500 mr-1 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter Category:
            </span>
            {[
              { id: "all", label: `All Alerts (${totalAlerts})` },
              { id: "health_risk", label: `Clinical Triage (${clinicalAlerts.length})` },
              { id: "stock_shortage", label: `Stock Shortages (${stockAlerts.length})` },
              { id: "verification", label: "Care Home Accreditation" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* INCIDENT ALERT CARDS LIST */}
      {filteredAlerts.length === 0 ? (
        <Card className="bg-white border border-slate-200 text-center py-16 shadow-xs">
          <CardContent>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Matching Notifications Found</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "all" || selectedSeverity !== "all" || selectedStatus !== "all"
                ? "No alerts match your current filter parameters. Try clearing the search or changing filters."
                : "All welfare systems, clinical vitals, and supply stocks are operating within nominal thresholds."}
            </p>
            {(searchQuery || selectedCategory !== "all" || selectedSeverity !== "all" || selectedStatus !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedSeverity("all");
                  setSelectedStatus("all");
                }}
                className="mt-4 font-bold text-xs"
              >
                Reset All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isAck = alert.status === "acknowledged";
            const isHigh = alert.severity === "high" || alert.severity === "critical";
            const isMed = alert.severity === "medium";

            return (
              <Card
                key={alert.id}
                className={`bg-white border transition-all shadow-2xs hover:shadow-sm ${
                  isAck
                    ? "border-slate-200 opacity-75"
                    : isHigh
                    ? "border-l-4 border-l-rose-600 border-rose-200 bg-rose-50/20"
                    : isMed
                    ? "border-l-4 border-l-amber-500 border-amber-200 bg-amber-50/20"
                    : "border-l-4 border-l-sky-500 border-sky-200"
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Alert Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Category Icon Badge */}
                      <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                        {alert.alert_type === "health_risk" && <Stethoscope className="w-3.5 h-3.5 text-rose-600" />}
                        {alert.alert_type === "stock_shortage" && <Boxes className="w-3.5 h-3.5 text-amber-600" />}
                        {alert.alert_type !== "health_risk" && alert.alert_type !== "stock_shortage" && (
                          <Building2 className="w-3.5 h-3.5 text-sky-600" />
                        )}
                      </span>

                      <span className="font-bold text-slate-900 text-sm">
                        {alert.title}
                      </span>

                      {!isAck && (
                        <Badge variant="indigo" className="text-[10px] font-bold">
                          New
                        </Badge>
                      )}

                      <Badge
                        variant={
                          isHigh ? "danger" : isMed ? "warning" : "secondary"
                        }
                        className="font-bold uppercase tracking-wider text-[10px]"
                      >
                        {alert.severity}
                      </Badge>

                      {alert.priority_score && (
                        <Badge variant="outline" className="font-bold text-[10px] bg-rose-50 text-rose-700 border-rose-200">
                          Priority Score: {alert.priority_score}/100
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {alert.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-slate-400" /> {formatDate(alert.created_at)}
                      </span>
                      <span>&bull;</span>
                      <span className="capitalize">
                        Category: <strong>{alert.alert_type.replace("_", " ")}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions & Deep Links */}
                  <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Deep Link to Relevant Module */}
                    {alert.alert_type === "health_risk" && (
                      <Link href="/health">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs font-bold border-rose-300 text-rose-800 bg-white hover:bg-rose-50"
                        >
                          Doctor Vault <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}

                    {alert.alert_type === "stock_shortage" && (
                      <Link href="/resources">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs font-bold border-amber-300 text-amber-800 bg-white hover:bg-amber-50"
                        >
                          Restock Supply <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}

                    {alert.alert_type !== "health_risk" && alert.alert_type !== "stock_shortage" && (
                      <Link href="/institutions">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs font-bold border-sky-300 text-sky-800 bg-white hover:bg-sky-50"
                        >
                          Review Facility <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}

                    {/* Acknowledgment Action */}
                    {isAck ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Acknowledged
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
