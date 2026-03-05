"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Toggle } from "@workspace/ui/components/toggle";
import { toast } from "@workspace/ui/components/sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { PaperPreview } from "../components/paper-preview";
import { SettingsSidebar } from "../components/settings-sidebar";
import { McqPicker } from "../components/mcq-picker";
import { PaperQuestion, PaperSettings } from "../components/types";
import { defaultPaperSettings } from "../components/mock-data";

import {
  useQuestionPaperById,
  useUpdateQuestionPaperSettings,
  useRemoveMcqFromQuestionPaper,
  useReorderQuestionPaperQuestions,
} from "@workspace/api-client";
import { type MCQ } from "@workspace/schema";

interface QuestionPaperBuilderViewProps {
  paperId: string;
}

interface PQ {
  id: string;
  mcqId: string;
  mcq: MCQ;
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

  return {
    id: pq.id, // We use the Join table ID so we can identify the relation
    number: index + 1,
    question: mcq.question,
    options: (mcq.options || []).map((text: string, i: number) => ({
      label: optionLabels[i] || String.fromCharCode(65 + i),
      text,
    })),
    correctAnswer: mcq.answer,
    context: mcq.context,
    statements: mcq.statements,
    type:
      mcq.type === "ASSERTION"
        ? "assertion"
        : mcq.type === "STATEMENT"
          ? "statement"
          : mcq.type === "MULTIPLE"
            ? "multiple"
            : "single",
  };
};

export const QuestionPaperBuilderView: React.FC<
  QuestionPaperBuilderViewProps
> = ({ paperId }) => {
  const router = useRouter();

  // Queries & Mutations
  const { data: paper, isLoading } = useQuestionPaperById(paperId);
  const { mutateAsync: updateSettings } = useUpdateQuestionPaperSettings();
  const { mutateAsync: removeMcq } = useRemoveMcqFromQuestionPaper();
  const { mutateAsync: reorderQuestions } = useReorderQuestionPaperQuestions();

  // Local State
  const [isEditing, setIsEditing] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState<number | "auto">("auto");
  const [shuffleSeed, setShuffleSeed] = useState(Date.now());
  const [sidebarTab, setSidebarTab] = useState<"settings" | "picker">(
    "settings",
  );

  // Synchronize paper settings with component state
  const [settings, setSettings] = useState<PaperSettings>(defaultPaperSettings);

  useEffect(() => {
    if (paper?.settings && Object.keys(paper.settings).length > 0) {
      // Merge defaults with DB settings to ensure all fields exist
      setSettings(() => ({
        ...defaultPaperSettings,
        ...paper.settings,
        // Always sync metadata from paper record
        institutionName: paper.settings.institutionName || "My Institution",
        className: paper.className || paper.settings.className || "",
        subjectName: paper.subjectName || paper.settings.subjectName || "",
        chapterName: paper.chapterName || paper.settings.chapterName || "",
        examName: paper.examName || paper.settings.examName || "",
      }));
    } else if (paper) {
      // If no settings in DB, partially populate from paper metadata
      setSettings((prev) => ({
        ...prev,
        className: paper.className || "",
        subjectName: paper.subjectName || "",
        chapterName: paper.chapterName || "",
        examName: paper.examName || "",
      }));
    }
  }, [paper]);

  // Transform DB questions to local runtime format
  const questions = useMemo(() => {
    return (paper?.questions || []).map((q: PQ, i: number) =>
      mapMcqToPaperQuestion(q, i),
    );
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
      // Auto-save settings to DB (could debounce this)
      updateSettings({
        questionPaperId: paperId,
        settings: newSettings as any,
      });
    },
    [settings, paperId, updateSettings],
  );

  const handleDeleteQuestion = useCallback(
    async (id: string) => {
      try {
        await removeMcq({ questionPaperQuestionId: id });
        toast.success("Question removed from paper");
      } catch (e) {
        console.error(e);
        toast.error("Failed to remove question");
      }
    },
    [removeMcq],
  );

  const handleReorderQuestions = useCallback(
    async (reorderedQuestions: PaperQuestion[]) => {
      // Map back to DB IDs and new order
      const items = reorderedQuestions.map((q, idx) => ({
        id: q.id,
        orderIndex: idx,
      }));
      try {
        await reorderQuestions({ questionPaperId: paperId, items });
      } catch (e) {
        console.error(e);
        toast.error("Failed to save order");
      }
    },
    [paperId, reorderQuestions],
  );

  // PDF Export Logic
  const handleExportPdf = useCallback(async () => {
    setIsExporting(true);
    try {
      await document.fonts.ready;
      const pageElements = document.querySelectorAll(
        '[id^="paper-preview-page-"]',
      );
      if (pageElements.length === 0)
        throw new Error("Preview element not found");

      const pdf = new jsPDF({
        orientation: settings.paperOrientation,
        unit: "mm",
        format: settings.paperSize.toLowerCase() as "a4" | "letter" | "legal",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        const element = pageElements[i] as HTMLElement;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      }

      pdf.save(`${paper?.title || "question-paper"}-${Date.now()}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  }, [settings, paper?.title]);

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
                <Badge variant="outline" className="text-[10px] font-bold">
                  {paper?.status}
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground font-semibold">
                {paper?.subjectName} — {questions.length} Questions
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
              variant="outline"
              onClick={() => setSidebarTab("picker")}
              className="h-9 px-4 rounded-xl border-border/50 font-bold text-xs shadow-soft"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
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
            <PaperPreview
              questions={processedQuestions}
              settings={settings}
              onUpdateQuestion={() => {}} // Not implemented for DB questions yet
              onDeleteQuestion={handleDeleteQuestion}
              onDuplicateQuestion={() => {}}
              onReorderQuestions={handleReorderQuestions}
              onSettingsChange={handleSettingsChange}
              isEditing={isEditing}
              zoom={zoom}
            />
          </div>
        </div>

        {/* Dynamic Sidebar */}
        <div className="w-[380px] hidden xl:flex flex-col bg-background border-l shadow-2xl relative z-10">
          {sidebarTab === "settings" ? (
            <SettingsSidebar
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onExportPdf={handleExportPdf}
              isExporting={isExporting}
            />
          ) : (
            <McqPicker
              paperId={paperId}
              assignedMcqIds={paper.questions.map(
                (pq: { mcqId: string }) => pq.mcqId,
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
