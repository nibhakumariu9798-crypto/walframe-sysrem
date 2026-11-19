"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Landing page and standalone auth pages use their own full-bleed layouts
  const isLandingPage = pathname === "/";
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  if (isLandingPage || isAuthPage) {
    return (
      <div className="flex-1 flex flex-col min-h-screen w-full bg-white text-slate-900 overflow-y-auto">
        {children}
      </div>
    );
  }

  // All operational dashboard routes preserve the exact existing sidebar and header layout
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Role-Aware Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/70 dark:bg-slate-950/95">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
