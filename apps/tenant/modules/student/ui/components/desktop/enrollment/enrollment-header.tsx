"use client";

import React from "react";
import { GraduationCap, Sparkles } from "lucide-react";

export const EnrollmentHeader = () => {
  return (
    <header className="relative flex flex-col gap-3 w-full animate-fade-in overflow-hidden">
      {/* Soft glow behind icon */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 -left-6 w-40 h-40 rounded-full bg-emerald-200/25 blur-3xl -z-10"
      />

      {/* Eyebrow */}
      <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.18em]">
        <Sparkles className="w-3 h-3" />
        New Registration
      </div>

      {/* Main row */}
      <div className="flex items-center gap-4">
        {/* Icon badge */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 duration-300">
            <GraduationCap className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
          {/* Corner sparkle dot */}
          <span
            aria-hidden
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-400 shadow-sm"
          />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight leading-tight">
            Student Enrollment
          </h1>
          {/* Underline accent */}
          <div className="mt-1 mb-1.5 h-0.5 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
          <p className="text-sm text-on-surface-variant font-medium leading-snug max-w-md">
            Register a new student with comprehensive institutional details
          </p>
        </div>
      </div>
    </header>
  );
};
