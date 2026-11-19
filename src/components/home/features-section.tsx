"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Activity,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 lg:py-20 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            System Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Precision, Accountability &amp; Dignified Care
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every feature is designed to protect vulnerable beneficiaries while giving caregivers and administrators state-of-the-art management tools.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1: AI Resource Forecasting */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                AI Resource Forecasting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Machine learning models analyze historical consumption, occupancy shifts, and seasonal festival patterns to prevent stockouts of staple grains and medicines.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link href="/predictions" className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1">
                <span>View Prediction Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Feature 2: Health Decision Support */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Resident Health Logging
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allows visiting doctors and nurses to log vitals (blood pressure, fasting sugar, BMI) with non-diagnostic risk scoring to alert staff of emergent elder health trends.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link href="/health" className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1">
                <span>Explore Health Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Feature 3: Donation Deployment */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Direct Donation Tracking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Philanthropists and NGOs can pledge monetary or in-kind donations (rice, dal, blankets, pediatric syrups) and track allocation straight to the beneficiary home.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link href="/donations" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <span>Donate &amp; Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Feature 4: Role-Based Security */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Multi-Role Security
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Granular Row Level Security isolates medical data to doctors, restricts administrative changes to superintendents, and grants state auditors full operational oversight.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link href="/reports" className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                <span>Audit &amp; Compliance Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
