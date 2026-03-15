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
import { toBengaliDigits } from "./preview/preview-utils";

interface EditableCqProps {
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
const editableHoverClass =
  "hover:bg-primary/10 hover:ring-1 hover:ring-primary/30";
const editableFocusClass =
  "focus:bg-primary/5 focus:ring-2 focus:ring-primary focus:outline-none";

export const EditableCq: React.FC<EditableCqProps> = ({
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

  const getContextStyle = (): ElementStyle => {
    return (
      localQuestion.contextStyle || {
        fontSize: 12,
        fontFamily: settings.fontFamily,
        textAlign: "left",
      }
    );
  };

  const handleContextChange = (value: string) => {
    const updated = { ...localQuestion, context: value };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const handleSubQuestionChange = (index: number, value: string) => {
    if (!localQuestion.subQuestions) return;
    const newSubQuestions = [...localQuestion.subQuestions];
    const sq = newSubQuestions[index];
    if (sq) {
      newSubQuestions[index] = { ...sq, text: value };
    }
    const updated = { ...localQuestion, subQuestions: newSubQuestions };
    setLocalQuestion(updated);
    onUpdate(updated);
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
        "group relative transition-all border-b border-dashed last:border-0",
        isEditing && "hover:bg-muted/30 rounded-lg px-2",
        isDragging && "z-50",
      )}
    >
      {isEditing && isDraggable && (
        <div
          className="absolute -left-6 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
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

      <div className="flex flex-col mb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex gap-2 flex-1 relative">
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
                      "w-full bg-transparent border-0 p-0 resize-none font-medium overflow-hidden leading-relaxed",
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
                    placeholder="সৃজনশীল প্রশ্নের উদ্দীপক লিখুন..."
                  />
                ) : localQuestion.context ? (
                  <p
                    className="m-0 font-medium text-foreground leading-relaxed"
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
                ) : null}
              </div>

              {/* Sub-questions Area */}
              {localQuestion.subQuestions && (
                <div className="">
                  {localQuestion.subQuestions.map((sq, idx) => {
                    const sqStyle = sq.style || questionStyle;
                    return (
                      <div
                        key={idx}
                        className="flex gap-2 items-center group/sq bg-white/40 hover:bg-white/80 transition-colors border border-transparent hover:border-black/5 rounded-md"
                      >
                        <div
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-black/5 font-black shrink-0 mt-0.5"
                          style={{
                            fontSize: Math.max(
                              12,
                              (sqStyle.fontSize || settings.fontSize) - 2,
                            ),
                          }}
                        >
                          {sq.label}
                        </div>
                        {isEditing ? (
                          <textarea
                            value={sq.text}
                            onChange={(e) =>
                              handleSubQuestionChange(idx, e.target.value)
                            }
                            onFocus={(e) => onFocus?.(e, "option", idx, sqStyle)}
                            onBlur={onBlur}
                            ref={(el) => {
                              if (el) {
                                el.style.height = "auto";
                                el.style.height = el.scrollHeight + "px";
                              }
                            }}
                            className={cn(
                              "flex-1 bg-transparent border-0 resize-none overflow-hidden",
                              editableBaseClass,
                              editableHoverClass,
                              editableFocusClass,
                            )}
                            style={{
                              fontSize: sqStyle.fontSize,
                              fontFamily: sqStyle.fontFamily,
                              lineHeight: settings.lineHeight,
                              textAlign:
                                sqStyle.textAlign as React.CSSProperties["textAlign"],
                            }}
                            rows={1}
                            placeholder={`${sq.label} নং উপ-প্রশ্ন...`}
                          />
                        ) : (
                          <p
                            className="m-0 flex-1 leading-normal"
                            style={{
                              fontSize: sqStyle.fontSize,
                              fontFamily: sqStyle.fontFamily,
                              textAlign:
                                sqStyle.textAlign as React.CSSProperties["textAlign"],
                            }}
                          >
                            {sq.text}
                          </p>
                        )}

                        <span className="font-bold text-sm text-[12px]">
                          {toBengaliDigits(sq.marks)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
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
};
