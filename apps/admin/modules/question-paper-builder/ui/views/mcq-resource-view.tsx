"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Check,
  Loader2,
  X,
  Layers,
  LayoutGrid,
  Dices,
} from "lucide-react";
import { toast } from "@workspace/ui/components/sonner";
import {
  useQuestionPaperById,
  useAcademicChaptersForSelection,
  useMCQsForAssignment,
  useBulkAssignMcqToQuestionPaper,
  useBulkRemoveMcqFromQuestionPaper,
} from "@workspace/api-client";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";

import {
  MCQCard,
  type MCQ,
  type PaperQuestion,
  type MCQResourceViewProps,
} from "../components/mcq-resource";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useParams } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

export const MCQResourceView = ({
  questionTypeId,
  subjectId,
  distributionId,
}: MCQResourceViewProps) => {
  const { id: paperId } = useParams() as { id: string };

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [chapterId, setChapterId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
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

  const { data: mcqsData, isLoading } = useMCQsForAssignment({
    page: 1,
    limit: 100,
    search: debouncedSearch || undefined,
    subjectId,
    questionTypeId,
    chapterId: chapterId || undefined,
    type: type || undefined,
    reference: reference || undefined,
  });

  const { mutateAsync: bulkAssign } = useBulkAssignMcqToQuestionPaper();
  const { mutateAsync: bulkRemove } = useBulkRemoveMcqFromQuestionPaper();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const assignedMcqIds = (paper?.questions ?? []).map(
    (q: PaperQuestion) => q.mcqId,
  );
  const mcqQuestionMap = (paper?.questions ?? []).reduce(
    (acc: Record<string, string>, q: PaperQuestion) => {
      acc[q.mcqId] = q.id;
      return acc;
    },
    {},
  );

  const handleToggleSelect = (mcqId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(mcqId)) {
        return prev.filter((id) => id !== mcqId);
      }

      const totalPlanned = selectedCount + prev.length + 1;
      if (totalPlanned > targetCount) {
        toast.warning(
          `Limit reached! You only need ${targetCount} questions for this section.`,
        );
        return prev;
      }

      return [...prev, mcqId];
    });
  };

  const handleRandomSelect = () => {
    if (leftCount <= 0) {
      toast.info("Target already met or exceeded.");
      return;
    }

    // Get currently unselected and unassigned items from the current view
    const availableItems = filteredItems.filter(
      (item: MCQ) =>
        !assignedMcqIds.includes(item.id) && !selectedIds.includes(item.id),
    );

    if (availableItems.length === 0) {
      toast.error("No more unassigned questions available in current results.");
      return;
    }

    // Shuffle and pick
    const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
    const toSelect = shuffled.slice(
      0,
      Math.min(leftCount - selectedIds.length, shuffled.length),
    );

    if (toSelect.length === 0) {
      toast.info("Selection limit reached.");
      return;
    }

    setSelectedIds((prev) => [...prev, ...toSelect.map((i) => i.id)]);
    toast.success(`Randomly selected ${toSelect.length} questions.`);
  };

  const handleBulkAction = async (action: "add" | "remove") => {
    setIsBulkLoading(true);
    try {
      if (action === "add") {
        const idsToAssign = selectedIds.filter(
          (id) => !assignedMcqIds.includes(id),
        );
        if (idsToAssign.length > 0) {
          await bulkAssign({
            questionPaperId: paperId,
            mcqIds: idsToAssign,
            distributionId,
          });
        }
      } else {
        const questionPaperQuestionIds = selectedIds
          .map((id) => mcqQuestionMap[id])
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

  const filteredItems = mcqsData?.items || [];
  const totalCount = mcqsData?.meta?.total ?? filteredItems.length;

  // Stats Calculation
  const currentSubject = paper?.subjects?.find(
    (s: any) => s.subjectId === subjectId,
  );
  const currentDistribution = currentSubject?.distributions?.find(
    (d: any) => d.questionTypeId === questionTypeId,
  );
  const targetCount = currentDistribution?.questionCount ?? 0;
  const selectedCount = (paper?.questions ?? []).filter(
    (q: any) =>
      q.mcq?.subjectId === subjectId &&
      q.mcq?.questionTypeId === questionTypeId,
  ).length;
  const leftCount = Math.max(0, targetCount - selectedCount);

  return (
    <div className="flex flex-col bg-background max-w-7xl mx-auto px-4 lg:px-8 py-6 gap-6 relative">
      {/* Header Section - No longer sticky as a whole */}
      <div className="pt-2 pb-2 space-y-4">
        {/* Search and Filters Bar */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2rem] p-4 shadow-medium flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions or board references..."
              className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl font-medium focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select
              value={type ?? "all"}
              onValueChange={(v) => setType(v === "all" ? undefined : v)}
            >
              <SelectTrigger className="h-12 w-full md:w-[130px] rounded-2xl bg-background/50 border-border/50 font-bold text-sm">
                <LayoutGrid className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Single">Single Choice</SelectItem>
                <SelectItem value="Multiple">Multiple Choice</SelectItem>
                <SelectItem value="Contextual">Contextual</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={reference ?? "all"}
              onValueChange={(v) => setReference(v === "all" ? undefined : v)}
            >
              <SelectTrigger className="h-12 w-full md:w-[150px] rounded-2xl bg-background/50 border-border/50 font-bold text-sm">
                <Search className="h-4 w-4 mr-2 text-amber-500" />
                <SelectValue placeholder="Board/Ref" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Boards</SelectItem>
                <SelectItem value="ঢা. বো.">ঢাকা বোর্ড</SelectItem>
                <SelectItem value="কু. বো.">কুমিল্লা বোর্ড</SelectItem>
                <SelectItem value="রা. বো.">রাজশাহী বোর্ড</SelectItem>
                <SelectItem value="য. বো.">যশোর বোর্ড</SelectItem>
                <SelectItem value="ব. বো.">বরিশাল বোর্ড</SelectItem>
                <SelectItem value="সি. বো. ২৪">সিলেট বোর্ড</SelectItem>
                <SelectItem value="দি. বো.">দিনাজপুর বোর্ড</SelectItem>
                <SelectItem value="ম. বো.">ময়মনসিংহ বোর্ড</SelectItem>
                <SelectItem value="চ. বো.">চট্টগ্রাম বোর্ড</SelectItem>
                <SelectItem value="মাদ. বো.">মাদ্রাসা বোর্ড</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={chapterId ?? "all"}
              onValueChange={(v) => setChapterId(v === "all" ? undefined : v)}
            >
              <SelectTrigger className="h-12 w-full md:w-[180px] rounded-2xl bg-background/50 border-border/50 font-bold text-sm">
                <Layers className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="All Chapters" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Chapters</SelectItem>
                {chapters?.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="font-medium">
                    {c.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="h-10 px-4 rounded-xl font-black text-xs bg-primary/5 text-primary border-primary/10"
              >
                {totalCount} Total
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRandomSelect}
                className="h-10 rounded-xl font-bold text-xs gap-2 border-primary/20 hover:border-primary/40"
              >
                <Dices className="size-3.5 text-primary" />
                Random
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary - Now part of the sticky header */}
      <div className="px-2 sticky top-0 z-30 bg-background/95 backdrop-blur-md">
        <div className="bg-card/40 border border-border/50 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">
                Required Questions
              </span>
              <span className="text-xl font-black text-foreground">
                {targetCount}
              </span>
            </div>

            <div className="h-8 w-[1px] bg-border/50" />

            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-emerald-600/70 tracking-wider">
                Currently Selected
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-emerald-600">
                  {selectedCount}
                </span>
                {selectedCount >= targetCount && (
                  <div className="bg-emerald-500/10 text-emerald-600 p-0.5 rounded-full">
                    <Check className="size-3 stroke-[4]" />
                  </div>
                )}
              </div>
            </div>

            <div className="h-8 w-[1px] bg-border/50" />

            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-amber-600/70 tracking-wider">
                Remaining to Pick
              </span>
              <span
                className={cn(
                  "text-xl font-black",
                  leftCount === 0
                    ? "text-muted-foreground/40"
                    : "text-amber-600",
                )}
              >
                {leftCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full animate-pulse bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Live Breakdown
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="flex-1 pr-2 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-2">
          {isLoading ? (
            Array(9)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-card/30 border border-border/50 rounded-[2rem] p-6 space-y-4"
                >
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                  <Skeleton className="h-4 w-1/2 rounded-full" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-8 rounded-xl" />
                    <Skeleton className="h-8 rounded-xl" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-2xl" />
                </div>
              ))
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="size-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-6 border border-dashed border-border">
                <LayoutGrid className="size-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-black text-foreground">
                No Questions Found
              </h3>
              <p className="text-muted-foreground max-w-xs mt-2 font-medium">
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
              {(debouncedSearch || chapterId || type || reference) && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearch("");
                    setChapterId(undefined);
                    setType(undefined);
                    setReference(undefined);
                  }}
                  className="mt-4 font-bold"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            filteredItems.map((mcq: MCQ) => {
              const isAssigned = assignedMcqIds.includes(mcq.id);
              const isSelected = selectedIds.includes(mcq.id);

              return (
                <MCQCard
                  key={mcq.id}
                  mcq={mcq}
                  isAssigned={isAssigned}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Sticky Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky bottom-0 -mb-6 mt-auto -mx-4 lg:-mx-8 px-4 lg:px-8 py-5 z-50 animate-in slide-in-from-bottom-8 duration-500 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">
                  Currently Selected
                </span>
                <span className="text-xl font-black text-primary tabular-nums">
                  {selectedIds.length} Items
                </span>
              </div>

              <div className="h-10 w-[1px] bg-border/50 mx-2" />

              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="sm"
                  disabled={isBulkLoading}
                  onClick={() => handleBulkAction("add")}
                  className="h-11 rounded-2xl px-6 font-black text-xs uppercase tracking-widest shadow-glow active:scale-[0.98] transition-transform"
                >
                  {isBulkLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="size-4 mr-2 stroke-[3]" /> Add Selection
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isBulkLoading}
                  onClick={() => handleBulkAction("remove")}
                  className="h-11 rounded-2xl px-6 font-black text-xs uppercase tracking-widest border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/30 active:scale-[0.98] transition-transform"
                >
                  {isBulkLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <X className="size-4 mr-2 stroke-[3]" /> Remove Selection
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="h-11 px-4 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground font-bold text-sm"
            >
              Clear
              <X className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
