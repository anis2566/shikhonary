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
  Calendar as CalendarIcon,
  Star,
  CalendarDays,
  Activity,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { AcademicYear, academicYearSchema } from "@workspace/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";
import { useCreateAcademicYear } from "@workspace/api-client";

import { toast } from "sonner";

export const NewAcademicYearForm = () => {
  const router = useRouter();

  const { mutateAsync: createAcademicYear, isPending } =
    useCreateAcademicYear();

  const form = useForm<AcademicYear>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
      isCurrent: false,
    },
  });

  async function onSubmit(values: AcademicYear) {
    try {
      await createAcademicYear(values);
      router.push("/academic-years");
    } catch (error: unknown) {
      toast.error("Failed to create academic year");
      console.error(error);
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden border-none animate-fade-in transition-all duration-500">
      <div className="p-8 border-b border-surface-container/50 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 shadow-sm border border-emerald-100/50">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-on-background tracking-tight">
              Year Details
            </h3>
            <p className="text-xs text-on-surface-variant font-medium">
              Core information for the academic session
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                  Year Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 2024 - 2025"
                    className="h-12 bg-surface-container-low border-none rounded-lg px-4 py-3.5 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all placeholder:text-on-surface-variant/40 text-base"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                    Start Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"ghost"}
                          className={cn(
                            "w-full h-12 bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-left font-normal hover:bg-surface-container-low/80 transition-all focus-visible:ring-2 focus-visible:ring-primary/40",
                            !field.value && "text-on-surface-variant/40",
                          )}
                          disabled={isPending}
                        >
                          {field.value instanceof Date ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ms-auto text-on-surface-variant/60 w-5 h-5" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value instanceof Date ? field.value : undefined
                        }
                        onSelect={field.onChange}
                        captionLayout="dropdown"
                        startMonth={new Date(new Date().getFullYear() - 10, 0)}
                        endMonth={new Date(new Date().getFullYear() + 10, 11)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[11px] font-bold text-on-surface tracking-widest uppercase">
                    End Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"ghost"}
                          className={cn(
                            "w-full h-12 bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-left font-normal hover:bg-surface-container-low/80 transition-all focus-visible:ring-2 focus-visible:ring-primary/40",
                            !field.value && "text-on-surface-variant/40",
                          )}
                          disabled={isPending}
                        >
                          {field.value instanceof Date ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ms-auto text-on-surface-variant/60 w-5 h-5" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value instanceof Date ? field.value : undefined
                        }
                        onSelect={field.onChange}
                        captionLayout="dropdown"
                        startMonth={new Date(new Date().getFullYear() - 10, 0)}
                        endMonth={new Date(new Date().getFullYear() + 10, 11)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-5 bg-surface-container-low rounded-xl border border-primary/5 shadow-sm transition-all hover:bg-surface-container-low/80 group/toggle">
                  <div className="flex items-center gap-4">
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
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-bold text-on-surface leading-none group-hover/toggle:text-primary transition-colors cursor-pointer">
                        Active Status
                      </FormLabel>
                      <FormDescription className="text-xs text-on-surface-variant font-medium">
                        Enable or disable this academic year
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

            <FormField
              control={form.control}
              name="isCurrent"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-5 bg-surface-container-low rounded-xl border border-primary/5 shadow-sm transition-all hover:bg-surface-container-low/80 group/toggle">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                        field.value
                          ? "bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-50"
                          : "bg-slate-100 text-slate-400 border border-slate-200/50",
                      )}
                    >
                      <Star
                        className={cn(
                          "w-5 h-5 transition-all",
                          field.value && "fill-emerald-500 scale-110",
                        )}
                      />
                    </div>
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-bold text-on-surface leading-none group-hover/toggle:text-primary transition-colors cursor-pointer">
                        Set as Current Year
                      </FormLabel>
                      <FormDescription className="text-xs text-on-surface-variant font-medium">
                        Institution&apos;s default session
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

          <div className="pt-4 flex items-center justify-end gap-3 -mx-8 -mb-8 p-8 bg-slate-50/50 border-t border-surface-container/50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="px-6 h-11 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all active:scale-95"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 h-11 gradient-signature text-white rounded-lg font-bold text-sm shadow-glow hover:shadow-glow/80 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2 border-none"
              disabled={isPending}
            >
              Create Year
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
