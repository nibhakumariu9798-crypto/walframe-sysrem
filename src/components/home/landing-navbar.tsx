"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X, ArrowRight, LogIn, UserPlus, HeartHandshake, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentProfile } = useRole();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-800 flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight flex items-center gap-1.5">
                Welfare System
              </span>
              <span className="block text-[11px] font-medium text-teal-700 tracking-wide uppercase">
                Orphanage &amp; Senior Care Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="text-teal-700 font-semibold hover:text-teal-800 transition-colors">
              Home
            </Link>
            <Link href="#about" className="hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#institutions" className="hover:text-slate-900 transition-colors">
              Institutions
            </Link>
            <Link href="#contact" className="hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 flex items-center gap-1.5 rounded-lg shadow-sm">
                  <LayoutDashboard className="w-4 h-4 text-teal-400" />
                  <span>Enter Dashboard ({currentProfile.full_name?.split(" ")[0] || "User"})</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold px-3 py-2 flex items-center gap-1.5">
                    <LogIn className="w-4 h-4 text-slate-500" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm shadow-teal-900/10 flex items-center gap-1.5 transition-all">
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200 shadow-lg">
          <nav className="flex flex-col gap-2.5 text-sm font-medium text-slate-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-teal-50 text-teal-800 font-semibold"
            >
              Home
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-slate-50"
            >
              About
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-slate-50"
            >
              Features
            </Link>
            <Link
              href="#institutions"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-slate-50"
            >
              Institutions
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-slate-50"
            >
              Contact
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5">
                  Enter Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs font-semibold py-2">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-2">
                    Register New Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
