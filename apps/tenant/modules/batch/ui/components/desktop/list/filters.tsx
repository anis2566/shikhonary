"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, LayoutGrid, List as ListIcon } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
  useBatchFilters,
} from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";

interface FiltersProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function Filters({ viewMode, onViewModeChange }: FiltersProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useBatchFilters();

  const { data: years } = useAcademicYearsForSelection();
  const { data: classes } = useAcademicClassesForSelection();

  const year_options =
    years?.map((item) => ({
      label: item.name,
      value: item.id,
    })) ?? [];

  const class_options =
    classes?.map((item) => ({
      label: item.displayName,
      value: item.id,
    })) ?? [];

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null });
  }, [debouncedSearch, setFilters]);

  const handleAcademicYearChange = (id: string) => {
    setFilters({
      ...filters,
      academicYearId: id === "all" ? null : id,
    });
  };

  const handleAcademicClassChange = (id: string) => {
    setFilters({
      ...filters,
      academicClassId: id === "all" ? null : id,
    });
  };

  const handleStatusChange = (status: "all" | "active" | "inactive") => {
    setFilters({
      ...filters,
      isActive:
        status === "active" ? true : status === "inactive" ? false : null,
    });
  };

  const hasActiveFilters =
    (filters.isActive !== null && filters.isActive !== undefined) ||
    !!filters.sortBy ||
    !!filters.search ||
    !!filters.academicYearId ||
    !!filters.academicClassId ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      academicYearId: null,
      academicClassId: null,
      isActive: null,
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="bg-white p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0b1c30]/50" />
          <Input
            className="w-full bg-[#f8f9ff] py-2.5 pl-10 pr-4 rounded-[12px] border-slate-200 focus:border-none focus:ring-2 focus:ring-primary/60 text-sm text-[#0b1c30] placeholder:text-[#0b1c30]/40 h-10 transition-all"
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-[#f1f5f9]/50 p-1 rounded-[12px] border border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("all")}
            className={cn(
              "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
              filters.isActive === null
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
            )}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("active")}
            className={cn(
              "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
              filters.isActive === true
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
            )}
          >
            Active
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("inactive")}
            className={cn(
              "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
              filters.isActive === false
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
            )}
          >
            Inactive
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={filters.academicYearId ?? "all"}
            onValueChange={handleAcademicYearChange}
          >
            <SelectTrigger className="bg-[#eff4ff] border-none rounded-[12px] text-sm font-semibold text-[#0b1c30] w-[150px] h-10 px-4 focus:ring-2 focus:ring-primary/20 transition-all hover:bg-[#e5eeff]">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-ambient bg-white/95 backdrop-blur-md">
              <SelectItem value="all">All Years</SelectItem>
              {year_options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.academicClassId ?? "all"}
            onValueChange={handleAcademicClassChange}
          >
            <SelectTrigger className="bg-[#eff4ff] border-none rounded-[12px] text-sm font-semibold text-[#0b1c30] w-[150px] h-10 px-4 focus:ring-2 focus:ring-primary/20 transition-all hover:bg-[#e5eeff]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-ambient bg-white/95 backdrop-blur-md">
              <SelectItem value="all">All Classes</SelectItem>
              {class_options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center bg-[#f1f5f9]/50 p-1 rounded-[12px] border border-slate-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              viewMode === "grid"
                ? "bg-white shadow-sm text-emerald-600"
                : "text-slate-400 hover:text-slate-600 hover:bg-white/50",
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("table")}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              viewMode === "table"
                ? "bg-white shadow-sm text-emerald-600"
                : "text-slate-400 hover:text-slate-600 hover:bg-white/50",
            )}
          >
            <ListIcon className="w-4 h-4" />
          </Button>
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

              {filters.academicYearId && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    Year:
                  </span>
                  <span className="font-bold text-[11px]">
                    {
                      year_options.find(
                        (item) => item.value === filters.academicYearId,
                      )?.label
                    }
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, academicYearId: null })
                    }
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.academicClassId && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    Class:
                  </span>
                  <span className="font-bold text-[11px]">
                    {
                      class_options.find(
                        (item) => item.value === filters.academicClassId,
                      )?.label
                    }
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, academicClassId: null })
                    }
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
