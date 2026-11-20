"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Database,
  Calendar,
  Layers,
  ArrowUpDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Prediction, Beneficiary } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";

interface Props {
  predictions: Prediction[];
  beneficiaries: Beneficiary[];
}

export function EnhancedAuditLedger({ predictions, beneficiaries }: Props) {
  const { currentRole } = useRole();
  const isDoctorOrAdmin = currentRole === "doctor" || currentRole === "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter predictions
  const filtered = predictions.filter((p) => {
    const matchesDomain = domainFilter === "all" || p.prediction_domain === domainFilter;
    const resident = beneficiaries.find((b) => b.id === p.beneficiary_id);
    const residentName = resident ? resident.first_name : "";
    const matchesSearch =
      p.target_variable.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.predicted_class && p.predicted_class.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesSearch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Safe CSV export with privacy redaction
  const exportLedgerCSV = () => {
    const headers = [
      "Inference ID",
      "Domain",
      "Resident / Entity Ref",
      "Target Variable",
      "Predicted Value",
      "Predicted Class",
      "Model Name",
      "Model Version",
      "Model Tier",
      "Confidence",
      "Timestamp",
    ];

    const rows = filtered.map((p) => {
      const res = beneficiaries.find((b) => b.id === p.beneficiary_id);
      const residentLabel = res
        ? isDoctorOrAdmin
          ? res.first_name
          : `Resident ${res.identifier_code}`
        : "Institutional Supply";

      return [
        `"${p.id}"`,
        `"${p.prediction_domain}"`,
        `"${residentLabel.replace(/"/g, '""')}"`,
        `"${p.target_variable}"`,
        p.predicted_value || "N/A",
        `"${p.predicted_class || ""}"`,
        `"${p.model_name}"`,
        `"${p.model_version}"`,
        `"${p.model_tier}"`,
        p.confidence_score ? `${(p.confidence_score * 100).toFixed(0)}%` : "N/A",
        `"${p.created_at}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ai_inference_audit_ledger_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by inference ID, resident, or model..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Domain Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(["all", "health_risk", "resource_forecast"] as const).map((dom) => (
              <button
                key={dom}
                onClick={() => {
                  setDomainFilter(dom);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer capitalize ${
                  domainFilter === dom
                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {dom === "all" ? "All Domains" : dom === "health_risk" ? "Health Triage" : "Resource"}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportLedgerCSV}
            className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-slate-500" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-8"></th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Target Variable</th>
                <th className="py-3 px-4">Subject / Resident</th>
                <th className="py-3 px-4">Predicted Value</th>
                <th className="py-3 px-4">Model Pipeline</th>
                <th className="py-3 px-4 text-center">Confidence</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-slate-500">
                    <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-800 text-sm">No matching inferences found</p>
                    <p className="text-slate-400 mt-1">Try clearing your search query or domain filter.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((pred) => {
                  const isExpanded = expandedId === pred.id;
                  const isHealth = pred.prediction_domain === "health_risk";
                  const res = beneficiaries.find((b) => b.id === pred.beneficiary_id);
                  const residentLabel = res
                    ? isDoctorOrAdmin
                      ? res.first_name
                      : `Resident (${res.identifier_code})`
                    : "Facility Supply Ledger";

                  const explanation = (pred.explanation_payload || {}) as Record<string, unknown>;
                  const factors = (explanation.factors || []) as { feature: string; impact: string }[];
                  const shapFactors = (explanation.shap_contributions || []) as { feature: string; contribution: string }[];

                  return (
                    <React.Fragment key={pred.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : pred.id)}
                        className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 text-slate-400">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              isHealth
                                ? "bg-rose-50 text-rose-800 border-rose-200"
                                : "bg-indigo-50 text-indigo-800 border-indigo-200"
                            }`}
                          >
                            {isHealth ? "Health Triage" : "Resource"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900 capitalize">
                          {pred.target_variable.replace(/_/g, " ")}
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {residentLabel}
                        </td>

                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {isHealth ? (
                            <span className="flex items-center gap-1.5">
                              <span className="capitalize">{pred.predicted_class?.replace(/_/g, " ")}</span>
                              {pred.predicted_value && (
                                <span className="text-[11px] font-mono text-slate-500">
                                  ({pred.predicted_value} pts)
                                </span>
                              )}
                            </span>
                          ) : pred.target_variable.includes("budget") || pred.target_variable.includes("expense") ? (
                            formatCurrency(pred.predicted_value || 0)
                          ) : pred.target_variable.includes("clothing") ? (
                            `${pred.predicted_value} units`
                          ) : pred.target_variable.includes("medicine") ? (
                            `${pred.predicted_value} units`
                          ) : (
                            `${pred.predicted_value} kg`
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="font-bold text-xs">{pred.model_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{pred.model_version}</div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {pred.confidence_score ? `${(pred.confidence_score * 100).toFixed(0)}%` : "N/A"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                          {formatDate(pred.created_at)}
                        </td>
                      </tr>

                      {/* Expandable Feature Snapshot & JSON Payload */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-y border-slate-200">
                          <td colSpan={8} className="p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {/* Input Snapshot */}
                              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                                  Input Features Snapshot
                                </span>
                                <div className="space-y-1 text-[11px]">
                                  {Object.entries(pred.input_features || {}).map(([k, v]) => (
                                    <div key={k} className="flex justify-between py-0.5 border-b border-slate-100">
                                      <span className="capitalize text-slate-600">{k.replace(/_/g, " ")}:</span>
                                      <span className="font-bold text-slate-900 font-mono">{String(v)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* SHAP & Factors */}
                              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                                  Explainability Attribution Payload
                                </span>
                                {factors.length > 0 ? (
                                  <div className="space-y-1 text-[11px]">
                                    {factors.map((f, i) => (
                                      <div key={i} className="flex justify-between py-0.5 border-b border-slate-100">
                                        <span className="capitalize text-slate-600">{f.feature.replace(/_/g, " ")}:</span>
                                        <span className="font-bold text-indigo-700 font-mono">{f.impact}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : shapFactors.length > 0 ? (
                                  <div className="space-y-1 text-[11px]">
                                    {shapFactors.map((s, i) => (
                                      <div key={i} className="flex justify-between py-0.5 border-b border-slate-100">
                                        <span className="capitalize text-slate-600">{s.feature.replace(/_/g, " ")}:</span>
                                        <span className="font-bold text-rose-700 font-mono">{s.contribution}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-slate-400 text-xs italic">No SHAP weights stored for this heuristic baseline.</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(filtered.length, currentPage * pageSize)} of {filtered.length} entries
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-100"
            >
              Previous
            </button>
            <span className="font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
