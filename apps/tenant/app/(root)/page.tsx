"use client";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { useAcademicYearStats } from "@workspace/api-client";

export default function Page() {
  const data = useAcademicYearStats();

  console.log(data);

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" subtitle="Welcome to your dashboard" />
    </div>
  );
}
