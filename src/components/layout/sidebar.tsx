"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Boxes,
  HeartHandshake,
  Activity,
  Sparkles,
  FileText,
  Bell,
  Settings,
  Microscope,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/role-context";
import { UserRole } from "@/types";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
  badge?: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole, switchRole } = useRole();

  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Institutions",
      href: "/institutions",
      icon: Building2,
    },
    {
      name: "Beneficiaries",
      href: "/beneficiaries",
      icon: Users,
    },
    {
      name: "Resources & Stock",
      href: "/resources",
      icon: Boxes,
    },
    {
      name: "Donations",
      href: "/donations",
      icon: HeartHandshake,
    },
    {
      name: "Health & Alerts",
      href: "/health",
      icon: Activity,
      badge: "Priority",
    },
    {
      name: "AI Predictions",
      href: "/predictions",
      icon: Sparkles,
      badge: "ML/DL",
    },
    {
      name: "Research Workspace",
      href: "/research",
      icon: Microscope,
      roles: ["government", "admin"],
      badge: "Admin",
    },
    {
      name: "Reports & Export",
      href: "/reports",
      icon: FileText,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const visibleNav = navigation.filter(
    (item) => !item.roles || item.roles.includes(currentRole)
  );

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/90 gap-3 bg-slate-950/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-950/50 font-bold flex-shrink-0 ring-1 ring-white/10">
          <Shield className="w-5 h-5 text-indigo-50" />
        </div>
        <div className="overflow-hidden">
          <h1 className="font-bold text-sm tracking-tight text-white leading-tight flex items-center gap-1.5">
            Welfare System
          </h1>
          <p className="text-[10px] text-indigo-300/80 font-medium truncate">
            AI Resource &amp; Health Mgmt
          </p>
        </div>
      </div>

      {/* Role Switcher for Development & Demonstration */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between mb-1.5">
          <span>Active Role</span>
          <span className="text-[9px] text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/70 font-semibold tracking-normal">
            Live Preview
          </span>
        </label>
        <select
          value={currentRole}
          onChange={(e) => switchRole(e.target.value as UserRole)}
          aria-label="Select active role"
          className="w-full bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-xs text-slate-100 font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner cursor-pointer transition-colors"
        >
          <option value="government">Government (Auditor / State)</option>
          <option value="institution">Institution (Superintendent)</option>
          <option value="doctor">Doctor (Medical Reviewer)</option>
          <option value="ngo">NGO (Coordinator)</option>
          <option value="donor">Donor (Philanthropist)</option>
          <option value="volunteer">Volunteer (Field Staff)</option>
        </select>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {visibleNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all group",
                isActive
                  ? "bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-950/40"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-mono font-medium",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Security & System Info Footer */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200 text-xs">
            RLS Security Active
          </span>
        </div>
        <p className="text-[10px] leading-tight text-slate-400">
          Orphanage &amp; Senior Care Platform
        </p>
      </div>
    </aside>
  );
}
