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
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Hash,
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
  useAdmissionPaymentFilters,
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
import { Input } from "@workspace/ui/components/input";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { format } from "date-fns";
import { admissionPaymentMethods } from "@workspace/utils/constants";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest", icon: Clock },
  { label: "Oldest", value: "oldest", icon: History },
  { label: "High Amount", value: "amount-desc", icon: TrendingUp },
  { label: "Low Amount", value: "amount-asc", icon: TrendingDown },
];

const STATUS_OPTIONS = [
  { label: "Completed", value: "COMPLETED", icon: CheckCircle2 },
  { label: "Pending", value: "PENDING", icon: AlertCircle },
];

export const Filters = () => {
  const [filters, setFilters] = useAdmissionPaymentFilters();
  const { data: years } = useAcademicYearsForSelection();

  const yearOptions =
    years?.map((item) => ({ label: item.name, value: item.id })) ?? [];

  const handleResetFilters = () => {
    setFilters({
      studentSearch: null,
      transactionSearch: null,
      paymentMethod: null,
      paymentDate: null,
      status: null,
      academicYearId: null,
      sortBy: null,
      limit: DEFAULT_PAGE_SIZE,
      page: DEFAULT_PAGE,
    });
  };

  const hasActiveFilters =
    !!filters.sortBy ||
    !!filters.studentSearch ||
    !!filters.transactionSearch ||
    !!filters.paymentMethod ||
    !!filters.paymentDate ||
    !!filters.status ||
    !!filters.academicYearId ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const activeCount = [
    filters.sortBy,
    filters.academicYearId,
    filters.paymentMethod,
    filters.paymentDate,
    filters.status,
    filters.studentSearch,
    filters.transactionSearch,
  ].filter(Boolean).length;

  const date = filters.paymentDate ? new Date(filters.paymentDate) : undefined;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
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
              className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none"
            >
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-white border-none shadow-2xl pb-safe h-[85vh]">
        <DrawerHeader className="pb-0">
          <DrawerTitle className="hidden" />
          {/* Drag handle */}
          <div className="mx-auto w-10 h-1 rounded-full bg-slate-200 mt-1 mb-4" />
        </DrawerHeader>

        <div className="flex items-center justify-between px-5 pt-2 pb-1">
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

        <div className="flex-1 overflow-y-auto px-5 pt-5 space-y-6 no-scrollbar pb-10">
          {/* Transaction Search */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-3">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Transaction ID
              </span>
            </div>
            <Input
              value={filters.transactionSearch || ""}
              onChange={(e) => setFilters({ ...filters, transactionSearch: e.target.value || null })}
              placeholder="Enter exact transaction ID..."
              className="bg-slate-50 border-slate-100 rounded-2xl h-12 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

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
              onValueChange={(val) => setFilters({ ...filters, academicYearId: val === "all" ? null : val })}
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
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                <SelectItem value="all" className="text-sm font-medium rounded-xl">All Years</SelectItem>
                {yearOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value} className="text-sm font-medium rounded-xl">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-3">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Payment Method
              </span>
            </div>
            <Select
              value={filters.paymentMethod ?? "all"}
              onValueChange={(val) => setFilters({ ...filters, paymentMethod: val === "all" ? null : val })}
            >
              <SelectTrigger
                className={cn(
                  "w-full h-12 px-4 rounded-2xl text-sm font-semibold border transition-all",
                  filters.paymentMethod
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-slate-50 border-slate-100 text-slate-700",
                )}
              >
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                <SelectItem value="all" className="text-sm font-medium rounded-xl">All Methods</SelectItem>
                {admissionPaymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value} className="text-sm font-medium rounded-xl">
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Status
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map(({ label, value, icon: Icon }) => {
                const isSelected = filters.status === value;
                return (
                  <button
                    key={value}
                    onClick={() => setFilters({ ...filters, status: isSelected ? null : value })}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 border",
                      isSelected
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-inner"
                        : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-100",
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-emerald-600" : "text-slate-400")} />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-3">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Payment Date
              </span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 px-4 rounded-2xl text-sm font-semibold border text-left justify-start transition-all",
                    filters.paymentDate
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : "bg-slate-50 border-slate-100 text-slate-400",
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4 opacity-50" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-ambient overflow-hidden" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => setFilters({ ...filters, paymentDate: d ? d.toISOString() : null })}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sort By */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Sort By
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map(({ label, value, icon: Icon }) => {
                const isSelected = filters.sortBy === value;
                return (
                  <button
                    key={value}
                    onClick={() => setFilters({ ...filters, sortBy: isSelected ? null : value })}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 border",
                      isSelected
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-inner"
                        : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-100",
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-emerald-600" : "text-slate-400")} />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DrawerFooter className="px-5 pt-6 pb-2 grid grid-cols-[1fr_2fr] gap-3 bg-white border-t border-slate-50">
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
