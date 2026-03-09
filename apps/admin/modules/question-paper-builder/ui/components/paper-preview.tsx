"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { cn } from "@workspace/ui/lib/utils";

import {
  PaperQuestion,
  PaperSettings,
  ElementStyle,
  ActiveElementContext,
  HeaderStyles,
} from "./types";

import { EditableQuestion } from "./editable-question";
import { FloatingToolbar } from "./floating-toolbar";
import Image from "next/image";

interface PaperPreviewProps {
  questions: PaperQuestion[];
  settings: PaperSettings;
  onUpdateQuestion: (question: PaperQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (question: PaperQuestion) => void;
  onReorderQuestions?: (questions: PaperQuestion[]) => void;
  onSettingsChange: (settings: PaperSettings) => void;
  isEditing: boolean;
  zoom?: number | "auto";
}

// Inline editable styles
const editableBaseClass = "transition-all duration-200 rounded px-1 -mx-1";
const editableHoverClass =
  "hover:bg-primary/10 hover:ring-1 hover:ring-primary/30";
const editableFocusClass =
  "focus:bg-primary/5 focus:ring-2 focus:ring-primary focus:outline-none";

const toBengaliDigits = (num: string | number): string => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit)] as string);
};

const toEnglishDigits = (str: string): string => {
  const bengaliToEnglish: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return str.replace(/[০-৯]/g, (digit) => bengaliToEnglish[digit] || digit);
};

interface HeaderEditableProps {
  value: string;
  onChange: (value: string) => void;
  style: ElementStyle;
  isEditing: boolean;
  field: keyof HeaderStyles;
  onFocus: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof HeaderStyles,
  ) => void;
  onBlur: () => void;
  as?: "input" | "textarea";
  placeholder?: string;
  className?: string;
  editableClasses: {
    base: string;
    hover: string;
    focus: string;
  };
}

const HeaderEditable: React.FC<HeaderEditableProps> = ({
  value,
  onChange,
  style,
  isEditing,
  field,
  onFocus,
  onBlur,
  as = "input",
  placeholder,
  className,
  editableClasses,
}) => {
  const isCentered =
    style.textAlign === "center" || style.textAlign === undefined;

  const inlineStyle = {
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    textAlign: style.textAlign as React.CSSProperties["textAlign"],
  };

  if (!isEditing) {
    return (
      <span
        className={cn(className, isCentered && "block w-full")}
        style={inlineStyle}
      >
        {value}
      </span>
    );
  }

  const inputClasses = cn(
    "bg-transparent border-0 p-0 px-0.5 focus:ring-0 text-[inherit]",
    as === "textarea" || isCentered || className?.includes("w-full")
      ? "w-full block"
      : "w-auto min-w-[20px] inline-block",
    isCentered && "text-center",
    editableClasses.base,
    editableClasses.hover,
    editableClasses.focus,
    className,
  );

  if (as === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => onFocus(e, field)}
        onBlur={onBlur}
        className={cn(
          inputClasses,
          "resize-none min-h-[1.5em] overflow-hidden",
        )}
        style={inlineStyle}
        placeholder={placeholder}
        rows={1}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => onFocus(e, field)}
      onBlur={onBlur}
      className={inputClasses}
      style={{
        ...inlineStyle,
        width:
          !isCentered && !className?.includes("w-full")
            ? `${Math.max(value.length * 1.8 + 0.5, 2)}ch`
            : "100%",
      }}
      placeholder={placeholder}
    />
  );
};

export const PaperPreview: React.FC<PaperPreviewProps> = ({
  questions,
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
  const [pages, setPages] = useState<PaperQuestion[][]>([[]]);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureHeaderRef = useRef<HTMLDivElement>(null);
  const measureFirstQuestionsRef = useRef<HTMLDivElement>(null);
  const measureRestQuestionsRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track how many questions go on page 1 so the rest-container only renders remaining
  const [firstPageEnd, setFirstPageEnd] = useState(questions.length);

  const isLandscape = settings.paperOrientation === "landscape";
  const isMultiColumn = settings.columns > 1;
  const shouldRestrictHeaderWidth = isLandscape && isMultiColumn;

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = questions.findIndex((q) => q.id === active.id);
        const newIndex = questions.findIndex((q) => q.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(questions, oldIndex, newIndex);
          // Renumber questions
          const renumbered = reordered.map((q, idx) => ({
            ...q,
            number: idx + 1,
          }));
          onReorderQuestions?.(renumbered);
        }
      }
    },
    [questions, onReorderQuestions],
  );

  // Effective scale based on zoom mode
  const effectiveScale = zoom === "auto" ? autoScale : zoom;

  // Paper dimensions in mm
  const getPaperDimensions = useCallback(() => {
    const isLandscape = settings.paperOrientation === "landscape";

    const dimensions = {
      A4: { width: 210, height: 297 },
      Letter: { width: 216, height: 279 },
      Legal: { width: 216, height: 356 },
      A5: { width: 148, height: 210 },
    };

    const size = dimensions[settings.paperSize] || dimensions.A4;
    return isLandscape ? { width: size.height, height: size.width } : size;
  }, [settings.paperSize, settings.paperOrientation]);

  // Convert mm to px (approximately 3.78 px per mm at 96 DPI)
  const mmToPx = (mm: number) => mm * 3.78;

  // DOM-measured pagination:
  // 1) First page uses (pageHeight - padding - actual header height)
  // 2) Subsequent pages use (pageHeight - padding)
  // We leverage CSS columns: when content overflows a fixed-height column container,
  // the browser generates additional columns to the right. We map every group of
  // `settings.columns` columns to one page.
  const computePageIndicesFromColumnOverflow = useCallback(
    (columnContainer: HTMLDivElement) => {
      const cols = settings.columns;
      if (!cols || cols < 1) return [] as number[];

      const items = Array.from(
        columnContainer.querySelectorAll<HTMLElement>("[data-question-index]"),
      );
      if (items.length === 0) return [] as number[];

      const containerRect = columnContainer.getBoundingClientRect();
      const styles = getComputedStyle(columnContainer);
      const gapPxRaw = parseFloat(styles.columnGap || "0");
      const gapPx = Number.isFinite(gapPxRaw) && gapPxRaw > 0 ? gapPxRaw : 24; // matches 1.5rem gap below
      const colWidth = (containerRect.width - gapPx * (cols - 1)) / cols;
      const stride = colWidth + gapPx;

      return items.map((el) => {
        const rect = el.getBoundingClientRect();
        const left = rect.left - containerRect.left;
        const colIndex = Math.floor((left + 1) / stride);
        return Math.floor(colIndex / cols);
      });
    },
    [settings.columns],
  );

  useLayoutEffect(() => {
    if (!measureFirstQuestionsRef.current || !measureRestQuestionsRef.current)
      return;

    const paper = getPaperDimensions();
    const pageHeightPx = mmToPx(paper.height);
    const paddingTopPx = mmToPx(settings.margins.top);
    const paddingBottomPx = mmToPx(settings.margins.bottom);

    // Add buffers for header margins (approx 8px for mb-2) and a small safety margin for browser rendering variances
    const headerMarginBuffer = 8;
    const generalSafetyBuffer = 12; // 12px ≈ 3mm buffer to be safe against overflow

    const headerHeightPx = shouldRestrictHeaderWidth
      ? 0
      : (measureHeaderRef.current?.offsetHeight ?? 180) + headerMarginBuffer;
    const firstPageQuestionsHeight = Math.max(
      80,
      pageHeightPx -
        paddingTopPx -
        paddingBottomPx -
        headerHeightPx -
        generalSafetyBuffer,
    );
    const restPageQuestionsHeight = Math.max(
      80,
      pageHeightPx - paddingTopPx - paddingBottomPx - generalSafetyBuffer,
    );

    // Apply heights to the hidden measuring containers
    measureFirstQuestionsRef.current.style.height = `${firstPageQuestionsHeight}px`;
    measureRestQuestionsRef.current.style.height = `${restPageQuestionsHeight}px`;

    const firstIndices = computePageIndicesFromColumnOverflow(
      measureFirstQuestionsRef.current,
    );
    const overflowAt = firstIndices.findIndex((p) => p >= 1);
    const computedFirstEnd = overflowAt === -1 ? questions.length : overflowAt;

    const firstPageQuestions = questions.slice(0, computedFirstEnd);
    const remainingQuestions = questions.slice(computedFirstEnd);

    if (remainingQuestions.length === 0) {
      const finalPages = [firstPageQuestions];
      requestAnimationFrame(() => {
        setPages((prev) =>
          prev.length === 1 && prev[0]?.length === finalPages[0]?.length
            ? prev
            : finalPages,
        );
      });
      return;
    }

    const restIndices = computePageIndicesFromColumnOverflow(
      measureRestQuestionsRef.current,
    );

    const restPages: PaperQuestion[][] = [];
    remainingQuestions.forEach((q, idx) => {
      // Use local index — the rest container only renders remainingQuestions
      const pageIndex = restIndices[idx] ?? 0;
      if (!restPages[pageIndex]) restPages[pageIndex] = [];
      restPages[pageIndex].push(q);
    });

    const merged = [
      firstPageQuestions,
      ...restPages.filter((p) => p && p.length > 0),
    ];
    const finalPages = merged.length ? merged : [[]];

    // Defer the state update to satisfy the "synchronous cascading render" warning
    // and only update if the content has actually changed to prevent loops.
    setFirstPageEnd(computedFirstEnd);
    setPages((prev) => {
      // More robust heuristic: check if number of pages is same, each page has same number of questions,
      // and every question is the exact same reference as before.
      if (prev.length === finalPages.length) {
        const isSame = prev.every((page, i) => {
          const finalPage = finalPages[i];
          return (
            finalPage &&
            page.length === finalPage.length &&
            page.every((q, j) => q === finalPage[j])
          );
        });
        if (isSame) return prev;
      }
      return finalPages;
    });
  }, [
    questions,
    settings.paperSize,
    settings.paperOrientation,
    settings.margins,
    settings.columns,
    settings.showInstructions,
    settings.showNoMarkingNote,
    settings.showTime,
    settings.showTotalMarks,
    settings.showClassName,
    settings.showSubjectName,
    settings.showChapterName,
    settings.showSetCode,
    settings.showExamName,
    computePageIndicesFromColumnOverflow,
    getPaperDimensions,
    shouldRestrictHeaderWidth,
  ]);

  // Calculate auto-scale to fit paper in container
  useEffect(() => {
    if (zoom !== "auto") return;

    const calculateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth - 48;

      const paper = getPaperDimensions();
      const paperWidthPx = paper.width * 3.78;

      const scaleX = containerWidth / paperWidthPx;

      const newScale = Math.min(scaleX, 1);
      setAutoScale(Math.max(0.25, newScale));
    };

    calculateScale();

    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [settings.paperSize, settings.paperOrientation, zoom, getPaperDimensions]);

  // Get paper dimensions for styling
  const getPaperStyle = (): React.CSSProperties => {
    const paper = getPaperDimensions();

    return {
      width: `${paper.width}mm`,
      height: `${paper.height}mm`,
      fontFamily: "SolaimanLipi, sans-serif",
      lineHeight: settings.lineHeight || 1.1,
    };
  };

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
        headerStyles: {
          ...settings.headerStyles,
          [field]: style,
        },
      });
    },
    [settings, onSettingsChange],
  );

  const handleHeaderFocus = useCallback(
    (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: keyof HeaderStyles,
    ) => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      setActiveElement(e.target as HTMLElement);
      setActiveContext({
        type: "header",
        field,
        currentStyle: getHeaderStyle(field),
      });
      setShowToolbar(true);
    },
    [getHeaderStyle, setActiveContext, setShowToolbar],
  );

  const handleQuestionFocus = useCallback(
    (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
      questionId: string,
      type: "question" | "option" | "statement",
      index?: number,
      currentStyle?: ElementStyle,
    ) => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      setActiveElement(e.target as HTMLElement);
      setActiveContext({
        type,
        questionId,
        optionIndex: type === "option" ? index : undefined,
        statementIndex: type === "statement" ? index : undefined,
        currentStyle: currentStyle || {
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
          textAlign: "left",
        },
        optionsColumns: questions.find((q) => q.id === questionId)
          ?.optionsColumns,
      });
      setShowToolbar(true);
    },
    [
      questions,
      settings.fontSize,
      settings.fontFamily,
      setActiveContext,
      setShowToolbar,
    ],
  );

  const handleOptionsColumnsChange = useCallback(
    (cols: 1 | 2) => {
      if (!activeContext || !activeContext.questionId) return;

      const question = questions.find((q) => q.id === activeContext.questionId);
      if (!question) return;

      onUpdateQuestion({
        ...question,
        optionsColumns: cols,
      });

      setActiveContext({
        ...activeContext,
        optionsColumns: cols,
      });
    },
    [activeContext, questions, onUpdateQuestion],
  );

  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const handleBlur = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    blurTimeoutRef.current = setTimeout(() => {
      const activeEl = document.activeElement;
      const isStillInInput =
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
      // Also stay open when focus moved into the floating toolbar itself
      const isInToolbar =
        toolbarRef.current && activeEl && toolbarRef.current.contains(activeEl);

      if (!isToolbarInteracting && !isStillInInput && !isInToolbar) {
        setShowToolbar(false);
        setActiveContext(null);
        setActiveElement(null);
      }
    }, 200);
  }, [isToolbarInteracting, setShowToolbar, setActiveContext]);

  const handleToolbarInteractionStart = useCallback(() => {
    setIsToolbarInteracting(true);
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  }, [setIsToolbarInteracting]);

  const handleToolbarInteractionEnd = useCallback(() => {
    setIsToolbarInteracting(false);
  }, [setIsToolbarInteracting]);

  const handleStyleChange = useCallback(
    (newStyle: ElementStyle) => {
      if (!activeContext) return;

      if (activeContext.type === "header" && activeContext.field) {
        updateHeaderStyle(activeContext.field, newStyle);
        setActiveContext({ ...activeContext, currentStyle: newStyle });
      } else if (activeContext.questionId) {
        const question = questions.find(
          (q) => q.id === activeContext.questionId,
        );
        if (!question) return;

        const updatedQuestion = { ...question };

        if (activeContext.type === "question") {
          updatedQuestion.questionStyle = newStyle;
        } else if (
          activeContext.type === "option" &&
          activeContext.optionIndex !== undefined
        ) {
          const newOptions = [...updatedQuestion.options];
          const optionIndex = activeContext.optionIndex;
          const currentOption = newOptions[optionIndex];
          if (currentOption) {
            newOptions[optionIndex] = {
              ...currentOption,
              style: newStyle,
            };
            updatedQuestion.options = newOptions;
          }
        } else if (
          activeContext.type === "statement" &&
          activeContext.statementIndex !== undefined
        ) {
          const newStyles = [...(updatedQuestion.statementStyles || [])];
          newStyles[activeContext.statementIndex] = newStyle;
          updatedQuestion.statementStyles = newStyles;
        }

        onUpdateQuestion(updatedQuestion);
        setActiveContext({ ...activeContext, currentStyle: newStyle });
      }
    },
    [activeContext, questions, onUpdateQuestion, updateHeaderStyle],
  );

  const updateSetting = useCallback(
    <K extends keyof PaperSettings>(key: K, value: PaperSettings[K]) => {
      onSettingsChange({ ...settings, [key]: value });
    },
    [settings, onSettingsChange],
  );

  const renderHeader = () => (
    <div className="relative mb-2" style={{ breakInside: "avoid" }}>
      {/* Top Section: Logo, Institution Info, and Set Code */}
      <div className="flex flex-col items-center justify-center relative mb-1">
        {/* Logo - Positioned left if enabled */}
        {settings.showLogo && (
          <div className="absolute left-0 top-0 pt-2">
            {settings.logoUrl && !settings.logoUrl.includes("placeholder") ? (
              <Image
                src={settings.logoUrl}
                alt="Logo"
                width={70}
                height={70}
                className="max-w-[70px] max-h-[70px] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (
                    e.target as HTMLImageElement
                  ).nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={cn(
                "w-16 h-16 border border-dashed border-muted-foreground/30 flex items-center justify-center rounded bg-muted/10",
                settings.logoUrl && !settings.logoUrl.includes("placeholder")
                  ? "hidden"
                  : "",
              )}
            >
              <span className="text-[10px] text-muted-foreground font-bold uppercase">
                Logo
              </span>
            </div>
          </div>
        )}

        {/* Set Code Box - Absolute Top Right */}
        {settings.showSetCode && (
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <span className="text-sm font-medium">সেট :</span>
            <div className="border-[1px] border-black flex items-center justify-center font-bold rounded-none w-6 h-6 overflow-visible">
              <span
                className="text-center font-bold"
                style={{
                  fontSize: getHeaderStyle("setCode").fontSize,
                  fontFamily: getHeaderStyle("setCode").fontFamily,
                }}
              >
                {settings.setCode || "ক"}
              </span>
            </div>
          </div>
        )}

        <div className="text-center space-y-1">
          <HeaderEditable
            value={settings.institutionName}
            onChange={(v) => updateSetting("institutionName", v)}
            field="institutionName"
            style={getHeaderStyle("institutionName")}
            isEditing={isEditing}
            onFocus={handleHeaderFocus}
            onBlur={handleBlur}
            editableClasses={{
              base: editableBaseClass,
              hover: editableHoverClass,
              focus: editableFocusClass,
            }}
            className="font-bold block leading-tight text-xl mb-1"
            placeholder="প্রতিষ্ঠানের নাম"
          />

          {settings.showExamName && (
            <HeaderEditable
              value={settings.examName}
              onChange={(v) => updateSetting("examName", v)}
              field="examName"
              style={getHeaderStyle("examName")}
              isEditing={isEditing}
              onFocus={handleHeaderFocus}
              onBlur={handleBlur}
              editableClasses={{
                base: editableBaseClass,
                hover: editableHoverClass,
                focus: editableFocusClass,
              }}
              className="font-bold block leading-tight text-lg"
              placeholder="পরীক্ষার নাম"
            />
          )}

          {settings.showClassName && (
            <HeaderEditable
              value={settings.className}
              onChange={(v) => updateSetting("className", v)}
              field="className"
              style={getHeaderStyle("className")}
              isEditing={isEditing}
              onFocus={handleHeaderFocus}
              onBlur={handleBlur}
              editableClasses={{
                base: editableBaseClass,
                hover: editableHoverClass,
                focus: editableFocusClass,
              }}
              className="block font-medium"
              placeholder="শ্রেণি"
            />
          )}

          {settings.showSubjectName && (
            <HeaderEditable
              value={settings.subjectName}
              onChange={(v) => updateSetting("subjectName", v)}
              field="subjectName"
              style={getHeaderStyle("subjectName")}
              isEditing={isEditing}
              onFocus={handleHeaderFocus}
              onBlur={handleBlur}
              editableClasses={{
                base: editableBaseClass,
                hover: editableHoverClass,
                focus: editableFocusClass,
              }}
              className="block font-medium"
              placeholder="বিষয়ের নাম"
            />
          )}

          {settings.showChapterName && (
            <HeaderEditable
              value={settings.chapterName}
              onChange={(v) => updateSetting("chapterName", v)}
              field="chapterName"
              style={getHeaderStyle("chapterName")}
              isEditing={isEditing}
              onFocus={handleHeaderFocus}
              onBlur={handleBlur}
              editableClasses={{
                base: editableBaseClass,
                hover: editableHoverClass,
                focus: editableFocusClass,
              }}
              className="block"
              placeholder="অধ্যায়ের নাম"
            />
          )}
        </div>
      </div>

      {/* Time & Marks Section - Single Line */}
      <div className="flex justify-between items-center py-1 mt-1 mb-0 px-1 text-sm">
        {settings.showTime ? (
          <div className="flex items-center whitespace-nowrap">
            <span className="font-bold mr-1">সময় —</span>
            <HeaderEditable
              value={settings.time}
              onChange={(v) => updateSetting("time", v)}
              field="time"
              style={getHeaderStyle("time")}
              isEditing={isEditing}
              onFocus={handleHeaderFocus}
              onBlur={handleBlur}
              editableClasses={{
                base: editableBaseClass,
                hover: editableHoverClass,
                focus: editableFocusClass,
              }}
              placeholder="সময়"
            />
          </div>
        ) : (
          <div />
        )}

        {settings.showTotalMarks ? (
          <div className="flex items-center whitespace-nowrap text-right">
            <span className="font-bold mr-1">পূর্ণমান —</span>
            <HeaderEditable
              value={toBengaliDigits(settings.totalMarks)}
              onChange={(v) => {
                const englishVal = toEnglishDigits(v);
                updateSetting("totalMarks", parseInt(englishVal) || 0);
              }}
              field="totalMarks"
              style={getHeaderStyle("totalMarks")}
              isEditing={isEditing}
              onFocus={handleHeaderFocus}
              onBlur={handleBlur}
              editableClasses={{
                base: editableBaseClass,
                hover: editableHoverClass,
                focus: editableFocusClass,
              }}
              placeholder="পূর্ণমান"
            />
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Instructions */}
      {settings.showInstructions && (
        <div className="mb-0 px-1 text-sm border-t border-dashed border-black pt-1 mt-0">
          <div className="flex gap-2">
            <div className="flex-1">
              <HeaderEditable
                value={settings.instructions}
                onChange={(v) => updateSetting("instructions", v)}
                field="instructions"
                style={getHeaderStyle("instructions")}
                isEditing={isEditing}
                onFocus={handleHeaderFocus}
                onBlur={handleBlur}
                editableClasses={{
                  base: editableBaseClass,
                  hover: editableHoverClass,
                  focus: editableFocusClass,
                }}
                as="textarea"
                className="w-full leading-relaxed"
                placeholder="নির্দেশনা লিখুন..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Warning / Marking Note */}
      {settings.showNoMarkingNote && (
        <div className="text-center mt-0 mb-1">
          <p className="text-[13px] font-bold inline-block px-4">
            প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবেনা।
          </p>
        </div>
      )}
    </div>
  );

  // Render questions for a page
  const renderQuestions = (
    pageQuestions: PaperQuestion[],
    pageIndex: number,
  ) => (
    <div
      className="pagination-column-container"
      style={{
        columnCount: settings.columns,
        columnGap: "1.5rem",
        columnFill: "auto",
        columnRule: settings.showColumnDivider ? "1px solid #000000" : "none",
        WebkitColumnRule: settings.showColumnDivider
          ? "1px solid #000000"
          : "none",
        MozColumnRule: settings.showColumnDivider
          ? "1px solid #000000"
          : "none",
        overflow: "visible",
        flex: "1 1 auto",
        minHeight: 0,
        background:
          settings.columns === 2 && settings.showColumnDivider
            ? "linear-gradient(to right, transparent calc(50% - 0.5px), #000000 calc(50% - 0.5px), #000000 calc(50% + 0.5px), transparent calc(50% + 0.5px))"
            : "none",
      }}
    >
      {pageIndex === 0 && shouldRestrictHeaderWidth && renderHeader()}
      {pageQuestions.map((q) => {
        // Look up the latest question data from props to ensure real-time styling updates
        // even if the pagination state (pages) is still catching up.
        const question = questions.find((prevQ) => prevQ.id === q.id) || q;
        return (
          <div key={question.id} style={{ breakInside: "avoid" }}>
            <EditableQuestion
              question={question}
              settings={settings}
              onUpdate={onUpdateQuestion}
              onDelete={onDeleteQuestion}
              onDuplicate={onDuplicateQuestion}
              isEditing={isEditing}
              isDraggable={
                isEditing && !!onReorderQuestions && settings.columns === 1
              }
              onFocus={(e, type, index, style) =>
                handleQuestionFocus(e, question.id, type, index, style)
              }
              onBlur={handleBlur}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-0 overflow-auto scroll-smooth p-6"
    >
      {/* Floating Toolbar */}
      <FloatingToolbar
        ref={toolbarRef}
        target={activeElement}
        isVisible={showToolbar && isEditing && activeContext !== null}
        currentStyle={
          activeContext?.currentStyle || {
            fontSize: 14,
            fontFamily: "SolaimanLipi",
            textAlign: "left",
          }
        }
        onStyleChange={handleStyleChange}
        showAlignment={true}
        optionsColumns={activeContext?.optionsColumns}
        onOptionsColumnsChange={
          activeContext?.type === "question" || activeContext?.type === "option"
            ? handleOptionsColumnsChange
            : undefined
        }
        onInteractionStart={handleToolbarInteractionStart}
        onInteractionEnd={handleToolbarInteractionEnd}
      />

      {/* Hidden measuring layout (offscreen, but rendered for accurate pagination) */}
      <div
        aria-hidden
        className="absolute left-[-99999px] top-0 pointer-events-none opacity-0"
        style={{ width: `${getPaperDimensions().width}mm` }}
      >
        {/* First-page measurement: header + fixed-height questions area */}
        <div
          className="bg-white"
          style={{
            ...getPaperStyle(),
            padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
          }}
        >
          {!shouldRestrictHeaderWidth && (
            <div ref={measureHeaderRef}>{renderHeader()}</div>
          )}
          <div
            ref={measureFirstQuestionsRef}
            style={{
              columnCount: settings.columns,
              columnGap: "1.5rem",
              columnFill: "auto",
              width: "100%",
              overflow: "visible",
            }}
          >
            {shouldRestrictHeaderWidth && renderHeader()}
            {questions.map((question, idx) => (
              <div
                key={question.id}
                data-question-index={idx}
                style={{ breakInside: "avoid" }}
              >
                <EditableQuestion
                  question={question}
                  settings={settings}
                  onUpdate={onUpdateQuestion}
                  onDelete={onDeleteQuestion}
                  onDuplicate={onDuplicateQuestion}
                  isEditing={isEditing}
                  isDraggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Subsequent-page measurement: fixed-height questions area (no header) */}
        <div
          className="bg-white"
          style={{
            ...getPaperStyle(),
            padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
          }}
        >
          <div
            ref={measureRestQuestionsRef}
            style={{
              columnCount: settings.columns,
              columnGap: "1.5rem",
              columnFill: "auto",
              width: "100%",
              overflow: "visible",
            }}
          >
            {questions.slice(firstPageEnd).map((question, idx) => (
              <div
                key={question.id}
                data-question-index={idx}
                style={{ breakInside: "avoid" }}
              >
                <EditableQuestion
                  question={question}
                  settings={settings}
                  onUpdate={onUpdateQuestion}
                  onDelete={onDeleteQuestion}
                  onDuplicate={onDuplicateQuestion}
                  isEditing={isEditing}
                  isDraggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center gap-3"
        style={{ minHeight: zoom === "auto" ? "100%" : "auto" }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {pages.map((pageQuestions, pageIndex) => (
              <div
                key={pageIndex}
                data-paper-page-wrapper
                className="origin-top transition-transform duration-200 shrink-0"
                style={{ transform: `scale(${effectiveScale})` }}
              >
                <div
                  className="bg-white shadow-lg print:shadow-none relative overflow-hidden flex flex-col"
                  style={{
                    ...getPaperStyle(),
                    padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
                  }}
                  id={`paper-preview-page-${pageIndex + 1}`}
                >
                  {/* Page number indicator (hidden during PDF export) */}
                  <div
                    data-page-indicator
                    className="page-indicator absolute top-2 right-3 text-xs text-muted-foreground/50"
                  >
                    পৃষ্ঠা {toBengaliDigits(pageIndex + 1)}/
                    {toBengaliDigits(pages.length)}
                  </div>

                  {/* Header only on first page - only if not restricted to first column */}
                  {pageIndex === 0 &&
                    !shouldRestrictHeaderWidth &&
                    renderHeader()}

                  {/* Questions */}
                  {renderQuestions(pageQuestions, pageIndex)}

                  {/* Watermark */}
                  {settings.showWatermark && settings.watermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 text-6xl font-bold rotate-[-30deg]">
                      {settings.watermark}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
