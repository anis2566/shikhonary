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
  ArrowLeft,
  Activity,
  Users,
  School,
  Calendar,
  Plus,
  CheckCircle2,
  Info,
  Rocket,
  UserPlus,
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
  useCreateBatch,
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
} from "@workspace/api-client";
import { useEffect } from "react";
import { toast } from "sonner";

export const MobileNewBatchForm = () => {
  const router = useRouter();

  const { mutateAsync: createBatch, isPending } = useCreateBatch();
  const { data: academicClasses } = useAcademicClassesForSelection();
  const { data: academicYears } = useAcademicYearsForSelection();

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      name: "",
      academicClassId: "",
      academicYearId: "",
      academicYear: "",
      capacity: 30,
      isActive: true,
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
      await createBatch(values);
      toast.success("Batch created successfully");
      router.push("/batches");
    } catch (error: unknown) {
      toast.error("Failed to create batch");
      console.error(error);
    }
  }

  const selectedClassName = academicClasses?.find(
    (c) => c.id === watchAll.academicClassId,
  )?.displayName;

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32 flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex items-center px-4 h-16 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg shadow-sm dark:shadow-none tonal-shift border-b border-outline-variant/10">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors active:scale-95 duration-150 text-emerald-700 dark:text-emerald-400"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="ml-4 font-inter tracking-tight font-bold text-lg text-emerald-700 dark:text-emerald-400">
          Create Batch
        </h1>
      </header>

      <main className="mt-20 px-4 max-w-md mx-auto space-y-8 flex-grow">
        <Form {...form}>
          <form className="space-y-8">
            {/* Basic Information Section */}
            <section className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                  Basic Information
                </h2>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-6 shadow-sm border border-outline-variant/10">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[11px] font-bold text-outline uppercase tracking-widest px-1">
                        Batch Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full h-14 bg-surface-container-low border-none rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 text-on-surface placeholder:text-outline/60 font-medium"
                          placeholder="e.g. Morning Physics A"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="academicClassId"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[11px] font-bold text-outline uppercase tracking-widest px-1">
                          Class
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-14 bg-surface-container-low border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/40 text-on-surface">
                              <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {academicClasses?.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicYearId"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[11px] font-bold text-outline uppercase tracking-widest px-1">
                          Year
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-14 bg-surface-container-low border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/40 text-on-surface">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {academicYears?.map((year) => (
                              <SelectItem key={year.id} value={year.id}>
                                {year.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Capacity & Constraints Section */}
            <section className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                  Capacity & Status
                </h2>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-6 shadow-sm border border-outline-variant/10">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[11px] font-bold text-outline uppercase tracking-widest px-1">
                        Maximum Capacity
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center bg-surface-container-low rounded-xl group transition-all focus-within:ring-2 focus-within:ring-primary/40">
                          <Users className="text-outline/40 px-4 w-12 h-5" />
                          <Input
                            {...field}
                            type="number"
                            className="w-full h-14 bg-transparent border-none p-4 focus-visible:ring-0 text-on-surface font-medium"
                            placeholder="40"
                            disabled={isPending}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between py-2 !space-y-0">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-on-surface">
                          Immediate Activation
                        </p>
                        <p className="text-xs text-on-surface-variant font-medium">
                          Mark as active upon creation
                        </p>
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

            {/* Real-Time Preview Card */}
            <section className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-1 h-6 bg-emerald-200 rounded-full"></span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                  Real-Time Preview
                </h2>
              </div>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 p-6 text-white shadow-xl shadow-emerald-500/10 border border-emerald-400/20">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-50/80">
                        New Batch Preview
                      </p>
                      <h3 className="text-2xl font-extrabold tracking-tight mt-1">
                        {watchAll.name || "Untitled Creation"}
                      </h3>
                    </div>
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Draft
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-50/60 mb-1">
                        Target Class
                      </p>
                      <p className="font-bold text-sm">
                        {selectedClassName || "Not selected"}
                      </p>
                    </div>
                    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-50/60 mb-1">
                        Year
                      </p>
                      <p className="font-bold text-sm">
                        {watchAll.academicYear || "Not selected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-xs bg-emerald-900/20 w-fit px-3 py-1.5 rounded-full border border-white/5">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="font-bold uppercase tracking-wider">
                      Capacity: {watchAll.capacity} Students
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </form>
        </Form>
      </main>

      {/* Fixed Actions */}
      <footer className="w-full p-4 pb-8 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-t border-outline-variant/10 z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            disabled={isPending}
            className="flex-1 h-12 text-sm font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest rounded-2xl active:scale-95 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
            className="flex-[2] h-12 text-sm font-bold text-on-primary bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 border-none"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-white">Create Batch</span>
                <Rocket className="w-4 h-4 text-white" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
};
