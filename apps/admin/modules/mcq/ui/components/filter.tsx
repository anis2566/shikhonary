"use client";

import {
  ArrowUpDown,
  BookOpen,
  Download,
  FilterIcon,
  Pencil,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";

import {
  useMCQFilters,
  useAcademicSubjectsForSelection,
  useAcademicChaptersForSelection,
} from "@workspace/api-client";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MCQ_TYPE,
  SORT,
  mcqTypeOptions,
  sortOptions,
} from "@workspace/utils/constants";

interface FilterProps {
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  isLoading: boolean;
}

export const Filter = ({ setSelectedIds, isLoading }: FilterProps) => {
  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search, 500);

  const [filters, setFilters] = useMCQFilters();
  const { data: subjects } = useAcademicSubjectsForSelection();
  const { data: chapters } = useAcademicChaptersForSelection(
    filters.subjectId || undefined,
  );

  const SUBJECT_OPTIONS =
    subjects?.map((s: { id: string; displayName: string }) => ({
      value: s.id,
      label: s.displayName,
    })) || [];

  const CHAPTER_OPTIONS =
    chapters?.map((c: { id: string; displayName: string }) => ({
      value: c.id,
      label: c.displayName,
    })) || [];

  useEffect(() => {
    setFilters({ search: debounceValue });
    setSelectedIds([]);
  }, [debounceValue, setFilters, setSelectedIds]);

  const handleSubjectChange = (value: string) => {
    // reset chapter when subject changes
    setFilters({ ...filters, subjectId: value, chapterId: null });
    setSelectedIds([]);
  };

  const handleChapterChange = (value: string) => {
    setFilters({ ...filters, chapterId: value });
    setSelectedIds([]);
  };

  const handleTypeChange = (value: MCQ_TYPE) => {
    setFilters({ ...filters, type: value });
    setSelectedIds([]);
  };

  const handleSortChange = (value: SORT) => {
    setFilters({ ...filters, sort: value });
    setSelectedIds([]);
  };

  const hasActiveFilters =
    !!filters.subjectId ||
    !!filters.chapterId ||
    !!filters.type ||
    !!filters.sort ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      subjectId: null,
      chapterId: null,
      topicId: null,
      subtopicId: null,
      type: null,
      isMath: null,
      sort: null,
      sortBy: null,
      sortOrder: null,
    });
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative w-full md:max-w-[320px] group">
            <Input
              placeholder="Search questions..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 h-10 w-full bg-background/50 backdrop-blur-sm border-border/50 rounded-xl focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-soft placeholder:text-muted-foreground/50 font-medium"
              disabled={isLoading}
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
              <Search className="h-4 w-4 text-primary/70 group-focus-within:text-primary transition-colors" />
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md text-muted-foreground transition-all z-10"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Filter */}
            <Select
              value={filters.subjectId || ""}
              onValueChange={(v) => handleSubjectChange(v)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 min-w-[130px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <BookOpen className="h-4 w-4 mr-2 text-primary/70" />
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Chapter Filter */}
            <Select
              value={filters.chapterId || ""}
              onValueChange={(v) => handleChapterChange(v)}
              disabled={isLoading || !filters.subjectId}
            >
              <SelectTrigger className="h-10 min-w-[130px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium disabled:opacity-50">
                <BookOpen className="h-4 w-4 mr-2 text-primary/50" />
                <SelectValue placeholder="Chapter" />
              </SelectTrigger>
              <SelectContent>
                {CHAPTER_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select
              value={filters.type || ""}
              onValueChange={(v) => handleTypeChange(v as MCQ_TYPE)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 min-w-[110px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <FilterIcon className="h-4 w-4 mr-2 text-primary/70" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {mcqTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select
              value={filters.sort || ""}
              onValueChange={(v) => handleSortChange(v as SORT)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-10 min-w-[110px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
                <ArrowUpDown className="h-4 w-4 mr-2 text-primary/70" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent align="end">
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                disabled={isLoading}
                className="h-10 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all font-semibold border border-transparent hover:border-destructive/20"
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-border/50 bg-background/50 backdrop-blur-sm rounded-xl hover:bg-muted transition-all shadow-soft"
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            asChild
            variant="outline"
            size="icon"
            disabled={isLoading}
            className="h-10 w-10 border-border/50 bg-background/50 backdrop-blur-sm rounded-xl hover:bg-muted transition-all shadow-soft"
          >
            <Link href="/mcqs/import">
              <Upload className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            disabled={isLoading}
            className="h-10 px-4 border-border/50 bg-background/50 backdrop-blur-sm rounded-xl hover:bg-muted transition-all shadow-soft font-bold"
          >
            <Link href="/mcqs/edit-list">
              <Pencil className="h-4 w-4 mr-2" />
              Edit MCQs
            </Link>
          </Button>

          <Button
            asChild
            disabled={isLoading}
            className="h-10 px-4 bg-primary text-primary-foreground rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
          >
            <Link href="/mcqs/new">
              <Plus className="h-4 w-4 mr-2 stroke-[3]" />
              Add MCQ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
