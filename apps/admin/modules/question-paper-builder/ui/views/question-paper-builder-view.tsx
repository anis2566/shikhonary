"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { PaperPreview } from "../components/paper-preview";
import { BuilderProvider, useBuilder } from "../components/builder/builder-context";
import { BuilderHeader } from "../components/builder/builder-header";
import { BuilderSidebar } from "../components/builder/builder-sidebar";
import { BuilderCanvasToolbar } from "../components/builder/builder-canvas-toolbar";
import { BuilderDialogs } from "../components/builder/builder-dialogs";
import { useBuilderShortcuts } from "../components/builder/use-builder-shortcuts";

interface QuestionPaperBuilderViewProps {
  paperId: string;
}

const BuilderInner: React.FC = () => {
  const {
    paper,
    isLoading,
    settings,
    handleSettingsChange,
    processedQuestions,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleReorderQuestions,
    isEditing,
    zoom,
  } = useBuilder();

  // Initialize keyboard shortcuts
  useBuilderShortcuts();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary stroke-[3]" />
          <p className="font-bold text-muted-foreground animate-pulse">
            Loading Paper Builder...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-muted/30 flex flex-col overflow-hidden">
      <BuilderHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <BuilderCanvasToolbar />

          <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-muted/20 pattern-grid">
            <PaperPreview
              questions={processedQuestions}
              subjects={paper?.subjects}
              settings={settings}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onSettingsChange={handleSettingsChange}
              onReorderQuestions={handleReorderQuestions}
              onDuplicateQuestion={() => {}}
              isEditing={isEditing}
              zoom={zoom}
            />
          </div>
        </div>

        <BuilderSidebar />
      </div>

      <BuilderDialogs />
    </div>
  );
};

export const QuestionPaperBuilderView: React.FC<QuestionPaperBuilderViewProps> = ({ paperId }) => {
  return (
    <BuilderProvider paperId={paperId}>
      <BuilderInner />
    </BuilderProvider>
  );
};
