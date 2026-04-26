"use client";

import { Info, Users } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";

interface InfoSectionProps {
  batch: TenantTypes.Batch;
  studentCount: number;
}

export const InfoSection = ({ batch, studentCount }: InfoSectionProps) => {
  const capacity = batch.capacity || 0;
  const utilization = capacity > 0 ? Math.round((studentCount / capacity) * 100) : 0;

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden border border-slate-100/50">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Info size={80} />
      </div>
      
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
        Batch Information
      </h2>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Batch Name
            </p>
            <p className="text-sm font-bold text-slate-900 mt-1">{batch.name}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Class
            </p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {batch.className || "Not Assigned"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Academic Year
            </p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {/* This might need proper resolution from props if not available on batch object সরাসরি */}
              { (batch as any).academicYear?.name || "2024 / 2025" }
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Status
            </p>
            <div className="mt-1">
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
                batch.isActive 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-slate-50 text-slate-500 border-slate-200"
              )}>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full mr-1.5",
                  batch.isActive ? "bg-emerald-500" : "bg-slate-400"
                )}></span>
                {batch.isActive ? "Currently Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-slate-50">
          <div className="flex justify-between items-end mb-2.5">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Enrollment
              </p>
              <p className="text-lg font-black text-slate-900">
                {studentCount} <span className="text-slate-400 font-bold ml-1 text-sm tracking-tight">/ {capacity} Students</span>
              </p>
            </div>
            <span className={cn(
              "text-xs font-black px-2 py-1 rounded-lg",
              utilization >= 90 ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"
            )}>
              {utilization}% Utilization
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                utilization >= 90 ? "bg-rose-500" : "bg-emerald-500"
              )}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
