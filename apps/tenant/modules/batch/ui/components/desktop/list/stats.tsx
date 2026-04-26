"use client";

import { useBatchStats } from "@workspace/api-client";
import {
  FolderIcon,
  CheckCircle,
  PauseCircle,
  GraduationCap,
} from "lucide-react";

export function Stats() {
  const { data: stats } = useBatchStats();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<FolderIcon className="w-6 h-6" />}
        label="Total Batches"
        value={stats?.total.toString() ?? "0"}
        iconBgClass="bg-emerald-500/10"
        iconTextClass="text-emerald-600"
      />
      <StatCard
        icon={<CheckCircle className="w-6 h-6" />}
        label="Active Batches"
        value={stats?.active.toString() ?? "0"}
        iconBgClass="bg-emerald-500/20"
        iconTextClass="text-emerald-700"
      />
      <StatCard
        icon={<PauseCircle className="w-6 h-6" />}
        label="Inactive Batches"
        value={stats?.inactive.toString() ?? "0"}
        iconBgClass="bg-slate-200/50"
        iconTextClass="text-slate-600"
      />
      <StatCard
        icon={<GraduationCap className="w-6 h-6" />}
        label="Total Students"
        value={stats?.totalStudents.toLocaleString() ?? "0"}
        iconBgClass="bg-emerald-600/10"
        iconTextClass="text-emerald-700"
      />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  iconBgClass,
  iconTextClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBgClass: string;
  iconTextClass: string;
}) {
  return (
    <div className="bg-[#f8f9ff]/80 backdrop-blur-[16px] border border-emerald-500/10 p-6 rounded-[12px] shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] flex items-center gap-5">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgClass} ${iconTextClass}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-[#0b1c30]">{value}</p>
      </div>
    </div>
  );
}
