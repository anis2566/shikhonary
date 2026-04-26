"use client";

import { useState } from "react";

import { useBatchDetails } from "@workspace/api-client";
import { Header as DesktopHeader } from "../components/desktop/view/header";
import { Stats as DesktopStats } from "../components/desktop/view/stats";
import { Tabs as DesktopTabs } from "../components/desktop/view/tabs";
import { Overview as DesktopOverview } from "../components/desktop/view/overview";
import { Sidebar as DesktopSidebar } from "../components/desktop/view/sidebar";
import { BatchViewMobile } from "../components/mobile/view";

interface BatchViewProps {
  id: string;
}

export type TabMode = "overview" | "students" | "exams";

export const BatchView = ({ id }: BatchViewProps) => {
  const [activeTab, setActiveTab] = useState<TabMode>("overview");

  const { data: batch } = useBatchDetails(id);

  if (!batch) return null;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block min-h-screen bg-[#F8FAFC]">
        <DesktopHeader batch={batch} />

        <main className="max-w-[1440px] mx-auto px-8 pt-4 pb-12 space-y-8">
          <DesktopStats stats={batch.stats} capacity={batch.capacity} />

          <DesktopTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {activeTab === "overview" && (
              <>
                <div className="lg:col-span-7 space-y-8">
                  <DesktopOverview batch={batch} />
                </div>
                <div className="lg:col-span-5 space-y-8">
                  <DesktopSidebar batch={batch} />
                </div>
              </>
            )}

            {activeTab === "students" && (
              <div className="lg:col-span-12">
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
                  <p className="text-slate-500 font-medium tracking-tight">
                    Student list view implementation coming soon.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "exams" && (
              <div className="lg:col-span-12">
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
                  <p className="text-slate-500 font-medium tracking-tight">
                    Examination history implementation coming soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <BatchViewMobile
          batch={batch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </>
  );
};
