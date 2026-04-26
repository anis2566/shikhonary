"use client";

import { Users, FileText, TrendingUp, PieChart } from "lucide-react";

interface StatsProps {
  stats: {
    totalStudents: number;
    inactiveStudents: number;
    totalExams: number;
  };
  capacity: number;
}

export const Stats = ({ stats, capacity }: StatsProps) => {
  const studentCount = stats.totalStudents;
  const capacityPercentage =
    capacity > 0 ? Math.round((studentCount / capacity) * 100) : 0;

  const statConfig = [
    {
      label: "Students",
      value: studentCount,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Exams",
      value: stats.totalExams,
      icon: FileText,
      color: "text-slate-600",
      bg: "bg-slate-50",
    },
    {
      label: "Avg. Score",
      value: "18%", // Placeholder as per design
      icon: TrendingUp,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      label: "Capacity",
      value: `${capacityPercentage}%`,
      icon: PieChart,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      isProgress: true,
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
            {item.isProgress && (
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};
