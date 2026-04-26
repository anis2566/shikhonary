"use client";

import React from "react";
import { useStudentStats } from "@workspace/api-client";
import { Users, UserCheck, UserMinus, Sparkles } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const STAT_CARDS = [
  {
    key: "total",
    label: "Total",
    icon: Users,
    style: "bg-white border border-slate-100",
    iconStyle: "bg-slate-50 text-slate-400",
    valueStyle: "text-slate-800",
    labelStyle: "text-slate-400",
  },
  {
    key: "active",
    label: "Active",
    icon: UserCheck,
    style: "bg-emerald-50 border border-emerald-100",
    iconStyle: "bg-emerald-100 text-emerald-500",
    valueStyle: "text-emerald-700",
    labelStyle: "text-emerald-500",
    pulse: true,
  },
  {
    key: "inactive",
    label: "Inactive",
    icon: UserMinus,
    style: "bg-white border border-slate-100",
    iconStyle: "bg-slate-50 text-slate-300",
    valueStyle: "text-slate-400",
    labelStyle: "text-slate-400",
  },
  {
    key: "newThisMonth",
    label: "This Month",
    icon: Sparkles,
    style: "bg-slate-900 border-transparent",
    iconStyle: "bg-white/10 text-white",
    valueStyle: "text-white",
    labelStyle: "text-white/50",
  },
] as const;

export const Stats = () => {
  const { data: stats, isLoading } = useStudentStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-6 px-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 p-4 h-[88px] animate-pulse"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-slate-100" />
              <div className="h-2.5 w-14 bg-slate-100 rounded-full" />
            </div>
            <div className="h-6 w-10 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  const values: Record<string, number> = {
    total: stats?.total ?? 0,
    active: stats?.active ?? 0,
    inactive: stats?.inactive ?? 0,
    newThisMonth: 0,
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-6 px-4">
      {STAT_CARDS.map(
        ({
          key,
          label,
          icon: Icon,
          style,
          iconStyle,
          valueStyle,
          labelStyle,
        }) => (
          <div
            key={key}
            className={cn(
              "relative rounded-2xl p-4 flex flex-col gap-2.5 overflow-hidden",
              style,
            )}
          >
            {/* Label + icon row */}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0",
                  iconStyle,
                )}
              >
                <Icon className="w-3 h-3" strokeWidth={2.5} />
              </div>
              <span
                className={cn(
                  "text-[9px] font-black uppercase tracking-[0.15em]",
                  labelStyle,
                )}
              >
                {label}
              </span>
              {/* Live pulse for active */}
              <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Value */}
            <p
              className={cn(
                "text-2xl font-black tabular-nums leading-none",
                valueStyle,
              )}
            >
              {key === "inactive"
                ? String(values[key]).padStart(2, "0")
                : values[key]?.toLocaleString()}
            </p>

            {/* Subtle corner decoration for dark card */}
            {key === "newThisMonth" && (
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/5"
              />
            )}
          </div>
        ),
      )}
    </div>
  );
};
