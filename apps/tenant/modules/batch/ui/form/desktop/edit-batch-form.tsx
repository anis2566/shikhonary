"use client";

import {
  useForm,
  zodResolver,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Activity,
  Group,
  School,
  Calendar as CalendarIcon,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { batchFormSchema, BatchFormValues } from "@workspace/schema";
import {
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
  useUpdateBatch,
} from "@workspace/api-client";
import { useEffect } from "react";
import { TenantTypes } from "@workspace/db";

interface EditBatchFormProps {
  batch: TenantTypes.Batch;
}

export const EditBatchForm = ({ batch }: EditBatchFormProps) => {
  const router = useRouter();

  const { mutateAsync: updateBatch, isPending } = useUpdateBatch();
  const { data: academicClasses } = useAcademicClassesForSelection();
  const { data: academicYears } = useAcademicYearsForSelection();

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      name: batch.name,
      academicClassId: batch.academicClassId,
      academicYearId: batch.academicYearId,
      capacity: batch.capacity,
      isActive: batch.isActive,
    },
  });

  const watchAll = form.watch();

  // Sync academicYear string when academicYearId changes
  useEffect(() => {
    if (watchAll.academicYearId && academicYears) {
      const selectedYear = academicYears.find(
        (y) => y.id === watchAll.academicYearId,
      );
      if (selectedYear) {
        form.setValue("academicYear", selectedYear.name);
      }
    }
  }, [watchAll.academicYearId, academicYears, form]);

  async function onSubmit(values: BatchFormValues) {
    try {
      await updateBatch({ id: batch.id, ...values });
      router.push("/batches");
    } catch (error: unknown) {
      console.error(error);
    }
  }

  // Get display names for preview
  const selectedClassName =
    academicClasses?.find((c) => c.id === watchAll.academicClassId)
      ?.displayName || "Select a class";
  const selectedYearName = watchAll.academicYear || "Select a year";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 px-4 md:px-8">
      {/* Left Column: Form Layers */}
      <div className="lg:col-span-8 space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Basic Information */}
            <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-ambient border border-surface-container/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-on-surface tracking-tight">
                    Basic Information
                  </h2>
                  <p className="text-sm text-on-surface-variant font-medium">
                    Define the core identity of this learning group
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                        Batch Name <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Morning Batch A"
                          className="h-12 bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all placeholder:text-on-surface-variant/40 text-base"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-on-surface-variant/70 italic">
                        Use a descriptive name that helps identify waitlists or
                        schedules.
                      </FormDescription>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <FormField
                    control={form.control}
                    name="academicClassId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                          Assigned Class{" "}
                          <span className="text-rose-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-primary/40 transition-all font-normal w-full">
                              <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-surface-container overflow-hidden shadow-ambient">
                            {academicClasses?.map((cls) => (
                              <SelectItem
                                key={cls.id}
                                value={cls.id}
                                className="h-10 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer"
                              >
                                {cls.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicYearId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                          Academic Year <span className="text-rose-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-primary/40 transition-all font-normal w-full">
                              <SelectValue placeholder="Select a year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-surface-container overflow-hidden shadow-ambient">
                            {academicYears?.map((year) => (
                              <SelectItem
                                key={year.id}
                                value={year.id}
                                className="h-10 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer"
                              >
                                {year.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Capacity & Constraints */}
            <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-ambient border border-surface-container/50 animate-in fade-in slide-in-from-bottom-4 delay-150 duration-500 fill-mode-both">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                  <Group className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-on-surface tracking-tight">
                    Capacity & Constraints
                  </h2>
                  <p className="text-sm text-on-surface-variant font-medium">
                    Manage enrollment limits and availability status
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem className="space-y-2 max-w-[240px]">
                      <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                        Maximum Enrollment Capacity
                      </FormLabel>
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Input
                            type="number"
                            className="h-12 bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all text-center font-bold text-lg w-32"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <span className="text-sm text-on-surface-variant font-bold italic">
                          Students total
                        </span>
                      </div>
                      <FormDescription className="text-xs text-on-surface-variant/70 italic">
                        Set the maximum number of students for this batch.
                      </FormDescription>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-5 bg-surface-container-low rounded-xl border border-primary/5 shadow-sm transition-all hover:bg-surface-container-low/80 group/toggle">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                            field.value
                              ? "bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-50"
                              : "bg-slate-100 text-slate-400 border border-slate-200/50",
                          )}
                        >
                          <Activity
                            className={cn(
                              "w-5 h-5 transition-all text-emerald-600",
                              field.value && "scale-110",
                            )}
                          />
                        </div>
                        <div className="space-y-1">
                          <FormLabel className="text-base font-bold text-on-surface leading-none group-hover/toggle:text-primary transition-colors cursor-pointer">
                            Immediate Activation
                          </FormLabel>
                          <FormDescription className="text-xs text-on-surface-variant font-medium leading-relaxed max-w-sm">
                            If enabled, this batch will be visible for
                            enrollment immediately upon creation.
                          </FormDescription>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                          className="data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </section>
          </form>
        </Form>
      </div>

      {/* Right Column: High Fidelity Preview */}
      <div className="lg:col-span-4 h-fit">
        <div className="sticky top-10 space-y-6">
          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/80">
              Real-time Card Preview
            </span>
          </div>

          <div className="bg-surface-container-lowest border border-outline/30 rounded-3xl p-3 shadow-ambient-double overflow-hidden group">
            {/* The High Fidelity Result Card */}
            <div className="bg-slate-50 overflow-hidden rounded-2xl border border-outline/20 transition-all duration-500">
              <div className="p-6">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h4 className="font-black text-on-surface text-2xl tracking-tight leading-none group-hover:text-primary transition-colors duration-300 truncate max-w-[180px]">
                      {watchAll.name || "Morning Batch A"}
                    </h4>
                    <p className="text-[10px] font-black text-on-surface-variant/60 mt-2 uppercase tracking-[0.2em]">
                      New Batch Entity
                    </p>
                  </div>
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm transition-all duration-300",
                      watchAll.isActive
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-slate-100 text-slate-400 border border-slate-200",
                    )}
                  >
                    {watchAll.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5 pt-2">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-outline/10 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-primary border border-emerald-100/50">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant/70 font-black uppercase tracking-widest">
                        Assigned Class
                      </p>
                      <p className="text-sm font-bold text-on-surface mt-0.5">
                        {selectedClassName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-outline/10 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100/50">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant/70 font-black uppercase tracking-widest">
                        Academic Period
                      </p>
                      <p className="text-sm font-bold text-on-surface mt-0.5">
                        {selectedYearName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-outline/10 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50">
                      <Group className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-on-surface-variant/70 font-black uppercase tracking-widest">
                        Initial Vacancy
                      </p>
                      <div className="flex items-center justify-between mt-1 text-sm font-bold text-on-surface">
                        <span>0 / {watchAll.capacity || 30} Students</span>
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                          <div className="w-0 h-full bg-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="p-5 space-y-4 pt-8">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="w-full h-14 gradient-signature hover:opacity-90 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-glow hover:scale-[1.01] active:scale-[0.98] border-none text-base tracking-tight"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="w-full h-14 bg-white border border-outline/30 hover:bg-slate-50 text-on-surface-variant font-bold rounded-2xl transition-all active:scale-[0.98] text-sm"
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>

            <div className="px-6 py-4 border-t border-outline/10 bg-slate-50/50">
              <p className="text-[10px] text-on-surface-variant/80 text-center leading-relaxed font-medium italic">
                Changes will be applied instantly to the student registration
                portal once successfully created.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
