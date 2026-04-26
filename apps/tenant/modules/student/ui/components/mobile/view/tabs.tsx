"use client";

import { cn } from "@workspace/ui/lib/utils";
import { StudentTabMode } from "../../desktop/view/tabs";

interface TabsProps {
  activeTab: StudentTabMode;
  onTabChange: (tab: StudentTabMode) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs: { id: StudentTabMode; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "attendance", label: "Attendance" },
    { id: "exams", label: "Exams" },
    { id: "fees", label: "Fees" },
  ];

  return (
    <div className="fixed top-16 w-full z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100 overflow-x-auto no-scrollbar">
      <nav className="flex px-4 h-12 w-full max-w-md mx-auto gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative text-[13px] font-bold h-full whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "text-emerald-600"
                : "text-slate-400"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
