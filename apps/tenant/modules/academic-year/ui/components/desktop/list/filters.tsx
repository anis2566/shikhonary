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
    <div className="hidden md:block bg-white border border-slate-100 rounded-t-2xl overflow-hidden">
      <div className="bg-white p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0b1c30]/50" />
          <Input
            className="w-full bg-[#f8f9ff] py-2.5 pl-10 pr-4 rounded-[12px] border-slate-200 focus:border-none focus:ring-2 focus:ring-primary/60 text-sm text-[#0b1c30] placeholder:text-[#0b1c30]/40 h-10"
            placeholder="Search years..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
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
            <SelectTrigger className="bg-[#eff4ff] border-none rounded-[12px] text-sm font-semibold text-[#0b1c30] w-[160px] h-10 px-4 focus:ring-2 focus:ring-[#006c49]/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-ambient">
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy ?? "newest"}
            onValueChange={(value) => handleSortChange(value)}
          >
            <SelectTrigger className="bg-[#eff4ff] border-none rounded-[12px] text-sm font-semibold text-[#0b1c30] w-[160px] h-10 px-4 focus:ring-2 focus:ring-[#006c49]/20">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-ambient">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex bg-[#eff4ff] p-1 rounded-xl h-10">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-lg transition-all h-8 w-8 ${viewMode === "cards" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:bg-white/50"}`}
              onClick={() => onViewModeChange("cards")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-lg transition-all h-8 w-8 ${viewMode === "table" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:bg-white/50"}`}
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
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-0">
              {filters.search && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    Search:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.search}
                  </span>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilters({ ...filters, search: null });
                    }}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.isActive !== null && filters.isActive !== undefined && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    Status:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, isActive: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.sortBy && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    Order:
                  </span>
                  <span className="font-bold text-[11px] capitalize">
                    {filters.sortBy.replace("-", " ")}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, sortBy: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="ml-auto text-[10px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-1.5 px-3 h-8 rounded-lg text-destructive"
              >
                <RotateCcw className="w-3 h-3 text-destructive" />
                Reset All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
