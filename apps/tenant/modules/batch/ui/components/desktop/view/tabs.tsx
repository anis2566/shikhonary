"use client";

import { cn } from "@workspace/ui/lib/utils";
import { TabMode } from "./index";

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
    <nav className="flex gap-10 border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative text-sm font-semibold pb-3 transition-colors",
            activeTab === tab.id
              ? "text-emerald-600 font-bold"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />
          )}
        </button>
      ))}
    </nav>
  );
};
