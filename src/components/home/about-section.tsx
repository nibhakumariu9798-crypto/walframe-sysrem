"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Shield,
  Activity,
  Users,
  Building2,
  Boxes,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDataStore } from "@/context/data-store-context";

export function AboutSection() {
  const { institutions, beneficiaries, inventory, donations } = useDataStore();

  const totalCapacity = institutions.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
  const totalOccupancy = institutions.reduce((acc, curr) => acc + (curr.current_occupancy || 0), 0);

  return (
    <section id="about" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* About Grid: Mission & Value Proposition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Why We Built This Platform
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Addressing the Real-World Crises in Orphanages &amp; Senior Living Care
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Orphanages and elderly care homes across the country face recurrent operational vulnerabilities: sudden seasonal stockouts of life-saving hypertension/diabetic medicines, unpredictable food donations leading to perishable spoilage, and siloed resident health data.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Our <strong>AI-Driven Smart Welfare Resource Management System</strong> bridges these gaps by providing proactive consumption forecasting, transparent donation distribution, and privacy-preserving clinical vitals tracking under strict Row Level Security.
            </p>

            {/* Checklist */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <span><strong>Child Welfare:</strong> Focus on educational stability, seasonal nutrition, and clothing distribution.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <span><strong>Elderly Health:</strong> Continuous doctor review of cardiovascular vitals, mobility, and diabetic care.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <span><strong>Zero-Leakage Accountability:</strong> Every grain of food and rupee donated is auditable in real time.</span>
              </div>
            </div>

            <div className="pt-3">
              <Link href="/donations">
                <Button className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-300" />
                  <span>Support a Verified Home</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Live System Metrics Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-white via-sky-50/60 to-blue-50/50 text-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg shadow-sky-900/5 border border-sky-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-4 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-sky-900 uppercase tracking-wider">
                  Live System Operating Telemetry
                </span>
              </div>
              <Badge variant="outline" className="border-emerald-300 text-emerald-800 bg-emerald-50 text-[10px] font-bold">
                Active
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 py-6">
              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 font-medium">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>Certified Homes</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {institutions.length}
                </div>
                <div className="text-[11px] text-sky-700 mt-1 font-semibold">
                  {totalCapacity} Verified Beds
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 font-medium">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Enrolled Residents</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {beneficiaries.length}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
                  Children &amp; Senior Citizens
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 font-medium">
                  <Boxes className="w-4 h-4 text-indigo-600" />
                  <span>Stock Items Monitored</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {inventory.length}
                </div>
                <div className="text-[11px] text-indigo-700 mt-1 font-semibold">
                  Food, Apparel, Medicine
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Model Pipeline</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Active
                </div>
                <div className="text-[11px] text-amber-700 mt-1 font-semibold">
                  Dynamic Census Driven
                </div>
              </div>
            </div>

            <div className="pt-2 text-center sm:text-left text-[11px] text-slate-500 flex items-center justify-between">
              <span>Encrypted via Supabase Postgres RLS</span>
              <Link href="/dashboard" className="text-sky-700 hover:text-sky-800 font-bold underline">
                View Full Audit Dashboard &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Certified Institutions Showcase Section */}
        <div id="institutions" className="pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Network of Care
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                Certified Welfare Institutions
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Officially inspected orphanages and senior citizen homes operating on the system.
              </p>
            </div>

            <Link href="/institutions">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                <span>View All Institutions</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {institutions.slice(0, 4).map((inst) => (
              <div
                key={inst.id}
                className="bg-slate-50/70 hover:bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-bold ${
                        inst.institution_type === "orphanage"
                          ? "border-teal-300 text-teal-800 bg-teal-50"
                          : inst.institution_type === "old_age_home"
                          ? "border-indigo-300 text-indigo-800 bg-indigo-50"
                          : "border-purple-300 text-purple-800 bg-purple-50"
                      }`}
                    >
                      {inst.institution_type === "orphanage"
                        ? "Orphanage"
                        : inst.institution_type === "old_age_home"
                        ? "Senior Care"
                        : "Mixed Care"}
                    </Badge>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">
                    {inst.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{inst.city}, {inst.state}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Capacity: <strong>{inst.capacity}</strong></span>
                  <span>Occupancy: <strong>{inst.current_occupancy}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
