"use client";

import { Award, Clock } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";

interface SidebarProps {
  student: TenantTypes.Student;
}

export const Sidebar = ({ student }: SidebarProps) => {
  return (
    <div className="space-y-8">
      {/* Recent Performance */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100 flex flex-col gap-6">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Recent Performance
        </h2>

        <div className="space-y-4">
          <PerformanceItem
            title="Physics Quiz 03"
            date="2 days ago"
            score="18/20"
            percentage="90%"
            status="Excellent"
            color="emerald"
          />
          <PerformanceItem
            title="Math Monthly Test"
            date="1 week ago"
            score="75/100"
            percentage="75%"
            status="Good"
            color="blue"
          />
        </div>

        <button className="text-emerald-600 text-xs font-bold hover:underline underline-offset-4 flex items-center justify-center gap-2 py-2">
          View All Results
        </button>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100 space-y-6">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <Clock className="w-4 h-4 text-slate-400 mb-2" />
            <span className="block text-sm font-bold text-slate-900">92%</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              Attendance
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <Award className="w-4 h-4 text-slate-400 mb-2" />
            <span className="block text-sm font-bold text-slate-900">12th</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              Batch Rank
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceItem = ({
  title,
  date,
  score,
  percentage,
  status,
  color,
}: any) => {
  const colorMap: any = {
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50",
  };

  return (
    <div className="p-4 rounded-xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <span className="text-[10px] font-bold text-slate-400">{date}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-slate-600">
          {score} ({percentage})
        </span>
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
            colorMap[color],
          )}
        >
          {status}
        </span>
      </div>
    </div>
  );
};
