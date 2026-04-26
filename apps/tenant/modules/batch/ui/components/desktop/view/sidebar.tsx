"use client";

import { PlusCircle, Users, ArrowRight } from "lucide-react";
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

interface SidebarProps {
  batch: BatchWithRelations;
}

export const Sidebar = ({ batch }: SidebarProps) => {
  return (
    <div className="space-y-8">
      {/* Recent Assessments Card */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_30px_-5px_rgba(0,0,0,0.03)] p-8 border border-slate-100 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Recent Exams
          </h2>
          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all ring-1 ring-transparent hover:ring-emerald-100">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <AssessmentItem
            subject="Physics"
            title="Weekly Test - Physics Chapter 1"
            time="2 DAYS AGO"
            attended="25/30"
            average="72%"
            color="emerald"
          />
          <AssessmentItem
            subject="Mathematics"
            title="Monthly Assessment - Pure Maths"
            time="5 DAYS AGO"
            attended="24/30"
            average="65%"
            color="blue"
          />
        </div>

        <button className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-all flex items-center justify-center gap-2 group">
          View Examination History
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const AssessmentItem = ({
  subject,
  title,
  time,
  attended,
  average,
  color,
}: any) => {
  const colorMap: any = {
    emerald: "text-emerald-600 bg-emerald-50 hover:border-emerald-200",
    blue: "text-blue-600 bg-blue-50 hover:border-blue-200",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-[#FBFDFF] hover:bg-white border border-slate-100 transition-all cursor-pointer group shadow-sm hover:shadow-md",
        colorMap[color],
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={cn(
            "text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-[0.08em]",
            color === "emerald"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-blue-50 text-blue-600",
          )}
        >
          {subject}
        </span>
        <span className="text-[10px] font-bold text-slate-400">{time}</span>
      </div>
      <h3 className="text-[15px] font-bold text-slate-900 mb-6 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
          <Users className="w-4 h-4" />
          <span className="text-[12px] font-bold">
            {attended}{" "}
            <span className="font-medium text-slate-400 ml-1">Attended</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            Average
          </span>
          <span className="text-[14px] font-black text-slate-900">
            {average}
          </span>
        </div>
      </div>
    </div>
  );
};
