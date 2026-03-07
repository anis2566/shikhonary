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
  const activeRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureHeaderRef = useRef<HTMLDivElement>(null);
  const measureFirstQuestionsRef = useRef<HTMLDivElement>(null);
  const measureRestQuestionsRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track how many questions go on page 1 so the rest-container only renders remaining
  const [firstPageEnd, setFirstPageEnd] = useState(questions.length);

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
      const gapPx = Number.isFinite(gapPxRaw) && gapPxRaw > 0 ? gapPxRaw : 24; // 1.5rem fallback
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

    const headerHeightPx = measureHeaderRef.current?.offsetHeight ?? 180;
    const firstPageQuestionsHeight = Math.max(
      80,
      pageHeightPx - paddingTopPx - paddingBottomPx - headerHeightPx,
    );
    const restPageQuestionsHeight = Math.max(
      80,
      pageHeightPx - paddingTopPx - paddingBottomPx,
    );

    // Apply heights to the hidden measuring containers (must be done in layout effect)
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
    requestAnimationFrame(() => {
      setFirstPageEnd(computedFirstEnd);
      setPages((prev) => {
        // Simple heuristic to check if pages changed: count and first item of each page
        if (prev.length === finalPages.length) {
          const isSame = prev.every((page, i) => {
            const finalPage = finalPages[i];
            return (
              finalPage &&
              page.length === finalPage.length &&
              page[0]?.id === finalPage[0]?.id
            );
          });
          if (isSame) return prev;
        }
        return finalPages;
      });
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
    firstPageEnd,
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
      return (
        settings.headerStyles?.[field] || {
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
      activeRef.current = e.target;
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
      activeRef.current = e.target;
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
      });
      setShowToolbar(true);
    },
    [settings.fontSize, settings.fontFamily, setActiveContext, setShowToolbar],
  );

  const handleBlur = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    blurTimeoutRef.current = setTimeout(() => {
      if (!isToolbarInteracting) {
        setShowToolbar(false);
        setActiveContext(null);
        activeRef.current = null;
      }
    }, 150);
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

  // Inline editable text component for header
  const HeaderEditable: React.FC<{
    value: string;
    onChange: (value: string) => void;
    field: keyof HeaderStyles;
    as?: "input" | "textarea";
    placeholder?: string;
    className?: string;
  }> = ({ value, onChange, field, as = "input", placeholder, className }) => {
    const style = getHeaderStyle(field);
    const inlineStyle = {
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      textAlign: style.textAlign as React.CSSProperties["textAlign"],
    };

    if (!isEditing) {
      return (
        <span className={className} style={inlineStyle}>
          {value}
        </span>
      );
    }

    const inputClasses = cn(
      "bg-transparent border-0 w-full",
      editableBaseClass,
      editableHoverClass,
      editableFocusClass,
      className,
    );

    if (as === "textarea") {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => handleHeaderFocus(e, field)}
          onBlur={handleBlur}
          className={cn(inputClasses, "resize-none min-h-[3em]")}
          style={inlineStyle}
          placeholder={placeholder}
          rows={2}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => handleHeaderFocus(e, field)}
        onBlur={handleBlur}
        className={inputClasses}
        style={inlineStyle}
        placeholder={placeholder}
      />
    );
  };

  const updateSetting = useCallback(
    <K extends keyof PaperSettings>(key: K, value: PaperSettings[K]) => {
      onSettingsChange({ ...settings, [key]: value });
    },
    [settings, onSettingsChange],
  );

  // Render header (only on first page)
  const renderHeader = () => (
    <>
      {/* Header */}
      <div className="text-center border-b pb-1">
        <HeaderEditable
          value={settings.institutionName}
          onChange={(v) => updateSetting("institutionName", v)}
          field="institutionName"
          className="font-bold block"
          placeholder="প্রতিষ্ঠানের নাম"
        />

        {settings.showClassName && (
          <HeaderEditable
            value={settings.className}
            onChange={(v) => updateSetting("className", v)}
            field="className"
            className="block text-sm"
            placeholder="শ্রেণি"
          />
        )}

        {settings.showSetCode && (
          <span className="flex items-center justify-center gap-1 text-sm">
            সেট:{" "}
            {isEditing ? (
              <input
                type="text"
                value={settings.setCode}
                onChange={(e) => updateSetting("setCode", e.target.value)}
                onFocus={(e) => handleHeaderFocus(e, "setCode")}
                onBlur={handleBlur}
                className={cn(
                  "border px-1.5 py-0 font-bold w-8 text-center bg-transparent",
                  editableBaseClass,
                  editableHoverClass,
                  editableFocusClass,
                )}
                style={{
                  fontSize: getHeaderStyle("setCode").fontSize,
                  fontFamily: getHeaderStyle("setCode").fontFamily,
                }}
              />
            ) : (
              <span
                className="border px-1.5 font-bold"
                style={{
                  fontSize: getHeaderStyle("setCode").fontSize,
                  fontFamily: getHeaderStyle("setCode").fontFamily,
                }}
              >
                {settings.setCode}
              </span>
            )}
          </span>
        )}

        {settings.showSubjectName && (
          <HeaderEditable
            value={settings.subjectName}
            onChange={(v) => updateSetting("subjectName", v)}
            field="subjectName"
            className="font-medium block text-sm"
            placeholder="বিষয়ের নাম"
          />
        )}

        {settings.showChapterName && (
          <HeaderEditable
            value={settings.chapterName}
            onChange={(v) => updateSetting("chapterName", v)}
            field="chapterName"
            className="block text-sm text-muted-foreground"
            placeholder="অধ্যায়ের নাম"
          />
        )}
      </div>

      {/* Time & Marks - Styled row */}
      {(settings.showTime || settings.showTotalMarks) && (
        <div className="flex justify-between items-center text-sm py-1 border-b">
          {settings.showTime ? (
            <span
              className="flex items-center"
              style={{
                fontSize: getHeaderStyle("time").fontSize,
                fontFamily: getHeaderStyle("time").fontFamily,
              }}
            >
              সময়:{" "}
              <HeaderEditable
                value={settings.time}
                onChange={(v) => updateSetting("time", v)}
                field="time"
                className="inline-block font-medium"
                placeholder="সময়"
              />
            </span>
          ) : (
            <span />
          )}
          {settings.showTotalMarks ? (
            <span
              className="flex items-center"
              style={{
                fontSize: getHeaderStyle("totalMarks").fontSize,
                fontFamily: getHeaderStyle("totalMarks").fontFamily,
              }}
            >
              পূর্ণমান:{" "}
              {isEditing ? (
                <input
                  type="number"
                  value={settings.totalMarks}
                  onChange={(e) =>
                    updateSetting("totalMarks", parseInt(e.target.value) || 0)
                  }
                  onFocus={(e) => handleHeaderFocus(e, "totalMarks")}
                  onBlur={handleBlur}
                  className={cn(
                    "bg-transparent border-0 w-10 font-medium",
                    editableBaseClass,
                    editableHoverClass,
                    editableFocusClass,
                  )}
                />
              ) : (
                <span className="font-medium">{settings.totalMarks}</span>
              )}
            </span>
          ) : (
            <span />
          )}
        </div>
      )}

      {/* Instructions */}
      {settings.showInstructions && (
        <div className="text-muted-foreground py-1 text-sm">
          <HeaderEditable
            value={settings.instructions}
            onChange={(v) => updateSetting("instructions", v)}
            field="instructions"
            as="textarea"
            className="w-full"
            placeholder="নির্দেশনা লিখুন..."
          />
        </div>
      )}

      {settings.showNoMarkingNote && (
        <p className="text-center text-sm py-1 font-medium border-t">
          প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবেনা।
        </p>
      )}
    </>
  );

  // Render questions for a page
  const renderQuestions = (pageQuestions: PaperQuestion[]) => (
    <div
      style={{
        columnCount: settings.columns,
        columnGap: "1.5rem",
        columnFill: "auto",
        columnRule: settings.showColumnDivider
          ? "1px solid hsl(var(--border))"
          : "none",
        overflow: "hidden",
        flex: 1,
      }}
    >
      {pageQuestions.map((question) => (
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
      ))}
    </div>
  );

  return (
    <div ref={containerRef} className="w-full h-full min-h-0 overflow-auto p-6">
      {/* Floating Toolbar */}
      <FloatingToolbar
        targetRef={activeRef}
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
          <div ref={measureHeaderRef}>{renderHeader()}</div>
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
                  onFocus={(e, type, index, style) =>
                    handleQuestionFocus(e, question.id, type, index, style)
                  }
                  onBlur={handleBlur}
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
                  isEditing={false}
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
                    পৃষ্ঠা {pageIndex + 1}/{pages.length}
                  </div>

                  {/* Header only on first page */}
                  {pageIndex === 0 && renderHeader()}

                  {/* Questions */}
                  {renderQuestions(pageQuestions)}

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
