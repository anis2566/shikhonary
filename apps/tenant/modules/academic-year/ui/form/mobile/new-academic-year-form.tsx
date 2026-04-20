"use client";

import {
  useForm,
  zodResolver,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { AcademicYear, academicYearSchema } from "@workspace/schema";
import { useCreateAcademicYear } from "@workspace/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  Star,
  Info,
  Lock,
  History,
  Plus,
  Activity,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Switch } from "@workspace/ui/components/switch";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";

export const MobileNewAcademicYearForm = () => {
  const router = useRouter();
  const { mutateAsync: createAcademicYear, isPending } =
    useCreateAcademicYear();

  const form = useForm<AcademicYear>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
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
    <div className="bg-background text-on-surface min-h-screen flex flex-col mx-4">
      {/* TopAppBar */}
      <header className="bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg docked full-width top-0 sticky z-50 shadow-[0_4px_24px_-4px_rgba(11,28,48,0.06)] flex items-center justify-between px-6 py-4 w-full">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center text-emerald-800 dark:text-emerald-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display font-bold tracking-tight text-lg text-emerald-800 dark:text-emerald-400">
            Create Academic Year
          </h1>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow p-6 space-y-8 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Year Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Year Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        {...field}
                        className="w-full h-14 px-4 bg-surface-container-low rounded-xl border-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all text-on-surface placeholder:text-outline/50 font-medium"
                        placeholder="e.g. 2024-2025"
                        disabled={isPending}
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-outline/30">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Selection Grid */}
            <div className="grid grid-cols-1 gap-6">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Start Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full h-14 px-4 bg-surface-container-low rounded-xl border-none justify-start text-left font-medium hover:bg-surface-container-low/80 transition-all focus:ring-2 focus:ring-primary/40",
                              !field.value && "text-outline/50",
                            )}
                            disabled={isPending}
                          >
                            {field.value instanceof Date ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ms-auto h-5 w-5 text-outline/30" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value instanceof Date
                              ? field.value
                              : undefined
                          }
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          startMonth={
                            new Date(new Date().getFullYear() - 10, 0)
                          }
                          endMonth={new Date(new Date().getFullYear() + 10, 11)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full h-14 px-4 bg-surface-container-low rounded-xl border-none justify-start text-left font-medium hover:bg-surface-container-low/80 transition-all focus:ring-2 focus:ring-primary/40",
                              !field.value && "text-outline/50",
                            )}
                            disabled={isPending}
                          >
                            {field.value instanceof Date ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ms-auto h-5 w-5 text-outline/30" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value instanceof Date
                              ? field.value
                              : undefined
                          }
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          startMonth={
                            new Date(new Date().getFullYear() - 10, 0)
                          }
                          endMonth={new Date(new Date().getFullYear() + 10, 11)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              {/* Active Toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10 !space-y-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                        <Activity
                          className={cn(
                            "w-5 h-5",
                            field.value && "stroke-[2.5px]",
                          )}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface leading-none">
                          Active Status
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          Enable this academic year
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

              {/* Current Toggle */}
              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <FormItem className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10 !space-y-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                        <Star
                          className={cn(
                            "w-5 h-5",
                            field.value && "fill-primary",
                          )}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface leading-none">
                          Set as Current Year
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          Make this the default active year
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
          </form>
        </Form>
      </main>

      {/* Bottom Action Bar */}
      <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-2 flex flex-col gap-1 z-50 shadow-[0_-8px_32px_rgba(11,28,48,0.08)]">
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
          className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 border-none hover:bg-primary/90"
        >
          <Plus className="w-5 h-5" />
          Create Year
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
          className="w-full h-10 bg-transparent text-on-surface-variant font-semibold rounded-xl flex items-center justify-center active:scale-[0.98] transition-all"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
