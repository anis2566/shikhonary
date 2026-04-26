"use client";

import { useState } from "react";
import { useStudentDetails } from "@workspace/api-client";
import { Header as DesktopHeader } from "../components/desktop/view/header";
import { Stats as DesktopStats } from "../components/desktop/view/stats";
import { Tabs as DesktopTabs, StudentTabMode } from "../components/desktop/view/tabs";
import { Overview as DesktopOverview } from "../components/desktop/view/overview";
import { Sidebar as DesktopSidebar } from "../components/desktop/view/sidebar";
import { StudentViewMobile } from "../components/mobile/view";

interface StudentViewProps {
  id: string;
}

export const StudentView = ({ id }: StudentViewProps) => {
  const [activeTab, setActiveTab] = useState<StudentTabMode>("overview");

  const { data: student } = useStudentDetails(id);

  if (!student) return null;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block min-h-screen bg-[#F8FAFC]">
        <DesktopHeader student={student} />

        <main className="max-w-[1440px] mx-auto px-8 pt-4 pb-12 space-y-8">
          <DesktopStats student={student} />

          <DesktopTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {activeTab === "overview" && (
              <>
                <div className="lg:col-span-8 space-y-8">
                  <DesktopOverview student={student} />
                </div>
                <div className="lg:col-span-4 space-y-8">
                  <DesktopSidebar student={student} />
                </div>
              </>
            )}

            {activeTab !== "overview" && (
              <div className="lg:col-span-12">
                <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
                  <p className="text-slate-500 font-medium tracking-tight">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} implementation coming soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <StudentViewMobile
          student={student}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </>
  );
};
