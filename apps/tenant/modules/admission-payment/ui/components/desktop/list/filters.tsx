"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, LayoutGrid, List as ListIcon, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  useAcademicYearsForSelection,
  useAdmissionPaymentFilters,
} from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  admissionPaymentMethods,
} from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";

interface FiltersProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function Filters({ viewMode, onViewModeChange }: FiltersProps) {
  const [studentSearch, setStudentSearch] = useState("");
  const debouncedStudentSearch = useDebounce(studentSearch, 500);
  const [transactionSearch, setTransactionSearch] = useState("");
  const debouncedTransactionSearch = useDebounce(transactionSearch, 500);
  
  const [filters, setFilters] = useAdmissionPaymentFilters();

  const [date, setDate] = useState<Date | undefined>(
    filters.paymentDate ? new Date(filters.paymentDate) : undefined
  );

  const { data: years } = useAcademicYearsForSelection();

  const year_options =
    years?.map((item) => ({
      label: item.name,
      value: item.id,
    })) ?? [];

  useEffect(() => {
    setFilters({ ...filters, studentSearch: debouncedStudentSearch || null });
  }, [debouncedStudentSearch]);

  useEffect(() => {
    setFilters({ ...filters, transactionSearch: debouncedTransactionSearch || null });
  }, [debouncedTransactionSearch]);

  useEffect(() => {
    setFilters({
      ...filters,
      paymentDate: date ? date.toISOString() : null,
    });
  }, [date]);

  const handleAcademicYearChange = (id: string) => {
    setFilters({
      ...filters,
      academicYearId: id === "all" ? null : id,
    });
  };

  const handleMethodChange = (method: string) => {
    setFilters({
      ...filters,
      paymentMethod: method === "all" ? null : method,
    });
  };

  const handleStatusChange = (status: string) => {
    setFilters({
      ...filters,
      status: status === "all" ? null : status,
    });
  };

  const hasActiveFilters =
    !!filters.status ||
    !!filters.sortBy ||
    !!filters.studentSearch ||
    !!filters.transactionSearch ||
    !!filters.academicYearId ||
    !!filters.paymentMethod ||
    !!filters.paymentDate ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setStudentSearch("");
    setTransactionSearch("");
    setDate(undefined);
    setFilters({
      studentSearch: null,
      transactionSearch: null,
      limit: null,
      page: null,
      sortBy: null,
      academicYearId: null,
      status: null,
      paymentMethod: null,
      paymentDate: null,
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="bg-white p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0b1c30]/50" />
          <Input
            className="w-full bg-[#f8f9ff] py-2.5 pl-10 pr-4 rounded-[12px] border-slate-200 focus:border-none focus:ring-2 focus:ring-primary/60 text-sm text-[#0b1c30] placeholder:text-[#0b1c30]/40 h-10 transition-all"
            placeholder="Search Student (Name or ID)..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
          />
        </div>

        <div className="relative flex-grow min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0b1c30]/50" />
          <Input
            className="w-full bg-[#f8f9ff] py-2.5 pl-10 pr-4 rounded-[12px] border-slate-200 focus:border-none focus:ring-2 focus:ring-primary/60 text-sm text-[#0b1c30] placeholder:text-[#0b1c30]/40 h-10 transition-all"
            placeholder="Search Transaction ID..."
            value={transactionSearch}
            onChange={(e) => setTransactionSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-[#f1f5f9]/50 p-1 rounded-[12px] border border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("all")}
            className={cn(
              "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
              filters.status === null
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
            )}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("COMPLETED")}
            className={cn(
              "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
              filters.status === "COMPLETED"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
            )}
          >
            Completed
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("PENDING")}
            className={cn(
              "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
              filters.status === "PENDING"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
            )}
          >
            Pending
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "bg-[#eff4ff] border-none rounded-[12px] text-sm font-semibold text-[#0b1c30] w-[200px] h-10 px-4 justify-start text-left hover:bg-[#e5eeff] transition-all",
                  !date && "text-[#0b1c30]/40"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                {date ? format(date, "PPP") : <span>Pick a Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-ambient overflow-hidden" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>

          <Select
            value={filters.paymentMethod ?? "all"}
            onValueChange={handleMethodChange}
          >
            <SelectTrigger className="bg-[#f0fdf4] border-none rounded-[12px] text-sm font-semibold text-emerald-700 w-[140px] h-10 px-4 focus:ring-2 focus:ring-emerald-200 transition-all hover:bg-[#dcfce7]">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-ambient bg-white/95 backdrop-blur-md">
              <SelectItem value="all">All Methods</SelectItem>
              {admissionPaymentMethods.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
              {date && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-indigo-100 text-xs text-indigo-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    Date:
                  </span>
                  <span className="font-bold text-[11px]">
                    {format(date, "PPP")}
                  </span>
                  <button
                    onClick={() => setDate(undefined)}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.studentSearch && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-indigo-100 text-xs text-indigo-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    Student:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.studentSearch}
                  </span>
                  <button
                    onClick={() => {
                      setStudentSearch("");
                      setFilters({ ...filters, studentSearch: null });
                    }}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.transactionSearch && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-100 text-xs text-blue-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    TX:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.transactionSearch}
                  </span>
                  <button
                    onClick={() => {
                      setTransactionSearch("");
                      setFilters({ ...filters, transactionSearch: null });
                    }}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.status && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    Status:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.status}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, status: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.paymentMethod && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    Method:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.paymentMethod}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, paymentMethod: null })}
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
