"use client";

import React from "react";
import { monthlyFeeFormSchema, type MonthlyFeeFormValues } from "@workspace/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
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
} from "@workspace/api-client";
import {
  CalendarDays,
  CircleDollarSign,
  LayoutGrid,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";

interface MonthlyFeeFormProps {
  initialData?: Partial<MonthlyFeeFormValues>;
  onSubmit: (values: MonthlyFeeFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export const MonthlyFeeForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: MonthlyFeeFormProps) => {
  const { data: years } = useAcademicYearsForSelection();
  const { data: classes } = useAcademicClassesForSelection();

  const form = useForm<MonthlyFeeFormValues>({
    resolver: zodResolver(monthlyFeeFormSchema),
    defaultValues: {
      academicYearId: initialData?.academicYearId || "",
      academicClassId: initialData?.academicClassId || "",
      amount: initialData?.amount || 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Academic Year */}
        <FormField
          control={form.control}
          name="academicYearId"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <CalendarDays className="w-3.5 h-3.5 text-emerald-500" />
                Academic Year
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={mode === "edit"}
              >
                <FormControl>
                  <SelectTrigger className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all disabled:opacity-50">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
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
              <FormMessage className="text-[11px] font-bold text-rose-500 flex items-center gap-1" />
            </FormItem>
          )}
        />

        {/* Academic Class */}
        <FormField
          control={form.control}
          name="academicClassId"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
                Class
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={mode === "edit"}
              >
                <FormControl>
                  <SelectTrigger className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all disabled:opacity-50">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
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
              <FormMessage className="text-[11px] font-bold text-rose-500 flex items-center gap-1" />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <CircleDollarSign className="w-3.5 h-3.5 text-emerald-500" />
                Amount
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                    className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex items-center gap-1.5 h-11 px-4 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-slate-50 border-none transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 border-none"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "create" ? (
              <Plus className="w-4 h-4" strokeWidth={3} />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create Fee"
                : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
