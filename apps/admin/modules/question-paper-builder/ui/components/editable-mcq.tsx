"use client";

import React, { useCallback } from "react";
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

interface EditableMcqProps {
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

const editableBaseClass = "transition-all duration-200 rounded px-1 -mx-1";
const editableHoverClass = "hover:bg-primary/10 hover:ring-1 hover:ring-primary/30";
const editableFocusClass = "focus:bg-primary/5 focus:ring-2 focus:ring-primary focus:outline-none";

export const EditableMcq: React.FC<EditableMcqProps> = React.memo(({
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

  const getQuestionStyle = useCallback((): ElementStyle => {
    return question.questionStyle || {
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      textAlign: "left",
    };
  }, [question.questionStyle, settings.fontSize, settings.fontFamily]);

  const getOptionStyle = useCallback((index: number): ElementStyle => {
    return question.options[index]?.style || {
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      textAlign: "left",
    };
  }, [question.options, settings.fontSize, settings.fontFamily]);

  const getStatementStyle = useCallback((index: number): ElementStyle => {
    return question.statementStyles?.[index] || {
      fontSize: 12,
      fontFamily: settings.fontFamily,
      textAlign: "left",
    };
  }, [question.statementStyles, settings.fontFamily]);

  const getContextStyle = useCallback((): ElementStyle => {
    return question.contextStyle || {
      fontSize: 12,
      fontFamily: settings.fontFamily,
      textAlign: "left",
    };
  }, [question.contextStyle, settings.fontFamily]);

  const handleQuestionChange = useCallback((value: string) => {
    onUpdate({ ...question, question: value });
  }, [question, onUpdate]);

  const handleOptionChange = useCallback((index: number, value: string) => {
    const newOptions = [...question.options];
    if (!newOptions[index]) {
      newOptions[index] = { label: "", text: value };
    } else {
      newOptions[index] = { ...newOptions[index], text: value };
    }
    onUpdate({ ...question, options: newOptions });
  }, [question, onUpdate]);

  const handleContextChange = useCallback((value: string) => {
    onUpdate({ ...question, context: value });
  }, [question, onUpdate]);

  const renderOptionLabel = (label: string) => {
    switch (settings.optionStyle) {
      case "dot": return <span className="shrink-0">{label}.</span>;
      case "bracket": return <span className="shrink-0">{label})</span>;
      case "round":
        return (
          <span className="shrink-0 rounded-full border border-current font-medium inline-block text-center mr-0"
                style={{ width: "0.875rem", height: "0.875rem", fontSize: "0.55rem", lineHeight: "0.8rem", verticalAlign: "middle" }}>
            {label}
          </span>
        );
      case "parentheses":
      default: return <span className="shrink-0">({label})</span>;
    }
  };

  const getBengaliNumber = (num: number): string => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(digit => bengaliDigits[parseInt(digit)]).join("");
  };

  const questionStyle = getQuestionStyle();

  return (
    <div ref={setNodeRef} style={sortableStyle} className={cn("group relative py-0 transition-all", isEditing && "hover:bg-muted/30 rounded-lg px-2", isDragging && "z-50")}>
      {isEditing && isDraggable && (
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {isEditing && (
        <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border shadow-md z-50">
              <DropdownMenuItem onClick={() => onDuplicate(question)}><Copy className="w-4 h-4 mr-2" />ডুপ্লিকেট করুন</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(question.id)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />মুছে ফেলুন</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="flex flex-col mb-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex gap-2 flex-1 relative">
            <span className="font-bold shrink-0" style={{ fontSize: questionStyle.fontSize, fontFamily: questionStyle.fontFamily }}>
              {getBengaliNumber(question.number)}।
            </span>
            <div className="flex-1">
              {(question.context?.trim() || question.type === "contextual") && (
                <div className="mb-0">
                  {isEditing ? (
                      <textarea
                        value={question.context || ""}
                        onChange={(e) => handleContextChange(e.target.value)}
                        onFocus={(e) => onFocus?.(e, "context", undefined, getContextStyle())}
                        onBlur={onBlur}
                        ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
                        className={cn("w-full bg-transparent border-0 p-0 resize-none font-medium italic overflow-hidden leading-relaxed", editableBaseClass, editableHoverClass, editableFocusClass)}
                        style={{ fontSize: getContextStyle().fontSize, fontFamily: getContextStyle().fontFamily, lineHeight: settings.lineHeight, textAlign: getContextStyle().textAlign as React.CSSProperties["textAlign"] }}
                        rows={1}
                        placeholder="উদ্দীপক/অনুচ্ছেদ লিখুন..."
                      />
                  ) : (
                    question.context && (
                      <p className="m-0 font-medium italic text-foreground leading-relaxed"
                         style={{ fontSize: getContextStyle().fontSize, fontFamily: getContextStyle().fontFamily, lineHeight: settings.lineHeight, textAlign: getContextStyle().textAlign as React.CSSProperties["textAlign"] }}>
                        {question.context}
                      </p>
                    )
                  )}
                </div>
              )}

              {isEditing ? (
                <textarea
                  value={question.question}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  onFocus={(e) => onFocus?.(e, "question", undefined, questionStyle)}
                  onBlur={onBlur}
                  ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
                  className={cn("w-full bg-transparent border-0 resize-none font-bold overflow-hidden", editableBaseClass, editableHoverClass, editableFocusClass)}
                  style={{ fontSize: questionStyle.fontSize, fontFamily: questionStyle.fontFamily, lineHeight: settings.lineHeight, textAlign: questionStyle.textAlign as React.CSSProperties["textAlign"] }}
                  rows={1}
                  placeholder="প্রশ্ন লিখুন..."
                />
              ) : (
                <p className="m-0 font-bold" style={{ fontSize: questionStyle.fontSize, fontFamily: questionStyle.fontFamily, lineHeight: settings.lineHeight, textAlign: questionStyle.textAlign as React.CSSProperties["textAlign"] }}>
                  {question.question}
                </p>
              )}

              {question.statements && question.statements.length > 0 && (
                <div className="mt-0 space-y-0">
                  {question.statements.map((statement, idx) => {
                    const statementStyle = getStatementStyle(idx);
                    return (
                      <div key={idx} className="flex gap-2" style={{ fontSize: statementStyle.fontSize, fontFamily: statementStyle.fontFamily }}>
                        <span className="text-muted-foreground shrink-0">{["i", "ii", "iii", "iv"][idx]}.</span>
                        {isEditing ? (
                          <input type="text" value={statement}
                                 onChange={(e) => {
                                   const newStatements = [...(question.statements || [])];
                                   newStatements[idx] = e.target.value;
                                   onUpdate({ ...question, statements: newStatements });
                                 }}
                                 onFocus={(e) => onFocus?.(e, "statement", idx, statementStyle)}
                                 onBlur={onBlur}
                                 className={cn("flex-1 bg-transparent border-0", editableBaseClass, editableHoverClass, editableFocusClass)}
                                 style={{ textAlign: statementStyle.textAlign as React.CSSProperties["textAlign"] }}
                                 placeholder="বিবৃতি লিখুন..."
                          />
                        ) : (
                          <span style={{ textAlign: statementStyle.textAlign as React.CSSProperties["textAlign"] }}>{statement}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className={cn("mt-0 gap-x-4 gap-y-0", (() => {
                if (question.optionsColumns === 1) return "flex flex-col";
                if (question.optionsColumns === 2) return "grid grid-cols-2";
                const maxLen = Math.max(...question.options.map(o => o.text.length), 0);
                const baseThreshold = settings.columns === 1 ? 50 : 24;
                const threshold = Math.floor(baseThreshold * (14 / settings.fontSize));
                return (maxLen > threshold || settings.columns >= 3) ? "flex flex-col" : "grid grid-cols-2";
              })())} style={{ lineHeight: settings.lineHeight }}>
                {question.options.map((option, idx) => {
                  const optionStyle = getOptionStyle(idx);
                  return (
                    <div key={idx} className={cn("flex items-center gap-2", settings.optionStyle === "round" && "gap-2")}
                         style={{ fontSize: optionStyle.fontSize, fontFamily: optionStyle.fontFamily }}>
                      {renderOptionLabel(option.label)}
                      {isEditing ? (
                        <input type="text" value={option.text}
                               onChange={(e) => handleOptionChange(idx, e.target.value)}
                               onFocus={(e) => onFocus?.(e, "option", idx, optionStyle)}
                               onBlur={onBlur}
                               className={cn("flex-1 bg-transparent border-0 min-w-0", editableBaseClass, editableHoverClass, editableFocusClass)}
                               style={{ textAlign: optionStyle.textAlign as React.CSSProperties["textAlign"] }}
                               placeholder="অপশন লিখুন..."
                        />
                      ) : (
                        <span style={{ textAlign: optionStyle.textAlign as React.CSSProperties["textAlign"] }}>{option.text}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {settings.showReference &&
        question.reference &&
        question.reference.length > 0 && (
          <div className="w-full text-right mt-1">
            <span className="text-[10px] font-medium text-muted-foreground/60 leading-tight">
              [{question.reference.join(", ")}]
            </span>
          </div>
        )}
    </div>
  );
});

EditableMcq.displayName = "EditableMcq";
