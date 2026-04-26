"use client";

import { TabMode } from "../../../views/batch-view";
import { Header } from "./header";
import { Tabs } from "./tabs";
import { Stats } from "./stats";
import { InfoSection } from "./info-section";
import { RecentExams } from "./recent-exams";
import { TopPerformers } from "./top-performers";
import { TenantTypes } from "@workspace/db";

interface BatchWithRelations extends TenantTypes.Batch {
  stats: {
    totalStudents: number;
    inactiveStudents: number;
    totalExams: number;
  };
}

interface BatchViewMobileProps {
  batch: BatchWithRelations;
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
}

export const BatchViewMobile = ({
  batch,
  activeTab,
  onTabChange,
}: BatchViewMobileProps) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 pt-16">
      <Header batch={batch} />
      <Tabs activeTab={activeTab} onTabChange={onTabChange} />

      <main className="pt-6 px-4 max-w-md mx-auto space-y-6">
        {activeTab === "overview" && (
          <>
            <Stats stats={batch.stats} capacity={batch.capacity} />
            <InfoSection batch={batch} studentCount={batch.stats.totalStudents} />
            <RecentExams />
            <TopPerformers />
          </>
        )}

        {activeTab === "students" && (
          <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
             <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold">List</span>
             </div>
            <p className="text-slate-900 font-bold tracking-tight">
              Student list view incoming
            </p>
            <p className="text-slate-500 text-xs mt-2 font-medium">
              We are preparing the student management interface for this batch.
            </p>
          </div>
        )}

        {activeTab === "exams" && (
          <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
             <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 font-bold">Exam</span>
             </div>
            <p className="text-slate-900 font-bold tracking-tight">
              Examination history incoming
            </p>
            <p className="text-slate-500 text-xs mt-2 font-medium">
              Detailed tracking of all assessments and grades for this unit.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
