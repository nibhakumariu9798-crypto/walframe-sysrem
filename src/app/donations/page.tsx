"use client";

import React, { useState } from "react";
import { HeartHandshake, Plus, Search, FileText, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { RecordDonationModal } from "@/components/modals/record-donation-modal";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DonationsPage() {
  const { donations, institutions, updateDonationStatus } = useDataStore();
  const [isRecordOpen, setIsRecordOpen] = useState(false);

  const getInstitutionName = (id: string) => {
    const found = institutions.find((i) => i.id === id);
    return found ? found.name : id;
  };

  const getNextStatus = (current: string): "received" | "allocated" | "utilized" | null => {
    if (current === "pledged") return "received";
    if (current === "received") return "allocated";
    if (current === "allocated") return "utilized";
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
            Donation Management &amp; Public Transparency ({donations.length} Contributions)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Auditable tracking of monetary contributions and in-kind provisions allocated across care homes.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsRecordOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Record Contribution
        </Button>
      </div>

      {/* Transparency Guarantee Note */}
      <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>
          <strong>Open Welfare Transparency:</strong> Donors receive verified audit receipts and can track whether funds are pledged, received, allocated to specific supplies, or actively utilized.
        </span>
      </div>

      {/* Donations List */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Receipt Number</th>
                <th className="px-5 py-3 font-semibold">Benefiting Institution</th>
                <th className="px-5 py-3 font-semibold">Contribution</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Allocated Purpose</th>
                <th className="px-5 py-3 font-semibold">Status / Lifecycle</th>
                <th className="px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-slate-500">
                    <HeartHandshake className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      No donations recorded in database yet
                    </p>
                    <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                      Click &quot;Record Contribution&quot; above to log an initial donation or in-kind support.
                    </p>
                  </td>
                </tr>
              ) : (
                donations.map((don) => {
                const next = getNextStatus(don.status);
                return (
                  <tr key={don.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-mono font-medium text-slate-900 dark:text-slate-100">
                      {don.receipt_number}
                      {don.is_anonymous && (
                        <span className="block text-[10px] text-slate-400 italic font-sans">
                          Anonymous Donor
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {getInstitutionName(don.institution_id)}
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-900 dark:text-slate-100">
                      {don.amount_inr ? formatCurrency(don.amount_inr) : `${don.quantity} ${don.unit}`}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary" className="capitalize">
                        {don.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {don.allocated_purpose || don.item_description}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            don.status === "utilized"
                              ? "success"
                              : don.status === "allocated"
                              ? "indigo"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {don.status}
                        </Badge>
                        {next && (
                          <button
                            onClick={() => updateDonationStatus(don.id, next)}
                            className="text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded flex items-center gap-0.5 cursor-pointer font-medium"
                            title={`Advance lifecycle to ${next}`}
                          >
                            <span>Mark {next}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-[11px]">
                      {formatDate(don.donated_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </CardContent>
      </Card>

      <RecordDonationModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
      />
    </div>
  );
}
