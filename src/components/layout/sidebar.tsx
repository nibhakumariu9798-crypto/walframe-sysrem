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
  badgeColor?: string;
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
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    },
    {
      name: "AI Predictions",
      href: "/predictions",
      icon: Sparkles,
      badge: "ML/DL",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    },
    {
      name: "Research Workspace",
      href: "/research",
      icon: Microscope,
      roles: ["government", "admin"],
      badge: "Admin",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
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
    <aside className="w-64 bg-white text-slate-700 flex flex-col flex-shrink-0 border-r border-slate-200/90 select-none shadow-xs">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200/90 gap-3 bg-white">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-600/20 font-bold flex-shrink-0 ring-2 ring-sky-500/20">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="overflow-hidden">
          <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">
            Welfare System
          </h1>
          <p className="text-[10px] text-sky-700 font-bold truncate">
            AI Resource &amp; Health Mgmt
          </p>
        </div>
      </div>

      {/* Role Switcher for Development & Demonstration */}
      <div className="px-4 py-3 border-b border-slate-200/80 bg-slate-50/80">
        <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center justify-between mb-1.5">
          <span>Active Role</span>
          <span className="text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold tracking-normal">
            Live Preview
          </span>
        </label>
        <select
          value={currentRole}
          onChange={(e) => switchRole(e.target.value as UserRole)}
          aria-label="Select active role"
          className="w-full bg-white border border-slate-300 hover:border-slate-400 text-xs text-slate-900 font-semibold rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600 shadow-2xs cursor-pointer transition-colors"
        >
          <option value="government">Government (Auditor / State)</option>
          <option value="institution">Institution (Superintendent)</option>
          <option value="doctor">Doctor (Medical Reviewer)</option>
          <option value="ngo">NGO (Coordinator)</option>
          <option value="donor">Donor (Philanthropist)</option>
          <option value="volunteer">Volunteer (Field Staff)</option>
          <option value="admin">System Administrator</option>
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
                  ? "bg-sky-50 text-sky-900 font-bold border-l-4 border-sky-600 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-sky-700"
                      : "text-slate-400 group-hover:text-slate-700"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border",
                    item.badgeColor ||
                      (isActive
                        ? "bg-sky-100 text-sky-800 border-sky-200"
                        : "bg-slate-100 text-slate-600 border-slate-200")
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
      <div className="p-3.5 border-t border-slate-200/90 bg-slate-50/80 text-[11px] text-slate-600">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-900 text-xs">
            RLS Security Active
          </span>
        </div>
        <p className="text-[10px] leading-tight text-slate-500">
          Orphanage &amp; Senior Care Platform
        </p>
      </div>
    </aside>
  );
}
