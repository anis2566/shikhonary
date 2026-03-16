"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { toast } from "@workspace/ui/components/sonner";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";
import {
  PaperQuestion,
  PaperSettings,
  ElementStyle,
  PaperSubjectBreakdown,
} from "../types";
import { defaultPaperSettings } from "../mock-data";
import {
  useQuestionPaperById,
  useUpdateQuestionPaper,
  useUpdateQuestionPaperSettings,
  useRemoveMcqFromQuestionPaper,
  useReorderQuestionPaperQuestions,
  useUpdateQuestionOverrides,
} from "@workspace/api-client";
import { MCQ_TYPE } from "@workspace/utils";
import { type MCQ, type CQ } from "@workspace/schema";
import { toBengaliDigits } from "../preview/preview-utils";

interface QuestionOverrides {
  question?: string;
  context?: string;
  questionStyle?: ElementStyle;
  options?: { style?: ElementStyle }[];
  contextStyle?: ElementStyle;
  subQuestionStyles?: ElementStyle[];
  subQuestions?: { text?: string; marks?: number }[];
  statementStyles?: ElementStyle[];
  optionsColumns?: 1 | 2;
}

export interface PQ {
  id: string;
  mcqId?: string;
  cqId?: string;
  mcq?: MCQ;
  cq?: CQ;
  distributionId?: string;
  overrides?: QuestionOverrides;
}

export interface Paper {
  id: string;
  title?: string;
  examName?: string;
  total?: number;
  timeInMinutes?: number | null;
  settings?: PaperSettings;
  questions?: PQ[];
  subjects?: PaperSubjectBreakdown[];
  academicClass?: { displayName: string };
  status?: string;
  subjectName?: string;
}

// ─── Context Types (Split for performance) ────────────────────────────────

interface BuilderDataContextType {
  paperId: string;
  paper: Paper | null;
  isLoading: boolean;
  settings: PaperSettings;
  questions: PaperQuestion[];
  processedQuestions: PaperQuestion[];
}

interface BuilderUIContextType {
  isEditing: boolean;
  isExporting: boolean;
  zoom: number | "auto";
  sidebarTab: "settings" | "picker" | "reorder";
  saveStatus: "idle" | "saving" | "saved";
  hasUnsavedChanges: boolean;
  sheetOpen: boolean;
  deleteTarget: { id: string; question: string } | null;
  showShortcuts: boolean;
  setIsEditing: (v: boolean | ((p: boolean) => boolean)) => void;
  setZoom: (
    v: number | "auto" | ((p: number | "auto") => number | "auto"),
  ) => void;
  setSidebarTab: (v: "settings" | "picker" | "reorder") => void;
  setSheetOpen: (v: boolean) => void;
  setDeleteTarget: (v: { id: string; question: string } | null) => void;
  setShowShortcuts: (v: boolean | ((p: boolean) => boolean)) => void;
}

interface BuilderActionsContextType {
  handleSettingsChange: (newSettings: PaperSettings) => void;
  handleUpdateQuestion: (updated: PaperQuestion) => void;
  handleDeleteQuestion: (id: string) => void;
  confirmDeleteQuestion: () => Promise<void>;
  handleReorderQuestions: (
    reorderedQuestions: PaperQuestion[],
  ) => Promise<void>;
  handleGlobalSave: () => Promise<void>;
  handleExportPdf: () => Promise<void>;
}

// Backward-compatible combined type
interface BuilderContextType
  extends
    BuilderDataContextType,
    BuilderUIContextType,
    BuilderActionsContextType {}

// ─── Context Instances ─────────────────────────────────────────────────────

const BuilderDataContext = createContext<BuilderDataContextType | null>(null);
const BuilderUIContext = createContext<BuilderUIContextType | null>(null);
const BuilderActionsContext = createContext<BuilderActionsContextType | null>(
  null,
);

// ─── Focused Hooks (subscribe to only what you need) ───────────────────────

/** Data-only: paper, questions, settings. Won't re-render on UI state changes. */
export const useBuilderData = () => {
  const context = useContext(BuilderDataContext);
  if (!context)
    throw new Error("useBuilderData must be used within a BuilderProvider");
  return context;
};

/** UI-only: editing, zoom, sidebar tab, dialogs. Won't re-render on data changes. */
export const useBuilderUI = () => {
  const context = useContext(BuilderUIContext);
  if (!context)
    throw new Error("useBuilderUI must be used within a BuilderProvider");
  return context;
};

/** Actions-only: handlers (stable refs). Rarely triggers re-renders. */
export const useBuilderActions = () => {
  const context = useContext(BuilderActionsContext);
  if (!context)
    throw new Error("useBuilderActions must be used within a BuilderProvider");
  return context;
};

/** Backward-compatible: combines all three. Use focused hooks when possible. */
export const useBuilder = (): BuilderContextType => {
  const data = useBuilderData();
  const ui = useBuilderUI();
  const actions = useBuilderActions();
  return { ...data, ...ui, ...actions };
};

const mapToPaperQuestion = (pq: PQ, index: number): PaperQuestion => {
  if (pq.mcq) {
    const mcq = pq.mcq;
    const optionLabels = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ"];
    const overrides = pq.overrides || {};

    return {
      id: pq.id,
      number: index + 1,
      question: overrides.question || mcq.question,
      questionStyle: overrides.questionStyle,
      options: (mcq.options || []).map((text: string, i: number) => ({
        label: optionLabels[i] || String.fromCharCode(65 + i),
        text,
        style: overrides.options?.[i]?.style,
      })),
      statementStyles: overrides.statementStyles,
      optionsColumns: overrides.optionsColumns,
      correctAnswer: mcq.answer,
      context: overrides.context || mcq.context,
      contextStyle: overrides.contextStyle,
      statements: mcq.statements,
      type:
        mcq.type === MCQ_TYPE.SINGLE
          ? "single"
          : mcq.type === MCQ_TYPE.MULTIPLE
            ? "multiple"
            : mcq.type === MCQ_TYPE.CONTEXTUAL
              ? "contextual"
              : "single",
      subjectId: mcq.subjectId,
      questionTypeId: mcq.questionTypeId,
      distributionId: pq.distributionId,
      reference: mcq.reference,
    };
  }

  if (pq.cq) {
    const cq = pq.cq;
    const overrides = pq.overrides || {};

    return {
      id: pq.id,
      number: index + 1,
      question: overrides.question || "",
      questionStyle: overrides.questionStyle,
      options: [],
      context: overrides.context || cq.context,
      contextStyle: overrides.contextStyle,
      type: "creative",
      subjectId: cq.subjectId,
      questionTypeId: cq.questionTypeId || undefined,
      distributionId: pq.distributionId,
      reference: cq.reference,
      subQuestions: [
        {
          label: "ক",
          text: overrides.subQuestions?.[0]?.text || cq.questionA,
          marks: overrides.subQuestions?.[0]?.marks || 1,
          style: overrides.subQuestionStyles?.[0],
        },
        {
          label: "খ",
          text: overrides.subQuestions?.[1]?.text || cq.questionB,
          marks: overrides.subQuestions?.[1]?.marks || 2,
          style: overrides.subQuestionStyles?.[1],
        },
        {
          label: "গ",
          text: overrides.subQuestions?.[2]?.text || cq.questionC,
          marks: overrides.subQuestions?.[2]?.marks || 3,
          style: overrides.subQuestionStyles?.[2],
        },
        {
          label: "ঘ",
          text: overrides.subQuestions?.[3]?.text || cq.questionD,
          marks: overrides.subQuestions?.[3]?.marks || 4,
          style: overrides.subQuestionStyles?.[3],
        },
      ],
    };
  }

  return {
    id: pq.id,
    number: index + 1,
    question: "Question missing",
    options: [],
    type: "single",
  };
};

export const BuilderProvider: React.FC<{
  paperId: string;
  children: React.ReactNode;
}> = ({ paperId, children }) => {
  // Queries & Mutations
  const { data: paper, isLoading } = useQuestionPaperById(paperId);
  const { mutateAsync: updateQuestionPaper } = useUpdateQuestionPaper();
  const { mutateAsync: updateSettings } = useUpdateQuestionPaperSettings();
  const { mutateAsync: removeMcq } = useRemoveMcqFromQuestionPaper();
  const { mutateAsync: reorder } = useReorderQuestionPaperQuestions();
  const { mutateAsync: updateOverrides } = useUpdateQuestionOverrides();

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

    if (isInitialSyncRef.current) {
      const dbSettings = (paper.settings as unknown as PaperSettings) || {};
      const resolvedSubjectName = paper.subjects
        ? paper.subjects
            .map(
              (s: { subject: { displayName: string } }) =>
                s.subject.displayName,
            )
            .join(", ")
        : "";

      setSettings({
        ...defaultPaperSettings,
        ...dbSettings,
        className:
          paper.academicClass?.displayName || dbSettings.className || "",
        subjectName: resolvedSubjectName || dbSettings.subjectName || "",
        chapterName: dbSettings.chapterName || "",
        examName: paper.examName || dbSettings.examName || "",
        institutionName: dbSettings.institutionName || "",
        setCode: dbSettings.setCode || "ক",
        totalMarks: dbSettings.totalMarks || paper.total || 0,
        time:
          dbSettings.time ||
          (paper.timeInMinutes !== undefined && paper.timeInMinutes !== null
            ? `${toBengaliDigits(paper.timeInMinutes)} মিনিট`
            : ""),
      });
      isInitialSyncRef.current = false;
    }
  }, [paper]);

  useEffect(() => {
    if (paper?.questions) {
      const mapped = paper.questions.map((q: PQ, i: number) =>
        mapToPaperQuestion(q, i),
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
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q)),
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleGlobalSave = useCallback(async () => {
    setSaveStatus("saving");
    try {
      await updateSettings({
        questionPaperId: paperId,
        settings: settings as unknown as Record<string, unknown>,
      });

      await updateQuestionPaper({
        id: paperId,
        data: {
          examName: settings.examName,
          total: settings.totalMarks,
        },
      });

      const savePromises = questions
        .map((q) => {
          const overrides: Record<string, unknown> = {};
          let hasChanges = false;

          if (q.question) {
            overrides.question = q.question;
            hasChanges = true;
          }
          if (q.questionStyle) {
            overrides.questionStyle = q.questionStyle;
            hasChanges = true;
          }
          if (q.options?.some((opt) => opt.style)) {
            overrides.options = q.options.map((opt) => ({ style: opt.style }));
            hasChanges = true;
          }
          if (q.context) {
            overrides.context = q.context;
            hasChanges = true;
          }
          if (q.contextStyle) {
            overrides.contextStyle = q.contextStyle;
            hasChanges = true;
          }
          if (q.subQuestions) {
            if (q.subQuestions.some((sq) => sq.style)) {
              overrides.subQuestionStyles = q.subQuestions.map(
                (sq) => sq.style,
              );
              hasChanges = true;
            }
            if (q.subQuestions.some((sq) => sq.text)) {
              overrides.subQuestions = q.subQuestions.map((sq) => ({
                text: sq.text,
                marks: sq.marks,
              }));
              hasChanges = true;
            }
          }
          if (q.statementStyles && q.statementStyles.length > 0) {
            overrides.statementStyles = q.statementStyles;
            hasChanges = true;
          }
          if (q.optionsColumns) {
            overrides.optionsColumns = q.optionsColumns;
            hasChanges = true;
          }

          if (!hasChanges) return null;

          return updateOverrides({
            id: q.id,
            overrides: overrides as Record<string, unknown>,
          });
        })
        .filter((p) => p !== null);

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

  const handleExportPdf = useCallback(async () => {
    if (isExporting) return;

    setIsExporting(true);
    setSaveStatus("saving");

    const originalZoom = zoom;
    const originalIsEditing = isEditing;
    setZoom(1);
    setIsEditing(false);

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
          quality: 1.0,
          pixelRatio: 4,
          backgroundColor: "#ffffff",
          style: { boxShadow: "none", border: "none" },
          filter: (node) => {
            if (node instanceof HTMLElement) {
              const cls = node.className;
              if (
                typeof cls === "string" &&
                (cls.includes("page-indicator") ||
                  cls.includes("no-print") ||
                  cls.includes("group-hover"))
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
      document.getElementById("pdf-export-color-override")?.remove();
      setZoom(originalZoom);
      setIsEditing(originalIsEditing);
      setIsExporting(false);
      setSaveStatus("idle");
    }
  }, [paper, settings, zoom, isEditing, isExporting]);

  const dataValue = useMemo(
    () => ({
      paperId,
      paper: paper as unknown as Paper,
      isLoading,
      settings,
      questions,
      processedQuestions,
    }),
    [paperId, paper, isLoading, settings, questions, processedQuestions],
  );

  const uiValue = useMemo(
    () => ({
      isEditing,
      isExporting,
      zoom,
      sidebarTab,
      saveStatus,
      hasUnsavedChanges,
      sheetOpen,
      deleteTarget,
      showShortcuts,
      setIsEditing,
      setZoom,
      setSidebarTab,
      setSheetOpen,
      setDeleteTarget,
      setShowShortcuts,
    }),
    [
      isEditing,
      isExporting,
      zoom,
      sidebarTab,
      saveStatus,
      hasUnsavedChanges,
      sheetOpen,
      deleteTarget,
      showShortcuts,
    ],
  );

  const actionsValue = useMemo(
    () => ({
      handleSettingsChange,
      handleUpdateQuestion,
      handleDeleteQuestion,
      confirmDeleteQuestion,
      handleReorderQuestions,
      handleGlobalSave,
      handleExportPdf,
    }),
    [
      handleSettingsChange,
      handleUpdateQuestion,
      handleDeleteQuestion,
      confirmDeleteQuestion,
      handleReorderQuestions,
      handleGlobalSave,
      handleExportPdf,
    ],
  );

  return (
    <BuilderDataContext.Provider value={dataValue}>
      <BuilderUIContext.Provider value={uiValue}>
        <BuilderActionsContext.Provider value={actionsValue}>
          {children}
        </BuilderActionsContext.Provider>
      </BuilderUIContext.Provider>
    </BuilderDataContext.Provider>
  );
};
