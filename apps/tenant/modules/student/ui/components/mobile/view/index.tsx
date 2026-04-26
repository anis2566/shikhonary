"use client";

import { StudentTabMode } from "../../desktop/view/tabs";
import { Header } from "./header";
import { Tabs } from "./tabs";
import { Stats } from "./stats";
import { InfoSection } from "./info-section";
import { TenantTypes } from "@workspace/db";

interface StudentWithRelations extends TenantTypes.Student {
  batch?: { name: string } | null;
  academicYear?: { name: string };
}

interface StudentViewMobileProps {
  student: StudentWithRelations;
  activeTab: StudentTabMode;
  onTabChange: (tab: StudentTabMode) => void;
}

export const StudentViewMobile = ({
  student,
  activeTab,
  onTabChange,
}: StudentViewMobileProps) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 pt-28">
      <Header student={student} />
      <Tabs activeTab={activeTab} onTabChange={onTabChange} />

      <main className="px-4 max-w-md mx-auto space-y-6">
        {activeTab === "overview" && (
          <>
            <Stats student={student} />
            <InfoSection student={student} />
            
            {/* Quick Note Card */}
            <div className="bg-emerald-600 rounded-2xl p-6 shadow-lg shadow-emerald-200/50 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="font-bold text-lg mb-1">Fee Status</h4>
                 <p className="text-emerald-100 text-xs font-medium opacity-90">All dues cleared for April 2024</p>
                 <button className="mt-4 bg-white text-emerald-600 text-[10px] font-bold px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">
                   View History
                 </button>
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </>
        )}

        {activeTab !== "overview" && (
          <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-slate-400 font-bold">...</span>
            </div>
            <p className="text-slate-900 font-bold tracking-tight">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </p>
            <p className="text-slate-500 text-xs mt-2 font-medium">
              We are working on bringing detailed {activeTab} tracking to the mobile view.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
