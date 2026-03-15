"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "@workspace/ui/components/sonner";
import {
  useQuestionPaperById,
  useAcademicChaptersForSelection,
  useCQs,
  useBulkAssignCqToQuestionPaper,
  useBulkRemoveMcqFromQuestionPaper,
} from "@workspace/api-client";
import { useParams } from "next/navigation";

import {
  CQCard,
  CQFilterBar,
  CQStatsSummary,
  CQEmptyState,
  CQSkeleton,
  CQBulkActions,
  type CQResource,
  type CQResourceViewProps,
} from "../components/cq-resource";

export const CQResourceView = ({
  questionTypeId,
  subjectId,
  distributionId,
}: CQResourceViewProps) => {
  const { id: paperId } = useParams() as { id: string };

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [chapterId, setChapterId] = useState<string | undefined>(undefined);
  const [reference, setReference] = useState<string | undefined>(undefined);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Data fetching
  const { data: paper } = useQuestionPaperById(paperId);
  const { data: chapters } = useAcademicChaptersForSelection(subjectId);

  const { data: cqsData, isLoading } = useCQs({
    page: 1,
    limit: 100,
    search: debouncedSearch || undefined,
    subjectId,
    questionTypeId,
    chapterId: chapterId || undefined,
    reference: reference || undefined,
  });

  const { mutateAsync: bulkAssign } = useBulkAssignCqToQuestionPaper();
  const { mutateAsync: bulkRemove } = useBulkRemoveMcqFromQuestionPaper();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const assignedCqIds = (paper?.questions ?? [])
    .filter((q: any) => q.type === "creative")
    .map((q: any) => q.cqId);

  const cqQuestionMap = (paper?.questions ?? [])
    .filter((q: any) => q.type === "creative")
    .reduce((acc: Record<string, string>, q: any) => {
      if (q.cqId) acc[q.cqId] = q.id;
      return acc;
    }, {});

  const filteredItems = cqsData?.items || [];
  const totalCount = cqsData?.meta?.total ?? filteredItems.length;

  // Stats Calculation
  const currentSubject = (paper?.subjects as any[])?.find(
    (s: any) => s.subjectId === subjectId,
  );
  const currentDistribution = (currentSubject?.distributions as any[])?.find(
    (d: any) => d.questionTypeId === questionTypeId,
  );
  const targetCount = currentDistribution?.questionCount ?? 0;
  const selectedCount = (paper?.questions ?? []).filter(
    (q: any) =>
      (q as any).cq?.subjectId === subjectId &&
      (q as any).cq?.questionTypeId === questionTypeId,
  ).length;
  const leftCount = Math.max(0, targetCount - selectedCount);

  const handleToggleSelect = (cqId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(cqId)) {
        return prev.filter((id) => id !== cqId);
      }

      const totalPlanned = selectedCount + prev.length + 1;
      if (totalPlanned > targetCount) {
        toast.warning(
          `Limit reached! You only need ${targetCount} questions for this section.`,
        );
        return prev;
      }

      return [...prev, cqId];
    });
  };

  const handleSelectAll = () => {
    if (
      selectedIds.length === filteredItems.length &&
      filteredItems.length > 0
    ) {
      setSelectedIds([]);
    } else {
      const unassignedFromFilter = filteredItems
        .filter((item: CQResource) => !assignedCqIds.includes(item.id))
        .map((item: CQResource) => item.id);

      const toSelect = unassignedFromFilter.slice(0, leftCount);
      setSelectedIds(toSelect);

      if (unassignedFromFilter.length > leftCount) {
        toast.info(
          `Selected ${leftCount} questions to match section requirement.`,
        );
      }
    }
  };

  const handleBulkAction = async (action: "add" | "remove") => {
    setIsBulkLoading(true);
    try {
      if (action === "add") {
        const idsToAssign = selectedIds.filter(
          (id) => !assignedCqIds.includes(id),
        );
        if (idsToAssign.length > 0) {
          await bulkAssign({
            questionPaperId: paperId,
            cqIds: idsToAssign,
            distributionId,
          });
        }
      } else {
        const questionPaperQuestionIds = selectedIds
          .map((id) => cqQuestionMap[id])
          .filter(Boolean);
        if (questionPaperQuestionIds.length > 0) {
          await bulkRemove({
            ids: questionPaperQuestionIds,
          });
        }
      }
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-background max-w-7xl mx-auto px-4 lg:px-8 py-6 gap-6 relative">
      <div className="pt-2 pb-2 space-y-4">
        <CQFilterBar
          search={search}
          onSearchChange={setSearch}
          reference={reference}
          onReferenceChange={setReference}
          chapterId={chapterId}
          onChapterIdChange={setChapterId}
          chapters={chapters}
          totalCount={totalCount}
          selectedCount={selectedIds.length}
          filteredItemsCount={filteredItems.length}
          onSelectAll={handleSelectAll}
        />
      </div>

      <div className="px-2 sticky top-0 z-30 bg-background/95 backdrop-blur-md">
        <CQStatsSummary
          targetCount={targetCount}
          selectedCount={selectedCount}
          leftCount={leftCount}
        />
      </div>

      <div className="flex-1 pr-2 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <CQSkeleton key={i} />)
          ) : filteredItems.length === 0 ? (
            <CQEmptyState
              hasFilters={!!(debouncedSearch || chapterId || reference)}
              onClearFilters={() => {
                setSearch("");
                setChapterId(undefined);
                setReference(undefined);
              }}
            />
          ) : (
            filteredItems.map((cq: CQResource) => {
              const isAssigned = assignedCqIds.includes(cq.id);
              const isSelected = selectedIds.includes(cq.id);

              return (
                <CQCard
                  key={cq.id}
                  cq={cq}
                  isAssigned={isAssigned}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                />
              );
            })
          )}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <CQBulkActions
          selectedCount={selectedIds.length}
          isBulkLoading={isBulkLoading}
          onBulkAction={handleBulkAction}
          onClearSelection={() => setSelectedIds([])}
        />
      )}
    </div>
  );
};
