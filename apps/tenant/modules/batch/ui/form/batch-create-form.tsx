"use client";

import React, { useState } from "react";
import {
  Layers,
  Loader2,
  Users,
  Zap,
  Eye,
  GraduationCap,
  CalendarDays,
  Hash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

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
import { Switch } from "@workspace/ui/components/switch";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

// Dummy data for dropdowns until API integration
const dummyData = {
  classes: [
    { id: "1", name: "Grade 9" },
    { id: "2", name: "Grade 10" },
    { id: "3", name: "Grade 11" },
    { id: "4", name: "Grade 12" },
  ],
  academicYears: [
    { id: "1", name: "2025-2026" },
    { id: "2", name: "2026-2027" },
    { id: "3", name: "2024-2025" },
  ],
};

const schema = z.object({
  name: z.string().min(1, "Batch name is required"),
  classId: z.string().min(1, "Assigned class is required"),
  academicYearId: z.string().min(1, "Academic period is required"),
  maxCapacity: z.string().optional(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

// ─── Live Preview Card ───────────────────────────────────────────────────────
function BatchPreviewCard({ values }: { values: Partial<FormValues> }) {
  const selectedClass = dummyData.classes.find((c) => c.id === values.classId);
  const selectedYear = dummyData.academicYears.find(
    (y) => y.id === values.academicYearId
  );

  const capacity = values.maxCapacity ? parseInt(values.maxCapacity, 10) : 0;

  return (
    <div className="bg-white border border-outline rounded-2xl p-2 shadow-sm animate-fade-in [animation-delay:400ms]">
      {/* Internal Preview Content */}
      <div className="bg-slate-50/80 rounded-xl p-6 border border-outline/50">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h4 className="font-extrabold text-on-surface text-xl leading-tight transition-all">
              {values.name?.trim() || "Morning Batch A"}
            </h4>
            <p className="text-[10px] font-bold text-on-surface-variant/60 mt-1.5 uppercase tracking-widest">
              New Batch Entity
            </p>
          </div>
          {values.isActive && (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider"
            >
              Active
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {/* Class Row */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-outline/30 shadow-sm transition-all hover:border-primary/20">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-on-surface-variant group">
              <GraduationCap className="size-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant/70 font-bold uppercase tracking-widest">
                Assigned Class
              </p>
              <p className="text-sm font-bold text-on-surface">
                {selectedClass?.name || "Grade 9"}
              </p>
            </div>
          </div>

          {/* Academic Period Row */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-outline/30 shadow-sm transition-all hover:border-primary/20">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-on-surface-variant group">
              <CalendarDays className="size-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant/70 font-bold uppercase tracking-widest">
                Academic Period
              </p>
              <p className="text-sm font-bold text-on-surface">
                {selectedYear?.name || "2026 Academic Year"}
              </p>
            </div>
          </div>

          {/* Vacancy Row with Progress Bar */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-outline/30 shadow-sm transition-all hover:border-primary/20">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-on-surface-variant group">
              <Users className="size-5 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-on-surface-variant/70 font-bold uppercase tracking-widest">
                Initial Vacancy
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-bold text-on-surface">
                  0 / {capacity > 0 ? capacity : "∞"} Students
                </p>
                <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden border border-outline/10">
                  <div 
                    className="h-full bg-primary transition-all duration-500 rounded-full shadow-glow" 
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="p-6 md:p-8 border-b border-surface-container flex items-center gap-3">
      <div className="p-2.5 bg-primary/5 rounded-lg text-primary shadow-glow/10">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-bold text-on-surface">{title}</h3>
        <p className="text-xs text-on-surface-variant/70">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Field Label ─────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-bold text-on-surface tracking-wide uppercase">
      {children}
    </span>
  );
}

// ─── Tonal Input ─────────────────────────────────────────────────────────────
const tonalInputCls =
  "bg-slate-50/50 border border-outline rounded-xl px-4 py-8 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-400 text-on-surface font-medium text-sm h-auto shadow-sm";

const tonalSelectTriggerCls =
  "w-full bg-slate-50/50 border border-outline rounded-xl px-4 py-8 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-on-surface font-medium text-sm h-auto flex items-center justify-between shadow-sm";

// ─── Main Form Component ─────────────────────────────────────────────────────
export function BatchCreateForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      classId: "",
      academicYearId: "",
      maxCapacity: "",
      isActive: false,
    },
  });

  const watchedValues = form.watch();

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    // Simulate API call — replace with trpc mutation
    setTimeout(() => {
      console.log("Batch created:", data);
      setIsPending(false);
      router.push("/batches");
    }, 1000);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6"
      >
        {/* ── Left Column: Main Form ── */}
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_24px_48px_-12px_rgba(11,28,48,0.08)] overflow-hidden">
            <SectionHeader
              icon={GraduationCap}
              title="Basic Information"
              subtitle="Core identity and academic alignment"
            />
            <div className="p-6 md:p-8 space-y-6">
              {/* Batch Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>
                      <FieldLabel>Batch Name</FieldLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Morning Batch A"
                        disabled={isPending}
                        className={tonalInputCls}
                      />
                    </FormControl>
                    <p className="text-[11px] text-on-surface-variant">
                      Choose a unique and descriptive name
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assigned Class + Academic Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>
                        <FieldLabel>Assigned Class</FieldLabel>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPending}
                        >
                          <div className="relative">
                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant size-[18px] z-10 pointer-events-none" />
                            <SelectTrigger className={cn(tonalSelectTriggerCls, "pl-11 border-none shadow-none ring-offset-0 focus:ring-0 focus:ring-offset-0 overflow-hidden")}>
                              <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                          </div>
                          <SelectContent className="bg-surface-container-lowest border-surface-container shadow-ambient">
                            {dummyData.classes.map((c) => (
                              <SelectItem key={c.id} value={c.id} className="focus:bg-surface-container">
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="academicYearId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>
                        <FieldLabel>Academic Period</FieldLabel>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPending}
                        >
                          <div className="relative">
                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant size-[18px] z-10 pointer-events-none" />
                            <SelectTrigger className={cn(tonalSelectTriggerCls, "pl-11 border-none shadow-none ring-offset-0 focus:ring-0 focus:ring-offset-0 overflow-hidden")}>
                              <SelectValue placeholder="Select academic year" />
                            </SelectTrigger>
                          </div>
                          <SelectContent className="bg-surface-container-lowest border-surface-container shadow-ambient">
                            {dummyData.academicYears.map((y) => (
                              <SelectItem key={y.id} value={y.id} className="focus:bg-surface-container">
                                {y.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Capacity & Constraints Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_24px_48px_-12px_rgba(11,28,48,0.08)] overflow-hidden">
            <SectionHeader
              icon={Users}
              title="Capacity & Constraints"
              subtitle="Manage limits and availability status"
            />
            <div className="p-6 md:p-8 space-y-6">
              {/* Max Capacity */}
              <FormField
                control={form.control}
                name="maxCapacity"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>
                      <FieldLabel>Maximum Capacity</FieldLabel>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant size-[18px] pointer-events-none z-10" />
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          placeholder="Leave blank for unlimited"
                          disabled={isPending}
                          className={cn(tonalInputCls, "pl-11")}
                        />
                      </div>
                    </FormControl>
                    <p className="text-[11px] text-on-surface-variant">
                      Leave blank for unlimited capacity
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Immediate Activation Toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/10">
                    <div className="flex items-center gap-3">
                      <Zap className="size-5 fill-emerald-600 text-emerald-600" />
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-on-surface">
                          Immediate Activation
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          If enabled, this batch will be visible for enrollment
                          immediately upon creation.
                        </p>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="data-[state=checked]:bg-primary shrink-0"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            </div>
          </div>
        </div>

        {/* ── Right Column: Live Preview ── */}
        <div className="xl:sticky xl:top-24 xl:self-start space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Badge variant="ghost" className="bg-surface-container-high/50 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
              Institutional Preview
            </Badge>
          </div>
          
          <BatchPreviewCard values={watchedValues} />

          {/* Action Area in Sidebar as per wires */}
          <div className="p-4 pt-4 space-y-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-outline/30">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Zap className="size-5" />
              )}
              <span>Create Batch</span>
            </button>
            <button
              type="button"
              className="w-full bg-white border border-outline hover:bg-slate-50 text-on-surface-variant/80 font-bold py-5 rounded-xl transition-all active:scale-[0.98]"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>

          <div className="px-4 text-center">
            <p className="text-[11px] text-on-surface-variant/60 leading-relaxed italic">
              Changes will be applied instantly to the student registration portal once created.
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
}
