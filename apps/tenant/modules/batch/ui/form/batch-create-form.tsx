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

  const capacity = values.maxCapacity ? parseInt(values.maxCapacity, 10) : null;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_24px_48px_-12px_rgba(11,28,48,0.08)] overflow-hidden">
      {/* Card Header */}
      <div className="p-5 border-b border-surface-container flex items-center gap-3">
        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
          <Eye className="size-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-on-background">
            Real-Time Preview
          </h3>
          <p className="text-[11px] text-on-surface-variant">
            Updates as you type
          </p>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-5">
        <div
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
          }}
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 size-24 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 size-16 rounded-full bg-white/5 translate-y-6 -translate-x-6" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-lg bg-white/15 flex items-center justify-center">
                <Layers className="size-5 text-white" />
              </div>
              {values.isActive && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  Active
                </span>
              )}
            </div>

            <h4 className="text-white font-bold text-lg leading-tight mb-1">
              {values.name?.trim() || "New Batch Entity"}
            </h4>

            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 text-emerald-200 text-xs">
                <GraduationCap className="size-3.5 flex-shrink-0" />
                <span>{selectedClass?.name || "Assigned Class"}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200 text-xs">
                <CalendarDays className="size-3.5 flex-shrink-0" />
                <span>{selectedYear?.name || "Academic Period"}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200 text-xs">
                <Users className="size-3.5 flex-shrink-0" />
                <span>
                  0 / {capacity ? `${capacity} Students` : "Unlimited"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-on-surface-variant mt-4 leading-relaxed">
          Changes will be applied instantly to the student registration portal
          once created.
        </p>
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
      <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-bold text-on-background">{title}</h3>
        <p className="text-xs text-on-surface-variant">{subtitle}</p>
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
  "w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40 text-on-surface text-sm";

const tonalSelectCls =
  "w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-primary/40 transition-all text-on-surface text-sm appearance-none cursor-pointer";

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
              icon={Hash}
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
                      <input
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
                        <div className="relative">
                          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant size-[18px] pointer-events-none" />
                          <select
                            {...field}
                            disabled={isPending}
                            className={`${tonalSelectCls} pl-11`}
                          >
                            <option value="">Select a class</option>
                            {dummyData.classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
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
                        <div className="relative">
                          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant size-[18px] pointer-events-none" />
                          <select
                            {...field}
                            disabled={isPending}
                            className={`${tonalSelectCls} pl-11`}
                          >
                            <option value="">Select academic year</option>
                            {dummyData.academicYears.map((y) => (
                              <option key={y.id} value={y.id}>
                                {y.name}
                              </option>
                            ))}
                          </select>
                        </div>
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
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant size-[18px] pointer-events-none" />
                        <input
                          {...field}
                          type="number"
                          min="1"
                          placeholder="Leave blank for unlimited"
                          disabled={isPending}
                          className={`${tonalInputCls} pl-11`}
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

            {/* Action Bar */}
            <div className="p-6 md:p-8 bg-slate-50/70 border-t border-surface-container flex items-center justify-end gap-4">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-all active:scale-95"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #006c49 0%, #10b981 100%)",
                }}
                className="px-8 py-2.5 text-white rounded-lg font-bold text-sm shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60"
              >
                {isPending && <Loader2 className="size-4 animate-spin" />}
                <span>Create Batch</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column: Live Preview ── */}
        <div className="xl:sticky xl:top-8 xl:self-start">
          {/* Mobile Preview label */}
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 xl:hidden">
            Preview
          </p>
          <BatchPreviewCard values={watchedValues} />
        </div>
      </form>
    </Form>
  );
}
