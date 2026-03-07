"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Check,
  Loader2,
  BookOpen,
  Layers,
  Filter,
  X,
} from "lucide-react";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  useAssignMcqToQuestionPaper,
  useAcademicSubjectsForSelection,
  useAcademicChaptersForSelection,
} from "@workspace/api-client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@workspace/api-client/client";

interface MCQ {
  id: string;
  question: string;
  subject?: { displayName: string };
  chapter?: { displayName: string };
}

interface McqPickerProps {
  paperId: string;
  assignedMcqIds: string[];
}

export const McqPicker: React.FC<McqPickerProps> = ({
  paperId,
  assignedMcqIds,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);
  const [chapterId, setChapterId] = useState<string | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Reset chapter when subject changes
  useEffect(() => {
    setChapterId(undefined);
  }, [subjectId]);

  // Filter data
  const { data: subjects } = useAcademicSubjectsForSelection();
  const { data: chapters } = useAcademicChaptersForSelection(subjectId);

  // Independent query for the picker with filters
  const trpc = useTRPC();
  const { data: mcqs, isLoading } = useQuery({
    ...trpc.mcq.list.queryOptions({
      page: 1,
      limit: 50,
      search: debouncedSearch || undefined,
      subjectId: subjectId || undefined,
      chapterId: chapterId || undefined,
      sortOrder: "desc",
    }),
    select: (data: Record<string, unknown>) =>
      (data as Record<string, unknown>).data as
        | { items: MCQ[]; totalCount: number }
        | undefined,
  });

  const { mutateAsync: assignMcq } = useAssignMcqToQuestionPaper();

  const handleAssign = async (mcqId: string) => {
    setAssigningId(mcqId);
    try {
      await assignMcq({
        questionPaperId: paperId,
        mcqId,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setAssigningId(null);
    }
  };

  const activeFilterCount = [subjectId, chapterId].filter(Boolean).length;
  const filteredItems =
    (mcqs as { items: MCQ[]; totalCount: number } | undefined)?.items || [];
  const totalCount =
    (mcqs as { items: MCQ[]; totalCount: number } | undefined)?.totalCount ??
    filteredItems.length;

  const clearFilters = () => {
    setSubjectId(undefined);
    setChapterId(undefined);
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Question Bank</h3>
            <p className="text-xs text-muted-foreground font-medium">
              {totalCount} questions available
            </p>
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-8 rounded-lg font-bold text-xs gap-1.5 relative"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[9px] font-black text-primary-foreground flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-9 h-10 bg-muted/30 border-border/50 rounded-xl font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters — collapsible */}
        {showFilters && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Select
              value={subjectId ?? ""}
              onValueChange={(v) => setSubjectId(v || undefined)}
            >
              <SelectTrigger className="h-9 rounded-lg bg-muted/30 border-border/50 text-xs font-semibold">
                <BookOpen className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                {(subjects || []).map(
                  (s: { id: string; displayName: string }) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.displayName}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            {subjectId && (
              <Select
                value={chapterId ?? ""}
                onValueChange={(v) => setChapterId(v || undefined)}
              >
                <SelectTrigger className="h-9 rounded-lg bg-muted/30 border-border/50 text-xs font-semibold">
                  <Layers className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="All Chapters" />
                </SelectTrigger>
                <SelectContent>
                  {(chapters || []).map(
                    (c: { id: string; displayName: string }) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.displayName}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 w-full text-xs font-bold text-muted-foreground gap-1"
              >
                <X className="h-3 w-3" />
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2 p-3 border rounded-xl">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="mx-auto h-8 w-8 opacity-20 mb-2" />
              <p className="text-sm font-medium">No MCQs found</p>
              {activeFilterCount > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs mt-1"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            filteredItems.map((mcq: MCQ) => {
              const isAssigned = assignedMcqIds.includes(mcq.id);
              const isThisAssigning = assigningId === mcq.id;

              return (
                <div
                  key={mcq.id}
                  className={`group p-4 border rounded-2xl transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 ${
                    isAssigned
                      ? "bg-emerald-500/5 border-emerald-500/20 ring-1 ring-emerald-500/10"
                      : "bg-card hover:border-primary/30 hover:shadow-soft"
                  }`}
                >
                  <div className="space-y-2">
                    <p className="text-sm font-bold line-clamp-3 leading-snug">
                      {mcq.question}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-black px-2 py-0 h-5"
                      >
                        <BookOpen className="h-2.5 w-2.5 mr-1" />
                        {mcq.subject?.displayName || "Subject"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-black px-2 py-0 h-5"
                      >
                        <Layers className="h-2.5 w-2.5 mr-1" />
                        {mcq.chapter?.displayName || "Chapter"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3">
                    {isAssigned ? (
                      <Button
                        disabled
                        variant="secondary"
                        size="sm"
                        className="w-full h-8 rounded-lg font-bold text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      >
                        <Check className="h-3 w-3 mr-1.5 animate-in zoom-in duration-300" />
                        Added
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAssign(mcq.id)}
                        disabled={isThisAssigning}
                        className="w-full h-8 rounded-lg font-bold text-xs shadow-glow"
                      >
                        {isThisAssigning ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1.5" />
                            Add to Paper
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
