"use client";

import { useBatchById } from "@workspace/api-client";
import { Header } from "./header";
import { Stats } from "./stats";
import { Tabs } from "./tabs";
import { Overview } from "./overview";
import { Sidebar } from "./sidebar";
import { useState } from "react";

interface BatchViewProps {
  id: string;
}

export type TabMode = "overview" | "students" | "exams";

export const BatchView = ({ id }: BatchViewProps) => {
  const { data: batch } = useBatchById(id);
  const [activeTab, setActiveTab] = useState<TabMode>("overview");

  if (!batch) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header batch={batch} />
      
      <main className="max-w-[1440px] mx-auto px-8 pt-24 pb-12 space-y-8">
        <Stats batch={batch} />
        
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {activeTab === "overview" && (
            <>
              <div className="lg:col-span-7 space-y-8">
                <Overview batch={batch} />
              </div>
              <div className="lg:col-span-5 space-y-8">
                <Sidebar batch={batch} />
              </div>
            </>
          )}
          
          {activeTab === "students" && (
            <div className="lg:col-span-12">
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
                <p className="text-slate-500 font-medium tracking-tight">Student list view implementation coming soon.</p>
              </div>
            </div>
          )}
          
          {activeTab === "exams" && (
            <div className="lg:col-span-12">
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
                <p className="text-slate-500 font-medium tracking-tight">Examination history implementation coming soon.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
