"use client";

import React, { useState } from "react";
import { FileText, Download, Printer, ShieldCheck, CheckCircle2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { useRole } from "@/context/role-context";

export default function ReportsPage() {
  const { currentRole } = useRole();
  const { institutions, inventory, donations, predictions, alerts } = useDataStore();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((cell) => `"${cell}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExport = (reportId: string) => {
    if (reportId === "resources") {
      const headers = ["Institution", "Type", "City", "State", "Capacity", "Occupancy", "Verification"];
      const rows = institutions.map((i) => [
        i.name,
        i.institution_type,
        i.city,
        i.state,
        i.capacity,
        i.current_occupancy,
        i.verification_status,
      ]);
      downloadCSV("institutional_resource_summary", headers, rows);
    } else if (reportId === "forecasts") {
      const headers = ["Target Variable", "Predicted Value", "Model Name", "Model Version", "Tier", "Confidence", "Synthetic"];
      const rows = predictions.map((p) => [
        p.target_variable,
        p.predicted_value || p.predicted_class || "",
        p.model_name,
        p.model_version,
        p.model_tier,
        p.confidence_score ? `${(p.confidence_score * 100).toFixed(0)}%` : "N/A",
        p.is_synthetic ? "TRUE" : "FALSE",
      ]);
      downloadCSV("ai_demand_projections", headers, rows);
    } else if (reportId === "donations") {
      const headers = ["Receipt No", "Type", "Category", "Amount (INR)", "Status", "Allocated Purpose", "Anonymous"];
      const rows = donations.map((d) => [
        d.receipt_number,
        d.donation_type,
        d.category,
        d.amount_inr || d.quantity || 0,
        d.status,
        d.allocated_purpose || "General Welfare",
        d.is_anonymous ? "YES" : "NO",
      ]);
      downloadCSV("donor_transparency_audit", headers, rows);
    } else if (reportId === "clinical") {
      if (currentRole !== "doctor" && currentRole !== "admin") {
        alert("Access Denied: Medical confidentiality restricts this report to licensed physicians and state health coordinators.");
        return;
      }
      const headers = ["Alert ID", "Severity", "Priority Score", "Title", "Status", "Clinical Review Required"];
      const rows = alerts
        .filter((a) => a.alert_type === "health_risk")
        .map((a) => [
          a.id,
          a.severity,
          a.priority_score || "N/A",
          a.title,
          a.status,
          "YES",
        ]);
      downloadCSV("clinical_risk_triage_queue", headers, rows);
    }
  };

  const reports = [
    {
      id: "resources",
      title: "Monthly Institutional Resource Summary",
      desc: "Aggregated food, clothing, medicine, and expenditure reports across certified care homes.",
      audience: "Government & Superintendents",
      format: "CSV / Printable",
    },
    {
      id: "forecasts",
      title: "AI Demand Forecast Projections (Q2 2026)",
      desc: "Machine learning regression predictions for upcoming procurement budgets with model disclaimers.",
      audience: "Government, NGOs & Planning Boards",
      format: "CSV / Audit Log",
    },
    {
      id: "donations",
      title: "Donor Transparency & Fund Utilization Audit",
      desc: "Verified expenditure tracking and receipt reconciliation for public donors.",
      audience: "Donors & General Public",
      format: "CSV / Transparency Roster",
    },
    {
      id: "clinical",
      title: "Clinical Risk Queue & Health Triage Summary",
      desc: "Anonymized doctor review queue summary. Access restricted by medical confidentiality.",
      audience: "Licensed Physicians Only",
      format: "Encrypted CSV / Doctor Roster",
      restricted: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Welfare Reports &amp; Official Audit Exports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate printable, audit-ready operational and financial compliance documents.
          </p>
        </div>

        {downloadSuccess && (
          <Badge variant="success" className="text-xs flex items-center gap-1.5 py-1 px-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Exported {downloadSuccess}.csv
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => {
          const isRestrictedForUser = rep.restricted && currentRole !== "doctor" && currentRole !== "admin";

          return (
            <Card key={rep.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                      {rep.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {rep.desc}
                    </CardDescription>
                  </div>
                  {rep.restricted && (
                    <Badge variant="danger" className="text-[10px]">
                      Doctor Restricted
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Audience: <strong>{rep.audience}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      <Printer className="w-3.5 h-3.5 mr-1" /> Print
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleExport(rep.id)}
                      disabled={isRestrictedForUser}
                      variant={isRestrictedForUser ? "secondary" : "primary"}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      {isRestrictedForUser ? "Restricted" : "Export CSV"}
                    </Button>
                  </div>
                </div>

                {isRestrictedForUser && (
                  <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Switch to Doctor role in the header to export this clinical summary.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
