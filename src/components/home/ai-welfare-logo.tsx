"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AIWelfareLogo({ className = "", size = "md" }: LogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const pxSize = isSm ? 40 : isLg ? 80 : 56;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem SVG */}
      <div className={`flex-shrink-0 ${isSm ? "w-10 h-10" : isLg ? "w-20 h-20" : "w-14 h-14"}`} style={{ width: `${pxSize}px`, height: `${pxSize}px` }}>
        <svg
          width={pxSize}
          height={pxSize}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: `${pxSize}px`, height: `${pxSize}px`, maxWidth: `${pxSize}px` }}
          className="w-full h-full drop-shadow-xs"
        >
          {/* House Roof in Blue */}
          <path
            d="M80 18L138 68H122L80 32L38 68H22L80 18Z"
            fill="#0369a1"
          />
          {/* Stylized Chimney / Detail */}
          <path d="M110 32V48L120 56V32H110Z" fill="#0284c7" />

          {/* Child Figure (Blue) */}
          <circle cx="58" cy="74" r="9" fill="#0284c7" />
          <path
            d="M48 102C48 91 52 87 62 87C68 87 72 91 72 102"
            fill="#0284c7"
          />

          {/* Elderly / Adult Figure (Orange) */}
          <circle cx="102" cy="72" r="9" fill="#f97316" />
          <path
            d="M88 102C88 89 94 85 104 85C114 85 120 89 120 102"
            fill="#f97316"
          />

          {/* Red Heart in Center */}
          <path
            d="M80 84C77.5 80 72 79 69 82C65.5 85.5 66 90.5 80 100C94 90.5 94.5 85.5 91 82C88 79 82.5 80 80 84Z"
            fill="#ef4444"
          />

          {/* Cradling Green Hands (Left and Right) */}
          {/* Left Hand */}
          <path
            d="M32 110C35 125 55 142 80 144C65 138 52 126 48 114C45 106 36 100 32 110Z"
            fill="#15803d"
          />
          <path
            d="M26 102C28 116 44 135 72 143C56 135 44 122 40 108C38 98 28 92 26 102Z"
            fill="#16a34a"
          />
          {/* Right Hand */}
          <path
            d="M128 110C125 125 105 142 80 144C95 138 108 126 112 114C115 106 124 100 128 110Z"
            fill="#15803d"
          />
          <path
            d="M134 102C132 116 116 135 88 143C104 135 116 122 120 108C122 98 132 92 134 102Z"
            fill="#16a34a"
          />
        </svg>
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline leading-none">
          <span className={`font-black tracking-tight text-emerald-600 ${isSm ? "text-lg" : isLg ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
            AI
          </span>
          <span className={`font-black tracking-tight text-[#0f3b7d] ml-1.5 ${isSm ? "text-lg" : isLg ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
            WELFARE
          </span>
        </div>

        <span className={`font-bold tracking-tight text-[#0284c7] mt-0.5 ${isSm ? "text-[10px]" : isLg ? "text-base sm:text-lg" : "text-xs sm:text-sm"}`}>
          Resource &amp; Support System
        </span>

        <div className={`flex items-center gap-1.5 font-medium text-slate-600 mt-1 ${isSm ? "text-[8px]" : isLg ? "text-xs" : "text-[10px]"}`}>
          <span className="text-[#0f3b7d] font-semibold">For Orphanages</span>
          <span className="text-slate-400">|</span>
          <span className="text-[#0f3b7d] font-semibold">For Old Age Homes</span>
          <span className="text-slate-400">|</span>
          <span className="text-teal-700 font-semibold">For a Better Tomorrow</span>
        </div>
      </div>
    </div>
  );
}
