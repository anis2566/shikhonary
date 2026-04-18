"use client";

import React from "react";
import { Files, CheckCircle, PauseCircle, GraduationCap } from "lucide-react";

export function BatchStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-[#f8f9ff]/80 backdrop-blur-md border border-emerald-500/10 p-6 rounded-[12px] shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <Files className="size-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Batches</p>
          <p className="text-2xl font-extrabold text-on-surface">24</p>
        </div>
      </div>
      <div className="bg-[#f8f9ff]/80 backdrop-blur-md border border-emerald-500/10 p-6 rounded-[12px] shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-700">
          <CheckCircle className="size-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Batches</p>
          <p className="text-2xl font-extrabold text-on-surface">18</p>
        </div>
      </div>
      <div className="bg-[#f8f9ff]/80 backdrop-blur-md border border-emerald-500/10 p-6 rounded-[12px] shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-600">
          <PauseCircle className="size-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Inactive Batches</p>
          <p className="text-2xl font-extrabold text-on-surface">06</p>
        </div>
      </div>
      <div className="bg-[#f8f9ff]/80 backdrop-blur-md border border-emerald-500/10 p-6 rounded-[12px] shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700">
          <GraduationCap className="size-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Students</p>
          <p className="text-2xl font-extrabold text-on-surface">1,240</p>
        </div>
      </div>
    </section>
  );
}
