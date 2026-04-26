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
import { useAcademicYearFilters } from "@workspace/api-client";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";

export const Filters = () => {
  const [filters, setFilters] = useAcademicYearFilters();

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

  const handleResetFilters = () => {
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      isActive: null,
    });
  };
  const hasActiveFilters =
    (filters.isActive !== null && filters.isActive !== undefined) ||
    !!filters.sortBy ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          aria-label={hasActiveFilters ? "Filters (active)" : "Filters"}
          className={cn(
            "relative px-3 bg-surface-container-lowest text-on-surface-variant/40 rounded-xl flex items-center justify-center active:scale-95 transition-transform h-11 w-11 hover:bg-surface-container-lowest/80 shadow-sm border-none",
            hasActiveFilters && "text-primary bg-primary/5",
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {hasActiveFilters && (
            <span
              aria-hidden="true"
              className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface-container-lowest"
            />
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-surface-container-lowest rounded-t-[32px] border-none shadow-2xl pb-8">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-outline-variant/30 mt-3 mb-6" />

        <DrawerHeader className="px-6 text-left">
          <DrawerTitle className="text-xl font-bold tracking-tight text-on-surface">
            Filter Years
          </DrawerTitle>
          <DrawerDescription className="text-on-surface-variant/60">
            Refine the academic year list
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 space-y-8 mt-4">
          {/* Status Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">
              Status
            </h3>
            <div
              className="grid grid-cols-1 gap-2"
              role="radiogroup"
              aria-label="Filter by status"
            >
              {[
                { label: "All", value: "all" },
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
                        ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-inner scale-[0.98]"
                        : "bg-transparent border-on-surface/20 text-on-surface font-medium hover:border-on-surface/30 hover:bg-surface-container-low/40",
                    )}
                  >
                    {item.label}
                    {isSelected && (
                      <Check className="w-5 h-5 animate-in zoom-in-50 duration-200" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">
              Timeline Sort
            </h3>
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Sort timeline"
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
                        ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-inner scale-[0.98]"
                        : "bg-transparent border-on-surface/20 text-on-surface font-medium hover:border-on-surface/30 hover:bg-surface-container-low/40",
                    )}
                  >
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DrawerFooter className="px-6 flex flex-row gap-3 mt-4">
          <Button
            onClick={handleResetFilters}
            variant="ghost"
            disabled={!hasActiveFilters}
            className="flex-1 h-10 rounded-2xl font-bold bg-surface-container-low text-on-surface-variant hover:bg-surface-container-low/80 disabled:opacity-50 disabled:hover:bg-surface-container-low transition-all border-none"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <DrawerClose asChild>
            <Button className="flex-[2] h-10 rounded-2xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 border-none">
              Apply Filters
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
