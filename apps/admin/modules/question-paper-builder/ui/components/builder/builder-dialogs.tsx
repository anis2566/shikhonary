"use client";

import React from "react";
import {
  Keyboard,
  Check,
  Trash2,
  Layout,
  Library,
  ListOrdered,
  Settings,
} from "lucide-react";
import { Sheet, SheetContent } from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { McqPicker } from "../mcq-picker";
import { SettingsSidebar } from "../settings-sidebar";
import { QuestionReorderList } from "../question-reorder-list";
import { useBuilderData, useBuilderUI, useBuilderActions, PQ } from "./builder-context";

export const BuilderDialogs: React.FC = () => {
  const { paperId, paper, settings, processedQuestions } = useBuilderData();
  const {
    sheetOpen,
    setSheetOpen,
    deleteTarget,
    setDeleteTarget,
    showShortcuts,
    setShowShortcuts,
    sidebarTab,
    setSidebarTab,
    isExporting,
  } = useBuilderUI();
  const {
    confirmDeleteQuestion,
    handleSettingsChange,
    handleExportPdf,
    handleReorderQuestions,
  } = useBuilderActions();

  const assignedMcqIds = (paper?.questions ?? [])
    .map((pq: PQ) => pq.mcqId)
    .filter((id): id is string => !!id);

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-[380px] sm:w-[420px] p-0 xl:hidden"
        >
          <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
            <Button
              variant={sidebarTab === "settings" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSidebarTab("settings")}
              className="flex-1 h-9 rounded-lg font-bold text-xs gap-1.5"
            >
              <Layout className="h-3.5 w-3.5" />
              Layout
            </Button>
            <Button
              variant={sidebarTab === "picker" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSidebarTab("picker")}
              className="flex-1 h-9 rounded-lg font-bold text-xs gap-1.5"
            >
              <Library className="h-3.5 w-3.5" />
              Picker
            </Button>
            <Button
              variant={sidebarTab === "reorder" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSidebarTab("reorder")}
              className="flex-1 h-9 rounded-lg font-bold text-xs gap-1.5"
              disabled={processedQuestions.length === 0}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              Order
            </Button>
          </div>
          <div className="flex-1 overflow-auto h-[calc(100vh-52px)]">
            {sidebarTab === "settings" && (
              <SettingsSidebar
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onExportPdf={handleExportPdf}
                isExporting={isExporting}
              />
            )}
            {sidebarTab === "picker" && (
              <McqPicker paperId={paperId} assignedMcqIds={assignedMcqIds} />
            )}
            {sidebarTab === "reorder" && (
              <QuestionReorderList
                questions={processedQuestions}
                onReorder={handleReorderQuestions}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Button
        size="icon"
        className="xl:hidden fixed bottom-6 right-6 z-30 h-14 w-14 rounded-2xl shadow-glow"
        onClick={() => setSheetOpen(true)}
      >
        <Settings className="h-6 w-6" />
      </Button>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-black">
              <Trash2 className="h-5 w-5 text-destructive" />
              Remove Question?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span>
                This will remove the following question from your paper:
              </span>
              <span className="block p-3 bg-muted/50 rounded-xl text-sm font-medium text-foreground line-clamp-3 border">
                {deleteTarget?.question}
              </span>
              <span className="text-xs">
                The original MCQ will remain in your question bank.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteQuestion}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-bold"
            >
              Remove Question
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-black">
              <Keyboard className="h-5 w-5 text-primary" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">
                General
              </h4>
              <div className="space-y-2">
                <ShortcutRow
                  label="Toggle Edit/Preview Mode"
                  keys={["Ctrl", "E"]}
                />
                <ShortcutRow label="Export as PDF" keys={["Ctrl", "P"]} />
                <ShortcutRow label="Show Shortcuts Help" keys={["?"]} />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">
                Canvas Control
              </h4>
              <div className="space-y-2">
                <ShortcutRow label="Zoom In" keys={["Ctrl", "+"]} />
                <ShortcutRow label="Zoom Out" keys={["Ctrl", "-"]} />
                <ShortcutRow label="Fit to Screen" keys={["Ctrl", "0"]} />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">
                Sidebar Tabs
              </h4>
              <div className="space-y-2">
                <ShortcutRow label="Switch to Layout" keys={["Ctrl", "1"]} />
                <ShortcutRow
                  label="Switch to Question Bank"
                  keys={["Ctrl", "2"]}
                />
                <ShortcutRow label="Switch to Reorder" keys={["Ctrl", "3"]} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ShortcutRow = ({ label, keys }: { label: string; keys: string[] }) => (
  <div className="flex items-center justify-between p-2 rounded-xl border border-border/40 bg-muted/20">
    <span className="text-xs font-bold text-foreground/80">{label}</span>
    <div className="flex gap-1">
      {keys.map((key) => (
        <kbd
          key={key}
          className="px-2 py-1 rounded-md bg-background border border-border/60 text-[10px] font-black shadow-sm"
        >
          {key}
        </kbd>
      ))}
    </div>
  </div>
);
