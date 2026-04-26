"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, Check, Loader2 } from "lucide-react";
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
  useStudentFilters,
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
  useBatchByYearClassId,
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
  const [filters, setFilters] = useStudentFilters();

  const { data: classes } = useAcademicClassesForSelection();
  const { data: years } = useAcademicYearsForSelection();
  const { data: batches, isLoading: isLoadingBatches } = useBatchByYearClassId(
    filters.academicYearId || "",
    filters.classId || "",
  );

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

  const batchOptions =
    batches?.map((item) => ({
      label: item.name,
      value: item.id,
    })) ?? [];

  const isActiveVal = filters.isActive || "all";

  const handleFilterStatusChange = (value: string) => {
    setFilters({
      ...filters,
      isActive: value === "all" ? null : (value as any),
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
      classId: id === "all" ? null : id,
      batchId: null, // Reset batch when class changes
    });
  };

  const handleAcademicYearChange = (id: string) => {
    setFilters({
      ...filters,
      academicYearId: id === "all" ? null : id,
      batchId: null, // Reset batch when year changes
    });
  };

  const handleBatchChange = (id: string) => {
    setFilters({
      ...filters,
      batchId: id === "all" ? null : id,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      isActive: null,
      classId: null,
      academicYearId: null,
      batchId: null,
    });
  };

  const isBatchDisabled = !filters.academicYearId || !filters.classId;

  const hasActiveFilters =
    !!filters.isActive ||
    !!filters.sortBy ||
    !!filters.search ||
    !!filters.classId ||
    !!filters.academicYearId ||
    !!filters.batchId ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          aria-label={hasActiveFilters ? "Filters (active)" : "Filters"}
          className={cn(
            "relative px-3 bg-white text-slate-400 rounded-xl flex items-center justify-center active:scale-95 transition-transform h-10 w-10 hover:bg-slate-50 shadow-sm border border-slate-100",
            hasActiveFilters && "text-primary bg-primary/5 border-primary/20",
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {hasActiveFilters && (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"
            />
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-white rounded-t-[32px] border-none shadow-2xl pb-8 max-h-[90vh]">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-slate-200 mt-3 mb-2" />

        <DrawerHeader className="px-6 text-left">
          <DrawerTitle className="text-xl font-bold tracking-tight text-slate-900">
            Filter Students
          </DrawerTitle>
          <DrawerDescription className="text-slate-500">
            Refine the student directory
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 space-y-6 mt-2 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Status Filter */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Enrollment Status
            </h3>
            <div className="grid grid-cols-1 gap-2" role="radiogroup">
              {[
                { label: "All Students", value: "all" },
                { label: "Active Only", value: "ACTIVE" },
                { label: "Inactive Only", value: "INACTIVE" },
              ].map((item) => {
                const isSelected = isActiveVal === item.value;
                return (
                  <button
                    key={item.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleFilterStatusChange(item.value)}
                    className={cn(
                      "flex items-center justify-between px-5 py-2.5 rounded-2xl transition-all duration-300 border",
                      isSelected
                        ? "bg-primary/5 border-primary/20 text-primary font-bold shadow-sm"
                        : "bg-transparent border-slate-100 text-slate-600 font-medium hover:border-slate-200",
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Year
                </h3>
                <Select
                  value={filters.academicYearId ?? "all"}
                  onValueChange={handleAcademicYearChange}
                >
                  <SelectTrigger className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-semibold text-slate-700 h-11 px-4 focus:ring-primary/10 transition-all">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="all" className="text-xs font-medium">
                      All Years
                    </SelectItem>
                    {yearOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value} className="text-xs font-medium">
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Class
                </h3>
                <Select
                  value={filters.classId ?? "all"}
                  onValueChange={handleAcademicClassChange}
                >
                  <SelectTrigger className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-semibold text-slate-700 h-11 px-4 focus:ring-primary/10 transition-all">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="all" className="text-xs font-medium">
                      All Classes
                    </SelectItem>
                    {classOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value} className="text-xs font-medium">
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Batch
              </h3>
              <Select
                value={filters.batchId ?? "all"}
                onValueChange={handleBatchChange}
                disabled={isBatchDisabled || isLoadingBatches}
              >
                <SelectTrigger className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-semibold text-slate-700 h-11 px-4 focus:ring-primary/10 transition-all">
                  {isLoadingBatches ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder={isBatchDisabled ? "Select year & class first" : "All Batches"} />
                  )}
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all" className="text-xs font-medium">
                    All Batches
                  </SelectItem>
                  {batchOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="text-xs font-medium">
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
              Sort Records
            </h3>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {[
                { label: "Newest first", value: "newest" },
                { label: "Oldest first", value: "oldest" },
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
                      "flex flex-col items-center justify-center px-4 py-3 rounded-2xl transition-all duration-300 border text-center",
                      isSelected
                        ? "bg-primary/5 border-primary/20 text-primary font-bold shadow-sm"
                        : "bg-transparent border-slate-100 text-slate-600 font-medium hover:border-slate-200",
                    )}
                  >
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DrawerFooter className="px-6 flex flex-row gap-3 pt-6 border-t border-slate-100 bg-white">
          <Button
            onClick={handleResetFilters}
            variant="ghost"
            disabled={!hasActiveFilters}
            className="flex-1 h-12 rounded-2xl font-bold bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-all border-none"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <DrawerClose asChild>
            <Button className="flex-[2] h-12 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 border-none">
              Apply Filters
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
