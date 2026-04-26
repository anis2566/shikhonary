"use client";

import React from "react";
import { StudentFormValues } from "@workspace/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
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
import { School, Users, Clock, Layers, Hash } from "lucide-react";
import { FormActions } from "./form-actions";
import { groupOptions, shiftOptions } from "@workspace/utils/constants";

interface AcademicPlacementFormProps {
  form: UseFormReturn<StudentFormValues>;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
}

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

export const AcademicPlacementForm = ({
  form,
  onNext,
  onPrev,
  isLoading,
}: AcademicPlacementFormProps) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 px-2">
          Academic Placement
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Previous Institute */}
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="institute"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1.5">
                <FieldLabel icon={School} label="Previous Institute" />
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter previous school/college name"
                    className="h-11 px-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Group */}
        <FormField
          control={form.control}
          name="group"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Layers} label="Academic Group" />
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Select group…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={contentClass}>
                  {groupOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value as string}
                      className="text-sm font-medium rounded-xl"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Shift */}
        <FormField
          control={form.control}
          name="shift"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Clock} label="Shift" />
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Select shift…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={contentClass}>
                  {shiftOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value as string}
                      className="text-sm font-medium rounded-xl"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Section */}
        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Users} label="Section" />
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="e.g. A, B, Rose"
                  className="h-11 px-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Roll Number */}
        <FormField
          control={form.control}
          name="roll"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Hash} label="Roll Number" />
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter class roll number"
                  className="h-11 px-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mt-4" />

      {/* Actions */}
      <FormActions
        onPrev={onPrev}
        onNext={onNext}
        isLoading={isLoading}
        prevLabel="Back to Profile"
        loadingLabel="Validating..."
      />
    </div>
  );
};
