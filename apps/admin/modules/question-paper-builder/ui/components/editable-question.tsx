"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy, MoreVertical } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";

import { PaperQuestion, PaperSettings, ElementStyle } from "./types";

interface EditableQuestionProps {
  question: PaperQuestion;
  settings: PaperSettings;
  onUpdate: (question: PaperQuestion) => void;
  onDelete: (id: string) => void;
  onDuplicate: (question: PaperQuestion) => void;
  isEditing: boolean;
  isDraggable?: boolean;
  onFocus?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: "question" | "option" | "statement" | "context",
    index?: number,
    currentStyle?: ElementStyle,
  ) => void;
  onBlur?: () => void;
}

// Inline editable styles
const editableBaseClass = "transition-all duration-200 rounded px-1 -mx-1";
const editableHoverClass =
  "hover:bg-primary/10 hover:ring-1 hover:ring-primary/30";
const editableFocusClass =
  "focus:bg-primary/5 focus:ring-2 focus:ring-primary focus:outline-none";

export const EditableQuestion: React.FC<EditableQuestionProps> = ({
  question,
  settings,
  onUpdate,
  onDelete,
  onDuplicate,
  isEditing,
  isDraggable = false,
  onFocus,
  onBlur,
}) => {
  const [localQuestion, setLocalQuestion] = useState(question);

  // Sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id, disabled: !isDraggable });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Sync local state when question prop changes
  React.useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const getQuestionStyle = (): ElementStyle => {
    return (
      localQuestion.questionStyle || {
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        textAlign: "left",
      }
    );
  };

  const getOptionStyle = (index: number): ElementStyle => {
    return (
      localQuestion.options[index]?.style || {
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        textAlign: "left",
      }
    );
  };

  const getStatementStyle = (index: number): ElementStyle => {
    return (
      localQuestion.statementStyles?.[index] || {
        fontSize: settings.fontSize - 1,
        fontFamily: settings.fontFamily,
        textAlign: "left",
      }
    );
  };

  const getContextStyle = (): ElementStyle => {
    return (
      localQuestion.contextStyle || {
        fontSize: settings.fontSize - 1,
        fontFamily: settings.fontFamily,
        textAlign: "left",
      }
    );
  };

  const handleQuestionChange = (value: string) => {
    const updated = { ...localQuestion, question: value };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...localQuestion.options];
    if (!newOptions[index]) {
      newOptions[index] = { label: "", text: value };
    } else {
      newOptions[index] = { ...newOptions[index], text: value };
    }
    const updated = { ...localQuestion, options: newOptions };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const handleContextChange = (value: string) => {
    const updated = { ...localQuestion, context: value };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const renderOptionLabel = (label: string) => {
    switch (settings.optionStyle) {
      case "dot":
        return <span className="shrink-0">{label}.</span>;
      case "bracket":
        return <span className="shrink-0">{label})</span>;
      case "round":
        return (
          <span
            className="shrink-0 rounded-full border border-current font-medium inline-block text-center mr-0"
            style={{
              width: "0.875rem",
              height: "0.875rem",
              fontSize: "0.55rem",
              lineHeight: "0.8rem",
              verticalAlign: "middle",
              paddingTop: "0px",
            }}
          >
            {label}
          </span>
        );
      case "parentheses":
      default:
        return <span className="shrink-0">({label})</span>;
    }
  };

  const getBengaliNumber = (num: number): string => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => bengaliDigits[parseInt(digit)])
      .join("");
  };

  const questionStyle = getQuestionStyle();

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      className={cn(
        "group relative py-0 transition-all",
        isEditing && "hover:bg-muted/30 rounded-lg px-2",
        isDragging && "z-50",
      )}
    >
      {isEditing && isDraggable && (
        <div
          className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {isEditing && (
        <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-popover border shadow-md z-50"
            >
              <DropdownMenuItem onClick={() => onDuplicate(question)}>
                <Copy className="w-4 h-4 mr-2" />
                ডুপ্লিকেট করুন
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(question.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                মুছে ফেলুন
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Question Reference — font size 10 in square brackets */}
      {settings.showReference &&
        question.reference &&
        question.reference.length > 0 && (
          <div className="absolute -right-2 -top-1 z-10">
            <span className="text-[10px] font-medium text-muted-foreground/60 whitespace-nowrap">
              [{question.reference.join(", ")}]
            </span>
          </div>
        )}
      <div className="flex gap-2">
        <span
          className="font-bold shrink-0"
          style={{
            fontSize: questionStyle.fontSize,
            fontFamily: questionStyle.fontFamily,
          }}
        >
          {getBengaliNumber(question.number)}।
        </span>
        <div className="flex-1">
          {/* Context if present or contextual type */}
          {(localQuestion.context?.trim() ||
            localQuestion.type === "contextual") && (
            <div className="mb-0">
              {isEditing ? (
                <textarea
                  value={localQuestion.context || ""}
                  onChange={(e) => handleContextChange(e.target.value)}
                  onFocus={(e) =>
                    onFocus?.(e, "context", undefined, getContextStyle())
                  }
                  onBlur={onBlur}
                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                    }
                  }}
                  className={cn(
                    "w-full bg-muted/30 border-0 resize-none font-medium italic rounded-lg overflow-hidden",
                    editableBaseClass,
                    editableHoverClass,
                    editableFocusClass,
                  )}
                  style={{
                    fontSize: getContextStyle().fontSize,
                    fontFamily: getContextStyle().fontFamily,
                    lineHeight: settings.lineHeight,
                    textAlign: getContextStyle()
                      .textAlign as React.CSSProperties["textAlign"],
                  }}
                  rows={1}
                  placeholder="উদ্দীপক/অনুচ্ছেদ লিখুন..."
                />
              ) : (
                localQuestion.context && (
                  <p
                    className="m-0 font-medium italic text-foreground bg-black/5 p-1 rounded-lg"
                    style={{
                      fontSize: getContextStyle().fontSize,
                      fontFamily: getContextStyle().fontFamily,
                      lineHeight: settings.lineHeight,
                      textAlign: getContextStyle()
                        .textAlign as React.CSSProperties["textAlign"],
                    }}
                  >
                    {localQuestion.context}
                  </p>
                )
              )}
            </div>
          )}

          {isEditing ? (
            <textarea
              value={localQuestion.question}
              onChange={(e) => handleQuestionChange(e.target.value)}
              onFocus={(e) =>
                onFocus?.(e, "question", undefined, questionStyle)
              }
              onBlur={onBlur}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }
              }}
              className={cn(
                "w-full bg-transparent border-0 resize-none font-bold overflow-hidden",
                editableBaseClass,
                editableHoverClass,
                editableFocusClass,
              )}
              style={{
                fontSize: questionStyle.fontSize,
                fontFamily: questionStyle.fontFamily,
                lineHeight: settings.lineHeight,
                textAlign:
                  questionStyle.textAlign as React.CSSProperties["textAlign"],
              }}
              rows={1}
              placeholder="প্রশ্ন লিখুন..."
            />
          ) : (
            <p
              className="m-0 font-bold"
              style={{
                fontSize: questionStyle.fontSize,
                fontFamily: questionStyle.fontFamily,
                lineHeight: settings.lineHeight,
                textAlign:
                  questionStyle.textAlign as React.CSSProperties["textAlign"],
              }}
            >
              {localQuestion.question}
            </p>
          )}

          {/* Statements if present */}
          {question.statements && question.statements.length > 0 && (
            <div className="mt-0 space-y-0">
              {question.statements.map((statement, idx) => {
                const statementStyle = getStatementStyle(idx);
                return (
                  <div
                    key={idx}
                    className="flex gap-2"
                    style={{
                      fontSize: statementStyle.fontSize,
                      fontFamily: statementStyle.fontFamily,
                    }}
                  >
                    <span className="text-muted-foreground shrink-0">
                      {["i", "ii", "iii", "iv"][idx]}.
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={statement}
                        onChange={(e) => {
                          const newStatements = [
                            ...(localQuestion.statements || []),
                          ];
                          newStatements[idx] = e.target.value;
                          const updated = {
                            ...localQuestion,
                            statements: newStatements,
                          };
                          setLocalQuestion(updated);
                          onUpdate(updated);
                        }}
                        onFocus={(e) =>
                          onFocus?.(e, "statement", idx, statementStyle)
                        }
                        onBlur={onBlur}
                        className={cn(
                          "flex-1 bg-transparent border-0",
                          editableBaseClass,
                          editableHoverClass,
                          editableFocusClass,
                        )}
                        style={{
                          textAlign:
                            statementStyle.textAlign as React.CSSProperties["textAlign"],
                        }}
                        placeholder="বিবৃতি লিখুন..."
                      />
                    ) : (
                      <span
                        style={{
                          textAlign:
                            statementStyle.textAlign as React.CSSProperties["textAlign"],
                        }}
                      >
                        {statement}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Options Grid */}
          <div
            className={cn(
              "mt-0 gap-x-4 gap-y-0",
              (() => {
                if (localQuestion.optionsColumns === 1) return "flex flex-col";
                if (localQuestion.optionsColumns === 2)
                  return "grid grid-cols-2";

                const maxLen = Math.max(
                  ...localQuestion.options.map((o) => o.text.length),
                  0,
                );

                // Baseline: 50 chars for 1-col, 24 for 2-col at standard 14px font
                // Scale threshold based on font size (bigger font = smaller threshold)
                const baseThreshold = settings.columns === 1 ? 50 : 24;
                const threshold = Math.floor(
                  baseThreshold * (14 / settings.fontSize),
                );

                if (maxLen > threshold || settings.columns >= 3) {
                  return "flex flex-col";
                }
                return "grid grid-cols-2";
              })(),
            )}
            style={{ lineHeight: settings.lineHeight }}
          >
            {localQuestion.options.map((option, idx) => {
              const optionStyle = getOptionStyle(idx);
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center gap-2",
                    settings.optionStyle === "round" && "gap-2",
                  )}
                  style={{
                    fontSize: optionStyle.fontSize,
                    fontFamily: optionStyle.fontFamily,
                  }}
                >
                  {renderOptionLabel(option.label)}
                  {isEditing ? (
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      onFocus={(e) => onFocus?.(e, "option", idx, optionStyle)}
                      onBlur={onBlur}
                      className={cn(
                        "flex-1 bg-transparent border-0 min-w-0",
                        editableBaseClass,
                        editableHoverClass,
                        editableFocusClass,
                      )}
                      style={{
                        textAlign:
                          optionStyle.textAlign as React.CSSProperties["textAlign"],
                      }}
                      placeholder="অপশন লিখুন..."
                    />
                  ) : (
                    <span
                      style={{
                        textAlign:
                          optionStyle.textAlign as React.CSSProperties["textAlign"],
                      }}
                    >
                      {option.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
