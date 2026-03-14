"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { EditableQuestion } from "../editable-question";
import { usePreview } from "./preview-context";
import { toBengaliDigits } from "./preview-utils";
import { PaperQuestion, PaperSubjectAction } from "../types";
import { PaperHeader } from "./paper-header";
import { useBuilder } from "../builder/builder-context";

interface PaperContentProps {
  pageQuestions: PaperQuestion[];
  pageIndex: number;
  isMeasuring?: boolean;
}

export const PaperContent: React.FC<PaperContentProps> = ({
  pageQuestions,
  pageIndex,
  isMeasuring = false,
}) => {
  const {
    settings,
    subjects,
    questions,
    onUpdateQuestion,
    onDeleteQuestion,
    onDuplicateQuestion,
    isEditing,
    onReorderQuestions,
    handleQuestionFocus,
    handleBlur,
    shouldRestrictHeaderWidth,
    pages,
  } = usePreview();

  const { paperId } = useBuilder();

  const getAddedCount = (
    subjectId: string,
    distribution: PaperSubjectAction,
  ) => {
    const targetTypeId = distribution.questionTypeId;
    const targetTypeName = (
      distribution.questionType?.name || ""
    ).toLowerCase();

    return questions.filter((q) => {
      if (q.distributionId && q.distributionId === distribution.id) return true;

      // 1. Subject Match Strategy
      // If there's only one subject in the whole paper, we accept all questions for it
      const hasSingleSubject = subjects?.length === 1;

      if (!hasSingleSubject) {
        const qSubjectId = q.subjectId;
        // Try ID match
        const idMatch = qSubjectId && qSubjectId === subjectId;
        // Try simple name or type check if ID is missing or mismatched
        if (!idMatch && qSubjectId) return false;
      }

      // 2. Type Match Strategy
      // Exact ID Match
      if (q.questionTypeId && targetTypeId && q.questionTypeId === targetTypeId)
        return true;

      // Robust Name Mapping
      const qType = q.type || "single";

      // MCQ Group
      if (
        targetTypeName.includes("mcq") ||
        targetTypeName.includes("single") ||
        targetTypeName.includes("multi") ||
        targetTypeName.includes("objective")
      ) {
        return (
          qType === "single" || qType === "multiple" || qType === "contextual"
        );
      }

      // Statement Group
      if (
        targetTypeName.includes("statement") ||
        targetTypeName.includes("বিবৃতি")
      ) {
        return qType === "statement";
      }

      // Final loose name match
      const qLabels = [qType.toLowerCase()];
      if (qType === "single" || qType === "multiple") qLabels.push("mcq");

      if (targetTypeName === "cq" && qLabels.includes("mcq")) return false;

      return qLabels.some(
        (label) =>
          targetTypeName === label || 
          (targetTypeName.includes(label) && label !== "mcq") || 
          (label.includes(targetTypeName) && targetTypeName !== "cq"),
      );
    }).length;
  };

  return (
    <div
      className="pagination-column-container"
      style={{
        columnCount: settings.columns,
        columnGap: "1.5rem",
        columnFill: "auto",
        columnRule: settings.showColumnDivider ? "1px solid #000000" : "none",
        overflow: "visible",
        flex: "1 1 auto",
        minHeight: 0,
        background:
          settings.columns === 2 && settings.showColumnDivider
            ? "linear-gradient(to right, transparent calc(50% - 0.5px), #000000 calc(50% - 0.5px), #000000 calc(50% + 0.5px), transparent calc(50% + 0.5px))"
            : "none",
      }}
    >
      {pageIndex === 0 && shouldRestrictHeaderWidth && <PaperHeader />}

      {subjects &&
        subjects.map((s) => {
          const subjectQuestionsGlobal = questions.filter(
            (q) => q.subjectId === s.subjectId,
          );
          const subjectQuestions = pageQuestions.filter(
            (q) => q.subjectId === s.subjectId,
          );
          const pendingDistributions = (s.distributions || []).filter(
            (d) => getAddedCount(s.subjectId, d) < d.questionCount,
          );

          const shouldShowActionButtons =
            isEditing &&
            pendingDistributions.length > 0 &&
            (isMeasuring || pageIndex === pages.length - 1);

          if (subjectQuestions.length === 0 && !shouldShowActionButtons) {
            return null;
          }

          const firstQuestionOfSubjectGlobal = subjectQuestionsGlobal[0];
          const isStartOfSubject =
            !firstQuestionOfSubjectGlobal ||
            subjectQuestions.some(
              (q) => q.id === firstQuestionOfSubjectGlobal.id,
            );

          const subjectTotalMarks = (s.distributions || []).reduce(
            (sum, d) => sum + (d.totalMarks || 0),
            0,
          );

          // Group questions by distribution
          const groupedQuestions: Record<string, PaperQuestion[]> = {};
          const unmappedQuestions: PaperQuestion[] = [];

          subjectQuestions.forEach((q) => {
            const distribution = (s.distributions || []).find((d) => {
              if (q.distributionId && q.distributionId === d.id) return true;

              const targetTypeId = d.questionTypeId;
              const targetTypeName = (d.questionType?.name || "").toLowerCase();
              const qType = q.type || "single";

              if (q.questionTypeId === targetTypeId) return true;
              if (
                targetTypeName.includes("mcq") ||
                targetTypeName.includes("single")
              ) {
                return (
                  qType === "single" ||
                  qType === "multiple" ||
                  qType === "contextual"
                );
              }
              if (targetTypeName.includes("statement"))
                return qType === "statement";

              const qLabels = [qType.toLowerCase()];
              if (qType === "single" || qType === "multiple") qLabels.push("mcq");

              if (targetTypeName === "cq" && qLabels.includes("mcq")) return false;

              return qLabels.some(
                (label) =>
                  targetTypeName === label || 
                  (targetTypeName.includes(label) && label !== "mcq") || 
                  (label.includes(targetTypeName) && targetTypeName !== "cq"),
              );
            });

            if (distribution) {
              const gid = distribution.id;
              const existingGroup = groupedQuestions[gid];
              if (existingGroup) {
                existingGroup.push(q);
              } else {
                groupedQuestions[gid] = [q];
              }
            } else {
              unmappedQuestions.push(q);
            }
          });

          return (
            <div key={s.id} className="mb-2 last:mb-0">
              {/* Subject Header Style */}
              {(isStartOfSubject ||
                (shouldShowActionButtons && subjectQuestions.length === 0)) && (
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg border-b-2 border-black pb-0.5 min-w-[100px]">
                      {s.subject?.displayName || "বিষয়"}
                    </h4>
                    <span className="text-sm font-black text-black/40 bg-black/5 px-2 py-0.5 rounded-full">
                      মোট নম্বর: {toBengaliDigits(subjectTotalMarks)}
                    </span>
                    <div className="flex-1 border-t border-dashed border-black/20" />
                  </div>

                  {/* Mark Distribution Row */}
                  <div className="flex flex-col gap-1 mt-1 px-1">
                    {(s.distributions || []).map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between text-[13px] font-bold"
                      >
                        <span className="uppercase tracking-tight text-black/80">
                          {d.questionType?.label}
                        </span>
                        <span className="text-black/50">
                          {toBengaliDigits(d.questionCount)} ×{" "}
                          {toBengaliDigits(d.marksPerQuestion)} ={" "}
                          {toBengaliDigits(d.totalMarks)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {(s.distributions || []).map((d) => {
                  const group = groupedQuestions[d.id];
                  if (!group || group.length === 0) return null;

                  return (
                    <div key={d.id} className="space-y-1">
                      {/* Section Label */}
                      {(() => {
                        if ((s.distributions || []).length <= 1) return false;
                        const firstQInDistGlobal = subjectQuestionsGlobal.find(
                          (q) => {
                            if (q.distributionId && q.distributionId === d.id) return true;

                            const targetTypeId = d.questionTypeId;
                            const targetTypeName = (
                              d.questionType?.name || ""
                            ).toLowerCase();
                            const qType = q.type || "single";

                            if (q.questionTypeId === targetTypeId) return true;
                            if (
                              targetTypeName.includes("mcq") ||
                              targetTypeName.includes("single")
                            ) {
                              return (
                                qType === "single" ||
                                qType === "multiple" ||
                                qType === "contextual"
                              );
                            }
                            if (targetTypeName.includes("statement"))
                              return qType === "statement";

                            const qLabels = [qType.toLowerCase()];
                            if (qType === "single" || qType === "multiple") qLabels.push("mcq");

                            if (targetTypeName === "cq" && qLabels.includes("mcq")) return false;

                            return qLabels.some(
                              (label) =>
                                targetTypeName === label || 
                                (targetTypeName.includes(label) && label !== "mcq") || 
                                (label.includes(targetTypeName) && targetTypeName !== "cq"),
                            );
                          },
                        );

                        return (
                          firstQInDistGlobal &&
                          group.some((q) => q.id === firstQInDistGlobal.id)
                        );
                      })() && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-[10px] uppercase tracking-widest text-black/90 px-1.5 py-0.5 bg-black/[0.03] rounded border border-black/5">
                            {d.questionType?.label}
                          </span>
                          <div className="h-px flex-1 bg-black/10" />
                        </div>
                      )}

                      <div className="space-y-1">
                        {group.map((q) => (
                          <div
                            key={q.id}
                            data-question-index={questions.findIndex(
                              (prev) => prev.id === q.id,
                            )}
                            style={{ breakInside: "avoid" }}
                          >
                            <EditableQuestion
                              question={
                                questions.find((prev) => prev.id === q.id) || q
                              }
                              settings={settings}
                              onUpdate={onUpdateQuestion}
                              onDelete={onDeleteQuestion}
                              onDuplicate={onDuplicateQuestion}
                              isEditing={isEditing}
                              isDraggable={
                                isEditing &&
                                !!onReorderQuestions &&
                                settings.columns === 1
                              }
                              onFocus={(e, type, index, style) =>
                                handleQuestionFocus(e, q.id, type, index, style)
                              }
                              onBlur={handleBlur}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {unmappedQuestions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-black text-xs uppercase tracking-widest text-black/30">
                        অন্যান্য প্রশ্ন
                      </span>
                      <div className="h-px flex-1 bg-black/10" />
                    </div>
                    {unmappedQuestions.map((q) => (
                      <div
                        key={q.id}
                        data-question-index={questions.findIndex(
                          (prev) => prev.id === q.id,
                        )}
                        style={{ breakInside: "avoid" }}
                      >
                        <EditableQuestion
                          question={
                            questions.find((prev) => prev.id === q.id) || q
                          }
                          settings={settings}
                          onUpdate={onUpdateQuestion}
                          onDelete={onDeleteQuestion}
                          onDuplicate={onDuplicateQuestion}
                          isEditing={isEditing}
                          isDraggable={
                            isEditing &&
                            !!onReorderQuestions &&
                            settings.columns === 1
                          }
                          onFocus={(e, type, index, style) =>
                            handleQuestionFocus(e, q.id, type, index, style)
                          }
                          onBlur={handleBlur}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Section for this subject - Only on the last page */}
              {shouldShowActionButtons && (
                <div
                  className="space-y-2 mt-4 no-print"
                  style={{ breakInside: "avoid" }}
                >
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-black/30 px-1 mb-1">
                    বাকি প্রশ্ন - {s.subject?.displayName}
                  </h5>
                  <div className="grid grid-cols-1 gap-2">
                    {pendingDistributions.map((d) => {
                      const addedCount = getAddedCount(s.subjectId, d);
                      return (
                        <div
                          key={d.id}
                          className="flex flex-col gap-2 group p-3 rounded-xl border border-dashed border-black/10 hover:border-black/30 hover:bg-black/[0.02] transition-all"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">
                                {d.questionType?.name || "প্রশ্নের ধরণ"}
                              </span>
                              <span className="text-[9px] font-black uppercase tracking-wider bg-black/5 px-1.5 py-0.5 rounded text-black/50">
                                {addedCount > 0 ? "আংশিক" : "প্রয়োজনীয়"}
                              </span>
                            </div>
                            <p className="text-[10px] text-black/60 font-medium">
                              {toBengaliDigits(d.questionCount)}টি প্রশ্ন —
                              প্রতিটির মান {toBengaliDigits(d.marksPerQuestion)}{" "}
                              — মোট {toBengaliDigits(d.totalMarks)} নম্বর
                            </p>
                          </div>
                          <Link
                            href={`/question-papers/${paperId}/resources/${d.questionType?.name.toLowerCase()}/${d.questionTypeId}?subjectId=${s.subjectId}&distributionId=${d.id}`}
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-10 rounded-lg border-black/10 font-bold text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                            >
                              <Plus className="w-2.5 h-2.5 mr-1 stroke-[3]" />
                              প্রশ্ন নির্বাচন করুন (
                              {toBengaliDigits(addedCount)}/
                              {toBengaliDigits(d.questionCount)})
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

      {/* Fallback Questions */}
      {pageQuestions
        .filter((pq) => !subjects?.some((s) => s.subjectId === pq.subjectId))
        .map((q) => (
          <div
            key={q.id}
            data-question-index={questions.findIndex(
              (prev) => prev.id === q.id,
            )}
            style={{ breakInside: "avoid" }}
          >
            <EditableQuestion
              question={questions.find((prev) => prev.id === q.id) || q}
              settings={settings}
              onUpdate={onUpdateQuestion}
              onDelete={onDeleteQuestion}
              onDuplicate={onDuplicateQuestion}
              isEditing={isEditing}
              isDraggable={
                isEditing && !!onReorderQuestions && settings.columns === 1
              }
              onFocus={(e, type, index, style) =>
                handleQuestionFocus(e, q.id, type, index, style)
              }
              onBlur={handleBlur}
            />
          </div>
        ))}

      {/* Sentinel to measure total overflow including action buttons */}
      <div
        data-end-sentinel="true"
        className="h-[1px] w-full invisible shrink-0"
        style={{ breakInside: "avoid" }}
      />
    </div>
  );
};
