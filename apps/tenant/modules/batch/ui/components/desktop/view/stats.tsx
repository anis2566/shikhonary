"use client";

import { Users, UserX, FileText, PieChart } from "lucide-react";

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

  // Dynamic colors for the progress bar
  const getStatusColor = (percent: number) => {
    if (percent >= 90) return "from-rose-500 to-red-400";
    if (percent >= 70) return "from-amber-500 to-orange-400";
    return "from-emerald-500 to-teal-400";
  };

  const statConfig = [
    {
      label: "Total Students",
      value: studentCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Inactive",
      value: stats.inactiveStudents,
      icon: UserX,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Total Exams",
      value: stats.totalExams,
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statConfig.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 bg-red-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                {item.label}
              </span>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {item.value.toLocaleString()}
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

      {/* Capacity Card */}
      <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
        <div className="flex flex-col h-full justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Capacity
              </span>
              <span className="text-3xl font-black text-slate-900">
                {capacityPercentage}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
              <PieChart size={24} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getStatusColor(capacityPercentage)}`}
                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
