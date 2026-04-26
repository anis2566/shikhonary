"use client";

import { ChevronRight, FileText, Beaker, Calculator } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

export const RecentExams = () => {
  // Static placeholders as per design
  const exams = [
    {
      id: 1,
      title: "Physics Weekly Test",
      submissions: "22/25",
      avg: "78%",
      icon: Beaker,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: 2,
      title: "Mathematics Monthly Assessment",
      submissions: "18/25",
      avg: "82%",
      icon: Calculator,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Recent Assessments
        </h2>
        <button className="text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-100/50 hover:bg-slate-50 transition-colors active:scale-[0.98] cursor-pointer"
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
              exam.bg,
              exam.color
            )}>
              <exam.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">
                {exam.title}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {exam.submissions} Submitted
                </span>
                <span className="text-[11px] text-emerald-600 font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {exam.avg} Avg
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        ))}
      </div>
    </section>
  );
};
