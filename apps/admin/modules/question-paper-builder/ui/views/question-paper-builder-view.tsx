"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Loader2,
  Layout,
  Library,
  Settings,
  Check,
  FileText,
  Trash2,
  ListOrdered,
  Keyboard,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Toggle } from "@workspace/ui/components/toggle";
import { toast } from "@workspace/ui/components/sonner";
import { Sheet, SheetContent } from "@workspace/ui/components/sheet";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";

import { cn } from "@workspace/ui/lib/utils";
import { PaperPreview } from "../components/paper-preview";
import { SettingsSidebar } from "../components/settings-sidebar";
import { McqPicker } from "../components/mcq-picker";
import {
  PaperQuestion,
  PaperSettings,
  ElementStyle,
} from "../components/types";
import { defaultPaperSettings } from "../components/mock-data";
import { QuestionReorderList } from "../components/question-reorder-list";

import {
  useQuestionPaperById,
  useUpdateQuestionPaper,
  useUpdateQuestionPaperSettings,
  useRemoveMcqFromQuestionPaper,
  useReorderQuestionPaperQuestions,
  useUpdateQuestionOverrides,
} from "@workspace/api-client";
import { type MCQ } from "@workspace/schema";
import { MCQ_TYPE } from "@workspace/utils";

interface QuestionPaperBuilderViewProps {
  paperId: string;
}

interface QuestionOverrides {
  questionStyle?: ElementStyle;
  options?: { style?: ElementStyle }[];
  statementStyles?: ElementStyle[];
  optionsColumns?: 1 | 2;
}

interface PQ {
  id: string;
  mcqId: string;
  mcq: MCQ;
  overrides?: QuestionOverrides;
}

/**
 * Maps DB MCQ record to the type expected by the builder's preview engine
 */
const mapMcqToPaperQuestion = (pq: PQ, index: number): PaperQuestion => {
  const mcq = pq.mcq;
  if (!mcq) {
    return {
      id: pq.id,
      number: index + 1,
      question: "Question missing",
      options: [],
      type: "single",
    };
  }

  const optionLabels = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ"];

  const overrides = pq.overrides || {};

  return {
    id: pq.id, // We use the Join table ID so we can identify the relation
    number: index + 1,
    question: mcq.question,
    questionStyle: overrides.questionStyle,
    options: (mcq.options || []).map((text: string, i: number) => ({
      label: optionLabels[i] || String.fromCharCode(65 + i),
      text,
      style: overrides.options?.[i]?.style,
    })),
    statementStyles: overrides.statementStyles,
    optionsColumns: overrides.optionsColumns,
    correctAnswer: mcq.answer,
    context: mcq.context,
    statements: mcq.statements,
    type:
      mcq.type === MCQ_TYPE.SINGLE
        ? "single"
        : mcq.type === MCQ_TYPE.MULTIPLE
          ? "multiple"
          : mcq.type === MCQ_TYPE.CONTEXTUAL
            ? "contextual"
            : "single",
  };
};

export const QuestionPaperBuilderView: React.FC<
  QuestionPaperBuilderViewProps
> = ({ paperId }) => {
  const router = useRouter();

  // Queries & Mutations
  const { data: paper, isLoading } = useQuestionPaperById(paperId);
  const { mutate: updateQuestionPaper } = useUpdateQuestionPaper();
  const { mutate: updateSettings } = useUpdateQuestionPaperSettings();
  const { mutateAsync: removeMcq } = useRemoveMcqFromQuestionPaper();
  const { mutateAsync: reorder } = useReorderQuestionPaperQuestions();
  const { mutate: updateOverrides } = useUpdateQuestionOverrides();

  // Local State
  const [isEditing, setIsEditing] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState<number | "auto">("auto");
  const [shuffleSeed, setShuffleSeed] = useState(Date.now());
  const [sidebarTab, setSidebarTab] = useState<
    "settings" | "picker" | "reorder"
  >("settings");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    question: string;
  } | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const saveStatusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Synchronize paper settings with component state
  const [settings, setSettings] = useState<PaperSettings>(defaultPaperSettings);
  const [questions, setQuestions] = useState<PaperQuestion[]>([]);
  const isInitialSyncRef = useRef(true);

  useEffect(() => {
    if (!paper) return;

    // We only sync from DB on initial load or if the paper object itself changes significantly
    // (like after a publish/status change), but we avoid overwriting user's active local edits.
    if (isInitialSyncRef.current) {
      const dbSettings = (paper.settings as unknown as PaperSettings) || {};

      setSettings({
        ...defaultPaperSettings,
        ...dbSettings,
        // Sync with top-level fields but maintain priority for settings JSON if existed
        className: paper.className || dbSettings.className || "",
        subjectName: paper.subjectName || dbSettings.subjectName || "",
        chapterName: paper.chapterName || dbSettings.chapterName || "",
        examName: paper.examName || dbSettings.examName || "",
        institutionName: dbSettings.institutionName || "My Institution",
        setCode: dbSettings.setCode || "ক",
      });
      isInitialSyncRef.current = false;
    }
  }, [paper]);

  useEffect(() => {
    if (paper?.questions) {
      const mapped = paper.questions.map((q: PQ, i: number) =>
        mapMcqToPaperQuestion(q, i),
      );
      setQuestions(mapped);
    }
  }, [paper?.questions]);

  // Process questions based on shuffle settings
  const processedQuestions = useMemo(() => {
    let processed = [...questions];

    if (settings.shuffleQuestions) {
      const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };

      for (let i = processed.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(shuffleSeed + i) * (i + 1));
        [processed[i], processed[j]] = [processed[j]!, processed[i]!];
      }
      processed = processed.map((q, idx) => ({ ...q, number: idx + 1 }));
    }

    if (settings.shuffleOptions) {
      const optionLabels = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ"];
      processed = processed.map((q, qIdx) => {
        const shuffledOptions = [...q.options];
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
          const seed = shuffleSeed + qIdx * 100 + i;
          const x = Math.sin(seed) * 10000;
          const j = Math.floor((x - Math.floor(x)) * (i + 1));
          [shuffledOptions[i], shuffledOptions[j]] = [
            shuffledOptions[j]!,
            shuffledOptions[i]!,
          ];
        }
        return {
          ...q,
          options: shuffledOptions.map((opt, idx) => ({
            ...opt,
            label: optionLabels[idx] || String.fromCharCode(65 + idx),
          })),
        };
      });
    }

    return processed;
  }, [
    questions,
    settings.shuffleQuestions,
    settings.shuffleOptions,
    shuffleSeed,
  ]);

  const handleSettingsChange = useCallback(
    (newSettings: PaperSettings) => {
      if (
        newSettings.shuffleQuestions !== settings.shuffleQuestions ||
        newSettings.shuffleOptions !== settings.shuffleOptions
      ) {
        setShuffleSeed(Date.now());
      }

      setSettings(newSettings);
      setHasUnsavedChanges(true);
    },
    [settings],
  );

  // Show confirmation dialog before deleting
  const handleDeleteQuestion = useCallback(
    (id: string) => {
      const q = processedQuestions.find((q) => q.id === id);
      setDeleteTarget({
        id,
        question: q?.question || "this question",
      });
    },
    [processedQuestions],
  );

  const confirmDeleteQuestion = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await removeMcq({ questionPaperQuestionId: deleteTarget.id });
      toast.success("Question removed from paper");
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove question");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, removeMcq]);

  const handleReorderQuestions = useCallback(
    async (reorderedQuestions: PaperQuestion[]) => {
      setQuestions(reorderedQuestions);
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleUpdateQuestion = useCallback((updated: PaperQuestion) => {
    // Instant UI update
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q)),
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleGlobalSave = useCallback(async () => {
    setSaveStatus("saving");
    try {
      // 1. Update the settings JSON
      await updateSettings({
        questionPaperId: paperId,
        settings: settings as unknown as Record<string, unknown>,
      });

      // 2. Clear out top-level metadata
      await updateQuestionPaper({
        id: paperId,
        data: {
          className: settings.className,
          subjectName: settings.subjectName,
          chapterName: settings.chapterName,
          examName: settings.examName,
        },
      });

      // 3. Save overrides for every question that has them
      // In a real app we'd want a bulk endpoint here.
      const savePromises = questions.map((q) => {
        const overrides = {
          questionStyle: q.questionStyle,
          options: q.options.map((opt) => ({ style: opt.style })),
          statementStyles: q.statementStyles,
          optionsColumns: q.optionsColumns,
        };
        return updateOverrides({
          id: q.id,
          overrides: overrides as Record<string, unknown>,
        });
      });

      // 4. Save the order
      const orderItems = questions.map((q, idx) => ({
        id: q.id,
        orderIndex: idx,
      }));
      const reorderPromise = reorder({
        questionPaperId: paperId,
        items: orderItems,
      });

      await Promise.all([...savePromises, reorderPromise]);

      setSaveStatus("saved");
      setHasUnsavedChanges(false);
      toast.success("All changes saved successfully");

      if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current);
      saveStatusTimerRef.current = setTimeout(
        () => setSaveStatus("idle"),
        2000,
      );
    } catch (e) {
      console.error(e);
      setSaveStatus("idle");
      toast.error("Failed to save changes");
    }
  }, [
    paperId,
    settings,
    questions,
    updateSettings,
    updateQuestionPaper,
    updateOverrides,
    reorder,
  ]);

  // PDF Export Logic
  const handleExportPdf = useCallback(async () => {
    if (isExporting) return;

    setIsExporting(true);
    setSaveStatus("saving");

    const originalZoom = zoom;
    const originalIsEditing = isEditing;
    setZoom(1);
    setIsEditing(false);

    // LIVE DOCUMENT CSS OVERRIDE:
    // html-to-image reads computed styles from the browser's CSSOM.
    // Chrome computes oklch/oklab values and returns them as lab() from getComputedStyle,
    // which html-to-image's SVG serializer can't handle.
    // FIX: Override all CSS custom properties with plain hex values IN THE LIVE DOCUMENT
    // before capture. This forces the browser to compute standard rgb() values.
    const safeStyleEl = document.createElement("style");
    safeStyleEl.id = "pdf-export-color-override";
    safeStyleEl.textContent = `
      :root, .dark, [data-theme] {
        --background: #ffffff !important;
        --foreground: #000000 !important;
        --card: #ffffff !important;
        --card-foreground: #000000 !important;
        --popover: #ffffff !important;
        --popover-foreground: #000000 !important;
        --primary: #0a7ea4 !important;
        --primary-foreground: #ffffff !important;
        --secondary: #f1f5f9 !important;
        --secondary-foreground: #0f172a !important;
        --muted: #f1f5f9 !important;
        --muted-foreground: #64748b !important;
        --accent: #f1f5f9 !important;
        --accent-foreground: #0f172a !important;
        --destructive: #ef4444 !important;
        --destructive-foreground: #ffffff !important;
        --border: #e2e8f0 !important;
        --input: #e2e8f0 !important;
        --ring: #0a7ea4 !important;
        --sidebar: #f8fafc !important;
        --sidebar-foreground: #0f172a !important;
        --sidebar-primary: #0a7ea4 !important;
        --sidebar-primary-foreground: #ffffff !important;
        --sidebar-accent: #f1f5f9 !important;
        --sidebar-accent-foreground: #0f172a !important;
        --sidebar-border: #e2e8f0 !important;
        --sidebar-ring: #0a7ea4 !important;
        --shadow-soft: none !important;
        --shadow-medium: none !important;
        --shadow-glow: none !important;
        --gradient-primary: none !important;
        --gradient-accent: none !important;
        --gradient-background: none !important;
        --gradient-card: none !important;
      }
    `;
    document.head.appendChild(safeStyleEl);

    try {
      // Allow extra time for UI re-renders
      await new Promise((resolve) => setTimeout(resolve, 1100));
      await document.fonts.ready;

      const pageElements = document.querySelectorAll(
        '[id^="paper-preview-page-"]',
      );

      if (!pageElements.length) {
        throw new Error(
          "No pages found. Make sure the paper preview is rendered.",
        );
      }

      const pdf = new jsPDF({
        orientation: settings.paperOrientation,
        unit: "mm",
        format: settings.paperSize.toLowerCase() as
          | "a3"
          | "a4"
          | "a5"
          | "letter"
          | "legal",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        const element = pageElements[i] as HTMLElement;
        element.scrollIntoView({ block: "center" });
        await new Promise((resolve) => setTimeout(resolve, 100));

        const imgData = await toJpeg(element, {
          quality: 1.0, // Max quality
          pixelRatio: 4, // Ultra-high resolution
          backgroundColor: "#ffffff",
          style: {
            boxShadow: "none",
            border: "none",
          },
          filter: (node) => {
            if (node instanceof HTMLElement) {
              const cls = node.className;
              if (
                typeof cls === "string" &&
                (cls.includes("page-indicator") ||
                  cls.includes("no-print") ||
                  cls.includes("group-hover")) // Hide drag/delete handles
              ) {
                return false;
              }
            }
            return true;
          },
        });

        if (i > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          "SLOW",
        );
      }

      const safeTitle = (paper?.title || "question-paper")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      pdf.save(`${safeTitle}-${Date.now()}.pdf`);
      toast.success("PDF saved successfully!");
    } catch (error: unknown) {
      console.error("PDF Export Error:", error);
      toast.error(
        `Export failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      // Remove the CSS override and restore zoom
      document.getElementById("pdf-export-color-override")?.remove();
      setZoom(originalZoom);
      setIsEditing(originalIsEditing);
      setIsExporting(false);
      setSaveStatus("idle");
    }
  }, [settings, paper?.title, zoom, isEditing, isExporting]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === "e") {
        e.preventDefault();
        setIsEditing((v) => !v);
      } else if (ctrl && e.key === "p") {
        e.preventDefault();
        handleExportPdf();
      } else if (ctrl && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        setZoom((prev) =>
          typeof prev === "number" ? Math.min(2, prev + 0.1) : 0.7,
        );
      } else if (ctrl && e.key === "-") {
        e.preventDefault();
        setZoom((prev) =>
          typeof prev === "number" ? Math.max(0.25, prev - 0.1) : 0.5,
        );
      } else if (ctrl && e.key === "0") {
        e.preventDefault();
        setZoom("auto");
      } else if (ctrl && e.key === "1") {
        e.preventDefault();
        setSidebarTab("settings");
      } else if (ctrl && e.key === "2") {
        e.preventDefault();
        setSidebarTab("picker");
      } else if (ctrl && e.key === "3") {
        e.preventDefault();
        setSidebarTab("reorder");
      } else if (e.key === "?" && !ctrl) {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleExportPdf]);

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
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
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
                  <DropdownMenuContent
                    align="start"
                    className="rounded-xl font-bold"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        updateQuestionPaper({
                          id: paperId,
                          data: { status: "Draft" },
                        })
                      }
                      className={cn(paper?.status === "Draft" && "bg-muted")}
                    >
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateQuestionPaper({
                          id: paperId,
                          data: { status: "Published" },
                        })
                      }
                      className={cn(
                        paper?.status === "Published" &&
                          "bg-muted text-emerald-600",
                      )}
                    >
                      Published
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Save status indicator */}
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
                {paper?.subjectName} — {questions.length} Questions ·{" "}
                {settings.totalMarks} Marks
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
              {isEditing ? (
                <Edit className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span className="hidden lg:inline">
                {isEditing ? "Editing Mode" : "Preview Mode"}
              </span>
            </Toggle>

            <Button
              size="sm"
              variant={hasUnsavedChanges ? "default" : "outline"}
              onClick={handleGlobalSave}
              disabled={saveStatus === "saving"}
              className={cn(
                "h-9 px-4 rounded-xl font-bold text-xs transition-all",
                hasUnsavedChanges &&
                  "shadow-glow bg-emerald-600 hover:bg-emerald-700 text-white border-0",
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

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-center gap-2 p-2 bg-background/50 border-b absolute top-0 inset-x-0 z-10 backdrop-blur-sm">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() =>
                setZoom((prev) =>
                  typeof prev === "number" ? Math.max(0.25, prev - 0.1) : 0.5,
                )
              }
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-[10px] font-black w-14 text-center tabular-nums uppercase">
              {zoom === "auto" ? "Auto" : `${Math.round(zoom * 100)}%`}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() =>
                setZoom((prev) =>
                  typeof prev === "number" ? Math.min(2, prev + 0.1) : 0.7,
                )
              }
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 rounded-lg px-3 font-bold text-[10px] uppercase"
              onClick={() => setZoom("auto")}
            >
              <Maximize2 className="w-3 h-3" />
              Fit Screen
            </Button>
          </div>

          <div className="flex-1 bg-muted/20 overflow-auto pt-12 pb-12 pattern-grid">
            {/* Empty State — shown when no questions have been added */}
            {processedQuestions.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-5 text-center max-w-sm animate-in fade-in zoom-in-95 duration-500">
                  <div className="size-24 bg-primary/5 rounded-3xl flex items-center justify-center ring-1 ring-primary/10">
                    <FileText className="size-12 text-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight">
                      Your paper is empty!
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      Start by adding questions from the Question Bank. You can
                      search, filter, and pick MCQs to build your paper.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSidebarTab("picker");
                      setSheetOpen(true);
                    }}
                    className="rounded-xl font-bold px-6 shadow-glow h-11"
                  >
                    <Library className="w-4 h-4 mr-2" />
                    Browse Question Bank
                  </Button>
                </div>
              </div>
            ) : (
              <PaperPreview
                questions={processedQuestions}
                settings={settings}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onDuplicateQuestion={() => {}}
                onReorderQuestions={handleReorderQuestions}
                onSettingsChange={handleSettingsChange}
                isEditing={isEditing}
                zoom={zoom}
              />
            )}
          </div>
        </div>

        {/* Desktop Sidebar — visible only on xl+ */}
        <div className="w-[380px] hidden xl:flex flex-col bg-background border-l shadow-2xl relative z-10">
          {sidebarTab === "settings" ? (
            <SettingsSidebar
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onExportPdf={handleExportPdf}
              isExporting={isExporting}
            />
          ) : sidebarTab === "reorder" ? (
            <QuestionReorderList
              questions={processedQuestions}
              onReorder={handleReorderQuestions}
            />
          ) : (
            <McqPicker
              paperId={paperId}
              assignedMcqIds={(paper?.questions ?? []).map(
                (pq: { mcqId: string }) => pq.mcqId,
              )}
            />
          )}
        </div>
      </div>

      {/* Mobile/Tablet Sidebar Sheet — only renders below xl */}
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
              Question Bank
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
            {sidebarTab === "settings" ? (
              <SettingsSidebar
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onExportPdf={handleExportPdf}
                isExporting={isExporting}
              />
            ) : sidebarTab === "reorder" ? (
              <QuestionReorderList
                questions={processedQuestions}
                onReorder={handleReorderQuestions}
              />
            ) : (
              <McqPicker
                paperId={paperId}
                assignedMcqIds={(paper?.questions ?? []).map(
                  (pq: { mcqId: string }) => pq.mcqId,
                )}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile FAB — visible below xl when sheet is closed */}
      <Button
        size="icon"
        className="xl:hidden fixed bottom-6 right-6 z-30 h-14 w-14 rounded-2xl shadow-glow"
        onClick={() => setSheetOpen(true)}
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl">
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
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteQuestion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold"
            >
              Remove Question
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Shortcuts Help Dialog */}
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
    </div>
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
