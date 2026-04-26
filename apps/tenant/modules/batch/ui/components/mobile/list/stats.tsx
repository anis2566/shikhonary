"use client";

import React from "react";
import { useBatchStats } from "@workspace/api-client";

export const Stats = () => {
  const { data: stats, isLoading } = useBatchStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-8 px-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 animate-pulse h-[84px]"
          >
            <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
            <div className="h-6 w-10 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 mb-8 px-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
          Total Batches
        </p>
        <p className="text-2xl font-black text-emerald-900">
          {stats?.total || 0}
        </p>
      </div>
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
        <p className="text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
          Active Now
        </p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-black text-emerald-900">
            {stats?.active || 0}
          </p>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
          Inactive
        </p>
        <p className="text-2xl font-black text-slate-400">
          {stats?.inactive?.toString().padStart(2, "0") || "00"}
        </p>
      </div>
      <div className="bg-emerald-900 p-4 rounded-xl shadow-sm">
        <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-wider mb-1">
          Total Students
        </p>
        <p className="text-2xl font-black text-white">
          {stats?.totalStudents.toLocaleString() || 0}
        </p>
      </div>
    </div>
  );
};
