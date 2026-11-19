"use client";

import React from "react";
import Link from "next/link";
import { Users, HeartPulse, Shirt, HeartHandshake, ArrowRight } from "lucide-react";

interface FeatureCard {
  title: string;
  subtitle: string;
  href: string;
  bgCircleColor: string;
  icon: React.ElementType;
}

const cards: FeatureCard[] = [
  {
    title: "Food & Nutrition",
    subtitle: "Predict & Support",
    href: "/resources",
    bgCircleColor: "bg-[#22c55e]",
    icon: Users,
  },
  {
    title: "Health Monitoring",
    subtitle: "Better Health, Brighter Future",
    href: "/health",
    bgCircleColor: "bg-[#0284c7]",
    icon: HeartPulse,
  },
  {
    title: "Clothing & Essentials",
    subtitle: "For a Dignified Life",
    href: "/resources",
    bgCircleColor: "bg-[#f97316]",
    icon: Shirt,
  },
  {
    title: "Donations & Volunteering",
    subtitle: "Be the Change",
    href: "/donations",
    bgCircleColor: "bg-[#7c3aed]",
    icon: HeartHandshake,
  },
];

export function FeatureStrip() {
  return (
    <section className="relative -mt-6 sm:-mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="group bg-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-900/6 border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:translate-y-[-3px] hover:shadow-xl flex items-center gap-4 cursor-pointer"
            >
              {/* Large Colored Circle with White Icon */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${card.bgCircleColor} text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-xs" />
              </div>

              {/* Text Information */}
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-[15px] leading-snug group-hover:text-[#0284c7] transition-colors truncate">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  {card.subtitle}
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0284c7] group-hover:translate-x-1 transition-all flex-shrink-0 opacity-0 group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
