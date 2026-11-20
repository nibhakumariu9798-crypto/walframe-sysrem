"use client";

import React, { useState } from "react";
import {
  Brain,
  Activity,
  Sparkles,
  BarChart3,
  Cpu,
  Database,
  Sliders,
  ShieldAlert,
  Download,
  Plus,
  RefreshCw,
  CheckCircle2,
  Layers,
  Heart,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { useRole } from "@/context/role-context";
import { ClinicalKpiOverview } from "@/components/ai/clinical-kpi-overview";
import { ClinicalRiskAnalytics } from "@/components/ai/clinical-risk-analytics";
import { ShapExplainabilityEngine } from "@/components/ai/shap-explainability-engine";
import { ModelEvaluationCenter } from "@/components/ai/model-evaluation-center";
import { DataDriftMonitor } from "@/components/ai/data-drift-monitor";
import { ModelRegistryTable } from "@/components/ai/model-registry-table";
import { EnhancedAuditLedger } from "@/components/ai/enhanced-audit-ledger";
import { SimulationSandbox } from "@/components/ai/simulation-sandbox";
import { SimulateForecastModal } from "@/components/modals/simulate-forecast-modal";

export default function PredictionsPage() {
  const { currentRole } = useRole();
  const { predictions, beneficiaries, medicalRecords, alerts, institutions } = useDataStore();

  const [activeTab, setActiveTab] = useState<
    "clinical_analytics" | "shap" | "evaluation" | "drift" | "registry" | "ledger" | "simulation"
  >("clinical_analytics");

  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Breadcrumb & Main Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                AI &amp; Clinical Intelligence
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Model Governance &amp; Decision Support Platform
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Advanced AI Clinical Intelligence &amp; Model Governance
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                {predictions.length} Logged Inferences
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
              Multi-task clinical triage, multivariate resource forecasting, interactive SHAP attribution, and Population Stability Index (PSI) drift monitoring for child welfare and senior care facilities.
            </p>
          </div>

          {/* Quick Action Header Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => setIsSimulateModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-white" /> + Run Forecast Simulation
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Executive Intelligence Command Center (8 Real-Time Dynamic KPIs) */}
      <ClinicalKpiOverview
        predictions={predictions}
        beneficiaries={beneficiaries}
        medicalRecords={medicalRecords}
        psiStatus="optimal"
      />

      {/* Mandatory Non-Diagnostic Clinical Safety Notice (Rule 6) */}
      <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5 shadow-xs">
        <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-rose-950 text-xs">
            Mandatory Clinical Decision Support Notice (Non-Diagnostic)
          </p>
          <p className="text-[11px] text-rose-800 leading-relaxed font-medium">
            All priority scores, SHAP explanations, and risk tiers are automated algorithmic indicators designed exclusively to optimize clinical review queues. They do <strong>NOT</strong> constitute a medical diagnosis, do <strong>NOT</strong> prescribe pharmaceuticals, and must be verified by a licensed physician.
          </p>
        </div>
      </div>

      {/* Navigation Tab Bar across 7 Intelligence Modules */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveTab("clinical_analytics")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "clinical_analytics"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-rose-400" />
          Clinical Risk Analytics
        </button>

        <button
          onClick={() => setActiveTab("shap")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "shap"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          SHAP Explainability
        </button>

        <button
          onClick={() => setActiveTab("evaluation")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "evaluation"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          Model Evaluation (ROC / Matrix)
        </button>

        <button
          onClick={() => setActiveTab("drift")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "drift"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
          Data Drift (PSI)
        </button>

        <button
          onClick={() => setActiveTab("registry")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "registry"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          Model Registry
        </button>

        <button
          onClick={() => setActiveTab("ledger")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ledger"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          Audit Ledger ({predictions.length})
        </button>

        <button
          onClick={() => setActiveTab("simulation")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "simulation"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          Simulation Sandbox
        </button>
      </div>

      {/* ACTIVE TAB VIEW CONTENT */}
      {activeTab === "clinical_analytics" && (
        <ClinicalRiskAnalytics
          beneficiaries={beneficiaries}
          medicalRecords={medicalRecords}
          predictions={predictions}
          alerts={alerts}
          institutions={institutions}
        />
      )}

      {activeTab === "shap" && (
        <ShapExplainabilityEngine
          predictions={predictions}
          beneficiaries={beneficiaries}
        />
      )}

      {activeTab === "evaluation" && <ModelEvaluationCenter />}

      {activeTab === "drift" && <DataDriftMonitor />}

      {activeTab === "registry" && <ModelRegistryTable predictions={predictions} />}

      {activeTab === "ledger" && (
        <EnhancedAuditLedger
          predictions={predictions}
          beneficiaries={beneficiaries}
        />
      )}

      {activeTab === "simulation" && <SimulationSandbox />}

      {/* Simulate Forecast Modal */}
      <SimulateForecastModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
      />
    </div>
  );
}
