"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, Sun, Moon, LogOut, LogIn, UserCheck } from "lucide-react";
import { useRole } from "@/context/role-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Header() {
  const { currentRole, currentProfile, isAuthenticated, isLoadingAuth, signOut } = useRole();
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("welfare_theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("welfare_theme", next ? "dark" : "light");
      }
      return next;
    });
  };

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
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-6 flex items-center justify-between z-10 transition-colors">
      {/* Search / Global Quick Finder */}
      <div className="flex items-center gap-3 w-80 md:w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search beneficiaries, institutions, records..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Environment Status Badge */}
        {isAuthenticated && currentProfile.email ? (
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Live User: {currentProfile.email}
            </span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              Public Portal View
            </span>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Icon */}
        <button
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        {/* User Profile & Auth */}
        {isLoadingAuth ? (
          <div className="flex items-center gap-2.5 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="hidden sm:block space-y-1">
              <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="w-28 h-2 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        ) : currentProfile.email ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-800 shadow-2xs">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {currentProfile.full_name || "User"}
                </span>
                <Badge variant={getRoleBadgeVariant(currentRole)}>
                  {currentRole}
                </Badge>
              </div>
              <p
                className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[190px] font-mono"
                title={currentProfile.email}
              >
                {currentProfile.email}
              </p>
            </div>

            <button
              onClick={signOut}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              title="Sign Out of Supabase"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 font-semibold flex items-center gap-1">
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

