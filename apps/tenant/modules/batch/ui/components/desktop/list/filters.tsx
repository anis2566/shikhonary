"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  X,
  RotateCcw,
} from "lucide-react";
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
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";

interface FiltersProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function Filters({ viewMode, onViewModeChange }: FiltersProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useBatchFilters();

  const { data: classes } = useAcademicClassesForSelection();
  const { data: years } = useAcademicYearsForSelection();

  const class_options =
    classes?.map((item) => ({
      label: item.displayName,
      value: item.id,
    })) ?? [];

  const year_options =
    years?.map((item) => ({
      label: item.name,
      value: item.id,
    })) ?? [];

  useEffect(() => {
    setFilters({ search: debouncedSearch || null });
  }, [debouncedSearch, setFilters]);

  const handleStatusChange = (status: "all" | "active" | "inactive") => {
    setFilters({
      isActive:
        status === "active" ? true : status === "inactive" ? false : null,
    });
  };

  const handleAcademicClassChange = (id: string) => {
    setFilters({
      ...filters,
      academicClassId: id,
    });
  };

  const handleAcademicYearChagne = (id: string) => {
    setFilters({
      ...filters,
      academicYearId: id,
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
    !!filters.academicClassId ||
    !!filters.academicYearId ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      academicClassId: null,
      academicYearId: null,
      isActive: null,
    });
  };

  return (
    <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/50 overflow-hidden">
      <div className="bg-white border border-[#bbcabf]/10 rounded-[12px] p-4 shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0b1c30]/50" />
          <Input
            className="w-full bg-[#f8f9ff] py-2.5 pl-10 pr-4 rounded-[12px] border-none focus:ring-2 focus:ring-[#006c49]/20 text-sm text-[#0b1c30] placeholder:text-[#0b1c30]/40"
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("all")}
            className={cn(
              "px-4 py-2 rounded-[12px] text-sm font-semibold transition-all",
              filters.isActive === null
                ? "bg-[#006c49] text-white hover:bg-[#006c49]/90"
                : "bg-[#e5eeff] hover:bg-[#dce9ff] text-[#3c4a42]",
            )}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("active")}
            className={cn(
              "px-4 py-2 rounded-[12px] text-sm font-medium flex items-center gap-2 transition-colors",
              filters.isActive === true
                ? "bg-[#006c49] text-white hover:bg-[#006c49]/90"
                : "bg-[#e5eeff] hover:bg-[#dce9ff] text-[#3c4a42]",
            )}
          >
            Active
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                filters.isActive === true
                  ? "bg-white/20 text-white"
                  : "bg-[#d3e4fe] text-[#0b1c30]",
              )}
            >
              18
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("inactive")}
            className={cn(
              "px-4 py-2 rounded-[12px] text-sm font-medium flex items-center gap-2 transition-colors",
              filters.isActive === false
                ? "bg-[#006c49] text-white hover:bg-[#006c49]/90"
                : "bg-[#e5eeff] hover:bg-[#dce9ff] text-[#3c4a42]",
            )}
          >
            Inactive
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                filters.isActive === false
                  ? "bg-white/20 text-white"
                  : "bg-[#d3e4fe] text-[#0b1c30]",
              )}
            >
              6
            </span>
          </Button>
        </div>

        <div className="h-6 w-px bg-[#bbcabf]/20 hidden lg:block"></div>

        <div className="flex items-center gap-3">
          <Select
            value={filters.academicClassId ?? undefined}
            onValueChange={(value) => handleAcademicClassChange(value)}
          >
            <SelectTrigger className="bg-[#eff4ff] border-none rounded-[12px] text-sm font-medium text-[#0b1c30] w-[140px] h-10 px-4 focus:ring-2 focus:ring-[#006c49]/20">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {class_options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.academicYearId ?? undefined}
            onValueChange={(value) => handleAcademicYearChagne(value)}
          >
            <SelectTrigger className="bg-[#eff4ff] border-none rounded-[12px] text-sm font-medium text-[#0b1c30] w-[140px] h-10 px-4 focus:ring-2 focus:ring-[#006c49]/20">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {year_options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select
          value={filters.sortBy ?? undefined}
          onValueChange={(value) => handleSortChange(value)}
        >
          <SelectTrigger className="bg-[#eff4ff] border-none rounded-[12px] text-sm font-medium text-[#0b1c30] w-[140px] h-10 px-4 focus:ring-2 focus:ring-[#006c49]/20">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center bg-[#eff4ff] p-1 rounded-[12px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-2 rounded-[10px] transition-colors",
              viewMode === "grid"
                ? "bg-white shadow-sm text-[#006c49]"
                : "text-[#3c4a42] hover:bg-[#dce9ff]",
            )}
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("table")}
            className={cn(
              "p-2 rounded-[10px] transition-colors",
              viewMode === "table"
                ? "bg-white shadow-sm text-[#006c49]"
                : "text-[#3c4a42] hover:bg-[#dce9ff]",
            )}
          >
            <ListIcon className="w-5 h-5" />
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
                    {filters.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, isActive: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.academicClassId !== null &&
                filters.academicClassId !== undefined && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                  >
                    <span className="font-medium text-[11px]">
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
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}

              {filters.academicYearId !== null &&
                filters.academicYearId !== undefined && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                  >
                    <span className="font-medium text-[11px]">
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
