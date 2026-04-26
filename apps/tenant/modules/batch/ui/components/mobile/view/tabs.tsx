"use client";

import { cn } from "@workspace/ui/lib/utils";
import { TabMode } from "../../../views/batch-view";

interface TabsProps {
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs: { id: TabMode; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "students", label: "Students" },
    { id: "exams", label: "Exams" },
  ];

  return (
    <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <nav className="flex max-w-md mx-auto px-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 relative py-4 text-center text-[13px] font-bold tracking-tight transition-all active:scale-95 whitespace-nowrap px-6",
              activeTab === tab.id
                ? "text-emerald-700"
                : "text-slate-400 font-semibold"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full mx-6" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
