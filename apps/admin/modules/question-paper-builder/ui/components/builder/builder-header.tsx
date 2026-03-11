"use client";

import React from "react";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Eye, 
  Loader2, 
  Layout, 
  Library, 
  Check, 
  ListOrdered, 
  ChevronDown 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Toggle } from "@workspace/ui/components/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import { useBuilder } from "./builder-context";
import { useUpdateQuestionPaper } from "@workspace/api-client";

export const BuilderHeader: React.FC = () => {
  const router = useRouter();
  const { 
    paperId, 
    paper, 
    settings, 
    questions, 
    processedQuestions,
    isEditing, 
    setIsEditing, 
    sidebarTab, 
    setSidebarTab,
    saveStatus,
    hasUnsavedChanges,
    handleGlobalSave,
    setSheetOpen
  } = useBuilder();

  const { mutate: updateQuestionPaper } = useUpdateQuestionPaper();

  return (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b shadow-soft px-4 py-3">
      <div className="flex items-center justify-between gap-4 max-w-[1800px] mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/question-papers")}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              {paper?.title}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 rounded-lg gap-1 border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        paper?.status === "Published"
                          ? "text-emerald-600"
                          : "text-muted-foreground",
                      )}
                    >
                      {paper?.status}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-xl font-bold">
                  <DropdownMenuItem
                    onClick={() => updateQuestionPaper({ id: paperId, data: { status: "Draft" } })}
                    className={cn(paper?.status === "Draft" && "bg-muted")}
                  >
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateQuestionPaper({ id: paperId, data: { status: "Published" } })}
                    className={cn(paper?.status === "Published" && "bg-muted text-emerald-600")}
                  >
                    Published
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {saveStatus === "saving" && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 animate-in fade-in duration-300">
                  <Check className="h-3 w-3" />
                  Saved
                </span>
              )}
            </h1>
            <p className="text-xs text-muted-foreground font-semibold">
              {paper?.subjectName} — {questions.length} Questions · {settings.totalMarks} Marks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex bg-muted/50 p-1 rounded-xl items-center border border-border/50">
            <Button
              variant={sidebarTab === "settings" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSidebarTab("settings")}
              className="h-8 rounded-lg font-bold text-xs gap-1.5"
            >
              <Layout className="h-3.5 w-3.5" />
              Layout
            </Button>
            <Button
              variant={sidebarTab === "picker" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSidebarTab("picker")}
              className="h-8 rounded-lg font-bold text-xs gap-1.5"
            >
              <Library className="h-3.5 w-3.5" />
              Picker
            </Button>
            <Button
              variant={sidebarTab === "reorder" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSidebarTab("reorder")}
              className="h-8 rounded-lg font-bold text-xs gap-1.5"
              disabled={processedQuestions.length === 0}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              Order
            </Button>
          </div>

          <Toggle
            pressed={isEditing}
            onPressedChange={setIsEditing}
            className="gap-2 h-9 px-3 rounded-xl border border-border/50 font-bold text-xs data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
          >
            {isEditing ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden lg:inline">{isEditing ? "Editing Mode" : "Preview Mode"}</span>
          </Toggle>

          <Button
            size="sm"
            variant={hasUnsavedChanges ? "default" : "outline"}
            onClick={handleGlobalSave}
            disabled={saveStatus === "saving"}
            className={cn(
              "h-9 px-4 rounded-xl font-bold text-xs transition-all",
              hasUnsavedChanges && "shadow-glow bg-emerald-600 hover:bg-emerald-700 text-white border-0",
              !hasUnsavedChanges && "border-border/50",
            )}
          >
            {saveStatus === "saving" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            {hasUnsavedChanges ? "Save Changes" : "Saved"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSidebarTab("picker");
              setSheetOpen(true);
            }}
            className="h-9 px-4 rounded-xl border-border/50 font-bold text-xs shadow-soft"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Question</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
