"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import { cn } from "@workspace/ui/lib/utils";
import {
  useBatchFilters,
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
} from "@workspace/api-client";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export const Filters = () => {
  const [filters, setFilters] = useBatchFilters();

  const { data: classes } = useAcademicClassesForSelection();
  const { data: years } = useAcademicYearsForSelection();

  const classOptions =
    classes?.map((item) => ({
      label: item.displayName,
      value: item.id,
    })) ?? [];

  const yearOptions =
    years?.map((item) => ({
      label: item.name,
      value: item.id,
    })) ?? [];

  const isActiveVal =
    filters.isActive === true
      ? "true"
      : filters.isActive === false
        ? "false"
        : "all";

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

  const handleAcademicClassChange = (id: string) => {
    setFilters({
      ...filters,
      academicClassId: id === "all" ? null : id,
    });
  };

  const handleAcademicYearChange = (id: string) => {
    setFilters({
      ...filters,
      academicYearId: id === "all" ? null : id,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      isActive: null,
      academicClassId: null,
      academicYearId: null,
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

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          aria-label={hasActiveFilters ? "Filters (active)" : "Filters"}
          className={cn(
            "relative px-3 bg-white text-slate-400 rounded-xl flex items-center justify-center active:scale-95 transition-transform h-11 w-11 hover:bg-slate-50 shadow-sm border-none",
            hasActiveFilters && "text-emerald-600 bg-emerald-50",
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {hasActiveFilters && (
            <span
              aria-hidden="true"
              className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-600 rounded-full border-2 border-white"
            />
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-white rounded-t-[32px] border-none shadow-2xl pb-6">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-slate-200 mt-3 mb-2" />

        <DrawerHeader className="px-6 text-left">
          <DrawerTitle className="text-xl font-bold tracking-tight text-slate-900">
            Filter Batches
          </DrawerTitle>
          <DrawerDescription className="text-slate-500">
            Refine the batch list
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 space-y-4 mt-2">
          {/* Status Filter */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Status
            </h3>
            <div
              className="grid grid-cols-1 gap-2"
              role="radiogroup"
              aria-label="Filter by status"
            >
              {[
                { label: "All Status", value: "all" },
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ].map((item) => {
                const isSelected = isActiveVal === item.value;
                return (
                  <button
                    key={item.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleFilterStatusChange(item.value)}
                    className={cn(
                      "flex items-center justify-between px-5 py-2 rounded-2xl transition-all duration-300 border",
                      isSelected
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 font-bold shadow-inner scale-[0.98]"
                        : "bg-transparent border-slate-100 text-slate-600 font-medium hover:border-slate-200 hover:bg-slate-50",
                    )}
                  >
                    <span className="text-sm">{item.label}</span>
                    {isSelected && (
                      <Check className="w-5 h-5 animate-in zoom-in-50 duration-200" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academic Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Class
              </h3>
              <Select
                value={filters.academicClassId ?? "all"}
                onValueChange={handleAcademicClassChange}
              >
                <SelectTrigger className="w-full bg-slate-100 border-slate-100 rounded-xl text-xs font-semibold text-slate-700 h-10 px-4 focus:ring-emerald-600/10 transition-all">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all" className="text-xs font-medium">
                    All Classes
                  </SelectItem>
                  {classOptions.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="text-xs font-medium"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Year
              </h3>
              <Select
                value={filters.academicYearId ?? "all"}
                onValueChange={handleAcademicYearChange}
              >
                <SelectTrigger className="w-full bg-slate-100 border-slate-100 rounded-xl text-xs font-semibold text-slate-700 h-10 px-4 focus:ring-emerald-600/10 transition-all">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all" className="text-xs font-medium">
                    All Years
                  </SelectItem>
                  {yearOptions.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="text-xs font-medium"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Sort By
            </h3>
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Sort batches"
            >
              {[
                { label: "Newest", value: "newest" },
                { label: "Oldest", value: "oldest" },
                { label: "Name (A-Z)", value: "name-asc" },
                { label: "Name (Z-A)", value: "name-desc" },
              ].map((item) => {
                const isSelected = filters.sortBy === item.value;
                return (
                  <button
                    key={item.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSortChange(item.value)}
                    className={cn(
                      "flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 border",
                      isSelected
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 font-bold shadow-inner scale-[0.98]"
                        : "bg-transparent border-slate-100 text-slate-600 font-medium hover:border-slate-200 hover:bg-slate-50",
                    )}
                  >
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DrawerFooter className="px-6 flex flex-row gap-3 mt-2">
          <Button
            onClick={handleResetFilters}
            variant="ghost"
            disabled={!hasActiveFilters}
            className="flex-1 h-10 rounded-2xl font-bold bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-slate-50 transition-all border-none"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <DrawerClose asChild>
            <Button className="flex-[2] h-10 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 border-none">
              Apply Filters
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
