"use client";

import { ArrowUpDown, FilterIcon, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

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

import { useAcademicYearFilters } from "@workspace/api-client";

import {
  activeBooleanStatusOptions,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  SORT,
  sortOptions,
} from "@workspace/utils/constants";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";

interface FilterProps {
  isLoading: boolean;
}

export const Filter = ({ isLoading }: FilterProps) => {
  const [search, setSearch] = useState("");

  const debounceValue = useDebounce(search, 500);

  const [filters, setFilters] = useAcademicYearFilters();

  useEffect(() => {
    setFilters({
      search: debounceValue,
    });
  }, [debounceValue, setFilters]);

  const handleIsActiveChange = (value: boolean) => {
    setFilters({
      ...filters,
      isActive: value,
    });
  };

  const handleIsCurrentChange = (value: boolean) => {
    setFilters({
      ...filters,
      isCurrent: value ? true : null,
    });
  };

  const handleSortChange = (value: SORT) => {
    setFilters({
      ...filters,
      sortOrder: value,
    });
  };

  const hasActiveFilters =
    filters.isActive === true ||
    filters.isCurrent === true ||
    !!filters.sortOrder ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortOrder: null,
      isActive: null,
      isCurrent: null,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full lg:w-auto">
        {/* Search Input */}
        <div className="relative w-full md:w-[320px] group">
          <Input
            placeholder="Search academic years..."
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

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Active Status Filter */}
          <Select
            value={filters.isActive?.toString() ?? undefined}
            onValueChange={(v) => handleIsActiveChange(v === "true")}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10 min-w-[110px] bg-background/50 backdrop-blur-sm border-border/50 rounded-xl hover:bg-muted/50 transition-all shadow-soft font-medium">
              <FilterIcon className="h-4 w-4 mr-2 text-primary/70" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {activeBooleanStatusOptions.map((option) => (
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

          {/* Current Status Filter */}
          <div className="flex items-center space-x-2 px-3 h-10 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-soft">
            <Switch
              id="current-status"
              checked={filters.isCurrent ? true : false}
              onCheckedChange={(v) => handleIsCurrentChange(v)}
              disabled={isLoading}
            />
            <Label
              htmlFor="current-status"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Current
            </Label>
          </div>

          {/* Sort Filter */}
          <Select
            value={filters.sortOrder || ""}
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
              className="h-10 px-3 text-destructive bg-destructive/10 hover:bg-destructive/20 hover:text-destructive rounded-xl transition-all font-semibold border border-transparent hover:border-destructive/20"
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
