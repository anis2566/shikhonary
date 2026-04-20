"use client";

import React, { useEffect, useState } from "react";
import { Search, LayoutGrid, List, X, RotateCcw } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useAcademicYearFilters } from "@workspace/api-client/filters";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";

export type ViewMode = "table" | "cards";
export type StatusFilter = "all" | "active" | "inactive" | "current";
export type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

interface FiltersProps {
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
}

export function Filters({ viewMode, onViewModeChange }: FiltersProps) {
  const [search, setSearch] = useState("");

  const debounceValue = useDebounce(search, 500);

  const [filters, setFilters] = useAcademicYearFilters();

  useEffect(() => {
    setFilters({
      search: debounceValue,
    });
  }, [debounceValue, setFilters]);

  const handleFilterStatusChange = (value: string) => {
    setFilters({
      ...filters,
      isActive: value === "true" ? true : value === "false" ? false : undefined,
    });
  };

  const handleSortChange = (value: string) => {
    setFilters({
      ...filters,
      sortBy: value,
    });
  };

  const hasActiveFilters =
    (filters.isActive !== null && filters.isActive !== undefined) ||
    !!filters.sortBy ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      isActive: null,
    });
  };

  return (
    <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/50 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none z-10">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <Input
              className="pl-9 bg-slate-50 border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/20"
              placeholder="Filter years..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={
              filters.isActive === true
                ? "true"
                : filters.isActive === false
                  ? "false"
                  : "all"
            }
            onValueChange={(value) => handleFilterStatusChange(value)}
          >
            <SelectTrigger className="w-[180px] bg-slate-50 border-none rounded-lg text-sm px-4 text-slate-600 focus:ring-2 focus:ring-emerald-500/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy ?? undefined}
            onValueChange={(value) => handleSortChange(value)}
          >
            <SelectTrigger className="w-[180px] bg-slate-50 border-none rounded-lg text-sm px-4 text-slate-600 focus:ring-2 focus:ring-emerald-500/20">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-md transition-all h-8 w-8 ${viewMode === "cards" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:bg-white/50"}`}
              onClick={() => onViewModeChange("cards")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-md transition-all h-8 w-8 ${viewMode === "table" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:bg-white/50"}`}
              onClick={() => onViewModeChange("table")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-3 border-t border-slate-50 bg-slate-50/30">
              {filters.search && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-medium text-[11px]">
                    {filters.search}
                  </span>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilters({ ...filters, search: null });
                    }}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.isActive !== null && filters.isActive !== undefined && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-medium text-[11px]">
                    {filters.isActive ? "Active Only" : "Inactive Only"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, isActive: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.sortBy && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-medium text-[11px] capitalize">
                    {filters.sortBy.replace("-", " ")}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, sortBy: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="ml-auto text-[10px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-1.5 px-3 h-8 rounded-lg text-destructive"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
