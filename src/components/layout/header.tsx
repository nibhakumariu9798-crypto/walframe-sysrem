"use client";

import React from "react";
import Link from "next/link";
import { Bell, Search, LogOut, LogIn, UserCheck } from "lucide-react";
import { useRole } from "@/context/role-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Header() {
  const { currentRole, currentProfile, isAuthenticated, isLoadingAuth, signOut } = useRole();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "government":
        return "indigo";
      case "doctor":
        return "danger";
      case "institution":
        return "success";
      case "ngo":
        return "warning";
      default:
        return "secondary";
    }
  };

  const initials = currentProfile.full_name
    ? currentProfile.full_name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : (currentProfile.email ? currentProfile.email.slice(0, 2).toUpperCase() : "U");

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between z-10 select-none shadow-xs">
      {/* Search / Global Quick Finder */}
      <div className="flex items-center gap-3 w-80 md:w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search beneficiaries, institutions, records..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white font-medium transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Environment Status Badge */}
        {isAuthenticated && currentProfile.email ? (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 shadow-2xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Live User: {currentProfile.email}
            </span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[11px] text-slate-600 font-medium">
              Public Portal View
            </span>
          </div>
        )}

        {/* Notifications Icon */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile & Auth */}
        {isLoadingAuth ? (
          <div className="flex items-center gap-2.5 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="hidden sm:block space-y-1">
              <div className="w-20 h-3 bg-slate-200 rounded" />
              <div className="w-28 h-2 bg-slate-200 rounded" />
            </div>
          </div>
        ) : currentProfile.email ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs border border-sky-200 shadow-2xs">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">
                  {currentProfile.full_name || "User"}
                </span>
                <Badge variant={getRoleBadgeVariant(currentRole)}>
                  {currentRole}
                </Badge>
              </div>
              <p
                className="text-[11px] text-slate-500 truncate max-w-[190px] font-mono"
                title={currentProfile.email}
              >
                {currentProfile.email}
              </p>
            </div>

            <button
              onClick={signOut}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
              title="Sign Out of Supabase"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button size="sm" className="bg-sky-700 hover:bg-sky-800 text-white text-xs px-3 py-1.5 font-semibold flex items-center gap-1">
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" variant="outline" className="text-xs px-3 py-1.5">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
