"use client";

import { FileText, Calendar, Wallet, Trophy } from "lucide-react";

interface StatsProps {
  student: any; // Using any for now to handle potential stats
}

export const Stats = ({ student }: StatsProps) => {
  const statConfig = [
    {
      label: "Attendance",
      value: student.stats?.attendancePercentage || "0%",
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Exams Attended",
      value: student.stats?.totalExams || 0,
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Average Score",
      value: student.stats?.averageScore || "0%",
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Fee Status",
      value: "Paid",
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statConfig.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                {item.label}
              </span>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {item.value}
              </span>
            </div>
            <div
              className={`p-3 rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}
            >
              <item.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};
