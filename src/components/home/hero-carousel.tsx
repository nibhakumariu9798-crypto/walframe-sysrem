"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AIWelfareLogo } from "./ai-welfare-logo";

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#eef9f9] via-[#f7fbff] to-[#f0f9ff] py-8 sm:py-12 lg:py-16 border-b border-slate-100">
      
      {/* Organic Curved Wave Accents (Bottom Left & Top Right) */}
      <div className="absolute -bottom-10 -left-10 w-96 h-96 pointer-events-none opacity-90 select-none">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Mint Green Wave */}
          <path
            d="M-50 220C50 180 180 260 220 380C160 420 50 400 -50 400Z"
            fill="#a7f3d0"
            fillOpacity="0.45"
          />
          {/* Golden Yellow / Orange Wave */}
          <path
            d="M-80 270C30 240 140 300 170 420C100 440 0 420 -80 420Z"
            fill="#fde047"
            fillOpacity="0.45"
          />
          {/* Soft Teal Leaf Motifs */}
          <path
            d="M80 150C95 120 120 110 135 125C150 140 140 165 110 180C95 165 80 150 80 150Z"
            fill="#5eead4"
            fillOpacity="0.35"
          />
          <path
            d="M130 90C140 70 160 65 170 75C180 85 175 105 155 115C145 105 130 90 130 90Z"
            fill="#6ee7b7"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Brand Lockup & Quotation */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left space-y-6 lg:pr-6">
            
            {/* Main AI Welfare Lockup */}
            <div className="mx-auto lg:mx-0 max-w-lg">
              <AIWelfareLogo size="lg" />
            </div>

            {/* Quotation text matching reference image */}
            <div className="pt-2">
              <p className="font-serif italic text-xl sm:text-2xl lg:text-[26px] text-[#0f3b7d] font-semibold leading-snug tracking-tight">
                “Empowering lives with the right resources, support and care.”
              </p>
            </div>

          </div>

          {/* Right Column: High Quality Photograph with Pink Heart Outline */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl shadow-sky-900/10 border-4 border-white/90 bg-white">
              
              {/* Background floating heart outline matching image */}
              <div className="absolute top-4 right-8 z-20 pointer-events-none opacity-85">
                <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M50 88C50 88 15 62 15 36C15 22 25 12 39 12C45 12 50 16 50 16C50 16 55 12 61 12C75 12 85 22 85 36C85 62 50 88 50 88Z"
                    stroke="#f472b6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Multi-generational Welfare Photo */}
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/images/ai-welfare-hero.jpg"
                  alt="Young Indian girl happily hugging her grandmother alongside a caring healthcare nurse supporting an elderly grandfather"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 650px"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-8 sm:pt-10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] ring-2 ring-[#0284c7]/30 transition-all cursor-pointer" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors cursor-pointer" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors cursor-pointer" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors cursor-pointer" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors cursor-pointer" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Carousel Left / Right Arrows */}
      <button
        type="button"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20 cursor-pointer shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20 cursor-pointer shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

    </section>
  );
}
