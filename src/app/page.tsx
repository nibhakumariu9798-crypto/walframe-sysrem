"use client";

import React from "react";
import { GovHeader } from "@/components/home/gov-header";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { FeatureStrip } from "@/components/home/feature-strip";
import { AboutSection } from "@/components/home/about-section";
import { FeaturesSection } from "@/components/home/features-section";
import { LandingFooter } from "@/components/home/landing-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* 1. Official Government Header & Blue Ribbon Navbar */}
      <GovHeader />

      {/* 2. Hero Carousel Banner with Brand Lockup & Indian Family Photo */}
      <main className="flex-1">
        <HeroCarousel />

        {/* 3. The Four Distinct Feature Cards (Food, Health, Clothing, Donations) */}
        <FeatureStrip />

        {/* 4. About System & Certified Institutions Directory */}
        <AboutSection />

        {/* 5. Deep Dive into System Capabilities (AI, Health, Logistics, RLS Security) */}
        <FeaturesSection />
      </main>

      {/* 6. Official Public Service Footer & State Helpline Desk */}
      <LandingFooter />
    </div>
  );
}
