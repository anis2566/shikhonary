"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  PaperQuestion,
  PaperSettings,
  ActiveElementContext,
  ElementStyle,
  HeaderStyles,
  PaperSubjectBreakdown,
} from "../types";
import { calculatePagination } from "./pagination-calculator";
import {
  calculateDistributionStats,
  DistributionStats,
} from "./distribution-utils";

interface PreviewContextType {
  // Props
  questions: PaperQuestion[];
  subjects?: PaperSubjectBreakdown[];
  settings: PaperSettings;
  isEditing: boolean;
  zoom: number | "auto";

  // State
  pages: PaperQuestion[][];
  autoScale: number;
  activeContext: ActiveElementContext | null;
  activeElement: HTMLElement | null;
  showToolbar: boolean;
  isToolbarInteracting: boolean;
  firstPageEnd: number;

  // Refs
  containerRef: React.RefObject<HTMLDivElement | null>;
  toolbarRef: React.RefObject<HTMLDivElement | null>;

  // Derived
  effectiveScale: number;
  shouldRestrictHeaderWidth: boolean;
  distributionStats: DistributionStats;

  // Actions
  onUpdateQuestion: (q: PaperQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (q: PaperQuestion) => void;
  onReorderQuestions?: (questions: PaperQuestion[]) => void;
  onSettingsChange: (s: PaperSettings) => void;

  setActiveContext: (c: ActiveElementContext | null) => void;
  setActiveElement: (e: HTMLElement | null) => void;
  setShowToolbar: (v: boolean) => void;
  setIsToolbarInteracting: (v: boolean) => void;

  handleStyleChange: (style: ElementStyle) => void;
  handleOptionsColumnsChange: (cols: 1 | 2) => void;
  handleHeaderFocus: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof HeaderStyles,
  ) => void;
  handleQuestionFocus: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    qId: string,
    type: ActiveElementContext["type"],
    index?: number,
    style?: ElementStyle,
  ) => void;
  handleBlur: () => void;
  handleToolbarInteractionStart: () => void;
  handleToolbarInteractionEnd: () => void;
  updateSetting: <K extends keyof PaperSettings>(
    key: K,
    value: PaperSettings[K],
  ) => void;
  getHeaderStyle: (field: keyof HeaderStyles) => ElementStyle;
  getPaperStyle: () => React.CSSProperties;
  getPaperDimensions: () => { width: number; height: number };
}

const PreviewContext = createContext<PreviewContextType | null>(null);

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (!context)
    throw new Error("usePreview must be used within a PreviewProvider");
  return context;
};

export const PreviewProvider: React.FC<{
  children: React.ReactNode;
  questions: PaperQuestion[];
  subjects?: PaperSubjectBreakdown[];
  settings: PaperSettings;
  onUpdateQuestion: (q: PaperQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (q: PaperQuestion) => void;
  onReorderQuestions?: (questions: PaperQuestion[]) => void;
  onSettingsChange: (s: PaperSettings) => void;
  isEditing: boolean;
  zoom?: number | "auto";
}> = ({
  children,
  questions,
  subjects,
  settings,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onReorderQuestions,
  onSettingsChange,
  isEditing,
  zoom = "auto",
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeContext, setActiveContext] =
    useState<ActiveElementContext | null>(null);
  const [autoScale, setAutoScale] = useState(1);
  const [isToolbarInteracting, setIsToolbarInteracting] = useState(false);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isLandscape = settings.paperOrientation === "landscape";
  const isMultiColumn = settings.columns > 1;
  const shouldRestrictHeaderWidth = isLandscape && isMultiColumn;

  const effectiveScale = zoom === "auto" ? autoScale : zoom;

  const getPaperDimensions = useCallback(() => {
    const isL = settings.paperOrientation === "landscape";
    const dimensions = {
      A4: { width: 210, height: 297 },
      Letter: { width: 216, height: 279 },
      Legal: { width: 216, height: 356 },
      A5: { width: 148, height: 210 },
    };
    const size =
      dimensions[settings.paperSize as keyof typeof dimensions] ||
      dimensions.A4;
    return isL ? { width: size.height, height: size.width } : size;
  }, [settings.paperSize, settings.paperOrientation]);

  const getPaperStyle = useCallback((): React.CSSProperties => {
    const paper = getPaperDimensions();
    return {
      width: `${paper.width}mm`,
      height: `${paper.height}mm`,
      fontFamily: "SolaimanLipi, sans-serif",
      lineHeight: settings.lineHeight || 1.1,
    };
  }, [getPaperDimensions, settings.lineHeight]);

  const getHeaderStyle = useCallback(
    (field: keyof HeaderStyles): ElementStyle => {
      const defaults: Record<string, ElementStyle> = {
        institutionName: {
          fontSize: 20,
          fontFamily: "SolaimanLipi",
          textAlign: "center",
          fontWeight: "bold",
        },
        examName: {
          fontSize: 16,
          fontFamily: "SolaimanLipi",
          textAlign: "center",
          fontWeight: "bold",
        },
        setCode: {
          fontSize: 24,
          fontFamily: "SolaimanLipi",
          textAlign: "center",
        },
        time: { fontSize: 14, fontFamily: "SolaimanLipi", textAlign: "left" },
        totalMarks: {
          fontSize: 14,
          fontFamily: "SolaimanLipi",
          textAlign: "right",
        },
        instructions: {
          fontSize: 14,
          fontFamily: "SolaimanLipi",
          textAlign: "left",
        },
      };
      return (
        settings.headerStyles?.[field] ||
        defaults[field as string] || {
          fontSize: 14,
          fontFamily: "SolaimanLipi",
          textAlign: "center",
        }
      );
    },
    [settings.headerStyles],
  );

  const updateHeaderStyle = useCallback(
    (field: keyof HeaderStyles, style: ElementStyle) => {
      onSettingsChange({
        ...settings,
        headerStyles: { ...settings.headerStyles, [field]: style },
      });
    },
    [settings, onSettingsChange],
  );

  const updateSetting = useCallback(
    <K extends keyof PaperSettings>(key: K, value: PaperSettings[K]) => {
      onSettingsChange({ ...settings, [key]: value });
    },
    [settings, onSettingsChange],
  );

  const handleHeaderFocus = useCallback(
    (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: keyof HeaderStyles,
    ) => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      setActiveElement(e.target as HTMLElement);
      setActiveContext({
        type: "header",
        field,
        currentStyle: getHeaderStyle(field),
      });
      setShowToolbar(true);
    },
    [getHeaderStyle],
  );

  const handleQuestionFocus = useCallback(
    (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
      qId: string,
      type: ActiveElementContext["type"],
      index?: number,
      style?: ElementStyle,
    ) => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      setActiveElement(e.target as HTMLElement);
      setActiveContext({
        type,
        questionId: qId,
        optionIndex: type === "option" ? index : undefined,
        statementIndex: type === "statement" ? index : undefined,
        currentStyle: style || {
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
          textAlign: "left",
        },
        optionsColumns: questions.find((q) => q.id === qId)?.optionsColumns,
      });
      setShowToolbar(true);
    },
    [questions, settings.fontSize, settings.fontFamily],
  );

  const handleBlur = useCallback(() => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = setTimeout(() => {
      const activeEl = document.activeElement;
      if (
        !isToolbarInteracting &&
        activeEl?.tagName !== "INPUT" &&
        activeEl?.tagName !== "TEXTAREA" &&
        !toolbarRef.current?.contains(activeEl)
      ) {
        setShowToolbar(false);
        setActiveContext(null);
        setActiveElement(null);
      }
    }, 200);
  }, [isToolbarInteracting]);

  const handleToolbarInteractionStart = useCallback(() => {
    setIsToolbarInteracting(true);
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
  }, []);

  const handleToolbarInteractionEnd = useCallback(
    () => setIsToolbarInteracting(false),
    [],
  );

  const handleStyleChange = useCallback(
    (newStyle: ElementStyle) => {
      if (!activeContext) return;
      if (activeContext.type === "header" && activeContext.field) {
        updateHeaderStyle(activeContext.field, newStyle);
      } else if (activeContext.questionId) {
        const q = questions.find((q) => q.id === activeContext.questionId);
        if (!q) return;
        const updated = { ...q };
        if (activeContext.type === "question") updated.questionStyle = newStyle;
        else if (activeContext.type === "context") updated.contextStyle = newStyle;
        else if (
          activeContext.type === "option" &&
          activeContext.optionIndex !== undefined
        ) {
          if (q.type === "creative") {
            const sqs = [...(updated.subQuestions || [])];
            if (sqs[activeContext.optionIndex]) {
              sqs[activeContext.optionIndex] = {
                ...sqs[activeContext.optionIndex]!,
                style: newStyle,
              };
            }
            updated.subQuestions = sqs;
          } else {
            const opts = [...updated.options];
            if (opts[activeContext.optionIndex])
              opts[activeContext.optionIndex] = {
                ...opts[activeContext.optionIndex]!,
                style: newStyle,
              };
            updated.options = opts;
          }
        } else if (
          activeContext.type === "statement" &&
          activeContext.statementIndex !== undefined
        ) {
          const styles = [...(updated.statementStyles || [])];
          styles[activeContext.statementIndex] = newStyle;
          updated.statementStyles = styles;
        }
        onUpdateQuestion(updated);
      }
      setActiveContext({ ...activeContext, currentStyle: newStyle });
    },
    [activeContext, questions, onUpdateQuestion, updateHeaderStyle],
  );

  const handleOptionsColumnsChange = useCallback(
    (cols: 1 | 2) => {
      if (!activeContext?.questionId) return;
      const q = questions.find((q) => q.id === activeContext.questionId);
      if (!q) return;
      onUpdateQuestion({ ...q, optionsColumns: cols });
      setActiveContext({ ...activeContext, optionsColumns: cols });
    },
    [activeContext, questions, onUpdateQuestion],
  );

  // Scale Calculation
  useEffect(() => {
    if (zoom !== "auto") return;
    const calculateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 48;
      const paperWidthPx = getPaperDimensions().width * 3.78;
      setAutoScale(Math.max(0.25, Math.min(containerWidth / paperWidthPx, 1)));
    };
    calculateScale();
    const observer = new ResizeObserver(calculateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [settings.paperSize, settings.paperOrientation, zoom, getPaperDimensions]);

  // ── Calculation-based pagination (replaces old DOM measurement) ─────────
  const paginationResult = useMemo(
    () => calculatePagination(questions, settings, subjects, getPaperDimensions()),
    [questions, settings, subjects, getPaperDimensions],
  );

  const pages = paginationResult.pages;
  const firstPageEnd = paginationResult.firstPageEnd;

  const distributionStats = useMemo(
    () => calculateDistributionStats(questions, subjects),
    [questions, subjects],
  );

  const value = {
    questions,
    subjects,
    settings,
    isEditing,
    zoom,
    onUpdateQuestion,
    onDeleteQuestion,
    onDuplicateQuestion,
    onReorderQuestions,
    onSettingsChange,
    pages,
    autoScale,
    activeContext,
    activeElement,
    showToolbar,
    isToolbarInteracting,
    firstPageEnd,
    containerRef,
    toolbarRef,
    effectiveScale,
    shouldRestrictHeaderWidth,
    distributionStats,
    setActiveContext,
    setActiveElement,
    setShowToolbar,
    setIsToolbarInteracting,
    handleStyleChange,
    handleOptionsColumnsChange,
    handleHeaderFocus,
    handleQuestionFocus,
    handleBlur,
    handleToolbarInteractionStart,
    handleToolbarInteractionEnd,
    updateSetting,
    getHeaderStyle,
    getPaperStyle,
    getPaperDimensions,
  };

  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  );
};
