"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, LogIn, UserCheck, Shield } from "lucide-react";
import { AIWelfareLogo } from "./ai-welfare-logo";
import { useRole } from "@/context/role-context";

export function GovHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isAuthenticated, currentProfile } = useRole();

  return (
    <header className="w-full bg-white border-b border-slate-200 select-none">
      {/* 1. TOP WHITE GOVERNMENT BRANDING BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: National Emblem & Ministry */}
        <div className="flex items-center gap-3">
          {/* Ashoka Lion Emblem Vector */}
          <div className="w-11 h-14 flex-shrink-0 flex items-center justify-center" style={{ width: "44px", height: "56px", minWidth: "44px" }}>
            <svg width="44" height="56" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "44px", height: "56px", maxWidth: "44px", maxHeight: "56px" }} className="w-11 h-14 text-slate-800 drop-shadow-xs">
              {/* Ashoka Lion Capital Graphic */}
              <circle cx="50" cy="20" r="10" stroke="currentColor" strokeWidth="4" />
              <path d="M30 40C30 30 40 25 50 25C60 25 70 30 70 40C70 55 50 62 50 62" stroke="currentColor" strokeWidth="4" />
              <path d="M22 45C22 35 32 32 38 32" stroke="currentColor" strokeWidth="3" />
              <path d="M78 45C78 35 68 32 62 32" stroke="currentColor" strokeWidth="3" />
              {/* Abacus Base */}
              <rect x="20" y="66" width="60" height="12" rx="2" fill="currentColor" />
              <circle cx="50" cy="72" r="4" fill="white" />
              <circle cx="34" cy="72" r="3" fill="white" />
              <circle cx="66" cy="72" r="3" fill="white" />
              {/* Bell Plinth */}
              <path d="M25 80L35 98H65L75 80H25Z" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.15" />
              <rect x="28" y="100" width="44" height="6" rx="1" fill="currentColor" />
              {/* Satyameva Jayate Devnagari stylized line */}
              <text x="50" y="122" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor" fontFamily="sans-serif">
                सत्यमेव जयते
              </text>
            </svg>
          </div>

          <div className="border-l border-slate-300 pl-3 leading-tight">
            <div className="font-bold text-slate-800 text-xs sm:text-sm tracking-wide">
              भारत सरकार
            </div>
            <div className="font-extrabold text-slate-900 text-xs sm:text-[13px] tracking-tight">
              Ministry of Women and Child Development
            </div>
            <div className="text-[11px] font-medium text-slate-600">
              Government of India
            </div>
          </div>
        </div>

        {/* Center: Main AI Welfare Brand Logo */}
        <div className="hidden lg:flex items-center justify-center">
          <AIWelfareLogo size="md" />
        </div>

        {/* Right: Inspirational Slogan & Digital India Logo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:block text-right">
            <p className="font-serif italic text-xs sm:text-[13px] text-[#0f3b7d] font-semibold leading-tight max-w-[210px]">
              “Together for Empathy, Care and a Stronger Society”
            </p>
          </div>

          {/* Digital India Official Logo */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <div className="w-10 h-10 flex-shrink-0" style={{ width: "40px", height: "40px" }}>
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "40px", height: "40px", maxWidth: "40px" }} className="w-10 h-10">
                {/* Spiral Swirl with Saffron, White, Green */}
                <circle cx="50" cy="50" r="44" stroke="#e2e8f0" strokeWidth="2" fill="white" />
                <path d="M50 16C31 16 16 31 16 50C16 69 31 84 50 84C62 84 73 78 80 68" stroke="#ff9933" strokeWidth="6" strokeLinecap="round" />
                <path d="M50 28C38 28 28 38 28 50C28 62 38 72 50 72C58 72 65 67 69 60" stroke="#000080" strokeWidth="4" strokeLinecap="round" />
                <path d="M50 38C43 38 38 43 38 50C38 57 43 62 50 62" stroke="#138808" strokeWidth="4" strokeLinecap="round" />
                <circle cx="50" cy="50" r="3" fill="#000080" />
              </svg>
            </div>
            <div className="leading-none text-left">
              <span className="font-black text-xs tracking-tight text-slate-900 block">
                Digital India
              </span>
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">
                Power To Empower
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. SOLID CERULEAN BLUE NAVIGATION RIBBON */}
      <nav className="w-full bg-[#0284c7] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11 text-xs sm:text-[13px] font-semibold">
          
          {/* Left Ribbon Links */}
          <div className="hidden md:flex items-center gap-6 sm:gap-7 h-full">
            <Link
              href="/"
              className="h-full flex items-center border-b-2 border-white text-white font-bold px-1 transition-all"
            >
              Home
            </Link>

            {/* About Us */}
            <div className="relative group h-full flex items-center">
              <Link href="#about" className="text-white/90 hover:text-white flex items-center gap-1 transition-colors">
                <span>About Us</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>

            {/* Services */}
            <div className="relative group h-full flex items-center">
              <Link href="#features" className="text-white/90 hover:text-white flex items-center gap-1 transition-colors">
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>

            {/* Schemes & Support */}
            <div className="relative group h-full flex items-center">
              <Link href="#institutions" className="text-white/90 hover:text-white flex items-center gap-1 transition-colors">
                <span>Schemes &amp; Support</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>

            {/* Resources */}
            <div className="relative group h-full flex items-center">
              <Link href="/resources" className="text-white/90 hover:text-white flex items-center gap-1 transition-colors">
                <span>Resources</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>

            {/* Gallery */}
            <Link href="#gallery" className="text-white/90 hover:text-white transition-colors">
              Gallery
            </Link>

            {/* Contact Us */}
            <Link href="#contact" className="text-white/90 hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Right Action: Login / Register OR Dashboard */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="bg-white text-[#0284c7] hover:bg-slate-100 font-bold px-3 py-1 rounded text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Dashboard ({currentProfile.full_name?.split(" ")[0] || "User"})</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1 text-white">
                <Link
                  href="/login"
                  className="hover:underline font-bold transition-all px-1.5 py-1"
                >
                  Login
                </Link>
                <span>/</span>
                <Link
                  href="/register"
                  className="hover:underline font-bold transition-all px-1.5 py-1"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0369a1] text-white px-4 py-3 space-y-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/20">
            Home
          </Link>
          <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/20">
            About Us
          </Link>
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/20">
            Services
          </Link>
          <Link href="#institutions" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/20">
            Schemes &amp; Support
          </Link>
          <Link href="/resources" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/20">
            Resources
          </Link>
          <Link href="#gallery" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/20">
            Gallery
          </Link>
          <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/20">
            Contact Us
          </Link>
          <div className="pt-2 flex items-center justify-between text-white/90">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="underline">
              Sign In
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="bg-white text-[#0284c7] px-3 py-1 rounded font-bold">
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
