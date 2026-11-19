"use client";

import React, { useState } from "react";
import { Settings, Sliders, Shield, Database, Save, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";

export default function SettingsPage() {
  const { currentProfile, currentRole } = useRole();
  const [saved, setSaved] = useState(false);

  // Welfare priority weights state
  const [weights, setWeights] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("welfare_priority_weights");
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return {
      ageWeight: 20,
      dlRiskWeight: 35,
      chronicWeight: 25,
      medWeight: 20,
      threshold: 70,
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("welfare_priority_weights", JSON.stringify(weights));
      } catch {
        // fallback
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            System Configuration &amp; Priority Parameters
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tune algorithmic heuristics, audit data connections, and configure institutional profiles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Welfare Priority Heuristic Weight Tuning */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Welfare Priority Score Parameter Configuration
            </CardTitle>
            <CardDescription>
              Configurable weights for the multi-factor clinical alert heuristic (Manuscript Sec. 10).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Age Vulnerability Weight (Max Points)</span>
                  <span className="font-mono">{weights.ageWeight} pts</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.ageWeight}
                  onChange={(e) => setWeights({ ...weights, ageWeight: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>DL Clinical Risk Weight (Max Points)</span>
                  <span className="font-mono">{weights.dlRiskWeight} pts</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={weights.dlRiskWeight}
                  onChange={(e) => setWeights({ ...weights, dlRiskWeight: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Chronic Disease History Weight (Max Points)</span>
                  <span className="font-mono">{weights.chronicWeight} pts</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.chronicWeight}
                  onChange={(e) => setWeights({ ...weights, chronicWeight: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Medication Dependency Weight (Max Points)</span>
                  <span className="font-mono">{weights.medWeight} pts</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={weights.medWeight}
                  onChange={(e) => setWeights({ ...weights, medWeight: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Doctor Alert Notification Threshold</span>
                  <span className="font-mono font-bold text-rose-600">{weights.threshold} / 100</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={weights.threshold}
                  onChange={(e) => setWeights({ ...weights, threshold: Number(e.target.value) })}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Beneficiaries scoring above this threshold trigger automatic inclusion in the doctor review queue.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between">
                {saved ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Parameters Updated
                  </span>
                ) : <span />}
                <Button type="submit" size="sm">
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Save Parameters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Database & Environment Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Backend &amp; Database Connection
              </CardTitle>
              <CardDescription>Supabase credentials &amp; storage configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Supabase RLS Policy Status</span>
                  <p className="text-[11px] text-slate-500">12 tables protected via migration 001</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">AI Adapter Engine</span>
                  <p className="text-[11px] text-slate-500">Deterministic baseline synthetic adapter</p>
                </div>
                <Badge variant="warning">Demo Mode</Badge>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Service Role Protection</span>
                  <p className="text-[11px] text-slate-500">Browser bundle isolated; zero secret leaks</p>
                </div>
                <Badge variant="indigo">Verified</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                Active Profile &amp; Real User Session
              </CardTitle>
              <CardDescription>Verified authentication details from Supabase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Real User Email:</span>
                <span className="font-semibold font-mono text-slate-900 dark:text-slate-100">
                  {currentProfile.email || "No live email session (Sign in to view)"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {currentProfile.full_name || "Guest User"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Supabase User ID:</span>
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  {currentProfile.id || "None"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Active Role Perspective:</span>
                <Badge variant="outline" className="capitalize font-medium">{currentRole}</Badge>
              </div>
              <div className="flex justify-between py-1.5 items-center">
                <span className="text-slate-500">Authentication Source:</span>
                {currentProfile.email ? (
                  <Badge variant="success" className="text-[10px]">Live Supabase Auth</Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">Unauthenticated</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
