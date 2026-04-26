"use client";

import { Calendar, FileText, TrendingUp, Clock } from "lucide-react";

interface StatsProps {
  student: any;
}

export const Stats = ({ student }: StatsProps) => {
  const statConfig = [
    {
      label: "Attendance",
      value: "92%",
      icon: Clock,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Exams",
      value: "12",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg. Score",
      value: "84.5",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Rank",
      value: "12th",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {statConfig.map((item, idx) => (
        <div
          key={idx}
          className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,108,73,0.05)] flex flex-col justify-between h-28 border border-slate-100/50"
        >
          <div className="flex justify-between items-start">
            <item.icon size={20} className={item.color} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
              {item.label}
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};
