"use client";

import React from "react";
import { Settings, Library, ListOrdered } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { SettingsSidebar } from "../settings-sidebar";
import { McqPicker } from "../mcq-picker";
import { QuestionReorderList } from "../question-reorder-list";
import { useBuilderData, useBuilderUI, useBuilderActions, PQ } from "./builder-context";

export const BuilderSidebar: React.FC = () => {
  const { paperId, paper, settings, processedQuestions } = useBuilderData();
  const { sidebarTab, setSidebarTab, isExporting } = useBuilderUI();
  const {
    handleSettingsChange,
    handleReorderQuestions,
    handleExportPdf,
  } = useBuilderActions();

  const assignedMcqIds = (paper?.questions ?? [])
    .map((pq: PQ) => pq.mcqId)
    .filter((id): id is string => !!id);

  return (
    <div className="w-[380px] border-l bg-background hidden xl:flex flex-col shadow-xl z-10 relative h-full overflow-hidden">
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        <Tabs value={sidebarTab} onValueChange={(v) => setSidebarTab(v as "settings" | "picker" | "reorder")} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-10 bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="settings" className="rounded-lg font-bold text-xs gap-2">
              <Settings className="h-3.5 w-3.5" />
              Styles
            </TabsTrigger>
            <TabsTrigger value="picker" className="rounded-lg font-bold text-xs gap-2">
              <Library className="h-3.5 w-3.5" />
              Picker
            </TabsTrigger>
            <TabsTrigger value="reorder" className="rounded-lg font-bold text-xs gap-2">
              <ListOrdered className="h-3.5 w-3.5" />
              Order
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sidebarTab === "settings" && (
          <SettingsSidebar 
            settings={settings} 
            subjects={paper?.subjects}
            onSettingsChange={handleSettingsChange} 
            onExportPdf={handleExportPdf}
            isExporting={isExporting}
          />
        )}
        {sidebarTab === "picker" && (
          <McqPicker 
            paperId={paperId} 
            assignedMcqIds={assignedMcqIds} 
          />
        )}
        {sidebarTab === "reorder" && (
          <QuestionReorderList 
            questions={processedQuestions} 
            onReorder={handleReorderQuestions} 
          />
        )}
      </div>
    </div>
  );
};
