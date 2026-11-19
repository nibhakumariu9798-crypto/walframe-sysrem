"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, X } from "lucide-react";
import { useRole } from "@/context/role-context";

export function PrototypeBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { currentRole, currentProfile, isDemoMode } = useRole();

  if (dismissed) return null;

  return (
    <aside
      aria-label="Environment banner"
      className={
        isDemoMode
          ? "bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-950 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200"
          : "bg-emerald-50/90 border-b border-emerald-200/80 px-4 py-2 text-xs text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-200"
      }
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          {isDemoMode ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0" />
              <span className="font-bold text-amber-950 dark:text-amber-200 tracking-tight">
                Demo Prototype Mode:
              </span>
              <span className="truncate text-amber-900/90 dark:text-amber-300/90 font-medium">
                Operating with synthetic demonstration data.
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="font-bold text-emerald-950 dark:text-emerald-200 tracking-tight">
                Live Supabase Connected:
              </span>
              <span className="truncate text-emerald-900/90 dark:text-emerald-300/90 font-medium">
                {currentProfile.email
                  ? `Authenticated session active as ${currentProfile.email}. Database synchronized.`
                  : "Live database active. User profiles and records are synchronized directly with Supabase."}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono bg-white/80 dark:bg-slate-900/50 px-2.5 py-0.5 rounded-md text-slate-800 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700 font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Active Role: {currentRole.toUpperCase()}
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
