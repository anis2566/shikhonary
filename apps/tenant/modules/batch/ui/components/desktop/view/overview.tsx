"use client";

import {
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";

interface BatchWithRelations extends TenantTypes.Batch {
  _count: {
    students: number;
  };
  academicYear: {
    name: string;
  };
}

interface OverviewProps {
  batch: BatchWithRelations;
}

export const Overview = ({ batch }: OverviewProps) => {
  const studentCount = batch._count?.students || 0;
  const capacity = batch.capacity || 0;
  const utilization =
    capacity > 0 ? Math.round((studentCount / capacity) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Batch Information Card */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_30px_-5px_rgba(0,0,0,0.03)] p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Batch Information
          </h2>
          <span
            className={cn(
              "ring-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.05em]",
              batch.isActive
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200/50"
                : "bg-slate-50 text-slate-500 ring-slate-200/50",
            )}
          >
            {batch.isActive ? "Active Unit" : "Inactive Unit"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
          <InfoItem label="Batch Name" value={batch.name} />
          <InfoItem label="Class" value={batch.className || "Not Assigned"} />
          <InfoItem
            label="Academic Year"
            value={batch.academicYear?.name || "Not Assigned"}
          />
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Current Status
            </label>
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                  batch.isActive
                    ? "bg-emerald-500"
                    : "bg-slate-400 shadow-none",
                )}
              ></span>
              <p className="text-slate-900 font-semibold text-[15px]">
                {batch.isActive ? "Currently Active" : "Inactive"}
              </p>
            </div>
          </div>
          <InfoItem
            label="Current Enrollment"
            value={`${studentCount} Students`}
          />
          <InfoItem
            label="Institutional Limit"
            value={`${capacity} Students`}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 space-y-5">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-900">
                Capacity Utilization
              </span>
              <span className="text-[11px] text-slate-400 font-medium italic">
                {utilization >= 90
                  ? "Critically full"
                  : utilization >= 70
                    ? "Approaching full capacity"
                    : "Available space"}
              </span>
            </div>
            <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {studentCount} / {capacity}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-[2px]">
            <div
              className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${utilization}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <InfoIcon className="w-3.5 h-3.5 text-emerald-500" />
            {capacity - studentCount} vacancies remaining in this batch for the
            current academic session.
          </p>
        </div>
      </div>

      {/* Top Performers Card */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_30px_-5px_rgba(0,0,0,0.03)] p-8 border border-slate-100 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Top Performers
          </h2>
          <button className="text-emerald-600 text-xs font-bold hover:text-emerald-700 transition-colors hover:underline underline-offset-4">
            View Analytics
          </button>
        </div>
        <div className="space-y-2">
          {/* Static placeholders for now as per design */}
          <PerformerItem
            name="Rahim Ahmed"
            id="#1024-01"
            major="Science"
            score="94.8%"
            rank="01"
            initial="RA"
            color="emerald"
            premium
          />
          <PerformerItem
            name="Fatima Begum"
            id="#1024-05"
            major="Humanities"
            score="89.2%"
            rank="02"
            initial="FB"
            color="blue"
            premium={false}
          />
          <PerformerItem
            name="Nusrat Jahan"
            id="#1024-08"
            major="Commerce"
            score="87.5%"
            rank="03"
            initial="NJ"
            color="purple"
            premium={false}
          />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {label}
    </label>
    <p className="text-slate-900 font-semibold text-[15px]">{value}</p>
  </div>
);

interface PerformerItemProps {
  name: string;
  id: string;
  major: string;
  score: string;
  rank: string;
  initial: string;
  color: string;
  premium: boolean;
}

const PerformerItem = ({
  name,
  id,
  major,
  score,
  rank,
  initial,
  color,
  premium,
}: PerformerItemProps) => {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-emerald-50/40 transition-all group border border-transparent hover:border-emerald-100/50 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ring-4 ring-white shadow-sm transition-transform group-hover:scale-105",
              colorMap[color],
            )}
          >
            {initial}
          </div>
          {premium && (
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white rounded-lg shadow-sm flex items-center justify-center ring-1 ring-slate-100">
              <span className="text-[12px]">⭐</span>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            {name}
          </h4>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            ID: {id} • {major}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="block text-[15px] font-black text-slate-900">
            {score}
          </span>
          <span
            className={cn(
              "block text-[9px] font-bold uppercase tracking-tighter",
              `text-${color}-600`,
            )}
          >
            Rank {rank}
          </span>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:text-emerald-300 transition-colors" />
      </div>
    </div>
  );
};
