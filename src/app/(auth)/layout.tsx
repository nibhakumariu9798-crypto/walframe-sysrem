import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-sky-100 selection:text-sky-900">
      {/* Top Government Navigation Header */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-sky-700 transition-colors py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to Welfare Portal</span>
            </Link>

            <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-900">
                भारत सरकार &bull; Ministry of Women and Child Development
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Secure RLS Encryption Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container (wide and flexible) */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {children}
      </main>

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 AI-Driven Smart Welfare Resource Management System &bull; State Welfare Protocol</span>
          <span className="text-slate-400">Helpline: +91 94311 00000 | Email: welfare.coordinator@gov.in</span>
        </div>
      </footer>
    </div>
  );
}
