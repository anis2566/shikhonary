"use client";

import React, { useState } from "react";
import { Loader2, Calendar, Star, CalendarDays } from "lucide-react";
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

export const dummyData = {
  id: "ay_123",
  name: "2024 - 2025",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  isCurrent: true,
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  isCurrent: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function EditAcademicYearForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: dummyData.name,
      startDate: dummyData.startDate,
      endDate: dummyData.endDate,
      isCurrent: dummyData.isCurrent,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Updated data:", data);
      setIsPending(false);
      router.back();
    }, 1000);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-surface-container-lowest rounded-xl shadow-[0_24px_48px_-12px_rgba(11,28,48,0.08)] overflow-hidden"
      >
        <div className="p-8 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
              <CalendarDays className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-on-background">Year Details</h3>
              <p className="text-xs text-on-surface-variant">
                Core information for the academic session
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Year Name Input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block text-xs font-bold text-on-surface tracking-wide uppercase">
                  Year Name
                </FormLabel>
                <FormControl>
                  <input
                    {...field}
                    placeholder="e.g., 2024 - 2025"
                    disabled={isPending}
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="block text-xs font-bold text-on-surface tracking-wide uppercase">
                    Start Date
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant size-[18px]" />
                      <input
                        type="date"
                        {...field}
                        disabled={isPending}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-primary/40 transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="block text-xs font-bold text-on-surface tracking-wide uppercase">
                    End Date
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant size-[18px]" />
                      <input
                        type="date"
                        {...field}
                        disabled={isPending}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-primary/40 transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status Toggle */}
          <FormField
            control={form.control}
            name="isCurrent"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <Star className="size-[20px] fill-emerald-600 text-emerald-600" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-on-surface">
                      Set as Current Year
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      This will become the default session across the institution
                    </p>
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

        {/* Action Bar */}
        <div className="p-8 bg-slate-50 flex items-center justify-end gap-4">
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
            style={{ backgroundImage: "linear-gradient(135deg, #006c49 0%, #10b981 100%)" }}
            className="px-8 py-2.5 text-white rounded-lg font-bold text-sm shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:bg-[rgba(16,185,129,0.9)] transition-all active:scale-95 flex items-center gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </Form>
  );
}
