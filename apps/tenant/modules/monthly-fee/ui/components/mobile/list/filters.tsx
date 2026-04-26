"use client";

import React from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Clock,
  History,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import { cn } from "@workspace/ui/lib/utils";
import {
  useMonthlyFeeFilters,
  useAcademicYearsForSelection,
  useAcademicClassesForSelection,
} from "@workspace/api-client";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { LayoutGrid } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest", icon: Clock },
  { label: "Oldest", value: "oldest", icon: History },
  { label: "High Fee", value: "amount-desc", icon: TrendingUp },
  { label: "Low Fee", value: "amount-asc", icon: TrendingDown },
];

export const Filters = () => {
  const [filters, setFilters] = useMonthlyFeeFilters();
  const { data: years } = useAcademicYearsForSelection();
  const { data: classes } = useAcademicClassesForSelection();

  const yearOptions =
    years?.map((item) => ({ label: item.name, value: item.id })) ?? [];

  const classOptions =
    classes?.map((item) => ({ label: item.displayName, value: item.id })) ?? [];

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sortBy: value });
  };

  const handleAcademicYearChange = (id: string) => {
    setFilters({ ...filters, academicYearId: id === "all" ? null : id });
  };

  const handleAcademicClassChange = (id: string) => {
    setFilters({ ...filters, academicClassId: id === "all" ? null : id });
  };

  const handleResetFilters = () => {
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      academicYearId: null,
      academicClassId: null,
    });
  };

  const hasActiveFilters =
    !!filters.sortBy ||
    !!filters.search ||
    !!filters.academicYearId ||
    !!filters.academicClassId ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const activeCount = [
    filters.sortBy,
    filters.academicYearId,
    filters.academicClassId,
    filters.search,
  ].filter(Boolean).length;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          aria-label={
            hasActiveFilters ? `Filters (${activeCount} active)` : "Filters"
          }
          className={cn(
            "relative h-10 w-10 rounded-xl border-none transition-all duration-200 active:scale-95",
            hasActiveFilters
              ? "bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100"
              : "bg-slate-50 text-slate-400 hover:bg-slate-100",
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {hasActiveFilters && (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none"
            >
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-white border-none shadow-2xl pb-safe">
        <DrawerHeader>
          <DrawerTitle />
        </DrawerHeader>
        {/* Drag handle */}
        <div className="mx-auto w-10 h-1 rounded-full bg-slate-200 mt-3" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              Filter Records
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {hasActiveFilters
                ? `${activeCount} filter${activeCount > 1 ? "s" : ""} active`
                : "No filters applied"}
            </p>
          </div>
          {/* Quick reset */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
            >
              <RotateCcw className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>

        <div className="px-5 pt-5 space-y-6">
          {/* Academic Year */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-3">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Academic Year
              </span>
            </div>
            <Select
              value={filters.academicYearId ?? "all"}
              onValueChange={handleAcademicYearChange}
            >
              <SelectTrigger
                className={cn(
                  "w-full h-12 px-4 rounded-2xl text-sm font-semibold border transition-all",
                  filters.academicYearId
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700 focus:ring-emerald-500/20"
                    : "bg-slate-50 border-slate-100 text-slate-700 focus:ring-slate-200",
                )}
              >
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl overflow-hidden">
                <SelectItem
                  value="all"
                  className="text-sm font-medium rounded-xl"
                >
                  All Years
                </SelectItem>
                {yearOptions.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="text-sm font-medium rounded-xl"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Academic Class */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-3">
              <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Academic Class
              </span>
            </div>
            <Select
              value={filters.academicClassId ?? "all"}
              onValueChange={handleAcademicClassChange}
            >
              <SelectTrigger
                className={cn(
                  "w-full h-12 px-4 rounded-2xl text-sm font-semibold border transition-all",
                  filters.academicClassId
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700 focus:ring-emerald-500/20"
                    : "bg-slate-50 border-slate-100 text-slate-700 focus:ring-slate-200",
                )}
              >
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl overflow-hidden">
                <SelectItem
                  value="all"
                  className="text-sm font-medium rounded-xl"
                >
                  All Classes
                </SelectItem>
                {classOptions.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="text-sm font-medium rounded-xl"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Sort By
              </span>
            </div>
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Sort records"
            >
              {SORT_OPTIONS.map(({ label, value, icon: Icon }) => {
                const isSelected = filters.sortBy === value;
                return (
                  <button
                    key={value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSortChange(value)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 border active:scale-[0.97]",
                      isSelected
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-inner"
                        : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-100 hover:bg-white",
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0",
                        isSelected ? "bg-emerald-100" : "bg-slate-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-3.5 h-3.5",
                          isSelected ? "text-emerald-600" : "text-slate-400",
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isSelected && "font-bold",
                      )}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DrawerFooter className="px-5 pt-6 pb-2 grid grid-cols-[1fr_2fr] gap-3">
          <Button
            onClick={handleResetFilters}
            variant="ghost"
            disabled={!hasActiveFilters}
            className="h-12 rounded-2xl font-bold bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-all border-none"
          >
            Reset
          </Button>
          <DrawerClose asChild>
            <Button className="h-12 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/25 border-none">
              Show Results
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
