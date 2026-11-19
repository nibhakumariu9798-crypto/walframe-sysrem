import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-6">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Welfare Portal</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>Secure RLS Encryption Active</span>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full my-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 mx-auto flex items-center justify-center text-white shadow-md mb-3">
            <Shield className="w-6 h-6 text-indigo-50" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            AI-Driven Smart Welfare System
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Official Portal for Orphanages &amp; Senior Living Homes
          </p>
        </div>

        {children}
      </div>

      <div className="max-w-6xl mx-auto w-full text-center text-[11px] text-slate-400">
        &copy; 2026 Department of Social Welfare &bull; Privacy-Safe Role-Based Access Control
      </div>
    </div>
  );
}
