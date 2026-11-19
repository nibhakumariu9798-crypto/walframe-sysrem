"use client";

import React from "react";
import Link from "next/link";
import { Shield, Mail, Phone, MapPin, ExternalLink, Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5 text-teal-100" />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight">
                  Welfare System
                </span>
                <span className="block text-[10px] text-teal-300 font-medium tracking-wide uppercase">
                  Social Welfare Resource Protocol
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A public service digital infrastructure engineered for certified orphanages and senior living care facilities. Ensuring transparent stock distribution, AI demand forecasting, and dignified beneficiary healthcare.
            </p>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>State Welfare Registry Synchronized</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Data secured under Supabase PostgreSQL Row Level Security (RLS). Non-diagnostic medical guidelines applied.
              </p>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-teal-300 transition-colors">
                  Portal Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-300 transition-colors">
                  Operational Dashboard
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="hover:text-teal-300 transition-colors">
                  Certified Institutions
                </Link>
              </li>
              <li>
                <Link href="/beneficiaries" className="hover:text-teal-300 transition-colors">
                  Beneficiary Registry
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-teal-300 transition-colors">
                  Inventory &amp; Supplies
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="hover:text-teal-300 transition-colors">
                  AI Stock Forecasting
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Public & Donor Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Engagement &amp; Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/donations" className="hover:text-teal-300 transition-colors">
                  Donate to a Verified Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-300 transition-colors">
                  Sign In to Account
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-teal-300 transition-colors">
                  Register New Institution
                </Link>
              </li>
              <li>
                <Link href="/health" className="hover:text-teal-300 transition-colors">
                  Clinical Care Log (Doctors)
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-teal-300 transition-colors">
                  Public Compliance Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Official Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              State Welfare Desk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>Department of Social Welfare, Sector 4, Ranchi, Jharkhand &bull; 834001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>+91 94311 00000 (Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>welfare.coordinator@gov.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            &copy; 2026 AI-Driven Smart Welfare Resource Management System &bull; State Welfare Protocol
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Children &amp; Senior Citizens
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
