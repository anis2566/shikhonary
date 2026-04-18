"use client";

import React from "react";
import { Files, CheckCircle, PauseCircle, GraduationCap } from "lucide-react";

export function BatchStats() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
      {/* Total Batches */}
      <div className="bg-surface-container-lowest md:bg-[#f8f9ff]/80 md:backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-[12px] shadow-sm md:shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] border border-outline-variant/10 md:border-emerald-500/10 flex flex-col md:flex-row md:items-center gap-1 md:gap-5">
        <div className="hidden md:flex w-12 h-12 rounded-full bg-emerald-500/10 items-center justify-center text-emerald-600">
          <Files className="size-6" />
        </div>
        <div>
          <p className="text-on-surface-variant md:text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-0">
            Total Batches
          </p>
          <p className="text-2xl font-black md:font-extrabold text-emerald-900 md:text-on-surface">24</p>
        </div>
      </div>

      {/* Active Batches */}
      <div className="bg-primary-container/10 md:bg-[#f8f9ff]/80 md:backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-[12px] border border-primary-container/20 md:border-emerald-500/10 shadow-none md:shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] flex flex-col md:flex-row md:items-center gap-1 md:gap-5">
        <div className="hidden md:flex w-12 h-12 rounded-full bg-emerald-500/20 items-center justify-center text-emerald-700">
          <CheckCircle className="size-6" />
        </div>
        <div>
          <p className="text-on-primary-container md:text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-0">
            Active Now
          </p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black md:font-extrabold text-on-primary-container md:text-on-surface">18</p>
            <span className="flex md:hidden h-2 w-2 rounded-full bg-primary-container animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Inactive Batches */}
      <div className="bg-surface-container-lowest md:bg-[#f8f9ff]/80 md:backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-[12px] shadow-sm md:shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] border border-outline-variant/10 md:border-emerald-500/10 flex flex-col md:flex-row md:items-center gap-1 md:gap-5">
        <div className="hidden md:flex w-12 h-12 rounded-full bg-slate-200/50 items-center justify-center text-slate-600">
          <PauseCircle className="size-6" />
        </div>
        <div>
          <p className="text-on-surface-variant md:text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-0">
            Inactive
          </p>
          <p className="text-2xl font-black md:font-extrabold text-slate-400 md:text-on-surface">06</p>
        </div>
      </div>

      {/* Total Students */}
      <div className="bg-emerald-900 md:bg-[#f8f9ff]/80 md:backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-[12px] shadow-sm md:shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] border border-transparent md:border-emerald-500/10 flex flex-col md:flex-row md:items-center gap-1 md:gap-5">
        <div className="hidden md:flex w-12 h-12 rounded-full bg-emerald-600/10 items-center justify-center text-emerald-700">
          <GraduationCap className="size-6" />
        </div>
        <div>
          <p className="text-emerald-100/60 md:text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-0">
            Total Students
          </p>
          <p className="text-2xl font-black md:font-extrabold text-white md:text-on-surface">1,240</p>
        </div>
      </div>
    </section>
  );
}
