"use client";

import React from "react";
import { StudentFormValues } from "@workspace/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
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
  useBatchByYearClassId,
  useNextCounterId,
} from "@workspace/api-client";
import { BadgeInfo, CalendarDays, LayoutGrid, Users } from "lucide-react";
import { FormActions } from "./form-actions";

interface SetupFormProps {
  form: UseFormReturn<StudentFormValues>;
  onNext: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

// Reusable field wrapper with icon label style
const FieldLabel = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <FormLabel className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
    <Icon className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
    {label}
  </FormLabel>
);

const triggerClass =
  "w-full h-11 px-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all shadow-none";

const contentClass = "rounded-2xl border-slate-100 shadow-xl";

export const SetupForm = ({ form, onNext, isLoading, isEdit }: SetupFormProps) => {
  const academicClass = form.watch("academicClassId");
  const academicYear = form.watch("academicYearId");

  const { data: years } = useAcademicYearsForSelection();
  const { data: classes } = useAcademicClassesForSelection();
  const { data: batches } = useBatchByYearClassId(academicYear, academicClass);
  const { data: nextId, isLoading: isNextIdLoading } = useNextCounterId(
    isEdit ? "" : academicYear,
    isEdit ? "" : academicClass,
  );

  React.useEffect(() => {
    if (!isEdit && nextId !== undefined && nextId !== null) {
      form.setValue("studentId", String(nextId));
      form.trigger("studentId");
    }
  }, [nextId, form, isEdit]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in [animation-delay:200ms]">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 px-2">
          Academic Setup
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Academic Year */}
        <FormField
          control={form.control}
          name="academicYearId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={CalendarDays} label="Academic Year" />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Select year…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={contentClass}>
                  {years?.map((year) => (
                    <SelectItem
                      key={year.id}
                      value={year.id}
                      className="text-sm font-medium rounded-xl"
                    >
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Academic Class */}
        <FormField
          control={form.control}
          name="academicClassId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={LayoutGrid} label="Academic Class" />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Select class…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={contentClass}>
                  {classes?.map((cls) => (
                    <SelectItem
                      key={cls.id}
                      value={cls.id}
                      className="text-sm font-medium rounded-xl"
                    >
                      {cls.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Batch */}
        <FormField
          control={form.control}
          name="batchId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Users} label="Batch" />
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Assign batch…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={contentClass}>
                  {batches?.map((batch) => (
                    <SelectItem
                      key={batch.id}
                      value={batch.id}
                      className="text-sm font-medium rounded-xl"
                    >
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Student ID */}
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={BadgeInfo} label="Student ID" />
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={String(nextId ?? "Auto-generated")}
                    value={field.value || ""}
                    className="h-11 px-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:text-slate-300 placeholder:font-normal cursor-not-allowed opacity-80"
                    readOnly
                  />
                  {/* Auto badge */}
                  {!field.value && nextId && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                      Auto
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Actions */}
      <FormActions
        onNext={onNext}
        isLoading={isLoading || isNextIdLoading}
        nextLabel="Continue to Profile"
        loadingLabel={isNextIdLoading ? "Generating ID..." : "Validating..."}
      />
    </div>
  );
};
