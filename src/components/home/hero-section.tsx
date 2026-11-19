"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Info,
  ShieldCheck,
  Heart,
  Sparkles,
  Users,
  Building2,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/role-context";

export function HeroSection() {
  const { isAuthenticated } = useRole();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white pt-8 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-100">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-10 w-96 h-96 bg-slate-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call-to-Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Mission Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Official Social Welfare Protocol &bull; Dual-Care Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Smart Welfare Management for{" "}
              <span className="text-teal-700 underline decoration-teal-300 decoration-wavy decoration-2">
                Orphanages
              </span>{" "}
              &amp;{" "}
              <span className="text-slate-800">
                Senior Living Homes
              </span>
            </h1>

            {/* Sub-headline / Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              A unified, privacy-safe welfare management system engineered to support both vulnerable children and elderly citizens. Powered by AI resource demand forecasting, non-diagnostic clinical health monitoring, and 100% auditable donation deployment.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-7 py-6 rounded-xl shadow-md shadow-slate-900/15 flex items-center justify-center gap-2 hover:translate-y-[-1px] transition-all">
                  <span>{isAuthenticated ? "Enter Portal Dashboard" : "Get Started"}</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </Button>
              </Link>

              <Link href="#about" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-semibold text-sm px-6 py-6 rounded-xl bg-white hover:bg-slate-50 flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Info className="w-4 h-4 text-teal-600" />
                  <span>Learn More</span>
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] font-semibold text-slate-700 leading-snug">
                  Supabase RLS Protected
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] font-semibold text-slate-700 leading-snug">
                  AI Stock Forecasting
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] font-semibold text-slate-700 leading-snug">
                  Dual-Care Certified Homes
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Balanced Hero Composition (Children & Elderly Care) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Dual Image Grid Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Child Care Showcase Card */}
                <div className="group relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/10 border border-slate-200 bg-white transition-all hover:shadow-xl hover:translate-y-[-2px]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src="/images/child-care.jpg"
                      alt="Caregiver supporting and engaging with a young child with art and educational supplies in an orphanage home"
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="inline-block px-2 py-0.5 bg-teal-600/90 backdrop-blur-xs text-[10px] font-bold rounded-md uppercase tracking-wider mb-1">
                        Orphanage Support
                      </span>
                      <h3 className="text-xs font-bold leading-tight drop-shadow-xs">
                        Nurturing Education &amp; Nutritional Care
                      </h3>
                    </div>
                  </div>
                  <div className="p-3 bg-white flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      Children&apos;s Homes
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      Active Support
                    </span>
                  </div>
                </div>

                {/* Elderly Care Showcase Card */}
                <div className="group relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/10 border border-slate-200 bg-white transition-all hover:shadow-xl hover:translate-y-[-2px]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src="/images/elderly-care.jpg"
                      alt="Healthcare volunteer providing warm, dignified companionship to a senior resident in a senior living care facility"
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="inline-block px-2 py-0.5 bg-indigo-600/90 backdrop-blur-xs text-[10px] font-bold rounded-md uppercase tracking-wider mb-1">
                        Senior Citizen Care
                      </span>
                      <h3 className="text-xs font-bold leading-tight drop-shadow-xs">
                        Dignified Living &amp; Health Monitoring
                      </h3>
                    </div>
                  </div>
                  <div className="p-3 bg-white flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-600" />
                      Old Age Homes
                    </span>
                    <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                      Daily Clinical Log
                    </span>
                  </div>
                </div>

              </div>

              {/* Floating Verified Impact Summary Banner */}
              <div className="mt-4 p-3 rounded-xl bg-white border border-teal-100 shadow-md flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      Dual-Impact Welfare Coverage
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Childhood Protection &amp; Elder Healthcare in One Portal
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="border-teal-300 text-teal-800 bg-teal-50/50 text-[10px] font-bold uppercase tracking-wider">
                  Verified
                </Badge>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
